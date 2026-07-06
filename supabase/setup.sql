-- ============================================================
-- 1. Bucket Supabase Storage : taches-photos
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('taches-photos', 'taches-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Politique : les utilisateurs authentifiés peuvent uploader
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Chauffeurs peuvent uploader des photos'
  ) THEN
    CREATE POLICY "Chauffeurs peuvent uploader des photos"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'taches-photos');
  END IF;
END $$;

-- Politique : lecture publique des photos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Lecture publique taches-photos'
  ) THEN
    CREATE POLICY "Lecture publique taches-photos"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'taches-photos');
  END IF;
END $$;

-- ============================================================
-- 2. Table photos
-- ============================================================
CREATE TABLE IF NOT EXISTS photos (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  tache_id      UUID        NOT NULL REFERENCES taches(id) ON DELETE CASCADE,
  url           TEXT        NOT NULL,
  statut_associe TEXT       NOT NULL,  -- 'livre', 'ramasse', 'obstacle'
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'photos'
      AND policyname = 'Chauffeurs peuvent insérer des photos'
  ) THEN
    CREATE POLICY "Chauffeurs peuvent insérer des photos"
      ON photos FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'photos'
      AND policyname = 'Lecture des photos pour authentifiés'
  ) THEN
    CREATE POLICY "Lecture des photos pour authentifiés"
      ON photos FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- ============================================================
-- 3. Colonnes supplémentaires sur taches
-- ============================================================
ALTER TABLE taches ADD COLUMN IF NOT EXISTS motif_obstacle  TEXT;
ALTER TABLE taches ADD COLUMN IF NOT EXISTS note_obstacle   TEXT;
