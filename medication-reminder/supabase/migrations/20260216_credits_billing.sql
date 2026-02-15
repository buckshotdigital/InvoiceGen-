-- Credits-Based Billing System
-- Adds pricing tiers (basic/companionship) with duration caps and credit-based billing

-- Plans table: two pricing tiers
CREATE TABLE plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  monthly_price_cents INTEGER NOT NULL,
  max_call_duration_seconds INTEGER NOT NULL,
  free_seconds_per_call INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed the two plans
INSERT INTO plans (id, name, description, monthly_price_cents, max_call_duration_seconds, free_seconds_per_call) VALUES
  ('basic', 'Basic', '5-minute medication reminder calls', 4900, 300, 300),
  ('companionship', 'Companionship', '30-minute calls with extended companionship conversation', 4900, 1800, 180);

-- Patient plan assignments (which plan each patient is on)
CREATE TABLE patient_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  caregiver_id UUID NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES plans(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(patient_id, caregiver_id)
);

CREATE INDEX idx_patient_plans_patient ON patient_plans(patient_id) WHERE is_active = true;
CREATE INDEX idx_patient_plans_caregiver ON patient_plans(caregiver_id) WHERE is_active = true;

-- Credit balances: one row per caregiver (pooled across their patients)
CREATE TABLE credit_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id UUID NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE UNIQUE,
  balance_minutes NUMERIC(10, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Credit purchases: audit trail
CREATE TABLE credit_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id UUID NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
  minutes_purchased NUMERIC(10, 2) NOT NULL,
  price_cents INTEGER NOT NULL,
  pack_label TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual', -- 'manual' or 'stripe'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_purchases_caregiver ON credit_purchases(caregiver_id);

-- Credit usage: per-call deduction records
CREATE TABLE credit_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id UUID NOT NULL REFERENCES caregivers(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  call_log_id UUID REFERENCES reminder_call_logs(id),
  call_sid TEXT,
  total_duration_seconds INTEGER NOT NULL,
  free_seconds INTEGER NOT NULL,
  billable_seconds INTEGER NOT NULL,
  minutes_deducted NUMERIC(10, 2) NOT NULL,
  balance_before NUMERIC(10, 2) NOT NULL,
  balance_after NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_credit_usage_caregiver ON credit_usage(caregiver_id);
CREATE INDEX idx_credit_usage_patient ON credit_usage(patient_id);

-- Helper function: get patient plan details + credit balance in one query
CREATE OR REPLACE FUNCTION get_patient_plan(p_patient_id UUID)
RETURNS TABLE (
  plan_id TEXT,
  plan_name TEXT,
  max_call_duration_seconds INTEGER,
  free_seconds_per_call INTEGER,
  caregiver_id UUID,
  balance_minutes NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS plan_id,
    p.name AS plan_name,
    p.max_call_duration_seconds,
    p.free_seconds_per_call,
    pp.caregiver_id,
    COALESCE(cb.balance_minutes, 0) AS balance_minutes
  FROM patient_plans pp
  JOIN plans p ON p.id = pp.plan_id
  LEFT JOIN credit_balances cb ON cb.caregiver_id = pp.caregiver_id
  WHERE pp.patient_id = p_patient_id
    AND pp.is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic credit deduction with row lock
CREATE OR REPLACE FUNCTION deduct_credits(
  p_caregiver_id UUID,
  p_patient_id UUID,
  p_call_log_id UUID,
  p_call_sid TEXT,
  p_total_duration_seconds INTEGER,
  p_free_seconds INTEGER
) RETURNS TABLE (
  minutes_deducted NUMERIC,
  balance_after NUMERIC
) AS $$
DECLARE
  v_billable_seconds INTEGER;
  v_minutes_to_deduct NUMERIC(10, 2);
  v_balance_before NUMERIC(10, 2);
  v_balance_after NUMERIC(10, 2);
BEGIN
  -- Calculate billable seconds (total minus free, minimum 0)
  v_billable_seconds := GREATEST(0, p_total_duration_seconds - p_free_seconds);

  -- If no billable seconds, nothing to deduct
  IF v_billable_seconds = 0 THEN
    SELECT COALESCE(cb.balance_minutes, 0) INTO v_balance_before
    FROM credit_balances cb WHERE cb.caregiver_id = p_caregiver_id;
    v_balance_before := COALESCE(v_balance_before, 0);

    INSERT INTO credit_usage (
      caregiver_id, patient_id, call_log_id, call_sid,
      total_duration_seconds, free_seconds, billable_seconds,
      minutes_deducted, balance_before, balance_after
    ) VALUES (
      p_caregiver_id, p_patient_id, p_call_log_id, p_call_sid,
      p_total_duration_seconds, p_free_seconds, 0,
      0, v_balance_before, v_balance_before
    );

    RETURN QUERY SELECT 0::NUMERIC, v_balance_before;
    RETURN;
  END IF;

  -- Round up to nearest minute
  v_minutes_to_deduct := CEIL(v_billable_seconds::NUMERIC / 60);

  -- Lock the balance row and read current balance
  SELECT cb.balance_minutes INTO v_balance_before
  FROM credit_balances cb
  WHERE cb.caregiver_id = p_caregiver_id
  FOR UPDATE;

  IF NOT FOUND THEN
    -- Create balance row if it doesn't exist
    INSERT INTO credit_balances (caregiver_id, balance_minutes)
    VALUES (p_caregiver_id, 0);
    v_balance_before := 0;
  END IF;

  -- Deduct (allow negative to track debt, but ideally prevented upstream)
  v_balance_after := GREATEST(0, v_balance_before - v_minutes_to_deduct);

  UPDATE credit_balances
  SET balance_minutes = v_balance_after, updated_at = now()
  WHERE caregiver_id = p_caregiver_id;

  -- Record usage
  INSERT INTO credit_usage (
    caregiver_id, patient_id, call_log_id, call_sid,
    total_duration_seconds, free_seconds, billable_seconds,
    minutes_deducted, balance_before, balance_after
  ) VALUES (
    p_caregiver_id, p_patient_id, p_call_log_id, p_call_sid,
    p_total_duration_seconds, p_free_seconds, v_billable_seconds,
    v_minutes_to_deduct, v_balance_before, v_balance_after
  );

  RETURN QUERY SELECT v_minutes_to_deduct, v_balance_after;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies

ALTER TABLE patient_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_usage ENABLE ROW LEVEL SECURITY;

-- patient_plans: caregivers see only their own
CREATE POLICY "Caregivers manage their patient plans"
  ON patient_plans FOR ALL
  USING (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  );

-- credit_balances: caregivers see only their own
CREATE POLICY "Caregivers view their credit balance"
  ON credit_balances FOR ALL
  USING (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  );

-- credit_purchases: caregivers see only their own
CREATE POLICY "Caregivers view their credit purchases"
  ON credit_purchases FOR SELECT
  USING (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  );

-- credit_usage: caregivers see only their own
CREATE POLICY "Caregivers view their credit usage"
  ON credit_usage FOR SELECT
  USING (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  );
