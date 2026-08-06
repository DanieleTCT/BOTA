-- ============================================================
-- Multi-Site Database Migration (Fixed)
-- ============================================================
-- Note: This migration assumes the legacy tables may be missing
-- and will create them if they do not exist.
-- ============================================================

-- Enable required extensions for UUID generation if not already present
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 1) Create sites table
-- ============================================================
CREATE TABLE IF NOT EXISTS sites (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  domain      text UNIQUE,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  metadata    jsonb DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Insert default site for backward compatibility
INSERT INTO sites (id, name, domain, status)
SELECT '00000000-0000-0000-0000-000000000000', 'Default Site', NULL, 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM sites WHERE id = '00000000-0000-0000-0000-000000000000'
);

-- ============================================================
-- 2) Create site_config table + migrate to multi-site
-- ============================================================
CREATE TABLE IF NOT EXISTS site_config (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     uuid,
  data        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_config_site_id_fkey
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
);

-- Ensure site_id exists (for environments where table was created previously)
ALTER TABLE site_config
  ADD COLUMN IF NOT EXISTS site_id uuid REFERENCES sites(id) ON DELETE CASCADE;

-- Migrate existing data to default site
UPDATE site_config
SET site_id = '00000000-0000-0000-0000-000000000000'::uuid
WHERE site_id IS NULL;

-- If there are duplicates (multiple configs per site), keep only latest per site
-- Note: requires updated_at column to exist.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'site_config'
      AND column_name = 'updated_at'
  ) THEN
    IF EXISTS (SELECT 1 FROM site_config WHERE site_id IS NOT NULL) THEN
      CREATE TEMP TABLE temp_latest_config AS
      SELECT DISTINCT ON (site_id) *
      FROM site_config
      ORDER BY site_id, updated_at DESC;

      DELETE FROM site_config;
      INSERT INTO site_config SELECT * FROM temp_latest_config;

      DROP TABLE temp_latest_config;
    END IF;
  END IF;
END $$;

-- Make site_id required after migration
ALTER TABLE site_config
  ALTER COLUMN site_id SET NOT NULL;

-- Unique constraint for one config per site
CREATE UNIQUE INDEX IF NOT EXISTS idx_site_config_site_id
  ON site_config(site_id);

-- ============================================================
-- 3) Create templates table with site_id
-- ============================================================
CREATE TABLE IF NOT EXISTS templates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  name        text NOT NULL,
  description text,
  data        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_templates_site_id
  ON templates(site_id);

-- ============================================================
-- 4) Create form_submissions table with site_id
-- ============================================================
CREATE TABLE IF NOT EXISTS form_submissions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     uuid,
  data        jsonb NOT NULL DEFAULT '{}'::jsonb,
  status      text NOT NULL DEFAULT 'received' CHECK (status IN ('received','processing','submitted','archived')),
  form_type   text,
  page_url    text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT form_submissions_site_id_fkey
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
);

ALTER TABLE form_submissions
  ADD COLUMN IF NOT EXISTS site_id uuid REFERENCES sites(id) ON DELETE CASCADE;

-- Migrate existing data to default site
UPDATE form_submissions
SET site_id = '00000000-0000-0000-0000-000000000000'::uuid
WHERE site_id IS NULL;

ALTER TABLE form_submissions
  ALTER COLUMN site_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_form_submissions_site_id
  ON form_submissions(site_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_site_created
  ON form_submissions(site_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_site_status
  ON form_submissions(site_id, status);

-- ============================================================
-- 5) Create image_gallery table with site_id
-- ============================================================
CREATE TABLE IF NOT EXISTS image_gallery (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  path        text NOT NULL,
  url         text NOT NULL,
  name        text NOT NULL,
  size        bigint,
  metadata    jsonb DEFAULT '{}'::jsonb,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_image_gallery_site_id
  ON image_gallery(site_id);

-- ============================================================
-- 6) Enable RLS
-- ============================================================
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_gallery ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 7) RLS Policies (initial permissive placeholders)
-- ============================================================
-- sites
DROP POLICY IF EXISTS "anon_select_sites" ON sites;
CREATE POLICY "anon_select_sites"
  ON sites FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "anon_insert_sites" ON sites;
CREATE POLICY "anon_insert_sites"
  ON sites FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_sites" ON sites;
CREATE POLICY "anon_update_sites"
  ON sites FOR UPDATE
  TO anon, authenticated
  USING (true) WITH CHECK (true);

-- site_config
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

-- templates
DROP POLICY IF EXISTS "anon_select_templates" ON templates;
CREATE POLICY "anon_select_templates"
  ON templates FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "anon_insert_templates" ON templates;
CREATE POLICY "anon_insert_templates"
  ON templates FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_templates" ON templates;
CREATE POLICY "anon_update_templates"
  ON templates FOR UPDATE
  TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_templates" ON templates;
CREATE POLICY "anon_delete_templates"
  ON templates FOR DELETE
  TO anon, authenticated
  USING (true);

-- form_submissions
DROP POLICY IF EXISTS "anon_select_submissions" ON form_submissions;
CREATE POLICY "anon_select_submissions"
  ON form_submissions FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "anon_insert_submissions" ON form_submissions;
CREATE POLICY "anon_insert_submissions"
  ON form_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_submissions" ON form_submissions;
CREATE POLICY "anon_update_submissions"
  ON form_submissions FOR UPDATE
  TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_submissions" ON form_submissions;
CREATE POLICY "anon_delete_submissions"
  ON form_submissions FOR DELETE
  TO anon, authenticated
  USING (true);

-- image_gallery
DROP POLICY IF EXISTS "anon_select_images" ON image_gallery;
CREATE POLICY "anon_select_images"
  ON image_gallery FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "anon_insert_images" ON image_gallery;
CREATE POLICY "anon_insert_images"
  ON image_gallery FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_images" ON image_gallery;
CREATE POLICY "anon_update_images"
  ON image_gallery FOR UPDATE
  TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_images" ON image_gallery;
CREATE POLICY "anon_delete_images"
  ON image_gallery FOR DELETE
  TO anon, authenticated
  USING (true);

-- ============================================================
-- 8) Helper functions + triggers
-- ============================================================
CREATE OR REPLACE FUNCTION get_current_site_id()
RETURNS uuid AS $$
BEGIN
  RETURN '00000000-0000-0000-0000-000000000000'::uuid;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION get_site_by_domain(domain text)
RETURNS TABLE (
  id uuid,
  name text,
  status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.name, s.status
  FROM sites s
  WHERE s.domain = domain
    AND s.status = 'active'
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sites_updated_at ON sites;
CREATE TRIGGER trg_sites_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_site_config_updated_at ON site_config;
CREATE TRIGGER trg_site_config_updated_at
  BEFORE UPDATE ON site_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_templates_updated_at ON templates;
CREATE TRIGGER trg_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_form_submissions_updated_at ON form_submissions;
CREATE TRIGGER trg_form_submissions_updated_at
  BEFORE UPDATE ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 9) Views
-- ============================================================
CREATE OR REPLACE VIEW site_config_view AS
SELECT 
  s.id as site_id,
  s.name as site_name,
  s.domain,
  sc.data as config,
  sc.updated_at as config_updated_at
FROM sites s
LEFT JOIN site_config sc ON sc.site_id = s.id;

CREATE OR REPLACE VIEW templates_view AS
SELECT 
  s.id as site_id,
  s.name as site_name,
  t.id as template_id,
  t.name as template_name,
  t.description,
  t.data,
  t.created_at,
  t.updated_at
FROM sites s
LEFT JOIN templates t ON t.site_id = s.id;

CREATE OR REPLACE VIEW form_submissions_view AS
SELECT 
  s.id as site_id,
  s.name as site_name,
  fs.id as submission_id,
  fs.data,
  fs.status,
  fs.form_type,
  fs.page_url,
  fs.created_at
FROM sites s
LEFT JOIN form_submissions fs ON fs.site_id = s.id;

CREATE OR REPLACE VIEW images_view AS
SELECT 
  s.id as site_id,
  s.name as site_name,
  ig.id as image_id,
  ig.path,
  ig.url,
  ig.name as image_name,
  ig.size,
  ig.metadata,
  ig.uploaded_at
FROM sites s
LEFT JOIN image_gallery ig ON ig.site_id = s.id;