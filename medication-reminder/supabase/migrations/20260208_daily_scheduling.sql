-- Phase 1A: Daily Call Scheduling
-- ================================
-- Enables automatic daily generation of reminder calls based on medication schedules
-- and periodic polling to dispatch pending calls.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Add medication_ids array column to scheduled_reminder_calls for multi-med bundling (Phase 3B)
ALTER TABLE scheduled_reminder_calls
  ADD COLUMN IF NOT EXISTS medication_ids UUID[] DEFAULT '{}';

-- Backfill: set medication_ids from the single medication_id where empty
UPDATE scheduled_reminder_calls
SET medication_ids = ARRAY[medication_id]
WHERE medication_ids = '{}' AND medication_id IS NOT NULL;

-- ============================================================
-- Function: generate_daily_reminder_calls()
-- Scans active medications and creates scheduled calls for today
-- ============================================================
CREATE OR REPLACE FUNCTION generate_daily_reminder_calls()
RETURNS TABLE(patient_name TEXT, medication_count INT, scheduled_time TIMESTAMPTZ) AS $$
DECLARE
  rec RECORD;
  today_dow INT;
  call_time TIMESTAMPTZ;
  existing_count INT;
BEGIN
  -- Get current day of week (1=Mon, 7=Sun) matching our reminder_days convention
  -- ISODOW: Monday=1, Sunday=7
  today_dow := EXTRACT(ISODOW FROM NOW());

  FOR rec IN
    SELECT
      m.id AS medication_id,
      m.patient_id,
      m.name AS med_name,
      m.reminder_time,
      p.name AS p_name,
      p.timezone
    FROM medications m
    JOIN patients p ON p.id = m.patient_id
    WHERE m.is_active = true
      AND today_dow = ANY(m.reminder_days)
  LOOP
    -- Calculate the call time in UTC using the patient's timezone
    -- "today at reminder_time in patient's timezone" → UTC
    call_time := (
      (NOW() AT TIME ZONE rec.timezone)::DATE || ' ' || rec.reminder_time::TEXT
    )::TIMESTAMP AT TIME ZONE rec.timezone;

    -- Skip if a call already exists for this patient+medication today
    SELECT COUNT(*) INTO existing_count
    FROM scheduled_reminder_calls
    WHERE patient_id = rec.patient_id
      AND medication_id = rec.medication_id
      AND scheduled_for::DATE = call_time::DATE
      AND status IN ('pending', 'in_progress', 'completed');

    IF existing_count = 0 THEN
      INSERT INTO scheduled_reminder_calls (
        patient_id,
        medication_id,
        medication_ids,
        scheduled_for,
        attempt_number,
        status
      ) VALUES (
        rec.patient_id,
        rec.medication_id,
        ARRAY[rec.medication_id],
        call_time,
        1,
        'pending'
      );

      patient_name := rec.p_name;
      medication_count := 1;
      scheduled_time := call_time;
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Cron Job 1: Generate daily calls at 5:00 AM UTC
-- Scans all active medications and creates today's scheduled calls
-- ============================================================
SELECT cron.schedule(
  'generate-daily-reminder-calls',
  '0 5 * * *',
  $$SELECT * FROM generate_daily_reminder_calls()$$
);

-- ============================================================
-- Cron Job 2: Poll for pending calls every minute
-- Calls the schedule-reminder edge function via pg_net
-- ============================================================
SELECT cron.schedule(
  'dispatch-pending-calls',
  '* * * * *',
  $$
  SELECT net.http_post(
    url := 'https://wxnwtdsfwtnbukttwgcu.supabase.co/functions/v1/schedule-reminder',
    headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4bnd0ZHNmd3RuYnVrdHR3Z2N1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUyNjc2MiwiZXhwIjoyMDg0MTAyNzYyfQ.5lKGRbAlNaYzsAMy7u2RAb7n2Km6yosLEgnWz201HE8", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
