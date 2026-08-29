import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  RefreshCw,
  Users,
  TrendingDown,
  Zap,
  AlertTriangle,
  Tag,
  MessageSquare
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { api } from '../../services/api';


const toChartData = (value) => {

  if (Array.isArray(value)) {
    return value.map(item => ({
      name: item.name || item.label || item.Category || item.Theme || item.Sentiment,
      value: Number(item.value ?? item.count ?? item.Count ?? 0)
    })).filter(item => item.name && item.value > 0);
  }

  if (!value || typeof value !== 'object') {
    return [];
  }

  const nested = value.category_distribution || value.categorization_distribution || value.theme_distribution || value.sentiment_distribution || value.distribution || value.data;

  if (nested && nested !== value) {
    return toChartData(nested);
  }

  return Object.entries(value)
    .filter(([, item]) => typeof item !== 'object' && Number(item) > 0)
    .map(([name, item]) => ({ name, value: Number(item) }))
    .sort((a, b) => b.value - a.value);
};

const CHART_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

const summaryDistribution = (value, key) => {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return value[`${key}_distribution`] || value.distribution || value;
};


export const AnalyticsIntegrationModule = () => {

  const { data } = useApp();
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');


  // =====================================================
  // LOAD ANALYTICS DATA
  // =====================================================

  const loadAnalytics = async () => {

    try {

      setLoading(true);

      setError('');


      const response =
        await api.getAnalytics();


      setAnalytics(response);


    } catch (error) {

      console.error(
        'Analytics loading error:',
        error
      );


      if (data?.totalFeedbackCount > 0) {
        setAnalytics({
          total_feedback: data.totalFeedbackCount,
          category_summary: data.backendCategorizationSummary || data.categories,
          sentiment_summary: data.backendSentimentSummary,
          theme_summary: data.backendThemeSummary || data.themes,
          pain_point_summary: data.backendPainPoints,
          feature_request_summary: data.backendFeatureRequests
        });
        return;
      }

      setError(error.message || 'Unable to load analytics data.');

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD ON PAGE OPEN
  // =====================================================

  useEffect(() => {

    loadAnalytics();

  }, [data?.totalFeedbackCount]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div
        className="module-body"
        style={{
          textAlign: 'center',
          padding: '80px'
        }}
      >

        <RefreshCw
          size={32}
          className="spin"
        />

        <p
          style={{
            marginTop: '15px'
          }}
        >
          Loading analytics...
        </p>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div
        className="module-body"
        style={{
          textAlign: 'center',
          padding: '80px'
        }}
      >

        <AlertTriangle
          size={35}
        />

        <h3
          style={{
            marginTop: '15px'
          }}
        >
          Analytics Not Available
        </h3>

        <p
          style={{
            marginTop: '10px'
          }}
        >
          {error}
        </p>

        <button
          className="btn btn-primary"
          onClick={loadAnalytics}
          style={{
            marginTop: '20px'
          }}
        >

          <RefreshCw size={16} />

          Retry

        </button>

      </div>

    );

  }


  // =====================================================
  // DATA
  // =====================================================

  const totalFeedback =
    analytics?.total_feedback || 0;


  const categorySummary =
    summaryDistribution(analytics?.category_summary, 'category');


  const sentimentSummary =
    summaryDistribution(analytics?.sentiment_summary, 'sentiment');


  const themeSummary =
    summaryDistribution(analytics?.theme_summary, 'theme');


  const painPointSummary =
    summaryDistribution(analytics?.pain_point_summary, 'pain_point');


  const featureRequestSummary =
    summaryDistribution(analytics?.feature_request_summary, 'feature_request');


  const sentimentTrends =
    analytics?.sentiment_trends || [];


  const categoryTrends =
    analytics?.category_trends || [];


  const themeTrends =
    analytics?.theme_trends || [];


  const painPointTrends =
    analytics?.pain_point_trends || [];


  const featureRequestTrends =
    analytics?.feature_request_trends || [];


  const categoryChartData =
    categoryTrends.length > 0
      ? categoryTrends.map(item => ({
          name: item.Category || item.category || item.name,
          value: Number(item.Count ?? item.count ?? item.value ?? 0)
        }))
      : toChartData(categorySummary);


  const themeChartData =
    themeTrends.length > 0
      ? themeTrends.map(item => ({
          name: item.Theme || item.theme || item.name,
          value: Number(item.Count ?? item.count ?? item.value ?? 0)
        }))
      : toChartData(themeSummary);


  const sentimentChartData =
    toChartData(sentimentSummary);


  // =====================================================
  // HELPER FUNCTION
  // =====================================================

  const getTopItem = (data) => {

    const entries =
      Object.entries(data || {});


    if (!entries.length) {

      return {
        name: 'No data',
        count: 0
      };

    }


    const top =
      entries.sort(
        (a, b) => b[1] - a[1]
      )[0];


    return {

      name: top[0],

      count: top[1]

    };

  };


  const topCategory =
    getTopItem(
      categorySummary
    );


  const topTheme =
    getTopItem(
      themeSummary
    );


  const topPainPoint =
    getTopItem(
      painPointSummary
    );


  const topFeatureRequest =
    getTopItem(
      featureRequestSummary
    );


  return (

    <div className="animate-fade-in">


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="module-header">

        <div>

          <span
            className="badge badge-primary"
            style={{
              marginBottom: '8px'
            }}
          >
            Module 3: Analytics
          </span>


          <h1
            style={{
              fontSize: '1.75rem'
            }}
          >
            Product Analytics
          </h1>


          <p
            style={{
              color:
                'var(--text-muted)',

              fontSize:
                '0.9rem',

              marginTop:
                '4px'
            }}
          >
            Analytics generated from your uploaded customer feedback dataset.
          </p>

        </div>


        <button
          className="btn btn-secondary"
          onClick={loadAnalytics}
        >

          <RefreshCw size={16} />

          Refresh Analytics

        </button>

      </div>


      <div className="module-body">


        {/* ================================================= */}
        {/* SUMMARY CARDS */}
        {/* ================================================= */}

        <div
          className="grid-3"
          style={{
            marginBottom:
              '24px'
          }}
        >


          <div
            className="glass-card"
            style={{
              padding:
                '20px'
            }}
          >

            <Users
              size={22}
            />

            <p
              style={{
                color:
                  'var(--text-muted)',

                marginTop:
                  '10px'
              }}
            >
              Total Feedback
            </p>

            <h2>
              {totalFeedback}
            </h2>

          </div>


          <div
            className="glass-card"
            style={{
              padding:
                '20px'
            }}
          >

            <Tag
              size={22}
            />

            <p
              style={{
                color:
                  'var(--text-muted)',

                marginTop:
                  '10px'
              }}
            >
              Top Category
            </p>

            <h3>
              {topCategory.name}
            </h3>

            <span>
              {topCategory.count} feedback items
            </span>

          </div>


          <div
            className="glass-card"
            style={{
              padding:
                '20px'
            }}
          >

            <Activity
              size={22}
            />

            <p
              style={{
                color:
                  'var(--text-muted)',

                marginTop:
                  '10px'
              }}
            >
              Top Theme
            </p>

            <h3>
              {topTheme.name}
            </h3>

            <span>
              {topTheme.count} feedback items
            </span>

          </div>


        </div>


        <div
          className="grid-2"
          style={{
            gap: '24px',
            marginBottom: '24px'
          }}
        >

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3>Category Chart</h3>
            <div style={{ width: '100%', height: '280px', marginTop: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 8, right: 12, left: 0, bottom: 42 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3>Sentiment Chart</h3>
            <div style={{ width: '100%', height: '280px', marginTop: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sentimentChartData} dataKey="value" nameKey="name" cx="50%" cy="44%" outerRadius={88} label>
                    {sentimentChartData.map((item, index) => (
                      <Cell key={item.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>


        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3>Theme Chart</h3>
          <div style={{ width: '100%', height: '280px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={themeChartData} layout="vertical" margin={{ top: 8, right: 24, left: 90, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* ================================================= */}
        {/* CATEGORY + THEME */}
        {/* ================================================= */}

        <div
          className="grid-2"
          style={{
            gap:
              '24px',

            marginBottom:
              '24px'
          }}
        >


          {/* CATEGORY */}

          <div
            className="glass-panel"
            style={{
              padding:
                '24px'
            }}
          >

            <h3>
              Category Distribution
            </h3>


            <div
              style={{
                marginTop:
                  '20px'
              }}
            >

              {categoryTrends.map(
                (item, index) => (

                  <div
                    key={index}
                    style={{
                      display:
                        'flex',

                      justifyContent:
                        'space-between',

                      padding:
                        '12px 0',

                      borderBottom:
                        '1px solid var(--border-color)'
                    }}
                  >

                    <span>
                      {item.Category}
                    </span>

                    <strong>
                      {item.Count}
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>


          {/* THEME */}

          <div
            className="glass-panel"
            style={{
              padding:
                '24px'
            }}
          >

            <h3>
              Theme Distribution
            </h3>


            <div
              style={{
                marginTop:
                  '20px'
              }}
            >

              {themeTrends.map(
                (item, index) => (

                  <div
                    key={index}
                    style={{
                      display:
                        'flex',

                      justifyContent:
                        'space-between',

                      padding:
                        '12px 0',

                      borderBottom:
                        '1px solid var(--border-color)'
                    }}
                  >

                    <span>
                      {item.Theme}
                    </span>

                    <strong>
                      {item.Count}
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>


        </div>


        {/* ================================================= */}
        {/* SENTIMENT */}
        {/* ================================================= */}

        <div
          className="glass-panel"
          style={{
            padding:
              '24px',

            marginBottom:
              '24px'
          }}
        >

          <div
            style={{
              display:
                'flex',

              alignItems:
                'center',

              gap:
                '10px'
            }}
          >

            <MessageSquare
              size={20}
            />

            <h3>
              Sentiment Analysis
            </h3>

          </div>


          <div
            className="grid-3"
            style={{
              marginTop:
                '20px'
            }}
          >

            {sentimentTrends.map(
              (item, index) => (

                <div
                  key={index}
                  className="glass-card"
                  style={{
                    padding:
                      '18px'
                  }}
                >

                  <p>
                    {item.Sentiment}
                  </p>

                  <h2>
                    {item.Count}
                  </h2>

                </div>

              )
            )}

          </div>

        </div>


        {/* ================================================= */}
        {/* PAIN POINTS + FEATURE REQUESTS */}
        {/* ================================================= */}

        <div
          className="grid-2"
          style={{
            gap:
              '24px'
          }}
        >


          {/* PAIN POINTS */}

          <div
            className="glass-panel"
            style={{
              padding:
                '24px'
            }}
          >

            <div
              style={{
                display:
                  'flex',

                alignItems:
                  'center',

                gap:
                  '10px'
              }}
            >

              <TrendingDown
                size={20}
              />

              <h3>
                Top Pain Points
              </h3>

            </div>


            <div
              style={{
                marginTop:
                  '20px'
              }}
            >

              {painPointTrends.map(
                (item, index) => (

                  <div
                    key={index}
                    style={{
                      display:
                        'flex',

                      justifyContent:
                        'space-between',

                      padding:
                        '12px 0',

                      borderBottom:
                        '1px solid var(--border-color)'
                    }}
                  >

                    <span>
                      {item['Pain Point']}
                    </span>

                    <strong>
                      {item.Count}
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>


          {/* FEATURE REQUESTS */}

          <div
            className="glass-panel"
            style={{
              padding:
                '24px'
            }}
          >

            <div
              style={{
                display:
                  'flex',

                alignItems:
                  'center',

                gap:
                  '10px'
              }}
            >

              <Zap
                size={20}
              />

              <h3>
                Feature Requests
              </h3>

            </div>


            <div
              style={{
                marginTop:
                  '20px'
              }}
            >

              {featureRequestTrends.map(
                (item, index) => (

                  <div
                    key={index}
                    style={{
                      display:
                        'flex',

                      justifyContent:
                        'space-between',

                      padding:
                        '12px 0',

                      borderBottom:
                        '1px solid var(--border-color)'
                    }}
                  >

                    <span>
                      {item.Feature}
                    </span>

                    <strong>
                      {item.Count}
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>


        </div>


      </div>

    </div>

  );

};