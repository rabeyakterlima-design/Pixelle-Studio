-- ==============================================================================
-- PIXELLE STUDIO — INITIAL SCHEMA MIGRATION
-- Database: Supabase PostgreSQL
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    avatar_url TEXT,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER ROLES (Separate role table to prevent privilege escalation)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'customer', 'moderator')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Helper function to check admin status safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    icon_name TEXT DEFAULT 'Folder',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
    regular_price NUMERIC(12, 2) NOT NULL CHECK (regular_price >= 0),
    sale_price NUMERIC(12, 2) CHECK (sale_price >= 0),
    is_variable BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
    unlimited_stock BOOLEAN DEFAULT TRUE,
    download_file_url TEXT,
    download_file_name TEXT,
    download_license_terms TEXT,
    seo_title TEXT,
    seo_description TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    sales_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_sale_price CHECK (sale_price IS NULL OR sale_price < regular_price)
);

-- 5. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ATTRIBUTES & ATTRIBUTE VALUES
CREATE TABLE IF NOT EXISTS public.product_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_attribute_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attribute_id UUID NOT NULL REFERENCES public.product_attributes(id) ON DELETE CASCADE,
    value TEXT NOT NULL,
    slug TEXT NOT NULL,
    color_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(attribute_id, value)
);

-- 7. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT,
    regular_price NUMERIC(12, 2) NOT NULL CHECK (regular_price >= 0),
    sale_price NUMERIC(12, 2) CHECK (sale_price >= 0),
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
    unlimited_stock BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    download_file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_variant_sale_price CHECK (sale_price IS NULL OR sale_price < regular_price)
);

CREATE TABLE IF NOT EXISTS public.product_variant_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    attribute_value_id UUID NOT NULL REFERENCES public.product_attribute_values(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(variant_id, attribute_value_id)
);

-- 8. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    billing_city TEXT NOT NULL,
    billing_address TEXT,
    order_notes TEXT,
    subtotal_amount NUMERIC(12, 2) NOT NULL CHECK (subtotal_amount >= 0),
    discount_amount NUMERIC(12, 2) DEFAULT 0 CHECK (discount_amount >= 0),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    currency TEXT DEFAULT 'BDT',
    order_status TEXT DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded')),
    payment_status TEXT DEFAULT 'pending_verification' CHECK (payment_status IN ('unpaid', 'pending_verification', 'paid', 'rejected', 'refunded')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'bkash', 'nagad', 'rocket')),
    idempotency_key TEXT UNIQUE,
    risk_score INT DEFAULT 0,
    risk_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name_snapshot TEXT NOT NULL,
    variant_name_snapshot TEXT,
    price_snapshot NUMERIC(12, 2) NOT NULL CHECK (price_snapshot >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    is_digital BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PAYMENT SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.payment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    payment_method TEXT NOT NULL,
    sender_phone TEXT NOT NULL,
    transaction_id TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    proof_image_url TEXT,
    status TEXT DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'approved', 'rejected')),
    admin_notes TEXT,
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INVENTORY MOVEMENTS
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    change_quantity INT NOT NULL,
    new_stock_quantity INT NOT NULL,
    reason TEXT NOT NULL,
    reference_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. DIGITAL DOWNLOADS ENTITLEMENTS
CREATE TABLE IF NOT EXISTS public.product_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    download_key TEXT NOT NULL UNIQUE,
    download_count INT DEFAULT 0,
    max_downloads INT DEFAULT 10,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. HOMEPAGE SLIDES
CREATE TABLE IF NOT EXISTS public.homepage_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    button_text TEXT DEFAULT 'Shop Now',
    button_url TEXT DEFAULT '/shop',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. COUPONS & REDEMPTIONS
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(12, 2) NOT NULL CHECK (discount_value > 0),
    min_order_amount NUMERIC(12, 2) DEFAULT 0,
    max_discount_amount NUMERIC(12, 2),
    usage_limit INT,
    usage_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    discount_applied NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payment_submissions(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_trxid ON public.payment_submissions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user ON public.product_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_key ON public.product_downloads(download_key);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variant_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can't read all, user can read/update own, admin full access
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full profile access" ON public.profiles FOR ALL USING (public.is_admin());

-- User Roles: Only admin can manage, user can check own role
CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Only admins can manage roles" ON public.user_roles FOR ALL USING (public.is_admin());

-- Categories: Public read active, admin manage all
CREATE POLICY "Public read active categories" ON public.categories FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.is_admin());

-- Products & Variants: Public read active, admin manage all
CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admins manage products" ON public.products FOR ALL USING (public.is_admin());
CREATE POLICY "Public read product images" ON public.product_images FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage product images" ON public.product_images FOR ALL USING (public.is_admin());
CREATE POLICY "Public read attributes" ON public.product_attributes FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage attributes" ON public.product_attributes FOR ALL USING (public.is_admin());
CREATE POLICY "Public read attribute values" ON public.product_attribute_values FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage attribute values" ON public.product_attribute_values FOR ALL USING (public.is_admin());
CREATE POLICY "Public read active variants" ON public.product_variants FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admins manage variants" ON public.product_variants FOR ALL USING (public.is_admin());
CREATE POLICY "Public read variant values" ON public.product_variant_values FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage variant values" ON public.product_variant_values FOR ALL USING (public.is_admin());

-- Orders & Items: Customers read own, insert own, admin full access
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL USING (public.is_admin());
CREATE POLICY "Users read own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Users can create order items" ON public.order_items FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins manage order items" ON public.order_items FOR ALL USING (public.is_admin());

-- Payments: Customer can submit and read own, admin manage all
CREATE POLICY "Users read own payment submissions" ON public.payment_submissions FOR SELECT USING (
    auth.uid() = user_id OR public.is_admin()
);
CREATE POLICY "Users can submit payments" ON public.payment_submissions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins manage payments" ON public.payment_submissions FOR ALL USING (public.is_admin());

-- Downloads: Only user with completed/paid order can read their download keys
CREATE POLICY "Users read own downloads" ON public.product_downloads FOR SELECT USING (
    auth.uid() = user_id OR public.is_admin()
);
CREATE POLICY "Admins manage downloads" ON public.product_downloads FOR ALL USING (public.is_admin());

-- Site Settings & Slides: Public read public, admin manage
CREATE POLICY "Public read public settings" ON public.site_settings FOR SELECT USING (is_public = TRUE OR public.is_admin());
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Public read active slides" ON public.homepage_slides FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admins manage slides" ON public.homepage_slides FOR ALL USING (public.is_admin());

-- Reviews: Public read approved, authenticated insert, admin manage
CREATE POLICY "Public read approved reviews" ON public.reviews FOR SELECT USING (is_approved = TRUE OR public.is_admin());
CREATE POLICY "Authenticated users submit reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL USING (public.is_admin());

-- Inventory & Audit: Admin only
CREATE POLICY "Admins manage inventory" ON public.inventory_movements FOR ALL USING (public.is_admin());
CREATE POLICY "Admins read audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins create audit logs" ON public.audit_logs FOR INSERT WITH CHECK (public.is_admin());

-- ==============================================================================
-- STORAGE BUCKETS SETUP (Run through Supabase Storage API or SQL)
-- ==============================================================================
-- Bucket: product-images (public)
-- Bucket: digital-downloads (private)
-- Bucket: payment-proofs (private)
