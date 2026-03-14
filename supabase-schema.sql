-- ═══════════════════════════════════════════
-- MAC Cleaning — Lead Pipeline Database
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════

-- 1. LEADS TABLE
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Status tracking
  status TEXT DEFAULT 'partial' CHECK (status IN (
    'partial',
    'quoted',
    'chased_1',
    'chased_2',
    'chased_3',
    'signed_up',
    'confirmed',
    'cancelled',
    'dead',
    'commercial_pending'
  )),

  -- Property details
  property_type TEXT,
  build_type TEXT,
  bedrooms TEXT,

  -- Extras (JSONB)
  extras JSONB DEFAULT '{}',

  -- Commercial fields
  commercial_type TEXT,
  commercial_desc TEXT,
  photo_urls TEXT[],

  -- Contact
  postcode TEXT,
  email TEXT,
  name TEXT,
  phone TEXT,
  address TEXT,

  -- Quote
  frequency TEXT,
  price_per_clean DECIMAL(10,2),

  -- Add-on services
  addons JSONB DEFAULT '{}',
  addons_total DECIMAL(10,2),

  -- Source tracking
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,

  -- Chase tracking
  chase_1_sent_at TIMESTAMPTZ,
  chase_2_sent_at TIMESTAMPTZ,
  chase_3_sent_at TIMESTAMPTZ,

  -- Conversion tracking
  quoted_at TIMESTAMPTZ,
  signed_up_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,

  -- Payment
  payment_method TEXT,
  payment_link TEXT,
  stripe_customer_id TEXT,

  -- Notes
  notes TEXT
);

-- Indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_postcode ON leads(postcode);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- 2. LEAD EVENTS TABLE (activity log)
CREATE TABLE lead_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  event_type TEXT NOT NULL,
  channel TEXT,
  details JSONB DEFAULT '{}',
  created_by TEXT DEFAULT 'system'
);

CREATE INDEX idx_events_lead ON lead_events(lead_id);


-- 3. DASHBOARD USERS TABLE (admin auth)
CREATE TABLE dashboard_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin','viewer')),
  created_at TIMESTAMPTZ DEFAULT now()
);


-- 4. VIEWS

-- Daily/weekly/monthly lead counts
CREATE VIEW lead_stats AS
SELECT
  COUNT(*) FILTER (WHERE created_at > now() - interval '1 day') as today,
  COUNT(*) FILTER (WHERE created_at > now() - interval '7 days') as this_week,
  COUNT(*) FILTER (WHERE created_at > now() - interval '30 days') as this_month,
  COUNT(*) FILTER (WHERE status = 'signed_up' OR status = 'confirmed') as total_converted,
  COUNT(*) FILTER (WHERE status = 'quoted') as awaiting_signup,
  COUNT(*) FILTER (WHERE status LIKE 'chased%') as in_chase_sequence,
  ROUND(
    COUNT(*) FILTER (WHERE status IN ('signed_up','confirmed'))::decimal /
    NULLIF(COUNT(*) FILTER (WHERE status != 'partial'), 0) * 100, 1
  ) as conversion_rate
FROM leads;

-- Revenue pipeline
CREATE VIEW revenue_pipeline AS
SELECT
  status,
  COUNT(*) as lead_count,
  SUM(price_per_clean * CASE WHEN frequency = '4-weekly' THEN 13 ELSE 6.5 END) as annual_value
FROM leads
WHERE status NOT IN ('dead','cancelled')
GROUP BY status;

-- Average time to conversion
CREATE VIEW conversion_speed AS
SELECT
  AVG(EXTRACT(EPOCH FROM (signed_up_at - quoted_at)) / 3600) as avg_hours_to_signup,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (signed_up_at - quoted_at)) / 3600) as median_hours_to_signup
FROM leads
WHERE signed_up_at IS NOT NULL AND quoted_at IS NOT NULL;


-- 5. ROW LEVEL SECURITY
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;

-- Allow service role (n8n) full access
CREATE POLICY "Service role full access on leads" ON leads
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on lead_events" ON lead_events
  FOR ALL USING (true) WITH CHECK (true);
