import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowed = Deno.env.get('ALLOWED_ORIGIN') || '';
  const allowedOrigins = allowed ? allowed.split(',').map(o => o.trim()) : [];
  const isAllowed = allowedOrigins.includes(origin);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0] || '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin',
  };
}

serve(async (req) => {
  const cors = getCorsHeaders(req);

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  // Create service-role client for DB operations
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    // Verify JWT — caregiver must be logged in
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { headers: { ...cors, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Create a user-scoped client to verify the JWT
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: { user }, error: authError } = await userClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired token' }),
        { headers: { ...cors, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const authUserId = user.id;

    const {
      patient_name,
      patient_phone,
      caregiver_name,
      caregiver_phone,
      caregiver_email,
      medication_name,
      medication_description,
      medication_dosage,
      reminder_time,  // "09:00" format
      reminder_days,  // [1,2,3,4,5,6,7] format
      timezone = 'America/Toronto',
    } = await req.json();

    console.log('[setup-patient] Setting up patient for user:', authUserId);

    // Validate required fields
    if (!patient_name || !patient_phone || !medication_name || !reminder_time) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: patient_name, patient_phone, medication_name, reminder_time',
        }),
        { headers: { ...cors, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate phone number format (E.164)
    if (!/^\+[1-9]\d{1,14}$/.test(patient_phone)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Phone number must be in E.164 format (e.g. +1234567890)' }),
        { headers: { ...cors, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate reminder_time format (HH:MM)
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(reminder_time)) {
      return new Response(
        JSON.stringify({ success: false, error: 'reminder_time must be in HH:MM format (e.g. 09:00)' }),
        { headers: { ...cors, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate reminder_days if provided
    if (reminder_days && (!Array.isArray(reminder_days) || !reminder_days.every((d: number) => d >= 1 && d <= 7))) {
      return new Response(
        JSON.stringify({ success: false, error: 'reminder_days must be an array of integers 1-7' }),
        { headers: { ...cors, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate patient_name length
    if (patient_name.length > 200) {
      return new Response(
        JSON.stringify({ success: false, error: 'Patient name too long (max 200 characters)' }),
        { headers: { ...cors, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get or create caregiver linked to auth user
    let caregiver;
    const { data: existingCaregiver } = await supabase
      .from('caregivers')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();

    if (existingCaregiver) {
      caregiver = existingCaregiver;
      console.log('[setup-patient] Using existing caregiver:', caregiver.id);
    } else {
      const { data: newCaregiver, error: caregiverError } = await supabase
        .from('caregivers')
        .insert({
          name: caregiver_name || user.email?.split('@')[0] || 'Caregiver',
          phone_number: caregiver_phone || '',
          email: caregiver_email || user.email || null,
          auth_user_id: authUserId,
        })
        .select()
        .single();

      if (caregiverError) throw caregiverError;
      caregiver = newCaregiver;
      console.log('[setup-patient] Created caregiver:', caregiver.id);
    }

    // Create patient (or get existing)
    let patient;
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('*')
      .eq('phone_number', patient_phone)
      .single();

    if (existingPatient) {
      patient = existingPatient;
      console.log('[setup-patient] Using existing patient:', patient.id);
    } else {
      const { data: newPatient, error: patientError } = await supabase
        .from('patients')
        .insert({ name: patient_name, phone_number: patient_phone, timezone })
        .select()
        .single();

      if (patientError) throw patientError;
      patient = newPatient;
      console.log('[setup-patient] Created patient:', patient.id);
    }

    // Link patient and caregiver
    const { error: linkError } = await supabase
      .from('patient_caregivers')
      .upsert({
        patient_id: patient.id,
        caregiver_id: caregiver.id,
        is_primary: true,
      });

    if (linkError && !linkError.message.includes('duplicate')) {
      throw linkError;
    }

    // Create medication
    const { data: medication, error: medError } = await supabase
      .from('medications')
      .insert({
        patient_id: patient.id,
        name: medication_name,
        description: medication_description || null,
        dosage: medication_dosage || null,
        reminder_time: reminder_time,
        reminder_days: reminder_days || [1, 2, 3, 4, 5, 6, 7],
      })
      .select()
      .single();

    if (medError) throw medError;
    console.log('[setup-patient] Created medication:', medication.id);

    // Schedule first call
    const now = new Date();
    const [hours, minutes] = reminder_time.split(':').map(Number);

    const firstCall = new Date();
    firstCall.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (firstCall <= now) {
      firstCall.setDate(firstCall.getDate() + 1);
    }

    const { data: scheduledCall, error: scheduleError } = await supabase
      .from('scheduled_reminder_calls')
      .insert({
        patient_id: patient.id,
        medication_id: medication.id,
        medication_ids: [medication.id],
        scheduled_for: firstCall.toISOString(),
        attempt_number: 1,
      })
      .select()
      .single();

    if (scheduleError) throw scheduleError;
    console.log('[setup-patient] Scheduled first call:', scheduledCall.id);

    return new Response(
      JSON.stringify({
        success: true,
        patient_id: patient.id,
        caregiver_id: caregiver.id,
        medication_id: medication.id,
        first_call_scheduled: firstCall.toISOString(),
        message: `Setup complete! First reminder call scheduled for ${firstCall.toLocaleString()}`,
      }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[setup-patient] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...cors, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
