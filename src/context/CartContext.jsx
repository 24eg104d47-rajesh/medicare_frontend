import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated || !isCustomer) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const res = await cartService.getCart();
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, isCustomer]);

  const addToCart = async (medicineId, quantity = 1) => {
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    setLoading(true);
    try {
      const res = await cartService.addToCart(medicineId, quantity);
      setCart(res.data);
      setIsDrawerOpen(true); // Open drawer on add
      return res.data;
    } catch (err) {
      console.error('Add to cart failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setLoading(true);
    try {
      const res = await cartService.updateCartItem(itemId, quantity);
      setCart(res.data);
      return res.data;
    } catch (err) {
      console.error('Update cart item failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      const res = await cartService.removeFromCart(itemId);
      setCart(res.data);
      return res.data;
    } catch (err) {
      console.error('Remove from cart failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
    } catch (err) {
      console.error('Clear cart failed:', err);
    }
  };

  const itemsCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const requiresPrescription = cart?.items?.some(item => item.prescriptionRequired || item.requiresPrescription) || false;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemsCount,
        requiresPrescription,
        isDrawerOpen,
        setIsDrawerOpen,
        fetchCart,
        refreshCart: fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        removeItem: removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
