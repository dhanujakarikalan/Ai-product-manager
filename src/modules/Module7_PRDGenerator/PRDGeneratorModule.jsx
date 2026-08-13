import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Sparkles, Download, Edit3, CheckCircle2, Share2, Plus, ArrowRight, Eye, Code } from 'lucide-react';

export const PRDGeneratorModule = () => {
  const { data } = useApp();
  const [selectedPrdId, setSelectedPrdId] = useState(data.prds[0]?.id || '');
  const [activeView, setActiveView] = useState('preview'); // 'preview' or 'editor'
  const [generating, setGenerating] = useState(false);

  const activePrd = data.prds.find(p => p.id === selectedPrdId) || data.prds[0] || {
    title: 'PRD: Automated Report Export Engine',
    version: 'v1.2',
    author: 'Alex Rivera',
    lastUpdated: 'Today at 11:30 AM',
    overview: 'This document defines the engineering requirements for implementing an automated background report export engine.'
  };
  const selectedPrd = activePrd;

  const handleDownloadPrd = (e) => {
    if (e) e.preventDefault();
    const doc = activePrd;
    const content = `# ${doc.title} (${doc.version})
Author: ${doc.author} | Last Updated: ${doc.lastUpdated}

## Executive Overview
${doc.overview || 'Overview of feature requirements.'}

## 1. Problem Statement
${doc.problemStatement || 'Customer support tickets report browser locks during 50k+ row exports.'}

## 2. Target Personas & User Needs
- Product Managers
- Data Analysts & Enterprise Customers

## 3. Solution & Technical Architecture
Asynchronous background worker queue with real-time progress indicators and non-blocking download streams.

## 4. Acceptance Criteria
- Given user clicks Export on >50k rows
- When background worker queues job
- Then progress bar displays instantly without blocking UI
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(doc.title || 'prd_document').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="animate-fade-in">
      <div className="module-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>PRD Generator</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Generate and edit Product Requirement Documents based on customer feedback.
          </p>
        </div>
      </div>

      <div className="module-body">
        {/* Document Selector & Editor Toggle */}
        <div className="glass-panel" style={{ padding: '14px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-dim)' }}>PRD Document:</span>
            <select 
              value={selectedPrdId}
              onChange={e => setSelectedPrdId(e.target.value)}
              className="input-field"
              style={{ width: '320px', fontWeight: 600, fontSize: '0.86rem', padding: '6px 12px' }}
            >
              {data.prds.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} • {p.version}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleDownloadPrd} 
              className="btn btn-primary btn-sm"
              style={{ gap: '6px' }}
              title="Download PRD document as Markdown file"
            >
              <Download size={14} />
              <span>Download PRD</span>
            </button>
            <button 
              onClick={() => setActiveView('preview')} 
              className="btn btn-sm"
              style={{ background: activeView === 'preview' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: activeView === 'preview' ? '#fff' : 'var(--text-muted)' }}
            >
              <Eye size={14} />
              <span>Preview</span>
            </button>
            <button 
              onClick={() => setActiveView('editor')} 
              className="btn btn-sm"
              style={{ background: activeView === 'editor' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: activeView === 'editor' ? '#fff' : 'var(--text-muted)' }}
            >
              <Edit3 size={14} />
              <span>Edit Markdown</span>
            </button>
          </div>
        </div>

        {activeView === 'preview' ? (
          <div className="grid-2" style={{ gap: '24px' }}>
            {/* Left: Document Content */}
            <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="badge badge-success">{selectedPrd.version}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Last updated: {selectedPrd.lastUpdated} by {selectedPrd.author}</span>
                </div>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>{selectedPrd.title}</h2>
              </div>

              <div>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  1. Product / Feature Title & Version
                </h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                  {selectedPrd.overview}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  2. Problem Statement & Customer Pain Points
                </h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-main)', background: 'rgba(244, 63, 94, 0.08)', padding: '14px', borderRadius: '10px', borderLeft: '3px solid #fb7185' }}>
                  {selectedPrd.problemStatement}
                </p>
              </div>

              {/* Customer Feedback Evidence */}
              <div>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  3. Relevant Customer Feedback Evidence
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.feedbackItems.slice(0, 3).map((f, i) => (
                    <div key={i} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-main)' }}>{f.source}:</strong> "{f.content}"
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  4. Objective & Target Users / Personas
                </h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
                  {selectedPrd.targetAudience}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  5. User Needs & Proposed Solution
                </h4>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {selectedPrd.goals.map((g, idx) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', marginBottom: '6px' }}>6. Functional Requirements</h4>
                  <ul style={{ paddingLeft: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <li>REST API backend connection</li>
                    <li>Asynchronous processing queue</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', marginBottom: '6px' }}>7. Non-Functional Requirements</h4>
                  <ul style={{ paddingLeft: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <li>Response time &lt; 200ms</li>
                    <li>99.9% uptime SLA</li>
                  </ul>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '6px' }}>8. Business Impact & Success Metrics</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>+24% customer retention, ARR opportunity $140K.</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', marginBottom: '6px' }}>9. Risks & Assumptions</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Assumes FastAPI backend deployment within Q3 sprint.</p>
                </div>
              </div>
            </div>

            {/* Right: User Stories & Acceptance Criteria Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* User Stories */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem' }}>User Stories Backlog</h3>
                  <span className="badge badge-primary">{selectedPrd.userStories.length} Stories</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedPrd.userStories.map((story, idx) => (
                    <div key={story.id} className="glass-card" style={{ padding: '14px', borderLeft: '3px solid var(--primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#818cf8' }}>Story #{idx + 1} ({story.role})</span>
                        <span className={`badge ${story.status === 'Done' ? 'badge-success' : 'badge-warning'}`}>{story.status}</span>
                      </div>
                      <p style={{ fontSize: '0.86rem', lineHeight: 1.4, color: 'var(--text-main)' }}>
                        <strong>As a</strong> {story.role}, <strong>I want to</strong> {story.action}, <strong>so that</strong> {story.benefit}.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Split Markdown Editor Mode */
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Live Markdown Specification Editor</h3>
            <textarea 
              defaultValue={`# ${selectedPrd.title}\n**Version:** ${selectedPrd.version}\n**Author:** ${selectedPrd.author}\n\n## 1. Executive Overview\n${selectedPrd.overview}\n\n## 2. Problem Statement\n${selectedPrd.problemStatement}\n\n## 3. Goals\n${selectedPrd.goals.map(g => `- ${g}`).join('\n')}`}
              style={{
                width: '100%',
                height: '450px',
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '20px',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'none'
              }}
            />
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setActiveView('preview')} className="btn btn-primary">Save & View Formatted PRD</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
