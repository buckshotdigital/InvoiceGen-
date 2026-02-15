import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;

function verifyServiceAuth(req: Request): boolean {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return token === serviceRoleKey;
}

serve(async (req) => {
  if (!verifyServiceAuth(req)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { call_log_id } = await req.json();

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!call_log_id || !uuidRegex.test(call_log_id)) {
      return new Response(
        JSON.stringify({ error: 'Valid call_log_id required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[post-call-summary] Processing call');

    // Fetch the call log with transcript
    const { data: callLog, error: fetchError } = await supabase
      .from('reminder_call_logs')
      .select('*, patients(name), medications(name, dosage)')
      .eq('id', call_log_id)
      .single();

    if (fetchError || !callLog) {
      console.error('[post-call-summary] Call log not found:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Call log not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const transcript = callLog.patient_response;
    if (!transcript || transcript.trim().length === 0) {
      console.log('[post-call-summary] No transcript available');
      return new Response(
        JSON.stringify({ skipped: true, reason: 'No transcript' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call Claude Haiku for structured summary
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: `Analyze this medication reminder phone call transcript between an AI assistant and a patient named ${callLog.patients?.name || 'unknown'}. The medication is ${callLog.medications?.name || 'unknown'} (${callLog.medications?.dosage || 'unknown dosage'}).

Transcript:
${transcript}

Respond in JSON format only:
{
  "summary": "1-2 sentence summary of the call outcome",
  "sentiment": "positive|neutral|negative|concerned",
  "key_facts": ["array of notable facts mentioned by patient, e.g. side effects, feelings, timing"]
}

Only include key_facts that would be useful context for future calls. If nothing notable, use an empty array.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[post-call-summary] Claude API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Claude API error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const claudeResult = await response.json();
    const content = claudeResult.content?.[0]?.text || '';

    // Parse Claude's JSON response
    let summary = { summary: '', sentiment: 'neutral', key_facts: [] as string[] };
    try {
      // Extract JSON from response (handle potential markdown wrapping)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        summary = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('[post-call-summary] Failed to parse Claude response:', content);
      summary = {
        summary: content.substring(0, 200),
        sentiment: 'neutral',
        key_facts: [],
      };
    }

    console.log('[post-call-summary] Summary:', summary);

    // Insert conversation summary
    const { data: inserted, error: insertError } = await supabase
      .from('conversation_summaries')
      .insert({
        patient_id: callLog.patient_id,
        call_log_id: call_log_id,
        summary: summary.summary,
        sentiment: summary.sentiment,
        key_facts: summary.key_facts,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[post-call-summary] Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, summary_id: inserted.id, summary }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[post-call-summary] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
