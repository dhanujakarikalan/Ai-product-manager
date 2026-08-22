import { initialMockData } from '../data/mockDatabase';

export const api = {
  // Auth endpoints
  async login({ email, password }) {
    return {
      status: "success",
      access_token: "mock-access-token-jwt-string",
      token_type: "bearer",
      user: {
        name: "Alex Rivera",
        email: email,
        role: "Lead Product Manager"
      }
    };
  },

  async register({ username, email, password }) {
    return {
      status: "success",
      message: "User registered successfully"
    };
  },

  // Upload file endpoint
  async uploadFile(file) {
    // Return mock upload success metrics
    return {
      status: "success",
      filename: file.name,
      totalFeedbackCount: 200,
      positiveCount: 110,
      negativeCount: 50,
      neutralCount: 40
    };
  },

  // Dashboard endpoint
  async getDashboardData() {
    return {
      totalFeedbackCount: 200,
      positiveCount: 110,
      negativeCount: 50,
      neutralCount: 40,
      features: [
        { name: "Automated Report Export Engine", upvotes: 42, impact: "High", effort: "Medium", priority: 1 },
        { name: "Enterprise SAML SSO Integrations", upvotes: 28, impact: "High", effort: "High", priority: 2 }
      ],
      themes: [
        { title: "Browser crash on large CSV export", count: 28 },
        { title: "Battery drain during background sync", count: 18 }
      ]
    };
  },

  // Analytics endpoints
  async getAnalytics(metric) {
    return [
      { name: 'Mon', value: 12 },
      { name: 'Tue', value: 19 },
      { name: 'Wed', value: 25 },
      { name: 'Thu', value: 18 },
      { name: 'Fri', value: 35 },
      { name: 'Sat', value: 22 },
      { name: 'Sun', value: 11 }
    ];
  },

  // Agent SNS Workbench integration
  async triggerWorkbench(payload) {
    return {
      status: "success",
      webhook_delivered: true,
      timestamp: new Date().toISOString()
    };
  },

  // Feedback endpoints
  async getFeedback() {
    return initialMockData.feedbackItems || [];
  },

  async createFeedback(feedbackData) {
    const newFeedback = {
      id: `RID${Date.now()}`,
      source: feedbackData.source || 'Manual Entry',
      author: feedbackData.author || 'Anonymous',
      content: feedbackData.content || '',
      sentiment: feedbackData.sentiment || 'Neutral',
      urgencyScore: feedbackData.urgencyScore || 50,
      date: 'Just now',
      themeId: feedbackData.themeId || 'theme-general',
      status: 'New'
    };
    if (initialMockData.feedbackItems) {
      initialMockData.feedbackItems.unshift(newFeedback);
    }
    return newFeedback;
  },

  // Client-side chatbot engine (replacing backend python loop)
  async sendChatMessage(prompt, databaseContext) {
    const p_lower = prompt.toLowerCase();

    // RICE prioritisation answer
    if (anyKeywords(p_lower, ["rice", "reach", "impact", "confidence", "effort"])) {
      return {
        status: "success",
        response: (
          "## 📊 RICE Prioritization Framework\n\n" +
          "The **RICE Framework** is an objective scoring model used to prioritize product backlog items:\n\n" +
          "$$\\text{RICE Score} = \\frac{\\text{Reach} \\times \\text{Impact} \\times \\text{Confidence \\%}}{\\text{Effort}}$$\n\n" +
          "### 🔢 Core Inputs:\n" +
          "* **Reach (R)**: Estimated number of users impacted over a period (e.g. 2,000 active users/month).\n" +
          "* **Impact (I)**: Customer satisfaction boost scale ($1\\times$ Minimal, $3\\times$ High, $5\\times$ Massive).\n" +
          "* **Confidence (C)**: Estimated score certainty ($100\\%$ High, $80\\%$ Medium, $50\\%$ Low).\n" +
          "* **Effort (E)**: Engineering time input required in person-weeks (e.g. 3 weeks).\n\n" +
          "💡 *Action*: Navigate to **Feature Prioritization** in the left menu to adjust RICE sliders and calculate scores live!"
        )
      };
    }

    // PRD document answer
    if (anyKeywords(p_lower, ["prd", "document", "spec", "requirement"])) {
      return {
        status: "success",
        response: (
          "## 📄 Product Requirement Document (PRD) Overview\n\n" +
          "A **PRD** aligns cross-functional engineering, design, and product teams on feature scope and success metrics:\n\n" +
          "### 📋 Key PRD Sections:\n" +
          "1. **Problem Statement & Background** — Grounded in raw customer feedback data.\n" +
          "2. **User Personas & Target Audience** — Core user profiles.\n" +
          "3. **Functional Specifications** — Core feature behavior.\n" +
          "4. **Acceptance Criteria (Gherkin Scenarios)** — Given/When/Then test cases.\n" +
          "5. **Success Metrics & KPIs** — Churn reduction & retention targets.\n\n" +
          "👉 *Action*: Go to **PRD Generator** in the menu to generate or download a full PRD!"
        )
      };
    }

    // General universal fallback answer
    const cleanTopic = prompt.replace("what is", "").replace("how to", "").replace("explain", "").stripNonAlphaNumeric().trim();
    const topicTitle = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);
    
    return {
      status: "success",
      response: (
        `## 🤖 Product Assistant Analysis for "${prompt}"\n\n` +
        `### 💡 Overview & Definition:\n` +
        `Regarding **${topicTitle || 'this request'}**, this represents a key pillar in product strategy, engineering velocity, and agile operations.\n\n` +
        `### 📋 Key Principles & Breakdown:\n` +
        `* **Core Value**: Enables structured decision-making, user friction reduction, and engineering velocity.\n` +
        `* **Implementation Pattern**: Establish measurable KPIs, gather user feedback, and iterate in agile sprints.\n` +
        `* **Database Telemetry**: Grounded in your active customer support tickets and analytics pipeline.\n\n` +
        `### 🎯 Recommended Action Items:\n` +
        `1. **Prioritize Top Friction Theme**: Address Heavy Report Export Latency (28% of customer tickets).\n` +
        `2. **Draft Specs**: Click **PRD Generator** to generate product specifications.\n` +
        `3. **Agile User Stories**: Convert feedback into Gherkin user stories under **User Stories**.`
      )
    };
  },

  // PRD Generation endpoint
  async generatePrd(title) {
    return {
      status: "success",
      response: `## PRD: ${title || "Automated Report Export Engine"}\n\n### Overview\nThis spec defines background worker queues to prevent UI thread locks on large CSV downloads.`
    };
  },

  // User Story Generation endpoint
  async generateUserStory(feature) {
    return {
      status: "success",
      response: `As a Lead Product Manager, I want to auto-generate user stories, so that the engineering team has instant Gherkin acceptance criteria.`
    };
  }
};

// Helper utilities for chatbot logic
function anyKeywords(text, keywords) {
  return keywords.some(k => text.includes(k));
}

String.prototype.stripNonAlphaNumeric = function() {
  return this.replace(/[^a-zA-Z0-9\s]/g, "");
};
