-- Initial Schema for MoreArt Mag
-- Target: Supabase (PostgreSQL)

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE inquiry_type AS ENUM ('general', 'commission', 'press', 'gallery');
CREATE TYPE inquiry_status AS ENUM ('new', 'in_progress', 'replied', 'closed');
CREATE TYPE continent_type AS ENUM ('afrique', 'europe', 'amerique', 'asie', 'oceanie', 'autre');

-- TABLES

-- 1. PROFILES
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'customer' NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ARTWORK_STOCK
CREATE TABLE public.artwork_stock (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artwork_sanity_id TEXT NOT NULL,
    size_sanity_id TEXT NOT NULL,
    total_edition INTEGER, -- NULL = open edition
    remaining INTEGER,
    is_unique BOOLEAN DEFAULT false NOT NULL,
    is_sold BOOLEAN DEFAULT false NOT NULL,
    price_cents INTEGER DEFAULT 0 NOT NULL,
    currency TEXT DEFAULT 'CAD' NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(artwork_sanity_id, size_sanity_id)
);

-- 3. ORDERS
CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    status order_status DEFAULT 'pending' NOT NULL,
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    subtotal_cents INTEGER NOT NULL,
    shipping_cents INTEGER DEFAULT 0 NOT NULL,
    tax_cents INTEGER DEFAULT 0 NOT NULL,
    total_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'CAD' NOT NULL,
    stripe_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT UNIQUE,
    admin_notes TEXT,
    tracking_number TEXT,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDER_ITEMS
CREATE TABLE public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders ON DELETE CASCADE NOT NULL,
    artwork_sanity_id TEXT NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    size_label TEXT NOT NULL,
    edition_number TEXT, -- ex: "12/30"
    quantity INTEGER DEFAULT 1 NOT NULL,
    unit_price_cents INTEGER NOT NULL,
    total_price_cents INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CART_ITEMS
CREATE TABLE public.cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    session_id TEXT, -- for guests
    artwork_sanity_id TEXT NOT NULL,
    size_sanity_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    unit_price_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'CAD' NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- 6. INQUIRIES
CREATE TABLE public.inquiries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type inquiry_type DEFAULT 'general' NOT NULL,
    status inquiry_status DEFAULT 'new' NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    budget_range TEXT,
    requested_size TEXT,
    artwork_reference TEXT,
    metadata JSONB, -- IP, user agent, etc.
    admin_notes TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ROOM_PRESETS
CREATE TABLE public.room_presets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    wall_polygon JSONB NOT NULL, -- normalized coordinates [x,y] * 4
    wall_width_cm FLOAT NOT NULL,
    wall_height_cm FLOAT NOT NULL,
    floor_height_normalized FLOAT DEFAULT 0.9 NOT NULL,
    category TEXT NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. NEWSLETTER_SUBSCRIBERS
CREATE TABLE public.newsletter_subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    is_confirmed BOOLEAN DEFAULT false NOT NULL,
    confirmation_token TEXT,
    unsubscribe_token TEXT DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TRIGGERS & FUNCTIONS

-- A. Auto Updated At
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_artwork_stock_updated_at BEFORE UPDATE ON public.artwork_stock FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- B. Auto Profile Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- C. Order Number Generation (MAM-YYYY-NNNN)
CREATE SEQUENCE order_number_seq;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix TEXT;
    seq_val TEXT;
BEGIN
    year_prefix := to_char(now(), 'YYYY');
    seq_val := lpad(nextval('order_number_seq')::text, 4, '0');
    NEW.order_number := 'MAM-' || year_prefix || '-' || seq_val;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_order_insert
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE PROCEDURE generate_order_number();

-- ROW LEVEL SECURITY (RLS)

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Artwork Stock
ALTER TABLE public.artwork_stock ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view artwork stock" ON public.artwork_stock FOR SELECT USING (true);
CREATE POLICY "Only admins can modify artwork stock" ON public.artwork_stock FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))));

-- Cart Items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own cart items" ON public.cart_items FOR ALL USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- Inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view inquiries" ON public.inquiries FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can update inquiries" ON public.inquiries FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Room Presets
ALTER TABLE public.room_presets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view room presets" ON public.room_presets FOR SELECT USING (true);
CREATE POLICY "Only admins can modify room presets" ON public.room_presets FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Newsletter Subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can manage subscribers" ON public.newsletter_subscribers FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
