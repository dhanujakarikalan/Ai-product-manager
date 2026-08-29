import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Layers,
  FileText,
  Sliders,
  BookOpen,
  Bot,
  Inbox
} from 'lucide-react';

export const LandingPage = ({ onGetStarted, onLogin }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* 1. Header Navigation */}
      <header style={{
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>

        {/* Brand Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}
          onClick={onGetStarted}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
          }}>
            <Sparkles size={20} color="#ffffff" />
          </div>

          <span style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.03em'
          }}>
            AI Copilot
          </span>
        </div>


        {/* Navigation Links */}
        <nav style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          fontSize: '0.92rem',
          fontWeight: 500,
          color: '#475569'
        }}>
          <a
            href="#features"
            style={{
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            Features
          </a>

          <a
            href="#insights"
            style={{
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            Insights
          </a>

          <a
            href="#prd"
            style={{
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            PRD Generator
          </a>

          <a
            href="#stories"
            style={{
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            User Stories
          </a>
        </nav>


        {/* Auth Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>

          <button
            onClick={onLogin}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#334155',
              fontSize: '0.92rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '8px 16px'
            }}
          >
            Log in
          </button>

          <button
            onClick={onGetStarted}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '0.92rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            Get Started
          </button>

        </div>
      </header>


      {/* 2. Hero Section */}
      <section style={{
        padding: '80px 20px 60px',
        textAlign: 'center',
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>

        <h1 style={{
          fontSize: '3.6rem',
          fontWeight: 800,
          lineHeight: 1.15,
          color: '#0f172a',
          letterSpacing: '-0.04em',
          marginBottom: '20px'
        }}>
          Your AI Product Manager Copilot for{' '}

          <span style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Enterprise Teams
          </span>
        </h1>


        <p style={{
          fontSize: '1.2rem',
          color: '#64748b',
          lineHeight: 1.6,
          maxWidth: '720px',
          marginBottom: '36px'
        }}>
          Ingest customer feedback, extract root-cause themes,
          auto-generate PRDs, prioritize features with RICE framework,
          and create actionable user stories faster.
        </p>


        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>

          <button
            onClick={onGetStarted}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '14px 32px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Get Started for Free</span>
            <ArrowRight size={18} />
          </button>


          <button
            onClick={onGetStarted}
            style={{
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '9999px',
              padding: '14px 28px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            View Demo
          </button>

        </div>
      </section>


      {/* 3. Dashboard Preview */}
      <section style={{
        maxWidth: '1060px',
        margin: '0 auto 80px',
        padding: '0 20px',
        width: '100%'
      }}>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          padding: '24px'
        }}>

          {/* Browser Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            paddingBottom: '14px',
            borderBottom: '1px solid #f1f5f9'
          }}>

            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#ef4444'
            }} />

            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#eab308'
            }} />

            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#22c55e'
            }} />

            <div style={{
              marginLeft: '12px',
              backgroundColor: '#f1f5f9',
              padding: '4px 16px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              color: '#64748b',
              fontFamily: 'monospace'
            }}>
              app.ai-copilot.io/dashboard
            </div>

          </div>


          {/* =====================================================
              LIVE DATA PREVIEW
              No fake metrics
             ===================================================== */}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '20px'
          }}>


            {/* Feedback */}
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              borderLeft: '4px solid #2563eb'
            }}>

              <div style={{
                fontSize: '0.78rem',
                color: '#64748b',
                fontWeight: 600
              }}>
                CUSTOMER FEEDBACK
              </div>

              <div style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#0f172a',
                marginTop: '6px'
              }}>
                Ready for analysis
              </div>

              <div style={{
                fontSize: '0.78rem',
                color: '#64748b',
                marginTop: '5px'
              }}>
                Upload your CSV or Excel data
              </div>

            </div>


            {/* AI Insights */}
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              borderLeft: '4px solid #22c55e'
            }}>

              <div style={{
                fontSize: '0.78rem',
                color: '#64748b',
                fontWeight: 600
              }}>
                AI INSIGHTS
              </div>

              <div style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#0f172a',
                marginTop: '6px'
              }}>
                Generated from your data
              </div>

              <div style={{
                fontSize: '0.78rem',
                color: '#64748b',
                marginTop: '5px'
              }}>
                Themes and sentiment are AI-driven
              </div>

            </div>


            {/* Product Roadmap */}
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              borderLeft: '4px solid #7c3aed'
            }}>

              <div style={{
                fontSize: '0.78rem',
                color: '#64748b',
                fontWeight: 600
              }}>
                PRODUCT ROADMAP
              </div>

              <div style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#0f172a',
                marginTop: '6px'
              }}>
                Data-driven prioritization
              </div>

              <div style={{
                fontSize: '0.78rem',
                color: '#64748b',
                marginTop: '5px'
              }}>
                Features generated from customer insights
              </div>

            </div>

          </div>


          {/* =====================================================
              Active Specification Preview
              No fake PRD name
             ===================================================== */}

          <div style={{
            padding: '18px',
            borderRadius: '12px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>

            <div>

              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#2563eb',
                textTransform: 'uppercase'
              }}>
                Product Intelligence Workspace
              </div>

              <div style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#1e3a8a',
                marginTop: '2px'
              }}>
                Upload feedback to generate product insights
              </div>

            </div>


            <button
              onClick={onGetStarted}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Get Started
            </button>

          </div>

        </div>
      </section>


      {/* 4. Features Section */}
      <section
        id="features"
        style={{
          backgroundColor: '#ffffff',
          padding: '80px 20px',
          borderTop: '1px solid #e2e8f0'
        }}
      >

        <div style={{
          maxWidth: '1100px',
          margin: '0 auto'
        }}>

          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>

            <h2 style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.03em'
            }}>
              Built for Modern Product Teams
            </h2>

            <p style={{
              fontSize: '1.05rem',
              color: '#64748b',
              marginTop: '8px'
            }}>
              Everything you need to turn raw customer feedback
              into actionable roadmap execution.
            </p>

          </div>


          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '28px'
          }}>


            {/* Feedback */}
            <div style={{
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}>

              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Inbox size={22} color="#2563eb" />
              </div>

              <h3 style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '8px'
              }}>
                Feedback Workspace
              </h3>

              <p style={{
                fontSize: '0.9rem',
                color: '#64748b',
                lineHeight: 1.5
              }}>
                Upload CSV/Excel tickets, search, filter, and inspect
                raw feedback with automated clustering.
              </p>

            </div>


            {/* Theme Extraction */}
            <div style={{
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}>

              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#f3e8ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Layers size={22} color="#9333ea" />
              </div>

              <h3 style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '8px'
              }}>
                Theme Extraction
              </h3>

              <p style={{
                fontSize: '0.9rem',
                color: '#64748b',
                lineHeight: 1.5
              }}>
                Generative AI automatically groups support tickets
                into actionable root-cause themes and ARR impact.
              </p>

            </div>


            {/* Feature Prioritization */}
            <div style={{
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}>

              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Sliders size={22} color="#16a34a" />
              </div>

              <h3 style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '8px'
              }}>
                Feature Prioritization
              </h3>

              <p style={{
                fontSize: '0.9rem',
                color: '#64748b',
                lineHeight: 1.5
              }}>
                Configurable RICE and custom scoring frameworks
                to rank features with automated score explanations.
              </p>

            </div>


            {/* PRD Generator */}
            <div style={{
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}>

              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <FileText size={22} color="#dc2626" />
              </div>

              <h3 style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '8px'
              }}>
                PRD Generator Studio
              </h3>

              <p style={{
                fontSize: '0.9rem',
                color: '#64748b',
                lineHeight: 1.5
              }}>
                Generate structured product specifications backed
                by raw customer feedback evidence.
              </p>

            </div>


            {/* User Stories */}
            <div style={{
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}>

              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <BookOpen size={22} color="#d97706" />
              </div>

              <h3 style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '8px'
              }}>
                User Stories & Acceptance
              </h3>

              <p style={{
                fontSize: '0.9rem',
                color: '#64748b',
                lineHeight: 1.5
              }}>
                Create story cards with team work stream badges
                and acceptance checklists.
              </p>

            </div>


            {/* Product Assistant */}
            <div style={{
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}>

              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Bot size={22} color="#0284c7" />
              </div>

              <h3 style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '8px'
              }}>
                Product Assistant Chat
              </h3>

              <p style={{
                fontSize: '0.9rem',
                color: '#64748b',
                lineHeight: 1.5
              }}>
                Conversational RAG Q&A grounded in your customer
                support tickets and product backlog.
              </p>

            </div>

          </div>
        </div>
      </section>


      {/* 5. Footer */}
      <footer style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        padding: '40px 20px',
        textAlign: 'center',
        marginTop: 'auto',
        fontSize: '0.88rem'
      }}>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '10px'
        }}>

          <Sparkles size={18} color="#38bdf8" />

          <span style={{
            fontWeight: 700,
            color: '#ffffff'
          }}>
            AI Product Manager Copilot
          </span>

        </div>

        <p>
          © 2026 Enterprise AI Product Management Workspace.
          All rights reserved.
        </p>

      </footer>

    </div>
  );
};