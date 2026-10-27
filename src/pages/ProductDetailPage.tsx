import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingCart, Star, ShieldCheck, DownloadCloud, 
  ChevronRight, Check, AlertCircle, RefreshCw, FileText 
} from 'lucide-react';
import { Product, ProductVariant } from '../types/database';
import { storeService } from '../services/storeService';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { formatPrice } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Variable product selections: attribute_id -> value_id
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setIsLoading(true);
      const found = await storeService.getProductBySlug(slug);
      setProduct(found);

      if (found) {
        const initialImg = found.images.find(i => i.is_primary)?.image_url || found.images[0]?.image_url || '';
        setSelectedImage(initialImg);

        // If variable product, preselect first valid option for each attribute
        if (found.is_variable && found.variants && found.variants.length > 0) {
          const firstVariant = found.variants[0];
          const initialSelections: Record<string, string> = {};
          firstVariant.attribute_values.forEach(av => {
            initialSelections[av.attribute_id] = av.value_id;
          });
          setSelectedAttributes(initialSelections);
          if (firstVariant.image_url) {
            setSelectedImage(firstVariant.image_url);
          }
        }

        // Load related products from same category
        const all = await storeService.getProducts();
        const related = all.filter(p => p.id !== found.id && p.category_id === found.category_id && p.is_active).slice(0, 4);
        setRelatedProducts(related);
      }
      setIsLoading(false);
    }
    loadProduct();
  }, [slug]);

  // Find matching variant based on currently selected attributes
  const matchedVariant: ProductVariant | undefined = useMemo(() => {
    if (!product || !product.is_variable || !product.variants) return undefined;
    
    return product.variants.find(variant => {
      // Must match all selected attributes
      return Object.entries(selectedAttributes).every(([attrId, valId]) => {
        return variant.attribute_values.some(v => v.attribute_id === attrId && v.value_id === valId);
      });
    });
  }, [product, selectedAttributes]);

  // Handle attribute selection change
  const handleSelectAttribute = (attrId: string, valId: string) => {
    const updated = { ...selectedAttributes, [attrId]: valId };
    setSelectedAttributes(updated);

    // If matching variant has its own image, update hero image
    if (product?.variants) {
      const match = product.variants.find(variant => {
        return Object.entries(updated).every(([aId, vId]) => {
          return variant.attribute_values.some(v => v.attribute_id === aId && v.value_id === vId);
        });
      });
      if (match?.image_url) {
        setSelectedImage(match.image_url);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 flex flex-col items-center justify-center text-cobalt">
        <RefreshCw className="w-8 h-8 animate-spin mb-2" />
        <p className="text-sm text-brand-secondary">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-navy mb-2">Product Not Found</h2>
        <p className="text-brand-secondary text-sm mb-6">The product you are looking for does not exist or has been unpublished.</p>
        <Link to="/shop" className="bg-cobalt text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-cobalt-hover">
          Return to Shop
        </Link>
      </div>
    );
  }

  // Determine current active pricing & stock
  const currentRegularPrice = matchedVariant ? matchedVariant.regular_price : product.regular_price;
  const currentSalePrice = matchedVariant ? matchedVariant.sale_price : product.sale_price;
  const hasDiscount = currentSalePrice !== null && currentSalePrice !== undefined && currentSalePrice < currentRegularPrice;
  const activePrice = hasDiscount ? currentSalePrice! : currentRegularPrice;
  
  const isUnlimited = matchedVariant ? matchedVariant.unlimited_stock : product.unlimited_stock;
  const stockQty = matchedVariant ? matchedVariant.stock_quantity : product.stock_quantity;
  const isOutOfStock = !isUnlimited && stockQty <= 0;

  const handleAddToCart = () => {
    if (product.is_variable && !matchedVariant) {
      alert('Please select all available options for this product before adding to cart.');
      return;
    }

    const variantLabel = matchedVariant 
      ? matchedVariant.attribute_values.map(a => `${a.attribute_name}: ${a.value}`).join(' / ') 
      : undefined;

    addToCart({
      id: matchedVariant ? `${product.id}:${matchedVariant.id}` : product.id,
      product_id: product.id,
      variant_id: matchedVariant?.id,
      name: product.name,
      variant_label: variantLabel,
      price: activePrice,
      regular_price: currentRegularPrice,
      image_url: selectedImage || product.images[0]?.image_url,
      quantity: quantity,
      unlimited_stock: isUnlimited,
      stock_quantity: stockQty
    });
  };

  return (
    <div className="bg-surface-light min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-brand-secondary mb-8">
          <Link to="/" className="hover:text-cobalt">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-cobalt">Shop</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to={`/shop?category=${product.category.slug}`} className="hover:text-cobalt">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-navy font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Main Grid */}
        <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-card mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-surface-light border border-surface-border relative">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {hasDiscount && (
                  <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    Sale
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img.image_url)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImage === img.image_url ? 'border-cobalt ring-2 ring-cobalt/20' : 'border-surface-border opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Variation Selectors */}
            <div className="lg:col-span-6 flex flex-col">
              
              {/* Category */}
              {product.category && (
                <p className="text-xs font-bold text-cobalt uppercase tracking-wider mb-1.5">
                  {product.category.name}
                </p>
              )}

              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-brand-text">{product.rating || 5.0}</span>
                <span className="text-xs text-brand-secondary">({product.review_count || 24} customer reviews)</span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs font-semibold text-emerald-600">{product.sales_count || 120}+ sales</span>
              </div>

              {/* Pricing Box */}
              <div className="p-4 rounded-2xl bg-surface-light border border-surface-border mb-6 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-navy">
                  {formatPrice(activePrice)}
                </span>
                {hasDiscount && (
                  <span className="text-base text-brand-secondary line-through">
                    {formatPrice(currentRegularPrice)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                    Save {Math.round(((currentRegularPrice - activePrice) / currentRegularPrice) * 100)}%
                  </span>
                )}
                {matchedVariant?.sku && (
                  <span className="ml-auto text-xs text-brand-secondary font-mono">
                    SKU: {matchedVariant.sku}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-sm text-brand-secondary leading-relaxed mb-6">
                {product.short_description || product.description}
              </p>

              {/* Variable Attributes Selector (Size, License, Format, Colour, etc.) */}
              {product.is_variable && product.attributes && product.attributes.length > 0 && (
                <div className="space-y-4 mb-6 pt-4 border-t border-surface-border">
                  {product.attributes.map((attr) => (
                    <div key={attr.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-navy uppercase tracking-wider">
                          Select {attr.name}:
                        </label>
                        <span className="text-xs text-cobalt font-medium">
                          {attr.values?.find(v => v.id === selectedAttributes[attr.id])?.value}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {attr.values?.map((val) => {
                          const isSelected = selectedAttributes[attr.id] === val.id;
                          return (
                            <button
                              key={val.id}
                              onClick={() => handleSelectAttribute(attr.id, val.id)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-cobalt text-white border-cobalt shadow-xs'
                                  : 'bg-white text-brand-text border-surface-border hover:border-cobalt/50'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                              {val.value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stock status indicator */}
              <div className="mb-6 flex items-center gap-2 text-xs">
                {isOutOfStock ? (
                  <span className="flex items-center gap-1 text-rose-600 font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    Currently Out of Stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <Check className="w-4 h-4" />
                    In Stock • Instant Digital Delivery
                  </span>
                )}
              </div>

              {/* Add to Cart Controls */}
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-surface-border">
                <div className="flex items-center border border-surface-border rounded-xl bg-surface-light p-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center font-bold text-brand-secondary hover:text-navy disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-navy">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    disabled={!isUnlimited && quantity >= stockQty}
                    className="w-8 h-8 flex items-center justify-center font-bold text-brand-secondary hover:text-navy disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 bg-cobalt hover:bg-cobalt-hover active:scale-98 text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
              </div>

              {/* Guarantee badges */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-surface-border text-xs text-brand-secondary">
                <div className="flex items-center gap-2">
                  <DownloadCloud className="w-4 h-4 text-cobalt" />
                  <span>Instant Link & Files</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Verified Trx Guarantee</span>
                </div>
              </div>

            </div>

          </div>

          {/* Detailed Description & License Tabs */}
          <div className="mt-12 pt-8 border-t border-surface-border">
            <h3 className="text-lg font-bold text-navy mb-4">Product Overview & License</h3>
            <div className="prose prose-slate max-w-none text-sm text-brand-secondary leading-relaxed space-y-4">
              <p>{product.description}</p>
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <FileText className="w-5 h-5 text-cobalt shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-xs text-navy uppercase">Digital License & Access:</p>
                  <p className="text-xs text-brand-secondary mt-0.5">
                    {product.download_license_terms || 'Upon payment confirmation, digital files and editable Canva template links will become accessible instantly in your Pixelle Studio Account under "Digital Downloads".'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-bold text-navy mb-6">Related Digital Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
