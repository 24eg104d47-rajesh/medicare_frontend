import api from './api';

export const authService = {
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },

  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },

  getMe: async () => {
    return api.get('/auth/me');
  },

  updateProfile: async (profileData) => {
    return api.put('/auth/profile', profileData);
  },
};
