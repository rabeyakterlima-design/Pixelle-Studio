import { 
  Product, Category, ProductVariant, SiteSettings, HomepageSlide, 
  Order, CartItem, PaymentSubmission, DigitalDownload, AuditLog, 
  InventoryMovement, ProductAttribute, Coupon 
} from '../types/database';
import { 
  INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SLIDES, 
  INITIAL_SETTINGS, INITIAL_ORDERS, INITIAL_AUDIT_LOGS, INITIAL_ATTRIBUTES 
} from './mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'pixelle_products',
  CATEGORIES: 'pixelle_categories',
  SLIDES: 'pixelle_slides',
  SETTINGS: 'pixelle_settings',
  ORDERS: 'pixelle_orders',
  ATTRIBUTES: 'pixelle_attributes',
  AUDIT_LOGS: 'pixelle_audit_logs',
  MOVEMENTS: 'pixelle_movements',
  COUPONS: 'pixelle_coupons'
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export const storeService = {
  // -------------------------------------------------------------
  // SETTINGS
  // -------------------------------------------------------------
  async getSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('site_settings').select('key, value');
        if (!error && data && data.length > 0) {
          const general = data.find(s => s.key === 'general')?.value || {};
          const social = data.find(s => s.key === 'social_links')?.value || {};
          const payments = data.find(s => s.key === 'payments')?.value || {};
          return {
            ...INITIAL_SETTINGS,
            ...general,
            social_links: { ...INITIAL_SETTINGS.social_links, ...social },
            payments: { ...INITIAL_SETTINGS.payments, ...payments }
          };
        }
      } catch (err) {
        console.warn('Supabase getSettings error, falling back to local storage', err);
      }
    }
    return getLocal<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async updateSettings(settings: SiteSettings, adminEmail: string = 'admin@pixellestudio.com'): Promise<SiteSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('site_settings').upsert([
          { key: 'general', value: {
            store_name: settings.store_name,
            tagline: settings.tagline,
            currency_symbol: settings.currency_symbol,
            currency_code: settings.currency_code,
            contact_email: settings.contact_email,
            contact_phone: settings.contact_phone,
            business_address: settings.business_address,
            announcement: settings.announcement,
            low_stock_threshold: settings.low_stock_threshold
          }},
          { key: 'social_links', value: settings.social_links },
          { key: 'payments', value: settings.payments }
        ]);
      } catch (err) {
        console.warn('Supabase updateSettings failed, falling back to local storage', err);
      }
    }
    setLocal(STORAGE_KEYS.SETTINGS, settings);
    await this.logAudit(adminEmail, 'UPDATE_SITE_SETTINGS', 'site_settings', 'all', 'Updated store information & payment configuration');
    return settings;
  },

  // -------------------------------------------------------------
  // SLIDES
  // -------------------------------------------------------------
  async getSlides(): Promise<HomepageSlide[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('homepage_slides').select('*').order('display_order', { ascending: true });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getSlides error, falling back to local storage', err);
      }
    }
    return getLocal<HomepageSlide[]>(STORAGE_KEYS.SLIDES, INITIAL_SLIDES);
  },

  async saveSlide(slide: HomepageSlide): Promise<void> {
    const slides = await this.getSlides();
    const idx = slides.findIndex(s => s.id === slide.id);
    if (idx >= 0) {
      slides[idx] = slide;
    } else {
      slides.push({ ...slide, id: `slide-${Date.now()}` });
    }
    setLocal(STORAGE_KEYS.SLIDES, slides);
  },

  async deleteSlide(id: string): Promise<void> {
    const slides = (await this.getSlides()).filter(s => s.id !== id);
    setLocal(STORAGE_KEYS.SLIDES, slides);
  },

  // -------------------------------------------------------------
  // CATEGORIES
  // -------------------------------------------------------------
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getCategories error, falling back to local storage', err);
      }
    }
    const categories = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const products = await this.getProducts();
    // compute real dynamic product count
    return categories.map(cat => ({
      ...cat,
      product_count: products.filter(p => p.category_id === cat.id && p.is_active).length
    }));
  },

  async saveCategory(cat: Partial<Category>): Promise<Category> {
    const categories = await this.getCategories();
    let saved: Category;
    if (cat.id) {
      const idx = categories.findIndex(c => c.id === cat.id);
      saved = { ...categories[idx], ...cat } as Category;
      categories[idx] = saved;
    } else {
      saved = {
        id: `cat-${Date.now()}`,
        name: cat.name || 'New Category',
        slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || `cat-${Date.now()}`,
        description: cat.description || '',
        icon_name: cat.icon_name || 'Folder',
        display_order: cat.display_order ?? categories.length + 1,
        is_active: cat.is_active ?? true,
        product_count: 0
      };
      categories.push(saved);
    }
    setLocal(STORAGE_KEYS.CATEGORIES, categories);
    return saved;
  },

  async deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    const products = await this.getProducts();
    const boundProducts = products.filter(p => p.category_id === id);
    if (boundProducts.length > 0) {
      return { 
        success: false, 
        error: `Cannot delete category: ${boundProducts.length} product(s) are assigned to it. Reassign or delete products first.` 
      };
    }
    const categories = (await this.getCategories()).filter(c => c.id !== id);
    setLocal(STORAGE_KEYS.CATEGORIES, categories);
    return { success: true };
  },

  // -------------------------------------------------------------
  // PRODUCTS & ATTRIBUTES
  // -------------------------------------------------------------
  async getAttributes(): Promise<ProductAttribute[]> {
    return getLocal<ProductAttribute[]>(STORAGE_KEYS.ATTRIBUTES, INITIAL_ATTRIBUTES);
  },

  async saveAttributes(attributes: ProductAttribute[]): Promise<void> {
    setLocal(STORAGE_KEYS.ATTRIBUTES, attributes);
  },

  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*, product_images(*), product_variants(*)').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((p: any) => ({
            ...p,
            images: p.product_images || [],
            variants: p.product_variants || []
          }));
        }
      } catch (err) {
        console.warn('Supabase getProducts error, falling back to local storage', err);
      }
    }
    return getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    const product = products.find(p => p.slug === slug || p.id === slug);
    if (!product) return null;
    
    // Attach category
    const categories = await this.getCategories();
    const cat = categories.find(c => c.id === product.category_id);
    return { ...product, category: cat };
  },

  async saveProduct(prod: Partial<Product>, adminEmail: string = 'admin@pixellestudio.com'): Promise<Product> {
    const products = await this.getProducts();
    let saved: Product;

    // Validate sale price
    if (prod.sale_price && prod.regular_price && Number(prod.sale_price) >= Number(prod.regular_price)) {
      throw new Error('Sale price must be less than regular price.');
    }

    if (prod.id) {
      const idx = products.findIndex(p => p.id === prod.id);
      saved = {
        ...products[idx],
        ...prod,
        updated_at: new Date().toISOString()
      } as Product;
      products[idx] = saved;
      await this.logAudit(adminEmail, 'UPDATE_PRODUCT', 'products', saved.id, `Updated product: ${saved.name}`);
    } else {
      saved = {
        id: `prod-${Date.now()}`,
        name: prod.name || 'Untitled Product',
        slug: prod.slug || prod.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`,
        description: prod.description || '',
        short_description: prod.short_description || '',
        category_id: prod.category_id || '',
        regular_price: Number(prod.regular_price || 0),
        sale_price: prod.sale_price ? Number(prod.sale_price) : null,
        is_variable: Boolean(prod.is_variable),
        is_featured: Boolean(prod.is_featured),
        is_active: prod.is_active ?? true,
        stock_quantity: Number(prod.stock_quantity ?? 999),
        stock_status: prod.stock_status || 'in_stock',
        unlimited_stock: prod.unlimited_stock ?? true,
        download_file_url: prod.download_file_url || '',
        download_file_name: prod.download_file_name || 'digital_asset.zip',
        download_license_terms: prod.download_license_terms || 'Standard license terms apply.',
        seo_title: prod.seo_title || prod.name,
        seo_description: prod.seo_description || prod.short_description,
        rating: 5.0,
        review_count: 0,
        sales_count: 0,
        images: prod.images && prod.images.length > 0 ? prod.images : [
          {
            id: `img-${Date.now()}`,
            image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            alt_text: prod.name,
            display_order: 1,
            is_primary: true
          }
        ],
        variants: prod.variants || [],
        attributes: prod.attributes || [],
        created_at: new Date().toISOString()
      };
      products.unshift(saved);
      await this.logAudit(adminEmail, 'CREATE_PRODUCT', 'products', saved.id, `Created product: ${saved.name}`);
    }

    setLocal(STORAGE_KEYS.PRODUCTS, products);
    return saved;
  },

  async deleteProduct(id: string, adminEmail: string = 'admin@pixellestudio.com'): Promise<void> {
    const products = (await this.getProducts()).filter(p => p.id !== id);
    setLocal(STORAGE_KEYS.PRODUCTS, products);
    await this.logAudit(adminEmail, 'DELETE_PRODUCT', 'products', id, `Deleted product ID: ${id}`);
  },

  // -------------------------------------------------------------
  // ORDERS & CHECKOUT (Server-side price verification & atomic creation)
  // -------------------------------------------------------------
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*, order_items(*), payment_submissions(*)').order('created_at', { ascending: false });
        if (!error && data) {
          return data.map((o: any) => ({
            ...o,
            items: o.order_items || [],
            payment_submission: (o.payment_submissions && o.payment_submissions[0]) || undefined
          }));
        }
      } catch (err) {
        console.warn('Supabase getOrders error, falling back to local storage', err);
      }
    }
    return getLocal<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  async getOrderById(id: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find(o => o.id === id || o.order_number === id) || null;
  },

  async createOrder(payload: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    billing_city: string;
    billing_address?: string;
    order_notes?: string;
    payment_method: 'bkash' | 'nagad' | 'rocket' | 'cod';
    sender_phone?: string;
    transaction_id?: string;
    idempotency_key: string;
    cart_items: CartItem[];
    coupon_code?: string;
    user_id?: string;
  }): Promise<{ success: boolean; order?: Order; error?: string }> {
    // 1. Validate customer input
    if (!payload.customer_name.trim()) return { success: false, error: 'Customer name is required.' };
    if (!payload.customer_email.trim() || !payload.customer_email.includes('@')) {
      return { success: false, error: 'A valid email address is required for digital product delivery.' };
    }
    // Validate Bangladeshi phone number: regex ^(\+?880|0)1[3-9]\d{8}$
    const bdPhoneRegex = /^(\+?880|0)?1[3-9]\d{8}$/;
    const cleanPhone = payload.customer_phone.replace(/[\s-]/g, '');
    if (!bdPhoneRegex.test(cleanPhone)) {
      return { success: false, error: 'Please enter a valid Bangladeshi mobile number (e.g., 01712345678).' };
    }
    if (!payload.cart_items || payload.cart_items.length === 0) {
      return { success: false, error: 'Shopping cart is empty.' };
    }

    // 2. Prevent duplicate submissions using idempotency_key
    const existingOrders = await this.getOrders();
    const existing = existingOrders.find(o => o.idempotency_key === payload.idempotency_key);
    if (existing) {
      return { success: true, order: existing };
    }

    // 3. Prevent duplicate transaction reference ID
    if (payload.transaction_id && payload.transaction_id.trim()) {
      const cleanTrx = payload.transaction_id.trim().toUpperCase();
      const duplicateTrx = existingOrders.find(o => 
        o.payment_submission?.transaction_id?.toUpperCase() === cleanTrx &&
        o.payment_status !== 'rejected'
      );
      if (duplicateTrx) {
        return { 
          success: false, 
          error: `Transaction ID "${payload.transaction_id}" has already been submitted for order #${duplicateTrx.order_number}. Please verify.` 
        };
      }
    }

    // 4. Server-Side Price & Inventory Verification
    const products = await this.getProducts();
    let calculatedSubtotal = 0;
    const validatedItems: Order['items'] = [];

    for (const item of payload.cart_items) {
      const realProduct = products.find(p => p.id === item.product_id);
      if (!realProduct || !realProduct.is_active) {
        return { success: false, error: `Product "${item.name}" is no longer available.` };
      }

      let unitPrice = realProduct.sale_price ?? realProduct.regular_price;
      let variantLabel = undefined;
      let downloadUrl = realProduct.download_file_url;

      if (item.variant_id && realProduct.variants) {
        const variant = realProduct.variants.find(v => v.id === item.variant_id);
        if (variant && variant.is_active) {
          unitPrice = variant.sale_price ?? variant.regular_price;
          variantLabel = variant.attribute_values.map(a => `${a.attribute_name}: ${a.value}`).join(', ');
          if (variant.download_file_url) downloadUrl = variant.download_file_url;

          // Check physical stock if not unlimited
          if (!variant.unlimited_stock && variant.stock_quantity < item.quantity) {
            return { success: false, error: `Variant "${variantLabel}" only has ${variant.stock_quantity} left in stock.` };
          }
        }
      } else if (!realProduct.unlimited_stock && realProduct.stock_quantity < item.quantity) {
        return { success: false, error: `Product "${realProduct.name}" only has ${realProduct.stock_quantity} left in stock.` };
      }

      const itemSubtotal = unitPrice * item.quantity;
      calculatedSubtotal += itemSubtotal;

      validatedItems.push({
        id: `oi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        order_id: '',
        product_id: realProduct.id,
        variant_id: item.variant_id,
        product_name_snapshot: realProduct.name,
        variant_name_snapshot: variantLabel,
        price_snapshot: unitPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        is_digital: true,
        image_url: item.image_url || realProduct.images[0]?.image_url,
        download_file_url: downloadUrl
      });
    }

    // 5. Apply discount if coupon provided
    let discountAmount = 0;
    if (payload.coupon_code) {
      const coupons = getLocal<Coupon[]>(STORAGE_KEYS.COUPONS, [
        { id: 'cpn-1', code: 'PIXELLE10', discount_type: 'percentage', discount_value: 10, min_order_amount: 500, usage_count: 5, is_active: true }
      ]);
      const coupon = coupons.find(c => c.code.toUpperCase() === payload.coupon_code?.trim().toUpperCase() && c.is_active);
      if (coupon && calculatedSubtotal >= coupon.min_order_amount) {
        if (coupon.discount_type === 'percentage') {
          discountAmount = Math.round((calculatedSubtotal * coupon.discount_value) / 100);
          if (coupon.max_discount_amount) {
            discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
          }
        } else {
          discountAmount = coupon.discount_value;
        }
      }
    }

    const totalAmount = Math.max(0, calculatedSubtotal - discountAmount);
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    // Set order items parent ID
    validatedItems.forEach(i => i.order_id = orderId);

    // Initial payment status
    const paymentStatus: Order['payment_status'] = payload.payment_method === 'cod' ? 'unpaid' : 'pending_verification';

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      user_id: payload.user_id,
      customer_name: payload.customer_name.trim(),
      customer_email: payload.customer_email.trim(),
      customer_phone: cleanPhone,
      billing_city: payload.billing_city.trim(),
      billing_address: payload.billing_address?.trim(),
      order_notes: payload.order_notes?.trim(),
      subtotal_amount: calculatedSubtotal,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      currency: 'BDT',
      order_status: 'pending',
      payment_status: paymentStatus,
      payment_method: payload.payment_method,
      idempotency_key: payload.idempotency_key,
      items: validatedItems,
      payment_submission: (payload.transaction_id || payload.sender_phone) ? {
        id: `pay-${Date.now()}`,
        order_id: orderId,
        user_id: payload.user_id,
        payment_method: payload.payment_method,
        sender_phone: payload.sender_phone || cleanPhone,
        transaction_id: payload.transaction_id?.trim().toUpperCase() || 'PENDING',
        amount: totalAmount,
        status: 'pending_verification',
        created_at: new Date().toISOString()
      } : undefined,
      created_at: new Date().toISOString()
    };

    // Update product stock if physical inventory policy
    for (const item of payload.cart_items) {
      const p = products.find(prod => prod.id === item.product_id);
      if (p) {
        if (item.variant_id && p.variants) {
          const v = p.variants.find(varnt => varnt.id === item.variant_id);
          if (v && !v.unlimited_stock) {
            v.stock_quantity = Math.max(0, v.stock_quantity - item.quantity);
            if (v.stock_quantity === 0) v.stock_status = 'out_of_stock';
          }
        } else if (!p.unlimited_stock) {
          p.stock_quantity = Math.max(0, p.stock_quantity - item.quantity);
          if (p.stock_quantity === 0) p.stock_status = 'out_of_stock';
        }
        p.sales_count += item.quantity;
      }
    }
    setLocal(STORAGE_KEYS.PRODUCTS, products);

    // Save order
    existingOrders.unshift(newOrder);
    setLocal(STORAGE_KEYS.ORDERS, existingOrders);

    // Log movement
    await this.logInventoryMovement({
      product_id: validatedItems[0].product_id,
      product_name: validatedItems[0].product_name_snapshot,
      change_quantity: -validatedItems.reduce((acc, i) => acc + i.quantity, 0),
      new_stock_quantity: 999,
      reason: `Order placed #${orderNumber}`,
      reference_order_id: orderId
    });

    return { success: true, order: newOrder };
  },

  async updateOrderStatus(orderId: string, status: Order['order_status'], adminNotes?: string, adminEmail: string = 'admin@pixellestudio.com'): Promise<Order> {
    const orders = await this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    const prev = orders[idx];
    orders[idx] = {
      ...prev,
      order_status: status,
      admin_notes: adminNotes !== undefined ? adminNotes : prev.admin_notes,
      updated_at: new Date().toISOString()
    };

    setLocal(STORAGE_KEYS.ORDERS, orders);
    await this.logAudit(adminEmail, 'UPDATE_ORDER_STATUS', 'orders', orderId, `Changed order #${prev.order_number} status to ${status}`);
    return orders[idx];
  },

  async verifyPayment(orderId: string, action: 'approve' | 'reject', notes?: string, adminEmail: string = 'admin@pixellestudio.com'): Promise<Order> {
    const orders = await this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    const order = orders[idx];
    const isApproved = action === 'approve';

    order.payment_status = isApproved ? 'paid' : 'rejected';
    if (isApproved && order.order_status === 'pending') {
      order.order_status = 'completed'; // Digital orders complete immediately upon confirmed payment
    }
    
    if (order.payment_submission) {
      order.payment_submission.status = isApproved ? 'approved' : 'rejected';
      order.payment_submission.admin_notes = notes || (isApproved ? 'Payment confirmed and verified.' : 'Payment rejected: invalid TrxID or mismatch.');
      order.payment_submission.verified_by = adminEmail;
      order.payment_submission.verified_at = new Date().toISOString();
    }

    order.updated_at = new Date().toISOString();
    orders[idx] = order;
    setLocal(STORAGE_KEYS.ORDERS, orders);

    await this.logAudit(adminEmail, isApproved ? 'APPROVE_PAYMENT' : 'REJECT_PAYMENT', 'payments', orderId, `Payment for order #${order.order_number} marked ${isApproved ? 'PAID' : 'REJECTED'}.`);
    return order;
  },

  // -------------------------------------------------------------
  // DIGITAL DOWNLOADS
  // -------------------------------------------------------------
  async getCustomerDownloads(userEmail: string): Promise<DigitalDownload[]> {
    const orders = await this.getOrders();
    const paidOrders = orders.filter(o => 
      o.customer_email.toLowerCase() === userEmail.toLowerCase() && 
      (o.payment_status === 'paid' || o.order_status === 'completed')
    );

    const downloads: DigitalDownload[] = [];
    paidOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.is_digital && item.download_file_url) {
          downloads.push({
            id: `dl-${order.id}-${item.id}`,
            order_id: order.id,
            order_number: order.order_number,
            product_id: item.product_id,
            product_name: item.product_name_snapshot,
            variant_name: item.variant_name_snapshot,
            download_key: `key_${order.id}_${item.id}_${Math.random().toString(36).substring(7)}`,
            download_file_url: item.download_file_url,
            download_file_name: `${item.product_name_snapshot.replace(/\s+/g, '_')}_PixelleStudio.pdf`,
            download_count: 1,
            max_downloads: 10,
            created_at: order.created_at
          });
        }
      });
    });

    return downloads;
  },

  // -------------------------------------------------------------
  // AUDIT & INVENTORY LOGS
  // -------------------------------------------------------------
  async logAudit(userEmail: string, action: string, entityType: string, entityId: string, details: string): Promise<void> {
    const logs = getLocal<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    logs.unshift({
      id: `log-${Date.now()}`,
      user_email: userEmail,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      created_at: new Date().toISOString()
    });
    setLocal(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100)); // retain last 100
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    return getLocal<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  async logInventoryMovement(movement: Omit<InventoryMovement, 'id' | 'created_at'>): Promise<void> {
    const movements = getLocal<InventoryMovement[]>(STORAGE_KEYS.MOVEMENTS, []);
    movements.unshift({
      ...movement,
      id: `mov-${Date.now()}`,
      created_at: new Date().toISOString()
    });
    setLocal(STORAGE_KEYS.MOVEMENTS, movements.slice(0, 100));
  },

  async getInventoryMovements(): Promise<InventoryMovement[]> {
    return getLocal<InventoryMovement[]>(STORAGE_KEYS.MOVEMENTS, []);
  }
};
