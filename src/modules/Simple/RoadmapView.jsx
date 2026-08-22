import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';

const INITIAL_ROADMAP_ITEMS = [
  {
    id: 'rm-1',
    title: 'Feedback Ingestion Pipeline',
    category: 'Ingestion',
    status: 'Now',
    progress: 100,
    description: 'Automated CSV/Excel file parser and sentiment classification pipeline.'
  },
  {
    id: 'rm-2',
    title: 'PDF Statement Export - PRD',
    category: 'UI/UX',
    status: 'Now',
    progress: 60,
    description: 'Export structured product requirement documents to formatted PDF.'
  },
  {
    id: 'rm-3',
    title: 'Dark Mode Support',
    category: 'UI/UX',
    status: 'Now',
    progress: 85,
    description: 'Full high-contrast dark theme mode across all dashboard cards.'
  },
  {
    id: 'rm-4',
    title: 'Spending Analytics',
    category: 'Analytics',
    status: 'Next',
    progress: 20,
    description: 'Track customer lifetime value, ARR impact, and churn metrics.'
  },
  {
    id: 'rm-5',
    title: 'Bulk Export API',
    category: 'Enterprise',
    status: 'Later',
    progress: 15,
    description: 'REST API endpoints for batch extracting processed feedback records.'
  },
  {
    id: 'rm-6',
    title: 'Slack Fraud Alert Webhooks',
    category: 'Integrations',
    status: 'Later',
    progress: 5,
    description: 'Real-time alert webhooks pushed into designated Slack channels.'
  }
];

export const RoadmapView = () => {
  const { setActiveModule } = useApp();
  const [items, setItems] = useState(INITIAL_ROADMAP_ITEMS);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('UI/UX');
  const [newStatus, setNewStatus] = useState('Next');
  const [newDesc, setNewDesc] = useState('');

  const handleProgressChange = (id, newProgressVal) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const prog = parseInt(newProgressVal, 10);
        return { ...item, progress: prog, status: prog === 100 ? 'Shipped' : item.status };
      }
      return item;
    }));
  };

  const handleMoveColumn = (id, direction) => {
    const columnsOrder = ['Now', 'Next', 'Later', 'Shipped'];
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const currentIdx = columnsOrder.indexOf(item.status);
        const nextIdx = direction === 'next' ? Math.min(columnsOrder.length - 1, currentIdx + 1) : Math.max(0, currentIdx - 1);
        const nextStatus = columnsOrder[nextIdx];
        return { ...item, status: nextStatus, progress: nextStatus === 'Shipped' ? 100 : item.progress };
      }
      return item;
    }));
  };

  const handleAddFeature = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem = {
      id: `rm-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      status: newStatus,
      progress: 10,
      description: newDesc || 'User added feature for product roadmap.'
    };

    setItems(prev => [newItem, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const columns = [
    { key: 'Now', label: 'Now', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.3)' },
    { key: 'Next', label: 'Next', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)', border: 'rgba(2, 132, 199, 0.3)' },
    { key: 'Later', label: 'Later', color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', border: 'rgba(217, 119, 6, 0.3)' },
    { key: 'Shipped', label: 'Shipped', color: '#059669', bg: 'rgba(5, 150, 105, 0.12)', border: 'rgba(5, 150, 105, 0.3)' }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '30px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Product Roadmap</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginTop: '4px' }}>
            A simple, high-level overview of our feature release phases.
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary" 
          style={{ gap: '6px', fontSize: '0.84rem' }}
        >
          <Plus size={16} />
          <span>New Feature</span>
        </button>
      </div>

      {/* Kanban Columns Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', alignItems: 'start' }}>
        {columns.map(col => {
          const colItems = items.filter(item => item.status === col.key);

          return (
            <div 
              key={col.key} 
              className="glass-panel" 
              style={{ 
                padding: '16px', 
                borderRadius: '12px', 
                backgroundColor: 'var(--bg-card)', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                minHeight: '450px'
              }}
            >
              {/* Column Label */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ 
                  padding: '3px 10px', 
                  borderRadius: '12px', 
                  fontSize: '0.78rem', 
                  fontWeight: 700, 
                  backgroundColor: col.bg, 
                  color: col.color,
                  border: `1px solid ${col.border}`
                }}>
                  {col.label} ({colItems.length})
                </span>
              </div>

              {/* Cards list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {colItems.map(item => (
                  <div 
                    key={item.id} 
                    className="glass-card animate-fade-in" 
                    style={{ 
                      padding: '12px', 
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-card-hover)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                        {item.category}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
                      {item.title}
                    </h4>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {item.description}
                    </p>

                    {/* Progress */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                        <span>Progress</span>
                        <strong>{item.progress}%</strong>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={item.progress} 
                        onChange={(e) => handleProgressChange(item.id, e.target.value)} 
                        style={{ width: '100%', height: '5px', cursor: 'pointer' }}
                      />
                    </div>

                    {/* Footer Nav Controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {col.key !== 'Now' && (
                          <button onClick={() => handleMoveColumn(item.id, 'prev')} style={{ padding: '2px 4px', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <ChevronLeft size={14} />
                          </button>
                        )}
                        {col.key !== 'Shipped' && (
                          <button onClick={() => handleMoveColumn(item.id, 'next')} style={{ padding: '2px 4px', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <ChevronRight size={14} />
                          </button>
                        )}
                      </div>

                      <button 
                        onClick={() => setActiveModule('prd')}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                      >
                        PRD
                      </button>
                    </div>
                  </div>
                ))}

                {colItems.length === 0 && (
                  <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.78rem', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                    Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD FEATURE MODAL */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '20px', position: 'relative', backgroundColor: 'var(--bg-card)', borderRadius: '12px' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
              <X size={16} />
            </button>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Add Feature</h3>

            <form onSubmit={handleAddFeature} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Title</label>
                <input 
                  type="text" required placeholder="e.g. SSO Login" value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)} 
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Category</label>
                  <select 
                    value={newCategory} onChange={e => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                  >
                    <option value="UI/UX">UI/UX</option>
                    <option value="Ingestion">Ingestion</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Performance">Performance</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Status</label>
                  <select 
                    value={newStatus} onChange={e => setNewStatus(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                  >
                    <option value="Now">Now</option>
                    <option value="Next">Next</option>
                    <option value="Later">Later</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Description</label>
                <textarea 
                  placeholder="Short description..." value={newDesc} onChange={e => setNewDesc(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)', height: '60px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
