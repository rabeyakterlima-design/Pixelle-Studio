import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, XCircle, Clock, Search, AlertCircle, ShieldCheck } from 'lucide-react';
import { Order } from '../../types/database';
import { storeService } from '../../services/storeService';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export const AdminPaymentsPage: React.FC = () => {
  const { formatPrice } = useStore();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotes, setActionNotes] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await storeService.getOrders();
    setOrders(data);
  };

  const handleVerify = async (orderId: string, action: 'approve' | 'reject') => {
    setProcessingId(orderId);
    try {
      const note = actionNotes[orderId];
      await storeService.verifyPayment(orderId, action, note, user?.email || 'admin@pixellestudio.com');
      await loadOrders();
    } catch (err: any) {
      alert(err.message || 'Payment verification failed');
    } finally {
      setProcessingId(null);
    }
  };

  const paymentsWithSubmissions = orders.filter(o => o.payment_submission || ['bkash', 'nagad', 'rocket'].includes(o.payment_method));

  const filtered = paymentsWithSubmissions.filter(o => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchNum = o.order_number.toLowerCase().includes(q);
    const matchTrx = o.payment_submission?.transaction_id.toLowerCase().includes(q);
    const matchPhone = o.payment_submission?.sender_phone.toLowerCase().includes(q);
    return matchNum || matchTrx || matchPhone;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Manual Payment Verification Queue</h1>
        <p className="text-xs text-brand-secondary mt-1">
          Review customer bKash, Nagad, and Rocket Transaction IDs (TrxID) and approve to grant digital access
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-xs max-w-md relative">
        <input
          type="text"
          placeholder="Search by Order #, TrxID, or sender phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface-light border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-cobalt"
        />
        <Search className="w-4 h-4 text-brand-secondary absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Verification Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-surface-border text-center shadow-xs">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-navy">No Payment Submissions Found</h3>
            <p className="text-xs text-brand-secondary mt-1">New customer transactions will appear here for audit.</p>
          </div>
        ) : (
          filtered.map((order) => {
            const sub = order.payment_submission;
            const isPending = order.payment_status === 'pending_verification';
            const isApproved = order.payment_status === 'paid';
            const isRejected = order.payment_status === 'rejected';

            return (
              <div 
                key={order.id}
                className={`bg-white rounded-2xl border p-6 shadow-xs transition-all ${
                  isPending ? 'border-amber-300 ring-2 ring-amber-100' : 'border-surface-border'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left: Transaction Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-navy">
                        Order #{order.order_number}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isApproved ? 'bg-emerald-100 text-emerald-800' :
                        isRejected ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {order.payment_status.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold uppercase text-cobalt bg-blue-50 px-2 py-0.5 rounded">
                        {order.payment_method}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                      <div>
                        <span className="text-brand-secondary block text-[11px]">Amount to Receive:</span>
                        <span className="font-black text-navy text-sm">{formatPrice(order.total_amount)}</span>
                      </div>
                      <div>
                        <span className="text-brand-secondary block text-[11px]">Submitted TrxID:</span>
                        <span className="font-mono font-bold text-cobalt text-sm select-all">
                          {sub?.transaction_id || 'PENDING'}
                        </span>
                      </div>
                      <div>
                        <span className="text-brand-secondary block text-[11px]">Sender Mobile Number:</span>
                        <span className="font-semibold text-brand-text">
                          {sub?.sender_phone || order.customer_phone}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-brand-secondary">
                      Customer: <strong className="text-navy">{order.customer_name}</strong> ({order.customer_email}) • Placed: {new Date(order.created_at).toLocaleString()}
                    </p>

                    {sub?.admin_notes && (
                      <p className="text-xs text-slate-600 bg-surface-light p-2 rounded-lg italic">
                        Note: {sub.admin_notes} (by {sub.verified_by || 'Admin'})
                      </p>
                    )}
                  </div>

                  {/* Right: Verification Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                    {isPending ? (
                      <>
                        <input
                          type="text"
                          placeholder="Optional audit note..."
                          value={actionNotes[order.id] || ''}
                          onChange={(e) => setActionNotes({ ...actionNotes, [order.id]: e.target.value })}
                          className="bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs w-full sm:w-48 focus:outline-none focus:border-cobalt"
                        />
                        <button
                          onClick={() => handleVerify(order.id, 'approve')}
                          disabled={processingId === order.id}
                          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Unlock Files</span>
                        </button>
                        <button
                          onClick={() => handleVerify(order.id, 'reject')}
                          disabled={processingId === order.id}
                          className="w-full sm:w-auto bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-brand-secondary font-medium">
                          Verified on {sub?.verified_at ? new Date(sub.verified_at).toLocaleDateString() : 'Record'}
                        </span>
                        <button
                          onClick={() => handleVerify(order.id, isApproved ? 'reject' : 'approve')}
                          className="text-xs text-cobalt font-semibold hover:underline"
                        >
                          Change to {isApproved ? 'Reject' : 'Approve'}
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
