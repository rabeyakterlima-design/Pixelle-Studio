// ==============================================================================
// PIXELLE STUDIO — DATABASE & ENTITY TYPES
// ==============================================================================

export type UserRole = 'admin' | 'customer' | 'moderator';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  city?: string;
  avatar_url?: string;
  is_blocked?: boolean;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  icon_name?: string;
  display_order: number;
  is_active: boolean;
  product_count?: number;
  created_at?: string;
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductAttribute {
  id: string;
  name: string; // e.g. Size, Format, License
  slug: string;
  values?: ProductAttributeValue[];
}

export interface ProductAttributeValue {
  id: string;
  attribute_id: string;
  value: string; // e.g. Small, Canva Link, Commercial
  slug: string;
  color_code?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  regular_price: number;
  sale_price?: number | null;
  stock_quantity: number;
  stock_status: StockStatus;
  unlimited_stock: boolean;
  is_active: boolean;
  image_url?: string;
  download_file_url?: string;
  attribute_values: {
    attribute_id: string;
    attribute_name: string;
    value_id: string;
    value: string;
  }[];
}

export interface ProductImage {
  id: string;
  product_id?: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  category_id: string;
  category?: Category;
  regular_price: number;
  sale_price?: number | null;
  is_variable: boolean;
  is_featured: boolean;
  is_active: boolean;
  stock_quantity: number;
  stock_status: StockStatus;
  unlimited_stock: boolean;
  download_file_url?: string;
  download_file_name?: string;
  download_license_terms?: string;
  seo_title?: string;
  seo_description?: string;
  rating: number;
  review_count: number;
  sales_count: number;
  images: ProductImage[];
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  created_at: string;
  updated_at?: string;
}

export interface CartItem {
  id: string; // unique item id (product_id or product_id:variant_id)
  product_id: string;
  variant_id?: string;
  name: string;
  variant_label?: string; // e.g. "Medium / Commercial License"
  price: number;
  regular_price: number;
  image_url: string;
  quantity: number;
  unlimited_stock: boolean;
  stock_quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'unpaid' | 'pending_verification' | 'paid' | 'rejected' | 'refunded';
export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'cod';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  product_name_snapshot: string;
  variant_name_snapshot?: string;
  price_snapshot: number;
  quantity: number;
  subtotal: number;
  is_digital: boolean;
  image_url?: string;
  download_file_url?: string;
}

export interface PaymentSubmission {
  id: string;
  order_id: string;
  user_id?: string;
  payment_method: PaymentMethod;
  sender_phone: string;
  transaction_id: string;
  amount: number;
  proof_image_url?: string;
  status: 'pending_verification' | 'approved' | 'rejected';
  admin_notes?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  billing_city: string;
  billing_address?: string;
  order_notes?: string;
  subtotal_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  idempotency_key?: string;
  risk_score?: number;
  risk_notes?: string;
  admin_notes?: string;
  items: OrderItem[];
  payment_submission?: PaymentSubmission;
  created_at: string;
  updated_at?: string;
}

export interface DigitalDownload {
  id: string;
  order_id: string;
  order_number: string;
  product_id: string;
  product_name: string;
  variant_name?: string;
  download_key: string;
  download_file_url: string;
  download_file_name: string;
  download_count: number;
  max_downloads: number;
  expires_at?: string;
  created_at: string;
}

export interface HomepageSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_url: string;
  display_order: number;
  is_active: boolean;
}

export interface SiteSettings {
  store_name: string;
  tagline: string;
  currency_symbol: string;
  currency_code: string;
  contact_email: string;
  contact_phone: string;
  business_address: string;
  announcement: string;
  low_stock_threshold: number;
  social_links: {
    facebook: string;
    instagram: string;
    pinterest: string;
    youtube: string;
    twitter: string;
  };
  payments: {
    bkash: {
      enabled: boolean;
      name: string;
      number: string;
      instructions: string;
      display_order: number;
    };
    nagad: {
      enabled: boolean;
      name: string;
      number: string;
      instructions: string;
      display_order: number;
    };
    rocket: {
      enabled: boolean;
      name: string;
      number: string;
      instructions: string;
      display_order: number;
    };
    cod: {
      enabled: boolean;
      name: string;
      instructions: string;
      display_order: number;
    };
  };
}

export interface InventoryMovement {
  id: string;
  product_id: string;
  product_name: string;
  variant_id?: string;
  variant_label?: string;
  change_quantity: number;
  new_stock_quantity: number;
  reason: string;
  reference_order_id?: string;
  admin_email?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_email: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  usage_limit?: number;
  usage_count: number;
  is_active: boolean;
  expires_at?: string;
}
