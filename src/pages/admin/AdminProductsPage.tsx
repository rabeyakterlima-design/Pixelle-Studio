import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit3, Trash2, Eye, Check, 
  X, Image as ImageIcon, Sparkles, Layers, AlertCircle 
} from 'lucide-react';
import { Product, Category, ProductVariant, ProductAttribute } from '../../types/database';
import { storeService } from '../../services/storeService';
import { useStore } from '../../context/StoreContext';

export const AdminProductsPage: React.FC = () => {
  const { categories, formatPrice } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [regularPrice, setRegularPrice] = useState<number>(1000);
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [isVariable, setIsVariable] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [unlimitedStock, setUnlimitedStock] = useState(true);
  const [stockQuantity, setStockQuantity] = useState(999);
  const [downloadFileUrl, setDownloadFileUrl] = useState('');
  const [downloadFileName, setDownloadFileName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState('');

  // Variants state for variable products
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await storeService.getProducts();
    setProducts(data);
    setIsLoading(false);
  };

  const handleOpenModal = (prod?: Product) => {
    setFormError('');
    if (prod) {
      setEditingProduct(prod);
      setName(prod.name);
      setSlug(prod.slug);
      setCategoryId(prod.category_id);
      setDescription(prod.description);
      setShortDescription(prod.short_description || '');
      setRegularPrice(prod.regular_price);
      setSalePrice(prod.sale_price ?? '');
      setIsVariable(prod.is_variable);
      setIsFeatured(prod.is_featured);
      setIsActive(prod.is_active);
      setUnlimitedStock(prod.unlimited_stock);
      setStockQuantity(prod.stock_quantity);
      setDownloadFileUrl(prod.download_file_url || '');
      setDownloadFileName(prod.download_file_name || '');
      setImageUrl(prod.images[0]?.image_url || '');
      setVariants(prod.variants || []);
    } else {
      setEditingProduct(null);
      setName('');
      setSlug('');
      setCategoryId(categories[0]?.id || '');
      setDescription('');
      setShortDescription('');
      setRegularPrice(1200);
      setSalePrice(850);
      setIsVariable(false);
      setIsFeatured(false);
      setIsActive(true);
      setUnlimitedStock(true);
      setStockQuantity(999);
      setDownloadFileUrl('https://pixellestudio.com/downloads/sample-pack.zip');
      setDownloadFileName('Pixelle_Template_Bundle.zip');
      setImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
      setVariants([]);
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (salePrice !== '' && Number(salePrice) >= Number(regularPrice)) {
      setFormError('Sale price must be strictly less than regular price.');
      return;
    }

    try {
      await storeService.saveProduct({
        id: editingProduct?.id,
        name: name.trim(),
        slug: slug.trim() || undefined,
        category_id: categoryId,
        description,
        short_description: shortDescription,
        regular_price: Number(regularPrice),
        sale_price: salePrice !== '' ? Number(salePrice) : null,
        is_variable: isVariable,
        is_featured: isFeatured,
        is_active: isActive,
        unlimited_stock: unlimitedStock,
        stock_quantity: Number(stockQuantity),
        download_file_url: downloadFileUrl,
        download_file_name: downloadFileName,
        images: [
          {
            id: `img-${Date.now()}`,
            image_url: imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            alt_text: name,
            display_order: 1,
            is_primary: true
          }
        ],
        variants: isVariable ? variants : []
      });

      setIsModalOpen(false);
      await loadProducts();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${prodName}"?`)) {
      await storeService.deleteProduct(id);
      await loadProducts();
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Product Management</h1>
          <p className="text-xs text-brand-secondary mt-1">
            Manage your digital products, Canva templates, planners, and variable attributes
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-cobalt hover:bg-cobalt-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search products by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-cobalt"
          />
          <Search className="w-4 h-4 text-brand-secondary absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <span className="text-xs font-semibold text-brand-secondary">
          Total: <strong className="text-navy">{filteredProducts.length}</strong> items
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-light border-b border-surface-border text-brand-secondary uppercase font-semibold">
              <tr>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (BDT)</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredProducts.map((p) => {
                const cat = categories.find(c => c.id === p.category_id);
                return (
                  <tr key={p.id} className="hover:bg-surface-light/40 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]?.image_url || '/placeholder.png'}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-surface-border shrink-0"
                        />
                        <div>
                          <p className="font-bold text-navy text-xs">{p.name}</p>
                          <p className="text-[10px] text-brand-secondary font-mono">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-brand-secondary">
                      {cat?.name || 'Uncategorized'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-navy">
                      {p.sale_price ? (
                        <span>
                          {formatPrice(p.sale_price)}{' '}
                          <span className="line-through text-brand-secondary text-[10px]">
                            {formatPrice(p.regular_price)}
                          </span>
                        </span>
                      ) : (
                        formatPrice(p.regular_price)
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.is_variable ? (
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          Variable ({p.variants?.length || 0})
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-cobalt px-2 py-0.5 rounded text-[10px] font-bold">
                          Simple Digital
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.unlimited_stock ? (
                        <span className="text-emerald-600 font-semibold text-[11px]">Unlimited</span>
                      ) : (
                        <span className="text-brand-text font-bold">{p.stock_quantity} left</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(p)}
                        className="p-1 text-slate-400 hover:text-cobalt transition-colors"
                        title="Edit Product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add/Edit Product matching mockup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-dark/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-modal border border-surface-border animate-in fade-in max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-6">
              <h2 className="text-lg font-bold text-navy">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Social Media Template Pack"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-cobalt"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy mb-1">Category *</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-cobalt"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy mb-1">Custom Slug (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. social-media-pack"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-cobalt"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Detailed description of files, Canva links, license..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-cobalt"
                  />
                </div>
              </div>

              {/* Pricing & Stock matching mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-surface-light border border-surface-border">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">Regular Price (৳) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(Number(e.target.value))}
                    className="w-full bg-white border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy mb-1">Sales Price (৳)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Leave blank if no sale"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt font-bold text-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy mb-1">Stock Policy</label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="unlimited"
                      checked={unlimitedStock}
                      onChange={(e) => setUnlimitedStock(e.target.checked)}
                      className="rounded text-cobalt w-4 h-4"
                    />
                    <label htmlFor="unlimited" className="text-xs text-brand-text font-medium select-none">
                      Unlimited Digital
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Image URL */}
              <div>
                <label className="block text-xs font-bold text-navy mb-1">Product Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-cobalt"
                />
              </div>

              {/* Digital Asset Delivery */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3">
                <p className="text-xs font-bold text-navy uppercase tracking-wider">Digital Delivery Asset</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-brand-text mb-1">Download / Canva Access URL</label>
                    <input
                      type="url"
                      placeholder="https://canva.com/design/... or zip url"
                      value={downloadFileUrl}
                      onChange={(e) => setDownloadFileUrl(e.target.value)}
                      className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-brand-text mb-1">Download Filename</label>
                    <input
                      type="text"
                      placeholder="Template_Kit_v1.zip"
                      value={downloadFileName}
                      onChange={(e) => setDownloadFileName(e.target.value)}
                      className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-cobalt w-4 h-4"
                  />
                  <span>Show as Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-cobalt w-4 h-4"
                  />
                  <span>Active & Published</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-surface-border text-xs font-bold text-brand-text hover:bg-surface-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cobalt hover:bg-cobalt-hover text-white text-xs font-bold shadow-xs transition-all"
                >
                  Save Product
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
