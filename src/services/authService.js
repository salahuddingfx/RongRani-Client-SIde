import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  async verifyOtp(email, otp) {
    const response = await api.post('/api/auth/verify-otp', { email, otp });
    return response.data;
  },

  async resendOtp(email) {
    const response = await api.post('/api/auth/resend-otp', { email });
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, newPassword) {
    const response = await api.post('/api/auth/reset-password', { token, newPassword });
    return response.data;
  }
};
