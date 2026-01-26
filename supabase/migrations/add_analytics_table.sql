-- Analytics table for tracking page visits and referrers
CREATE TABLE IF NOT EXISTS page_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  referrer TEXT,
  referrer_domain TEXT,
  user_agent TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_page_visits_created_at ON page_visits(created_at DESC);
CREATE INDEX idx_page_visits_referrer_domain ON page_visits(referrer_domain);
CREATE INDEX idx_page_visits_page_path ON page_visits(page_path);

-- Enable RLS but allow inserts from anyone (for tracking)
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for tracking
CREATE POLICY "Allow anonymous inserts" ON page_visits
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only allow service role to read (for admin dashboard)
CREATE POLICY "Service role can read all" ON page_visits
  FOR SELECT TO service_role
  USING (true);
