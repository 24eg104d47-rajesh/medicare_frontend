import api from './api';

export const medicineService = {
  getMedicines: async (params = {}) => {
    return api.get('/medicines', { params });
  },

  getMedicineById: async (id) => {
    return api.get(`/medicines/${id}`);
  },

  getMedicineBySlug: async (slug) => {
    return api.get(`/medicines/slug/${slug}`);
  },

  getFeaturedMedicines: async () => {
    return api.get('/medicines/featured');
  },

  getPopularMedicines: async () => {
    return api.get('/medicines/popular');
  },

  // Admin endpoints
  getAdminMedicines: async (params = {}) => {
    return api.get('/admin/medicines', { params });
  },

  createMedicine: async (data) => {
    return api.post('/admin/medicines', data);
  },

  updateMedicine: async (id, data) => {
    return api.put(`/admin/medicines/${id}`, data);
  },

  updateMedicineStatus: async (id, active) => {
    return api.patch(`/admin/medicines/${id}/status`, { active });
  },

  deleteMedicine: async (id) => {
    return api.delete(`/admin/medicines/${id}`);
  }
};

export const categoryService = {
  getAllCategories: async () => {
    return api.get('/categories');
  },

  getCategoryById: async (id) => {
    return api.get(`/categories/${id}`);
  },

  getCategoryBySlug: async (slug) => {
    return api.get(`/categories/slug/${slug}`);
  },

  createCategory: async (data) => {
    return api.post('/admin/categories', data);
  },

  updateCategory: async (id, data) => {
    return api.put(`/admin/categories/${id}`, data);
  },

  deleteCategory: async (id) => {
    return api.delete(`/admin/categories/${id}`);
  }
};

export default medicineService;
