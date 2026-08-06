-- ============================================================
-- Form Submissions Table — Website Framework
-- ============================================================
-- Run this migration in your Supabase project to enable
-- server-side form submission storage. Until this is applied,
-- the app automatically falls back to LocalStorage.
--
-- This is a single-tenant, no-auth app, so policies allow
-- both anon and authenticated roles to read/write.
-- ============================================================

CREATE TABLE IF NOT EXISTS form_submissions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data        jsonb NOT NULL DEFAULT '{}',
  status      text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'archived')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at
  ON form_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status
  ON form_submissions (status);
