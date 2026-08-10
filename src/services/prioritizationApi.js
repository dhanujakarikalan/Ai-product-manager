import { request } from './apiClient';

export const prioritizationApi = {
  async calculatePrioritization(featuresWithScores) {
    return request('/prioritization/calculate', {
      method: 'POST',
      body: JSON.stringify({ features: featuresWithScores })
    });
  }
};
