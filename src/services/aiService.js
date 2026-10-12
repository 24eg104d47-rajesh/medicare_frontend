import api from './api';

export const aiService = {
  chat: async (message, conversationId = null) => {
    return api.post('/ai/chat', { message, conversationId });
  },

  getMedicineInformation: async (query, medicineId = null) => {
    return api.post('/ai/medicine-information', { query, medicineId });
  },

  discoverProducts: async (description) => {
    return api.post('/ai/product-discovery', { description });
  },

  getConversations: async () => {
    return api.get('/ai/conversations');
  },

  getConversationById: async (id) => {
    return api.get(`/ai/conversations/${id}`);
  },

  deleteConversation: async (id) => {
    return api.delete(`/ai/conversations/${id}`);
  },
};
