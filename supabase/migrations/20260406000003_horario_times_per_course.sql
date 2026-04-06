-- Per-course module times in timetable blocks
-- Each course can have different start/end times for the same module.

ALTER TABLE horario_bloques
  ADD COLUMN IF NOT EXISTS hora_inicio TIME,
  ADD COLUMN IF NOT EXISTS hora_fin TIME;

UPDATE horario_bloques hb
SET
  hora_inicio = hm.hora_inicio,
  hora_fin = hm.hora_fin
FROM horario_modulos hm
WHERE hb.modulo_id = hm.id
  AND (hb.hora_inicio IS NULL OR hb.hora_fin IS NULL);

CREATE INDEX IF NOT EXISTS idx_horario_bloques_course_module
  ON horario_bloques(curso_id, modulo_id);
