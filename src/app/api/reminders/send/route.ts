import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { sendReminderEmail } from '@/lib/email/resend-client';
import { generateEmailTemplate, determineReminderType, ReminderType } from '@/lib/email/templates';
import { transformSupabaseInvoice } from '@/lib/utils/transform';
import { getUserReminderQuota } from '@/lib/api/reminders';

export const runtime = 'nodejs';

interface SendReminderRequest {
  invoiceId: string;
  reminderType?: ReminderType;
  customSubject?: string;
  customMessage?: string;
}

/**
 * POST /api/reminders/send
 * Send a payment reminder email for an invoice
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const accessToken = authHeader.replace('Bearer ', '');

    // Verify user with Supabase using the token
    const supabase = createServerSupabaseClient(accessToken);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = user.id; // Use verified user ID from session, not from client

    const body: SendReminderRequest = await request.json();
    const { invoiceId, reminderType: customReminderType, customSubject, customMessage } = body;

    console.log('📧 Reminder request received:', { invoiceId, customReminderType, userId });

    // Use admin client to fetch invoice data
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Admin client not configured' }, { status: 500 });
    }

    if (!invoiceId) {
      return NextResponse.json({ error: 'invoiceId is required' }, { status: 400 });
    }

    // Fetch invoice using admin client and verify it belongs to the user
    console.log('🔍 Fetching invoice:', invoiceId);
    const { data: invoiceData, error: invoiceError } = await supabaseAdmin
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', userId)
      .single();

    if (invoiceError) {
      console.error('❌ Invoice fetch error:', invoiceError);
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (!invoiceData) {
      console.error('❌ Invoice data is null');
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoice = transformSupabaseInvoice(invoiceData);
    console.log('✅ Invoice found:', invoice.invoiceNumber);

    // Check premium status and reminder quota
    console.log('🔍 Checking reminder quota...');
    const quota = await getUserReminderQuota(userId);
    console.log('📊 Quota status:', {
      isPremium: quota.isPremium,
      remindersUsed: quota.remindersUsedThisMonth,
      remaining: quota.remainingReminders,
      canSend: quota.canSendReminder,
    });

    if (!quota.canSendReminder) {
      console.error('❌ Free tier limit exceeded');
      return NextResponse.json(
        {
          error: 'You have reached your monthly reminder limit (3 per month). Upgrade to Premium for unlimited reminders.',
          code: 'LIMIT_EXCEEDED',
          remindersUsed: quota.remindersUsedThisMonth,
          limit: 3,
        },
        { status: 429 }
      );
    }

    // Fetch user settings
    const { data: settingsData } = await supabaseAdmin
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    const isPremiumUser = settingsData?.is_premium || false;

    console.log('✅ Settings fetched:', {
      businessName: settingsData?.default_from_name,
      customSenderEmail: settingsData?.custom_sender_email,
      isPremium: isPremiumUser
    });

    // Use invoice's from info first (what client sees on invoice), then settings, then generic fallback
    const businessName = invoice.fromName || settingsData?.default_from_name || 'Your Business';
    const businessEmail = invoice.fromEmail || settingsData?.default_from_email || 'noreply@invoicegen.app';
    // Only use custom sender email if user is premium
    const customSenderEmail = isPremiumUser ? settingsData?.custom_sender_email : undefined;

    // Determine reminder type if not provided
    const reminderType = customReminderType || determineReminderType(invoice, businessName);

    if (!reminderType) {
      return NextResponse.json({ error: 'Invoice is already paid or not yet due' }, { status: 400 });
    }

    // Generate email template
    let emailTemplate = generateEmailTemplate(invoice, reminderType, businessName, businessEmail, customMessage);

    // Apply custom subject if provided
    if (customSubject) {
      emailTemplate.subject = customSubject;
    }

    console.log('📝 Email template generated:', {
      reminderType,
      toEmail: invoice.toEmail,
      subject: emailTemplate.subject,
      fromEmail: customSenderEmail || businessEmail,
      usingCustomDomain: !!customSenderEmail
    });

    // Send email via Resend
    // If user has custom domain: send FROM their verified email directly
    // Otherwise: send FROM our verified domain with REPLY-TO set to user's email
    console.log('🚀 Sending email via Resend...');
    const sendResult = await sendReminderEmail(
      invoice.toEmail,
      invoice.toName,
      emailTemplate.subject,
      emailTemplate.html,
      businessEmail,      // Reply-to: user's business email (only used if no custom domain)
      businessName,       // From name: user's business name
      customSenderEmail   // Custom from email if user has their own verified Resend domain
    );

    console.log('📨 Resend response:', sendResult);

    if (!sendResult.success) {
      console.error('❌ Email send failed:', sendResult.error);
      return NextResponse.json(
        { error: `Failed to send email: ${sendResult.error}` },
        { status: 500 }
      );
    }

    console.log('✅ Email sent successfully:', sendResult.messageId);

    // Log reminder in database and update invoice (if admin client is available)
    if (supabaseAdmin) {
      const now = new Date().toISOString();
      const daysOverdue = Math.floor(
        (new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Log to reminder_logs table
      const { error: logError } = await supabaseAdmin.from('reminder_logs').insert({
        invoice_id: invoiceId,
        user_id: userId,
        sent_at: now,
        reminder_type: reminderType,
        days_overdue: Math.max(0, daysOverdue),
        to_email: invoice.toEmail,
        subject: emailTemplate.subject,
        body: emailTemplate.html,
        status: 'sent',
      });

      if (logError) {
        console.error('❌ Failed to log reminder:', logError);
      }

      // Update invoice with last reminder timestamp
      const { error: updateError } = await supabaseAdmin
        .from('invoices')
        .update({
          last_reminder_sent: now,
          reminder_count: (invoice.reminderCount || invoice.reminder_count || 0) + 1,
        })
        .eq('id', invoiceId);

      if (updateError) {
        console.error('❌ Failed to update invoice reminder timestamp:', updateError);
      } else {
        console.log('✅ Invoice reminder timestamp updated:', { invoiceId, last_reminder_sent: now });
      }
    } else {
      console.warn('⚠️ supabaseAdmin not available - cannot update reminder timestamp');
    }

    // Get updated quota after sending reminder
    const updatedQuota = await getUserReminderQuota(userId);

    return NextResponse.json(
      {
        success: true,
        message: `Reminder sent to ${invoice.toEmail}`,
        messageId: sendResult.messageId,
        reminderType,
        quota: {
          isPremium: updatedQuota.isPremium,
          remindersUsedThisMonth: updatedQuota.remindersUsedThisMonth,
          remainingReminders: updatedQuota.remainingReminders,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error sending reminder:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error details:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
