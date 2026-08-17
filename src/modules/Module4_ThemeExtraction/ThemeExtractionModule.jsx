import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Layers, ArrowRight, CheckCircle2, AlertCircle, HelpCircle, TrendingUp, Filter, PlusCircle } from 'lucide-react';

export const ThemeExtractionModule = () => {
  const { data, promoteThemeToFeature, setActiveModule, addTheme, deleteTheme } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeDrawerTheme, setActiveDrawerTheme] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Dashboard');
  const [newSummary, setNewSummary] = useState('');
  const [newSeverity, setNewSeverity] = useState('Medium');

  const handleCreateTheme = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTheme({
      id: `theme-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      severity: newSeverity,
      ticketCount: Math.floor(Math.random() * 80) + 20,
      affectedArr: '$120K',
      aiSummary: newSummary || 'User reported friction and requested enhancements in this module.',
      status: 'Active'
    });

    setNewTitle('');
    setNewSummary('');
    setShowAddModal(false);
  };

  const filteredThemes = data.themes.filter(t => 
    selectedCategory === 'ALL' || t.category.toLowerCase().includes(selectedCategory.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="module-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Theme Extraction</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            AI automatically groups customer feedback into actionable themes.
          </p>
        </div>
        <button 
          className="btn btn-primary btn-sm" 
          onClick={() => setShowAddModal(true)}
          style={{ gap: '6px' }}
        >
          <PlusCircle size={15} />
          <span>+ Add Custom Theme</span>
        </button>
      </div>

      <div className="module-body">
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['ALL', 'Core Infrastructure', 'Dashboard', 'Security', 'Workflow Automation'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn"
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border-color)'
              }}
            >
              {cat === 'ALL' ? 'All Clusters' : cat}
            </button>
          ))}
        </div>

        {/* Themes Grid */}
        <div className="grid-2" style={{ gap: '16px' }}>
          {filteredThemes.map(theme => {
            const isCritical = theme.severity === 'Critical';
            const isHigh = theme.severity === 'High';
            const isPromoted = theme.status.includes('Promoted');

            return (
              <div 
                key={theme.id} 
                className="glass-card" 
                style={{ 
                  padding: '20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {theme.category}
                    </span>
                    <span className={`badge ${isCritical ? 'badge-danger' : isHigh ? 'badge-warning' : 'badge-primary'}`}>
                      {theme.severity} Severity
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>{theme.title}</h3>

                  <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-muted)', marginBottom: '16px' }}>
                    "{theme.aiSummary}"
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid var(--border-color)', marginBottom: '14px', fontSize: '0.8rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Tickets: </span>
                      <strong style={{ color: 'var(--text-main)' }}>{theme.ticketCount}</strong>
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
        {showAddModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}>
            <div className="glass-panel animate-fade-in" style={{ width: '500px', padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Add Custom Theme</h3>
              <form onSubmit={handleCreateTheme} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Theme Title</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Dashboard Performance Lag" 
                    value={newTitle} 
                    onChange={e => setNewTitle(e.target.value)} 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Category</label>
                    <select className="input-field" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                      <option value="Dashboard">Dashboard</option>
                      <option value="Core Infrastructure">Core Infrastructure</option>
                      <option value="Security">Security</option>
                      <option value="Workflow Automation">Workflow Automation</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Severity</label>
                    <select className="input-field" value={newSeverity} onChange={e => setNewSeverity(e.target.value)}>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>AI Summary / Description</label>
                  <textarea 
                    className="input-field" 
                    rows={3} 
                    placeholder="Describe the root-cause feedback theme..." 
                    value={newSummary} 
                    onChange={e => setNewSummary(e.target.value)} 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Theme</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
