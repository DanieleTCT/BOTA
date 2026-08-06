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
DROP POLICY IF EXISTS "anon_read_img_bota" ON storage.objects;
DROP POLICY IF EXISTS "anon_insert_img_bota" ON storage.objects;
DROP POLICY IF EXISTS "anon_update_img_bota" ON storage.objects;
DROP POLICY IF EXISTS "anon_delete_img_bota" ON storage.objects;

-- -----------------------------------------------------------------------------
-- Policy RLS per il bucket img-bota - accesso completo per ruolo anon
-- -----------------------------------------------------------------------------

-- Policy: permette lettura a tutti (anon e authenticated)
CREATE POLICY "anon_read_img_bota"
ON storage.objects FOR SELECT
USING (bucket_id = 'img-bota');

-- Policy: permette upload a tutti (senza auth per site builder)
CREATE POLICY "anon_insert_img_bota"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'img-bota');

-- Policy: permette aggiornamento a tutti
CREATE POLICY "anon_update_img_bota"
ON storage.objects FOR UPDATE
USING (bucket_id = 'img-bota');

-- Policy: permette eliminazione a tutti
CREATE POLICY "anon_delete_img_bota"
ON storage.objects FOR DELETE
USING (bucket_id = 'img-bota');

-- -----------------------------------------------------------------------------
-- Verifica: lista dei bucket
-- -----------------------------------------------------------------------------
-- SELECT * FROM storage.buckets WHERE id = 'img-bota';

-- =============================================================================
-- FINE SCRIPT
-- =============================================================================