-- Add podcast column to distinguish scripts by show
ALTER TABLE scripts ADD COLUMN IF NOT EXISTS podcast text NOT NULL DEFAULT 'ftbp';

-- Tag any existing scripts without a podcast as ftbp (they were all created here)
UPDATE scripts SET podcast = 'ftbp' WHERE podcast IS NULL OR podcast = '';
