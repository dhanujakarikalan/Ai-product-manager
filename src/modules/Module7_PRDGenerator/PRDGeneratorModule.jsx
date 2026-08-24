import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Sparkles,
  Download,
  Edit3,
  Eye,
  Upload,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

export const PRDGeneratorModule = () => {

  const {
    data,
    setActiveModule
  } = useApp();

  const [selectedPrdId, setSelectedPrdId] = useState('');
  const [activeView, setActiveView] = useState('preview');
  const [generating, setGenerating] = useState(false);
  const [loadingPrd, setLoadingPrd] = useState(false);
  const [error, setError] = useState('');
  const [generatedPrd, setGeneratedPrd] = useState(null);
  const [markdown, setMarkdown] = useState('');

  // =========================================================
  // CHECK WHETHER REAL DATA EXISTS
  // =========================================================

  const hasUploadedData =
    Number(data?.totalFeedbackCount || 0) > 0 &&
    Boolean(data?.uploadedFileName);


  // =========================================================
  // LOAD EXISTING PRD FROM APP STATE
  // =========================================================

  useEffect(() => {

    if (
      Array.isArray(data?.prds) &&
      data.prds.length > 0
    ) {

      const firstPrd =
        data.prds[0];

      setSelectedPrdId(
        firstPrd.id || ''
      );

      setGeneratedPrd(
        firstPrd
      );

    } else {

      setSelectedPrdId('');
      setGeneratedPrd(null);

    }

  }, [data?.prds]);


  // =========================================================
  // CREATE MARKDOWN FROM REAL PRD
  // =========================================================

  const buildMarkdown = (prd) => {

    if (!prd) {
      return '';
    }

    // Backend may return PRD as a string.
    if (typeof prd === 'string') {
      return prd;
    }

    const sections = [];

    if (prd.title) {
      sections.push(`# ${prd.title}`);
    }

    if (prd.version) {
      sections.push(`**Version:** ${prd.version}`);
    }

    if (prd.author) {
      sections.push(`**Author:** ${prd.author}`);
    }

    if (prd.lastUpdated) {
      sections.push(
        `**Last Updated:** ${prd.lastUpdated}`
      );
    }

    if (prd.overview) {
      sections.push(
        `## Executive Overview\n${prd.overview}`
      );
    }

    if (prd.problemStatement) {
      sections.push(
        `## Problem Statement\n${prd.problemStatement}`
      );
    }

    if (prd.targetAudience) {
      sections.push(
        `## Target Audience\n${prd.targetAudience}`
      );
    }

    if (
      Array.isArray(prd.goals) &&
      prd.goals.length > 0
    ) {

      sections.push(
        `## Goals\n${prd.goals
          .map(goal => `- ${goal}`)
          .join('\n')}`
      );

    }

    if (
      Array.isArray(prd.requirements) &&
      prd.requirements.length > 0
    ) {

      sections.push(
        `## Requirements\n${prd.requirements
          .map(item => `- ${item}`)
          .join('\n')}`
      );

    }

    if (
      Array.isArray(prd.acceptanceCriteria) &&
      prd.acceptanceCriteria.length > 0
    ) {

      sections.push(
        `## Acceptance Criteria\n${prd.acceptanceCriteria
          .map(item => `- ${item}`)
          .join('\n')}`
      );

    }

    return sections.join('\n\n');
  };


  // =========================================================
  // GENERATE REAL PRD
  // =========================================================

  const handleGenerateAiPrd = async () => {

    setError('');

    // -------------------------------------------------------
    // NEVER generate without uploaded data
    // -------------------------------------------------------

    if (!hasUploadedData) {

      setError(
        'Please upload a CSV or Excel dataset before generating a PRD.'
      );

      return;
    }


    setGenerating(true);


    try {

      const response =
        await api.generatePrd();


      if (!response) {

        throw new Error(
          'The backend returned an empty response.'
        );

      }


      // -----------------------------------------------------
      // Backend response contains:
      //
      // response.prd
      // response.total_feedback
      // response.category_summary
      // response.sentiment_summary
      // response.theme_summary
      // response.pain_point_summary
      // response.feature_request_summary
      // response.recommendations
      // response.retrieved_feedback
      // -----------------------------------------------------

      const backendPrd =
        response.prd;


      if (
        !backendPrd ||
        (
          typeof backendPrd === 'string' &&
          !backendPrd.trim()
        )
      ) {

        throw new Error(
          'PRD generation completed, but the backend returned no PRD content.'
        );

      }


      const prdObject =
        typeof backendPrd === 'string'
          ? {
              id: `prd-${Date.now()}`,
              title: 'Generated Product Requirement Document',
              version: 'v1.0',
              author: 'AI Product Manager',
              lastUpdated: 'Just now',
              content: backendPrd,
              overview: backendPrd
            }
          : {
              ...backendPrd,
              id:
                backendPrd.id ||
                `prd-${Date.now()}`
            };


      setGeneratedPrd(
        prdObject
      );

      setSelectedPrdId(
        prdObject.id
      );


      const generatedMarkdown =
        typeof backendPrd === 'string'
          ? backendPrd
          : buildMarkdown(
              prdObject
            );


      setMarkdown(
        generatedMarkdown
      );

      setActiveView(
        'preview'
      );


    } catch (err) {

      console.error(
        'PRD generation failed:',
        err
      );


      setError(
        err?.message ||
        'Unable to generate PRD. Please try again.'
      );

    } finally {

      setGenerating(false);

    }

  };


  // =========================================================
  // LOAD PRD FROM BACKEND
  // =========================================================

  const handleLoadPrd = async () => {

    setError('');
    setLoadingPrd(true);


    try {

      const response =
        await api.getPrd();


      if (
        !response ||
        !response.prd
      ) {

        throw new Error(
          'No generated PRD was found.'
        );

      }


      const backendPrd =
        response.prd;


      const prdObject =
        typeof backendPrd === 'string'
          ? {
              id: `prd-${Date.now()}`,
              title:
                'Generated Product Requirement Document',
              version:
                'v1.0',
              author:
                'AI Product Manager',
              lastUpdated:
                'Just now',
              content:
                backendPrd,
              overview:
                backendPrd
            }
          : {
              ...backendPrd,
              id:
                backendPrd.id ||
                `prd-${Date.now()}`
            };


      setGeneratedPrd(
        prdObject
      );

      setSelectedPrdId(
        prdObject.id
      );

      setMarkdown(
        buildMarkdown(
          prdObject
        )
      );


    } catch (err) {

      setError(
        err?.message ||
        'Unable to load the PRD.'
      );

    } finally {

      setLoadingPrd(false);

    }

  };


  // =========================================================
  // DOWNLOAD REAL PRD
  // =========================================================

  const handleDownloadPrd = () => {

    if (!generatedPrd) {

      setError(
        'Generate a PRD before downloading it.'
      );

      return;
    }


    const content =
      markdown ||
      buildMarkdown(
        generatedPrd
      );


    if (!content.trim()) {

      setError(
        'There is no PRD content available to download.'
      );

      return;
    }


    const blob =
      new Blob(
        [content],
        {
          type:
            'text/markdown;charset=utf-8'
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const link =
      document.createElement(
        'a'
      );


    link.href =
      url;


    link.download =
      'generated-prd.md';


    document.body.appendChild(
      link
    );


    link.click();


    document.body.removeChild(
      link
    );


    URL.revokeObjectURL(
      url
    );

  };


  // =========================================================
  // PRD SELECTION
  // =========================================================

  const handlePrdSelection = (
    prdId
  ) => {

    setSelectedPrdId(
      prdId
    );


    const selected =
      data?.prds?.find(
        prd =>
          prd.id === prdId
      );


    if (selected) {

      setGeneratedPrd(
        selected
      );

      setMarkdown(
        buildMarkdown(
          selected
        )
      );

    }

  };


  // =========================================================
  // NO DATA SCREEN
  // =========================================================

  if (!hasUploadedData) {

    return (

      <div
        className="animate-fade-in"
        style={{
          paddingBottom: '40px'
        }}
      >

        <div
          className="module-header"
          style={{
            marginBottom: '20px'
          }}
        >

          <div>

            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700
              }}
            >
              PRD Generator
            </h1>

            <p
              style={{
                color:
                  'var(--text-muted)',
                fontSize:
                  '0.88rem',
                marginTop: '4px'
              }}
            >
              Generate Product Requirement Documents from your uploaded customer feedback.
            </p>

          </div>

        </div>


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
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background:
                'rgba(99, 102, 241, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}
          >

            <FileText
              size={30}
              color="var(--primary)"
            />

          </div>


          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '8px'
            }}
          >
            No dataset uploaded
          </h2>


          <p
            style={{
              color:
                'var(--text-muted)',
              maxWidth: '500px',
              lineHeight: 1.6,
              fontSize: '0.9rem',
              marginBottom: '24px'
            }}
          >
            Upload a CSV or Excel customer-feedback dataset first.
            The PRD will be generated from your real feedback,
            themes, pain points, and feature requests.
          </p>


          <button
            onClick={() =>
              setActiveModule(
                'upload'
              )
            }
            className="btn btn-primary"
            style={{
              gap: '8px'
            }}
          >

            <Upload size={16} />

            Upload Data

          </button>

        </div>

      </div>

    );

  }


  // =========================================================
  // MAIN PRD SCREEN
  // =========================================================

  return (

    <div
      className="animate-fade-in"
      style={{
        paddingBottom: '40px'
      }}
    >

      {/* HEADER */}

      <div
        className="module-header"
        style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >

        <div>

          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700
            }}
          >
            PRD Generator
          </h1>

          <p
            style={{
              color:
                'var(--text-muted)',
              fontSize:
                '0.88rem',
              marginTop: '4px'
            }}
          >
            Generate and edit Product Requirement Documents based on your uploaded customer feedback.
          </p>

        </div>


        <button
          onClick={
            handleGenerateAiPrd
          }
          disabled={generating}
          className="btn btn-primary"
          style={{
            gap: '8px'
          }}
        >

          {generating ? (
            <RefreshCw
              size={16}
              className="animate-spin"
            />
          ) : (
            <Sparkles size={16} />
          )}

          <span>
            {generating
              ? 'Generating PRD...'
              : 'Generate AI PRD'}
          </span>

        </button>

      </div>


      {/* DATASET INFORMATION */}

      <div
        className="glass-panel"
        style={{
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >

        <div>

          <div
            style={{
              fontSize: '0.75rem',
              color:
                'var(--text-muted)',
              textTransform:
                'uppercase',
              fontWeight: 700
            }}
          >
            Source Dataset
          </div>

          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              marginTop: '3px'
            }}
          >
            {data.uploadedFileName}
          </div>

        </div>


        <div>

          <div
            style={{
              fontSize: '0.75rem',
              color:
                'var(--text-muted)',
              textTransform:
                'uppercase',
              fontWeight: 700
            }}
          >
            Feedback Records
          </div>

          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              marginTop: '3px'
            }}
          >
            {data.totalFeedbackCount}
          </div>

        </div>


        <button
          onClick={
            handleLoadPrd
          }
          disabled={
            loadingPrd
          }
          className="btn btn-secondary btn-sm"
          style={{
            gap: '6px'
          }}
        >

          <RefreshCw
            size={14}
          />

          Load Existing PRD

        </button>

      </div>


      {/* ERROR */}

      {error && (

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '14px 16px',
            marginBottom: '20px',
            borderRadius: '10px',
            border:
              '1px solid rgba(244,63,94,0.35)',
            background:
              'rgba(244,63,94,0.08)',
            color:
              '#fb7185',
            fontSize: '0.86rem'
          }}
        >

          <AlertCircle
            size={18}
            style={{
              flexShrink: 0
            }}
          />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* DOCUMENT TOOLBAR */}

      <div
        className="glass-panel"
        style={{
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >

          <FileText
            size={18}
            color="var(--primary)"
          />

          <span
            style={{
              fontSize: '0.84rem',
              fontWeight: 600,
              color:
                'var(--text-dim)'
            }}
          >
            PRD Document:
          </span>


          <select
            value={
              selectedPrdId
            }
            onChange={e =>
              handlePrdSelection(
                e.target.value
              )
            }
            className="input-field"
            style={{
              width: '320px',
              fontWeight: 600,
              fontSize: '0.86rem',
              padding: '6px 12px'
            }}
          >

            {data?.prds?.length > 0 ? (

              data.prds.map(
                prd => (

                  <option
                    key={prd.id}
                    value={prd.id}
                  >
                    {prd.title ||
                      'Generated PRD'}
                  </option>

                )
              )

            ) : (

              <option value="">
                Current Generated PRD
              </option>

            )}

          </select>

        </div>


        <div
          style={{
            display: 'flex',
            gap: '8px'
          }}
        >

          <button
            onClick={
              handleDownloadPrd
            }
            className="btn btn-primary btn-sm"
            disabled={
              !generatedPrd
            }
            style={{
              gap: '6px'
            }}
          >

            <Download
              size={14}
            />

            Download PRD

          </button>


          <button
            onClick={() =>
              setActiveView(
                'preview'
              )
            }
            className="btn btn-sm"
            style={{
              background:
                activeView ===
                'preview'
                  ? 'var(--primary)'
                  : 'rgba(255,255,255,0.05)',
              color:
                activeView ===
                'preview'
                  ? '#fff'
                  : 'var(--text-muted)'
            }}
          >

            <Eye size={14} />

            Preview

          </button>


          <button
            onClick={() =>
              setActiveView(
                'editor'
              )
            }
            className="btn btn-sm"
            style={{
              background:
                activeView ===
                'editor'
                  ? 'var(--primary)'
                  : 'rgba(255,255,255,0.05)',
              color:
                activeView ===
                'editor'
                  ? '#fff'
                  : 'var(--text-muted)'
            }}
          >

            <Edit3
              size={14}
            />

            Edit Markdown

          </button>

        </div>

      </div>


      {/* NO GENERATED PRD YET */}

      {!generatedPrd && (

        <div
          className="glass-panel"
          style={{
            minHeight: '350px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px'
          }}
        >

          <div>

            <FileText
              size={40}
              color="var(--primary)"
              style={{
                marginBottom: '14px'
              }}
            />

            <h2
              style={{
                fontSize: '1.2rem',
                marginBottom: '8px'
              }}
            >
              Ready to generate your PRD
            </h2>

            <p
              style={{
                color:
                  'var(--text-muted)',
                fontSize:
                  '0.88rem',
                marginBottom: '20px'
              }}
            >
              Your uploaded dataset is ready.
              Click Generate AI PRD to create the document.
            </p>

            <button
              onClick={
                handleGenerateAiPrd
              }
              className="btn btn-primary"
              style={{
                gap: '8px'
              }}
            >

              <Sparkles
                size={16}
              />

              Generate AI PRD

            </button>

          </div>

        </div>

      )}


      {/* GENERATED PRD */}

      {generatedPrd &&
        activeView === 'preview' && (

        <div
          className="glass-panel"
          style={{
            padding: '32px'
          }}
        >

          {typeof generatedPrd ===
          'string' ? (

            <pre
              style={{
                whiteSpace:
                  'pre-wrap',
                wordBreak:
                  'break-word',
                fontFamily:
                  'inherit',
                fontSize:
                  '0.9rem',
                lineHeight: 1.7,
                color:
                  'var(--text-main)',
                margin: 0
              }}
            >
              {generatedPrd}
            </pre>

          ) : (

            <>

              <div
                style={{
                  borderBottom:
                    '1px solid var(--border-color)',
                  paddingBottom:
                    '20px',
                  marginBottom:
                    '24px'
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center',
                    marginBottom:
                      '10px',
                    flexWrap:
                      'wrap',
                    gap: '8px'
                  }}
                >

                  <span
                    className="badge badge-success"
                  >
                    {generatedPrd.version ||
                      'Generated'}
                  </span>

                  <span
                    style={{
                      fontSize:
                        '0.78rem',
                      color:
                        'var(--text-dim)'
                    }}
                  >
                    {generatedPrd.lastUpdated ||
                      ''}
                  </span>

                </div>


                <h2
                  style={{
                    fontSize:
                      '1.6rem',
                    color:
                      'var(--text-main)'
                  }}
                >
                  {generatedPrd.title ||
                    'Generated Product Requirement Document'}
                </h2>

              </div>


              {generatedPrd.content ? (

                <pre
                  style={{
                    whiteSpace:
                      'pre-wrap',
                    wordBreak:
                      'break-word',
                    fontFamily:
                      'inherit',
                    fontSize:
                      '0.9rem',
                    lineHeight:
                      1.7,
                    color:
                      'var(--text-main)',
                    margin: 0
                  }}
                >
                  {generatedPrd.content}
                </pre>

              ) : (

                <div
                  style={{
                    display:
                      'flex',
                    flexDirection:
                      'column',
                    gap: '24px'
                  }}
                >

                  {generatedPrd.overview && (

                    <section>

                      <h4
                        style={{
                          fontSize:
                            '0.84rem',
                          fontWeight:
                            700,
                          color:
                            'var(--primary)',
                          textTransform:
                            'uppercase',
                          marginBottom:
                            '8px'
                        }}
                      >
                        Executive Overview
                      </h4>

                      <p
                        style={{
                          fontSize:
                            '0.9rem',
                          lineHeight:
                            1.6,
                          color:
                            'var(--text-main)'
                        }}
                      >
                        {
                          generatedPrd.overview
                        }
                      </p>

                    </section>

                  )}


                  {generatedPrd.problemStatement && (

                    <section>

                      <h4
                        style={{
                          fontSize:
                            '0.84rem',
                          fontWeight:
                            700,
                          color:
                            '#fb7185',
                          textTransform:
                            'uppercase',
                          marginBottom:
                            '8px'
                        }}
                      >
                        Problem Statement
                      </h4>

                      <p
                        style={{
                          fontSize:
                            '0.9rem',
                          lineHeight:
                            1.6,
                          color:
                            'var(--text-main)'
                        }}
                      >
                        {
                          generatedPrd.problemStatement
                        }
                      </p>

                    </section>

                  )}


                  {generatedPrd.targetAudience && (

                    <section>

                      <h4
                        style={{
                          fontSize:
                            '0.84rem',
                          fontWeight:
                            700,
                          color:
                            '#38bdf8',
                          textTransform:
                            'uppercase',
                          marginBottom:
                            '8px'
                        }}
                      >
                        Target Audience
                      </h4>

                      <p
                        style={{
                          fontSize:
                            '0.9rem',
                          lineHeight:
                            1.6,
                          color:
                            'var(--text-muted)'
                        }}
                      >
                        {
                          generatedPrd.targetAudience
                        }
                      </p>

                    </section>

                  )}


                  {Array.isArray(
                    generatedPrd.goals
                  ) &&
                    generatedPrd.goals.length > 0 && (

                    <section>

                      <h4
                        style={{
                          fontSize:
                            '0.84rem',
                          fontWeight:
                            700,
                          color:
                            '#34d399',
                          textTransform:
                            'uppercase',
                          marginBottom:
                            '8px'
                        }}
                      >
                        Goals
                      </h4>

                      <ul
                        style={{
                          paddingLeft:
                            '20px',
                          display:
                            'flex',
                          flexDirection:
                            'column',
                          gap:
                            '8px',
                          fontSize:
                            '0.9rem',
                          color:
                            'var(--text-main)'
                        }}
                      >

                        {generatedPrd.goals.map(
                          (goal, index) => (

                            <li
                              key={index}
                            >
                              {goal}
                            </li>

                          )
                        )}

                      </ul>

                    </section>

                  )}

                </div>

              )}

            </>

          )}

        </div>

      )}


      {/* MARKDOWN EDITOR */}

      {generatedPrd &&
        activeView === 'editor' && (

        <div
          className="glass-panel"
          style={{
            padding: '24px'
          }}
        >

          <h3
            style={{
              fontSize:
                '1.1rem',
              marginBottom:
                '16px'
            }}
          >
            Live Markdown Specification Editor
          </h3>


          <textarea
            value={
              markdown
            }
            onChange={e =>
              setMarkdown(
                e.target.value
              )
            }
            style={{
              width:
                '100%',
              height:
                '500px',
              background:
                'var(--bg-input)',
              color:
                'var(--text-main)',
              border:
                '1px solid var(--border-color)',
              borderRadius:
                '12px',
              padding:
                '20px',
              fontFamily:
                'monospace',
              fontSize:
                '0.9rem',
              lineHeight:
                1.6,
              outline:
                'none',
              resize:
                'vertical'
            }}
          />


          <div
            style={{
              marginTop:
                '16px',
              display:
                'flex',
              justifyContent:
                'flex-end',
              gap:
                '12px'
            }}
          >

            <button
              onClick={() =>
                setActiveView(
                  'preview'
                )
              }
              className="btn btn-primary"
            >
              Save & View Formatted PRD
            </button>

          </div>

        </div>

      )}

    </div>

  );
};