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
-- Crea il bucket img-bota (se non esiste)
-- Nota: Su Supabase, i bucket vanno creati da Dashboard o API, non da SQL
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- Policy RLS per il bucket img-bota
-- -----------------------------------------------------------------------------

-- Policy: permette a tutti di leggere i file pubblici
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'img-bota');

-- Policy: permette a utenti autenticati di caricare file
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'img-bota'
  AND auth.role() = 'authenticated'
);

-- Policy: permette a utenti autenticati di aggiornare file
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'img-bota'
  AND auth.role() = 'authenticated'
);

-- Policy: permette a utenti autenticati di eliminare file
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'img-bota'
  AND auth.role() = 'authenticated'
);

-- -----------------------------------------------------------------------------
-- Verifica: lista dei bucket
-- -----------------------------------------------------------------------------
-- SELECT * FROM storage.buckets WHERE id = 'img-bota';

-- =============================================================================
-- FINE SCRIPT
-- =============================================================================