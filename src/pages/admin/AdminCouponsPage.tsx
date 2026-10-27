import React, { useState } from 'react';
import { Ticket, Plus, Trash2, Check, Tag } from 'lucide-react';
import { Coupon } from '../../types/database';
import { useStore } from '../../context/StoreContext';

export const AdminCouponsPage: React.FC = () => {
  const { formatPrice } = useStore();
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 'cpn-1',
      code: 'PIXELLE10',
      discount_type: 'percentage',
      discount_value: 10,
      min_order_amount: 500,
      usage_count: 14,
      is_active: true
    },
    {
      id: 'cpn-2',
      code: 'WELCOME200',
      discount_type: 'fixed',
      discount_value: 200,
      min_order_amount: 1000,
      usage_count: 8,
      is_active: true
    }
  ]);

  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [minOrder, setMinOrder] = useState<number>(500);

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const newCpn: Coupon = {
      id: `cpn-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      discount_type: discountType,
      discount_value: Number(discountValue),
      min_order_amount: Number(minOrder),
      usage_count: 0,
      is_active: true
    };

    setCoupons([newCpn, ...coupons]);
    setNewCode('');
  };

  const handleDelete = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Coupon & Discount Codes</h1>
        <p className="text-xs text-brand-secondary mt-1">
          Create promotional voucher codes for campaigns and affiliate discounts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <Ticket className="w-5 h-5 text-cobalt" />
            <h2 className="text-sm font-bold text-navy">Create New Coupon</h2>
          </div>

          <form onSubmit={handleAddCoupon} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-navy mb-1">Coupon Code (Uppercase)</label>
              <input
                type="text"
                required
                placeholder="e.g. FLASH20"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs uppercase font-mono font-bold text-cobalt focus:outline-none focus:border-cobalt"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-navy mb-1">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed BDT (৳)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Discount Value</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-navy mb-1">Minimum Order Amount (৳)</label>
              <input
                type="number"
                min="0"
                value={minOrder}
                onChange={(e) => setMinOrder(Number(e.target.value))}
                className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cobalt hover:bg-cobalt-hover text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all"
            >
              Add Promo Code
            </button>
          </form>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
          <div className="p-6 border-b border-surface-border">
            <h2 className="text-base font-bold text-navy">Active Vouchers</h2>
          </div>

          <div className="divide-y divide-surface-border">
            {coupons.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-sm text-cobalt bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    {c.code}
                  </span>
                  <p className="text-brand-secondary text-[11px] mt-1.5">
                    {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `${formatPrice(c.discount_value)} OFF`} • Min order: {formatPrice(c.min_order_amount)} • Used: {c.usage_count} times
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
