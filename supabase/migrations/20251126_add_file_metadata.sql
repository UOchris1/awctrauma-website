-- Migration: Add file metadata columns for multi-format support
-- Date: 2025-11-26
-- Description: Adds file_type, file_size, updated_at columns to files table

-- Add new columns
ALTER TABLE files ADD COLUMN IF NOT EXISTS file_type TEXT DEFAULT 'pdf';
ALTER TABLE files ADD COLUMN IF NOT EXISTS file_size INTEGER;
ALTER TABLE files ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE files ADD COLUMN IF NOT EXISTS original_filename TEXT;

-- Create function to auto-update timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_files_modtime ON files;
CREATE TRIGGER update_files_modtime
    BEFORE UPDATE ON files
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Add comment for documentation
COMMENT ON COLUMN files.file_type IS 'File type: pdf, docx, doc';
COMMENT ON COLUMN files.file_size IS 'File size in bytes';
COMMENT ON COLUMN files.updated_at IS 'Timestamp of last update';
COMMENT ON COLUMN files.original_filename IS 'Original filename when uploaded';
