import { apiRequest } from './api';

export const authService = {
  async register(name, email, password, role = 'student') {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });
  },

  async login(email, password) {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async getCurrentUser() {
    return await apiRequest('/auth/me', {
      method: 'GET'
    });
  }
};
