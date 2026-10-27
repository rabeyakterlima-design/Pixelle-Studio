import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '../../types/database';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { formatPrice } = useStore();

  const primaryImage = product.images.find(img => img.is_primary)?.image_url || 
                       product.images[0]?.image_url || 
                       'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';

  const hasDiscount = product.sale_price !== null && product.sale_price !== undefined && product.sale_price < product.regular_price;
  const currentPrice = hasDiscount ? product.sale_price! : product.regular_price;
  const isNew = new Date(product.created_at).getTime() > Date.now() - 86400000 * 7;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If product is variable, redirect to details page so customer selects variations
    if (product.is_variable && product.variants && product.variants.length > 0) {
      window.location.href = `/product/${product.slug}`;
      return;
    }

    addToCart({
      id: product.id,
      product_id: product.id,
      name: product.name,
      price: currentPrice,
      regular_price: product.regular_price,
      image_url: primaryImage,
      quantity: 1,
      unlimited_stock: product.unlimited_stock,
      stock_quantity: product.stock_quantity
    });
  };

  return (
    <div className="group bg-white rounded-2xl border border-surface-border overflow-hidden hover:shadow-card-hover hover:border-cobalt/40 transition-all duration-300 flex flex-col h-full">
      
      {/* Image Container with Badges */}
      <Link to={`/product/${product.slug}`} className="relative aspect-4/3 bg-surface-light overflow-hidden block">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              Sale
            </span>
          )}
          {isNew && !hasDiscount && (
            <span className="bg-cobalt text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              New
            </span>
          )}
        </div>

        {/* Quick View Overlay Icon */}
        <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 backdrop-blur-xs text-navy text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Category */}
        {product.category && (
          <p className="text-[11px] font-semibold text-brand-secondary uppercase tracking-wider mb-1">
            {product.category.name}
          </p>
        )}

        {/* Title */}
        <Link to={`/product/${product.slug}`} className="block mb-2">
          <h3 className="text-sm sm:text-base font-bold text-navy group-hover:text-cobalt transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3 text-xs">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400' : 'text-slate-200'}`} 
              />
            ))}
          </div>
          <span className="text-brand-secondary font-medium">({product.review_count || 18})</span>
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-auto pt-3 border-t border-surface-border/60 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-navy">
                {product.is_variable ? `From ${formatPrice(currentPrice)}` : formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-brand-secondary line-through">
                  {formatPrice(product.regular_price)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">Instant Download</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-cobalt text-white hover:bg-cobalt-hover active:scale-95 transition-all shadow-xs flex items-center gap-1.5 text-xs font-semibold"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

      </div>

    </div>
  );
};
