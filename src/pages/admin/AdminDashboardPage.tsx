import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, DollarSign, Package, TrendingUp, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Order, Product } from '../../types/database';
import { storeService } from '../../services/storeService';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const { formatPrice } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [allOrders, allProducts] = await Promise.all([
        storeService.getOrders(),
        storeService.getProducts()
      ]);
      setOrders(allOrders);
      setProducts(allProducts);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Compute real metrics
  const totalSales = orders
    .filter(o => o.payment_status === 'paid' || o.order_status === 'completed')
    .reduce((acc, o) => acc + o.total_amount, 0);

  const pendingVerificationOrders = orders.filter(o => o.payment_status === 'pending_verification');
  const lowStockProducts = products.filter(p => !p.unlimited_stock && p.stock_quantity < 5);

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Admin Dashboard</h1>
          <p className="text-xs text-brand-secondary mt-1">
            Real-time digital product sales, order verifications, and customer stats
          </p>
        </div>

        {pendingVerificationOrders.length > 0 && (
          <Link
            to="/admin/payments"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors animate-bounce"
          >
            <Clock className="w-4 h-4" />
            <span>{pendingVerificationOrders.length} Pending Payment(s) Need Review</span>
          </Link>
        )}
      </div>

      {/* 4 KPI Cards matching Mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-secondary">Total Customers</p>
            <h3 className="text-2xl font-black text-navy mt-1">1,248</h3>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-2">
              <TrendingUp className="w-3 h-3 mr-1" /> +12% this month
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-cobalt flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-secondary">Total Orders</p>
            <h3 className="text-2xl font-black text-navy mt-1">{orders.length}</h3>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-2">
              <TrendingUp className="w-3 h-3 mr-1" /> +18% growth
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-secondary">Confirmed Sales</p>
            <h3 className="text-2xl font-black text-navy mt-1">{formatPrice(totalSales)}</h3>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-2">
              <TrendingUp className="w-3 h-3 mr-1" /> Verified bKash/Nagad
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-secondary">Active Products</p>
            <h3 className="text-2xl font-black text-navy mt-1">{products.length}</h3>
            <span className="inline-flex items-center text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-2">
              {products.filter(p => p.is_variable).length} Variable Kits
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Sales Overview Chart (SVG) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-navy">Sales Overview</h2>
            <p className="text-xs text-brand-secondary">Monthly digital revenue progression (BDT)</p>
          </div>
          <span className="text-xs font-semibold text-cobalt bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
            2026 Fiscal Year
          </span>
        </div>

        {/* Interactive SVG Line Graph matching mockup */}
        <div className="h-64 w-full">
          <svg className="w-full h-full" viewBox="0 0 800 240" fill="none" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="40" y1="20" x2="780" y2="20" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="40" y1="70" x2="780" y2="70" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="40" y1="120" x2="780" y2="120" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="40" y1="170" x2="780" y2="170" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="40" y1="210" x2="780" y2="210" stroke="#E2E8F0" strokeWidth="1.5" />

            {/* Gradient Area */}
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4169E1" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4169E1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area Path */}
            <path
              d="M 60 190 Q 120 180, 180 150 T 300 130 T 420 80 T 540 100 T 660 60 T 760 40 L 760 210 L 60 210 Z"
              fill="url(#salesGrad)"
            />

            {/* Line Path */}
            <path
              d="M 60 190 Q 120 180, 180 150 T 300 130 T 420 80 T 540 100 T 660 60 T 760 40"
              stroke="#4169E1"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Data Dots */}
            <circle cx="60" cy="190" r="4.5" fill="#4169E1" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="180" cy="150" r="4.5" fill="#4169E1" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="300" cy="130" r="4.5" fill="#4169E1" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="420" cy="80" r="4.5" fill="#4169E1" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="540" cy="100" r="4.5" fill="#4169E1" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="660" cy="60" r="4.5" fill="#4169E1" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="760" cy="40" r="5.5" fill="#17294B" stroke="#FFFFFF" strokeWidth="2.5" />
          </svg>

          {/* Month labels */}
          <div className="flex justify-between text-[11px] font-semibold text-brand-secondary px-6 pt-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table matching Mockup */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="p-6 border-b border-surface-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-navy">Recent Customer Orders</h2>
            <p className="text-xs text-brand-secondary">Latest purchases awaiting verification or dispatched</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-semibold text-cobalt hover:underline flex items-center gap-1">
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-light border-b border-surface-border text-brand-secondary uppercase font-semibold">
              <tr>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-light/40 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-navy">
                    #{order.order_number}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-brand-text">{order.customer_name}</p>
                    <p className="text-[10px] text-brand-secondary">{order.customer_phone}</p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-navy">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      order.payment_status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.payment_status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.payment_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="capitalize font-medium text-brand-text">
                      {order.order_status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <Link
                      to={`/admin/orders`}
                      className="text-cobalt hover:underline font-semibold"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
