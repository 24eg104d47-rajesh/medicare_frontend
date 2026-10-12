import api from './api';

export const adminService = {
  getDashboardSummary: async () => {
    return api.get('/admin/dashboard');
  },

  getTopProducts: async (limit = 10) => {
    return api.get('/admin/analytics/top-products', { params: { limit } });
  },

  getRecentOrders: async (limit = 10) => {
    return api.get('/admin/analytics/recent-orders', { params: { limit } });
  },

  getAuditLogs: async (params = {}) => {
    return api.get('/admin/audit-logs', { params });
  },

  getAllUsers: async () => {
    return api.get('/admin/users');
  },

  getDashboardStats: async () => {
    return api.get('/admin/dashboard');
  },

  updateUserRole: async (userId, role) => {
    return api.put(`/admin/users/${userId}/role`, { role });
  },

  updateUserStatus: async (userId, enabled) => {
    return api.put(`/admin/users/${userId}/status`, { enabled });
  },
};
