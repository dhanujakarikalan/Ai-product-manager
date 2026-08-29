import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import { initialMockData } from '../data/mockDatabase';
import { api } from '../services/api';


const AppContext = createContext();


// =========================================================
// EMPTY APPLICATION DATA
// =========================================================

const createEmptyData = () => ({

  workspaces:
    initialMockData?.workspaces || [],

  activeWorkspaceId:
    initialMockData?.activeWorkspaceId || null,

  analyticsMetrics: {},

  analyticsConnectors: [],

  userProfile: {
    ...(initialMockData?.userProfile || {})
  },

  feedbackItems: [],

  themes: [],

  features: [],

  prds: [],

  roadmapItems: [],

  chatHistory: [],

  userStories: [],

  categories: [],

  totalFeedbackCount: 0,

  positiveCount: 0,

  negativeCount: 0,

  neutralCount: 0,

  uploadedFileName: null,

  datasetUploaded: false,


  // =======================================================
  // BACKEND DATA
  // =======================================================

  backendMetrics: null,

  backendThemeSummary: null,

  backendSentimentSummary: null,

  backendCategorizationSummary: null,

  backendPainPoints: null,

  backendFeatureRequests: null,

  trendReport: null,


  // =======================================================
  // MILESTONE 4
  // =======================================================

  backendFeatureScores: [],

  backendPrioritization: [],

  backendRoadmap: [],

  backendMilestoneRecommendation: null,

  backendExecutiveSummary: null,

  backendProductStrategy: null,

  backendEvaluation: null

});


// =========================================================
// EMPTY CHART DATA
// =========================================================

const createEmptyChartData = () => ({

  themeDistribution: [],

  sentiment: [],

  trends: []

});


// =========================================================
// PROVIDER
// =========================================================

export const AppProvider = ({
  children
}) => {


  const [data, setData] =
    useState(
      createEmptyData()
    );


  const [chartData, setChartData] =
    useState(
      createEmptyChartData()
    );


  const [activeModule, setActiveModule] =
    useState('dashboard');


  const [isLoggedIn, setIsLoggedIn] =
    useState(false);


  const [theme, setTheme] =
    useState('light');


  const [apiConnected, setApiConnected] =
    useState(false);


  const [notifications, setNotifications] =
    useState([]);


  // =======================================================
  // DATASET FLAG
  // =======================================================

  const hasUploadedData =
    Boolean(
      data.datasetUploaded &&
      data.totalFeedbackCount > 0
    );


  // =======================================================
  // THEME
  // =======================================================

  useEffect(() => {

    document.documentElement.setAttribute(
      'data-theme',
      theme
    );

  }, [theme]);


  const toggleTheme =
    (newTheme) => {

      const target =
        newTheme ||
        (
          theme === 'light'
            ? 'dark'
            : 'light'
        );


      setTheme(target);


      document.documentElement.setAttribute(
        'data-theme',
        target
      );

    };


  // =======================================================
  // RESET
  // =======================================================

  const clearAnalysisData =
    useCallback(() => {

      setData(prev => ({

        ...createEmptyData(),

        userProfile:
          prev.userProfile || {},

        workspaces:
          prev.workspaces || [],

        activeWorkspaceId:
          prev.activeWorkspaceId || null

      }));


      setChartData(
        createEmptyChartData()
      );

    }, []);


  // =======================================================
  // DASHBOARD
  // =======================================================

  const fetchBackendDashboard =
    useCallback(async () => {

      try {

        const response =
          await api.getDashboardData();


        console.log(
          'FULL DASHBOARD RESPONSE:',
          response
        );


        if (!response) {

          setApiConnected(false);

          return null;

        }


        // =================================================
        // HANDLE DIFFERENT BACKEND RESPONSE STRUCTURES
        // =================================================

        const dashboard =
          response.dashboard ||
          response.data ||
          response;


        console.log(
          'DASHBOARD DATA:',
          dashboard
        );


        // =================================================
        // TOTAL FEEDBACK
        // =================================================

        const totalFeedback =
          Number(
            dashboard.totalFeedback ??
            dashboard.total_feedback ??
            dashboard.rows_processed ??
            dashboard['Total Feedback'] ??
            response.totalFeedback ??
            response.total_feedback ??
            response.rows_processed ??
            0
          );


        // =================================================
        // SENTIMENT SUMMARY
        // =================================================

        const sentimentSummary =
          dashboard.sentiment_summary ||
          dashboard.sentimentSummary ||
          dashboard.sentiment ||
          dashboard.Sentiment ||
          response.sentiment_summary ||
          response.sentimentSummary ||
          response.sentiment ||
          response.Sentiment ||
          {};


        const positive =
          Number(
            sentimentSummary.Positive ??
            sentimentSummary.positive ??
            dashboard.positive ??
            dashboard['Positive Feedback'] ??
            response.positive ??
            response['Positive Feedback'] ??
            0
          );


        const negative =
          Number(
            sentimentSummary.Negative ??
            sentimentSummary.negative ??
            dashboard.negative ??
            dashboard['Negative Feedback'] ??
            response.negative ??
            response['Negative Feedback'] ??
            0
          );


        const neutral =
          Number(
            sentimentSummary.Neutral ??
            sentimentSummary.neutral ??
            dashboard.neutral ??
            dashboard['Neutral Feedback'] ??
            response.neutral ??
            response['Neutral Feedback'] ??
            0
          );


        console.log(
          'SENTIMENT:',
          {
            positive,
            negative,
            neutral
          }
        );


        // =================================================
        // IF NO DATA EXISTS
        // =================================================

        if (totalFeedback <= 0) {

          clearAnalysisData();

          setApiConnected(true);

          return dashboard;

        }


        // =================================================
        // CATEGORIES
        // =================================================

        const categories =
          dashboard.Categories ||
          dashboard.categories ||
          dashboard.categorization_summary ||
          dashboard.category_summary ||
          response.Categories ||
          response.categories ||
          response.categorization_summary ||
          response.category_summary ||
          {};


        // =================================================
        // THEMES
        // =================================================

        const themes =
          dashboard.Themes ||
          dashboard.themes ||
          dashboard.theme_summary ||
          response.Themes ||
          response.themes ||
          response.theme_summary ||
          {};


        // =================================================
        // PAIN POINTS
        // =================================================

        const painPoints =
          dashboard['Pain Points'] ||
          dashboard.painPoints ||
          dashboard.pain_points ||
          dashboard.pain_point_summary ||
          response['Pain Points'] ||
          response.painPoints ||
          response.pain_points ||
          response.pain_point_summary ||
          null;


        // =================================================
        // FEATURE REQUESTS
        // =================================================

        const featureRequests =
          dashboard['Feature Requests'] ||
          dashboard.featureRequests ||
          dashboard.feature_requests ||
          dashboard.feature_request_summary ||
          response['Feature Requests'] ||
          response.featureRequests ||
          response.feature_requests ||
          response.feature_request_summary ||
          null;


        // =================================================
        // FEATURE SCORES
        // =================================================

        const featureScores =
          Array.isArray(
            response.feature_scores
          )
            ? response.feature_scores
            : Array.isArray(
                dashboard.feature_scores
              )
                ? dashboard.feature_scores
                : [];


        // =================================================
        // FEATURE PRIORITIZATION
        // =================================================

        const prioritization =
          Array.isArray(
            response.feature_prioritization
          )
            ? response.feature_prioritization
            : Array.isArray(
                response.prioritization
              )
                ? response.prioritization
                : Array.isArray(
                    dashboard.feature_prioritization
                  )
                    ? dashboard.feature_prioritization
                    : Array.isArray(
                        dashboard.prioritization
                      )
                        ? dashboard.prioritization
                        : [];


        // =================================================
        // ROADMAP
        // =================================================

        const roadmap =
          Array.isArray(
            response.roadmap
          )
            ? response.roadmap
            : Array.isArray(
                dashboard.roadmap
              )
                ? dashboard.roadmap
                : [];


        // =================================================
        // SENTIMENT CHART
        // =================================================

        const sentiment = [];


        if (positive > 0) {

          sentiment.push({
            name: 'Positive',
            value: positive,
            color: '#10b981'
          });

        }


        if (neutral > 0) {

          sentiment.push({
            name: 'Neutral',
            value: neutral,
            color: '#06b6d4'
          });

        }


        if (negative > 0) {

          sentiment.push({
            name: 'Negative',
            value: negative,
            color: '#f43f5e'
          });

        }


        // =================================================
        // THEME DISTRIBUTION
        // =================================================

        const categoryEntries =
          categories &&
          typeof categories === 'object' &&
          !Array.isArray(categories)
            ? Object.entries(categories)
            : [];


        const themeEntries =
          themes &&
          typeof themes === 'object' &&
          !Array.isArray(themes)
            ? Object.entries(themes)
            : [];


        const distributionSource =
          categoryEntries.length > 0
            ? categoryEntries
            : themeEntries;


        // =================================================
        // TREND DATA
        // =================================================

        const trends =
          dashboard.feedbackTrend ||
          dashboard.feedback_trend ||
          dashboard['Feedback Trend'] ||
          dashboard.trend_report ||
          response.feedbackTrend ||
          response.feedback_trend ||
          response.trend_report ||
          [];


        // =================================================
        // UPDATE CHART DATA
        // =================================================

        setChartData({

          themeDistribution:

            distributionSource.map(
              ([name, value]) => ({

                name,

                tickets:
                  Number(value) || 0

              })
            ),

          sentiment,

          trends

        });


        // =================================================
        // UPDATE APPLICATION DATA
        // =================================================

        setData(prev => ({

          ...prev,


          // ===============================================
          // BASIC DATA
          // ===============================================

          totalFeedbackCount:
            totalFeedback,

          positiveCount:
            positive,

          negativeCount:
            negative,

          neutralCount:
            neutral,

          datasetUploaded:
            totalFeedback > 0,


          // ===============================================
          // BACKEND DATA
          // ===============================================

          backendMetrics:
            dashboard,

          backendThemeSummary:
            themes,

          backendSentimentSummary:
            sentimentSummary,

          backendCategorizationSummary:
            categories,

          backendPainPoints:
            painPoints,

          backendFeatureRequests:
            featureRequests,

          trendReport:
            trends,


          // ===============================================
          // MILESTONE 4
          // ===============================================

          backendFeatureScores:
            featureScores.length > 0
              ? featureScores
              : prev.backendFeatureScores,

          backendPrioritization:
            prioritization.length > 0
              ? prioritization
              : prev.backendPrioritization,

          backendRoadmap:
            roadmap.length > 0
              ? roadmap
              : prev.backendRoadmap,

          backendMilestoneRecommendation:
            response.milestone_recommendation ??
            dashboard.milestone_recommendation ??
            prev.backendMilestoneRecommendation ??
            null,

          backendExecutiveSummary:
            response.executive_summary ??
            dashboard.executive_summary ??
            prev.backendExecutiveSummary ??
            null,

          backendProductStrategy:
            response.product_strategy ??
            dashboard.product_strategy ??
            prev.backendProductStrategy ??
            null,

          backendEvaluation:
            response.evaluation ??
            dashboard.evaluation ??
            prev.backendEvaluation ??
            null

        }));


        setApiConnected(true);


        return dashboard;

      } catch (error) {

        console.error(
          'Dashboard fetch failed:',
          error
        );

        setApiConnected(false);

        return null;

      }

    }, [
      clearAnalysisData
    ]);


  // =======================================================
  // LOGIN FETCH
  // =======================================================

  useEffect(() => {

    if (isLoggedIn) {

      fetchBackendDashboard();

    }

  }, [
    isLoggedIn,
    fetchBackendDashboard
  ]);


  // =======================================================
  // PERMISSIONS
  // =======================================================

  const hasPermission =
    (permission) => {

      const role =
        data.userProfile?.role ||
        'Product Manager';


      if (role === 'Admin') {

        return true;

      }


      if (role === 'Product Manager') {

        if (
          [
            'manage_users',
            'view_logs'
          ].includes(permission)
        ) {

          return false;

        }

        return true;

      }


      if (role === 'Analyst') {

        if (
          [
            'manage_users',
            'view_logs',
            'manage_settings',
            'generate_prd'
          ].includes(permission)
        ) {

          return false;

        }

        return true;

      }


      return false;

    };


  // =======================================================
  // LOGIN
  // =======================================================

  const login = ({
    email,
    role,
    token,
    username
  }) => {

    let name =
      username ||
      'Product Manager';


    if (role === 'Admin') {

      name =
        username ||
        'System Administrator';

    } else if (role === 'Analyst') {

      name =
        username ||
        'Analyst';

    }


    if (token) {

      localStorage.setItem(
        'access_token',
        token
      );

    }


    setData(prev => ({

      ...prev,

      userProfile: {

        ...prev.userProfile,

        name,

        role:
          role ||
          'Product Manager',

        email:
          email ||
          prev.userProfile?.email ||
          ''

      }

    }));


    setIsLoggedIn(true);


    setActiveModule(
      'dashboard'
    );

  };


  // =======================================================
  // LOGOUT
  // =======================================================

  const logout = () => {

    localStorage.removeItem(
      'access_token'
    );


    setIsLoggedIn(false);


    setApiConnected(false);


    setData(
      createEmptyData()
    );


    setChartData(
      createEmptyChartData()
    );


    setActiveModule(
      'dashboard'
    );

  };


  // =======================================================
  // FEEDBACK
  // =======================================================

  const addFeedbackItem =
    (newItem) => {

      if (!newItem) {

        return;

      }


      setData(prev => ({

        ...prev,

        feedbackItems: [

          newItem,

          ...(prev.feedbackItems || [])

        ]

      }));

    };


  // =======================================================
  // UPLOAD DATA
  // =======================================================

  const setUploadedData =
    (apiPayload) => {

      if (!apiPayload) {

        return;

      }


      console.log(
        'UPLOAD API PAYLOAD:',
        apiPayload
      );


      const rows =
        Number(
          apiPayload.rows_processed ??
          apiPayload.totalFeedback ??
          apiPayload.total_feedback ??
          0
        );


      // =====================================================
      // SENTIMENT
      // =====================================================

      const sentimentSummary =
        apiPayload.sentiment_summary ||
        apiPayload.sentimentSummary ||
        {};

      const normalizedSentimentSummary =
        sentimentSummary.sentiment_distribution ||
        sentimentSummary;


      const positive =
        Number(
          normalizedSentimentSummary.Positive ??
          normalizedSentimentSummary.positive ??
          apiPayload.positive_count ??
          apiPayload.positive ??
          0
        );


      const negative =
        Number(
          normalizedSentimentSummary.Negative ??
          normalizedSentimentSummary.negative ??
          apiPayload.negative_count ??
          apiPayload.negative ??
          0
        );


      const neutral =
        Number(
          normalizedSentimentSummary.Neutral ??
          normalizedSentimentSummary.neutral ??
          apiPayload.neutral_count ??
          apiPayload.neutral ??
          0
        );


      // =====================================================
      // CATEGORIES
      // =====================================================

      const rawCategories =
        apiPayload.categorization_summary ||
        apiPayload.category_summary ||
        apiPayload.categories ||
        {};

      const normalizedCategories =
        rawCategories.category_distribution ||
        rawCategories.categories ||
        rawCategories;


      const newCategories =
        Object.entries(
          normalizedCategories
        ).map(
          ([name, value], index) => ({

            id:
              `cat-${index}`,

            name,

            count:
              Number(value) || 0,

            sharePct:
              rows > 0
                ? Math.round(
                    (
                      (
                        Number(value) || 0
                      ) / rows
                    ) * 100
                  )
                : 0

          })
        );


      // =====================================================
      // THEMES
      // =====================================================

      const rawThemes =
        apiPayload.theme_summary ||
        apiPayload.themes ||
        {};

      const normalizedThemes =
        rawThemes.theme_distribution ||
        rawThemes.themes ||
        rawThemes;


      const newThemes =
        Object.entries(
          normalizedThemes
        ).map(
          ([title, value], index) => ({

            id:
              `theme-${index}`,

            title,

            name:
              title,

            ticketCount:
              Number(value) || 0,

            sharePct:
              rows > 0
                ? Math.round(
                    (
                      (
                        Number(value) || 0
                      ) / rows
                    ) * 100
                  )
                : 0,

            status:
              'Active Clusters',

            affectedArr:
              '',

            aiSummary:
              ''

          })
        );


      // =====================================================
      // FEATURES
      // =====================================================

      const rawFeatures =
        apiPayload.feature_request_summary ||
        apiPayload.featureRequests ||
        {};


      let featureDistribution = {};


      if (
        rawFeatures &&
        typeof rawFeatures === 'object'
      ) {

        featureDistribution =
          rawFeatures.feature_request_distribution ||
          rawFeatures.features ||
          rawFeatures;

      }


      const newFeatures =
        Object.entries(
          featureDistribution
        ).map(
          ([title, value], index) => {

            const requestCount =
              Number(value) || 0;


            const reach =
              requestCount;


            const impact =
              1;


            const confidence =
              100;


            const effort =
              1;


            const riceScore =
              Number(
                (
                  reach *
                  impact *
                  (
                    confidence / 100
                  ) /
                  effort
                ).toFixed(1)
              );


            return {

              id:
                `feat-${index}`,

              title,

              name:
                title,

              upvotes:
                requestCount,

              requestCount,

              reach,

              impact,

              confidence,

              effort,

              riceScore,

              status:
                'Prioritized',

              arrImpact:
                '',

              description:
                ''

            };

          }
        );


      // =====================================================
      // MILESTONE 4
      // =====================================================

      const backendFeatureScores =
        Array.isArray(
          apiPayload.feature_scores
        )
          ? apiPayload.feature_scores
          : [];


      const backendPrioritization =
        Array.isArray(
          apiPayload.feature_prioritization
        )
          ? apiPayload.feature_prioritization
          : Array.isArray(
              apiPayload.prioritization
            )
              ? apiPayload.prioritization
              : [];


      const backendRoadmap =
        Array.isArray(
          apiPayload.roadmap
        )
          ? apiPayload.roadmap
          : [];


      // =====================================================
      // PRIORITIZATION MAP
      // =====================================================

      const prioritizedByFeature = {};


      backendPrioritization.forEach(
        item => {

          if (item?.feature) {

            prioritizedByFeature[
              item.feature
            ] = item;

          }

        }
      );


      const finalFeatures =
        newFeatures.map(
          feature => {

            const priority =
              prioritizedByFeature[
                feature.title
              ];


            if (!priority) {

              return feature;

            }


            return {

              ...feature,

              priority:
                priority.priority,

              rank:
                priority.rank,

              score:
                priority.score,

              riceScore:
                priority.score

            };

          }
        );


      // =====================================================
      // TREND
      // =====================================================

      const trendReport =
        apiPayload.trend_report ||
        apiPayload.trendReport ||
        [];


      // =====================================================
      // STATE
      // =====================================================

      setData(prev => ({

        ...prev,

        uploadedFileName:
          apiPayload.file_name ||
          null,

        datasetUploaded:
          rows > 0,

        totalFeedbackCount:
          rows,

        positiveCount:
          positive,

        negativeCount:
          negative,

        neutralCount:
          neutral,

        categories:
          newCategories,

        themes:
          newThemes,

        features:
          finalFeatures,


        // ===================================================
        // BACKEND ANALYSIS
        // ===================================================

        backendThemeSummary:
          apiPayload.theme_summary ||
          null,

        backendSentimentSummary:
          apiPayload.sentiment_summary ||
          null,

        backendCategorizationSummary:
          apiPayload.categorization_summary ||
          null,

        backendPainPoints:
          apiPayload.pain_point_summary ||
          null,

        backendFeatureRequests:
          apiPayload.feature_request_summary ||
          null,

        trendReport,


        // ===================================================
        // MILESTONE 4
        // ===================================================

        backendFeatureScores,

        backendPrioritization,

        backendRoadmap,

        backendMilestoneRecommendation:
          apiPayload.milestone_recommendation ||
          null,

        backendExecutiveSummary:
          apiPayload.executive_summary ||
          null,

        backendProductStrategy:
          apiPayload.product_strategy ||
          null,

        backendEvaluation:
          apiPayload.evaluation ||
          null,

        roadmapItems:
          backendRoadmap

      }));


      // =====================================================
      // CHARTS
      // =====================================================

      const sentiment = [];


      if (positive > 0) {

        sentiment.push({
          name: 'Positive',
          value: positive,
          color: '#10b981'
        });

      }


      if (neutral > 0) {

        sentiment.push({
          name: 'Neutral',
          value: neutral,
          color: '#06b6d4'
        });

      }


      if (negative > 0) {

        sentiment.push({
          name: 'Negative',
          value: negative,
          color: '#f43f5e'
        });

      }


      setChartData({

        themeDistribution:

          newCategories.length > 0

            ? newCategories.map(
                category => ({

                  name:
                    category.name,

                  tickets:
                    category.count

                })
              )

            : newThemes.map(
                theme => ({

                  name:
                    theme.title,

                  tickets:
                    theme.ticketCount

                })
              ),

        sentiment,

        trends:
          trendReport

      });


      setApiConnected(true);

    };


  // =======================================================
  // PROMOTE THEME
  // =======================================================

  const promoteThemeToFeature =
    (themeId) => {

      const selectedTheme =
        (data.themes || []).find(
          item =>
            item.id === themeId
        );


      if (!selectedTheme) {

        return;

      }


      const newFeature = {

        id:
          `feat-${Date.now()}`,

        title:
          selectedTheme.title,

        themeId:
          selectedTheme.id,

        description:
          selectedTheme.aiSummary || '',

        upvotes:
          Number(
            selectedTheme.ticketCount
          ) || 0,

        reach:
          Number(
            selectedTheme.ticketCount
          ) || 0,

        impact:
          1,

        confidence:
          100,

        effort:
          1,

        riceScore:
          Number(
            selectedTheme.ticketCount
          ) || 0,

        kanoCategory:
          '',

        valueScore:
          0,

        arrImpact:
          '',

        status:
          'Prioritized',

        assignee:
          'Unassigned'

      };


      setData(prev => ({

        ...prev,

        features: [

          newFeature,

          ...(prev.features || [])

        ],

        themes:

          (prev.themes || []).map(
            item =>

              item.id === themeId

                ? {
                    ...item,
                    status:
                      'Promoted to Feature',
                    featureId:
                      newFeature.id
                  }

                : item

          )

      }));


      setActiveModule(
        'reports'
      );

    };


  // =======================================================
  // UPDATE FEATURE SCORE
  // =======================================================

  const updateFeatureScore =
    (
      featureId,
      updatedScores
    ) => {

      setData(prev => {

        const updatedFeatures =
          (prev.features || []).map(
            feature => {

              if (
                feature.id !==
                featureId
              ) {

                return feature;

              }


              const nextFeature = {

                ...feature,

                ...updatedScores

              };


              const reach =
                Number(
                  nextFeature.reach
                ) || 0;


              const impact =
                Number(
                  nextFeature.impact
                ) || 0;


              const confidence =
                Number(
                  nextFeature.confidence
                ) || 0;


              const effort =
                Number(
                  nextFeature.effort
                ) || 1;


              nextFeature.riceScore =
                Number(
                  (
                    reach *
                    impact *
                    (
                      confidence / 100
                    ) /
                    effort
                  ).toFixed(1)
                );


              return nextFeature;

            }
          );


        return {

          ...prev,

          features:
            updatedFeatures

        };

      });

    };


  // =======================================================
  // CREATE PRD
  // =======================================================

  const createPRD =
    async (featureId) => {

      if (!hasUploadedData) {

        throw new Error(
          'Please upload and process a feedback dataset before generating a PRD.'
        );

      }


      if (
        !data.features?.length &&
        !data.themes?.length
      ) {

        throw new Error(
          'No analyzed themes or feature requests are available.'
        );

      }


      try {

        const selectedFeature =
          (data.features || []).find(
            feature => feature.id === featureId
          );

        const response =
          await api.generatePrd(
            selectedFeature?.title || featureId || ''
          );


        if (!response) {

          throw new Error(
            'The PRD service returned an empty response.'
          );

        }


        const prdText =
          response.prd ||
          response.data?.prd ||
          '';


        const newPrd = {

          id:
            `prd-${Date.now()}`,

          title:
            'AI Generated Product Requirements Document',

          version:
            'v1.0',

          author:
            data.userProfile?.name ||
            'AI Product Manager',

          lastUpdated:
            new Date().toLocaleString(),

          overview:
            prdText,

          problemStatement:
            '',

          targetAudience:
            '',

          goals:
            [],

          functionalRequirements:
            [],

          nonFunctionalRequirements:
            [],

          businessImpact:
            '',

          risks:
            '',

          userStories:
            [],

          rawMarkdown:
            prdText

        };


        setData(prev => ({

          ...prev,

          prds: [

            newPrd,

            ...(prev.prds || [])

          ]

        }));


        setActiveModule(
          'prd'
        );


        return newPrd;

      } catch (error) {

        console.error(
          'PRD generation failed:',
          error
        );

        throw error;

      }

    };


  // =======================================================
  // THEME
  // =======================================================

  const addTheme =
    (newTheme) => {

      if (!newTheme) {

        return;

      }


      setData(prev => ({

        ...prev,

        themes: [

          newTheme,

          ...(prev.themes || [])

        ]

      }));

    };


  const deleteTheme =
    (themeId) => {

      setData(prev => ({

        ...prev,

        themes:

          (prev.themes || []).filter(
            selectedTheme =>
              selectedTheme.id !== themeId
          )

      }));

    };


  // =======================================================
  // USER STORIES
  // =======================================================

  const addUserStory =
    (newStory) => {

      if (!newStory) {

        return;

      }


      setData(prev => ({

        ...prev,

        userStories: [

          ...(prev.userStories || []),

          newStory

        ]

      }));

    };


  const updateUserStory =
    (
      storyId,
      updates
    ) => {

      setData(prev => ({

        ...prev,

        userStories:

          (
            prev.userStories || []
          ).map(
            story =>

              story.id === storyId

                ? {
                    ...story,
                    ...updates
                  }

                : story

          )

      }));

    };


  const deleteUserStory =
    (storyId) => {

      setData(prev => ({

        ...prev,

        userStories:

          (
            prev.userStories || []
          ).filter(
            story =>
              story.id !== storyId
          )

      }));

    };


  // =======================================================
  // CHAT
  // =======================================================

  const addChatMessage =
    (msg) => {

      if (!msg) {

        return;

      }


      setData(prev => ({

        ...prev,

        chatHistory: [

          ...(prev.chatHistory || []),

          msg

        ]

      }));

    };


  // =======================================================
  // WORKSPACE
  // =======================================================

  const switchWorkspace =
    (wsId) => {

      setData(prev => ({

        ...prev,

        activeWorkspaceId:
          wsId

      }));

    };


  // =======================================================
  // PROVIDER
  // =======================================================

  return (

    <AppContext.Provider
      value={{

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

        apiConnected,

        hasUploadedData,

        addFeedbackItem,

        setUploadedData,

        clearAnalysisData,

        fetchBackendDashboard,

        promoteThemeToFeature,

        updateFeatureScore,

        createPRD,

        switchWorkspace,

        addTheme,

        deleteTheme,

        addUserStory,

        updateUserStory,

        deleteUserStory,

        addChatMessage

      }}
    >

      {children}

    </AppContext.Provider>

  );

};


// =========================================================
// HOOK
// =========================================================

export const useApp =
  () =>
    useContext(
      AppContext
    );