import React, { useMemo, useState } from 'react';

import { useApp } from '../../context/AppContext';

import {
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Filter,
  PlusCircle
} from 'lucide-react';


// =========================================================
// HELPERS
// =========================================================

const numberValue = (value) => {
  const n = Number(value);

  return Number.isFinite(n) ? n : 0;
};


// =========================================================
// NORMALIZE BACKEND THEMES
// Supports:
//
// {
//   "Performance": 80,
//   "Notifications": 20
// }
//
// [
//   { name: "Performance", value: 80 },
//   { name: "Notifications", value: 20 }
// ]
//
// {
//   distribution: {
//      Performance: 80
//   }
// }
// =========================================================

const normalizeBackendThemes = (source) => {

  if (!source) {
    return [];
  }


  // -------------------------------------------------------
  // ARRAY
  // -------------------------------------------------------

  if (Array.isArray(source)) {

    return source

      .map((item, index) => {

        if (!item || typeof item !== 'object') {
          return null;
        }

        const title =
          item.title ??
          item.name ??
          item.theme ??
          item.label ??
          item.Theme ??
          item.category;

        const count =
          item.ticketCount ??
          item.feedbackCount ??
          item.count ??
          item.value ??
          item.tickets ??
          item.Count;

        if (!title) {
          return null;
        }

        const ticketCount =
          numberValue(count);

        return {
          id:
            item.id ||
            `backend-theme-${index}-${String(title)
              .toLowerCase()
              .replace(/\s+/g, '-')}`,

          title:
            String(title),

          category:
            item.category ||
            item.Category ||
            'AI Cluster',

          severity:
            item.severity ||
            item.Severity ||
            (
              ticketCount >= 100
                ? 'Critical'
                : ticketCount >= 50
                  ? 'High'
                  : ticketCount >= 20
                    ? 'Medium'
                    : 'Low'
            ),

          ticketCount,

          affectedArr:
            item.affectedArr ||
            item.affected_arr ||
            '',

          aiSummary:
            item.aiSummary ||
            item.summary ||
            item.description ||
            item.ai_summary ||
            `Customer feedback cluster: ${title}.`,

          status:
            item.status ||
            'Active',

          raw:
            item

        };

      })

      .filter(Boolean)

      .filter(
        item =>
          item.title &&
          item.ticketCount >= 0
      );

  }


  // -------------------------------------------------------
  // OBJECT
  // -------------------------------------------------------

  if (typeof source !== 'object') {
    return [];
  }


  // -------------------------------------------------------
  // NESTED BACKEND OBJECTS
  // -------------------------------------------------------

  const nestedKeys = [
    'distribution',
    'theme_distribution',
    'themeDistribution',
    'themes',
    'data',
    'summary'
  ];


  for (const key of nestedKeys) {

    if (
      source[key] !== undefined &&
      source[key] !== null
    ) {

      const result =
        normalizeBackendThemes(
          source[key]
        );

      if (result.length > 0) {
        return result;
      }

    }

  }


  // -------------------------------------------------------
  // PLAIN OBJECT
  //
  // Example:
  //
  // {
  //   Performance: 80,
  //   Notifications: 20
  // }
  // -------------------------------------------------------

  return Object.entries(source)

    .map(([title, value], index) => {

      const ticketCount =
        numberValue(value);

      if (
        typeof value === 'object' ||
        ticketCount < 0
      ) {
        return null;
      }

      return {

        id:
          `backend-theme-${index}-${String(title)
            .toLowerCase()
            .replace(/\s+/g, '-')}`,

        title:
          String(title),

        category:
          'AI Cluster',

        severity:
          ticketCount >= 100
            ? 'Critical'
            : ticketCount >= 50
              ? 'High'
              : ticketCount >= 20
                ? 'Medium'
                : 'Low',

        ticketCount,

        affectedArr:
          '',

        aiSummary:
          `Customer feedback cluster: ${title}.`,

        status:
          'Active'

      };

    })

    .filter(Boolean)

    .sort(
      (a, b) =>
        b.ticketCount -
        a.ticketCount
    );

};


// =========================================================
// THEME EXTRACTION MODULE
// =========================================================

export const ThemeExtractionModule = () => {

  const {
    data,
    promoteThemeToFeature,
    setActiveModule,
    addTheme,
    deleteTheme
  } = useApp();


  const [selectedCategory, setSelectedCategory] =
    useState('ALL');

  const [activeDrawerTheme, setActiveDrawerTheme] =
    useState(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [newTitle, setNewTitle] =
    useState('');

  const [newCategory, setNewCategory] =
    useState('Dashboard');

  const [newSummary, setNewSummary] =
    useState('');

  const [newSeverity, setNewSeverity] =
    useState('Medium');


  // =======================================================
  // CREATE CUSTOM THEME
  // =======================================================

  const handleCreateTheme = (e) => {

    e.preventDefault();

    if (!newTitle.trim()) {
      return;
    }

    addTheme({

      id:
        `theme-${Date.now()}`,

      title:
        newTitle,

      category:
        newCategory,

      severity:
        newSeverity,

      ticketCount:
        0,

      affectedArr:
        '$120K',

      aiSummary:
        newSummary ||
        'User reported friction and requested enhancements in this module.',

      status:
        'Active'

    });

    setNewTitle('');

    setNewSummary('');

    setShowAddModal(false);

  };


  // =======================================================
  // CATEGORY MATCHING
  // =======================================================

  const matchesCategory = (
    themeCat,
    selectedCat
  ) => {

    if (selectedCat === 'ALL') {
      return true;
    }

    if (!themeCat) {
      return true;
    }

    const cat =
      String(themeCat).toLowerCase();

    const sel =
      String(selectedCat).toLowerCase();


    if (sel === 'core infrastructure') {

      return (
        cat.includes('infra') ||
        cat.includes('battery') ||
        cat.includes('performance') ||
        cat.includes('hardware') ||
        cat.includes('network') ||
        cat.includes('charging') ||
        cat.includes('camera') ||
        cat.includes('storage') ||
        cat.includes('power')
      );

    }


    if (sel === 'dashboard') {

      return (
        cat.includes('dash') ||
        cat.includes('ui') ||
        cat.includes('ux') ||
        cat.includes('custom') ||
        cat.includes('display') ||
        cat.includes('theme') ||
        cat.includes('layout')
      );

    }


    if (sel === 'security') {

      return (
        cat.includes('sec') ||
        cat.includes('auth') ||
        cat.includes('sso') ||
        cat.includes('login') ||
        cat.includes('fingerprint') ||
        cat.includes('password')
      );

    }


    if (sel === 'workflow automation') {

      return (
        cat.includes('work') ||
        cat.includes('auto') ||
        cat.includes('export') ||
        cat.includes('notif') ||
        cat.includes('sync') ||
        cat.includes('integration')
      );

    }


    return cat.includes(sel);

  };


  // =======================================================
  // BUILD COMPLETE THEME LIST
  // =======================================================

  const allThemes = useMemo(() => {

    const existingThemes =
      Array.isArray(data?.themes)
        ? data.themes
        : [];


    const backendThemes =
      normalizeBackendThemes(
        data?.backendThemeSummary
      );


    /*
     * Merge backend themes and frontend themes.
     *
     * Backend themes have priority because they
     * represent the actual AI clustering result.
     */

    const merged = new Map();


    backendThemes.forEach(theme => {

      const key =
        String(
          theme.title
        )
          .trim()
          .toLowerCase();

      merged.set(
        key,
        theme
      );

    });


    existingThemes.forEach(theme => {

      if (!theme) {
        return;
      }

      const key =
        String(
          theme.title ||
          theme.name ||
          ''
        )
          .trim()
          .toLowerCase();

      if (!key) {
        return;
      }


      /*
       * Preserve manually created/promoted themes
       * while enriching backend themes.
       */

      if (merged.has(key)) {

        const backendTheme =
          merged.get(key);

        merged.set(
          key,
          {
            ...backendTheme,
            ...theme,

            ticketCount:
              numberValue(
                theme.ticketCount
              ) ||
              numberValue(
                backendTheme.ticketCount
              ),

            aiSummary:
              theme.aiSummary ||
              backendTheme.aiSummary

          }
        );

      } else {

        merged.set(
          key,
          theme
        );

      }

    });


    return Array.from(
      merged.values()
    );

  }, [

    data?.themes,

    data?.backendThemeSummary

  ]);


  // =======================================================
  // FILTERED THEMES
  // =======================================================

  const filteredThemes =
    allThemes.filter(theme =>

      matchesCategory(
        theme.category ||
        theme.title,
        selectedCategory
      )

    );


  const categoriesList = [

    'ALL',

    'Core Infrastructure',

    'Dashboard',

    'Security',

    'Workflow Automation'

  ];


  // =======================================================
  // UI
  // =======================================================

  return (

    <div className="animate-fade-in">

      {/* HEADER */}

      <div
        className="module-header"
        style={{
          marginBottom:
            '24px',

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
                '1.5rem',
              fontWeight:
                700
            }}
          >
            Theme Extraction
          </h1>

          <p
            style={{
              color:
                'var(--text-muted)',
              fontSize:
                '0.88rem',
              marginTop:
                '4px'
            }}
          >
            AI automatically groups customer
            feedback into actionable themes.
          </p>

        </div>


        <button
          className="btn btn-primary btn-sm"
          onClick={() =>
            setShowAddModal(true)
          }
          style={{
            gap:
              '6px'
          }}
        >

          <PlusCircle size={15} />

          <span>
            + Add Custom Theme
          </span>

        </button>

      </div>


      <div className="module-body">


        {/* =================================================
            CATEGORY FILTERS
        ================================================= */}

        <div
          style={{
            display:
              'flex',

            gap:
              '8px',

            marginBottom:
              '20px',

            flexWrap:
              'wrap'
          }}
        >

          {categoriesList.map(
            category => (

              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
                className="btn"
                style={{
                  padding:
                    '6px 14px',

                  borderRadius:
                    '8px',

                  fontSize:
                    '0.8rem',

                  backgroundColor:
                    selectedCategory === category
                      ? 'var(--primary)'
                      : 'rgba(255, 255, 255, 0.04)',

                  color:
                    selectedCategory === category
                      ? '#fff'
                      : 'var(--text-muted)',

                  border:
                    '1px solid',

                  borderColor:
                    selectedCategory === category
                      ? 'var(--primary)'
                      : 'var(--border-color)'
                }}
              >

                {category === 'ALL'
                  ? `All Clusters (${allThemes.length})`
                  : category}

              </button>

            )
          )}

        </div>


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {filteredThemes.length === 0 ? (

          <div
            className="glass-panel"
            style={{
              padding:
                '50px 20px',

              textAlign:
                'center'
            }}
          >

            <Layers
              size={40}
              style={{
                marginBottom:
                  '12px'
              }}
            />

            <h3>
              No Clusters Available
            </h3>

            <p
              style={{
                color:
                  'var(--text-muted)',
                marginTop:
                  '8px'
              }}
            >
              No themes were found for this
              filter.
            </p>

          </div>

        ) : (


          /* =================================================
             THEMES GRID
          ================================================= */

          <div
            className="grid-2"
            style={{
              gap:
                '16px'
            }}
          >

            {filteredThemes.map(
              theme => {

                const isCritical =
                  theme.severity ===
                  'Critical';

                const isHigh =
                  theme.severity ===
                  'High';

                const isPromoted =
                  String(
                    theme.status || ''
                  ).includes(
                    'Promoted'
                  );


                return (

                  <div
                    key={
                      theme.id ||
                      theme.title
                    }
                    className="glass-card"
                    style={{
                      padding:
                        '20px',

                      display:
                        'flex',

                      flexDirection:
                        'column',

                      justifyContent:
                        'space-between'
                    }}
                  >

                    <div>

                      <div
                        style={{
                          display:
                            'flex',

                          justifyContent:
                            'space-between',

                          alignItems:
                            'center',

                          marginBottom:
                            '10px'
                        }}
                      >

                        <span
                          style={{
                            fontSize:
                              '0.74rem',

                            fontWeight:
                              600,

                            color:
                              'var(--text-dim)',

                            textTransform:
                              'uppercase',

                            letterSpacing:
                              '0.04em'
                          }}
                        >

                          {theme.category ||
                            'AI Cluster'}

                        </span>


                        <span
                          className={
                            `badge ${
                              isCritical
                                ? 'badge-danger'
                                : isHigh
                                  ? 'badge-warning'
                                  : 'badge-primary'
                            }`
                          }
                        >

                          {theme.severity ||
                            'Medium'}
                          {' '}
                          Severity

                        </span>

                      </div>


                      <h3
                        style={{
                          fontSize:
                            '1.1rem',

                          fontWeight:
                            600,

                          marginBottom:
                            '8px',

                          color:
                            'var(--text-main)'
                        }}
                      >
                        {theme.title}
                      </h3>


                      <p
                        style={{
                          fontSize:
                            '0.85rem',

                          lineHeight:
                            1.5,

                          color:
                            'var(--text-muted)',

                          marginBottom:
                            '16px'
                        }}
                      >
                        "{theme.aiSummary}"
                      </p>

                    </div>


                    <div>

                      <div
                        style={{
                          display:
                            'flex',

                          justifyContent:
                            'space-between',

                          alignItems:
                            'center',

                          padding:
                            '10px 0',

                          borderTop:
                            '1px solid var(--border-color)',

                          marginBottom:
                            '14px',

                          fontSize:
                            '0.8rem'
                        }}
                      >

                        <div>

                          <span
                            style={{
                              color:
                                'var(--text-dim)'
                            }}
                          >
                            Tickets:{' '}
                          </span>

                          <strong
                            style={{
                              color:
                                'var(--text-main)'
                            }}
                          >
                            {theme.ticketCount || 0}
                          </strong>

                        </div>

                      </div>


                      <div
                        style={{
                          display:
                            'flex',

                          justifyContent:
                            'space-between',

                          alignItems:
                            'center'
                        }}
                      >

                        <button
                          onClick={() =>
                            setActiveDrawerTheme(
                              theme
                            )
                          }
                          style={{
                            background:
                              'transparent',

                            border:
                              'none',

                            color:
                              'var(--text-dim)',

                            fontSize:
                              '0.8rem',

                            cursor:
                              'pointer',

                            textDecoration:
                              'underline'
                          }}
                        >
                          Inspect Raw Feedback
                          {' '}
                          ({theme.ticketCount || 0})
                        </button>


                        {isPromoted ? (

                          <button
                            onClick={() =>
                              setActiveModule(
                                'prioritization'
                              )
                            }
                            className="btn btn-secondary btn-sm"
                            style={{
                              color:
                                '#34d399',

                              borderColor:
                                'rgba(16, 185, 129, 0.4)'
                            }}
                          >

                            <CheckCircle2
                              size={15}
                            />

                            <span>
                              In Feature Backlog
                            </span>

                          </button>

                        ) : (

                          <button
                            onClick={() =>
                              promoteThemeToFeature(
                                theme.id
                              )
                            }
                            className="btn btn-primary btn-sm"
                            style={{
                              gap:
                                '6px'
                            }}
                          >

                            <PlusCircle
                              size={15}
                            />

                            <span>
                              Promote to Feature Backlog
                            </span>

                          </button>

                        )}

                      </div>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}


        {/* =================================================
            INSPECT RAW FEEDBACK
        ================================================= */}

        {activeDrawerTheme && (

          <div
            style={{
              position:
                'fixed',

              inset:
                0,

              backgroundColor:
                'rgba(0,0,0,0.6)',

              backdropFilter:
                'blur(6px)',

              display:
                'flex',

              alignItems:
                'center',

              justifyContent:
                'center',

              zIndex:
                100
            }}
          >

            <div
              className="glass-panel animate-fade-in"
              style={{
                width:
                  '650px',

                maxHeight:
                  '80vh',

                display:
                  'flex',

                flexDirection:
                  'column',

                padding:
                  '24px',

                boxShadow:
                  '0 20px 50px rgba(0,0,0,0.8)'
              }}
            >

              <div
                style={{
                  display:
                    'flex',

                  justifyContent:
                    'space-between',

                  alignItems:
                    'flex-start',

                  marginBottom:
                    '16px'
                }}
              >

                <div>

                  <span
                    className="badge badge-primary"
                    style={{
                      marginBottom:
                        '6px'
                    }}
                  >
                    AI Cluster Drill-Down
                  </span>

                  <h3
                    style={{
                      fontSize:
                        '1.25rem'
                    }}
                  >
                    {activeDrawerTheme.title}
                  </h3>

                </div>


                <button
                  onClick={() =>
                    setActiveDrawerTheme(
                      null
                    )
                  }
                  className="btn btn-secondary btn-sm"
                >
                  Close
                </button>

              </div>


              <div
                style={{
                  padding:
                    '14px',

                  background:
                    'rgba(99, 102, 241, 0.1)',

                  borderRadius:
                    '10px',

                  border:
                    '1px solid rgba(99, 102, 241, 0.3)',

                  marginBottom:
                    '18px'
                }}
              >

                <div
                  style={{
                    fontSize:
                      '0.8rem',

                    fontWeight:
                      600,

                    color:
                      '#818cf8'
                  }}
                >
                  Summary of {activeDrawerTheme.ticketCount || 0} linked items:
                </div>

                <p
                  style={{
                    fontSize:
                      '0.86rem',

                    color:
                      'var(--text-main)',

                    marginTop:
                      '4px'
                  }}
                >
                  {activeDrawerTheme.aiSummary}
                </p>

              </div>


              <h4
                style={{
                  fontSize:
                    '0.9rem',

                  color:
                    'var(--text-dim)',

                  textTransform:
                    'uppercase',

                  marginBottom:
                    '10px'
                }}
              >
                Representative Raw Tickets
              </h4>


              <div
                style={{
                  flex:
                    1,

                  overflowY:
                    'auto',

                  display:
                    'flex',

                  flexDirection:
                    'column',

                  gap:
                    '10px'
                }}
              >

                {(data?.feedbackItems || [])

                  .filter(
                    feedback =>
                      feedback.themeId ===
                      activeDrawerTheme.id
                  )

                  .slice(
                    0,
                    10
                  )

                  .map(
                    feedback => (

                      <div
                        key={
                          feedback.id
                        }
                        style={{
                          padding:
                            '12px',

                          background:
                            'rgba(255,255,255,0.03)',

                          borderRadius:
                            '8px',

                          border:
                            '1px solid var(--border-color)'
                        }}
                      >

                        <div
                          style={{
                            display:
                              'flex',

                            justifyContent:
                              'space-between',

                            fontSize:
                              '0.78rem',

                            color:
                              'var(--text-dim)',

                            marginBottom:
                              '6px'
                          }}
                        >

                          <span
                            style={{
                              fontWeight:
                                600,

                              color:
                                'var(--text-main)'
                            }}
                          >
                            {feedback.source}
                          </span>

                          <span>
                            {feedback.date}
                          </span>

                        </div>

                        <p
                          style={{
                            fontSize:
                              '0.84rem',

                            color:
                              'var(--text-muted)'
                          }}
                        >
                          "{feedback.content}"
                        </p>

                      </div>

                    )
                  )}

              </div>


              <div
                style={{
                  marginTop:
                    '20px',

                  paddingTop:
                    '16px',

                  borderTop:
                    '1px solid var(--border-color)',

                  display:
                    'flex',

                  justifyContent:
                    'flex-end'
                }}
              >

                <button
                  onClick={() => {

                    promoteThemeToFeature(
                      activeDrawerTheme.id
                    );

                    setActiveDrawerTheme(
                      null
                    );

                  }}
                  className="btn btn-primary"
                >

                  <PlusCircle
                    size={16}
                  />

                  <span>
                    Promote this Cluster to Feature Backlog
                  </span>

                </button>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            ADD CUSTOM THEME MODAL
        ================================================= */}

        {showAddModal && (

          <div
            style={{
              position:
                'fixed',

              inset:
                0,

              backgroundColor:
                'rgba(0,0,0,0.65)',

              backdropFilter:
                'blur(6px)',

              display:
                'flex',

              alignItems:
                'center',

              justifyContent:
                'center',

              zIndex:
                100
            }}
          >

            <div
              className="glass-panel animate-fade-in"
              style={{
                width:
                  '500px',

                padding:
                  '24px'
              }}
            >

              <h3
                style={{
                  fontSize:
                    '1.2rem',

                  marginBottom:
                    '16px'
                }}
              >
                Add Custom Theme
              </h3>


              <form
                onSubmit={
                  handleCreateTheme
                }
                style={{
                  display:
                    'flex',

                  flexDirection:
                    'column',

                  gap:
                    '14px'
                }}
              >

                <div>

                  <label
                    style={{
                      display:
                        'block',

                      fontSize:
                        '0.8rem',

                      color:
                        'var(--text-dim)',

                      marginBottom:
                        '4px'
                    }}
                  >
                    Theme Title
                  </label>

                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Dashboard Performance Lag"
                    value={
                      newTitle
                    }
                    onChange={
                      e =>
                        setNewTitle(
                          e.target.value
                        )
                    }
                    required
                  />

                </div>


                <div
                  style={{
                    display:
                      'grid',

                    gridTemplateColumns:
                      '1fr 1fr',

                    gap:
                      '12px'
                  }}
                >

                  <div>

                    <label
                      style={{
                        display:
                          'block',

                        fontSize:
                          '0.8rem',

                        color:
                          'var(--text-dim)',

                        marginBottom:
                          '4px'
                      }}
                    >
                      Category
                    </label>

                    <select
                      className="input-field"
                      value={
                        newCategory
                      }
                      onChange={
                        e =>
                          setNewCategory(
                            e.target.value
                          )
                      }
                    >

                      <option value="Dashboard">
                        Dashboard
                      </option>

                      <option value="Core Infrastructure">
                        Core Infrastructure
                      </option>

                      <option value="Security">
                        Security
                      </option>

                      <option value="Workflow Automation">
                        Workflow Automation
                      </option>

                    </select>

                  </div>


                  <div>

                    <label
                      style={{
                        display:
                          'block',

                        fontSize:
                          '0.8rem',

                        color:
                          'var(--text-dim)',

                        marginBottom:
                          '4px'
                      }}
                    >
                      Severity
                    </label>

                    <select
                      className="input-field"
                      value={
                        newSeverity
                      }
                      onChange={
                        e =>
                          setNewSeverity(
                            e.target.value
                          )
                      }
                    >

                      <option value="Critical">
                        Critical
                      </option>

                      <option value="High">
                        High
                      </option>

                      <option value="Medium">
                        Medium
                      </option>

                      <option value="Low">
                        Low
                      </option>

                    </select>

                  </div>

                </div>


                <div>

                  <label
                    style={{
                      display:
                        'block',

                      fontSize:
                        '0.8rem',

                      color:
                        'var(--text-dim)',

                      marginBottom:
                        '4px'
                    }}
                  >
                    AI Summary / Description
                  </label>

                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Describe the root-cause feedback theme..."
                    value={
                      newSummary
                    }
                    onChange={
                      e =>
                        setNewSummary(
                          e.target.value
                        )
                    }
                  />

                </div>


                <div
                  style={{
                    display:
                      'flex',

                    justifyContent:
                      'flex-end',

                    gap:
                      '10px',

                    marginTop:
                      '10px'
                  }}
                >

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      setShowAddModal(
                        false
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Create Theme
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};


export default ThemeExtractionModule;