import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, X, ChevronLeft, ChevronRight, Upload, Map } from 'lucide-react';

export const RoadmapView = () => {
  const {
    data,
    setActiveModule
  } = useApp();

  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // =========================================================
  // FORM STATE
  // =========================================================

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('UI/UX');
  const [newStatus, setNewStatus] = useState('Next');
  const [newDesc, setNewDesc] = useState('');

  // =========================================================
  // CHECK WHETHER REAL DATA EXISTS
  // =========================================================

  const hasUploadedData =
    Number(data?.totalFeedbackCount || 0) > 0;

  // =========================================================
  // BUILD ROADMAP FROM REAL FEATURES
  // =========================================================
  //
  // IMPORTANT:
  // No hardcoded/demo roadmap items.
  // Roadmap is created only from uploaded/backend features.
  //
  // =========================================================

  useEffect(() => {
    if (!hasUploadedData) {
      setItems([]);
      return;
    }

    const backendRoadmap =
      Array.isArray(data?.roadmapItems)
        ? data.roadmapItems
        : [];

    // -------------------------------------------------------
    // If backend already provides roadmap items,
    // use those first.
    // -------------------------------------------------------

    if (backendRoadmap.length > 0) {
      const mappedRoadmap = backendRoadmap.map((item, index) => ({
        id:
          item.id ||
          `rm-backend-${index}`,

        title:
          item.title ||
          'Untitled Feature',

        category:
          item.category ||
          'Product',

        status:
          item.status === 'In Dev'
            ? 'Now'
            : item.status === 'Discovery'
              ? 'Next'
              : item.status === 'Backlog'
                ? 'Later'
                : item.status || 'Later',

        progress:
          Number(item.progress) || 0,

        description:
          item.description ||
          `Roadmap item generated from uploaded customer feedback.`,

        featureId:
          item.featureId ||
          null
      }));

      setItems(mappedRoadmap);
      return;
    }

    // -------------------------------------------------------
    // Otherwise create roadmap cards from real features.
    // -------------------------------------------------------

    const features =
      Array.isArray(data?.features)
        ? data.features
        : [];

    const mappedFeatures =
      features.map((feature, index) => {

        let status = 'Later';

        if (
          feature.status === 'Prioritized' ||
          feature.status === 'In Development'
        ) {
          status = 'Now';
        } else if (
          feature.status === 'Backlog'
        ) {
          status = 'Next';
        }

        return {
          id:
            `rm-feature-${feature.id || index}`,

          featureId:
            feature.id,

          title:
            feature.title ||
            feature.name ||
            'Untitled Feature',

          category:
            feature.kanoCategory ||
            'Product',

          status,

          progress:
            feature.status === 'In Development'
              ? 50
              : feature.status === 'Prioritized'
                ? 25
                : 0,

          description:
            feature.description ||
            'Feature generated from uploaded customer feedback.'
        };
      });

    setItems(mappedFeatures);

  }, [
    hasUploadedData,
    data?.features,
    data?.roadmapItems
  ]);

  // =========================================================
  // PROGRESS CHANGE
  // =========================================================

  const handleProgressChange = (
    id,
    newProgressVal
  ) => {

    setItems(prev =>
      prev.map(item => {

        if (item.id !== id) {
          return item;
        }

        const progress =
          parseInt(
            newProgressVal,
            10
          ) || 0;

        return {
          ...item,

          progress,

          status:
            progress === 100
              ? 'Shipped'
              : item.status === 'Shipped'
                ? 'Now'
                : item.status
        };

      })
    );
  };

  // =========================================================
  // MOVE ROADMAP COLUMN
  // =========================================================

  const handleMoveColumn = (
    id,
    direction
  ) => {

    const columnsOrder = [
      'Now',
      'Next',
      'Later',
      'Shipped'
    ];

    setItems(prev =>
      prev.map(item => {

        if (item.id !== id) {
          return item;
        }

        const currentIndex =
          columnsOrder.indexOf(
            item.status
          );

        const safeIndex =
          currentIndex === -1
            ? 2
            : currentIndex;

        const nextIndex =
          direction === 'next'
            ? Math.min(
                columnsOrder.length - 1,
                safeIndex + 1
              )
            : Math.max(
                0,
                safeIndex - 1
              );

        const nextStatus =
          columnsOrder[nextIndex];

        return {
          ...item,

          status:
            nextStatus,

          progress:
            nextStatus === 'Shipped'
              ? 100
              : item.progress
        };

      })
    );
  };

  // =========================================================
  // ADD FEATURE
  // =========================================================

  const handleAddFeature = (
    event
  ) => {

    event.preventDefault();

    if (!hasUploadedData) {
      return;
    }

    if (!newTitle.trim()) {
      return;
    }

    const newItem = {

      id:
        `rm-custom-${Date.now()}`,

      title:
        newTitle.trim(),

      category:
        newCategory,

      status:
        newStatus,

      progress:
        0,

      description:
        newDesc.trim() ||
        'User-added roadmap feature.'
    };

    setItems(prev => [
      newItem,
      ...prev
    ]);

    setNewTitle('');
    setNewDesc('');
    setNewCategory('UI/UX');
    setNewStatus('Next');

    setShowAddModal(false);
  };

  // =========================================================
  // COLUMNS
  // =========================================================

  const columns = [

    {
      key: 'Now',
      label: 'Now',
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.12)',
      border: 'rgba(99, 102, 241, 0.3)'
    },

    {
      key: 'Next',
      label: 'Next',
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.12)',
      border: 'rgba(2, 132, 199, 0.3)'
    },

    {
      key: 'Later',
      label: 'Later',
      color: '#d97706',
      bg: 'rgba(217, 119, 6, 0.12)',
      border: 'rgba(217, 119, 6, 0.3)'
    },

    {
      key: 'Shipped',
      label: 'Shipped',
      color: '#059669',
      bg: 'rgba(5, 150, 105, 0.12)',
      border: 'rgba(5, 150, 105, 0.3)'
    }

  ];

  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (!hasUploadedData) {

    return (

      <div
        className="animate-fade-in"
        style={{
          paddingBottom: '30px'
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}
        >

          <div>

            <h1
              style={{
                fontSize: '1.4rem',
                fontWeight: 700
              }}
            >
              Product Roadmap
            </h1>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.84rem',
                marginTop: '4px'
              }}
            >
              Your roadmap will be created from analyzed customer feedback.
            </p>

          </div>

        </div>


        {/* EMPTY STATE */}

        <div
          className="glass-panel"
          style={{
            minHeight: '420px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px'
          }}
        >

          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '18px',
              background:
                'rgba(99, 102, 241, 0.12)',
              border:
                '1px solid rgba(99, 102, 241, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}
          >

            <Map
              size={34}
              color="#818cf8"
            />

          </div>


          <h2
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              marginBottom: '8px'
            }}
          >
            No roadmap data yet
          </h2>


          <p
            style={{
              maxWidth: '500px',
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              marginBottom: '22px'
            }}
          >
            Upload a customer feedback CSV or Excel file first.
            Once the backend analyzes the feedback and identifies
            themes and feature requests, your roadmap will appear here.
          </p>


          <button
            onClick={() =>
              setActiveModule('upload')
            }
            className="btn btn-primary"
            style={{
              gap: '8px'
            }}
          >

            <Upload size={16} />

            Upload Customer Data

          </button>

        </div>

      </div>

    );
  }

  // =========================================================
  // MAIN ROADMAP
  // =========================================================

  return (

    <div
      className="animate-fade-in"
      style={{
        paddingBottom: '30px'
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}
      >

        <div>

          <h1
            style={{
              fontSize: '1.4rem',
              fontWeight: 700
            }}
          >
            Product Roadmap
          </h1>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.84rem',
              marginTop: '4px'
            }}
          >
            Roadmap based on analyzed customer feedback and prioritized features.
          </p>

        </div>


        <button
          onClick={() =>
            setShowAddModal(true)
          }
          className="btn btn-primary"
          style={{
            gap: '6px',
            fontSize: '0.84rem'
          }}
        >

          <Plus size={16} />

          <span>
            New Feature
          </span>

        </button>

      </div>


      {/* DATA SUMMARY */}

      <div
        className="glass-panel"
        style={{
          padding: '12px 16px',
          marginBottom: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >

        <span
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          Dataset:
          <strong
            style={{
              color: 'var(--text-main)',
              marginLeft: '6px'
            }}
          >
            {data.uploadedFileName ||
              'Uploaded feedback'}
          </strong>
        </span>


        <span
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          Feedback records:
          <strong
            style={{
              color: 'var(--text-main)',
              marginLeft: '6px'
            }}
          >
            {data.totalFeedbackCount}
          </strong>
        </span>


        <span
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          Roadmap items:
          <strong
            style={{
              color: 'var(--text-main)',
              marginLeft: '6px'
            }}
          >
            {items.length}
          </strong>
        </span>

      </div>


      {/* NO FEATURES AFTER UPLOAD */}

      {items.length === 0 ? (

        <div
          className="glass-panel"
          style={{
            minHeight: '380px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px'
          }}
        >

          <Map
            size={40}
            color="#818cf8"
            style={{
              marginBottom: '16px'
            }}
          />


          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              marginBottom: '8px'
            }}
          >
            No features available for the roadmap
          </h2>


          <p
            style={{
              color: 'var(--text-muted)',
              maxWidth: '500px',
              fontSize: '0.86rem',
              lineHeight: 1.5,
              marginBottom: '18px'
            }}
          >
            Your dataset was uploaded successfully, but no feature
            requests have been generated yet. Generate or prioritize
            features before creating the roadmap.
          </p>


          <button
            onClick={() =>
              setActiveModule('prioritization')
            }
            className="btn btn-primary"
          >
            Go to Feature Prioritization
          </button>

        </div>

      ) : (

        /* ===================================================
           KANBAN
           =================================================== */

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            alignItems: 'start'
          }}
        >

          {columns.map(col => {

            const colItems =
              items.filter(
                item =>
                  item.status ===
                  col.key
              );

            return (

              <div
                key={col.key}
                className="glass-panel"
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor:
                    'var(--bg-card)',
                  border:
                    '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  minHeight: '450px'
                }}
              >

                {/* COLUMN HEADER */}

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center',
                    paddingBottom:
                      '10px',
                    borderBottom:
                      '1px solid var(--border-color)'
                  }}
                >

                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      backgroundColor:
                        col.bg,
                      color:
                        col.color,
                      border:
                        `1px solid ${col.border}`
                    }}
                  >
                    {col.label} ({colItems.length})
                  </span>

                </div>


                {/* CARDS */}

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >

                  {colItems.map(item => (

                    <div
                      key={item.id}
                      className="glass-card animate-fade-in"
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor:
                          'var(--bg-card-hover)',
                        border:
                          '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >

                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color:
                            'var(--primary)',
                          textTransform:
                            'uppercase'
                        }}
                      >
                        {item.category}
                      </span>


                      <h4
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color:
                            'var(--text-main)',
                          lineHeight: 1.3
                        }}
                      >
                        {item.title}
                      </h4>


                      <p
                        style={{
                          fontSize: '0.78rem',
                          color:
                            'var(--text-muted)',
                          lineHeight: 1.4
                        }}
                      >
                        {item.description}
                      </p>


                      {/* PROGRESS */}

                      <div>

                        <div
                          style={{
                            display: 'flex',
                            justifyContent:
                              'space-between',
                            fontSize: '0.72rem',
                            color:
                              'var(--text-muted)',
                            marginBottom: '3px'
                          }}
                        >

                          <span>
                            Progress
                          </span>

                          <strong>
                            {item.progress}%
                          </strong>

                        </div>


                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={
                            item.progress
                          }
                          onChange={
                            e =>
                              handleProgressChange(
                                item.id,
                                e.target.value
                              )
                          }
                          style={{
                            width: '100%',
                            height: '5px',
                            cursor: 'pointer'
                          }}
                        />

                      </div>


                      {/* FOOTER */}

                      <div
                        style={{
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          alignItems:
                            'center',
                          paddingTop: '8px',
                          borderTop:
                            '1px solid var(--border-color)'
                        }}
                      >

                        <div
                          style={{
                            display: 'flex',
                            gap: '4px'
                          }}
                        >

                          {col.key !== 'Now' && (

                            <button
                              onClick={() =>
                                handleMoveColumn(
                                  item.id,
                                  'prev'
                                )
                              }
                              style={{
                                padding:
                                  '2px 4px',
                                border:
                                  'none',
                                background:
                                  'transparent',
                                color:
                                  'var(--text-muted)',
                                cursor:
                                  'pointer'
                              }}
                            >

                              <ChevronLeft
                                size={14}
                              />

                            </button>

                          )}


                          {col.key !== 'Shipped' && (

                            <button
                              onClick={() =>
                                handleMoveColumn(
                                  item.id,
                                  'next'
                                )
                              }
                              style={{
                                padding:
                                  '2px 4px',
                                border:
                                  'none',
                                background:
                                  'transparent',
                                color:
                                  'var(--text-muted)',
                                cursor:
                                  'pointer'
                              }}
                            >

                              <ChevronRight
                                size={14}
                              />

                            </button>

                          )}

                        </div>


                        <button
                          onClick={() =>
                            setActiveModule(
                              'prd'
                            )
                          }
                          className="btn btn-primary btn-sm"
                          style={{
                            padding:
                              '3px 8px',
                            fontSize:
                              '0.7rem'
                          }}
                        >
                          PRD
                        </button>

                      </div>

                    </div>

                  ))}


                  {colItems.length === 0 && (

                    <div
                      style={{
                        padding:
                          '20px 10px',
                        textAlign:
                          'center',
                        color:
                          'var(--text-dim)',
                        fontSize:
                          '0.78rem',
                        border:
                          '1px dashed var(--border-color)',
                        borderRadius:
                          '8px'
                      }}
                    >
                      No items
                    </div>

                  )}

                </div>

              </div>

            );

          })}

        </div>

      )}


      {/* =====================================================
          ADD FEATURE MODAL
          ===================================================== */}

      {showAddModal && (

        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor:
              'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems:
              'center',
            justifyContent:
              'center',
            zIndex: 1000
          }}
        >

          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '20px',
              position: 'relative',
              backgroundColor:
                'var(--bg-card)',
              borderRadius: '12px'
            }}
          >

            <button
              onClick={() =>
                setShowAddModal(false)
              }
              style={{
                position:
                  'absolute',
                top: '12px',
                right: '12px',
                background:
                  'transparent',
                border: 'none',
                color:
                  'var(--text-dim)',
                cursor:
                  'pointer'
              }}
            >

              <X size={16} />

            </button>


            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: '12px'
              }}
            >
              Add Feature
            </h3>


            <form
              onSubmit={
                handleAddFeature
              }
              style={{
                display: 'flex',
                flexDirection:
                  'column',
                gap: '12px'
              }}
            >

              <div>

                <label
                  style={{
                    fontSize:
                      '0.78rem',
                    color:
                      'var(--text-muted)'
                  }}
                >
                  Title
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. SSO Login"
                  value={newTitle}
                  onChange={
                    e =>
                      setNewTitle(
                        e.target.value
                      )
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius:
                      '6px',
                    background:
                      'var(--bg-card-hover)',
                    border:
                      '1px solid var(--border-color)',
                    color:
                      'var(--text-main)'
                  }}
                />

              </div>


              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '1fr 1fr',
                  gap: '8px'
                }}
              >

                <div>

                  <label
                    style={{
                      fontSize:
                        '0.78rem',
                      color:
                        'var(--text-muted)'
                    }}
                  >
                    Category
                  </label>

                  <select
                    value={
                      newCategory
                    }
                    onChange={
                      e =>
                        setNewCategory(
                          e.target.value
                        )
                    }
                    style={{
                      width:
                        '100%',
                      padding:
                        '8px',
                      borderRadius:
                        '6px',
                      background:
                        'var(--bg-card-hover)',
                      border:
                        '1px solid var(--border-color)',
                      color:
                        'var(--text-main)'
                    }}
                  >

                    <option value="UI/UX">
                      UI/UX
                    </option>

                    <option value="Ingestion">
                      Ingestion
                    </option>

                    <option value="Analytics">
                      Analytics
                    </option>

                    <option value="Enterprise">
                      Enterprise
                    </option>

                    <option value="Performance">
                      Performance
                    </option>

                  </select>

                </div>


                <div>

                  <label
                    style={{
                      fontSize:
                        '0.78rem',
                      color:
                        'var(--text-muted)'
                    }}
                  >
                    Status
                  </label>

                  <select
                    value={
                      newStatus
                    }
                    onChange={
                      e =>
                        setNewStatus(
                          e.target.value
                        )
                    }
                    style={{
                      width:
                        '100%',
                      padding:
                        '8px',
                      borderRadius:
                        '6px',
                      background:
                        'var(--bg-card-hover)',
                      border:
                        '1px solid var(--border-color)',
                      color:
                        'var(--text-main)'
                    }}
                  >

                    <option value="Now">
                      Now
                    </option>

                    <option value="Next">
                      Next
                    </option>

                    <option value="Later">
                      Later
                    </option>

                  </select>

                </div>

              </div>


              <div>

                <label
                  style={{
                    fontSize:
                      '0.78rem',
                    color:
                      'var(--text-muted)'
                  }}
                >
                  Description
                </label>

                <textarea
                  placeholder="Short description..."
                  value={newDesc}
                  onChange={
                    e =>
                      setNewDesc(
                        e.target.value
                      )
                  }
                  style={{
                    width:
                      '100%',
                    padding:
                      '8px',
                    borderRadius:
                      '6px',
                    background:
                      'var(--bg-card-hover)',
                    border:
                      '1px solid var(--border-color)',
                    color:
                      'var(--text-main)',
                    height:
                      '60px'
                  }}
                />

              </div>


              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'flex-end',
                  gap: '8px',
                  marginTop:
                    '8px'
                }}
              >

                <button
                  type="button"
                  onClick={() =>
                    setShowAddModal(
                      false
                    )
                  }
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Add
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};