-- 1. Create INSTAGRAM_POSTS table
CREATE TABLE IF NOT EXISTS public.instagram_posts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url text NOT NULL,
    post_url text,
    caption text,
    media_id text UNIQUE,
    media_type text, -- 'IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'
    timestamp timestamptz,
    created_at timestamptz DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Public read access
DROP POLICY IF EXISTS "Public read instagram posts" ON public.instagram_posts;
CREATE POLICY "Public read instagram posts" ON public.instagram_posts FOR SELECT USING (true);

-- Admin write (using service role in API)
