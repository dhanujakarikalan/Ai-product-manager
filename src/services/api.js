// =========================================================
// src/services/api.js
// FastAPI Backend Integration
// =========================================================

const API_BASE_URL = 'http://127.0.0.1:8001';


// =========================================================
// GENERIC REQUEST
// =========================================================

async function request(endpoint, options = {}) {

  const token =
    localStorage.getItem('access_token');

  const headers = {

    Accept: 'application/json',

    ...(options.body instanceof FormData
      ? {}
      : {
          'Content-Type': 'application/json'
        }),

    ...(token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {}),

    ...(options.headers || {})

  };


  let response;

  try {

    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers
      }
    );

  } catch (error) {

    console.error(
      'FastAPI connection error:',
      error
    );

    throw new Error(
      'Unable to connect to FastAPI backend on port 8001.'
    );

  }


  let data = null;

  try {

    data = await response.json();

  } catch {

    data = null;

  }


  if (!response.ok) {

    let message =
      `Request failed with status ${response.status}`;

    if (data?.detail) {

      if (Array.isArray(data.detail)) {

        message =
          data.detail
            .map(
              item =>
                item?.msg ||
                item?.message ||
                JSON.stringify(item)
            )
            .join(', ');

      } else {

        message =
          String(data.detail);

      }

    } else if (data?.message) {

      message =
        String(data.message);

    } else if (data?.error) {

      message =
        String(data.error);

    }

    throw new Error(message);

  }


  return data;

}


// =========================================================
// NORMALIZE DASHBOARD RESPONSE
// =========================================================

function normalizeDashboardResponse(response) {

  const dashboard =
    response?.dashboard ||
    response?.data?.dashboard ||
    response ||
    {};


  const positive =
    Number(
      dashboard['Positive Feedback'] ??
      dashboard.positive ??
      dashboard.positive_count ??
      dashboard.positiveCount ??
      0
    );


  const negative =
    Number(
      dashboard['Negative Feedback'] ??
      dashboard.negative ??
      dashboard.negative_count ??
      dashboard.negativeCount ??
      0
    );


  const neutral =
    Number(
      dashboard['Neutral Feedback'] ??
      dashboard.neutral ??
      dashboard.neutral_count ??
      dashboard.neutralCount ??
      0
    );


  const total =
    Number(
      dashboard['Total Feedback'] ??
      dashboard.total ??
      dashboard.total_feedback ??
      dashboard.totalFeedback ??
      0
    );


  return {

    ...response,

    dashboard: {

      ...dashboard,

      totalFeedback:
        Number.isFinite(total)
          ? total
          : 0,

      positive:
        Number.isFinite(positive)
          ? positive
          : 0,

      negative:
        Number.isFinite(negative)
          ? negative
          : 0,

      neutral:
        Number.isFinite(neutral)
          ? neutral
          : 0,

      categories:
        dashboard.Categories ||
        dashboard.categories ||
        {},

      themes:
        dashboard.Themes ||
        dashboard.themes ||
        {},

      painPoints:
        dashboard['Pain Points'] ||
        dashboard.pain_points ||
        dashboard.painPoints ||
        {},

      featureRequests:
        dashboard['Feature Requests'] ||
        dashboard.feature_requests ||
        dashboard.featureRequests ||
        {},

      feedbackTrend:
        dashboard['Feedback Trend'] ||
        dashboard.feedback_trend ||
        dashboard.feedbackTrend ||
        [],

      themeDistribution:
        dashboard['Theme Distribution'] ||
        dashboard.theme_distribution ||
        dashboard.themeDistribution ||
        [],

      productInsights:
        dashboard['Product Insights'] ||
        dashboard.product_insights ||
        dashboard.productInsights ||
        {}

    }

  };

}


// =========================================================
// API
// =========================================================

export const api = {


  // =======================================================
  // AUTHENTICATION
  // =======================================================

  async register({ username, email, password }) {

    return request(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
      }
    );

  },


  async login({ email, password }) {

    const response = await request(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }
    );

    if (response?.access_token) {
      localStorage.setItem('access_token', response.access_token);
    }

    return response;

  },


  // =======================================================
  // HEALTH
  // =======================================================

  async healthCheck() {

    return request('/');

  },


  // =======================================================
  // UPLOAD
  // =======================================================

  async uploadFile(file) {

    if (!file) {

      throw new Error(
        'Please select a CSV or Excel file.'
      );

    }


    const formData =
      new FormData();


    formData.append(
      'file',
      file
    );


    return request(
      '/upload',
      {
        method: 'POST',
        body: formData
      }
    );

  },


  // =======================================================
  // PRD
  // =======================================================

  async generatePrd(featureTitle = '') {

    const query = featureTitle
      ? `?feature_title=${encodeURIComponent(featureTitle)}`
      : '';

    return request(
      `/prd/generate${query}`,
      {
        method: 'POST'
      }
    );

  },


  async getPrd() {

    return request(
      '/prd/result',
      {
        method: 'GET'
      }
    );

  },


  // =======================================================
  // USER STORIES
  // =======================================================

  async generateUserStories(count = 5) {

    const requestedCount =
      Number(count);


    const safeCount =
      Number.isFinite(requestedCount)
        ? Math.max(
            1,
            Math.min(
              Math.floor(requestedCount),
              50
            )
          )
        : 5;


    return request(
      `/user-story/generate?count=${safeCount}`,
      {
        method: 'POST'
      }
    );

  },


  // =======================================================
  // DASHBOARD
  // =======================================================

  async getDashboardData() {

    const response =
      await request(
        '/dashboard',
        {
          method: 'GET'
        }
      );


    return normalizeDashboardResponse(
      response
    );

  },


  // =======================================================
  // ANALYTICS
  // =======================================================

  async getAnalytics() {

    return request(
      '/analytics',
      {
        method: 'GET'
      }
    );

  },


  // =======================================================
  // FEEDBACK
  // =======================================================

  async getFeedback() {

    return request(
      '/feedback',
      {
        method: 'GET'
      }
    );

  },


  // =======================================================
  // CHAT
  // =======================================================

  async sendChatMessage(question) {

    if (
      !question ||
      !question.trim()
    ) {

      throw new Error(
        'Please enter a question.'
      );

    }


    return request(
      '/product-chat/',
      {
        method: 'POST',

        body:
          JSON.stringify({
            question:
              question.trim()
          })

      }
    );

  }

};