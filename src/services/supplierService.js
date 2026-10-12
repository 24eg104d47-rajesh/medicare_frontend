import api from './api';

export const supplierService = {
  getSuppliers: async (activeOnly = false) => {
    return api.get('/admin/suppliers', { params: { activeOnly } });
  },

  createSupplier: async (data) => {
    return api.post('/admin/suppliers', data);
  },

  updateSupplier: async (id, data) => {
    return api.put(`/admin/suppliers/${id}`, data);
  },

  getPurchaseOrders: async (params = {}) => {
    return api.get('/admin/purchase-orders', { params });
  },

  getPurchaseOrderById: async (id) => {
    return api.get(`/admin/purchase-orders/${id}`);
  },

  createPurchaseOrder: async (data) => {
    return api.post('/admin/purchase-orders', data);
  },

  updatePurchaseOrderStatus: async (id, status) => {
    return api.patch(`/admin/purchase-orders/${id}/status`, { status });
  },

  receivePurchaseOrder: async (id, batchDetails) => {
    return api.post(`/admin/purchase-orders/${id}/receive`, { batchDetails });
  },
};
