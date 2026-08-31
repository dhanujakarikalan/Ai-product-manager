import { request } from './apiClient';

export const feedbackApi = {
  async login({ email, password }) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    return data;
  },

  async getFeedback() {
    return request('/feedback', { method: 'GET' });
  },

  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return request('/upload', {
      method: 'POST',
      body: formData
    });
  }
};
