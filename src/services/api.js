const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001';

export const api = {
  // Auth endpoints
  async login({ email, password }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Invalid login credentials');
    }
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    return data;
  },

  async register({ username, email, password }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Registration failed');
    }
    return data;
  },

  // Upload file endpoint
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Dataset processing failed');
    }
    return data;
  },

  // Dashboard endpoint
  async getDashboardData() {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/dashboard`, { headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to fetch dashboard data');
    }
    return data;
  },

  // Analytics endpoints
  async getAnalytics(metric) {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/analytics/${metric}`, { headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || `Failed to fetch analytics for ${metric}`);
    }
    return data;
  },

  // Agent SNS Workbench integration
  /**
   * Trigger a webhook on the Agent SNS Workbench.
   * @param {Object} payload - JSON payload to send.
   * @returns {Promise<Object>} - Response from the webhook.
   */
  async triggerWorkbench(payload) {
    const url = import.meta.env.VITE_WORKBENCH_URL;
    const apiKey = import.meta.env.VITE_WORKBENCH_API_KEY;
    const headers = {
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to trigger workbench webhook');
    }
    return data;
  },

  // Feedback endpoints
  async getFeedback() {
    const res = await fetch(`${API_BASE}/feedback`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to fetch feedback');
    }
    return data;
  },

  async createFeedback(feedbackData) {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to save feedback');
    }
    return data;
  }
};
