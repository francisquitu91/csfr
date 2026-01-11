-- Migration: rename category 'Documentos de Matrícula 2025' to 'Documentos de Matrícula 2026'
BEGIN;

UPDATE institutional_documents
SET category = 'Documentos de Matrícula 2026'
WHERE category = 'Documentos de Matrícula 2025';

-- If you use any foreign keys or references, consider updating them as well.

COMMIT;
