-- Create job_postings table
CREATE TABLE IF NOT EXISTS job_postings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name TEXT,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public select" ON job_postings
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated update" ON job_postings
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete" ON job_postings
  FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert" ON job_postings
  FOR INSERT WITH CHECK (true);
