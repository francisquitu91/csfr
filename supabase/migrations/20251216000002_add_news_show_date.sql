-- Add show_date column to news table
-- This allows news to optionally hide the date when displaying

ALTER TABLE IF EXISTS news 
ADD COLUMN IF NOT EXISTS show_date BOOLEAN DEFAULT true;

-- Update existing news to show dates by default
UPDATE news SET show_date = true WHERE show_date IS NULL;
