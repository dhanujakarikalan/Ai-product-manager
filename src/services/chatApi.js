import { request } from './apiClient';

export const chatApi = {
  async sendMessage(message, context = {}) {
    return request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context })
    });
  }
};
