import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Clock, Download, ArrowRight, Package, AlertCircle } from 'lucide-react';
import { Order } from '../types/database';
import { useStore } from '../context/StoreContext';

export const PaymentStatusPage: React.FC = () => {
  const location = useLocation();
  const { formatPrice } = useStore();
  const order: Order | undefined = (location.state as any)?.order;

  if (!order) {
    return <Navigate to="/shop" replace />;
  }

  const isPaid = order.payment_status === 'paid' || order.order_status === 'completed';

  return (
    <div className="bg-surface-light min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-surface-border p-8 sm:p-12 shadow-card text-center">
        
        {/* Status Icon */}
        <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center bg-blue-50 text-cobalt border border-blue-100">
          {isPaid ? (
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          ) : (
            <Clock className="w-10 h-10 text-amber-500 animate-pulse" />
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy mb-2">
          {isPaid ? 'Payment Confirmed & Files Ready!' : 'Order Placed & Awaiting Verification'}
        </h1>

        <p className="text-sm text-brand-secondary max-w-md mx-auto mb-6">
          Thank you, <strong className="text-navy">{order.customer_name}</strong>. Your order{' '}
          <strong className="text-cobalt">#{order.order_number}</strong> has been logged.
        </p>

        {/* Payment Summary Box */}
        <div className="p-5 rounded-2xl bg-surface-light border border-surface-border text-left mb-8 space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-brand-secondary">Order Reference:</span>
            <span className="font-bold text-navy font-mono">#{order.order_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-secondary">Payment Method:</span>
            <span className="font-bold uppercase text-navy">{order.payment_method}</span>
          </div>
          {order.payment_submission?.transaction_id && (
            <div className="flex justify-between">
              <span className="text-brand-secondary">Submitted TrxID:</span>
              <span className="font-bold text-cobalt font-mono">{order.payment_submission.transaction_id}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-brand-secondary">Payment Status:</span>
            <span className={`font-bold px-2 py-0.5 rounded text-xs ${
              isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {order.payment_status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-surface-border">
            <span className="font-bold text-navy">Total Amount:</span>
            <span className="font-black text-cobalt text-base">{formatPrice(order.total_amount)}</span>
          </div>
        </div>

        {/* Verification Notice */}
        {!isPaid ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-left mb-8 flex items-start gap-3">
            <Clock className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold">Manual Payment Verification in Progress</p>
              <p className="mt-0.5 leading-relaxed">
                Our team verifies manual mobile transactions typically within 5-15 minutes during business hours. Once verified by the administrator, your download link will become active in your account.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-8 space-y-3 text-left">
            <h3 className="text-sm font-bold text-navy">Instant Download Access:</h3>
            {order.items.map(item => (
              <div key={item.id} className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-navy">{item.product_name_snapshot}</p>
                  <p className="text-[10px] text-brand-secondary">Canva & PDF digital asset</p>
                </div>
                <a
                  href={item.download_file_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-cobalt text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-cobalt-hover flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/account/orders"
            className="bg-navy text-white text-xs font-semibold px-6 py-3 rounded-xl hover:bg-navy-dark transition-colors flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>View in My Orders</span>
          </Link>
          <Link
            to="/shop"
            className="bg-white border border-surface-border text-brand-text text-xs font-semibold px-6 py-3 rounded-xl hover:bg-surface-light transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
