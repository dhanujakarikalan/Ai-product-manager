import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Sparkles, Download, Edit3, CheckCircle2, Share2, Plus, ArrowRight, Eye, Code } from 'lucide-react';

export const PRDGeneratorModule = () => {
  const { data } = useApp();
  const [selectedPrdId, setSelectedPrdId] = useState(data.prds[0]?.id || '');
  const [activeView, setActiveView] = useState('preview'); // 'preview' or 'editor'
  const [generating, setGenerating] = useState(false);

  const selectedPrd = data.prds.find(p => p.id === selectedPrdId) || data.prds[0];

  const handleSimulateAIDrafting = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert('AI Generative Draft Completed! Added 2 new acceptance criteria scenarios and edge-case error handling.');
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <div className="module-header">
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Module 7: AI Specification Studio</span>
          <h1 style={{ fontSize: '1.75rem' }}>PRD & User Story Generation Module</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Transform prioritized feature concepts into structured requirements, Gherkin acceptance criteria, and user stories.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSimulateAIDrafting} disabled={generating} className="btn btn-primary" style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}>
            <Sparkles size={16} />
            <span>{generating ? 'AI Writing Specification...' : 'AI Enhance & Polish PRD'}</span>
          </button>
          <button onClick={() => alert('Exported PRD & Stories to Jira / Linear format (JSON + Markdown payload saved)!')} className="btn btn-secondary">
            <Download size={16} />
            <span>Export to Jira / Linear</span>
          </button>
        </div>
      </div>

      <div className="module-body">
        {/* Document Selector & Editor Toggle */}
        <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <FileText size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-dim)' }}>Select Active PRD:</span>
            <select 
              value={selectedPrdId}
              onChange={e => setSelectedPrdId(e.target.value)}
              className="input-field"
              style={{ width: '380px', fontWeight: 600, fontSize: '0.9rem' }}
            >
              {data.prds.map(p => (
                <option key={p.id} value={p.id} style={{ background: '#0f1523' }}>
                  {p.title} ({p.version})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setActiveView('preview')} 
              className="btn btn-sm"
              style={{ background: activeView === 'preview' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: '#fff' }}
            >
              <Eye size={14} />
              <span>Formatted Preview</span>
            </button>
            <button 
              onClick={() => setActiveView('editor')} 
              className="btn btn-sm"
              style={{ background: activeView === 'editor' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: '#fff' }}
            >
              <Edit3 size={14} />
              <span>Markdown Editor</span>
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
                  1. Executive Overview
                </h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                  {selectedPrd.overview}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  2. Problem Statement & ARR Justification
                </h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-main)', background: 'rgba(244, 63, 94, 0.08)', padding: '14px', borderRadius: '10px', borderLeft: '3px solid #fb7185' }}>
                  {selectedPrd.problemStatement}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  3. Target Audience & Personas
                </h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
                  {selectedPrd.targetAudience}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  4. Strategic Goals & Key Results
                </h4>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {selectedPrd.goals.map((g, idx) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
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
