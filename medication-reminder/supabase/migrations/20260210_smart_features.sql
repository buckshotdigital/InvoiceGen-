-- Phase 3: Smart Features
-- =======================

-- Conversation summaries (AI-generated after each call)
CREATE TABLE IF NOT EXISTS conversation_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  call_log_id UUID REFERENCES reminder_call_logs(id) ON DELETE SET NULL,
  summary TEXT NOT NULL,
  sentiment TEXT DEFAULT 'neutral',  -- positive, neutral, negative, concerned
  key_facts JSONB DEFAULT '[]'::JSONB,  -- ["mentioned dizziness", "took med late"]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conv_summaries_patient
  ON conversation_summaries(patient_id, created_at DESC);

-- Escalation events
CREATE TABLE IF NOT EXISTS escalation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  type TEXT NOT NULL,       -- 'missed_dose', 'unreachable', 'emergency', 'side_effect'
  level INTEGER DEFAULT 1,  -- 1=SMS primary, 2=SMS all, 3=SMS+call, 4=emergency
  details TEXT,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_escalation_events_patient
  ON escalation_events(patient_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_escalation_events_unresolved
  ON escalation_events(resolved, created_at DESC)
  WHERE resolved = false;

-- SMS reminders (fallback when calls fail)
CREATE TABLE IF NOT EXISTS sms_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  medication_id UUID REFERENCES medications(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'sent',  -- sent, delivered, replied, failed
  twilio_sid TEXT,
  patient_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_reminders_patient
  ON sms_reminders(patient_id, created_at DESC);

-- Add notification preferences to caregivers
ALTER TABLE caregivers
  ADD COLUMN IF NOT EXISTS notification_prefs JSONB DEFAULT '{
    "sms_alerts": true,
    "email_digest": true,
    "escalation_calls": true
  }'::JSONB;

-- ============================================================
-- RLS policies for new tables
-- ============================================================
ALTER TABLE conversation_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Caregivers see linked patient summaries"
  ON conversation_summaries FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM patient_caregivers
      WHERE caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Caregivers see linked patient escalations"
  ON escalation_events FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM patient_caregivers
      WHERE caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Caregivers can resolve escalations"
  ON escalation_events FOR UPDATE
  USING (
    patient_id IN (
      SELECT patient_id FROM patient_caregivers
      WHERE caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Caregivers see linked patient SMS"
  ON sms_reminders FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM patient_caregivers
      WHERE caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
    )
  );

-- ============================================================
-- Function: get_consecutive_misses(patient_uuid)
-- Returns count of consecutive missed doses (medication_taken=false)
-- ============================================================
CREATE OR REPLACE FUNCTION get_consecutive_misses(p_patient_id UUID)
RETURNS INTEGER AS $$
DECLARE
  miss_count INTEGER := 0;
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT medication_taken
    FROM reminder_call_logs
    WHERE patient_id = p_patient_id
      AND medication_taken IS NOT NULL
    ORDER BY created_at DESC
    LIMIT 10
  LOOP
    IF rec.medication_taken = false THEN
      miss_count := miss_count + 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;

  RETURN miss_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Multi-medication bundling: update generate_daily_reminder_calls()
-- Groups medications by patient + 30-minute time window into single calls
-- ============================================================
CREATE OR REPLACE FUNCTION generate_daily_reminder_calls()
RETURNS TABLE(patient_name TEXT, medication_count INT, scheduled_time TIMESTAMPTZ) AS $$
DECLARE
  rec RECORD;
  today_dow INT;
  call_time TIMESTAMPTZ;
  existing_count INT;
  bundle_id UUID;
  bundle_time TIMESTAMPTZ;
BEGIN
  today_dow := EXTRACT(ISODOW FROM NOW());

  -- Use a temp table to group meds by patient + 30-min window
  CREATE TEMP TABLE IF NOT EXISTS _daily_meds (
    patient_id UUID,
    p_name TEXT,
    timezone TEXT,
    medication_id UUID,
    call_time TIMESTAMPTZ
  ) ON COMMIT DROP;

  DELETE FROM _daily_meds;

  -- Collect all eligible medications for today
  FOR rec IN
    SELECT
      m.id AS medication_id,
      m.patient_id,
      m.reminder_time,
      p.name AS p_name,
      p.timezone
    FROM medications m
    JOIN patients p ON p.id = m.patient_id
    WHERE m.is_active = true
      AND today_dow = ANY(m.reminder_days)
  LOOP
    call_time := (
      (NOW() AT TIME ZONE rec.timezone)::DATE || ' ' || rec.reminder_time::TEXT
    )::TIMESTAMP AT TIME ZONE rec.timezone;

    -- Skip if a call already exists for this patient+medication today
    SELECT COUNT(*) INTO existing_count
    FROM scheduled_reminder_calls
    WHERE patient_id = rec.patient_id
      AND (medication_id = rec.medication_id OR rec.medication_id = ANY(medication_ids))
      AND scheduled_for::DATE = call_time::DATE
      AND status IN ('pending', 'in_progress', 'completed');

    IF existing_count = 0 THEN
      INSERT INTO _daily_meds VALUES (rec.patient_id, rec.p_name, rec.timezone, rec.medication_id, call_time);
    END IF;
  END LOOP;

  -- Group by patient + 30-minute window and create bundled calls
  FOR rec IN
    SELECT
      dm.patient_id,
      dm.p_name,
      MIN(dm.call_time) AS earliest_time,
      ARRAY_AGG(dm.medication_id) AS med_ids
    FROM _daily_meds dm
    GROUP BY dm.patient_id, dm.p_name,
      -- Group into 30-min windows
      DATE_TRUNC('hour', dm.call_time) + INTERVAL '30 min' * FLOOR(EXTRACT(MINUTE FROM dm.call_time) / 30)
  LOOP
    INSERT INTO scheduled_reminder_calls (
      patient_id,
      medication_id,
      medication_ids,
      scheduled_for,
      attempt_number,
      status
    ) VALUES (
      rec.patient_id,
      rec.med_ids[1],  -- primary medication_id (first in bundle)
      rec.med_ids,
      rec.earliest_time,
      1,
      'pending'
    );

    patient_name := rec.p_name;
    medication_count := ARRAY_LENGTH(rec.med_ids, 1);
    scheduled_time := rec.earliest_time;
    RETURN NEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Cron: Weekly digest — Monday 9 AM ET (14:00 UTC)
-- ============================================================
SELECT cron.schedule(
  'weekly-digest-email',
  '0 14 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://wxnwtdsfwtnbukttwgcu.supabase.co/functions/v1/weekly-digest',
    headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4bnd0ZHNmd3RuYnVrdHR3Z2N1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUyNjc2MiwiZXhwIjoyMDg0MTAyNzYyfQ.5lKGRbAlNaYzsAMy7u2RAb7n2Km6yosLEgnWz201HE8", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
