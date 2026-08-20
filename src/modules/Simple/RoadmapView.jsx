import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Map, 
  Columns, 
  Calendar, 
  Zap, 
  Plus, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  FileText,
  User,
  ArrowRight,
  Sliders,
  X
} from 'lucide-react';

const INITIAL_ROADMAP_ITEMS = [
  // Now (3)
  {
    id: 'rm-1',
    title: 'Feedback Ingestion Pipeline',
    category: 'Ingestion',
    quarter: 'Q2',
    status: 'Now',
    progress: 100,
    assignee: 'Gagan G.',
    description: 'Automated CSV/Excel file parser and sentiment classification pipeline.'
  },
  {
    id: 'rm-2',
    title: 'PDF Statement Export - PRD',
    category: 'UI/UX',
    quarter: 'Q2',
    status: 'Now',
    progress: 60,
    assignee: 'Syed Adnan',
    description: 'Export structured product requirement documents to formatted PDF.'
  },
  {
    id: 'rm-3',
    title: 'Dark Mode Support',
    category: 'UI/UX',
    quarter: 'Q3',
    status: 'Now',
    progress: 85,
    assignee: 'Syed Adnan',
    description: 'Full high-contrast dark theme mode across all dashboard cards.'
  },

  // Next (1)
  {
    id: 'rm-4',
    title: 'Spending Analytics',
    category: 'Analytics',
    quarter: 'Q3',
    status: 'Next',
    progress: 20,
    assignee: 'Harshita N.',
    description: 'Track customer lifetime value, ARR impact, and churn metrics.'
  },

  // Later (7)
  {
    id: 'rm-5',
    title: 'Bulk Export API',
    category: 'Enterprise',
    quarter: 'Q4',
    status: 'Later',
    progress: 15,
    assignee: 'Akhila S.',
    description: 'REST API endpoints for batch extracting processed feedback records.'
  },
  {
    id: 'rm-6',
    title: 'Improvement',
    category: 'UI/UX',
    quarter: 'Q3',
    status: 'Later',
    progress: 38,
    assignee: 'AI Product Copilot',
    description: 'Smart UI layout optimizations for mobile and tablet screens.'
  },
  {
    id: 'rm-7',
    title: 'Question',
    category: 'UI/UX',
    quarter: 'Q4',
    status: 'Later',
    progress: 38,
    assignee: 'AI Product Copilot',
    description: 'Interactive AI follow-up prompt engine inside chat interface.'
  },
  {
    id: 'rm-8',
    title: 'Multi-Currency Payment Engine',
    category: 'Billing',
    quarter: 'Q4',
    status: 'Later',
    progress: 10,
    assignee: 'Alex M.',
    description: 'Support multi-currency Stripe checkout settlements.'
  },
  {
    id: 'rm-9',
    title: 'Slack Fraud Alert Webhooks',
    category: 'Integrations',
    quarter: 'Q4',
    status: 'Later',
    progress: 5,
    assignee: 'Sarah K.',
    description: 'Real-time alert webhooks pushed into designated Slack channels.'
  },
  {
    id: 'rm-10',
    title: 'Automated Report Exporter',
    category: 'Core API',
    quarter: 'Q4',
    status: 'Later',
    progress: 0,
    assignee: 'Harshita N.',
    description: 'Background worker thread for generating heavy monthly reports.'
  },
  {
    id: 'rm-11',
    title: 'AI Anomaly Detection Engine',
    category: 'AI Intelligence',
    quarter: 'Q4',
    status: 'Later',
    progress: 0,
    assignee: 'Gagan G.',
    description: 'Automated detection of sudden spikes in negative customer feedback.'
  },

  // Shipped (2)
  {
    id: 'rm-12',
    title: 'Transaction Speed Fix',
    category: 'Performance',
    quarter: 'Q1',
    status: 'Shipped',
    progress: 100,
    assignee: 'Alex M.',
    description: 'Sub-second search query index optimization.'
  },
  {
    id: 'rm-13',
    title: 'Login Stability & OAuth',
    category: 'Auth',
    quarter: 'Q1',
    status: 'Shipped',
    progress: 100,
    assignee: 'Sarah K.',
    description: 'Okta SAML SSO and OAuth 2.0 social login integration.'
  }
];

export const RoadmapView = () => {
  const { data, setActiveModule } = useApp();
  const [viewMode, setViewMode] = useState('kanban'); // 'timeline', 'kanban', 'sprint'
  const [items, setItems] = useState(INITIAL_ROADMAP_ITEMS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [importedNotice, setImportedNotice] = useState(null);

  // Form state for new feature modal
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('UI/UX');
  const [newStatus, setNewStatus] = useState('Next');
  const [newQuarter, setNewQuarter] = useState('Q3');
  const [newAssignee, setNewAssignee] = useState('Gagan G.');
  const [newProgress, setNewProgress] = useState(10);
  const [newDesc, setNewDesc] = useState('');

  // Handle Progress change
  const handleProgressChange = (id, newProgressVal) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedProg = parseInt(newProgressVal, 10);
        let updatedStatus = item.status;
        if (updatedProg === 100 && item.status !== 'Shipped') {
          updatedStatus = 'Shipped';
        }
        return { ...item, progress: updatedProg, status: updatedStatus };
      }
      return item;
    }));
  };

  // Handle Move to next/prev column
  const handleMoveColumn = (id, direction) => {
    const columnsOrder = ['Now', 'Next', 'Later', 'Shipped'];
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const currentIdx = columnsOrder.indexOf(item.status);
        const nextIdx = direction === 'next' ? Math.min(columnsOrder.length - 1, currentIdx + 1) : Math.max(0, currentIdx - 1);
        const nextStatus = columnsOrder[nextIdx];
        let prog = item.progress;
        if (nextStatus === 'Shipped') prog = 100;
        return { ...item, status: nextStatus, progress: prog };
      }
      return item;
    }));
  };

  // Handle Add New Feature
  const handleAddFeature = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem = {
      id: `rm-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      quarter: newQuarter,
      status: newStatus,
      progress: parseInt(newProgress, 10) || 0,
      assignee: newAssignee || 'Product Manager',
      description: newDesc || 'User added feature for product roadmap.'
    };

    setItems(prev => [newItem, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  // Handle Import Pain Points from Extracted Themes
  const handleImportPainPoints = () => {
    const extractedThemes = data.themes || [];
    if (extractedThemes.length === 0) {
      setImportedNotice('No new pain points found in dataset.');
      setTimeout(() => setImportedNotice(null), 3000);
      return;
    }

    const newItemsFromThemes = extractedThemes.map((theme, idx) => ({
      id: `rm-theme-${Date.now()}-${idx}`,
      title: theme.name || theme.title || `Pain Point #${idx + 1}`,
      category: theme.category || 'Feedback',
      quarter: 'Q3',
      status: 'Next',
      progress: 15,
      assignee: 'AI Product Copilot',
      description: theme.aiSummary || `Imported customer feedback theme (${theme.ticketCount || 20} tickets).`
    }));

    setItems(prev => [...newItemsFromThemes, ...prev]);
    setImportedNotice(`Successfully imported ${newItemsFromThemes.length} customer pain points into Next column!`);
    setTimeout(() => setImportedNotice(null), 4000);
  };

  // Columns definition for Kanban
  const columns = [
    { key: 'Now', label: 'Now', color: '#818cf8', bg: 'rgba(99, 102, 241, 0.15)', badgeClass: 'badge-primary' },
    { key: 'Next', label: 'Next', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', badgeClass: 'badge-info' },
    { key: 'Later', label: 'Later', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.15)', badgeClass: 'badge-warning' },
    { key: 'Shipped', label: 'Shipped', color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)', badgeClass: 'badge-success' }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Header Bar matching screenshot */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Product Roadmap — Dynamic Workspace</h1>
            <span style={{ fontSize: '1.2rem' }}>🗺️</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#34d399', fontWeight: 600 }}>Dynamic Sync: Active Database Backend</span>
            <span style={{ color: 'var(--text-dim)' }}>•</span>
            <span>{items.length} total roadmap items</span>
          </p>
        </div>

        {/* View Toggle Bar & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* View Mode Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('timeline')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: viewMode === 'timeline' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'timeline' ? '#fff' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Calendar size={14} />
              <span>Timeline</span>
            </button>

            <button
              onClick={() => setViewMode('kanban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: viewMode === 'kanban' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'kanban' ? '#fff' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Columns size={14} />
              <span>Kanban Board</span>
            </button>

            <button
              onClick={() => setViewMode('sprint')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: viewMode === 'sprint' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'sprint' ? '#fff' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Zap size={14} />
              <span>Sprint View</span>
            </button>
          </div>

          {/* Action Buttons */}
          <button 
            onClick={handleImportPainPoints}
            className="btn btn-secondary" 
            style={{ gap: '6px', fontSize: '0.84rem' }}
          >
            <Download size={15} />
            <span>Import Pain Points</span>
          </button>

          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary" 
            style={{ gap: '6px', fontSize: '0.84rem' }}
          >
            <Plus size={16} />
            <span>+ Add Feature</span>
          </button>
        </div>
      </div>

      {/* Imported Toast Notification */}
      {importedNotice && (
        <div style={{ padding: '12px 18px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', borderRadius: '10px', marginBottom: '20px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} />
          <span>{importedNotice}</span>
        </div>
      )}

      {/* ----------------- VIEW 1: KANBAN BOARD VIEW ----------------- */}
      {viewMode === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '20px', alignItems: 'start' }}>
          {columns.map(col => {
            const colItems = items.filter(item => item.status === col.key);

            return (
              <div 
                key={col.key} 
                className="glass-panel" 
                style={{ 
                  padding: '16px', 
                  borderRadius: '14px', 
                  background: 'rgba(15, 21, 35, 0.6)', 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  minHeight: '480px'
                }}
              >
                {/* Column Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem', 
                      fontWeight: 700, 
                      backgroundColor: col.bg, 
                      color: col.color,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {col.label} ({colItems.length})
                    </span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                    {col.key === 'Now' ? 'In Active Sprint' : col.key === 'Next' ? 'Up Next' : col.key === 'Later' ? 'Backlog Queue' : 'Released Live'}
                  </span>
                </div>

                {/* Cards Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {colItems.map(item => (
                    <div 
                      key={item.id} 
                      className="glass-card animate-fade-in" 
                      style={{ 
                        padding: '16px', 
                        borderRadius: '12px',
                        background: 'rgba(20, 27, 45, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                        transition: 'transform 0.2s ease, border-color 0.2s ease'
                      }}
                    >
                      {/* Top Badges (Category & Quarter) */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 700, 
                          padding: '3px 8px', 
                          borderRadius: '6px', 
                          background: 'rgba(255, 255, 255, 0.08)', 
                          color: 'var(--text-dim)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}>
                          {item.category}
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                          {item.quarter}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
                        {item.title}
                      </h4>

                      {/* Progress Slider Bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          <span>Progress</span>
                          <strong style={{ color: item.progress === 100 ? '#34d399' : 'var(--text-main)' }}>{item.progress}%</strong>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="5"
                          value={item.progress} 
                          onChange={(e) => handleProgressChange(item.id, e.target.value)} 
                          style={{ 
                            width: '100%', 
                            height: '6px', 
                            borderRadius: '3px', 
                            accentColor: item.progress === 100 ? '#10b981' : 'var(--primary)',
                            cursor: 'pointer' 
                          }}
                        />
                      </div>

                      {/* Footer Row (Assignee & Generate PRD Button) */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ 
                            width: '22px', 
                            height: '22px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: '#fff'
                          }}>
                            {item.assignee ? item.assignee.charAt(0) : 'P'}
                          </div>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            {item.assignee}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {/* Column move arrows */}
                          {col.key !== 'Now' && (
                            <button 
                              onClick={() => handleMoveColumn(item.id, 'prev')}
                              title="Move back"
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.75rem' }}
                            >
                              ◀
                            </button>
                          )}
                          {col.key !== 'Shipped' && (
                            <button 
                              onClick={() => handleMoveColumn(item.id, 'next')}
                              title="Move next"
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.75rem' }}
                            >
                              ▶
                            </button>
                          )}

                          <button 
                            onClick={() => setActiveModule('prd')}
                            className="btn btn-primary btn-sm"
                            style={{ 
                              padding: '4px 10px', 
                              fontSize: '0.72rem', 
                              borderRadius: '6px',
                              gap: '4px',
                              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                            }}
                          >
                            <span>Generate PRD</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {colItems.length === 0 && (
                    <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem', border: '1px dashed var(--border-color)', borderRadius: '10px' }}>
                      No items in {col.label}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ----------------- VIEW 2: TIMELINE VIEW ----------------- */}
      {viewMode === 'timeline' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Roadmap Timeline Schedule (Q1 - Q4 2026)</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-dim)', textAlign: 'left' }}>
                  <th style={{ padding: '12px', width: '30%' }}>Feature Item</th>
                  <th style={{ padding: '12px', width: '15%' }}>Status</th>
                  <th style={{ padding: '12px', width: '15%' }}>Quarter</th>
                  <th style={{ padding: '12px', width: '25%' }}>Progress Trajectory</th>
                  <th style={{ padding: '12px', width: '15%', textAlign: 'right' }}>Assignee</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 600, color: 'var(--text-main)' }}>
                      <div>{item.title}</div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 400 }}>{item.category}</span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className={`badge ${item.status === 'Now' ? 'badge-primary' : item.status === 'Next' ? 'badge-info' : item.status === 'Shipped' ? 'badge-success' : 'badge-warning'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', color: 'var(--text-muted)' }}>{item.quarter}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${item.progress}%`, height: '100%', background: item.progress === 100 ? '#10b981' : 'var(--primary)' }} />
                        </div>
                        <span style={{ fontSize: '0.76rem', fontWeight: 600 }}>{item.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right', color: 'var(--text-muted)' }}>{item.assignee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- VIEW 3: SPRINT VIEW ----------------- */}
      {viewMode === 'sprint' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            { name: 'Sprint 1 (Active)', items: items.filter(i => i.status === 'Now') },
            { name: 'Sprint 2 (Upcoming)', items: items.filter(i => i.status === 'Next') },
            { name: 'Sprint 3 (Planning)', items: items.filter(i => i.status === 'Later').slice(0, 3) },
            { name: 'Backlog Queue', items: items.filter(i => i.status === 'Later').slice(3) }
          ].map((sprint, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '18px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                ⚡ {sprint.name} ({sprint.items.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sprint.items.map(item => (
                  <div key={item.id} className="glass-card" style={{ padding: '12px' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>{item.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                      <span>{item.category}</span>
                      <span>{item.progress}% Done</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ----------------- ADD FEATURE MODAL ----------------- */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '24px', position: 'relative' }}>
            <button 
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>+ Add Roadmap Feature</h3>

            <form onSubmit={handleAddFeature} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Feature Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Automated Stripe Tax Settlement" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)} 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category Tag</label>
                  <select 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0f1523', border: '1px solid var(--border-color)', color: '#fff' }}
                  >
                    <option value="UI/UX">UI/UX</option>
                    <option value="Ingestion">Ingestion</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Performance">Performance</option>
                    <option value="Auth">Auth</option>
                    <option value="Billing">Billing</option>
                    <option value="Integrations">Integrations</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Kanban Column</label>
                  <select 
                    value={newStatus} 
                    onChange={e => setNewStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0f1523', border: '1px solid var(--border-color)', color: '#fff' }}
                  >
                    <option value="Now">Now</option>
                    <option value="Next">Next</option>
                    <option value="Later">Later</option>
                    <option value="Shipped">Shipped</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Target Quarter</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Q3" 
                    value={newQuarter} 
                    onChange={e => setNewQuarter(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Assignee</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Gagan G." 
                    value={newAssignee} 
                    onChange={e => setNewAssignee(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Initial Progress % ({newProgress}%)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  value={newProgress} 
                  onChange={e => setNewProgress(e.target.value)} 
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">+ Add to Roadmap</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
