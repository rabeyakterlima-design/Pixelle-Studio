-- ==============================================================================
-- PIXELLE STUDIO — SEED DATA & INITIALIZATION
-- ==============================================================================

-- 1. SEED DEFAULT SITE SETTINGS
INSERT INTO public.site_settings (key, value, description, is_public) VALUES
('general', '{
    "store_name": "Pixelle Studio",
    "tagline": "Digital Products for Creative Minds",
    "currency_symbol": "৳",
    "currency_code": "BDT",
    "contact_email": "hello@pixellestudio.com",
    "contact_phone": "+8801 2345 6789",
    "business_address": "Chittagong, Bangladesh",
    "announcement": "Welcome to Pixelle Studio! Instant download on all digital templates & design assets.",
    "low_stock_threshold": 5
}', 'General store configuration and contact info', TRUE),

('social_links', '{
    "facebook": "https://facebook.com/pixellestudio",
    "instagram": "https://instagram.com/pixellestudio",
    "pinterest": "https://pinterest.com/pixellestudio",
    "youtube": "https://youtube.com/@pixellestudio",
    "twitter": "https://twitter.com/pixellestudio"
}', 'Social media profile URLs', TRUE),

('payments', '{
    "bkash": {
        "enabled": true,
        "name": "bKash (Personal / Send Money)",
        "number": "+8801 2345 6789",
        "instructions": "1. Go to your bKash Mobile App or dial *247#\n2. Choose ''Send Money''\n3. Enter our bKash Number: +8801 2345 6789\n4. Enter total BDT amount\n5. Enter reference: your Order #\n6. Confirm with your PIN\n7. Enter your Sender Phone Number & TrxID below.",
        "display_order": 1
    },
    "nagad": {
        "enabled": true,
        "name": "Nagad (Send Money)",
        "number": "+8801 2345 6789",
        "instructions": "1. Open Nagad App or dial *167#\n2. Select ''Send Money''\n3. Enter Receiver Number: +8801 2345 6789\n4. Enter total BDT amount and Order # as reference\n5. Enter your Sender Mobile Number and Transaction ID below.",
        "display_order": 2
    },
    "rocket": {
        "enabled": true,
        "name": "Rocket (DBBL)",
        "number": "+8801 2345 6789",
        "instructions": "1. Dial *322# or open Rocket App\n2. Select ''Send Money''\n3. Enter Rocket Number: +8801 2345 6789\n4. Enter total BDT amount\n5. Enter your Sender Number and Transaction ID below.",
        "display_order": 3
    },
    "cod": {
        "enabled": false,
        "name": "Cash on Delivery",
        "instructions": "Cash on delivery is disabled by default for digital products as files are delivered digitally upon payment confirmation.",
        "display_order": 4
    }
}', 'Payment methods configuration and manual payment instructions', TRUE)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. SEED HOMEPAGE SLIDES
INSERT INTO public.homepage_slides (title, subtitle, image_url, button_text, button_url, display_order, is_active) VALUES
('Beautiful Templates for Your Creative Journey', 'Get instant access to high-quality digital products — from Canva templates to planners, ebooks, graphics and more.', 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1400&q=80', 'Shop Now', '/shop', 1, TRUE),
('Level Up Your Social Presence', 'Ready-to-use aesthetic Instagram and Pinterest layouts designed to drive engagement.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80', 'Explore Templates', '/shop?category=social-media-designs', 2, TRUE),
('Creative Planners & Daily Journals', 'Streamline your daily workflow, goals, and reflections with printable and digital tablet planners.', 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1400&q=80', 'View Planners', '/shop?category=planners-journals', 3, TRUE);

-- 3. SEED CATEGORIES
INSERT INTO public.categories (name, slug, description, icon_name, display_order, is_active) VALUES
('Canva Templates', 'canva-templates', 'Editable Canva templates for marketing, branding, and presentations', 'LayoutTemplate', 1, TRUE),
('Social Media Designs', 'social-media-designs', 'Instagram post kits, story packs, Pinterest pins, and banners', 'Share2', 2, TRUE),
('Planners & Journals', 'planners-journals', 'Productivity planners, habit trackers, and digital notebooks', 'Calendar', 3, TRUE),
('Ebooks', 'ebooks', 'Professional ebook covers, interior layouts, and formatting guides', 'BookOpen', 4, TRUE),
('Graphics & Illustrations', 'graphics-illustrations', 'Vector elements, icon packs, and branding kits', 'Palette', 5, TRUE),
('Digital Papers', 'digital-papers', 'Seamless patterns, high-resolution textures, and scrapbook papers', 'FileText', 6, TRUE),
('Others', 'others', 'Miscellaneous creative assets and utility toolkits', 'Sparkles', 7, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED ATTRIBUTES
INSERT INTO public.product_attributes (name, slug) VALUES
('Size', 'size'),
('Format', 'format'),
('License', 'license'),
('Colour', 'colour')
ON CONFLICT (slug) DO NOTHING;

-- 5. FUNCTION TO BOOTSTRAP FIRST ADMIN SECURELY
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RETURN 'Error: User with email ' || user_email || ' does not exist. Please register first.';
    END IF;

    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    RETURN 'Success: User ' || user_email || ' granted admin privileges.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
