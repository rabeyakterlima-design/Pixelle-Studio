-- ==============================================================================
-- PIXELLE STUDIO — INITIAL PRODUCTS SEED
-- Run this in Supabase SQL Editor to populate initial products
-- ==============================================================================

DO $$
DECLARE
    cat_canva UUID;
    cat_social UUID;
    cat_planners UUID;
    cat_ebooks UUID;
    cat_graphics UUID;
    cat_papers UUID;

    prod_id UUID;
BEGIN
    -- Look up category IDs by slug
    SELECT id INTO cat_canva FROM public.categories WHERE slug = 'canva-templates';
    SELECT id INTO cat_social FROM public.categories WHERE slug = 'social-media-designs';
    SELECT id INTO cat_planners FROM public.categories WHERE slug = 'planners-journals';
    SELECT id INTO cat_ebooks FROM public.categories WHERE slug = 'ebooks';
    SELECT id INTO cat_graphics FROM public.categories WHERE slug = 'graphics-illustrations';
    SELECT id INTO cat_papers FROM public.categories WHERE slug = 'digital-papers';

    -- 1. Social Media Template Pack
    INSERT INTO public.products (
        name, slug, description, short_description, category_id,
        regular_price, sale_price, is_variable, is_featured, is_active,
        stock_quantity, stock_status, unlimited_stock, download_file_url, download_file_name,
        download_license_terms, rating, review_count, sales_count
    ) VALUES (
        'Social Media Template Pack', 'social-media-template-pack',
        'Elevate your online presence with 100+ fully editable Canva templates designed for Instagram posts, carousels, and stories. Clean typography, customizable color palette, and instant access via Canva.',
        '100+ Aesthetic Instagram & Canva social media post kits.',
        cat_canva, 1500, 1200, FALSE, TRUE, TRUE, 999, 'in_stock', TRUE,
        'https://pixellestudio.com/downloads/demo-social-media-pack.zip', 'Social_Media_Template_Pack_Canva.pdf',
        'Personal & Commercial client use permitted. Re-selling file prohibited.', 4.8, 24, 142
    ) RETURNING id INTO prod_id;

    INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
    (prod_id, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', 'Social Media Preview', 1, TRUE);

    -- 2. Daily Planner Template
    INSERT INTO public.products (
        name, slug, description, short_description, category_id,
        regular_price, sale_price, is_variable, is_featured, is_active,
        stock_quantity, stock_status, unlimited_stock, download_file_url, download_file_name,
        download_license_terms, rating, review_count, sales_count
    ) VALUES (
        'Daily Planner Template', 'daily-planner-template',
        'Designed for high performers and creative thinkers. Includes daily goal setting, hourly time blocking, habit trackers, priority matrices, and mindfulness notes.',
        'Minimalist daily productivity planner for GoodNotes and printable PDF.',
        cat_planners, 800, NULL, FALSE, TRUE, TRUE, 999, 'in_stock', TRUE,
        'https://pixellestudio.com/downloads/daily-planner-bundle.pdf', 'Daily_Planner_Hyperlinked_Goodnotes.pdf',
        'For personal productivity use only.', 4.9, 18, 98
    ) RETURNING id INTO prod_id;

    INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
    (prod_id, 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80', 'Daily Planner', 1, TRUE);

    -- 3. Ebook Cover Template
    INSERT INTO public.products (
        name, slug, description, short_description, category_id,
        regular_price, sale_price, is_variable, is_featured, is_active,
        stock_quantity, stock_status, unlimited_stock, download_file_url, download_file_name,
        download_license_terms, rating, review_count, sales_count
    ) VALUES (
        'Ebook Cover Template', 'ebook-cover-template',
        'Make your ebook an instant bestseller with 25 eye-catching Kindle and 3D paperback mockup templates. Easy to edit in Canva or Photoshop.',
        '25 Professional Kindle and 3D paperback book covers.',
        cat_ebooks, 1500, 1000, FALSE, FALSE, TRUE, 999, 'in_stock', TRUE,
        'https://pixellestudio.com/downloads/ebook-cover-kit.zip', 'Ebook_Cover_Kit_Pixelle.zip',
        'Full commercial rights for publishing.', 4.7, 32, 76
    ) RETURNING id INTO prod_id;

    INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
    (prod_id, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', 'Ebook Cover', 1, TRUE);

    -- 4. Minimal Icons Pack
    INSERT INTO public.products (
        name, slug, description, short_description, category_id,
        regular_price, sale_price, is_variable, is_featured, is_active,
        stock_quantity, stock_status, unlimited_stock, download_file_url, download_file_name,
        download_license_terms, rating, review_count, sales_count
    ) VALUES (
        'Minimal Icons Pack', 'minimal-icons-pack',
        '500+ handcrafted vector stroke icons in SVG, PNG, and Figma components. Optimized for mobile UI apps and web design.',
        '500+ Minimalist SVG & PNG vector UI icons.',
        cat_graphics, 600, NULL, FALSE, TRUE, TRUE, 999, 'in_stock', TRUE,
        'https://pixellestudio.com/downloads/minimal-icons-v2.zip', 'Minimal_Icons_Pack_Vector.zip',
        'Free for personal and client commercial projects.', 5.0, 12, 115
    ) RETURNING id INTO prod_id;

    INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
    (prod_id, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', 'Minimal Icons', 1, TRUE);

    -- 5. Digital Paper Pack
    INSERT INTO public.products (
        name, slug, description, short_description, category_id,
        regular_price, sale_price, is_variable, is_featured, is_active,
        stock_quantity, stock_status, unlimited_stock, download_file_url, download_file_name,
        download_license_terms, rating, review_count, sales_count
    ) VALUES (
        'Digital Paper Pack', 'digital-paper-pack',
        '40 Seamless high-resolution 300 DPI pattern papers featuring modern pastel geometries and terrazzo textures.',
        '40 Seamless 300 DPI pastel pattern papers for print & web.',
        cat_papers, 1100, 700, FALSE, FALSE, TRUE, 999, 'in_stock', TRUE,
        'https://pixellestudio.com/downloads/digital-paper-bundle.zip', 'Digital_Papers_Pastel_Textures.zip',
        'Commercial POD allowed.', 4.9, 20, 83
    ) RETURNING id INTO prod_id;

    INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
    (prod_id, 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80', 'Digital Paper Textures', 1, TRUE);

END $$;
