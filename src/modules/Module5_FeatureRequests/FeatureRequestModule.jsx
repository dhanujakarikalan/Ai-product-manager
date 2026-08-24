import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ListPlus, ThumbsUp, DollarSign, Target, CheckCircle2, GitMerge, Search, Filter, Plus } from 'lucide-react';

export const FeatureRequestModule = () => {
  const { data, setActiveModule } = useApp();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const filteredFeatures = data.features.filter(f => {
    const matchesStatus = filterStatus === 'ALL' || f.status === filterStatus;
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      <div className="module-header">
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Module 5: Consolidated Backlog</span>
          <h1 style={{ fontSize: '1.75rem' }}>Feature Request Aggregation Module</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Unified repository of feature opportunities promoted from AI clusters, sales calls, and Canny upvote boards.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowDuplicateModal(true)} className="btn btn-secondary">
            <GitMerge size={16} color="var(--accent-amber)" />
            <span>AI Duplicate Merge Analyzer</span>
          </button>
          <button onClick={() => setActiveModule('prioritization')} className="btn btn-primary">
            <Target size={16} />
            <span>Score in RICE Prioritization</span>
          </button>
        </div>
      </div>

      <div className="module-body">
        {/* Top Summary Bar */}
        <div className="grid-3" style={{ marginBottom: '24px' }}>
          <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>Total Aggregated Features</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>{data.features.length} Opportunities</div>
            </div>
            <ListPlus size={24} color="var(--primary)" />
          </div>

          <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>Total Enterprise ARR at Stake</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>$1,160,000 ARR</div>
            </div>
            <DollarSign size={24} color="#34d399" />
          </div>

          <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>Upvotes Across Channels</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#818cf8', marginTop: '4px' }}>
                {data.features.reduce((acc, f) => acc + (f.upvotes || 0), 0)} Customer Votes
              </div>
            </div>
            <ThumbsUp size={24} color="#818cf8" />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="glass-panel" style={{ padding: '14px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search feature backlog..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px', height: '38px', fontSize: '0.82rem' }}
              />
            </div>

            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)} 
              className="input-field"
              style={{ width: '170px', height: '38px' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Prioritized">Prioritized</option>
              <option value="In Development">In Development</option>
              <option value="Discovery">Discovery</option>
              <option value="Backlog">Backlog</option>
            </select>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            Showing <strong>{filteredFeatures.length}</strong> features
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid-2" style={{ gap: '20px' }}>
          {filteredFeatures.map(feat => (
            <div key={feat.id} className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span className="badge badge-primary">{feat.kanoCategory || 'Feature Candidate'}</span>
                  <span className={`badge ${feat.status === 'Prioritized' || feat.status === 'In Development' ? 'badge-success' : 'badge-warning'}`}>
                    {feat.status}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.16rem', marginBottom: '8px', color: 'var(--text-main)' }}>{feat.title}</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {feat.description}
                </p>
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>Customer Upvotes</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#818cf8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ThumbsUp size={14} /> {feat.upvotes}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>ARR Opportunity</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>{feat.arrImpact}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>RICE Score</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{feat.riceScore}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Lead PM: <strong>{feat.assignee}</strong></span>
                  <button onClick={() => setActiveModule('prioritization')} className="btn btn-secondary btn-sm">
                    <span>Adjust Scoring</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Duplicate Merge Analyzer Modal */}
        {showDuplicateModal && (
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
            <div className="glass-panel animate-fade-in" style={{ width: '580px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <GitMerge size={20} color="var(--accent-amber)" />
                  <h3 style={{ fontSize: '1.2rem' }}>AI Duplicate Match Detection</h3>
                </div>
                <button onClick={() => setShowDuplicateModal(false)} className="btn btn-secondary btn-sm">Close</button>
              </div>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Our semantic embeddings detected 2 feature proposals with a <strong>94% cosine similarity score</strong>. Would you like to merge their votes and ARR impact?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid #6366f1' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Proposal A: Background Worker Queue for Heavy Data Exports</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>24 upvotes • $115,000 ARR</div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid #06b6d4' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Proposal B: Async Report Generation with CSV Download Link</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>11 upvotes • $40,000 ARR</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => setShowDuplicateModal(false)} className="btn btn-secondary">Ignore</button>
                <button 
                  onClick={() => {
                    alert('Successfully merged duplicate requests! Upvotes combined to 35 ($155,000 ARR).');
                    setShowDuplicateModal(false);
                  }} 
                  className="btn btn-primary"
                >
                  <GitMerge size={16} />
                  <span>Merge Proposals & Combine Upvotes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
