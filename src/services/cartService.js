import api from './api';

export const cartService = {
  getCart: async () => {
    return api.get('/cart');
  },

  addToCart: async (medicineId, quantity = 1) => {
    return api.post('/cart/items', { medicineId, quantity });
  },

  updateCartItem: async (itemId, quantity) => {
    return api.patch(`/cart/items/${itemId}`, { quantity });
  },

  removeFromCart: async (itemId) => {
    return api.delete(`/cart/items/${itemId}`);
  },

  clearCart: async () => {
    return api.delete('/cart');
  },
};
