import React from 'react';

import {
  Sparkles,
  Target,
  Map,
  Lightbulb,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

import { useApp } from '../../context/AppContext';


// =========================================================
// HELPERS
// =========================================================

const isEmpty = (value) => {

  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (
      Array.isArray(value) &&
      value.length === 0
    )
  );

};


const formatValue = (
  value
) => {

  if (isEmpty(value)) {

    return 'No data available';

  }


  if (
    typeof value === 'string' ||
    typeof value === 'number'
  ) {

    return String(value);

  }


  return (
    <pre
      style={{
        margin: 0,
        whiteSpace: 'pre-wrap',
        fontFamily: 'inherit',
        lineHeight: 1.6
      }}
    >
      {JSON.stringify(
        value,
        null,
        2
      )}
    </pre>
  );

};


// =========================================================
// SECTION
// =========================================================

const ReportSection = ({
  icon,
  title,
  children
}) => {

  return (

    <div
      className="glass-panel"
      style={{
        padding: '24px',
        marginBottom: '20px'
      }}
    >

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '18px'
        }}
      >

        {icon}

        <h2
          style={{
            margin: 0,
            fontSize: '1.15rem',
            fontWeight: 700
          }}
        >
          {title}
        </h2>

      </div>

      {children}

    </div>

  );

};


// =========================================================
// MILESTONE 4
// =========================================================

const Milestone4Reports = () => {

  const {
    data,
    fetchBackendDashboard
  } = useApp();


  const executiveSummary =
    data?.backendExecutiveSummary;


  const productStrategy =
    data?.backendProductStrategy;


  const recommendation =
    data?.backendMilestoneRecommendation;


  const evaluation =
    data?.backendEvaluation;


  const featureScores =
    Array.isArray(
      data?.backendFeatureScores
    )
      ? data.backendFeatureScores
      : [];


  const prioritization =
    Array.isArray(
      data?.backendPrioritization
    )
      ? data.backendPrioritization
      : [];


  const roadmap =
    Array.isArray(
      data?.backendRoadmap
    )
      ? data.backendRoadmap
      : [];


  const hasData =
    !isEmpty(executiveSummary) ||
    !isEmpty(productStrategy) ||
    !isEmpty(recommendation) ||
    !isEmpty(evaluation) ||
    featureScores.length > 0 ||
    prioritization.length > 0 ||
    roadmap.length > 0;


  const refresh =
    async () => {

      try {

        await fetchBackendDashboard();

      } catch (error) {

        console.error(
          'Milestone 4 refresh failed:',
          error
        );

      }

    };


  return (

    <div
      className="animate-fade-in"
      style={{
        paddingBottom: '40px'
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="module-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >

        <div>

          <span className="badge badge-primary">
            Milestone 4
          </span>

          <h1
            style={{
              fontSize: '1.7rem',
              marginTop: '8px'
            }}
          >
            Executive Summary & Reports
          </h1>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              marginTop: '5px'
            }}
          >
            Backend-generated product intelligence,
            recommendations and roadmap.
          </p>

        </div>


        <button
          className="btn btn-secondary"
          onClick={refresh}
        >

          <RefreshCw size={16} />

          Refresh Analysis

        </button>

      </div>


      <div
        className="module-body"
        style={{
          marginTop: '20px'
        }}
      >

        {/* =================================================
            DATA STATUS
        ================================================= */}

        <div
          className="glass-card"
          style={{
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >

          {hasData ? (

            <>

              <CheckCircle2
                size={18}
                color="#10b981"
              />

              <span>
                Milestone 4 backend results connected
              </span>

            </>

          ) : (

            <>

              <AlertTriangle
                size={18}
                color="#f59e0b"
              />

              <span>
                Milestone 4 results are not available
                yet. Upload and process a dataset first.
              </span>

            </>

          )}

        </div>


        {/* =================================================
            EXECUTIVE SUMMARY
        ================================================= */}

        <ReportSection
          icon={
            <Sparkles
              size={21}
              color="var(--primary)"
            />
          }
          title="Executive Summary"
        >

          <div
            style={{
              lineHeight: 1.75,
              color: 'var(--text-main)',
              whiteSpace: 'pre-wrap'
            }}
          >

            {formatValue(
              executiveSummary
            )}

          </div>

        </ReportSection>


        {/* =================================================
            PRODUCT STRATEGY
        ================================================= */}

        <ReportSection
          icon={
            <Target
              size={21}
              color="var(--primary)"
            />
          }
          title="Product Strategy"
        >

          <div
            style={{
              lineHeight: 1.75,
              color: 'var(--text-main)',
              whiteSpace: 'pre-wrap'
            }}
          >

            {formatValue(
              productStrategy
            )}

          </div>

        </ReportSection>


        {/* =================================================
            RECOMMENDATIONS
        ================================================= */}

        <ReportSection
          icon={
            <Lightbulb
              size={21}
              color="var(--primary)"
            />
          }
          title="Milestone 4 Recommendations"
        >

          <div
            style={{
              lineHeight: 1.75,
              color: 'var(--text-main)',
              whiteSpace: 'pre-wrap'
            }}
          >

            {formatValue(
              recommendation
            )}

          </div>

        </ReportSection>


        {/* =================================================
            FEATURE SCORES
        ================================================= */}

        <ReportSection
          icon={
            <BarChart3
              size={21}
              color="var(--primary)"
            />
          }
          title="AI Feature Scores"
        >

          {featureScores.length === 0 ? (

            <p
              style={{
                color: 'var(--text-muted)'
              }}
            >
              No feature score results returned
              by Milestone 4.
            </p>

          ) : (

            <div
              style={{
                overflowX: 'auto'
              }}
            >

              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}
              >

                <thead>

                  <tr>

                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        borderBottom:
                          '1px solid var(--border-color)'
                      }}
                    >
                      Feature
                    </th>

                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        borderBottom:
                          '1px solid var(--border-color)'
                      }}
                    >
                      Score
                    </th>

                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        borderBottom:
                          '1px solid var(--border-color)'
                      }}
                    >
                      Priority
                    </th>

                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px',
                        borderBottom:
                          '1px solid var(--border-color)'
                      }}
                    >
                      Rank
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {featureScores.map(
                    (item, index) => (

                      <tr
                        key={index}
                      >

                        <td
                          style={{
                            padding: '12px',
                            borderBottom:
                              '1px solid var(--border-color)'
                          }}
                        >
                          {item.feature ||
                            item.title ||
                            item.name ||
                            `Feature ${index + 1}`}
                        </td>


                        <td
                          style={{
                            padding: '12px',
                            fontWeight: 700,
                            borderBottom:
                              '1px solid var(--border-color)'
                          }}
                        >
                          {item.score ??
                            item.riceScore ??
                            '-'}
                        </td>


                        <td
                          style={{
                            padding: '12px',
                            borderBottom:
                              '1px solid var(--border-color)'
                          }}
                        >
                          {item.priority ??
                            '-'}
                        </td>


                        <td
                          style={{
                            padding: '12px',
                            borderBottom:
                              '1px solid var(--border-color)'
                          }}
                        >
                          {item.rank ??
                            index + 1}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </ReportSection>


        {/* =================================================
            PRIORITIZATION
        ================================================= */}

        <ReportSection
          icon={
            <TrendingUp
              size={21}
              color="var(--primary)"
            />
          }
          title="Feature Prioritization"
        >

          {prioritization.length === 0 ? (

            <p
              style={{
                color: 'var(--text-muted)'
              }}
            >
              No feature prioritization results
              returned by Milestone 4.
            </p>

          ) : (

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >

              {prioritization.map(
                (item, index) => (

                  <div
                    key={index}
                    className="glass-card"
                    style={{
                      padding: '16px',
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      gap: '15px'
                    }}
                  >

                    <div>

                      <div
                        style={{
                          fontWeight: 700
                        }}
                      >

                        {item.feature ||
                          item.title ||
                          item.name ||
                          `Feature ${index + 1}`}

                      </div>


                      <div
                        style={{
                          marginTop: '6px',
                          color:
                            'var(--text-muted)',
                          fontSize: '0.82rem'
                        }}
                      >

                        Rank:{' '}
                        {item.rank ?? '-'}

                        {' • '}

                        Priority:{' '}
                        {item.priority ?? '-'}

                      </div>

                    </div>


                    <div
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 700
                      }}
                    >

                      {item.score ?? '-'}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </ReportSection>


        {/* =================================================
            ROADMAP
        ================================================= */}

        <ReportSection
          icon={
            <Map
              size={21}
              color="var(--primary)"
            />
          }
          title="Recommended Roadmap"
        >

          {roadmap.length === 0 ? (

            <p
              style={{
                color: 'var(--text-muted)'
              }}
            >
              No roadmap results returned by
              Milestone 4.
            </p>

          ) : (

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >

              {roadmap.map(
                (item, index) => (

                  <div
                    key={index}
                    className="glass-card"
                    style={{
                      padding: '17px'
                    }}
                  >

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        fontWeight: 700
                      }}
                    >

                      <CheckCircle2
                        size={17}
                      />

                      {item.feature ||
                        item.title ||
                        item.name ||
                        item.item ||
                        `Roadmap Item ${index + 1}`}

                    </div>


                    <div
                      style={{
                        marginTop: '9px',
                        color:
                          'var(--text-muted)',
                        fontSize: '0.84rem',
                        lineHeight: 1.6
                      }}
                    >

                      {item.milestone && (
                        <div>
                          Milestone:{' '}
                          {item.milestone}
                        </div>
                      )}

                      {item.quarter && (
                        <div>
                          Quarter:{' '}
                          {item.quarter}
                        </div>
                      )}

                      {item.priority && (
                        <div>
                          Priority:{' '}
                          {item.priority}
                        </div>
                      )}

                      {item.description && (
                        <div>
                          {item.description}
                        </div>
                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </ReportSection>


        {/* =================================================
            EVALUATION
        ================================================= */}

        <ReportSection
          icon={
            <AlertTriangle
              size={21}
              color="var(--primary)"
            />
          }
          title="Milestone 4 Evaluation"
        >

          <div
            style={{
              lineHeight: 1.75,
              color: 'var(--text-main)',
              whiteSpace: 'pre-wrap'
            }}
          >

            {formatValue(
              evaluation
            )}

          </div>

        </ReportSection>

      </div>

    </div>

  );

};


export default Milestone4Reports;