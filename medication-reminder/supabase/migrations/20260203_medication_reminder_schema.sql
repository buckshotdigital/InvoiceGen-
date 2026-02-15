-- Medication Reminder System Schema
-- ===================================

-- Patients (elderly users receiving reminders)
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  timezone TEXT DEFAULT 'America/Toronto',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Caregivers (family members who set up and monitor)
CREATE TABLE IF NOT EXISTS caregivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link patients to caregivers (many-to-many)
CREATE TABLE IF NOT EXISTS patient_caregivers (
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  caregiver_id UUID REFERENCES caregivers(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  PRIMARY KEY (patient_id, caregiver_id)
);

-- Medications
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                      -- "Lisinopril"
  description TEXT,                        -- "small white pill for blood pressure"
  dosage TEXT,                             -- "10mg"
  reminder_time TIME NOT NULL,             -- "09:00"
  reminder_days INTEGER[] DEFAULT '{1,2,3,4,5,6,7}',  -- Days of week (1=Mon, 7=Sun)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call logs (record of every call made)
CREATE TABLE IF NOT EXISTS reminder_call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  medication_id UUID REFERENCES medications(id),
  call_sid TEXT UNIQUE,                    -- Twilio call SID
  status TEXT DEFAULT 'initiated',         -- initiated, answered, completed, no_answer, failed
  medication_taken BOOLEAN,
  patient_response TEXT,                   -- Full transcript
  notes TEXT,                              -- Any flags or concerns
  duration_seconds INTEGER,
  attempt_number INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled calls (queue of pending calls)
CREATE TABLE IF NOT EXISTS scheduled_reminder_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMPTZ NOT NULL,
  attempt_number INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending',           -- pending, in_progress, completed, failed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scheduled_calls_pending
ON scheduled_reminder_calls(scheduled_for)
WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_call_logs_patient
ON reminder_call_logs(patient_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_medications_patient
ON medications(patient_id)
WHERE is_active = true;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_medications_updated_at ON medications;
CREATE TRIGGER update_medications_updated_at
  BEFORE UPDATE ON medications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
