import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, Lock, AlertCircle, CheckCircle, 
  CreditCard, Smartphone, DollarSign, ArrowRight, Info 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { storeService } from '../services/storeService';
import { PaymentMethod } from '../types/database';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { settings, formatPrice } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const couponCode = (location.state as any)?.couponCode || '';

  // Form State
  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [billingCity, setBillingCity] = useState(user?.city || 'Dhaka');
  const [billingAddress, setBillingAddress] = useState(user?.address || '');
  const [orderNotes, setOrderNotes] = useState('');
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [senderPhone, setSenderPhone] = useState(user?.phone || '');
  const [transactionId, setTransactionId] = useState('');

  // Honeypot for bot prevention
  const [honeypot, setHoneypot] = useState('');

  // Unique Idempotency Key per checkout session
  const [idempotencyKey] = useState(() => `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate discount if coupon
  const discountAmount = couponCode ? Math.round(subtotal * 0.10) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Honeypot check
    if (honeypot) {
      console.warn('Bot submission blocked.');
      return;
    }

    // Require transaction ID for manual mobile payments
    if (['bkash', 'nagad', 'rocket'].includes(paymentMethod)) {
      if (!transactionId.trim()) {
        setErrorMessage(`Please enter your ${paymentMethod.toUpperCase()} Transaction ID (TrxID) after completing the payment.`);
        return;
      }
      if (!senderPhone.trim()) {
        setErrorMessage('Please enter the mobile number used to send the payment.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const result = await storeService.createOrder({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        billing_city: billingCity,
        billing_address: billingAddress,
        order_notes: orderNotes,
        payment_method: paymentMethod,
        sender_phone: senderPhone,
        transaction_id: transactionId,
        idempotency_key: idempotencyKey,
        cart_items: items,
        coupon_code: couponCode,
        user_id: user?.id
      });

      if (!result.success || !result.order) {
        setErrorMessage(result.error || 'Failed to process order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Order created successfully! Clear cart & redirect
      clearCart();
      navigate('/payment-status', { state: { order: result.order } });

    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  const currentPaymentConfig = settings.payments[paymentMethod];

  return (
    <div className="bg-surface-light min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Checkout</h1>
          <p className="text-xs sm:text-sm text-brand-secondary mt-1">
            Complete your order and receive instant digital access
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Checkout Error</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          {/* Honeypot field (hidden from real users) */}
          <input
            type="text"
            name="website_url"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 7 cols: Customer Details & Payment Submission */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Customer Information Card */}
              <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-navy border-b border-surface-border pb-3">
                  1. Customer & Delivery Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-text mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahima Akter"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2 text-sm text-brand-text focus:outline-none focus:border-cobalt"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-text mb-1">
                      Email Address (for download links) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahima@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2 text-sm text-brand-text focus:outline-none focus:border-cobalt"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-text mb-1">
                      Mobile Number (BD: 01...) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="01712345678"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2 text-sm text-brand-text focus:outline-none focus:border-cobalt"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-text mb-1">
                      City / Region <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={billingCity}
                      onChange={(e) => setBillingCity(e.target.value)}
                      className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2 text-sm text-brand-text focus:outline-none focus:border-cobalt"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barisal">Barisal</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    Street Address (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="House, Road, Area"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2 text-sm text-brand-text focus:outline-none focus:border-cobalt"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Any special customization or instructions..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full bg-surface-light border border-surface-border rounded-xl px-3.5 py-2 text-sm text-brand-text focus:outline-none focus:border-cobalt"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-navy border-b border-surface-border pb-3">
                  2. Select Payment Method
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* bKash */}
                  <label className={`p-3 rounded-xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                    paymentMethod === 'bkash' ? 'border-[#E2136E] bg-pink-50/50 shadow-xs' : 'border-surface-border hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="bkash"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="hidden"
                    />
                    <span className="font-extrabold text-[#E2136E] text-sm">bKash</span>
                    <span className="text-[10px] text-brand-secondary mt-0.5">Send Money</span>
                  </label>

                  {/* Nagad */}
                  <label className={`p-3 rounded-xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                    paymentMethod === 'nagad' ? 'border-[#F7941D] bg-amber-50/50 shadow-xs' : 'border-surface-border hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="nagad"
                      checked={paymentMethod === 'nagad'}
                      onChange={() => setPaymentMethod('nagad')}
                      className="hidden"
                    />
                    <span className="font-extrabold text-[#F7941D] text-sm">Nagad</span>
                    <span className="text-[10px] text-brand-secondary mt-0.5">Send Money</span>
                  </label>

                  {/* Rocket */}
                  <label className={`p-3 rounded-xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                    paymentMethod === 'rocket' ? 'border-[#8C3494] bg-purple-50/50 shadow-xs' : 'border-surface-border hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="rocket"
                      checked={paymentMethod === 'rocket'}
                      onChange={() => setPaymentMethod('rocket')}
                      className="hidden"
                    />
                    <span className="font-extrabold text-[#8C3494] text-sm">Rocket</span>
                    <span className="text-[10px] text-brand-secondary mt-0.5">DBBL</span>
                  </label>

                  {/* COD */}
                  <label className={`p-3 rounded-xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-cobalt bg-blue-50/50 shadow-xs' : 'border-surface-border hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="hidden"
                    />
                    <span className="font-extrabold text-navy text-sm">COD</span>
                    <span className="text-[10px] text-brand-secondary mt-0.5">Cash Delivery</span>
                  </label>
                </div>

                {/* Instructions & Sender Details for Manual Mobile Payments */}
                {['bkash', 'nagad', 'rocket'].includes(paymentMethod) && (
                  <div className="p-4 rounded-xl bg-surface-light border border-surface-border space-y-4 animate-in fade-in">
                    <div className="flex items-start gap-2.5 text-xs text-brand-text">
                      <Smartphone className="w-4 h-4 text-cobalt shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-navy">
                          {paymentMethod.toUpperCase()} Number: <span className="font-mono text-cobalt text-sm select-all">{(settings.payments[paymentMethod as 'bkash' | 'nagad' | 'rocket'] as any)?.number || '+8801 2345 6789'}</span>
                        </p>
                        <p className="text-[11px] text-brand-secondary whitespace-pre-line mt-1">
                          {settings.payments[paymentMethod]?.instructions}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-surface-border/60">
                      <div>
                        <label className="block text-xs font-semibold text-brand-text mb-1">
                          Sender Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 017XXXXXXXX"
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          className="w-full bg-white border border-surface-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cobalt"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-brand-text mb-1">
                          Transaction ID (TrxID) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 9X77A12BK"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                          className="w-full bg-white border border-surface-border rounded-xl px-3 py-2 text-xs uppercase font-mono font-bold text-cobalt focus:outline-none focus:border-cobalt"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <p>
                      Notice: For instant digital products (templates, ebooks, planners), manual bKash/Nagad/Rocket is strongly recommended. Cash on Delivery orders require manual phone confirmation before digital files are unlocked.
                    </p>
                  </div>
                )}

              </div>

            </div>

            {/* Right 5 cols: Order Review & Submit */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-navy border-b border-surface-border pb-3">
                  Order Summary ({items.length} items)
                </h2>

                <div className="divide-y divide-surface-border max-h-60 overflow-y-auto pr-1">
                  {items.map((i) => (
                    <div key={i.id} className="py-2.5 flex items-center gap-3">
                      <img src={i.image_url} alt="" className="w-12 h-12 rounded-lg object-cover border border-surface-border" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-navy truncate">{i.name}</p>
                        {i.variant_label && <p className="text-[10px] text-brand-secondary">{i.variant_label}</p>}
                        <p className="text-[11px] text-brand-secondary">{i.quantity} × {formatPrice(i.price)}</p>
                      </div>
                      <span className="text-xs font-bold text-navy">{formatPrice(i.price * i.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-surface-border">
                  <div className="flex justify-between text-brand-secondary">
                    <span>Subtotal</span>
                    <span className="font-semibold text-navy">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({couponCode})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brand-secondary">
                    <span>Delivery</span>
                    <span className="text-emerald-600 font-semibold">Instant Digital Download</span>
                  </div>
                </div>

                <div className="border-t border-surface-border pt-4 flex items-baseline justify-between">
                  <span className="text-sm font-extrabold text-navy">Total to Pay</span>
                  <span className="text-2xl font-black text-cobalt">{formatPrice(finalTotal)}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-cobalt hover:bg-cobalt-hover text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying & Placing Order...' : `Pay ${formatPrice(finalTotal)} & Complete Order`}</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-brand-secondary pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>256-bit Encrypted & Admin Verified</span>
                </div>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
