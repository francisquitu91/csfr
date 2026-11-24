ALTER TABLE institutional_documents
  DROP CONSTRAINT IF EXISTS institutional_documents_category_check;

UPDATE institutional_documents
SET category = 'Matrícula'
WHERE category IN (
  'Documentos de Matrícula 2025',
  'Documentos de Matrícula 2026',
  'Matrícula 2026'
);

ALTER TABLE institutional_documents
  ADD CONSTRAINT institutional_documents_category_check
  CHECK (category IN (
    'Matrícula',
    'Documentos, protocolos y reglamentos del Colegio',
    'Seguros escolares',
    'Otros'
  ));
