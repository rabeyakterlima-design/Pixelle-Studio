import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { items, itemCount, subtotal, isCartOpen, closeCart, updateQuantity, removeFromCart } = useCart();
  const { formatPrice } = useStore();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-dark/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-modal flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cobalt" />
              <h2 className="text-lg font-bold text-navy">Your Cart ({itemCount})</h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-brand-secondary hover:text-brand-text rounded-full hover:bg-surface-light transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-surface-border">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-cobalt flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-navy mb-1">Your cart is empty</h3>
                <p className="text-xs text-brand-secondary max-w-xs mb-6">
                  Explore our premium Canva templates, planners, ebooks and graphics to add to your cart.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="bg-cobalt text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-cobalt-hover transition-colors shadow-xs"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-start">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover border border-surface-border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-navy truncate">{item.name}</h4>
                    {item.variant_label && (
                      <p className="text-xs text-brand-secondary mt-0.5">{item.variant_label}</p>
                    )}
                    <p className="text-sm font-bold text-cobalt mt-1">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <div className="flex items-center border border-surface-border rounded-md bg-surface-light">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-cobalt text-brand-secondary transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-brand-text">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-cobalt text-brand-secondary transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-brand-secondary hover:text-rose-500 transition-colors ml-auto"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Subtotal & Actions */}
          {items.length > 0 && (
            <div className="p-6 border-t border-surface-border bg-surface-light/40 space-y-4">
              <div className="flex items-center justify-between text-base font-bold text-navy">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="text-[11px] text-brand-secondary">
                Taxes & instant digital delivery included. Verified checkout via bKash, Nagad, Rocket.
              </p>

              <div className="space-y-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-cobalt text-white py-3 px-4 rounded-xl font-semibold text-sm hover:bg-cobalt-hover transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleViewCartClick}
                  className="w-full bg-white border border-surface-border text-brand-text py-2.5 px-4 rounded-xl font-medium text-sm hover:bg-surface-light transition-colors"
                >
                  View Cart
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
