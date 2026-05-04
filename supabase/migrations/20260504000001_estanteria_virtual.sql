-- Create table for Virtual Library (Estantería Virtual)
CREATE TABLE IF NOT EXISTS estanteria_virtual (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  drive_link TEXT NOT NULL, -- Google Drive file link
  cover_image_url TEXT, -- URL of book cover image
  author VARCHAR(255),
  description TEXT,
  category VARCHAR(255),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_estanteria_category ON estanteria_virtual(category);
CREATE INDEX IF NOT EXISTS idx_estanteria_order ON estanteria_virtual(order_index);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_estanteria_virtual_updated_at ON estanteria_virtual;
CREATE TRIGGER update_estanteria_virtual_updated_at
    BEFORE UPDATE ON estanteria_virtual
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE estanteria_virtual ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Allow public read on estanteria_virtual" ON estanteria_virtual;
CREATE POLICY "Allow public read on estanteria_virtual"
  ON estanteria_virtual FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert on estanteria_virtual" ON estanteria_virtual;
CREATE POLICY "Allow authenticated insert on estanteria_virtual"
  ON estanteria_virtual FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update on estanteria_virtual" ON estanteria_virtual;
CREATE POLICY "Allow authenticated update on estanteria_virtual"
  ON estanteria_virtual FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated delete on estanteria_virtual" ON estanteria_virtual;
CREATE POLICY "Allow authenticated delete on estanteria_virtual"
  ON estanteria_virtual FOR DELETE
  USING (true);
