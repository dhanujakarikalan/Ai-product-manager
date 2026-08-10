import { request } from './apiClient';

export const prdApi = {
  async generatePRD({ featureId, featureTitle }) {
    return request('/prd/generate', {
      method: 'POST',
      body: JSON.stringify({ feature_id: featureId, feature_title: featureTitle })
    });
  }
};
