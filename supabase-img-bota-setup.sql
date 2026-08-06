-- =============================================================================
-- BOTA PIZZERIA - Supabase Storage Setup
-- =============================================================================
-- Questo script configura il bucket 'img-bota' su Supabase per l'upload
-- delle immagini dal pannello admin.
--
-- ISTRUZIONI:
-- 1. Vai su Supabase Dashboard → Storage
-- 2. Crea un nuovo bucket chiamato 'img-bota'
-- 3. Imposta come PUBLIC
-- 4. Esegui questo script SQL per configurare le policy RLS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Abilita RLS sulla tabella storage.objects
-- -----------------------------------------------------------------------------
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Rimuovi policy esistenti per evitare conflitti
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- -----------------------------------------------------------------------------
-- Policy RLS per il bucket img-bota - permettono accesso pubblico (anon)
-- -----------------------------------------------------------------------------

-- Policy: permette a tutti di leggere
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'img-bota');

-- Policy: permette a tutti di caricare file
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'img-bota');

-- Policy: permette a tutti di aggiornare
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'img-bota');

-- Policy: permette a tutti di eliminare
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'img-bota');

-- -----------------------------------------------------------------------------
-- Verifica: lista dei bucket
-- -----------------------------------------------------------------------------
-- SELECT * FROM storage.buckets WHERE id = 'img-bota';

-- =============================================================================
-- FINE SCRIPT
-- =============================================================================