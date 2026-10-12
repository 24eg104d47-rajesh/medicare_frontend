import api from './api';

export const inventoryService = {
  getBatches: async (medicineId = null) => {
    return api.get('/admin/inventory', { params: medicineId ? { medicineId } : {} });
  },

  getLowStock: async (threshold = 20) => {
    return api.get('/admin/inventory/low-stock', { params: { threshold } });
  },

  getLowStockMedicines: async (threshold = 20) => {
    return api.get('/admin/inventory/low-stock', { params: { threshold } });
  },

  getExpiring: async (days = 90) => {
    return api.get('/admin/inventory/expiring', { params: { days } });
  },

  createStockReceipt: async (batchData) => {
    return api.post('/admin/inventory/stock-receipts', batchData);
  },

  recordAdjustment: async (adjustmentData) => {
    return api.post('/admin/inventory/adjustments', adjustmentData);
  },

  getMovements: async (params = {}) => {
    return api.get('/admin/inventory/movements', { params });
  },
};
