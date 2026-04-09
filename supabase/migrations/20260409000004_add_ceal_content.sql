-- Create table for editable CEAL presentation content
CREATE TABLE IF NOT EXISTS ceal_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  paragraph_1 TEXT NOT NULL,
  paragraph_2 TEXT NOT NULL,
  paragraph_3 TEXT NOT NULL,
  quote_text TEXT NOT NULL,
  quote_description TEXT NOT NULL,
  signature_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Keep behavior consistent with existing CEAL tables
ALTER TABLE ceal_content DISABLE ROW LEVEL SECURITY;

-- Seed initial content (single row)
INSERT INTO ceal_content (
  title,
  paragraph_1,
  paragraph_2,
  paragraph_3,
  quote_text,
  quote_description,
  signature_text
)
SELECT
  'Centro de Alumnos 2025',
  'Este año, como Centro de Alumnos, queremos ser una voz cercana y presente. Nuestra meta es simple pero importante: aportar con pequeños gestos y grandes ideas para que este 2025 sea un año especial para todos.',
  'Nos propusimos fortalecer la convivencia, hacer comunidad y darle vida al sello SF que nos une como colegio. Pero también queremos reafirmar el rol del CEAL como un espacio representativo, activo y comprometido, que contribuya de forma concreta a la vida escolar y al crecimiento de cada curso.',
  'Creemos que cada uno de nosotros tiene algo valioso que aportar, y que todos podemos dejar una huella en el camino.',
  'Avanzando juntos, dejando huellas',
  'Queremos seguir creando espacios que nos acerquen, como el Torneo de Media, las Alianzas o la Semana de la Convivencia, donde cada encuentro sea una oportunidad para disfrutar y construir recuerdos.',
  'Con cariño,\nCentro de Alumnos 2025'
WHERE NOT EXISTS (SELECT 1 FROM ceal_content);