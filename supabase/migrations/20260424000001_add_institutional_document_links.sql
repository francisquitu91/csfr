-- Add support for internal visualization links without changing the main storage flow
ALTER TABLE institutional_documents
ADD COLUMN IF NOT EXISTS visualization_url TEXT,
ADD COLUMN IF NOT EXISTS download_url TEXT,
ADD COLUMN IF NOT EXISTS use_visualization_link BOOLEAN NOT NULL DEFAULT FALSE;

-- Backfill records that already point to an external visualization link in file_url
UPDATE institutional_documents
SET
  visualization_url = CASE
    WHEN file_url ~* '(docs\.google\.com|drive\.google\.com)' THEN file_url
    ELSE visualization_url
  END,
  download_url = CASE
    WHEN file_url ~* '(docs\.google\.com|drive\.google\.com)' THEN file_url
    ELSE download_url
  END,
  use_visualization_link = CASE
    WHEN file_url ~* '(docs\.google\.com|drive\.google\.com)' THEN TRUE
    ELSE use_visualization_link
  END
WHERE file_url ~* '(docs\.google\.com|drive\.google\.com)';
