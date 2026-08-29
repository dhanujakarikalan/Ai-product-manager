import { request } from './apiClient';

export const analyticsApi = {
  async getAnalyticsSummary() {
    return request('/analytics/summary', { method: 'GET' });
  },

  async getDashboardMetrics() {
    return request('/dashboard', { method: 'GET' });
  }
};
