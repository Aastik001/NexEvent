-- Inspect current columns in the events table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'events';

-- Drop duplicate or unnecessary columns if any
-- Example: drop the 'admissionFree' column if it exists alongside 'admissionfree'
ALTER TABLE public.events
DROP COLUMN IF EXISTS "admissionFree";

-- You can add more DROP COLUMN statements here if other duplicates exist
