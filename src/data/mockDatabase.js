// =========================================================
// src/data/mockDatabase.js
// Initial Frontend State
//
// IMPORTANT:
// No demo/business/customer data is stored here.
// All actual product data must come from the FastAPI backend.
//
// The object structure is intentionally preserved because
// existing frontend components depend on these properties.
// =========================================================

export const initialMockData = {
  // =======================================================
  // WORKSPACES
  // =======================================================

  workspaces: [],

  activeWorkspaceId: null,


  // =======================================================
  // ANALYTICS
  // =======================================================

  analyticsMetrics: {
    csatScore: null,
    dau: null,
    dauGrowth: null,
    checkoutConversion: null,
    checkoutDropoff: null,
    retention30d: null,
    featureAdoptionRate: null
  },


  // =======================================================
  // ANALYTICS CONNECTORS
  // =======================================================

  analyticsConnectors: [],


  // =======================================================
  // USER PROFILE
  // =======================================================

  userProfile: {
    name: "",
    role: "Product Manager",
    avatar: "",
    email: ""
  },


  // =======================================================
  // CUSTOMER FEEDBACK
  // =======================================================

  // Populated after dataset upload/backend processing.
  feedbackItems: [],


  // =======================================================
  // EXTRACTED THEMES
  // =======================================================

  // Populated from backend theme extraction.
  themes: [],


  // =======================================================
  // PRIORITIZED FEATURES
  // =======================================================

  // Populated from backend feature prioritization.
  features: [],


  // =======================================================
  // GENERATED PRDs
  // =======================================================

  // Populated after PRD generation.
  prds: [],


  // =======================================================
  // ROADMAP
  // =======================================================

  // Populated from backend roadmap generation.
  roadmapItems: [],


  // =======================================================
  // USER STORIES
  // =======================================================

  // Populated after user-story generation.
  userStories: [],


  // =======================================================
  // PRODUCT CHAT
  // =======================================================

  // No hardcoded conversation.
  chatHistory: [],


  // =======================================================
  // BACKEND DATA
  // =======================================================

  backendMetrics: null,

  backendThemeSummary: null,

  backendSentimentSummary: null,

  backendCategorizationSummary: null,

  backendPainPoints: null,

  backendFeatureRequests: null,


  // =======================================================
  // UPLOAD INFORMATION
  // =======================================================

  uploadedFileName: null,

  totalFeedbackCount: 0,

  positiveCount: 0,

  negativeCount: 0,

  neutralCount: 0
};


// =========================================================
// CHART DATA
//
// Keep the same structure expected by existing components.
// Actual chart values should be generated from backend data.
// =========================================================

export const chartData = {
  themeDistribution: [],

  sentiment: [],

  trends: []
};