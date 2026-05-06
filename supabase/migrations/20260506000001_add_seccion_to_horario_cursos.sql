-- Add seccion (A/B) to horario_cursos table

-- Add seccion column if not exists
ALTER TABLE horario_cursos
ADD COLUMN IF NOT EXISTS seccion TEXT DEFAULT 'A' CHECK (seccion IN ('A', 'B'));

-- Update existing records to be marked as 'A'
UPDATE horario_cursos SET seccion = 'A' WHERE seccion IS NULL;

-- Remove the UNIQUE constraint on curso since we'll now have curso + seccion
ALTER TABLE horario_cursos DROP CONSTRAINT IF EXISTS horario_cursos_curso_key;

-- Add new unique constraint for curso + seccion combination
ALTER TABLE horario_cursos 
ADD CONSTRAINT uq_horario_cursos_curso_seccion UNIQUE (curso, seccion);

-- Insert section B for all existing courses
INSERT INTO horario_cursos (nivel, curso, seccion, order_index)
SELECT nivel, curso, 'B', order_index + 0.5
FROM horario_cursos
WHERE seccion = 'A'
ON CONFLICT (curso, seccion) DO NOTHING;
