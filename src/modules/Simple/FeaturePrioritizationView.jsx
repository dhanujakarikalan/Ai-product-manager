import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, Sparkles, TrendingUp, HelpCircle, ArrowUpRight, Calculator, CheckCircle2, ChevronRight } from 'lucide-react';

export const FeaturePrioritizationView = () => {
  const { data, updateFeatureScore, setActiveModule, createPRD } = useApp();
  const [scoringFramework, setScoringFramework] = useState('RICE'); // 'RICE' | 'CUSTOM' | 'VALUE_EFFORT'
  const [selectedFeature, setSelectedFeature] = useState(data.features[0] || null);

  // Custom weights for formula configuration
  const [weights, setWeights] = useState({
    userImpact: 2.0,
    businessValue: 2.5,
    customerDemand: 1.5,
    strategicAlignment: 1.0,
    urgency: 1.2,
    effort: 1.5,
    riskConfidence: 0.8
  });

  const handleScoreChange = (featId, key, val) => {
    updateFeatureScore(featId, { [key]: Number(val) });
  };

  // Calculate score explanation and calculated value
  const calculateCustomScore = (feat) => {
    const impact = (feat.impact || 3) * weights.userImpact;
    const value = (feat.valueScore || 80) * 0.05 * weights.businessValue;
    const demand = (feat.upvotes || 100) * 0.01 * weights.customerDemand;
    const effort = (feat.effort || 2) * weights.effort;
    const confidence = ((feat.confidence || 80) / 100) * weights.riskConfidence;

    const finalScore = Number((((impact + value + demand) * confidence) / (effort || 1)).toFixed(1));
    return finalScore;
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div className="module-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Feature Prioritization</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Configurable scoring inputs, automated ranking, and AI score explanations.
          </p>
        </div>

        {/* Framework Selector */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Framework:</span>
          <select 
            className="input-field" 
            value={scoringFramework} 
            onChange={e => setScoringFramework(e.target.value)}
            style={{ width: '180px', fontSize: '0.85rem', padding: '6px 12px' }}
          >
            <option value="RICE">RICE (Reach, Impact, Confidence, Effort)</option>
            <option value="CUSTOM">Custom Multi-Factor Weighting</option>
            <option value="VALUE_EFFORT">Value vs Effort Matrix</option>
          </select>
        </div>
      </div>

      <div className="module-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Scoring Formula Explainer */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Calculator size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
              {scoringFramework === 'RICE' && 'RICE Formula: (Reach × Impact × Confidence %) / Effort'}
              {scoringFramework === 'CUSTOM' && 'Custom Formula: [(Impact × W1 + BusinessValue × W2 + Demand × W3) × RiskConfidence] / Effort'}
              {scoringFramework === 'VALUE_EFFORT' && 'Value vs Effort Ratio: Value Score / Implementation Effort'}
            </h3>
          </div>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Features are dynamically ranked according to feedback frequency, user impact, and engineering effort. Click any feature to fine-tune inputs.
          </p>
        </div>

        {/* Feature List & Configurator Grid */}
        <div className="grid-2" style={{ gap: '24px' }}>
          
          {/* Feature Ranking Table */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '16px' }}>Ranked Roadmap Backlog</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.features
                .map(f => ({ ...f, currentScore: scoringFramework === 'CUSTOM' ? calculateCustomScore(f) : f.riceScore }))
                .sort((a, b) => b.currentScore - a.currentScore)
                .map((feat, idx) => {
                  const isSelected = selectedFeature?.id === feat.id;
                  return (
                    <div 
                      key={feat.id}
                      onClick={() => setSelectedFeature(feat)}
                      style={{ 
                        padding: '16px',
                        borderRadius: '10px',
                        background: isSelected ? 'rgba(99, 102, 241, 0.14)' : 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                          #{idx + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)' }}>{feat.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                            Upvotes: {feat.upvotes}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>{feat.currentScore}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Priority Score</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Configurable Input Sliders for Selected Feature */}
          {selectedFeature && (
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '6px' }}>Scoring Inspector</span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedFeature.title}</h3>
                  </div>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => createPRD(selectedFeature.id)}
                  >
                    <span>Generate PRD</span>
                    <ChevronRight size={15} />
                  </button>
                </div>

                {/* Sliders Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Reach / Demand */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Customer Demand / Reach:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{selectedFeature.reach || 3500} users</strong>
                    </div>
                    <input 
                      type="range" 
                      min="500" 
                      max="10000" 
                      step="250"
                      value={selectedFeature.reach || 3500} 
                      onChange={e => handleScoreChange(selectedFeature.id, 'reach', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  {/* Impact */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>User Impact (1x - 5x):</span>
                      <strong style={{ color: 'var(--text-main)' }}>{selectedFeature.impact || 3}x</strong>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      step="1"
                      value={selectedFeature.impact || 3} 
                      onChange={e => handleScoreChange(selectedFeature.id, 'impact', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  {/* Confidence */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Confidence & Risk %:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{selectedFeature.confidence || 85}%</strong>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="100" 
                      step="5"
                      value={selectedFeature.confidence || 85} 
                      onChange={e => handleScoreChange(selectedFeature.id, 'confidence', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  {/* Implementation Effort */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Implementation Effort (Weeks):</span>
                      <strong style={{ color: 'var(--text-main)' }}>{selectedFeature.effort || 3} wks</strong>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="12" 
                      step="1"
                      value={selectedFeature.effort || 3} 
                      onChange={e => handleScoreChange(selectedFeature.id, 'effort', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Score Explanation Callout */}
              <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', borderLeft: '3px solid var(--primary)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                  AI Score Explanation:
                </div>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  This feature ranks high due to strong feedback frequency ({selectedFeature.upvotes} requests).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
