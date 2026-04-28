-- 1. Create CUSTOM USERS table (for credential-based admin login)
CREATE TABLE IF NOT EXISTS public.users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    name text,
    role text DEFAULT 'superadmin',
    created_at timestamptz DEFAULT now()
);

-- 2. Create PRODUCTS table
CREATE TABLE IF NOT EXISTS public.products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug text UNIQUE NOT NULL,
    title text NOT NULL,
    short_description text,
    description text,
    category text NOT NULL,
    price numeric,
    price_on_request boolean DEFAULT false,
    materials text[] DEFAULT '{}',
    dimensions jsonb DEFAULT '{"length": "", "width": "", "height": ""}',
    images text[] DEFAULT '{}',
    featured boolean DEFAULT false,
    is_sold boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Ensure all columns exist if table was already there (for compatibility)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS short_description text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_on_request boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS materials text[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS dimensions jsonb DEFAULT '{"length": "", "width": "", "height": ""}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_sold boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- 3. Create ORDERS table
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    customer_address text NOT NULL,
    customer_city text NOT NULL,
    customer_pin text NOT NULL,
    items jsonb NOT NULL DEFAULT '[]',
    subtotal numeric NOT NULL,
    payment_status text DEFAULT 'pending', -- 'pending', 'paid', 'failed'
    order_status text DEFAULT 'pending', -- 'pending', 'confirmed', 'in_production', 'ready_to_ship', 'delivered'
    payment_id text, -- Razorpay/Stripe Payment ID
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 4. Update ENQUIRIES table (if not exists, create it; otherwise add columns)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'enquiries') THEN
        CREATE TABLE public.enquiries (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            name text NOT NULL,
            email text NOT NULL,
            phone text NOT NULL,
            city_state text,
            categories text[],
            dimensions text,
            materials text[],
            table_base text,
            style_description text,
            inspiration_images text[],
            timeline text,
            discovery_source text,
            status text DEFAULT 'new',
            notes text,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
        );
    ELSE
        -- Add notes and updated_at if they don't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='notes') THEN
            ALTER TABLE public.enquiries ADD COLUMN notes text;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='updated_at') THEN
            ALTER TABLE public.enquiries ADD COLUMN updated_at timestamptz DEFAULT now();
        END IF;
    END IF;
END $$;

-- 5. Enable Row Level Security (RLS) - Basic Setup
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
-- Products: Publicly readable, Writeable only by Service Role
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

-- Enquiries: Publicly insertable, Writeable/Readable only by Service Role
DROP POLICY IF EXISTS "Public insert enquiries" ON public.enquiries;
CREATE POLICY "Public insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Users/Orders: Service Role only (Admin APIs will use createServiceClient)

-- 7. Storage Bucket Setup (Note: SQL cannot create buckets, but it can set policies)
-- This assumes you create a bucket named 'products' in Supabase Dashboard.
-- Policies for 'products' bucket:
-- 1. Public Read Access
-- 2. Service Role Write Access

-- 8. Functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_enquiries_updated_at ON public.enquiries;
CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- SEEDING INSTRUCTIONS:
-- After running this, insert a superadmin user:
-- INSERT INTO public.users (email, password_hash, name) VALUES ('admin@artizivahomes.com', 'HASH_GOES_HERE', 'Super Admin');
