-- Create table for Formacion y Convivencia team members
CREATE TABLE IF NOT EXISTS formacion_convivencia_team (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE formacion_convivencia_team ENABLE ROW LEVEL SECURITY;

-- Create policies for formacion_convivencia_team
CREATE POLICY "Enable read access for all users" ON formacion_convivencia_team
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON formacion_convivencia_team
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON formacion_convivencia_team
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON formacion_convivencia_team
  FOR DELETE USING (true);

-- Insert initial data
INSERT INTO formacion_convivencia_team (name, position, order_index) VALUES
  ('Daniela Fuentes', 'Coordinadora General de Convivencia Educativa', 1),
  ('María Teresa Egaña', 'Psicopedagoga', 2),
  ('Daniela Schiavetti', 'Psicóloga, Jefe del departamento', 3);
