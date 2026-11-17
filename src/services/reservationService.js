import { apiRequest } from './api';

export const reservationService = {
  async getReservations() {
    return await apiRequest('/reservations', { method: 'GET' });
  },

  async createReservation(reservationData) {
    return await apiRequest('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
  },

  async cancelReservation(id) {
    return await apiRequest(`/reservations/${id}/cancel`, {
      method: 'PATCH'
    });
  },

  async updateReservationStatus(id, status, caretakerNotes = '') {
    return await apiRequest(`/reservations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, caretakerNotes })
    });
  }
};
