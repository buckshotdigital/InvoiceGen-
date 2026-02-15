-- Phase 2A: Auth, RLS, and Reporting Views
-- ==========================================

-- Add auth_user_id to caregivers for Supabase Auth integration
ALTER TABLE caregivers
  ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_caregivers_auth_user
  ON caregivers(auth_user_id) WHERE auth_user_id IS NOT NULL;

-- ============================================================
-- Enable RLS on all tables
-- ============================================================
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reminder_calls ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies: Caregivers see only their linked patients' data
-- ============================================================

-- Caregivers: can read/update own record
CREATE POLICY "Caregivers can view own record"
  ON caregivers FOR SELECT
  USING (auth_user_id = auth.uid());

CREATE POLICY "Caregivers can update own record"
  ON caregivers FOR UPDATE
  USING (auth_user_id = auth.uid());

-- Patient-Caregiver links: caregivers see their own links
CREATE POLICY "Caregivers see own patient links"
  ON patient_caregivers FOR SELECT
  USING (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Caregivers can create patient links"
  ON patient_caregivers FOR INSERT
  WITH CHECK (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Caregivers can delete own patient links"
  ON patient_caregivers FOR DELETE
  USING (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  );

-- Patients: caregivers see their linked patients
CREATE POLICY "Caregivers see linked patients"
  ON patients FOR SELECT
  USING (
    id IN (
      SELECT patient_id FROM patient_caregivers
      WHERE caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Caregivers can insert patients"
  ON patients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Caregivers can update linked patients"
  ON patients FOR UPDATE
  USING (
    id IN (
      SELECT patient_id FROM patient_caregivers
      WHERE caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Medications: caregivers see medications for linked patients
CREATE POLICY "Caregivers see linked patient medications"
  ON medications FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM patient_caregivers
      WHERE caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Caregivers can insert medications"
  ON medications FOR INSERT
  WITH CHECK (
    patient_id IN (
      SELECT patient_id FROM patient_caregivers
      WHERE caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Caregivers can update linked patient medications"
  ON medications FOR UPDATE
  USING (
    patient_id IN (
      SELECT patient_id FROM patient_caregivers
      WHERE caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Call logs: caregivers see call logs for linked patients
CREATE POLICY "Caregivers see linked patient call logs"
  ON reminder_call_logs FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM patient_caregivers
      WHERE caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Scheduled calls: caregivers see scheduled calls for linked patients
CREATE POLICY "Caregivers see linked patient scheduled calls"
  ON scheduled_reminder_calls FOR SELECT
  USING (
    patient_id IN (
      SELECT patient_id FROM patient_caregivers
      WHERE caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
    )
  );

-- ============================================================
-- Reporting Views
-- ============================================================

-- Daily adherence summary: per-patient, per-medication status for today
CREATE OR REPLACE VIEW daily_adherence_summary AS
SELECT
  p.id AS patient_id,
  p.name AS patient_name,
  m.id AS medication_id,
  m.name AS medication_name,
  m.dosage,
  m.reminder_time,
  cl.call_sid,
  cl.status AS call_status,
  cl.medication_taken,
  cl.patient_response,
  cl.duration_seconds,
  cl.created_at AS call_time,
  CASE
    WHEN cl.medication_taken = true THEN 'taken'
    WHEN cl.medication_taken = false THEN 'missed'
    WHEN cl.status IN ('initiated', 'answered') THEN 'pending'
    WHEN cl.status IN ('no_answer', 'failed', 'voicemail') THEN 'unreached'
    WHEN sc.status = 'pending' THEN 'scheduled'
    ELSE 'no_call'
  END AS adherence_status
FROM medications m
JOIN patients p ON p.id = m.patient_id
LEFT JOIN LATERAL (
  SELECT * FROM reminder_call_logs
  WHERE patient_id = p.id
    AND medication_id = m.id
    AND created_at::DATE = CURRENT_DATE
  ORDER BY created_at DESC
  LIMIT 1
) cl ON true
LEFT JOIN LATERAL (
  SELECT * FROM scheduled_reminder_calls
  WHERE patient_id = p.id
    AND medication_id = m.id
    AND scheduled_for::DATE = CURRENT_DATE
    AND status = 'pending'
  ORDER BY scheduled_for
  LIMIT 1
) sc ON cl.id IS NULL
WHERE m.is_active = true;

-- Weekly adherence rate: percentage per patient per week
CREATE OR REPLACE VIEW weekly_adherence_rate AS
SELECT
  p.id AS patient_id,
  p.name AS patient_name,
  DATE_TRUNC('week', cl.created_at)::DATE AS week_start,
  COUNT(*) FILTER (WHERE cl.medication_taken IS NOT NULL) AS total_calls,
  COUNT(*) FILTER (WHERE cl.medication_taken = true) AS taken_count,
  COUNT(*) FILTER (WHERE cl.medication_taken = false) AS missed_count,
  CASE
    WHEN COUNT(*) FILTER (WHERE cl.medication_taken IS NOT NULL) > 0
    THEN ROUND(
      100.0 * COUNT(*) FILTER (WHERE cl.medication_taken = true)
      / COUNT(*) FILTER (WHERE cl.medication_taken IS NOT NULL),
      1
    )
    ELSE 0
  END AS adherence_percentage
FROM patients p
JOIN reminder_call_logs cl ON cl.patient_id = p.id
WHERE cl.created_at >= NOW() - INTERVAL '12 weeks'
GROUP BY p.id, p.name, DATE_TRUNC('week', cl.created_at)::DATE
ORDER BY p.name, week_start DESC;
