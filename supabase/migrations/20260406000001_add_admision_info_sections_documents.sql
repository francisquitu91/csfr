-- Add optional document fields to admission info sections
ALTER TABLE admision_info_sections
  ADD COLUMN IF NOT EXISTS file_url TEXT,
  ADD COLUMN IF NOT EXISTS file_name TEXT;
