-- Add html_url column to algorithms table for interactive HTML flowcharts
-- This is optional - when set, the website opens the interactive HTML version
-- instead of the static PNG image. Both can coexist.
ALTER TABLE algorithms
ADD COLUMN IF NOT EXISTS html_url TEXT DEFAULT NULL;
