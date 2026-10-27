import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types/database';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pixelle_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('pixelle_cart', JSON.stringify(items));
  }, [items]);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const addToCart = (newItem: CartItem) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.id === newItem.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const cur = updated[existingIndex];
        const newQty = cur.quantity + newItem.quantity;
        // enforce max stock if physical
        if (!cur.unlimited_stock && newQty > cur.stock_quantity) {
          updated[existingIndex].quantity = cur.stock_quantity;
        } else {
          updated[existingIndex].quantity = newQty;
        }
        return updated;
      }
      return [...prevItems, newItem];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id) {
          const targetQty = item.quantity + delta;
          if (targetQty <= 0) return null;
          if (!item.unlimited_stock && targetQty > item.stock_quantity) {
            return item;
          }
          return { ...item, quantity: targetQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('pixelle_cart');
  };

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      subtotal,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
