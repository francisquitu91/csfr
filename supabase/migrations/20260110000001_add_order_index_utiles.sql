-- Add order_index column to utiles_escolares table
ALTER TABLE utiles_escolares 
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_utiles_escolares_order ON utiles_escolares(order_index);

-- Update existing records to have order_index
UPDATE utiles_escolares SET order_index = 0 WHERE order_index IS NULL;
