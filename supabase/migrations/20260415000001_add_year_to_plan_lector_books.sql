-- Add academic year support to plan_lector_books
-- This keeps legacy rows valid (year NULL) and allows separate 2026 content.

ALTER TABLE plan_lector_books
ADD COLUMN IF NOT EXISTS year TEXT;

CREATE INDEX IF NOT EXISTS idx_plan_lector_books_year ON plan_lector_books(year);
