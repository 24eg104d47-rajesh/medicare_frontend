import api from './api';

export const orderService = {
  checkout: async (data) => {
    return api.post('/orders/checkout', data);
  },

  checkoutOrder: async (data) => {
    return api.post('/orders/checkout', data);
  },

  getMyOrders: async () => {
    return api.get('/orders/mine');
  },

  getOrderById: async (id) => {
    return api.get(`/orders/${id}`);
  },

  cancelOrder: async (id, reason) => {
    return api.post(`/orders/${id}/cancel`, { reason });
  },

  getOrderHistory: async (id) => {
    return api.get(`/orders/${id}/history`);
  },

  // Admin endpoints
  getAllOrders: async (params = {}) => {
    return api.get('/admin/orders', { params });
  },

  updateOrderStatus: async (id, newStatus, notes) => {
    return api.patch(`/admin/orders/${id}/status`, { newStatus, notes });
  },
};
