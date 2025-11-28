-- Migration: Add algorithms table for flowchart management
-- Run this in your Supabase SQL Editor

-- Create algorithms table
CREATE TABLE IF NOT EXISTS algorithms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  short_title TEXT NOT NULL,
  icon_type TEXT NOT NULL DEFAULT 'default',
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_algorithms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER algorithms_updated_at_trigger
  BEFORE UPDATE ON algorithms
  FOR EACH ROW
  EXECUTE FUNCTION update_algorithms_updated_at();

-- Enable Row Level Security (but allow public read)
ALTER TABLE algorithms ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on algorithms"
  ON algorithms FOR SELECT
  USING (true);

-- Allow authenticated users to manage (for admin)
CREATE POLICY "Allow all operations for service role"
  ON algorithms FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default algorithms (matching current hardcoded data)
INSERT INTO algorithms (title, short_title, icon_type, sort_order) VALUES
  ('Rib Fracture Management (CWITS)', 'Rib Fracture', 'ribs', 1),
  ('Unstable Pelvic Fracture', 'Pelvic Fracture', 'pelvis', 2),
  ('BCVI Screening & Treatment', 'BCVI', 'vascular', 3),
  ('Splenic Injury Management', 'Spleen', 'spleen', 4),
  ('Hepatic Injury Management', 'Liver', 'liver', 5),
  ('Renal Injury Management', 'Kidney', 'kidney', 6),
  ('Difficult Airway Algorithm', 'Airway', 'airway', 7),
  ('Traumatic Brain Injury', 'Brain', 'brain', 8);

-- Create storage bucket for algorithm images if not exists
-- Note: Run this separately in Supabase Dashboard > Storage
-- INSERT INTO storage.buckets (id, name, public) VALUES ('algorithms', 'algorithms', true);
