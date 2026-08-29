import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Columns, CheckCircle2, AlertCircle, ArrowRight, Clock, PlusCircle, Filter } from 'lucide-react';

export const RoadmapModule = () => {
  const { data, setActiveModule } = useApp();
  const [viewMode, setViewMode] = useState('gantt'); // 'gantt' or 'kanban'
  const [selectedQuarter, setSelectedQuarter] = useState('ALL');

  const quarters = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];
  const kanbanColumns = ['Discovery', 'Backlog', 'In Dev', 'QA', 'Released'];

  const filteredItems = data.roadmapItems.filter(item => 
    selectedQuarter === 'ALL' || item.quarter === selectedQuarter
  );

  return (
    <div className="animate-fade-in">
      <div className="module-header">
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Module 8: Strategic Alignment</span>
          <h1 style={{ fontSize: '1.75rem' }}>Roadmap Planning & Visualization Module</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Multi-view strategic timeline and Kanban board linking prioritized RICE features to delivery milestones.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setViewMode('gantt')} 
            className="btn"
            style={{ 
              background: viewMode === 'gantt' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
              color: '#fff', 
              border: '1px solid', 
              borderColor: viewMode === 'gantt' ? 'var(--primary)' : 'var(--border-color)' 
            }}
          >
            <Calendar size={16} />
            <span>Timeline / Gantt View</span>
          </button>
          <button 
            onClick={() => setViewMode('kanban')} 
            className="btn"
            style={{ 
              background: viewMode === 'kanban' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
              color: '#fff', 
              border: '1px solid', 
              borderColor: viewMode === 'kanban' ? 'var(--primary)' : 'var(--border-color)' 
            }}
          >
            <Columns size={16} />
            <span>Kanban Board View</span>
          </button>
        </div>
      </div>

      <div className="module-body">
        {/* Quarter & Category Filters */}
        <div className="glass-panel" style={{ padding: '14px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dim)' }}>Filter Horizon:</span>
            <button 
              onClick={() => setSelectedQuarter('ALL')} 
              className="btn btn-sm"
              style={{ background: selectedQuarter === 'ALL' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: '#fff' }}
            >
              Full Year 2026
            </button>
            {quarters.map(q => (
              <button 
                key={q}
                onClick={() => setSelectedQuarter(q)} 
                className="btn btn-sm"
                style={{ background: selectedQuarter === q ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: '#fff' }}
              >
                {q}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            Showing <strong>{filteredItems.length}</strong> strategic initiatives
          </div>
        </div>

        {viewMode === 'gantt' ? (
          /* Timeline / Gantt View */
          <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
            <div style={{ minWidth: '850px' }}>
              {/* Quarter Header Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: '260px repeat(4, 1fr)', borderBottom: '2px solid var(--border-color)', paddingBottom: '14px', marginBottom: '18px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                <div>Strategic Feature / Initiative</div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>Q1 2026 (Jan-Mar)</div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>Q2 2026 (Apr-Jun)</div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>Q3 2026 (Jul-Sep)</div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)' }}>Q4 2026 (Oct-Dec)</div>
              </div>

              {/* Gantt Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredItems.map(item => {
                  let colSpan = 1;
                  let colStart = 2; // Q1 default
                  if (item.quarter === 'Q2 2026') colStart = 3;
                  if (item.quarter === 'Q3 2026') colStart = 4;
                  if (item.quarter === 'Q4 2026') colStart = 5;

                  const isDev = item.status === 'In Dev';
                  const isDiscovery = item.status === 'Discovery';

                  return (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '260px repeat(4, 1fr)', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ paddingRight: '16px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>{item.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                          <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{item.category}</span>
                          <span style={{ fontSize: '0.72rem', color: isDev ? '#34d399' : '#fbbf24' }}>{item.status} ({item.progress}%)</span>
                        </div>
                      </div>

                      {/* Timeline Bar rendered inside the appropriate column */}
                      <div style={{ 
                        gridColumn: `${colStart} / span ${colSpan}`,
                        padding: '0 10px'
                      }}>
                        <div className="glass-card" style={{
                          padding: '12px 16px',
                          background: isDev ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)' : 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.15) 100%)',
                          borderLeft: isDev ? '4px solid #10b981' : '4px solid #6366f1',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{item.startMonth} - {item.endMonth}</div>
                            {item.dependencies.length > 0 && (
                              <div style={{ fontSize: '0.7rem', color: '#fbbf24', marginTop: '2px' }}>Blocked by #{item.dependencies[0]}</div>
                            )}
                          </div>
                          <button onClick={() => setActiveModule('prd')} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Kanban Board View */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', minHeight: '520px' }}>
            {kanbanColumns.map(col => {
              const itemsInCol = data.roadmapItems.filter(i => {
                if (col === 'Discovery' && i.status === 'Discovery') return true;
                if (col === 'Backlog' && i.status === 'Backlog') return true;
                if (col === 'In Dev' && i.status === 'In Dev') return true;
                if (col === 'QA' && i.status === 'QA') return true;
                if (col === 'Released' && i.status === 'Released') return true;
                return false;
              });

              return (
                <div key={col} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{col}</h4>
                    <span className="badge badge-primary">{itemsInCol.length}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    {itemsInCol.map(item => (
                      <div key={item.id} className="glass-card" style={{ padding: '14px', borderLeft: '3px solid var(--primary)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '4px' }}>{item.quarter}</div>
                        <h5 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>{item.title}</h5>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                          <span>Progress: {item.progress}%</span>
                          <button onClick={() => setActiveModule('prd')} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                            View PRD
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
