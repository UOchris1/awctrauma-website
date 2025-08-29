-- Create file_category enum type
CREATE TYPE file_category AS ENUM (
  'resident_guidelines', 
  'cpgs', 
  'trauma_policies', 
  'resources'
);

-- Create files table
CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  category file_category NOT NULL
);

-- Enable Row Level Security
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public files are viewable by everyone" 
  ON files 
  FOR SELECT 
  USING (true);

-- Create policy for admin write access (temporarily allow all inserts)
CREATE POLICY "Admins can insert files" 
  ON files 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for admin update access (temporarily allow all updates)
CREATE POLICY "Admins can update files" 
  ON files 
  FOR UPDATE 
  WITH CHECK (true);

-- Create policy for admin delete access (temporarily allow all deletes)
CREATE POLICY "Admins can delete files" 
  ON files 
  FOR DELETE 
  USING (true);

-- Create storage bucket for guidelines
INSERT INTO storage.buckets (id, name, public)
VALUES ('guidelines', 'guidelines', true);

-- Create storage policies for public read access
CREATE POLICY "Public can view guidelines" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'guidelines');

-- Create storage policies for authenticated upload
CREATE POLICY "Authenticated users can upload guidelines" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'guidelines');

-- Create storage policies for authenticated update
CREATE POLICY "Authenticated users can update guidelines" 
  ON storage.objects 
  FOR UPDATE 
  WITH CHECK (bucket_id = 'guidelines');

-- Create storage policies for authenticated delete
CREATE POLICY "Authenticated users can delete guidelines" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'guidelines');