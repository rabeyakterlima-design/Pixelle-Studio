import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/common/ProductCard';
import { Product } from '../types/database';
import { storeService } from '../services/storeService';
import { useStore } from '../context/StoreContext';
import { Search, SlidersHorizontal, ArrowUpDown, Filter, Sparkles, X } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, formatPrice } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest');
  const [priceMax, setPriceMax] = useState<number>(3000);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      const all = await storeService.getProducts();
      setProducts(all);
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  const handleCategoryChange = (slug: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', slug);
    }
    setSearchParams(nextParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const nextParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      nextParams.set('search', val);
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setPriceMax(3000);
    setOnlyDiscounted(false);
    setSortBy('newest');
  };

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Must be active
      if (!p.is_active) return false;

      // Category filter
      if (selectedCategory !== 'all') {
        const cat = categories.find(c => c.slug === selectedCategory);
        if (cat && p.category_id !== cat.id) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchShort = p.short_description?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchShort) return false;
      }

      // Price filter
      const effectivePrice = p.sale_price !== null && p.sale_price !== undefined ? p.sale_price : p.regular_price;
      if (effectivePrice > priceMax) return false;

      // Discounted filter
      if (onlyDiscounted && (!p.sale_price || p.sale_price >= p.regular_price)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.sale_price ?? a.regular_price;
      const priceB = b.sale_price ?? b.regular_price;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'popular') return (b.sales_count || 0) - (a.sales_count || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [products, selectedCategory, searchQuery, priceMax, onlyDiscounted, sortBy, categories]);

  return (
    <div className="bg-surface-light min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Shop Digital Products</h1>
          <p className="text-sm text-brand-secondary mt-1">
            Browse our complete catalog of aesthetic templates, journals, ebooks and creator assets
          </p>
        </div>

        {/* Top Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Live Search input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search in catalog..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-4 py-2 text-sm text-brand-text placeholder-brand-secondary focus:outline-none focus:border-cobalt"
            />
            <Search className="w-4 h-4 text-brand-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-surface-light border border-surface-border rounded-xl text-xs font-semibold text-brand-text"
            >
              <Filter className="w-4 h-4 text-cobalt" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-xs text-brand-secondary">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-surface-light border border-surface-border text-brand-text text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-cobalt"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>

        {/* Main Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'} space-y-6`}>
            
            {/* Categories Filter Box */}
            <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs">
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-3">Categories</h3>
              <div className="space-y-1 text-sm">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-cobalt text-white font-semibold'
                      : 'text-brand-text hover:bg-surface-light'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-xs opacity-75">{products.length}</span>
                </button>

                {categories.map((c) => {
                  const count = products.filter(p => p.category_id === c.id && p.is_active).length;
                  const isSelected = selectedCategory === c.slug;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleCategoryChange(c.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                        isSelected
                          ? 'bg-cobalt text-white font-semibold'
                          : 'text-brand-text hover:bg-surface-light'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      <span className="text-xs opacity-75">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter Box */}
            <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs">
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-3">Price Range</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-semibold text-brand-text">
                  <span>৳0</span>
                  <span className="text-cobalt font-bold">Up to {formatPrice(priceMax)}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="50"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-cobalt cursor-pointer"
                />
              </div>
            </div>

            {/* Deals Filter Box */}
            <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs">
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-3">Deals & Offers</h3>
              <label className="flex items-center gap-2.5 text-xs text-brand-text cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyDiscounted}
                  onChange={(e) => setOnlyDiscounted(e.target.checked)}
                  className="rounded text-cobalt focus:ring-cobalt/20 w-4 h-4"
                />
                <span className="font-medium">On Sale Only (Discounted)</span>
              </label>
            </div>

            {/* Clear Filters Button */}
            {(selectedCategory !== 'all' || searchQuery || onlyDiscounted || priceMax < 3000) && (
              <button
                onClick={clearAllFilters}
                className="w-full py-2.5 px-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-3.5 h-3.5" />
                Clear All Filters
              </button>
            )}

          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-brand-secondary">
                Showing <span className="text-navy font-bold">{filteredProducts.length}</span> digital products
              </p>
            </div>

            {isLoading ? (
              <div className="py-24 text-center text-cobalt">
                <div className="w-8 h-8 border-3 border-cobalt border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-brand-secondary">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-surface-border p-12 text-center">
                <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-navy">No products match your criteria</h3>
                <p className="text-xs text-brand-secondary max-w-sm mx-auto mt-1 mb-6">
                  Try adjusting your search terms, changing the category filter, or resetting price range.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-cobalt text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-cobalt-hover transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
