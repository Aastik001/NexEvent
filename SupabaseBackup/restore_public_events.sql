BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    date date NOT NULL,
    "time" text,
    location text,
    organizer text,
    image_url text,
    attendees jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    admissionfree boolean DEFAULT false,
    category text,
    price numeric,
    creator_id text
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'events_new_pkey'
      AND conrelid = 'public.events'::regclass
  ) THEN
    ALTER TABLE ONLY public.events
      ADD CONSTRAINT events_new_pkey PRIMARY KEY (id);
  END IF;
END
$$;

TRUNCATE TABLE public.events;

INSERT INTO public.events (id, title, description, date, "time", location, organizer, image_url, attendees, created_at, updated_at, admissionfree, category, price, creator_id) VALUES
('ebf2833b-a947-4a8f-910a-e1798d5ca833', 'Summer Music Festival', 'A weekend of amazing music performances, food, and fun activities for everyone.', '2025-07-10', '16:00', 'City Park', 'Music Events Co.', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070', '[]'::jsonb, '2025-05-04 09:28:25.124+00', '2025-05-04 09:28:25.124+00', false, 'social', 5, 'f9dbe4f4-6e2e-497c-94b4-1685f39a70e1'),
('3f994a44-94cd-42b1-aa63-ab32f0899e73', 'Workshop: Digital Marketing', 'Learn the latest digital marketing strategies from experts in the field.', '2025-06-06', '13:30', 'Business Center', 'Marketing Pros', 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070', '[]'::jsonb, '2025-05-04 09:29:53.706+00', '2025-05-04 09:29:53.706+00', false, 'education', 10, 'f9dbe4f4-6e2e-497c-94b4-1685f39a70e1'),
('fef49f01-cbad-4371-be94-3943e9b9f9b2', 'Charity Gala Dinner', 'Annual fundraising dinner to support local community initiatives.', '2025-08-05', '19:00', 'Grand Hotel Ballroom', 'Community Foundation', 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=2070', '[]'::jsonb, '2025-05-04 09:31:16.907+00', '2025-05-04 09:31:16.907+00', true, 'social', 0, 'f9dbe4f4-6e2e-497c-94b4-1685f39a70e1'),
('8eb90f62-1131-48df-a522-5a50e8c58741', 'AI and Machine Learning Summit', 'Explore cutting-edge AI technologies and network with industry experts.', '2025-09-20', '10:00', 'Tech Innovation Center', 'AI Innovations LLC', 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070', '[]'::jsonb, '2025-05-04 09:32:36.648+00', '2025-05-04 09:34:30.882+00', false, 'social', 5, 'f9dbe4f4-6e2e-497c-94b4-1685f39a70e1'),
('b5803207-6ea6-43bc-a96a-c626b6cc1e6b', 'Tech Conference 2025', 'Join us for the biggest tech conference of the year with industry leaders and innovators.', '2025-06-15', '09:00', 'Convention Center, Downtown', 'Tech Events Inc.', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2070', '[]'::jsonb, '2025-05-04 09:26:54.705+00', '2025-05-12 19:43:30.112+00', true, 'business', 0, 'f9dbe4f4-6e2e-497c-94b4-1685f39a70e1');

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow delete for event owners" ON public.events;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.events;
DROP POLICY IF EXISTS "Allow public read access" ON public.events;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON public.events;
DROP POLICY IF EXISTS "Allow update for event owners" ON public.events;

CREATE POLICY "Allow delete for event owners"
ON public.events FOR DELETE
TO authenticated
USING (((auth.uid())::text = creator_id));

CREATE POLICY "Allow insert for authenticated users"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow public read access"
ON public.events FOR SELECT
USING (true);

CREATE POLICY "Allow select for authenticated users"
ON public.events FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow update for event owners"
ON public.events FOR UPDATE
TO authenticated
USING (((auth.uid())::text = creator_id));

COMMIT;
