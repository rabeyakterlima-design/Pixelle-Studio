import { Product, Category, HomepageSlide, SiteSettings, Order, UserProfile, AuditLog, ProductAttribute } from '../types/database';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Canva Templates',
    slug: 'canva-templates',
    description: 'Editable aesthetic Canva templates for social media, marketing, and businesses.',
    icon_name: 'LayoutTemplate',
    display_order: 1,
    is_active: true,
    product_count: 8
  },
  {
    id: 'cat-2',
    name: 'Social Media Designs',
    slug: 'social-media-designs',
    description: 'Instagram feed posts, stories, carousels, and Pinterest pin sets.',
    icon_name: 'Share2',
    display_order: 2,
    is_active: true,
    product_count: 12
  },
  {
    id: 'cat-3',
    name: 'Planners & Journals',
    slug: 'planners-journals',
    description: 'Daily, weekly, and monthly digital productivity planners and printable journals.',
    icon_name: 'Calendar',
    display_order: 3,
    is_active: true,
    product_count: 6
  },
  {
    id: 'cat-4',
    name: 'Ebooks',
    slug: 'ebooks',
    description: 'Ready-to-publish ebook templates, cover mockups, and layout designs.',
    icon_name: 'BookOpen',
    display_order: 4,
    is_active: true,
    product_count: 5
  },
  {
    id: 'cat-5',
    name: 'Graphics & Illustrations',
    slug: 'graphics-illustrations',
    description: 'Custom vector packs, icon sets, aesthetic stickers, and badges.',
    icon_name: 'Palette',
    display_order: 5,
    is_active: true,
    product_count: 9
  },
  {
    id: 'cat-6',
    name: 'Digital Papers',
    slug: 'digital-papers',
    description: 'Seamless patterns, hand-drawn textures, and scrapbooking paper bundles.',
    icon_name: 'FileText',
    display_order: 6,
    is_active: true,
    product_count: 7
  },
  {
    id: 'cat-7',
    name: 'Others',
    slug: 'others',
    description: 'Brand identity guidelines, font pairings, and utility spreadsheets.',
    icon_name: 'Sparkles',
    display_order: 7,
    is_active: true,
    product_count: 3
  }
];

export const INITIAL_SLIDES: HomepageSlide[] = [
  {
    id: 'slide-1',
    title: 'Beautiful Templates for Your Creative Journey',
    subtitle: 'Get instant access to high-quality digital products — from Canva templates to planners, ebooks, graphics and more.',
    image_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80',
    button_text: 'Shop Now',
    button_url: '/shop',
    display_order: 1,
    is_active: true
  },
  {
    id: 'slide-2',
    title: 'Transform Your Social Media Brand',
    subtitle: 'Stand out on Instagram, TikTok, and Pinterest with curated modern minimalist design kits.',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    button_text: 'View Social Kits',
    button_url: '/shop?category=social-media-designs',
    display_order: 2,
    is_active: true
  },
  {
    id: 'slide-3',
    title: 'Productivity Systems & Digital Planners',
    subtitle: 'Streamline your habits, finance, and goals with hyperlinked GoodNotes and printable templates.',
    image_url: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1200&q=80',
    button_text: 'Explore Planners',
    button_url: '/shop?category=planners-journals',
    display_order: 3,
    is_active: true
  }
];

export const INITIAL_ATTRIBUTES: ProductAttribute[] = [
  {
    id: 'attr-1',
    name: 'Size',
    slug: 'size',
    values: [
      { id: 'val-s', attribute_id: 'attr-1', value: 'Small', slug: 'small' },
      { id: 'val-m', attribute_id: 'attr-1', value: 'Medium', slug: 'medium' },
      { id: 'val-l', attribute_id: 'attr-1', value: 'Large', slug: 'large' }
    ]
  },
  {
    id: 'attr-2',
    name: 'Colour',
    slug: 'colour',
    values: [
      { id: 'val-c-blue', attribute_id: 'attr-2', value: 'Blue', slug: 'blue', color_code: '#4169E1' },
      { id: 'val-c-black', attribute_id: 'attr-2', value: 'Black', slug: 'black', color_code: '#17294B' },
      { id: 'val-c-white', attribute_id: 'attr-2', value: 'White', slug: 'white', color_code: '#FFFFFF' }
    ]
  },
  {
    id: 'attr-3',
    name: 'License',
    slug: 'license',
    values: [
      { id: 'val-lic-personal', attribute_id: 'attr-3', value: 'Personal Use', slug: 'personal' },
      { id: 'val-lic-commercial', attribute_id: 'attr-3', value: 'Commercial License', slug: 'commercial' }
    ]
  },
  {
    id: 'attr-4',
    name: 'Format',
    slug: 'format',
    values: [
      { id: 'val-fmt-canva', attribute_id: 'attr-4', value: 'Canva Template Link', slug: 'canva' },
      { id: 'val-fmt-pdf', attribute_id: 'attr-4', value: 'Printable PDF', slug: 'pdf' },
      { id: 'val-fmt-psd', attribute_id: 'attr-4', value: 'Photoshop PSD', slug: 'psd' }
    ]
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Social Media Template Pack',
    slug: 'social-media-template-pack',
    category_id: 'cat-1',
    description: 'Elevate your online presence with 100+ fully editable Canva templates designed for Instagram posts, carousels, and stories. Clean typography, customizable color palette, and instant access via Canva.',
    short_description: '100+ Aesthetic Instagram & Canva social media post kits.',
    regular_price: 1500,
    sale_price: 1200,
    is_variable: false,
    is_featured: true,
    is_active: true,
    stock_quantity: 999,
    stock_status: 'in_stock',
    unlimited_stock: true,
    download_file_url: 'https://pixellestudio.com/downloads/demo-social-media-pack.zip',
    download_file_name: 'Social_Media_Template_Pack_Canva.pdf',
    download_license_terms: 'Personal & Commercial client use permitted. Re-selling file prohibited.',
    seo_title: 'Social Media Template Pack — Pixelle Studio',
    seo_description: '100+ editable aesthetic Canva templates for Instagram and social growth.',
    rating: 4.8,
    review_count: 24,
    sales_count: 142,
    images: [
      {
        id: 'img-1-1',
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        alt_text: 'Social Media Template Pack Preview',
        display_order: 1,
        is_primary: true
      },
      {
        id: 'img-1-2',
        image_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
        alt_text: 'Templates on Laptop',
        display_order: 2,
        is_primary: false
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'prod-2',
    name: 'Daily Planner Template',
    slug: 'daily-planner-template',
    category_id: 'cat-3',
    description: 'Designed for high performers and creative thinkers. Includes daily goal setting, hourly time blocking, habit trackers, priority matrices, and mindfulness notes. Compatible with GoodNotes, Notability, and PDF printers.',
    short_description: 'Minimalist daily productivity planner for GoodNotes and printable PDF.',
    regular_price: 800,
    sale_price: null,
    is_variable: false,
    is_featured: true,
    is_active: true,
    stock_quantity: 999,
    stock_status: 'in_stock',
    unlimited_stock: true,
    download_file_url: 'https://pixellestudio.com/downloads/daily-planner-bundle.pdf',
    download_file_name: 'Daily_Planner_Hyperlinked_Goodnotes.pdf',
    download_license_terms: 'For personal productivity use only.',
    seo_title: 'Daily Planner Template — Pixelle Studio',
    seo_description: 'Minimalist daily productivity planner printable and GoodNotes ready.',
    rating: 4.9,
    review_count: 18,
    sales_count: 98,
    images: [
      {
        id: 'img-2-1',
        image_url: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80',
        alt_text: 'Daily Planner Template Sheets',
        display_order: 1,
        is_primary: true
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'prod-3',
    name: 'Ebook Cover Template',
    slug: 'ebook-cover-template',
    category_id: 'cat-4',
    description: 'Make your ebook an instant bestseller with 25 eye-catching Kindle and 3D paperback mockup templates. Easy to edit in Canva or Photoshop with smart typography and gradient aesthetics.',
    short_description: '25 Professional Kindle and 3D paperback book covers.',
    regular_price: 1500,
    sale_price: 1000,
    is_variable: false,
    is_featured: false,
    is_active: true,
    stock_quantity: 999,
    stock_status: 'in_stock',
    unlimited_stock: true,
    download_file_url: 'https://pixellestudio.com/downloads/ebook-cover-kit.zip',
    download_file_name: 'Ebook_Cover_Kit_Pixelle.zip',
    download_license_terms: 'Full commercial rights for publishing.',
    seo_title: 'Ebook Cover Template Kit — Pixelle Studio',
    seo_description: '25 Professional Kindle and paperback mockup templates.',
    rating: 4.7,
    review_count: 32,
    sales_count: 76,
    images: [
      {
        id: 'img-3-1',
        image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        alt_text: 'Ebook Cover Template Mockup',
        display_order: 1,
        is_primary: true
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'prod-4',
    name: 'Minimal Icons Pack',
    slug: 'minimal-icons-pack',
    category_id: 'cat-5',
    description: '500+ handcrafted vector stroke icons in SVG, PNG, and Figma components. Optimized for mobile UI apps, dashboard web design, and creative pitch decks.',
    short_description: '500+ Minimalist SVG & PNG vector UI icons.',
    regular_price: 600,
    sale_price: null,
    is_variable: false,
    is_featured: true,
    is_active: true,
    stock_quantity: 999,
    stock_status: 'in_stock',
    unlimited_stock: true,
    download_file_url: 'https://pixellestudio.com/downloads/minimal-icons-v2.zip',
    download_file_name: 'Minimal_Icons_Pack_Vector.zip',
    download_license_terms: 'Free for personal and client commercial projects.',
    seo_title: 'Minimal Icons Pack — Pixelle Studio',
    seo_description: '500+ Handcrafted vector stroke icons for UI designers.',
    rating: 5.0,
    review_count: 12,
    sales_count: 115,
    images: [
      {
        id: 'img-4-1',
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        alt_text: 'Minimal Icon Set Grid',
        display_order: 1,
        is_primary: true
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-5',
    name: 'Digital Paper Pack',
    slug: 'digital-paper-pack',
    category_id: 'cat-6',
    description: '40 Seamless high-resolution 300 DPI pattern papers featuring modern pastel geometries, terrazzo textures, and botanical line drawings. Perfect for packaging and print-on-demand.',
    short_description: '40 Seamless 300 DPI pastel pattern papers for print & web.',
    regular_price: 1100,
    sale_price: 700,
    is_variable: false,
    is_featured: false,
    is_active: true,
    stock_quantity: 999,
    stock_status: 'in_stock',
    unlimited_stock: true,
    download_file_url: 'https://pixellestudio.com/downloads/digital-paper-bundle.zip',
    download_file_name: 'Digital_Papers_Pastel_Textures.zip',
    download_license_terms: 'Commercial POD allowed.',
    seo_title: 'Digital Paper Pack — Pixelle Studio',
    seo_description: '40 Seamless high-resolution 300 DPI pattern papers.',
    rating: 4.9,
    review_count: 20,
    sales_count: 83,
    images: [
      {
        id: 'img-5-1',
        image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
        alt_text: 'Digital Paper Textures',
        display_order: 1,
        is_primary: true
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 'prod-6',
    name: 'Premium Canva Template Suite',
    slug: 'premium-canva-template-suite',
    category_id: 'cat-1',
    description: 'The ultimate digital creator toolkit. Features complete branding kits, pitch deck slides, social media reels & carousels, client proposals, and invoices. Choose from multiple format packages and license tiers.',
    short_description: 'All-in-one branding, pitch deck & social media Canva master kit.',
    regular_price: 1000,
    sale_price: 700,
    is_variable: true,
    is_featured: true,
    is_active: true,
    stock_quantity: 999,
    stock_status: 'in_stock',
    unlimited_stock: true,
    download_file_url: 'https://pixellestudio.com/downloads/canva-master-suite.pdf',
    download_file_name: 'Canva_Master_Suite_Access.pdf',
    seo_title: 'Premium Canva Template Suite — Pixelle Studio',
    seo_description: 'All-in-one variable digital product suite with custom licenses.',
    rating: 4.9,
    review_count: 45,
    sales_count: 210,
    images: [
      {
        id: 'img-6-1',
        image_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
        alt_text: 'Premium Canva Master Kit',
        display_order: 1,
        is_primary: true
      },
      {
        id: 'img-6-2',
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        alt_text: 'Mobile layouts',
        display_order: 2,
        is_primary: false
      }
    ],
    attributes: [
      {
        id: 'attr-1',
        name: 'Size',
        slug: 'size',
        values: [
          { id: 'val-s', attribute_id: 'attr-1', value: 'Small (20 Templates)', slug: 'small' },
          { id: 'val-m', attribute_id: 'attr-1', value: 'Medium (60 Templates)', slug: 'medium' },
          { id: 'val-l', attribute_id: 'attr-1', value: 'Large (150+ Templates)', slug: 'large' }
        ]
      },
      {
        id: 'attr-3',
        name: 'License',
        slug: 'license',
        values: [
          { id: 'val-lic-personal', attribute_id: 'attr-3', value: 'Personal Use', slug: 'personal' },
          { id: 'val-lic-commercial', attribute_id: 'attr-3', value: 'Commercial License', slug: 'commercial' }
        ]
      }
    ],
    variants: [
      {
        id: 'var-1',
        product_id: 'prod-6',
        sku: 'CANVA-SM-PERS',
        regular_price: 1000,
        sale_price: 700,
        stock_quantity: 999,
        stock_status: 'in_stock',
        unlimited_stock: true,
        is_active: true,
        image_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
        attribute_values: [
          { attribute_id: 'attr-1', attribute_name: 'Size', value_id: 'val-s', value: 'Small (20 Templates)' },
          { attribute_id: 'attr-3', attribute_name: 'License', value_id: 'val-lic-personal', value: 'Personal Use' }
        ]
      },
      {
        id: 'var-2',
        product_id: 'prod-6',
        sku: 'CANVA-MED-PERS',
        regular_price: 1200,
        sale_price: 850,
        stock_quantity: 999,
        stock_status: 'in_stock',
        unlimited_stock: true,
        is_active: true,
        image_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
        attribute_values: [
          { attribute_id: 'attr-1', attribute_name: 'Size', value_id: 'val-m', value: 'Medium (60 Templates)' },
          { attribute_id: 'attr-3', attribute_name: 'License', value_id: 'val-lic-personal', value: 'Personal Use' }
        ]
      },
      {
        id: 'var-3',
        product_id: 'prod-6',
        sku: 'CANVA-LRG-COMM',
        regular_price: 1500,
        sale_price: 1100,
        stock_quantity: 999,
        stock_status: 'in_stock',
        unlimited_stock: true,
        is_active: true,
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        attribute_values: [
          { attribute_id: 'attr-1', attribute_name: 'Size', value_id: 'val-l', value: 'Large (150+ Templates)' },
          { attribute_id: 'attr-3', attribute_name: 'License', value_id: 'val-lic-commercial', value: 'Commercial License' }
        ]
      }
    ],
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  store_name: 'Pixelle Studio',
  tagline: 'Digital Products for Creative Minds',
  currency_symbol: '৳',
  currency_code: 'BDT',
  contact_email: 'hello@pixellestudio.com',
  contact_phone: '+8801 2345 6789',
  business_address: 'Chittagong, Bangladesh',
  announcement: '✨ Get instant downloads on all digital design templates & packs!',
  low_stock_threshold: 5,
  social_links: {
    facebook: 'https://facebook.com/pixellestudio',
    instagram: 'https://instagram.com/pixellestudio',
    pinterest: 'https://pinterest.com/pixellestudio',
    youtube: 'https://youtube.com/@pixellestudio',
    twitter: 'https://twitter.com/pixellestudio'
  },
  payments: {
    bkash: {
      enabled: true,
      name: 'bKash (Send Money)',
      number: '+8801 2345 6789',
      instructions: "1. Open your bKash App or dial *247#\n2. Select 'Send Money'\n3. Enter Receiver Number: +8801 2345 6789\n4. Enter total BDT amount and your Order # as Reference\n5. Enter your bKash PIN to confirm\n6. Copy the TrxID and enter below.",
      display_order: 1
    },
    nagad: {
      enabled: true,
      name: 'Nagad (Send Money)',
      number: '+8801 2345 6789',
      instructions: "1. Open Nagad App or dial *167#\n2. Select 'Send Money'\n3. Enter Receiver Number: +8801 2345 6789\n4. Enter total BDT amount and your Order # as Reference\n5. Confirm with your PIN\n6. Enter your Sender Number and TrxID below.",
      display_order: 2
    },
    rocket: {
      enabled: true,
      name: 'Rocket (DBBL)',
      number: '+8801 2345 6789',
      instructions: "1. Open Rocket App or dial *322#\n2. Select 'Send Money'\n3. Enter Rocket Number: +8801 2345 6789\n4. Enter the exact BDT amount\n5. Confirm and save the Transaction ID.",
      display_order: 3
    },
    cod: {
      enabled: false,
      name: 'Cash on Delivery (COD)',
      instructions: 'Cash on Delivery is unavailable for instant downloadable digital items.',
      display_order: 4
    }
  }
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    order_number: 'ORD-9301',
    customer_name: 'Rahima Akter',
    customer_email: 'rahima@example.com',
    customer_phone: '+8801712345678',
    billing_city: 'Dhaka',
    billing_address: 'Dhanmondi 27, Dhaka',
    subtotal_amount: 1200,
    discount_amount: 0,
    total_amount: 1200,
    currency: 'BDT',
    order_status: 'pending',
    payment_status: 'pending_verification',
    payment_method: 'bkash',
    payment_submission: {
      id: 'pay-1',
      order_id: 'ord-1001',
      payment_method: 'bkash',
      sender_phone: '+8801712345678',
      transaction_id: 'BK9X77A12',
      amount: 1200,
      status: 'pending_verification',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    items: [
      {
        id: 'item-1',
        order_id: 'ord-1001',
        product_id: 'prod-1',
        product_name_snapshot: 'Social Media Template Pack',
        price_snapshot: 1200,
        quantity: 1,
        subtotal: 1200,
        is_digital: true,
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
        download_file_url: 'https://pixellestudio.com/downloads/demo-social-media-pack.zip'
      }
    ],
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'ord-1002',
    order_number: 'ORD-9302',
    customer_name: 'Samiul Islam',
    customer_email: 'samiul@example.com',
    customer_phone: '+8801812345678',
    billing_city: 'Chittagong',
    billing_address: 'GEC Circle, Chittagong',
    subtotal_amount: 800,
    discount_amount: 0,
    total_amount: 800,
    currency: 'BDT',
    order_status: 'completed',
    payment_status: 'paid',
    payment_method: 'nagad',
    payment_submission: {
      id: 'pay-2',
      order_id: 'ord-1002',
      payment_method: 'nagad',
      sender_phone: '+8801812345678',
      transaction_id: 'NGD4982110',
      amount: 800,
      status: 'approved',
      verified_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      created_at: new Date(Date.now() - 3600000 * 10).toISOString()
    },
    items: [
      {
        id: 'item-2',
        order_id: 'ord-1002',
        product_id: 'prod-2',
        product_name_snapshot: 'Daily Planner Template',
        price_snapshot: 800,
        quantity: 1,
        subtotal: 800,
        is_digital: true,
        image_url: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=400&q=80',
        download_file_url: 'https://pixellestudio.com/downloads/daily-planner-bundle.pdf'
      }
    ],
    created_at: new Date(Date.now() - 3600000 * 10).toISOString()
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    user_email: 'system',
    action: 'STORE_INITIALIZED',
    entity_type: 'site_settings',
    entity_id: 'settings',
    details: 'Initial store configuration and digital product catalog loaded successfully.',
    created_at: new Date().toISOString()
  }
];

export const DEMO_ADMIN: UserProfile = {
  id: 'usr-admin-01',
  email: 'admin@pixellestudio.com',
  full_name: 'Studio Administrator',
  phone: '+8801 2345 6789',
  address: 'Nasirabad, Chittagong',
  city: 'Chittagong',
  role: 'admin',
  created_at: new Date().toISOString()
};

export const DEMO_CUSTOMER: UserProfile = {
  id: 'usr-cust-01',
  email: 'customer@pixellestudio.com',
  full_name: 'Tanzir Hassan',
  phone: '+8801712987654',
  address: 'Mirpur DOHS, Dhaka',
  city: 'Dhaka',
  role: 'customer',
  created_at: new Date().toISOString()
};
