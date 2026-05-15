-- Harden public Supabase access.
--
-- Apply only after SUPABASE_SERVICE_ROLE_KEY is configured for the website's
-- server-side API routes in Vercel. Service-role clients bypass RLS; the public
-- anon key should not be able to mutate algorithms or storage objects directly.

ALTER TABLE algorithms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations for service role" ON algorithms;
DROP POLICY IF EXISTS "Allow public read access on algorithms" ON algorithms;

CREATE POLICY "Allow public read access on algorithms"
  ON algorithms
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Remove any existing storage write policies that mention project buckets.
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND (
        COALESCE(qual, '') ILIKE '%guidelines%'
        OR COALESCE(with_check, '') ILIKE '%guidelines%'
        OR COALESCE(qual, '') ILIKE '%algorithms%'
        OR COALESCE(with_check, '') ILIKE '%algorithms%'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_record.policyname);
  END LOOP;
END $$;

CREATE POLICY "Public can view guidelines"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'guidelines');

CREATE POLICY "Public can view algorithm images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'algorithms');
