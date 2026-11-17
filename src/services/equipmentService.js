import { apiRequest } from './api';

export const equipmentService = {
  async getAllEquipment(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.search) query.append('search', params.search);

    const queryString = query.toString();
    const endpoint = queryString ? `/equipment?${queryString}` : '/equipment';
    return await apiRequest(endpoint, { method: 'GET' });
  },

  async getEquipmentById(id) {
    return await apiRequest(`/equipment/${id}`, { method: 'GET' });
  },

  async addEquipment(data) {
    return await apiRequest('/equipment', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateEquipment(id, data) {
    return await apiRequest(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteEquipment(id) {
    return await apiRequest(`/equipment/${id}`, {
      method: 'DELETE'
    });
  }
};
