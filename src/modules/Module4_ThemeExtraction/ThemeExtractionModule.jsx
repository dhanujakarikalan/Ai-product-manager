import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Layers, ArrowRight, CheckCircle2, AlertCircle, HelpCircle, TrendingUp, Filter, PlusCircle } from 'lucide-react';

export const ThemeExtractionModule = () => {
  const { data, promoteThemeToFeature, setActiveModule } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeDrawerTheme, setActiveDrawerTheme] = useState(null);

  const filteredThemes = data.themes.filter(t => 
    selectedCategory === 'ALL' || t.category.toLowerCase().includes(selectedCategory.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="module-header">
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Module 4: NLP Auto-Clustering</span>
          <h1 style={{ fontSize: '1.75rem' }}>Feedback Classification & Theme Extraction Engine</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Generative AI automatically groups raw support tickets, sales transcripts, and reviews into actionable root-cause themes.
          </p>
        </div>
      </div>

      <div className="module-body">
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['ALL', 'Core Infrastructure', 'Dashboard', 'Security', 'Workflow Automation'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn"
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border-color)'
              }}
            >
              {cat === 'ALL' ? 'All AI Clusters' : cat}
            </button>
          ))}
        </div>

        {/* Themes Grid */}
        <div className="grid-2" style={{ gap: '20px' }}>
          {filteredThemes.map(theme => {
            const isCritical = theme.severity === 'Critical';
            const isHigh = theme.severity === 'High';
            const isPromoted = theme.status.includes('Promoted');

            return (
              <div 
                key={theme.id} 
                className="glass-card" 
                style={{ 
                  padding: '22px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  borderTop: isCritical ? '3px solid #f43f5e' : isHigh ? '3px solid #f59e0b' : '3px solid #6366f1'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      {theme.category}
                    </span>
                    <span className={`badge ${isCritical ? 'badge-danger' : isHigh ? 'badge-warning' : 'badge-primary'}`}>
                      {theme.severity} Severity
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.18rem', marginBottom: '10px', color: 'var(--text-main)' }}>{theme.title}</h3>

                  <div className="glass-panel" style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', marginBottom: '16px', borderLeft: '2px solid var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: '#818cf8', fontSize: '0.76rem', fontWeight: 600 }}>
                      <Sparkles size={13} />
                      <span>AI Root Cause Synthesis</span>
                    </div>
                    <p style={{ fontSize: '0.83rem', lineHeight: 1.5, color: 'var(--text-muted)' }}>
                      "{theme.aiSummary}"
                    </p>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '16px', fontSize: '0.82rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Aggregated Tickets: </span>
                      <strong style={{ color: 'var(--text-main)' }}>{theme.ticketCount} items</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>ARR Opportunity: </span>
                      <strong style={{ color: isCritical ? '#fb7185' : '#34d399' }}>{theme.affectedArr}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button 
                      onClick={() => setActiveDrawerTheme(theme)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Inspect Raw Feedback ({theme.ticketCount})
                    </button>

                    {isPromoted ? (
                      <button 
                        onClick={() => setActiveModule('prioritization')}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                      >
                        <CheckCircle2 size={15} />
                        <span>In Feature Backlog</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => promoteThemeToFeature(theme.id)}
                        className="btn btn-primary btn-sm"
                        style={{ gap: '6px' }}
                      >
                        <PlusCircle size={15} />
                        <span>Promote to Feature Backlog</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inspect Raw Feedback Drawer/Modal */}
        {activeDrawerTheme && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}>
            <div className="glass-panel animate-fade-in" style={{ width: '650px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '6px' }}>AI Cluster Drill-Down</span>
                  <h3 style={{ fontSize: '1.25rem' }}>{activeDrawerTheme.title}</h3>
                </div>
                <button onClick={() => setActiveDrawerTheme(null)} className="btn btn-secondary btn-sm">Close</button>
              </div>

              <div style={{ padding: '14px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: '18px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#818cf8' }}>Summary of {activeDrawerTheme.ticketCount} linked items:</div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', marginTop: '4px' }}>{activeDrawerTheme.aiSummary}</p>
              </div>

              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '10px' }}>Representative Raw Tickets</h4>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.feedbackItems.filter(f => f.themeId === activeDrawerTheme.id || activeDrawerTheme.id === 'theme-1').slice(0, 4).map(f => (
                  <div key={f.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{f.source}</span>
                      <span>{f.date}</span>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>"{f.content}"</p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => {
                    promoteThemeToFeature(activeDrawerTheme.id);
                    setActiveDrawerTheme(null);
                  }} 
                  className="btn btn-primary"
                >
                  <PlusCircle size={16} />
                  <span>Promote this Cluster to Feature Backlog</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
