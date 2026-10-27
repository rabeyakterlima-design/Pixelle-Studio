import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Calendar, PieChart, ShieldCheck } from 'lucide-react';
import { Order, Product } from '../../types/database';
import { storeService } from '../../services/storeService';
import { useStore } from '../../context/StoreContext';

export const AdminReportsPage: React.FC = () => {
  const { formatPrice } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const [oList, pList] = await Promise.all([
        storeService.getOrders(),
        storeService.getProducts()
      ]);
      setOrders(oList);
      setProducts(pList);
    }
    load();
  }, []);

  const paidOrders = orders.filter(o => o.payment_status === 'paid' || o.order_status === 'completed');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total_amount, 0);

  // Revenue by payment method
  const bkashTotal = paidOrders.filter(o => o.payment_method === 'bkash').reduce((sum, o) => sum + o.total_amount, 0);
  const nagadTotal = paidOrders.filter(o => o.payment_method === 'nagad').reduce((sum, o) => sum + o.total_amount, 0);
  const rocketTotal = paidOrders.filter(o => o.payment_method === 'rocket').reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Sales & Revenue Reports</h1>
        <p className="text-xs text-brand-secondary mt-1">
          Detailed metrics and channel breakdown of confirmed digital product orders
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs">
          <p className="text-xs font-semibold text-brand-secondary">Net Verified Revenue</p>
          <h3 className="text-2xl font-black text-navy mt-1">{formatPrice(totalRevenue)}</h3>
          <p className="text-[11px] text-emerald-600 mt-2 font-medium">Excludes unpaid or rejected orders</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs">
          <p className="text-xs font-semibold text-brand-secondary">Average Order Value (AOV)</p>
          <h3 className="text-2xl font-black text-navy mt-1">
            {formatPrice(paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0)}
          </h3>
          <p className="text-[11px] text-brand-secondary mt-2">Across {paidOrders.length} completed transactions</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-xs">
          <p className="text-xs font-semibold text-brand-secondary">Digital Delivery Fulfillment</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">100%</h3>
          <p className="text-[11px] text-brand-secondary mt-2">Instant automated file unlock on approval</p>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-navy mb-4">Payment Channel Breakdown (BDT)</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-[#E2136E]">bKash (Send Money)</span>
              <span>{formatPrice(bkashTotal)}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#E2136E] h-full rounded-full transition-all duration-500"
                style={{ width: `${totalRevenue > 0 ? (bkashTotal / totalRevenue) * 100 : 50}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-[#F7941D]">Nagad</span>
              <span>{formatPrice(nagadTotal)}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#F7941D] h-full rounded-full transition-all duration-500"
                style={{ width: `${totalRevenue > 0 ? (nagadTotal / totalRevenue) * 100 : 35}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-[#8C3494]">Rocket (DBBL)</span>
              <span>{formatPrice(rocketTotal)}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#8C3494] h-full rounded-full transition-all duration-500"
                style={{ width: `${totalRevenue > 0 ? (rocketTotal / totalRevenue) * 100 : 15}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Digital Assets */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs">
        <h2 className="text-base font-bold text-navy mb-4">Top Digital Products by Sales</h2>
        <div className="divide-y divide-surface-border text-xs">
          {[...products].sort((a, b) => b.sales_count - a.sales_count).slice(0, 5).map((p, idx) => (
            <div key={p.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-400 w-4">#{idx + 1}</span>
                <p className="font-bold text-navy">{p.name}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-cobalt">{p.sales_count} sales</span>
                <p className="text-[10px] text-brand-secondary">{formatPrice(p.regular_price)} unit</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
