-- Security Hardening
-- ==================

-- Fix: overly permissive INSERT on patients (was WITH CHECK (true))
-- Now requires the inserting user to be an authenticated caregiver
DROP POLICY IF EXISTS "Caregivers can insert patients" ON patients;
CREATE POLICY "Authenticated caregivers can insert patients"
  ON patients FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM caregivers WHERE auth_user_id = auth.uid()
    )
  );
