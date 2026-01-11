-- Anuarios - Documentos de Anuarios
-- Migration to add anuarios table and storage bucket

-- Create anuarios table
CREATE TABLE IF NOT EXISTS anuarios (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  year TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE anuarios DISABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_anuarios_year ON anuarios(year DESC);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_anuarios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER anuarios_updated_at BEFORE UPDATE ON anuarios
FOR EACH ROW EXECUTE FUNCTION update_anuarios_updated_at();
-- Create storage bucket for anuarios files
INSERT INTO storage.buckets (id, name, public)
VALUES ('anuarios-files', 'anuarios-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies - Allow all operations
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Public can view anuarios files" ON storage.objects;
  DROP POLICY IF EXISTS "Public can upload anuarios files" ON storage.objects;
  DROP POLICY IF EXISTS "Public can update anuarios files" ON storage.objects;
  DROP POLICY IF EXISTS "Public can delete anuarios files" ON storage.objects;
END $$;

-- Create new policies that allow all operations
CREATE POLICY "Public can view anuarios files"
ON storage.objects FOR SELECT
USING (bucket_id = 'anuarios-files');

CREATE POLICY "Public can upload anuarios files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'anuarios-files');

CREATE POLICY "Public can update anuarios files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'anuarios-files');

CREATE POLICY "Public can delete anuarios files"
ON storage.objects FOR DELETE
USING (bucket_id = 'anuarios-files');