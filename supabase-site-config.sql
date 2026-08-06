-- ============================================================
-- Site Config Table — Website Framework
-- ============================================================
-- Run this migration in your Supabase project to enable
-- shared site configuration. Until this is applied,
-- the app automatically falls back to LocalStorage.
--
-- This is a single-tenant, no-auth app. Policies allow
-- both anon and authenticated roles to read/write so that
-- the admin page can publish the config and all visitors
-- can read it without authentication.
-- ============================================================

CREATE TABLE IF NOT EXISTS site_config (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     uuid NOT NULL,
  data        jsonb NOT NULL DEFAULT '{}',
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(site_id)
);

-- Seed default config for the default site
INSERT INTO site_config (site_id, data)
SELECT '00000000-0000-0000-0000-000000000000', '{}'
WHERE NOT EXISTS (SELECT 1 FROM site_config WHERE site_id = '00000000-0000-0000-0000-000000000000');

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_config" ON site_config;
CREATE POLICY "anon_select_config"
  ON site_config FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "anon_insert_config" ON site_config;
CREATE POLICY "anon_insert_config"
  ON site_config FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_config" ON site_config;
CREATE POLICY "anon_update_config"
  ON site_config FOR UPDATE
  TO anon, authenticated
  USING (true) WITH CHECK (true);

-- Keep a single timestamp updated automatically
CREATE OR REPLACE FUNCTION update_site_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_site_config_updated_at ON site_config;
CREATE TRIGGER trg_update_site_config_updated_at
  BEFORE UPDATE ON site_config
  FOR EACH ROW
  EXECUTE FUNCTION update_site_config_updated_at();