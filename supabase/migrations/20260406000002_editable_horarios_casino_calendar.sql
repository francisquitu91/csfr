-- Editable schedules and casino menu calendar
-- Keeps previous tables for compatibility; new UI uses these tables.

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================
-- Horarios (mini calendar)
-- =========================

CREATE TABLE IF NOT EXISTS horario_modulos (
  id BIGSERIAL PRIMARY KEY,
  modulo_label TEXT NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horario_cursos (
  id BIGSERIAL PRIMARY KEY,
  nivel TEXT NOT NULL CHECK (nivel IN ('Matrícula Pre kínder y Kínder', '1° Básico a IV Medio')),
  curso TEXT NOT NULL UNIQUE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horario_bloques (
  id BIGSERIAL PRIMARY KEY,
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 1 AND 5),
  modulo_id BIGINT NOT NULL REFERENCES horario_modulos(id) ON DELETE CASCADE,
  curso_id BIGINT REFERENCES horario_cursos(id) ON DELETE CASCADE,
  nivel TEXT,
  asignatura TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE horario_modulos DISABLE ROW LEVEL SECURITY;
ALTER TABLE horario_cursos DISABLE ROW LEVEL SECURITY;
ALTER TABLE horario_bloques DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_horario_modulos_order ON horario_modulos(order_index);
CREATE INDEX IF NOT EXISTS idx_horario_cursos_order ON horario_cursos(order_index);
CREATE INDEX IF NOT EXISTS idx_horario_bloques_curso_dia ON horario_bloques(curso_id, dia_semana);

DROP TRIGGER IF EXISTS trg_horario_modulos_updated_at ON horario_modulos;
CREATE TRIGGER trg_horario_modulos_updated_at
BEFORE UPDATE ON horario_modulos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_horario_cursos_updated_at ON horario_cursos;
CREATE TRIGGER trg_horario_cursos_updated_at
BEFORE UPDATE ON horario_cursos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_horario_bloques_updated_at ON horario_bloques;
CREATE TRIGGER trg_horario_bloques_updated_at
BEFORE UPDATE ON horario_bloques
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO horario_cursos (nivel, curso, order_index)
VALUES
  ('Matrícula Pre kínder y Kínder', 'Pre kínder', 1),
  ('Matrícula Pre kínder y Kínder', 'Kínder', 2),
  ('1° Básico a IV Medio', '1° Básico', 3),
  ('1° Básico a IV Medio', '2° Básico', 4),
  ('1° Básico a IV Medio', '3° Básico', 5),
  ('1° Básico a IV Medio', '4° Básico', 6),
  ('1° Básico a IV Medio', '5° Básico', 7),
  ('1° Básico a IV Medio', '6° Básico', 8),
  ('1° Básico a IV Medio', '7° Básico', 9),
  ('1° Básico a IV Medio', '8° Básico', 10),
  ('1° Básico a IV Medio', 'I° Medio', 11),
  ('1° Básico a IV Medio', 'II° Medio', 12),
  ('1° Básico a IV Medio', 'III° Medio', 13),
  ('1° Básico a IV Medio', 'IV° Medio', 14)
ON CONFLICT (curso) DO NOTHING;

ALTER TABLE horario_bloques
  ADD COLUMN IF NOT EXISTS curso_id BIGINT,
  ADD COLUMN IF NOT EXISTS nivel TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_horario_bloques_curso'
      AND conrelid = 'horario_bloques'::regclass
  ) THEN
    ALTER TABLE horario_bloques
      ADD CONSTRAINT fk_horario_bloques_curso
      FOREIGN KEY (curso_id) REFERENCES horario_cursos(id) ON DELETE CASCADE;
  END IF;
END $$;

UPDATE horario_bloques hb
SET curso_id = hc.id
FROM horario_cursos hc
WHERE hb.curso_id IS NULL
  AND hb.nivel IS NOT NULL
  AND hb.nivel = hc.nivel;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'uq_horario_bloque'
      AND conrelid = 'horario_bloques'::regclass
  ) THEN
    ALTER TABLE horario_bloques DROP CONSTRAINT uq_horario_bloque;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'uq_horario_bloque'
      AND conrelid = 'horario_bloques'::regclass
  ) THEN
    ALTER TABLE horario_bloques
      ADD CONSTRAINT uq_horario_bloque UNIQUE (curso_id, dia_semana, modulo_id);
  END IF;
END $$;

INSERT INTO horario_modulos (modulo_label, hora_inicio, hora_fin, order_index)
SELECT * FROM (
  VALUES
    ('Módulo 1', '08:00'::TIME, '08:45'::TIME, 1),
    ('Módulo 2', '08:50'::TIME, '09:35'::TIME, 2),
    ('Módulo 3', '09:55'::TIME, '10:40'::TIME, 3),
    ('Módulo 4', '10:45'::TIME, '11:30'::TIME, 4),
    ('Módulo 5', '11:50'::TIME, '12:35'::TIME, 5),
    ('Módulo 6', '12:40'::TIME, '13:25'::TIME, 6),
    ('Módulo 7', '14:20'::TIME, '15:05'::TIME, 7),
    ('Módulo 8', '15:10'::TIME, '15:55'::TIME, 8)
) AS seed(modulo_label, hora_inicio, hora_fin, order_index)
WHERE NOT EXISTS (SELECT 1 FROM horario_modulos);

INSERT INTO horario_bloques (curso_id, dia_semana, modulo_id, asignatura)
SELECT c.id, dias.dia_semana, m.id, ''
FROM horario_cursos c
CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS dias(dia_semana)
CROSS JOIN horario_modulos m
ON CONFLICT (curso_id, dia_semana, modulo_id) DO NOTHING;

-- =========================
-- Casino menu (mini calendar)
-- =========================

CREATE TABLE IF NOT EXISTS casino_menu_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  title TEXT NOT NULL DEFAULT 'Menú Casino',
  display_month INTEGER NOT NULL CHECK (display_month BETWEEN 1 AND 12),
  display_year INTEGER NOT NULL,
  concessionaria_nombre TEXT,
  concessionaria_telefono TEXT,
  concessionaria_email TEXT,
  nutricionista_nombre TEXT,
  nutricionista_telefono TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT casino_menu_settings_singleton CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS casino_menu_items (
  id BIGSERIAL PRIMARY KEY,
  menu_year INTEGER NOT NULL,
  menu_month INTEGER NOT NULL CHECK (menu_month BETWEEN 1 AND 12),
  menu_date DATE NOT NULL,
  menu_text TEXT NOT NULL DEFAULT '',
  price INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_casino_menu_date UNIQUE (menu_year, menu_month, menu_date)
);

ALTER TABLE casino_menu_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE casino_menu_items DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_casino_menu_items_month ON casino_menu_items(menu_year, menu_month, menu_date);

DROP TRIGGER IF EXISTS trg_casino_menu_settings_updated_at ON casino_menu_settings;
CREATE TRIGGER trg_casino_menu_settings_updated_at
BEFORE UPDATE ON casino_menu_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_casino_menu_items_updated_at ON casino_menu_items;
CREATE TRIGGER trg_casino_menu_items_updated_at
BEFORE UPDATE ON casino_menu_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO casino_menu_settings (
  id,
  title,
  display_month,
  display_year,
  concessionaria_nombre,
  concessionaria_telefono,
  concessionaria_email,
  nutricionista_nombre,
  nutricionista_telefono
)
VALUES (
  1,
  'Menú Marzo 2026',
  3,
  2026,
  'Catalina Cruz',
  '982293870',
  'catacruzsch@gmail.com',
  'Claudia Frias',
  '997892294'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  display_month = EXCLUDED.display_month,
  display_year = EXCLUDED.display_year,
  concessionaria_nombre = EXCLUDED.concessionaria_nombre,
  concessionaria_telefono = EXCLUDED.concessionaria_telefono,
  concessionaria_email = EXCLUDED.concessionaria_email,
  nutricionista_nombre = EXCLUDED.nutricionista_nombre,
  nutricionista_telefono = EXCLUDED.nutricionista_telefono,
  updated_at = NOW();

INSERT INTO casino_menu_items (menu_year, menu_month, menu_date, menu_text, price)
VALUES
  (2026, 3, DATE '2026-03-04', 'Primer día de clases', NULL),
  (2026, 3, DATE '2026-03-09', E'Salad Bar\nTallarines salsa boloñesa\nHelado', 654),
  (2026, 3, DATE '2026-03-10', E'Salad Bar\nChapsui de pollo con arroz\nJalea', 622),
  (2026, 3, DATE '2026-03-11', E'Salad Bar\nLentejas con vienesa picada\nUva', 655),
  (2026, 3, DATE '2026-03-12', E'Salad Bar\nNugget de pollo con puré\nSandía', 662),
  (2026, 3, DATE '2026-03-13', E'Salad Bar\nLomo de cerdo papas a la crema\nMelón', 676),
  (2026, 3, DATE '2026-03-16', E'Salad Bar\nPollo arvejado con arroz\nFlan', 628),
  (2026, 3, DATE '2026-03-17', E'Salad Bar\nTallarines pesto o salsa boloñesa\nLeche asada', 678),
  (2026, 3, DATE '2026-03-18', E'Salad Bar\nPizza jamón queso\nMelón', 645),
  (2026, 3, DATE '2026-03-19', E'Salad Bar\nMilanesa de pollo con papas rústicas\nTuti fruti', 652),
  (2026, 3, DATE '2026-03-20', E'Salad Bar\nStrogonoff con arroz\nUva', NULL),
  (2026, 3, DATE '2026-03-23', E'Salad Bar\nEspirales con salsa alfredo\nBrazo de reina', 686),
  (2026, 3, DATE '2026-03-24', E'Salad Bar\nPorotos granados\nHelado', 675),
  (2026, 3, DATE '2026-03-25', E'Salad Bar\nHamburguesa atún con arroz\nManjarate', 685),
  (2026, 3, DATE '2026-03-26', E'Salad Bar\nFilete cerdo papas/quinoa\nSandía', 668),
  (2026, 3, DATE '2026-03-27', E'Salad Bar\nCharquicán\nMelón', 667),
  (2026, 3, DATE '2026-03-30', E'Salad Bar\nCerdo asado con arroz árabe\nSuspiro limeño', 710),
  (2026, 3, DATE '2026-03-31', E'Salad Bar\nLasaña boloñesa\nFruta natural', 654)
ON CONFLICT (menu_year, menu_month, menu_date) DO NOTHING;
