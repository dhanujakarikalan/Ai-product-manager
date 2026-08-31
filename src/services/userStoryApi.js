import { request } from './apiClient';

export const userStoryApi = {
  async generateUserStories({ featureId, featureTitle }) {
    return request('/user-stories/generate', {
      method: 'POST',
      body: JSON.stringify({ feature_id: featureId, feature_title: featureTitle })
    });
  }
};
