-- =============================================================================
-- BOTA - Supabase Storage Setup per bucket 'img-bota'
-- =============================================================================
-- Questo script configura il bucket 'img-bota' su Supabase per l'upload
-- delle immagini dal pannello admin di BOTA.
--
-- ISTRUZIONI:
-- 1. Esegui questo script nel SQL Editor di Supabase Dashboard
-- 2. Verifica che il bucket sia pubblico
-- 3. Le policy RLS permetteranno upload/lettura pubblica
-- =============================================================================

-- 1. Crea bucket img-bota
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'img-bota',
  'img-bota',
  true,
  5242880, -- 5MB
  ARRAY[
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 
    'image/svg+xml', 'image/avif'
  ]
) ON CONFLICT (id) DO NOTHING;

-- 2. RLS Policies per img-bota
DROP POLICY IF EXISTS "Public read img-bota" ON storage.objects;
DROP POLICY IF EXISTS "Public write img-bota" ON storage.objects;
DROP POLICY IF EXISTS "Public update img-bota" ON storage.objects;
DROP POLICY IF EXISTS "Public delete img-bota" ON storage.objects;

CREATE POLICY "Public read img-bota"
  ON storage.objects FOR SELECT USING (bucket_id = 'img-bota');

CREATE POLICY "Public write img-bota"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'img-bota');

CREATE POLICY "Public update img-bota"
  ON storage.objects FOR UPDATE USING (bucket_id = 'img-bota');

CREATE POLICY "Public delete img-bota"
  ON storage.objects FOR DELETE USING (bucket_id = 'img-bota');

-- 3. Verifica configurazione
SELECT 
  id, 
  name, 
  public, 
  file_size_limit,
  allowed_mime_types 
FROM storage.buckets 
WHERE id = 'img-bota';

-- =============================================================================
-- FINE SETUP
-- =============================================================================