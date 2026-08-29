import React, { useMemo } from 'react';

import { useApp } from '../../context/AppContext';

import {
  FileText,
  Sparkles,
  Target,
  Route,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Lightbulb,
  Flag,
  Award,
  RefreshCw
} from 'lucide-react';


// =========================================================
// HELPERS
// =========================================================

const isEmpty = (value) => {

  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return true;
  }

  if (
    Array.isArray(value) &&
    value.length === 0
  ) {
    return true;
  }

  if (
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  ) {
    return true;
  }

  return false;
};


// =========================================================
// FORMAT OBJECT / ARRAY
// =========================================================

const formatValue = (value) => {

  if (value === null || value === undefined) {
    return '';
  }


  if (typeof value === 'string') {
    return value;
  }


  if (
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }


  if (Array.isArray(value)) {

    return value
      .map(item => {

        if (
          typeof item === 'string' ||
          typeof item === 'number'
        ) {
          return String(item);
        }

        if (
          item &&
          typeof item === 'object'
        ) {

          return Object.entries(item)
            .map(
              ([key, val]) =>
                `${formatLabel(key)}: ${formatValue(val)}`
            )
            .join(' • ');

        }

        return '';

      })
      .filter(Boolean)
      .join('\n');

  }


  if (typeof value === 'object') {

    return Object.entries(value)
      .map(
        ([key, val]) =>
          `${formatLabel(key)}: ${formatValue(val)}`
      )
      .join('\n');

  }


  return String(value);

};


// =========================================================
// FORMAT LABEL
// =========================================================

const formatLabel = (value) => {

  return String(value)
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(
      /\w\S*/g,
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    );

};


// =========================================================
// GENERIC CONTENT RENDERER
// =========================================================

const ContentRenderer = ({
  value
}) => {

  if (isEmpty(value)) {

    return (
      <div
        style={{
          color:
            'var(--text-muted)',
          fontSize:
            '0.85rem'
        }}
      >
        No report data available yet.
      </div>
    );

  }


  // -------------------------------------------------------
  // STRING
  // -------------------------------------------------------

  if (typeof value === 'string') {

    return (
      <div
        style={{
          whiteSpace:
            'pre-wrap',
          lineHeight:
            1.7,
          fontSize:
            '0.9rem',
          color:
            'var(--text-main)'
        }}
      >
        {value}
      </div>
    );

  }


  // -------------------------------------------------------
  // ARRAY
  // -------------------------------------------------------

  if (Array.isArray(value)) {

    return (
      <div
        style={{
          display:
            'flex',
          flexDirection:
            'column',
          gap:
            '10px'
        }}
      >

        {value.map(
          (item, index) => (

            <div
              key={index}
              style={{
                padding:
                  '12px 14px',
                border:
                  '1px solid var(--border-color)',
                borderRadius:
                  '10px',
                background:
                  'var(--bg-input)'
              }}
            >

              {typeof item === 'object' ? (

                <div
                  style={{
                    display:
                      'flex',
                    flexDirection:
                      'column',
                    gap:
                      '7px'
                  }}
                >

                  {Object.entries(item).map(
                    ([key, val]) => (

                      <div
                        key={key}
                        style={{
                          display:
                            'grid',
                          gridTemplateColumns:
                            '180px 1fr',
                          gap:
                            '10px',
                          fontSize:
                            '0.84rem'
                        }}
                      >

                        <strong>
                          {formatLabel(key)}
                        </strong>

                        <span
                          style={{
                            color:
                              'var(--text-muted)',
                            whiteSpace:
                              'pre-wrap'
                          }}
                        >
                          {formatValue(val)}
                        </span>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <span
                  style={{
                    fontSize:
                      '0.85rem'
                  }}
                >
                  {String(item)}
                </span>

              )}

            </div>

          )
        )}

      </div>
    );

  }


  // -------------------------------------------------------
  // OBJECT
  // -------------------------------------------------------

  if (typeof value === 'object') {

    return (
      <div
        style={{
          display:
            'flex',
          flexDirection:
            'column',
          gap:
            '14px'
        }}
      >

        {Object.entries(value).map(
          ([key, val]) => (

            <div
              key={key}
              style={{
                padding:
                  '14px',
                border:
                  '1px solid var(--border-color)',
                borderRadius:
                  '10px',
                background:
                  'var(--bg-input)'
              }}
            >

              <div
                style={{
                  fontWeight:
                    700,
                  marginBottom:
                    '7px',
                  fontSize:
                    '0.84rem'
                }}
              >
                {formatLabel(key)}
              </div>

              <ContentRenderer
                value={val}
              />

            </div>

          )
        )}

      </div>
    );

  }


  return null;

};


// =========================================================
// REPORT CARD
// =========================================================

const ReportCard = ({
  icon,
  title,
  subtitle,
  children
}) => {

  return (

    <div
      className="glass-panel"
      style={{
        padding:
          '22px'
      }}
    >

      <div
        style={{
          display:
            'flex',
          alignItems:
            'center',
          gap:
            '11px',
          marginBottom:
            '18px'
        }}
      >

        <div
          style={{
            width:
              '38px',
            height:
              '38px',
            borderRadius:
              '10px',
            display:
              'flex',
            alignItems:
              'center',
            justifyContent:
              'center',
            background:
              'rgba(99,102,241,0.12)',
            border:
              '1px solid rgba(99,102,241,0.2)'
          }}
        >
          {icon}
        </div>

        <div>

          <h3
            style={{
              margin:
                0,
              fontSize:
                '1.05rem'
            }}
          >
            {title}
          </h3>

          {subtitle && (

            <p
              style={{
                margin:
                  '4px 0 0',
                color:
                  'var(--text-muted)',
                fontSize:
                  '0.78rem'
              }}
            >
              {subtitle}
            </p>

          )}

        </div>

      </div>

      {children}

    </div>

  );

};


// =========================================================
// REPORTS VIEW
// =========================================================

export const ReportsView = () => {

  const {
    data,
    hasUploadedData
  } = useApp();


  // =======================================================
  // BACKEND MILESTONE 4 DATA
  // =======================================================

  const executiveSummary =
    data?.backendExecutiveSummary ??
    data?.executive_summary ??
    data?.executiveSummary ??
    null;


  const productStrategy =
    data?.backendProductStrategy ??
    data?.product_strategy ??
    data?.productStrategy ??
    null;


  const evaluation =
    data?.backendEvaluation ??
    data?.evaluation ??
    data?.roadmapEvaluation ??
    null;


  const milestoneRecommendation =
    data?.backendMilestoneRecommendation ??
    data?.milestone_recommendation ??
    data?.milestoneRecommendation ??
    null;


  const roadmap =
    data?.backendRoadmap ??
    data?.roadmap ??
    data?.roadmapItems ??
    [];


  const prioritization =
    data?.backendPrioritization ??
    data?.prioritization ??
    [];


  const featureScores =
    data?.backendFeatureScores ??
    data?.featureScores ??
    [];


  // =======================================================
  // SUMMARY COUNTS
  // =======================================================

  const totalFeedback =
    Number(
      data?.totalFeedbackCount ||
      0
    );


  const positive =
    Number(
      data?.positiveCount ||
      0
    );


  const negative =
    Number(
      data?.negativeCount ||
      0
    );


  const neutral =
    Number(
      data?.neutralCount ||
      0
    );


  const features =
    Array.isArray(data?.features)
      ? data.features
      : [];


  const themes =
    Array.isArray(data?.themes)
      ? data.themes
      : [];


  // =======================================================
  // PRIORITIZED FEATURES
  // =======================================================

  const prioritizedFeatures =
    useMemo(() => {

      if (
        Array.isArray(prioritization) &&
        prioritization.length > 0
      ) {

        return prioritization;

      }


      return features
        .slice()
        .sort(
          (a, b) =>
            Number(
              b.riceScore ||
              b.score ||
              0
            ) -
            Number(
              a.riceScore ||
              a.score ||
              0
            )
        );

    }, [
      prioritization,
      features
    ]);


  // =======================================================
  // EMPTY STATE
  // =======================================================

  if (!hasUploadedData) {

    return (

      <div
        className="animate-fade-in"
        style={{
          paddingBottom:
            '40px'
        }}
      >

        <div
          className="module-header"
        >

          <div>

            <h1
              style={{
                fontSize:
                  '1.6rem',
                fontWeight:
                  700
              }}
            >
              Product Reports
            </h1>

            <p
              style={{
                color:
                  'var(--text-muted)',
                marginTop:
                  '5px'
              }}
            >
              Executive-level product intelligence
              generated from customer feedback.
            </p>

          </div>

        </div>


        <div
          className="glass-panel"
          style={{
            marginTop:
              '20px',
            padding:
              '60px 30px',
            textAlign:
              'center'
          }}
        >

          <FileText
            size={48}
            style={{
              marginBottom:
                '15px'
            }}
          />

          <h2>
            No Report Available
          </h2>

          <p
            style={{
              color:
                'var(--text-muted)',
              marginTop:
                '8px'
            }}
          >
            Upload and process customer
            feedback first.
          </p>

        </div>

      </div>

    );

  }


  // =======================================================
  // MAIN
  // =======================================================

  return (

    <div
      className="animate-fade-in"
      style={{
        paddingBottom:
          '50px'
      }}
    >

      {/* ===================================================
          HEADER
      =================================================== */}

      <div
        className="module-header"
        style={{
          display:
            'flex',
          justifyContent:
            'space-between',
          alignItems:
            'center'
        }}
      >

        <div>

          <h1
            style={{
              fontSize:
                '1.6rem',
              fontWeight:
                700
            }}
          >
            Product Reports
          </h1>

          <p
            style={{
              color:
                'var(--text-muted)',
              marginTop:
                '5px'
            }}
          >
            Executive summary, product strategy,
            prioritization and roadmap insights.
          </p>

        </div>


        <div
          style={{
            display:
              'flex',
            alignItems:
              'center',
            gap:
              '8px',
            padding:
              '8px 12px',
            borderRadius:
              '8px',
            background:
              'rgba(16,185,129,0.08)',
            border:
              '1px solid rgba(16,185,129,0.2)',
            color:
              '#10b981',
            fontSize:
              '0.78rem'
          }}
        >

          <CheckCircle2
            size={16}
          />

          AI Analysis Ready

        </div>

      </div>


      {/* ===================================================
          KPI SUMMARY
      =================================================== */}

      <div
        style={{
          display:
            'grid',
          gridTemplateColumns:
            'repeat(4, minmax(0, 1fr))',
          gap:
            '15px',
          marginTop:
            '20px'
        }}
      >

        <div
          className="glass-panel"
          style={{
            padding:
              '18px'
          }}
        >

          <span
            style={{
              color:
                'var(--text-muted)',
              fontSize:
                '0.78rem'
            }}
          >
            Feedback Analyzed
          </span>

          <div
            style={{
              fontSize:
                '1.8rem',
              fontWeight:
                700,
              marginTop:
                '7px'
            }}
          >
            {totalFeedback}
          </div>

        </div>


        <div
          className="glass-panel"
          style={{
            padding:
              '18px'
          }}
        >

          <span
            style={{
              color:
                'var(--text-muted)',
              fontSize:
                '0.78rem'
            }}
          >
            Themes
          </span>

          <div
            style={{
              fontSize:
                '1.8rem',
              fontWeight:
                700,
                marginTop:
                '7px'
            }}
          >
            {themes.length}
          </div>

        </div>


        <div
          className="glass-panel"
          style={{
            padding:
              '18px'
          }}
        >

          <span
            style={{
              color:
                'var(--text-muted)',
              fontSize:
                '0.78rem'
            }}
          >
            Prioritized Features
          </span>

          <div
            style={{
              fontSize:
                '1.8rem',
              fontWeight:
                700,
              marginTop:
                '7px'
            }}
          >
            {prioritizedFeatures.length}
          </div>

        </div>


        <div
          className="glass-panel"
          style={{
            padding:
              '18px'
          }}
        >

          <span
            style={{
              color:
                'var(--text-muted)',
              fontSize:
                '0.78rem'
            }}
          >
            Negative Feedback
          </span>

          <div
            style={{
              fontSize:
                '1.8rem',
              fontWeight:
                700,
              marginTop:
                '7px'
            }}
          >
            {negative}
          </div>

        </div>

      </div>


      {/* ===================================================
          EXECUTIVE SUMMARY
      =================================================== */}

      <div
        style={{
          marginTop:
            '20px'
        }}
      >

        <ReportCard
          icon={
            <Sparkles
              size={19}
            />
          }
          title="Executive Summary"
          subtitle="AI-generated leadership summary of the product situation"
        >

          <ContentRenderer
            value={
              executiveSummary
            }
          />

        </ReportCard>

      </div>


      {/* ===================================================
          PRODUCT STRATEGY + MILESTONE
      =================================================== */}

      <div
        style={{
          display:
            'grid',
          gridTemplateColumns:
            '1fr 1fr',
          gap:
            '20px',
          marginTop:
            '20px'
        }}
      >

        <ReportCard
          icon={
            <Target
              size={19}
            />
          }
          title="Product Strategy"
          subtitle="Recommended strategic direction"
        >

          <ContentRenderer
            value={
              productStrategy
            }
          />

        </ReportCard>


        <ReportCard
          icon={
            <Flag
              size={19}
            />
          }
          title="Milestone Recommendation"
          subtitle="Recommended delivery focus"
        >

          <ContentRenderer
            value={
              milestoneRecommendation
            }
          />

        </ReportCard>

      </div>


      {/* ===================================================
          ROADMAP
      =================================================== */}

      <div
        style={{
          marginTop:
            '20px'
        }}
      >

        <ReportCard
          icon={
            <Route
              size={19}
            />
          }
          title="Product Roadmap"
          subtitle="AI-generated roadmap based on prioritized customer needs"
        >

          {roadmap.length === 0 ? (

            <ContentRenderer
              value={roadmap}
            />

          ) : (

            <div
              style={{
                display:
                  'flex',
                flexDirection:
                  'column',
                gap:
                  '12px'
              }}
            >

              {roadmap.map(
                (item, index) => (

                  <div
                    key={index}
                    style={{
                      padding:
                        '16px',
                      border:
                        '1px solid var(--border-color)',
                      borderRadius:
                        '10px',
                      background:
                        'var(--bg-input)'
                    }}
                  >

                    <div
                      style={{
                        display:
                          'flex',
                        justifyContent:
                          'space-between',
                        alignItems:
                          'center',
                        marginBottom:
                          '8px'
                      }}
                    >

                      <strong>
                        {item?.feature ||
                         item?.title ||
                         item?.name ||
                         `Roadmap Item ${index + 1}`}
                      </strong>

                      <span
                        className="badge badge-primary"
                      >
                        {item?.priority ||
                         item?.phase ||
                         item?.status ||
                         'Planned'}
                      </span>

                    </div>


                    <ContentRenderer
                      value={item}
                    />

                  </div>

                )
              )}

            </div>

          )}

        </ReportCard>

      </div>


      {/* ===================================================
          PRIORITIZATION
      =================================================== */}

      <div
        style={{
          marginTop:
            '20px'
        }}
      >

        <ReportCard
          icon={
            <BarChart3
              size={19}
            />
          }
          title="Feature Prioritization"
          subtitle="Features ranked according to backend prioritization results"
        >

          {prioritizedFeatures.length === 0 ? (

            <ContentRenderer
              value={
                prioritizedFeatures
              }
            />

          ) : (

            <div
              style={{
                overflowX:
                  'auto'
              }}
            >

              <table
                style={{
                  width:
                    '100%',
                  borderCollapse:
                    'collapse',
                  fontSize:
                    '0.82rem'
                }}
              >

                <thead>

                  <tr>

                    <th
                      style={{
                        textAlign:
                          'left',
                        padding:
                          '10px',
                        borderBottom:
                          '1px solid var(--border-color)'
                      }}
                    >
                      Rank
                    </th>

                    <th
                      style={{
                        textAlign:
                          'left',
                        padding:
                          '10px',
                        borderBottom:
                          '1px solid var(--border-color)'
                      }}
                    >
                      Feature
                    </th>

                    <th
                      style={{
                        textAlign:
                          'left',
                        padding:
                          '10px',
                        borderBottom:
                          '1px solid var(--border-color)'
                      }}
                    >
                      Priority
                    </th>

                    <th
                      style={{
                        textAlign:
                          'left',
                        padding:
                          '10px',
                        borderBottom:
                          '1px solid var(--border-color)'
                      }}
                    >
                      Score
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {prioritizedFeatures
                    .slice(0, 15)
                    .map(
                      (item, index) => (

                        <tr
                          key={index}
                        >

                          <td
                            style={{
                              padding:
                                '11px 10px'
                            }}
                          >
                            {item?.rank ||
                             index + 1}
                          </td>

                          <td
                            style={{
                              padding:
                                '11px 10px',
                              fontWeight:
                                600
                            }}
                          >
                            {item?.feature ||
                             item?.title ||
                             item?.name ||
                             'Unnamed Feature'}
                          </td>

                          <td
                            style={{
                              padding:
                                '11px 10px'
                            }}
                          >
                            {item?.priority ||
                             item?.status ||
                             'Prioritized'}
                          </td>

                          <td
                            style={{
                              padding:
                                '11px 10px'
                            }}
                          >
                            {item?.score ??
                             item?.riceScore ??
                             item?.valueScore ??
                             '-'}
                          </td>

                        </tr>

                      )
                    )}

                </tbody>

              </table>

            </div>

          )}

        </ReportCard>

      </div>


      {/* ===================================================
          FEATURE SCORES
      =================================================== */}

      {featureScores.length > 0 && (

        <div
          style={{
            marginTop:
              '20px'
          }}
        >

          <ReportCard
            icon={
              <TrendingUp
                size={19}
              />
            }
            title="Feature Scoring Analysis"
            subtitle="Customer demand, business value and strategic alignment"
          >

            <ContentRenderer
              value={
                featureScores
              }
            />

          </ReportCard>

        </div>

      )}


      {/* ===================================================
          QUALITY EVALUATION
      =================================================== */}

      <div
        style={{
          marginTop:
            '20px'
        }}
      >

        <ReportCard
          icon={
            <ShieldCheck
              size={19}
            />
          }
          title="Quality Evaluation"
          subtitle="AI evaluation of roadmap and product strategy"
        >

          <ContentRenderer
            value={
              evaluation
            }
          />

        </ReportCard>

      </div>


      {/* ===================================================
          SENTIMENT INSIGHT
      =================================================== */}

      <div
        style={{
          marginTop:
            '20px',
          display:
            'grid',
          gridTemplateColumns:
            '1fr 1fr 1fr',
          gap:
            '15px'
        }}
      >

        <div
          className="glass-panel"
          style={{
            padding:
              '18px'
          }}
        >

          <div
            style={{
              display:
                'flex',
              alignItems:
                'center',
              gap:
                '8px'
            }}
          >

            <CheckCircle2
              size={18}
            />

            <strong>
              Positive
            </strong>

          </div>

          <div
            style={{
              fontSize:
                '1.6rem',
              fontWeight:
                700,
              marginTop:
                '8px'
            }}
          >
            {positive}
          </div>

        </div>


        <div
          className="glass-panel"
          style={{
            padding:
              '18px'
          }}
        >

          <div
            style={{
              display:
                'flex',
              alignItems:
                'center',
              gap:
                '8px'
            }}
          >

            <RefreshCw
              size={18}
            />

            <strong>
              Neutral
            </strong>

          </div>

          <div
            style={{
              fontSize:
                '1.6rem',
              fontWeight:
                700,
              marginTop:
                '8px'
            }}
          >
            {neutral}
          </div>

        </div>


        <div
          className="glass-panel"
          style={{
            padding:
              '18px'
          }}
        >

          <div
            style={{
              display:
                'flex',
              alignItems:
                'center',
              gap:
                '8px'
            }}
          >

            <AlertTriangle
              size={18}
            />

            <strong>
              Negative
            </strong>

          </div>

          <div
            style={{
              fontSize:
                '1.6rem',
              fontWeight:
                700,
              marginTop:
                '8px'
            }}
          >
            {negative}
          </div>

        </div>

      </div>


      {/* ===================================================
          REPORT FOOTER
      =================================================== */}

      <div
        className="glass-panel"
        style={{
          marginTop:
            '20px',
          padding:
            '18px 22px',
          display:
            'flex',
          alignItems:
            'center',
          gap:
            '10px',
          color:
            'var(--text-muted)',
          fontSize:
            '0.82rem'
        }}
      >

        <Lightbulb
          size={18}
        />

        <span>
          This report is generated from the
          processed customer feedback dataset,
          prioritization results and AI roadmap
          analysis.
        </span>

      </div>

    </div>

  );

};


export default ReportsView;