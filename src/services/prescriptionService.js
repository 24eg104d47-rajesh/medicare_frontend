import api from './api';

export const prescriptionService = {
  uploadPrescription: async (fileOrFormData) => {
    const data = fileOrFormData instanceof FormData ? fileOrFormData : (() => {
      const fd = new FormData();
      fd.append('file', fileOrFormData);
      return fd;
    })();
    return api.post('/prescriptions/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getMyPrescriptions: async () => {
    return api.get('/prescriptions/mine');
  },

  getPrescriptionById: async (id) => {
    return api.get(`/prescriptions/${id}`);
  },

  getFileUrl: (id) => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    return `${baseURL}/prescriptions/${id}/file`;
  },

  // Admin endpoints
  getPendingPrescriptions: async (params = {}) => {
    return api.get('/admin/prescriptions/pending', { params });
  },

  reviewPrescription: async (id, status, reviewNotes) => {
    return api.patch(`/admin/prescriptions/${id}/review`, { status, reviewNotes });
  },
};
