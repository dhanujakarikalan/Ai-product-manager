import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, CheckCircle2, Calendar, Target, Sparkles, Lock } from 'lucide-react';

export const ReportsView = () => {
  const { data, hasPermission } = useApp();
  const [activeTab, setActiveTab] = useState('prd'); // 'prd' or 'roadmap'
  const role = data.userProfile.role || 'Product Manager';

  const selectedPrd = data.prds[0] || {
    title: 'PRD: Automated Report Export Engine',
    version: 'v1.2 (Approved)',
    overview: 'Automated background job processing and instant PDF/CSV generation for large dataset exports.',
    problemStatement: '28 customer complaints reported slow downloads or browser freezes when exporting large monthly reports on mobile devices.',
    goals: ['Reduce report export generation time below 2 seconds.', 'Achieve 100% export reliability across mobile and desktop devices.'],
    userStories: [
      { role: 'Product Manager', action: 'click export on a 50,000 row dataset', benefit: 'my PDF download starts instantly without freezing the browser' },
      { role: 'Executive Stakeholder', action: 'open quarterly summary reports on mobile', benefit: 'I can view clear, formatted charts immediately without errors' }
    ]
  };

  return (
    <div className="animate-fade-in">
      <div className="module-header">
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Generated Reports & Documentation</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            View and download AI-generated PRDs, User Stories, Acceptance Criteria, and Roadmap schedules.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setActiveTab('prd')} className="btn" style={{ background: activeTab === 'prd' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: '#fff' }}>
            <FileText size={16} />
            <span>PRD & User Stories</span>
          </button>
          <button onClick={() => setActiveTab('roadmap')} className="btn" style={{ background: activeTab === 'roadmap' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: '#fff' }}>
            <Calendar size={16} />
            <span>Roadmap Schedule</span>
          </button>
        </div>
      </div>

      <div className="module-body">
        {activeTab === 'prd' ? (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-success">{selectedPrd.version}</span>
                <h2 style={{ fontSize: '1.4rem', marginTop: '6px' }}>{selectedPrd.title}</h2>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {!hasPermission('generate_prd') && (
                  <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={13} />
                    <span>Read-Only ({role})</span>
                  </span>
                )}
                <button onClick={() => alert('Exported PRD to PDF / DOCX format!')} className="btn btn-secondary btn-sm">
                  <Download size={15} />
                  <span>Download PDF/DOCX</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '0.84rem', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '6px' }}>Executive Summary</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-main)' }}>{selectedPrd.overview}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.84rem', color: '#fb7185', textTransform: 'uppercase', marginBottom: '6px' }}>Problem Statement & ARR Risk</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-main)', background: 'rgba(244, 63, 94, 0.08)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #fb7185' }}>
                  {selectedPrd.problemStatement}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.84rem', color: '#34d399', textTransform: 'uppercase', marginBottom: '6px' }}>Key Goals & Objectives</h4>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem' }}>
                  {selectedPrd.goals?.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '0.84rem', color: '#818cf8', textTransform: 'uppercase', marginBottom: '10px' }}>Generated User Stories & Acceptance Criteria</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedPrd.userStories?.map((story, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '12px', borderLeft: '3px solid var(--primary)' }}>
                      <p style={{ fontSize: '0.86rem', lineHeight: 1.4 }}>
                        <strong>As a</strong> {story.role}, <strong>I want to</strong> {story.action}, <strong>so that</strong> {story.benefit}.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '6px' }}>Simple Roadmap Schedule</h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Simple view of what is completed, what is in development, and what is coming next.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px' }}>
              {/* Done */}
              <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #10b981', background: 'rgba(16, 185, 129, 0.05)' }}>
                <span className="badge badge-success" style={{ marginBottom: '10px' }}>✔ Completed</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '8px 0' }}>Enterprise Security & SSO</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  User role management and secure login protections are fully active.
                </p>
              </div>

              {/* In Progress */}
              <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid var(--primary)', background: 'rgba(99, 102, 241, 0.06)' }}>
                <span className="badge badge-primary" style={{ marginBottom: '10px' }}>⚡ In Progress (Right Now)</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '8px 0' }}>Automated Report Export Engine</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Building background exports so large reports download fast without freezing.
                </p>
              </div>

              {/* Coming Next */}
              <div className="glass-card" style={{ padding: '20px', borderTop: '4px solid #f59e0b', background: 'rgba(245, 158, 11, 0.05)' }}>
                <span className="badge badge-warning" style={{ marginBottom: '10px' }}>📅 Coming Next (Q2)</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '8px 0' }}>AI Anomaly Detection</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Automatic alerts whenever customer complaint numbers suddenly spike.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
