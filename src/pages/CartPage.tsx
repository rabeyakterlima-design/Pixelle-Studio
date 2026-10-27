import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

export const CartPage: React.FC = () => {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { formatPrice } = useStore();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponCode.trim()) return;

    if (couponCode.trim().toUpperCase() === 'PIXELLE10') {
      const discount = Math.round(subtotal * 0.10);
      setDiscountAmount(discount);
      setCouponSuccess(`Coupon PIXELLE10 applied! You saved ${formatPrice(discount)}.`);
    } else {
      setCouponError('Invalid or expired coupon code. Try PIXELLE10');
      setDiscountAmount(0);
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-surface-light flex items-center justify-center py-16 px-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-surface-border text-center shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-cobalt flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-brand-secondary mb-6 leading-relaxed">
            Looks like you haven't added any digital templates or design assets yet.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 bg-cobalt text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-cobalt-hover transition-colors shadow-xs w-full"
          >
            <span>Explore Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-light min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Shopping Cart</h1>
            <p className="text-xs sm:text-sm text-brand-secondary mt-1">Review your digital items before checkout</p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-brand-secondary hover:text-rose-600 font-semibold transition-colors"
          >
            Clear Cart
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Items Table */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-surface-border shadow-xs overflow-hidden">
            <div className="divide-y divide-surface-border">
              {items.map((item) => (
                <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border border-surface-border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-navy truncate">{item.name}</h3>
                    {item.variant_label && (
                      <p className="text-xs text-cobalt font-medium mt-0.5">{item.variant_label}</p>
                    )}
                    <p className="text-sm font-semibold text-brand-secondary mt-1">
                      Unit: {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center border border-surface-border rounded-lg bg-surface-light">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1.5 text-brand-secondary hover:text-navy transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-navy">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1.5 text-brand-secondary hover:text-navy transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Line Subtotal */}
                  <div className="text-right sm:w-24">
                    <span className="text-base font-extrabold text-navy">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-brand-secondary hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-surface-light border-t border-surface-border flex items-center justify-between text-xs">
              <Link to="/shop" className="inline-flex items-center gap-1.5 text-cobalt font-semibold hover:underline">
                <ArrowLeft className="w-3.5 h-3.5" />
                Continue Shopping
              </Link>
              <span className="text-brand-secondary">Instant download files unlocked post payment.</span>
            </div>
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Order Summary Box */}
            <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-navy border-b border-surface-border pb-3">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-brand-secondary">
                  <span>Subtotal</span>
                  <span className="font-semibold text-navy">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-brand-secondary">
                  <span>Digital Delivery</span>
                  <span className="text-emerald-600 font-semibold">FREE (Instant)</span>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <label className="text-xs font-semibold text-brand-text mb-1 block">Have a coupon code?</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. PIXELLE10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-surface-light border border-surface-border rounded-xl px-3 py-2 text-xs uppercase focus:outline-none focus:border-cobalt"
                    />
                    <Tag className="w-3.5 h-3.5 text-brand-secondary absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    className="bg-navy text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-navy-dark transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-500 mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-600 mt-1">{couponSuccess}</p>}
              </form>

              {/* Total */}
              <div className="border-t border-surface-border pt-4 flex items-baseline justify-between">
                <span className="text-base font-extrabold text-navy">Total</span>
                <span className="text-2xl font-black text-cobalt">{formatPrice(finalTotal)}</span>
              </div>

              {/* Proceed to checkout */}
              <button
                onClick={() => navigate('/checkout', { state: { couponCode: couponSuccess ? couponCode : undefined } })}
                className="w-full bg-cobalt hover:bg-cobalt-hover text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-brand-secondary">
                Verified manual payments: bKash, Nagad, Rocket
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
