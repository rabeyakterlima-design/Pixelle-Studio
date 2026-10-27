import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle2, Clock, AlertCircle, Edit, X } from 'lucide-react';
import { Order, OrderStatus } from '../../types/database';
import { storeService } from '../../services/storeService';
import { useStore } from '../../context/StoreContext';

export const AdminOrdersPage: React.FC = () => {
  const { formatPrice } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await storeService.getOrders();
    setOrders(data);
  };

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.order_status);
    setAdminNote(order.admin_notes || '');
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      const updated = await storeService.updateOrderStatus(selectedOrder.id, newStatus, adminNote);
      setSelectedOrder(updated);
      await loadOrders();
      setIsDetailModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.order_status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.order_number.toLowerCase().includes(q);
      const matchCust = o.customer_name.toLowerCase().includes(q);
      const matchPhone = o.customer_phone.toLowerCase().includes(q);
      const matchTrx = o.payment_submission?.transaction_id?.toLowerCase().includes(q);
      if (!matchNum && !matchCust && !matchPhone && !matchTrx) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Order Management</h1>
          <p className="text-xs text-brand-secondary mt-1">
            Track customer digital purchases, manual payment verifications, and delivery states
          </p>
        </div>
      </div>

      {/* Filter Bar matching mockup */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm w-full">
          <input
            type="text"
            placeholder="Search by Order #, customer name, phone, or TrxID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-cobalt"
          />
          <Search className="w-4 h-4 text-brand-secondary absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-brand-secondary">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs font-semibold text-brand-text focus:outline-none focus:border-cobalt"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table matching Mockup */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-light border-b border-surface-border text-brand-secondary uppercase font-semibold">
              <tr>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total (BDT)</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-surface-light/40 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-navy">
                    #{o.order_number}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-navy">{o.customer_name}</p>
                    <p className="text-[10px] text-brand-secondary">{o.customer_phone}</p>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-navy">
                    {formatPrice(o.total_amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      o.payment_status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : o.payment_status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {o.payment_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="capitalize font-semibold text-brand-text">
                      {o.order_status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-brand-secondary whitespace-nowrap">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleOpenDetail(o)}
                      className="bg-surface-light hover:bg-blue-50 text-cobalt px-3 py-1.5 rounded-lg font-semibold transition-colors border border-surface-border"
                    >
                      View & Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Status Transition Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-dark/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-modal border border-surface-border animate-in fade-in max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-navy">
                  Manage Order #{selectedOrder.order_number}
                </h3>
                <p className="text-xs text-brand-secondary">
                  Placed {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-xl bg-surface-light border border-surface-border text-xs space-y-1.5 mb-6">
              <p className="font-bold text-navy uppercase tracking-wider mb-2">Customer & Billing Details</p>
              <p><strong className="text-navy">Name:</strong> {selectedOrder.customer_name}</p>
              <p><strong className="text-navy">Email:</strong> {selectedOrder.customer_email}</p>
              <p><strong className="text-navy">Phone:</strong> {selectedOrder.customer_phone}</p>
              <p><strong className="text-navy">City:</strong> {selectedOrder.billing_city}</p>
              {selectedOrder.billing_address && <p><strong className="text-navy">Address:</strong> {selectedOrder.billing_address}</p>}
            </div>

            {/* Purchased Items Snapshot */}
            <div className="mb-6">
              <p className="text-xs font-bold text-navy uppercase tracking-wider mb-2">Order Items Snapshot</p>
              <div className="border border-surface-border rounded-xl divide-y divide-surface-border text-xs">
                {selectedOrder.items.map(i => (
                  <div key={i.id} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-navy">{i.product_name_snapshot}</p>
                      {i.variant_name_snapshot && <p className="text-cobalt text-[10px]">{i.variant_name_snapshot}</p>}
                    </div>
                    <span className="font-bold text-navy">{i.quantity} × {formatPrice(i.price_snapshot)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Transition Control */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-4 mb-6 text-xs">
              <p className="font-bold text-navy uppercase tracking-wider">Update Order Status</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-brand-text mb-1">New Order Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-cobalt"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed (Delivered)</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-text mb-1">Internal Admin Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Verified via WhatsApp call"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-surface-border text-xs font-bold text-brand-text hover:bg-surface-light"
              >
                Close
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-5 py-2 rounded-xl bg-cobalt text-white text-xs font-bold hover:bg-cobalt-hover shadow-xs"
              >
                Save Status Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
