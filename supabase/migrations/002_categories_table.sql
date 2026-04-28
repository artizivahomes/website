-- 1. Create CATEGORIES table
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text UNIQUE NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    created_at timestamptz DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Public read
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

-- Admin write (using service role in API)

-- 4. Initial categories seeding
INSERT INTO public.categories (name, slug) VALUES 
('Dining Tables', 'dining-tables'),
('Coffee Tables', 'coffee-tables'),
('Center Pieces', 'center-pieces'),
('3D Wall Hangings', '3d-wall-hangings'),
('Clocks', 'clocks'),
('Custom Artworks', 'custom-artworks')
ON CONFLICT (slug) DO NOTHING;
