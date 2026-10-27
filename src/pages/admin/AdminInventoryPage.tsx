import React, { useState, useEffect } from 'react';
import { Layers, ArrowDownRight, ArrowUpRight, History, Plus, AlertTriangle, Check } from 'lucide-react';
import { Product, InventoryMovement } from '../../types/database';
import { storeService } from '../../services/storeService';
import { useStore } from '../../context/StoreContext';

export const AdminInventoryPage: React.FC = () => {
  const { formatPrice } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [adjustQuantity, setAdjustQuantity] = useState<number>(10);
  const [adjustType, setAdjustType] = useState<'in' | 'out'>('in');
  const [reason, setReason] = useState('Restock / Batch replenishment');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [pList, mList] = await Promise.all([
      storeService.getProducts(),
      storeService.getInventoryMovements()
    ]);
    setProducts(pList);
    setMovements(mList);
    if (pList.length > 0 && !selectedProductId) {
      setSelectedProductId(pList[0].id);
    }
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const delta = adjustType === 'in' ? Math.abs(adjustQuantity) : -Math.abs(adjustQuantity);
    const newQty = Math.max(0, product.stock_quantity + delta);

    product.stock_quantity = newQty;
    product.stock_status = newQty === 0 ? 'out_of_stock' : newQty < 5 ? 'low_stock' : 'in_stock';

    await storeService.saveProduct(product);
    await storeService.logInventoryMovement({
      product_id: product.id,
      product_name: product.name,
      change_quantity: delta,
      new_stock_quantity: newQty,
      reason: reason || (adjustType === 'in' ? 'Manual stock-in' : 'Manual stock-out deduction')
    });

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
    await loadData();
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Inventory & Stock Operations</h1>
        <p className="text-xs text-brand-secondary mt-1">
          Monitor digital product inventory levels, log stock adjustments, and prevent overselling
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 4 cols: Adjust Stock Form matching mockup */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <Layers className="w-5 h-5 text-cobalt" />
            <h2 className="text-sm font-bold text-navy">Manual Stock Adjustment</h2>
          </div>

          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Stock level updated and logged!</span>
            </div>
          )}

          <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-navy mb-1">Select Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.unlimited_stock ? 'Unlimited' : `${p.stock_quantity} in stock`})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-navy mb-1">Adjustment Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('in')}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    adjustType === 'in' ? 'bg-emerald-600 text-white' : 'bg-surface-light text-brand-text border border-surface-border'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Stock In (+)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('out')}
                  className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    adjustType === 'out' ? 'bg-rose-600 text-white' : 'bg-surface-light text-brand-text border border-surface-border'
                  }`}
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Stock Out (-)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-navy mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={adjustQuantity}
                onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-navy mb-1">Reason / Note</label>
              <input
                type="text"
                required
                placeholder="e.g. Restock, license inventory correction"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cobalt hover:bg-cobalt-hover text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all"
            >
              Confirm Adjustment
            </button>
          </form>
        </div>

        {/* Right 8 cols: History Table matching mockup */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
          <div className="p-6 border-b border-surface-border flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy">Stock Movement & Order History</h2>
              <p className="text-xs text-brand-secondary">Auditable stock changes and automatic order decrements</p>
            </div>
            <span className="text-xs font-semibold text-brand-secondary">
              Logs: {movements.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-light border-b border-surface-border text-brand-secondary uppercase font-semibold">
                <tr>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-6">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-brand-secondary">
                      No stock movements recorded yet.
                    </td>
                  </tr>
                ) : (
                  movements.map((m) => (
                    <tr key={m.id} className="hover:bg-surface-light/40 transition-colors">
                      <td className="py-3 px-6 text-brand-secondary whitespace-nowrap">
                        {new Date(m.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-navy max-w-xs truncate">
                        {m.product_name}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.change_quantity > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {m.change_quantity > 0 ? 'Stock In' : 'Stock Out'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold">
                        {m.change_quantity > 0 ? `+${m.change_quantity}` : m.change_quantity}
                      </td>
                      <td className="py-3 px-6 text-brand-secondary">
                        {m.reason}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
