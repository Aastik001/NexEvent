-- Enable Row Level Security on the events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to select from events
CREATE POLICY "Allow select for authenticated users" ON public.events
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a policy to allow authenticated users to insert into events
CREATE POLICY "Allow insert for authenticated users" ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create a policy to allow authenticated users to update their own events
CREATE POLICY "Allow update for event owners" ON public.events
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::uuid = organizer::uuid);

-- Create a policy to allow authenticated users to delete their own events
CREATE POLICY "Allow delete for event owners" ON public.events
  FOR DELETE
  TO authenticated
  USING (auth.uid()::uuid = organizer::uuid);
