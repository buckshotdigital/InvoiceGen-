# Medication Reminder System

A voice-based medication reminder system for elderly patients using Twilio and ElevenLabs Conversational AI.

## Overview

This system makes automated phone calls to remind elderly patients to take their medications. It features:

- **Natural voice conversations** powered by ElevenLabs
- **Conversational confirmation** - patients verbally confirm they took their meds
- **Smart retries** - automatic callbacks if no answer
- **Caregiver alerts** - SMS notifications for missed doses or concerns
- **Emergency detection** - escalates if patient reports distress

## Architecture

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Twilio    │◄───►│  Supabase Edge  │◄───►│   ElevenLabs    │
│  (Phone)    │     │   Functions     │     │  Conversational │
└─────────────┘     └────────┬────────┘     └─────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Supabase     │
                    │   PostgreSQL    │
                    └─────────────────┘
```

## Setup

### 1. Create Supabase Project

If you don't have one, create a new Supabase project at https://supabase.com

### 2. Link This Project

```bash
cd medication-reminder
npx supabase link --project-ref YOUR_PROJECT_REF
```

### 3. Run Database Migrations

```bash
npx supabase db push
```

### 4. Set Environment Variables

In Supabase Dashboard → Settings → Edge Functions → Secrets, add:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_AGENT_ID`

### 5. Create ElevenLabs Agent

1. Go to https://elevenlabs.io/conversational-ai
2. Create a new agent
3. Import the configuration from `elevenlabs-agent-config.json`
4. Copy the Agent ID

### 6. Deploy Functions

```bash
npx supabase functions deploy setup-patient --no-verify-jwt
npx supabase functions deploy twilio-webhook --no-verify-jwt
npx supabase functions deploy twilio-media-stream --no-verify-jwt
npx supabase functions deploy schedule-reminder --no-verify-jwt
npx supabase functions deploy medication-tools --no-verify-jwt
```

### 7. Set Up Cron Job (Optional)

For automatic scheduling, set up a cron job to call the `schedule-reminder` function every minute:

```sql
SELECT cron.schedule(
  'medication-reminder-scheduler',
  '* * * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/schedule-reminder',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_KEY"}'::jsonb
  );
  $$
);
```

## Usage

### Add a Patient

```bash
curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/setup-patient" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_name": "Margaret",
    "patient_phone": "+16475551234",
    "caregiver_name": "Sarah",
    "caregiver_phone": "+16475555678",
    "medication_name": "Lisinopril",
    "medication_description": "small white blood pressure pill",
    "reminder_time": "09:00"
  }'
```

### Manually Trigger Reminders

```bash
curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/schedule-reminder" \
  -H "Authorization: Bearer YOUR_SERVICE_KEY"
```

## Testing

### Test Basic Call (No AI)

```bash
curl -X POST "https://api.twilio.com/2010-04-01/Accounts/YOUR_SID/Calls.json" \
  -u "YOUR_SID:YOUR_AUTH_TOKEN" \
  -d "To=+1VERIFIED_PHONE" \
  -d "From=+1YOUR_TWILIO_NUMBER" \
  -d "Url=https://YOUR_PROJECT.supabase.co/functions/v1/twilio-test"
```

## Conversation Flow

1. **System calls patient** at scheduled time
2. **Verifies identity**: "Hello! Am I speaking with Margaret?"
3. **Asks about medication**: "Have you taken your Lisinopril today?"
4. **Handles response**:
   - ✅ "Yes" → Logs as taken, says goodbye
   - ⏰ "Not yet" → Offers callback, schedules if requested
   - ❌ "I don't want to" → Asks why, alerts caregiver
   - 🚨 "I feel sick" → Assesses symptoms, triggers emergency if needed
5. **Closes call** politely

## Database Schema

- `patients` - Elderly users receiving reminders
- `caregivers` - Family members who monitor
- `patient_caregivers` - Links patients to their caregivers
- `medications` - Medication schedules
- `reminder_call_logs` - Record of all calls
- `scheduled_reminder_calls` - Queue of pending calls

## Limitations (Trial Account)

- Can only call verified phone numbers
- Plays "trial account" message before calls
- Limited to one Twilio phone number

Upgrade Twilio ($20 minimum) to remove these restrictions.
