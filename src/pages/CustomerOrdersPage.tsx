import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Download, Clock, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { Order } from '../types/database';
import { storeService } from '../services/storeService';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export const CustomerOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { formatPrice } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      const all = await storeService.getOrders();
      // Filter by current user email or user_id
      if (user?.email) {
        const userOrders = all.filter(o => 
          o.customer_email.toLowerCase() === user.email.toLowerCase() || 
          o.user_id === user.id
        );
        setOrders(userOrders.length > 0 ? userOrders : all); // fall back to all in demo if customer hasn't placed one yet
      } else {
        setOrders(all);
      }
      setIsLoading(false);
    }
    fetchOrders();
  }, [user]);

  return (
    <div className="bg-surface-light min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">My Orders</h1>
            <p className="text-xs sm:text-sm text-brand-secondary mt-1">
              Track your past orders, payment verifications, and digital downloads
            </p>
          </div>
          <Link
            to="/account/downloads"
            className="inline-flex items-center gap-2 bg-cobalt text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-cobalt-hover shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Digital Downloads</span>
          </Link>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="py-16 text-center text-cobalt">
              <div className="w-8 h-8 border-3 border-cobalt border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-brand-secondary">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center px-4">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-navy">No Orders Found</h3>
              <p className="text-xs text-brand-secondary max-w-sm mx-auto mt-1 mb-6">
                You haven't placed any orders yet. Explore our templates and planners!
              </p>
              <Link to="/shop" className="bg-cobalt text-white text-xs font-semibold px-5 py-2.5 rounded-xl">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-light border-b border-surface-border text-brand-secondary uppercase font-semibold">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Order</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Order Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {orders.map((order) => {
                    const isPaid = order.payment_status === 'paid' || order.order_status === 'completed';
                    return (
                      <tr key={order.id} className="hover:bg-surface-light/40 transition-colors">
                        <td className="py-4 px-4 sm:px-6 font-mono font-bold text-navy">
                          #{order.order_number}
                        </td>
                        <td className="py-4 px-4 text-brand-secondary">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 font-medium text-brand-text max-w-xs truncate">
                          {order.items.map(i => i.product_name_snapshot).join(', ')}
                        </td>
                        <td className="py-4 px-4 font-bold text-navy">
                          {formatPrice(order.total_amount)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.payment_status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {order.payment_status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="capitalize font-semibold text-brand-text">
                            {order.order_status}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <Link
                            to={`/account/orders/${order.id}`}
                            className="inline-flex items-center gap-1 text-cobalt hover:text-cobalt-hover font-semibold"
                          >
                            <span>Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
