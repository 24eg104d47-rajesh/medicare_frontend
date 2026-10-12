import api from './api';

export const paymentService = {
  initiatePayment: async (orderId, provider = 'RAZORPAY_SANDBOX') => {
    return api.post('/payments/create', { orderId, provider });
  },

  verifyPayment: async (orderIdOrPayload, verificationData) => {
    let orderId = orderIdOrPayload;
    let data = verificationData;
    if (typeof orderIdOrPayload === 'object' && orderIdOrPayload !== null) {
      orderId = orderIdOrPayload.orderId || orderIdOrPayload.id;
      data = orderIdOrPayload;
    }
    return api.post(`/payments/${orderId}/verify`, data);
  },
};
