-- Add the missing admissionFree column to the events table
ALTER TABLE public.events
ADD COLUMN admissionFree boolean DEFAULT false;
