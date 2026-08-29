import React, { useMemo } from 'react';

import { useApp } from '../../context/AppContext';

import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Layers,
  AlertCircle,
  Sparkles
} from 'lucide-react';


// =========================================================
// HELPERS
// =========================================================

const numberValue = (value) => {

  const n = Number(value);

  return Number.isFinite(n) ? n : 0;

};


// =========================================================
// NORMALIZE DISTRIBUTION
// =========================================================

const normalizeDistribution = (value) => {

  if (!value) {
    return [];
  }


  if (Array.isArray(value)) {

    return value
      .map((item) => {

        if (!item || typeof item !== 'object') {
          return null;
        }

        const name =
          item.name ??
          item.title ??
          item.theme ??
          item.category ??
          item.label ??
          item.Theme ??
          item.Category;

        const numericValue =
          item.value ??
          item.count ??
          item.ticketCount ??
          item.feedbackCount ??
          item.Count ??
          item.tickets;

        const finalValue =
          numberValue(numericValue);

        if (!name || finalValue <= 0) {
          return null;
        }

        return {
          name: String(name),
          value: finalValue
        };

      })
      .filter(Boolean)
      .sort((a, b) => b.value - a.value);

  }


  if (typeof value !== 'object') {
    return [];
  }


  const nestedKeys = [
    'distribution',
    'category_distribution',
    'categorization_distribution',
    'theme_distribution',
    'sentiment_distribution',
    'category_distribution',
    'feature_distribution',
    'feature_request_distribution',
    'categories',
    'themes',
    'features',
    'data'
  ];


  for (const key of nestedKeys) {

    if (
      value[key] !== undefined &&
      value[key] !== null
    ) {

      const nested =
        normalizeDistribution(value[key]);

      if (nested.length > 0) {
        return nested;
      }

    }

  }


  const ignoredKeys = [
    'total',
    'total_count',
    'total_feedback',
    'total_categories',
    'total_themes',
    'total_feature_requests',
    'top_category',
    'top_theme',
    'top_feature',
    'top_feature_request',
    'message',
    'status'
  ];


  return Object.entries(value)
    .filter(([key, itemValue]) => {

      if (ignoredKeys.includes(key)) {
        return false;
      }

      const numeric =
        Number(itemValue);

      return (
        Number.isFinite(numeric) &&
        numeric > 0
      );

    })
    .map(([name, value]) => ({
      name: String(name),
      value: numberValue(value)
    }))
    .sort((a, b) => b.value - a.value);

};


// =========================================================
// NORMALIZE TREND
// =========================================================

const normalizeTrend = (value) => {

  if (!value) {
    return [];
  }


  if (Array.isArray(value)) {

    return value
      .map((item) => {

        if (!item || typeof item !== 'object') {
          return null;
        }

        const label =
          item.label ??
          item.name ??
          item.category ??
          item.Category ??
          item.theme ??
          item.Theme ??
          item.sentiment ??
          item.Sentiment ??
          item.date ??
          item.Date;

        const numericValue =
          item.value ??
          item.count ??
          item.Count ??
          item.total ??
          item.feedbackCount ??
          item.tickets;

        const finalValue =
          numberValue(numericValue);

        if (!label || finalValue <= 0) {
          return null;
        }

        return {
          label: String(label),
          value: finalValue
        };

      })
      .filter(Boolean)
      .sort((a, b) => b.value - a.value);

  }


  if (typeof value !== 'object') {
    return [];
  }


  const nestedKeys = [
    'category_trends',
    'theme_trends',
    'sentiment_trends',
    'pain_point_trends',
    'feature_request_trends',
    'trends',
    'trend',
    'data'
  ];


  for (const key of nestedKeys) {

    if (
      value[key] !== undefined &&
      value[key] !== null
    ) {

      const result =
        normalizeTrend(value[key]);

      if (result.length > 0) {
        return result;
      }

    }

  }


  return Object.entries(value)
    .map(([label, value]) => ({
      label,
      value: numberValue(value)
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

};


// =========================================================
// RAW FEEDBACK SENTIMENT
// =========================================================

const calculateSentimentFromFeedback = (items = []) => {

  let positive = 0;
  let negative = 0;
  let neutral = 0;


  if (!Array.isArray(items)) {

    return {
      positive: 0,
      negative: 0,
      neutral: 0
    };

  }


  items.forEach((item) => {

    if (!item || typeof item !== 'object') {
      return;
    }


    const raw =
      item.sentiment ??
      item.Sentiment ??
      item.sentiment_label ??
      item.sentimentLabel ??
      item.label ??
      item.polarity ??
      item.Polarity ??
      item.classification ??
      item.Classification ??
      '';


    const sentiment =
      String(raw)
        .trim()
        .toLowerCase();


    if (
      sentiment === 'positive' ||
      sentiment === 'positive feedback' ||
      sentiment === 'pos'
    ) {

      positive++;

      return;

    }


    if (
      sentiment === 'negative' ||
      sentiment === 'negative feedback' ||
      sentiment === 'neg'
    ) {

      negative++;

      return;

    }


    if (
      sentiment === 'neutral' ||
      sentiment === 'neutral feedback' ||
      sentiment === 'neu'
    ) {

      neutral++;

    }

  });


  return {
    positive,
    negative,
    neutral
  };

};


// =========================================================
// DASHBOARD
// =========================================================

export const DashboardView = () => {

  const {
    data,
    chartData,
    hasUploadedData
  } = useApp();


  // =======================================================
  // BACKEND DASHBOARD
  // =======================================================

  const backendDashboard =
    data?.dashboard ??
    data?.backendDashboard ??
    data?.dashboardData ??
    {};


  // =======================================================
  // TOTAL
  // =======================================================

  const totalFeedback =
    numberValue(
      data?.totalFeedbackCount ??
      data?.total_feedback ??
      data?.totalFeedback ??
      data?.total ??
      backendDashboard?.["Total Feedback"] ??
      backendDashboard?.total_feedback ??
      backendDashboard?.total
    );


  // =======================================================
  // RAW FEEDBACK SENTIMENT
  // =======================================================

  const feedbackItems =
    data?.feedbackItems ??
    data?.feedback_items ??
    data?.feedback ??
    data?.records ??
    [];


  const feedbackSentiment =
    useMemo(
      () =>
        calculateSentimentFromFeedback(
          feedbackItems
        ),
      [feedbackItems]
    );


  // =======================================================
  // STORED POSITIVE
  // =======================================================

  const storedPositive =
    numberValue(
      data?.positiveCount ??
      data?.positive_count ??
      data?.positive ??
      data?.Positive ??
      data?.["Positive Feedback"] ??
      data?.sentimentSummary?.Positive ??
      data?.sentimentSummary?.positive ??
      data?.sentimentSummary?.["Positive Feedback"] ??
      data?.backendSentimentSummary?.Positive ??
      data?.backendSentimentSummary?.positive ??
      data?.backendSentimentSummary?.["Positive Feedback"] ??
      backendDashboard?.Positive ??
      backendDashboard?.positive ??
      backendDashboard?.["Positive Feedback"]
    );


  // =======================================================
  // STORED NEGATIVE
  // =======================================================

  const storedNegative =
    numberValue(
      data?.negativeCount ??
      data?.negative_count ??
      data?.negative ??
      data?.Negative ??
      data?.["Negative Feedback"] ??
      data?.sentimentSummary?.Negative ??
      data?.sentimentSummary?.negative ??
      data?.sentimentSummary?.["Negative Feedback"] ??
      data?.backendSentimentSummary?.Negative ??
      data?.backendSentimentSummary?.negative ??
      data?.backendSentimentSummary?.["Negative Feedback"] ??
      backendDashboard?.Negative ??
      backendDashboard?.negative ??
      backendDashboard?.["Negative Feedback"]
    );


  // =======================================================
  // STORED NEUTRAL
  // =======================================================

  const storedNeutral =
    numberValue(
      data?.neutralCount ??
      data?.neutral_count ??
      data?.neutral ??
      data?.Neutral ??
      data?.["Neutral Feedback"] ??
      data?.sentimentSummary?.Neutral ??
      data?.sentimentSummary?.neutral ??
      data?.sentimentSummary?.["Neutral Feedback"] ??
      data?.backendSentimentSummary?.Neutral ??
      data?.backendSentimentSummary?.neutral ??
      data?.backendSentimentSummary?.["Neutral Feedback"] ??
      backendDashboard?.Neutral ??
      backendDashboard?.neutral ??
      backendDashboard?.["Neutral Feedback"]
    );


  // =======================================================
  // FINAL SENTIMENT
  //
  // Backend dashboard has priority.
  // If backend gives zero, raw feedback is used.
  // =======================================================

  const positive =
    storedPositive > 0
      ? storedPositive
      : feedbackSentiment.positive;


  const negative =
    storedNegative > 0
      ? storedNegative
      : feedbackSentiment.negative;


  const neutral =
    storedNeutral > 0
      ? storedNeutral
      : feedbackSentiment.neutral;


  // =======================================================
  // PERCENTAGES
  // =======================================================

  const positivePct =
    totalFeedback > 0
      ? Math.round(
          (positive / totalFeedback) * 100
        )
      : 0;


  const negativePct =
    totalFeedback > 0
      ? Math.round(
          (negative / totalFeedback) * 100
        )
      : 0;


  const neutralPct =
    totalFeedback > 0
      ? Math.round(
          (neutral / totalFeedback) * 100
        )
      : 0;


  // =======================================================
  // CATEGORY DATA
  // =======================================================

  const categoryDistribution =
    useMemo(() => {

      const sources = [

        data?.backendCategorizationSummary,

        data?.categorizationSummary,

        data?.category_summary,

        data?.categorySummary,

        backendDashboard?.Categories,

        backendDashboard?.categories,

        data?.categories

      ];


      for (const source of sources) {

        const result =
          normalizeDistribution(source);

        if (result.length > 0) {
          return result;
        }

      }


      return [];

    }, [
      data?.backendCategorizationSummary,
      data?.categorizationSummary,
      data?.category_summary,
      data?.categorySummary,
      backendDashboard?.Categories,
      backendDashboard?.categories,
      data?.categories
    ]);


  // =======================================================
  // THEME DATA
  // =======================================================

  const themeDistribution =
    useMemo(() => {

      const sources = [

        data?.backendThemeSummary,

        data?.theme_summary,

        data?.themeSummary,

        data?.theme_distribution,

        data?.themeDistribution,

        backendDashboard?.Themes,

        backendDashboard?.themes,

        data?.pipelineResult?.theme_summary,

        data?.pipeline_result?.theme_summary,

        data?.themes

      ];


      for (const source of sources) {

        const result =
          normalizeDistribution(source);

        if (result.length > 0) {
          return result;
        }

      }


      return [];

    }, [
      data?.backendThemeSummary,
      data?.theme_summary,
      data?.themeSummary,
      data?.theme_distribution,
      data?.themeDistribution,
      backendDashboard?.Themes,
      backendDashboard?.themes,
      data?.pipelineResult?.theme_summary,
      data?.pipeline_result?.theme_summary,
      data?.themes
    ]);


  // =======================================================
  // PAIN POINTS
  // =======================================================

  const painPoints =
    useMemo(() => {

      const sources = [

        data?.backendPainPoints,

        data?.painPointSummary,

        data?.pain_point_summary,

        backendDashboard?.["Pain Points"],

        backendDashboard?.pain_points,

        data?.painPoints

      ];


      for (const source of sources) {

        const result =
          normalizeDistribution(source);

        if (result.length > 0) {
          return result;
        }

      }


      return [];

    }, [
      data?.backendPainPoints,
      data?.painPointSummary,
      data?.pain_point_summary,
      backendDashboard?.["Pain Points"],
      backendDashboard?.pain_points,
      data?.painPoints
    ]);


  // =======================================================
  // FEATURE REQUESTS
  // =======================================================

  const featureRequests =
    useMemo(() => {

      const sources = [

        data?.backendFeatureRequests,

        data?.featureRequestSummary,

        data?.feature_request_summary,

        backendDashboard?.["Feature Requests"],

        backendDashboard?.feature_requests,

        data?.featureRequests

      ];


      for (const source of sources) {

        const result =
          normalizeDistribution(source);

        if (result.length > 0) {
          return result;
        }

      }


      return [];

    }, [
      data?.backendFeatureRequests,
      data?.featureRequestSummary,
      data?.feature_request_summary,
      backendDashboard?.["Feature Requests"],
      backendDashboard?.feature_requests,
      data?.featureRequests
    ]);


  // =======================================================
  // TREND
  // =======================================================

  const trendData =
    useMemo(() => {

      const sources = [

        data?.trendReport,

        data?.trend_report,

        data?.trendSummary,

        data?.trend_summary,

        backendDashboard?.["Feedback Trend"],

        backendDashboard?.feedback_trend,

        data?.pipelineResult?.trend_report,

        data?.pipeline_result?.trend_report,

        chartData?.trends

      ];


      for (const source of sources) {

        const result =
          normalizeTrend(source);

        if (result.length > 0) {
          return result;
        }

      }


      if (categoryDistribution.length > 0) {

        return categoryDistribution.map(
          item => ({
            label: item.name,
            value: item.value
          })
        );

      }


      if (themeDistribution.length > 0) {

        return themeDistribution.map(
          item => ({
            label: item.name,
            value: item.value
          })
        );

      }


      return [];

    }, [
      data?.trendReport,
      data?.trend_report,
      data?.trendSummary,
      data?.trend_summary,
      backendDashboard?.["Feedback Trend"],
      backendDashboard?.feedback_trend,
      data?.pipelineResult?.trend_report,
      data?.pipeline_result?.trend_report,
      chartData?.trends,
      categoryDistribution,
      themeDistribution
    ]);


  // =======================================================
  // MAXIMUMS
  // =======================================================

  const maxDistribution =
    Math.max(
      ...themeDistribution.map(
        item => item.value
      ),
      1
    );


  const maxTrend =
    Math.max(
      ...trendData.map(
        item => item.value
      ),
      1
    );


  // =======================================================
  // EMPTY DATA
  // =======================================================

  if (!hasUploadedData) {

    return (
      <div
        className="animate-fade-in"
        style={{
          paddingBottom: '40px'
        }}
      >

        <div className="module-header">

          <h1
            style={{
              fontSize: '1.6rem',
              fontWeight: 700
            }}
          >
            Product Intelligence Dashboard
          </h1>

          <p
            style={{
              color: 'var(--text-muted)',
              marginTop: '5px'
            }}
          >
            Upload customer feedback to
            start analyzing product insights.
          </p>

        </div>


        <div
          className="glass-panel"
          style={{
            padding: '60px 30px',
            textAlign: 'center',
            marginTop: '20px'
          }}
        >

          <BarChart3
            size={48}
          />

          <h2>
            No Feedback Dataset
          </h2>

          <p
            style={{
              color: 'var(--text-muted)',
              marginTop: '8px'
            }}
          >
            Upload and process a customer
            feedback dataset.
          </p>

        </div>

      </div>
    );

  }


  // =======================================================
  // MAIN DASHBOARD
  // =======================================================

  return (

    <div
      className="animate-fade-in"
      style={{
        paddingBottom: '40px'
      }}
    >

      {/* HEADER */}

      <div className="module-header">

        <div>

          <h1
            style={{
              fontSize: '1.6rem',
              fontWeight: 700
            }}
          >
            Product Intelligence Dashboard
          </h1>

          <p
            style={{
              color: 'var(--text-muted)',
              marginTop: '5px'
            }}
          >
            Real-time insights from your
            customer feedback dataset.
          </p>

        </div>

      </div>


      {/* ===================================================
          KPI CARDS
      =================================================== */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(4, minmax(0, 1fr))',
          gap: '16px',
          marginTop: '20px'
        }}
      >

        {/* TOTAL */}

        <div
          className="glass-panel"
          style={{
            padding: '20px'
          }}
        >

          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.82rem'
            }}
          >
            Total Feedback
          </span>

          <div
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginTop: '10px'
            }}
          >
            {totalFeedback}
          </div>

        </div>


        {/* POSITIVE */}

        <div
          className="glass-panel"
          style={{
            padding: '20px'
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between'
            }}
          >

            <span>
              Positive
            </span>

            <ThumbsUp size={20} />

          </div>

          <div
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginTop: '10px'
            }}
          >
            {positive}
          </div>

          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.78rem'
            }}
          >
            {positivePct}% of feedback
          </div>

        </div>


        {/* NEGATIVE */}

        <div
          className="glass-panel"
          style={{
            padding: '20px'
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between'
            }}
          >

            <span>
              Negative
            </span>

            <ThumbsDown size={20} />

          </div>

          <div
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginTop: '10px'
            }}
          >
            {negative}
          </div>

          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.78rem'
            }}
          >
            {negativePct}% of feedback
          </div>

        </div>


        {/* NEUTRAL */}

        <div
          className="glass-panel"
          style={{
            padding: '20px'
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between'
            }}
          >

            <span>
              Neutral
            </span>

            <Minus size={20} />

          </div>

          <div
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginTop: '10px'
            }}
          >
            {neutral}
          </div>

          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.78rem'
            }}
          >
            {neutralPct}% of feedback
          </div>

        </div>

      </div>


      {/* ===================================================
          TREND + THEME
      =================================================== */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            '1fr 1fr',
          gap: '20px',
          marginTop: '20px'
        }}
      >

        {/* TREND */}

        <div
          className="glass-panel"
          style={{
            padding: '22px'
          }}
        >

          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >

            <TrendingUp size={20} />

            <h3>
              Incoming Feedback Trend
            </h3>

          </div>


          {trendData.length === 0 ? (

            <div
              style={{
                padding: '50px 10px',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}
            >
              No trend data available
            </div>

          ) : (

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '13px'
              }}
            >

              {trendData
                .slice(0, 8)
                .map((item, index) => (

                  <div
                    key={`${item.label}-${index}`}
                  >

                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        marginBottom: '6px'
                      }}
                    >

                      <span>
                        {item.label}
                      </span>

                      <strong>
                        {item.value}
                      </strong>

                    </div>

                    <div
                      style={{
                        height: '8px',
                        background:
                          'var(--bg-input)',
                        borderRadius: '10px'
                      }}
                    >

                      <div
                        style={{
                          width:
                            `${Math.max(
                              4,
                              (
                                item.value /
                                maxTrend
                              ) * 100
                            )}%`,
                          height: '100%',
                          background:
                            'var(--accent-primary)',
                          borderRadius: '10px'
                        }}
                      />

                    </div>

                  </div>

                ))}

            </div>

          )}

        </div>


        {/* THEME */}

        <div
          className="glass-panel"
          style={{
            padding: '22px'
          }}
        >

          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >

            <Layers size={20} />

            <h3>
              Theme Distribution
            </h3>

          </div>


          {themeDistribution.length === 0 ? (

            <div
              style={{
                padding: '50px 10px',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}
            >
              No themes available
            </div>

          ) : (

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '13px'
              }}
            >

              {themeDistribution
                .slice(0, 8)
                .map((item, index) => (

                  <div
                    key={`${item.name}-${index}`}
                  >

                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        marginBottom: '6px'
                      }}
                    >

                      <span>
                        {item.name}
                      </span>

                      <strong>
                        {item.value}
                      </strong>

                    </div>

                    <div
                      style={{
                        height: '8px',
                        background:
                          'var(--bg-input)',
                        borderRadius: '10px'
                      }}
                    >

                      <div
                        style={{
                          width:
                            `${Math.max(
                              4,
                              (
                                item.value /
                                maxDistribution
                              ) * 100
                            )}%`,
                          height: '100%',
                          background:
                            'var(--accent-primary)',
                          borderRadius: '10px'
                        }}
                      />

                    </div>

                  </div>

                ))}

            </div>

          )}

        </div>

      </div>


      {/* ===================================================
          SENTIMENT + PRODUCT INSIGHTS
      =================================================== */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            '1fr 1fr',
          gap: '20px',
          marginTop: '20px'
        }}
      >

        {/* SENTIMENT */}

        <div
          className="glass-panel"
          style={{
            padding: '22px'
          }}
        >

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}
          >

            <MessageSquare size={20} />

            <h3>
              Sentiment Overview
            </h3>

          </div>


          {[
            {
              name: 'Positive',
              value: positive,
              percentage: positivePct,
              icon: <ThumbsUp size={17} />
            },
            {
              name: 'Neutral',
              value: neutral,
              percentage: neutralPct,
              icon: <Minus size={17} />
            },
            {
              name: 'Negative',
              value: negative,
              percentage: negativePct,
              icon: <ThumbsDown size={17} />
            }
          ].map(item => (

            <div
              key={item.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '18px'
              }}
            >

              {item.icon}

              <div
                style={{
                  flex: 1
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    marginBottom: '6px'
                  }}
                >

                  <span>
                    {item.name}
                  </span>

                  <strong>
                    {item.value} ({item.percentage}%)
                  </strong>

                </div>

                <div
                  style={{
                    height: '8px',
                    background:
                      'var(--bg-input)',
                    borderRadius: '10px'
                  }}
                >

                  <div
                    style={{
                      width:
                        `${item.percentage}%`,
                      height: '100%',
                      background:
                        'var(--accent-primary)',
                      borderRadius: '10px'
                    }}
                  />

                </div>

              </div>

            </div>

          ))}

        </div>


        {/* PRODUCT INSIGHTS */}

        <div
          className="glass-panel"
          style={{
            padding: '22px'
          }}
        >

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}
          >

            <Sparkles size={20} />

            <h3>
              Product Insights
            </h3>

          </div>


          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: '12px'
            }}
          >

            <div
              style={{
                padding: '16px',
                background:
                  'var(--bg-input)',
                borderRadius: '10px'
              }}
            >

              <div
                style={{
                  fontSize: '0.75rem',
                  color:
                    'var(--text-muted)'
                }}
              >
                Top Theme
              </div>

              <div
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  marginTop: '7px'
                }}
              >
                {themeDistribution[0]?.name ||
                  backendDashboard?.ProductInsights?.top_theme ||
                  'No theme data'}
              </div>

            </div>


            <div
              style={{
                padding: '16px',
                background:
                  'var(--bg-input)',
                borderRadius: '10px'
              }}
            >

              <div
                style={{
                  fontSize: '0.75rem',
                  color:
                    'var(--text-muted)'
                }}
              >
                Themes Detected
              </div>

              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginTop: '7px'
                }}
              >
                {themeDistribution.length}
              </div>

            </div>


            <div
              style={{
                padding: '16px',
                background:
                  'var(--bg-input)',
                borderRadius: '10px'
              }}
            >

              <div
                style={{
                  fontSize: '0.75rem',
                  color:
                    'var(--text-muted)'
                }}
              >
                Categories
              </div>

              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginTop: '7px'
                }}
              >
                {categoryDistribution.length}
              </div>

            </div>


            <div
              style={{
                padding: '16px',
                background:
                  'var(--bg-input)',
                borderRadius: '10px'
              }}
            >

              <div
                style={{
                  fontSize: '0.75rem',
                  color:
                    'var(--text-muted)'
                }}
              >
                Pain Points
              </div>

              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginTop: '7px'
                }}
              >
                {painPoints.length}
              </div>

            </div>

          </div>


          {featureRequests.length > 0 && (

            <div
              style={{
                marginTop: '14px',
                padding: '14px',
                border:
                  '1px solid var(--border-color)',
                borderRadius: '10px'
              }}
            >

              <strong>
                Feature Requests
              </strong>

              <div
                style={{
                  marginTop: '8px',
                  color:
                    'var(--text-muted)',
                  fontSize: '0.82rem'
                }}
              >

                {featureRequests
                  .slice(0, 5)
                  .map(item =>
                    `${item.name}: ${item.value}`
                  )
                  .join(' • ')}

              </div>

            </div>

          )}

        </div>

      </div>


      {/* ===================================================
          DATA SUMMARY
      =================================================== */}

      <div
        className="glass-panel"
        style={{
          marginTop: '20px',
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}
      >

        <BarChart3 size={18} />

        <span>
          Dataset analyzed successfully
        </span>

        <span>
          •
        </span>

        <span>
          {totalFeedback} feedback records
        </span>

        <span>
          •
        </span>

        <span>
          {themeDistribution.length} themes
        </span>

        <span>
          •
        </span>

        <span>
          {categoryDistribution.length} categories
        </span>

      </div>

    </div>

  );

};


export default DashboardView;