-- Remove weekly digest email feature
-- ==================================

-- Drop the cron job
SELECT cron.unschedule('weekly-digest-email');

-- Remove email_digest from default notification_prefs
-- (keep sms_alerts and escalation_calls)
ALTER TABLE caregivers
  ALTER COLUMN notification_prefs SET DEFAULT '{
    "sms_alerts": true,
    "escalation_calls": true
  }'::JSONB;
