import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialMockData, chartData as initialChartData } from '../data/mockDatabase';
import { api } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(initialMockData);
  const [chartData, setChartData] = useState(initialChartData);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [apiConnected, setApiConnected] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'n-1', text: 'FastAPI Backend integration pipeline connected', type: 'info', time: 'Just now' }
  ]);

  const toggleTheme = (newTheme) => {
    const target = newTheme || (theme === 'dark' ? 'light' : 'dark');
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
  
  // Set uploaded data from FastAPI backend pipeline
  const setUploadedData = (apiPayload) => {
    setData(prev => ({
      ...prev,
      uploadedFileName: apiPayload.file_name,
      rowsProcessed: apiPayload.rows_processed,
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
