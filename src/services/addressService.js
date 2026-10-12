import api from './api';

export const addressService = {
  getAllAddresses: async () => {
    return api.get('/addresses');
  },

  getMyAddresses: async () => {
    return api.get('/addresses');
  },

  createAddress: async (data) => {
    return api.post('/addresses', data);
  },

  updateAddress: async (id, data) => {
    return api.put(`/addresses/${id}`, data);
  },

  deleteAddress: async (id) => {
    return api.delete(`/addresses/${id}`);
  },

  setDefaultAddress: async (id) => {
    return api.patch(`/addresses/${id}/default`);
  },
};
