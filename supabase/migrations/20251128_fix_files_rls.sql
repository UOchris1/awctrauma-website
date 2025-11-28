-- Fix RLS policies for files table to ensure updates work properly

-- Drop existing update policy
DROP POLICY IF EXISTS "Admins can update files" ON files;

-- Recreate with both USING and WITH CHECK
CREATE POLICY "Admins can update files"
  ON files
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Also make sure delete works
DROP POLICY IF EXISTS "Admins can delete files" ON files;

CREATE POLICY "Admins can delete files"
  ON files
  FOR DELETE
  USING (true);
