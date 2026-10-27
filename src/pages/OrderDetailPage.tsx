import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order } from '../types/database';
import { storeService } from '../services/storeService';
import { useStore } from '../context/StoreContext';
import { 
  ArrowLeft, Download, CheckCircle2, Clock, 
  AlertCircle, ShieldCheck, FileText, Smartphone 
} from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { formatPrice } = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setIsLoading(true);
      const found = await storeService.getOrderById(id);
      setOrder(found);
      setIsLoading(false);
    }
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center text-cobalt">
        <div className="w-8 h-8 border-3 border-cobalt border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-navy mb-2">Order Not Found</h2>
        <p className="text-xs text-brand-secondary mb-6">Could not find an order matching that identifier.</p>
        <Link to="/account/orders" className="bg-cobalt text-white px-5 py-2.5 rounded-xl text-xs font-semibold">
          Back to Orders
        </Link>
      </div>
    );
  }

  const isPaid = order.payment_status === 'paid' || order.order_status === 'completed';

  return (
    <div className="bg-surface-light min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <Link to="/account/orders" className="inline-flex items-center gap-2 text-xs font-semibold text-cobalt hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to All Orders
        </Link>

        {/* Invoice Card */}
        <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-card space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
            <div>
              <span className="text-xs font-bold uppercase text-cobalt tracking-wider">Pixelle Studio Invoice</span>
              <h1 className="text-2xl font-extrabold text-navy mt-1">Order #{order.order_number}</h1>
              <p className="text-xs text-brand-secondary mt-0.5">
                Placed on {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isPaid ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                Payment: {order.payment_status.toUpperCase()}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 capitalize">
                Order: {order.order_status}
              </span>
            </div>
          </div>

          {/* Customer & Billing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-brand-secondary">
            <div className="p-4 rounded-2xl bg-surface-light border border-surface-border space-y-1">
              <p className="font-bold text-navy uppercase tracking-wider mb-2">Customer Details</p>
              <p className="text-brand-text font-semibold">{order.customer_name}</p>
              <p>{order.customer_email}</p>
              <p>Phone: {order.customer_phone}</p>
              {order.billing_address && <p>Address: {order.billing_address}, {order.billing_city}</p>}
            </div>

            <div className="p-4 rounded-2xl bg-surface-light border border-surface-border space-y-1">
              <p className="font-bold text-navy uppercase tracking-wider mb-2">Payment Verification</p>
              <p className="text-brand-text font-semibold uppercase">Method: {order.payment_method}</p>
              {order.payment_submission && (
                <>
                  <p>Sender Phone: {order.payment_submission.sender_phone}</p>
                  <p className="font-mono text-cobalt font-bold">TrxID: {order.payment_submission.transaction_id}</p>
                  {order.payment_submission.admin_notes && (
                    <p className="text-slate-500 italic mt-1">Note: {order.payment_submission.admin_notes}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Order Items Table */}
          <div>
            <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">Purchased Digital Items</h3>
            <div className="border border-surface-border rounded-2xl overflow-hidden divide-y divide-surface-border">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-cobalt flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-navy">{item.product_name_snapshot}</p>
                      {item.variant_name_snapshot && (
                        <p className="text-[11px] text-cobalt">{item.variant_name_snapshot}</p>
                      )}
                      <p className="text-[11px] text-brand-secondary">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs font-bold text-navy">{formatPrice(item.subtotal)}</span>
                    {isPaid && item.download_file_url && (
                      <a
                        href={item.download_file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-cobalt text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-cobalt-hover flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total Breakdown */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-brand-secondary">
                <span>Subtotal</span>
                <span className="font-semibold text-navy">{formatPrice(order.subtotal_amount)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="border-t border-surface-border pt-2 flex justify-between text-sm font-extrabold text-navy">
                <span>Total Amount</span>
                <span className="text-cobalt font-black">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
