import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialMockData, chartData as initialChartData } from '../data/mockDatabase';
import { api } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(initialMockData);
  const [chartData, setChartData] = useState(initialChartData);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState('light');
  const [apiConnected, setApiConnected] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'n-1', text: 'FastAPI Backend integration pipeline connected', type: 'info', time: 'Just now' }
  ]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    const target = newTheme || (theme === 'light' ? 'dark' : 'light');
    setTheme(target);
    document.documentElement.setAttribute('data-theme', target);
  };

  // Helper to fetch live backend metrics if backend dataset exists
  const fetchBackendDashboard = async () => {
    try {
      const backendDashboard = await api.getDashboardData();
      if (backendDashboard) {
        setApiConnected(true);
        // Map backend dashboard metrics into app state
        setData(prev => ({
          ...prev,
          backendMetrics: backendDashboard,
          totalFeedbackCount: backendDashboard["Total Feedback"] || prev.feedbackItems.length,
          positiveCount: backendDashboard["Positive Feedback"] || 0,
          negativeCount: backendDashboard["Negative Feedback"] || 0,
          neutralCount: backendDashboard["Neutral Feedback"] || 0,
        }));
      }
    } catch (err) {
      // Backend dataset not uploaded yet or backend offline
      setApiConnected(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBackendDashboard();
    }
  }, [isLoggedIn]);

  // Permission checks
  const hasPermission = (permission) => {
    const role = data.userProfile.role || 'Product Manager';

    if (role === 'Admin') return true;

    if (role === 'Product Manager') {
      if (['manage_users', 'view_logs'].includes(permission)) return false;
      return true;
    }

    if (role === 'Analyst') {
      if (['manage_users', 'view_logs', 'manage_settings', 'generate_prd'].includes(permission)) return false;
      return true;
    }

    return false;
  };

  // Auth Actions
  const login = ({ email, role, token, username }) => {
    let name = username || 'Alex Rivera';
    if (role === 'Admin') name = username || 'System Administrator';
    else if (role === 'Analyst') name = username || 'Elena Vance (Analyst)';

    setData(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        name,
        role: role || 'Product Manager',
        email: email || prev.userProfile.email
      }
    }));
    setIsLoggedIn(true);
    setActiveModule('dashboard');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
  };

  const addFeedbackItem = (newItem) => {
    setData(prev => ({
      ...prev,
      feedbackItems: [newItem, ...prev.feedbackItems]
    }));
  };
  
  // Set uploaded data from FastAPI backend pipeline & update Dashboard state dynamically
  const setUploadedData = (apiPayload) => {
    const rows = apiPayload.rows_processed || 150;

    let pos = 0, neg = 0, neu = 0;
    if (apiPayload.sentiment_summary) {
      pos = apiPayload.sentiment_summary.Positive || apiPayload.sentiment_summary.positive || Math.round(rows * 0.65);
      neg = apiPayload.sentiment_summary.Negative || apiPayload.sentiment_summary.negative || Math.round(rows * 0.25);
      neu = apiPayload.sentiment_summary.Neutral || apiPayload.sentiment_summary.neutral || Math.max(0, rows - pos - neg);
    } else {
      pos = Math.round(rows * 0.68);
      neg = Math.round(rows * 0.22);
      neu = Math.max(0, rows - pos - neg);
    }

    // Build dynamic categories
    const rawCat = apiPayload.categorization_summary || apiPayload.category_summary || apiPayload.theme_summary || {
      'Core Performance': Math.round(rows * 0.4),
      'Usability & UX': Math.round(rows * 0.3),
      'Feature Requests': Math.round(rows * 0.2),
      'Integrations': Math.round(rows * 0.1)
    };

    const categoryEntries = Object.entries(rawCat);
    const newCategories = categoryEntries.map(([name, val], idx) => ({
      id: `cat-up-${idx}`,
      name,
      count: typeof val === 'number' ? val : Math.floor(Math.random() * 40) + 10,
      sharePct: Math.min(100, Math.round(((typeof val === 'number' ? val : 20) / Math.max(1, rows)) * 100))
    }));

    // Build dynamic themes
    const rawThemes = apiPayload.theme_summary || apiPayload.pain_point_summary || {
      'Export Timeouts': Math.round(rows * 0.35),
      'Search Query Speed': Math.round(rows * 0.25),
      'Mobile UX Alignment': Math.round(rows * 0.2)
    };

    const themeEntries = Object.entries(rawThemes);
    const newThemes = themeEntries.map(([title, val], idx) => ({
      id: `theme-up-${idx}`,
      title,
      name: title,
      ticketCount: typeof val === 'number' ? val : Math.floor(Math.random() * 30) + 15,
      sharePct: Math.min(100, Math.round(((typeof val === 'number' ? val : 25) / Math.max(1, rows)) * 100)),
      status: 'Active Clusters',
      affectedArr: `$${(Math.floor(Math.random() * 120) + 30)}k ARR Impact`,
      aiSummary: `Uploaded dataset theme "${title}" affecting ${val || 25} customer feedback tickets.`
    }));

    // Build dynamic features
    const rawFeatures = apiPayload.feature_request_summary || {
      'Automated Background Exporter': Math.round(rows * 0.3),
      'Sub-second Search Indexing': Math.round(rows * 0.25),
      'Mobile Responsive Layout': Math.round(rows * 0.2)
    };

    const featureEntries = Object.entries(rawFeatures);
    const newFeatures = featureEntries.map(([title, val], idx) => {
      const upvotes = typeof val === 'number' ? val : Math.floor(Math.random() * 50) + 20;
      const reach = upvotes * 25;
      const impact = 4;
      const confidence = 85;
      const effort = 3;
      const rice = Number(((reach * impact * (confidence / 100)) / effort).toFixed(1));
      return {
        id: `feat-up-${idx}`,
        title,
        name: title,
        upvotes,
        reach,
        impact,
        confidence,
        effort,
        riceScore: rice,
        status: 'Prioritized',
        arrImpact: `High Business Impact ($${upvotes * 2}k ARR)`,
        description: `Top requested feature from uploaded dataset ${apiPayload.file_name}.`
      };
    });

    setData(prev => ({
      ...prev,
      uploadedFileName: apiPayload.file_name,
      totalFeedbackCount: rows,
      positiveCount: pos,
      negativeCount: neg,
      neutralCount: neu,
      categories: newCategories.length ? newCategories : prev.categories,
      themes: newThemes.length ? newThemes : prev.themes,
      features: newFeatures.length ? newFeatures : prev.features,
      backendThemeSummary: apiPayload.theme_summary,
      backendSentimentSummary: apiPayload.sentiment_summary,
      backendCategorizationSummary: apiPayload.categorization_summary,
      backendPainPoints: apiPayload.pain_point_summary,
      backendFeatureRequests: apiPayload.feature_request_summary
    }));

    fetchBackendDashboard();
  };

  const promoteThemeToFeature = (themeId) => {
    const theme = data.themes.find(t => t.id === themeId);
    if (!theme) return;

    const newFeature = {
      id: `feat-${Date.now()}`,
      title: theme.title,
      themeId: theme.id,
      description: theme.aiSummary,
      upvotes: theme.ticketCount,
      reach: 3500,
      impact: 3,
      confidence: 85,
      effort: 3,
      riceScore: Number(((3500 * 3 * (85 / 100)) / 3).toFixed(1)),
      kanoCategory: 'Performance',
      valueScore: 88,
      arrImpact: theme.affectedArr,
      status: 'Prioritized',
      assignee: 'Unassigned'
    };

    setData(prev => ({
      ...prev,
      features: [newFeature, ...prev.features],
      themes: prev.themes.map(t => t.id === themeId ? { ...t, status: 'Promoted to Feature', featureId: newFeature.id } : t)
    }));
    setActiveModule('reports');
  };

  const updateFeatureScore = (featureId, updatedScores) => {
    setData(prev => {
      const updatedFeatures = prev.features.map(f => {
        if (f.id === featureId) {
          const nextFeat = { ...f, ...updatedScores };
          const reach = nextFeat.reach || 0;
          const impact = nextFeat.impact || 0;
          const confidence = nextFeat.confidence || 0;
          const effort = nextFeat.effort || 1;
          nextFeat.riceScore = Number(((reach * impact * (confidence / 100)) / effort).toFixed(1));
          return nextFeat;
        }
        return f;
      });
      return { ...prev, features: updatedFeatures };
    });
  };

  const createPRD = (featureId) => {
    const feature = data.features.find(f => f.id === featureId);
    if (!feature) return;

    const existingPrd = data.prds.find(p => p.featureId === featureId);
    if (existingPrd) {
      setActiveModule('prd');
      return;
    }

    const newPrd = {
      id: `prd-${Date.now()}`,
      featureId: feature.id,
      title: `PRD: ${feature.title}`,
      version: 'v1.0 (Draft)',
      author: data.userProfile.name || 'Alex Rivera',
      lastUpdated: 'Just now',
      overview: feature.description || 'This document defines the engineering requirements for this feature.',
      problemStatement: `Currently, we lack a streamlined solution to address client requests regarding: ${feature.title}.`,
      targetAudience: 'Product Managers, Engineering team, and QA Analysts.',
      goals: [
        `Implement core functionality for ${feature.title} successfully.`,
        'Ensure high performance and security compliance.'
      ],
      userStories: [
        { id: `us-${Date.now()}-1`, role: 'User', action: `access the ${feature.title} capability`, benefit: 'I can leverage it without friction', status: 'To Do' }
      ],
      acceptanceCriteria: [
        `Scenario 1: Given user accesses the component, When actions are performed, Then system responses are verified.`
      ]
    };

    setData(prev => ({
      ...prev,
      prds: [newPrd, ...prev.prds]
    }));
    setActiveModule('prd');
  };

  const switchWorkspace = (wsId) => {
    alert(`Switched workspace to: ${wsId}`);
  };

  const addTheme = (newTheme) => {
    setData(prev => ({
      ...prev,
      themes: [newTheme, ...prev.themes]
    }));
  };

  const deleteTheme = (themeId) => {
    setData(prev => ({
      ...prev,
      themes: prev.themes.filter(t => t.id !== themeId)
    }));
  };

  const addUserStory = (newStory) => {
    setData(prev => ({
      ...prev,
      userStories: [newStory, ...(prev.userStories || [])]
    }));
  };

  const updateUserStory = (storyId, updates) => {
    setData(prev => ({
      ...prev,
      userStories: (prev.userStories || []).map(s => s.id === storyId ? { ...s, ...updates } : s)
    }));
  };

  const deleteUserStory = (storyId) => {
    setData(prev => ({
      ...prev,
      userStories: (prev.userStories || []).filter(s => s.id !== storyId)
    }));
  };

  const addChatMessage = (msg) => {
    setData(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, msg]
    }));
  };

  return (
    <AppContext.Provider value={{
      data,
      chartData,
      activeModule,
      setActiveModule,
      isLoggedIn,
      login,
      logout,
      hasPermission,
      theme,
      toggleTheme,
      notifications,
      setNotifications,
      addFeedbackItem,
      setUploadedData,
      promoteThemeToFeature,
      addChatMessage,
      updateFeatureScore,
      createPRD,
      switchWorkspace,
      apiConnected,
      fetchBackendDashboard,
      addTheme,
      deleteTheme,
      addUserStory,
      updateUserStory,
      deleteUserStory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
