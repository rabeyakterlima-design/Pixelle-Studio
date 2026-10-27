import React, { useState, useEffect } from 'react';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types/database';
import { storeService } from '../../services/storeService';
import { Loader2 } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'featured' | 'bestseller' | 'new'>('featured');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const all = await storeService.getProducts();
      setProducts(all.filter(p => p.is_active));
      setIsLoading(false);
    }
    load();
  }, []);

  const getFilteredProducts = () => {
    if (activeTab === 'featured') {
      const featured = products.filter(p => p.is_featured);
      return featured.length > 0 ? featured : products;
    }
    if (activeTab === 'bestseller') {
      return [...products].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));
    }
    // new arrivals
    return [...products].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const displayed = getFilteredProducts().slice(0, 8);

  return (
    <section className="py-14 bg-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header with Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy">Latest Products</h2>
            <p className="text-xs sm:text-sm text-brand-secondary mt-1">
              Top curated digital kits, templates, and creative assets
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-surface-border rounded-xl shadow-xs">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'featured'
                  ? 'bg-cobalt text-white shadow-xs'
                  : 'text-brand-secondary hover:text-brand-text'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'bestseller'
                  ? 'bg-cobalt text-white shadow-xs'
                  : 'text-brand-secondary hover:text-brand-text'
              }`}
            >
              Best Seller
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'new'
                  ? 'bg-cobalt text-white shadow-xs'
                  : 'text-brand-secondary hover:text-brand-text'
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-cobalt">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm font-medium text-brand-secondary">Loading digital products...</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-surface-border p-8">
            <p className="text-base font-semibold text-navy">No products available in this tab.</p>
            <p className="text-xs text-brand-secondary mt-1">Check back soon or explore other categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayed.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
