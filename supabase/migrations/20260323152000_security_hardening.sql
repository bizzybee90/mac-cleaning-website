-- Security hardening for dashboard access and edge headers.

ALTER VIEW lead_stats SET (security_invoker = true);
ALTER VIEW revenue_pipeline SET (security_invoker = true);
ALTER VIEW conversion_speed SET (security_invoker = true);

ALTER TABLE dashboard_users ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE leads FROM anon;
REVOKE ALL ON TABLE lead_events FROM anon;
REVOKE ALL ON TABLE dashboard_users FROM anon, authenticated;
REVOKE ALL ON TABLE lead_stats FROM anon;
REVOKE ALL ON TABLE revenue_pipeline FROM anon;
REVOKE ALL ON TABLE conversion_speed FROM anon;

GRANT SELECT, UPDATE ON TABLE leads TO authenticated;
GRANT SELECT, INSERT ON TABLE lead_events TO authenticated;
GRANT SELECT ON TABLE lead_stats TO authenticated;
GRANT SELECT ON TABLE revenue_pipeline TO authenticated;
GRANT SELECT ON TABLE conversion_speed TO authenticated;

DROP POLICY IF EXISTS "Service role full access on leads" ON leads;
DROP POLICY IF EXISTS "Service role full access on lead_events" ON lead_events;
DROP POLICY IF EXISTS "Authenticated users can read leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can read lead events" ON lead_events;
DROP POLICY IF EXISTS "Authenticated users can insert lead events" ON lead_events;

CREATE POLICY "Service role full access on leads" ON leads
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on lead_events" ON lead_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read leads" ON leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update leads" ON leads
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read lead events" ON lead_events
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert lead events" ON lead_events
  FOR INSERT TO authenticated WITH CHECK (true);
