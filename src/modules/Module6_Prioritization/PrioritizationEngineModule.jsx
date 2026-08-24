import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, Sliders, Sparkles, ArrowRight, FileText, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

export const PrioritizationEngineModule = () => {
  const { data, updateFeatureScore, createPRD } = useApp();
  const [selectedFeatureId, setSelectedFeatureId] = useState(data.features[0]?.id || '');
  const [activeTab, setActiveTab] = useState('rice'); // 'rice' or 'matrix'

  const selectedFeature = data.features.find(f => f.id === selectedFeatureId) || data.features[0];

  const handleSliderChange = (field, val) => {
    updateFeatureScore(selectedFeatureId, { [field]: Number(val) });
  };

  return (
    <div className="animate-fade-in">
      <div className="module-header">
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Module 6: Quantitative Decision Engine</span>
          <h1 style={{ fontSize: '1.75rem' }}>AI-Based Prioritization & Impact Analysis Engine</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Interactive RICE calculator, Kano categorization, and Value vs. Effort matrix powered by multi-channel telemetry.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('rice')} 
            className="btn" 
            style={{ 
              background: activeTab === 'rice' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
              color: '#fff', 
              border: '1px solid', 
              borderColor: activeTab === 'rice' ? 'var(--primary)' : 'var(--border-color)' 
            }}
          >
            <Sliders size={16} />
            <span>Interactive RICE Studio</span>
          </button>
          <button 
            onClick={() => setActiveTab('matrix')} 
            className="btn" 
            style={{ 
              background: activeTab === 'matrix' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
              color: '#fff', 
              border: '1px solid', 
              borderColor: activeTab === 'matrix' ? 'var(--primary)' : 'var(--border-color)' 
            }}
          >
            <Target size={16} />
            <span>Value vs. Effort Matrix</span>
          </button>
        </div>
      </div>

      <div className="module-body">
        {/* Feature Selector Bar */}
        <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-dim)' }}>Select Feature candidate to adjust:</span>
            <select 
              value={selectedFeatureId}
              onChange={e => setSelectedFeatureId(e.target.value)}
              className="input-field"
              style={{ width: '380px', fontWeight: 600, fontSize: '0.9rem' }}
            >
              {data.features.map(f => (
                <option key={f.id} value={f.id} style={{ background: '#0f1523' }}>
                  {f.title} (RICE: {f.riceScore})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>ARR Impact: <strong style={{ color: '#34d399' }}>{selectedFeature.arrImpact}</strong></span>
            <button 
              onClick={() => createPRD(selectedFeature.id)} 
              className="btn btn-primary btn-sm"
            >
              <FileText size={14} />
              <span>Generate AI PRD for this Feature</span>
            </button>
          </div>
        </div>

        {activeTab === 'rice' ? (
          <div className="grid-2" style={{ gap: '24px' }}>
            {/* RICE Sliders Column */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.15rem' }}>Interactive RICE Parameter Controls</h3>
                <span className="badge badge-primary">Formula: (R × I × C) ÷ E</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Reach */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '0.92rem' }}>Reach (Users / Quarter)</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Estimated unique accounts impacted by this feature</div>
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#818cf8' }}>{selectedFeature.reach} users</span>
                  </div>
                  <input 
                    type="range" min="500" max="20000" step="500"
                    value={selectedFeature.reach}
                    onChange={e => handleSliderChange('reach', e.target.value)}
                    style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
                  />
                </div>

                {/* Impact */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '0.92rem' }}>Impact (1 = Low, 2 = Medium, 3 = High, 4 = Massive)</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Degree of conversion or ARR improvement per user</div>
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>{selectedFeature.impact}x multiplier</span>
                  </div>
                  <input 
                    type="range" min="1" max="4" step="0.5"
                    value={selectedFeature.impact}
                    onChange={e => handleSliderChange('impact', e.target.value)}
                    style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                  />
                </div>

                {/* Confidence */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '0.92rem' }}>Confidence Level (%)</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Evidence strength (CDP drop-off correlation + tickets)</div>
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>{selectedFeature.confidence}%</span>
                  </div>
                  <input 
                    type="range" min="50" max="100" step="5"
                    value={selectedFeature.confidence}
                    onChange={e => handleSliderChange('confidence', e.target.value)}
                    style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                  />
                </div>

                {/* Effort */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '0.92rem' }}>Effort (Person-Months / Sprints)</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Engineering & design workload required to ship</div>
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f43f5e' }}>{selectedFeature.effort} Person-Months</span>
                  </div>
                  <input 
                    type="range" min="1" max="12" step="1"
                    value={selectedFeature.effort}
                    onChange={e => handleSliderChange('effort', e.target.value)}
                    style={{ width: '100%', accentColor: '#f43f5e', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>

            {/* RICE Score Display & AI Confidence Explanation */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ padding: '24px', textAlign: 'center', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.4)', marginBottom: '24px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c7d2fe', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Calculated RICE Priority Score</span>
                  <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', margin: '8px 0', textShadow: '0 0 30px rgba(99, 102, 241, 0.6)' }}>
                    {selectedFeature.riceScore}
                  </div>
                  <span className="badge badge-success">Top Tier Strategic Priority (#1 in Backlog)</span>
                </div>

                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', fontWeight: 600, fontSize: '0.86rem', marginBottom: '8px' }}>
                    <Sparkles size={16} />
                    <span>AI Confidence Justification</span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                    Our AI model assigns a <strong>{selectedFeature.confidence}% confidence rating</strong> because this feature directly resolves <strong>{selectedFeature.upvotes} customer upvotes</strong> ($340k ARR) and correlates with the exact 4.1% funnel drop-off isolated in Mixpanel telemetry.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button onClick={() => createPRD(selectedFeature.id)} className="btn btn-primary" style={{ flex: 1 }}>
                  <FileText size={16} />
                  <span>Send to PRD Generator</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Value vs Effort 2D Matrix View */
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Value vs. Effort Strategic Quadrant</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Visualizing feature opportunities across <strong>Quick Wins</strong>, <strong>Major Projects</strong>, <strong>Fill-Ins</strong>, and <strong>Money Pits</strong>.
            </p>

            <div style={{ 
              position: 'relative', 
              height: '420px', 
              border: '2px solid var(--border-color)', 
              borderRadius: '16px', 
              background: 'rgba(0,0,0,0.3)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr'
            }}>
              {/* Quadrant Labels */}
              <div style={{ borderRight: '1px dashed rgba(255,255,255,0.1)', borderBottom: '1px dashed rgba(255,255,255,0.1)', padding: '16px', color: '#34d399', fontWeight: 700, fontSize: '0.86rem' }}>
                🚀 QUICK WINS (High Value, Low Effort)
              </div>
              <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.1)', padding: '16px', color: '#818cf8', fontWeight: 700, fontSize: '0.86rem' }}>
                💎 MAJOR STRATEGIC BETS (High Value, High Effort)
              </div>
              <div style={{ borderRight: '1px dashed rgba(255,255,255,0.1)', padding: '16px', color: '#f59e0b', fontWeight: 700, fontSize: '0.86rem', alignSelf: 'end' }}>
                ☕ FILL-INS (Low Value, Low Effort)
              </div>
              <div style={{ padding: '16px', color: '#f43f5e', fontWeight: 700, fontSize: '0.86rem', alignSelf: 'end' }}>
                ⚠️ TIME SINKS (Low Value, High Effort)
              </div>

              {/* Plotting Feature Dots */}
              {data.features.map(f => {
                // Map effort (1-10) to left% (10% to 90%)
                const leftPos = Math.min(90, Math.max(10, (f.effort / 8) * 80));
                // Map valueScore (0-100) to bottom% (10% to 90%)
                const bottomPos = Math.min(90, Math.max(10, f.valueScore * 0.85));

                return (
                  <div 
                    key={f.id}
                    onClick={() => setSelectedFeatureId(f.id)}
                    style={{
                      position: 'absolute',
                      left: `${leftPos}%`,
                      bottom: `${bottomPos}%`,
                      transform: 'translate(-50%, 50%)',
                      padding: '8px 14px',
                      background: f.id === selectedFeatureId ? 'var(--primary)' : 'rgba(30, 41, 64, 0.95)',
                      border: '2px solid',
                      borderColor: f.id === selectedFeatureId ? '#fff' : 'rgba(255,255,255,0.2)',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
                      transition: 'all 0.2s ease',
                      zIndex: f.id === selectedFeatureId ? 10 : 5
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
                      {f.title.substring(0, 22)}...
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
