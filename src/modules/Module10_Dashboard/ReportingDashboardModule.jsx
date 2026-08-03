import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, TrendingUp, AlertTriangle, Users, Sparkles, CheckCircle2, ArrowUpRight, Download, RefreshCw } from 'lucide-react';

export const ReportingDashboardModule = () => {
  const { data, setActiveModule } = useApp();
  const [briefingGenerated, setBriefingGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerateBriefing = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setBriefingGenerated(true);
    }, 1200);
  };

  return (
    <div className="animate-fade-in">
      <div className="module-header">
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Module 10: Executive Intelligence</span>
          <h1 style={{ fontSize: '1.75rem' }}>Reporting & Insights Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Real-time synthesis of customer sentiment, AI theme velocity, and ARR impact for <strong>{data.workspaces.find(w=>w.id===data.activeWorkspaceId)?.name}</strong>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleGenerateBriefing} className="btn btn-primary" disabled={generating}>
            <Sparkles size={16} />
            <span>{generating ? 'Synthesizing AI Briefing...' : 'Generate Executive Briefing'}</span>
          </button>
          <button className="btn btn-secondary">
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="module-body">
        {/* Top Executive KPI Grid */}
        <div className="grid-4" style={{ marginBottom: '28px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>ARR at Risk (Pain Points)</span>
              <AlertTriangle size={18} color="#fb7185" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, margin: '12px 0 6px', color: '#fb7185' }}>$1,160,000</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              <span style={{ color: '#fb7185', fontWeight: 600 }}>4 Critical themes</span> blocking enterprise deals
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Customer Satisfaction (CSAT)</span>
              <Users size={18} color="#34d399" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, margin: '12px 0 6px', color: '#34d399' }}>{data.analyticsMetrics.csatScore}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              <span style={{ color: '#34d399', fontWeight: 600 }}>+0.3 vs last quarter</span> across 42k DAU
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Feature Delivery Velocity</span>
              <TrendingUp size={18} color="#818cf8" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, margin: '12px 0 6px' }}>14 Features / Mo</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              <span style={{ color: '#818cf8', fontWeight: 600 }}>92% on-time</span> milestone completion
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)', borderColor: 'rgba(99, 102, 241, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.8rem', color: '#c7d2fe', fontWeight: 600, textTransform: 'uppercase' }}>AI Analysis Efficiency</span>
              <Sparkles size={18} color="#22d3ee" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, margin: '12px 0 6px', color: '#fff' }}>24.5 Hrs Saved</div>
            <div style={{ fontSize: '0.78rem', color: '#a5b4fc' }}>
              Per product manager this week via auto-clustering
            </div>
          </div>
        </div>

        {/* AI Executive Briefing Section (If generated) */}
        {briefingGenerated && (
          <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '28px', borderLeft: '4px solid var(--primary)', background: 'rgba(99, 102, 241, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Executive Briefing (Synthesized Today)</h3>
              </div>
              <span className="badge badge-success">High Confidence (96%)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
              <p>
                <strong>⚡ Key Risk Alert:</strong> Checkout 408 Gateway Timeouts with Stripe during peak multi-currency sales are currently causing <strong>$340k in ARR at risk</strong>. This correlates with the 4.1% funnel drop-off observed in Mixpanel.
              </p>
              <p>
                <strong>🚀 Recommended Action:</strong> Prioritize <em>"Resilient Checkout Gateway with Fallback & Circuit Breaker"</em> immediately (RICE Score: 573.8). Engineering estimates 4 weeks effort to safeguard checkout reliability.
              </p>
              <p>
                <strong>📈 Enterprise Growth Blocker:</strong> 4 Tier-1 prospects ($620k combined ARR) are blocked by lack of Okta SAML SSO and SOC2 audit logs. This has been promoted to Feature Backlog and is currently in Q1 development.
              </p>
            </div>
          </div>
        )}

        {/* Main Charts / Heatmap Area */}
        <div className="grid-2" style={{ gap: '24px' }}>
          {/* Left: Pain Point Severity Heatmap across Product Areas */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Product Area Pain Point Heatmap</h3>
              <span onClick={() => setActiveModule('themes')} style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View All Clusters <ArrowUpRight size={14} />
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {data.themes.map((theme, i) => {
                const isCritical = theme.severity === 'Critical';
                const isHigh = theme.severity === 'High';
                return (
                  <div key={theme.id} style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{theme.title}</span>
                      <span className={`badge ${isCritical ? 'badge-danger' : isHigh ? 'badge-warning' : 'badge-primary'}`}>
                        {theme.severity} Severity
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                      <span>Area: {theme.category}</span>
                      <span style={{ color: isCritical ? '#fb7185' : '#34d399', fontWeight: 600 }}>ARR Impact: {theme.affectedArr} ({theme.ticketCount} tickets)</span>
                    </div>
                    {/* Visual bar */}
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(100, theme.ticketCount * 3.5)}%`,
                        height: '100%',
                        backgroundColor: isCritical ? '#f43f5e' : isHigh ? '#f59e0b' : '#6366f1'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Quick Action Hub & Multi-Source Breakdown */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Multi-Channel Ingestion Distribution</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                AI continuous sentiment monitoring across connected customer touchpoints.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#6366f1' }} />
                    <span style={{ fontSize: '0.86rem', fontWeight: 500 }}>Zendesk Support Tickets</span>
                  </div>
                  <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>44% (1,420 tickets)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#06b6d4' }} />
                    <span style={{ fontSize: '0.86rem', fontWeight: 500 }}>Gong Sales Calls & Transcripts</span>
                  </div>
                  <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>26% (840 transcripts)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#10b981' }} />
                    <span style={{ fontSize: '0.86rem', fontWeight: 500 }}>App Store & G2 Reviews</span>
                  </div>
                  <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>18% (580 reviews)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#f59e0b' }} />
                    <span style={{ fontSize: '0.86rem', fontWeight: 500 }}>Intercom Live Chats</span>
                  </div>
                  <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>12% (390 chats)</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Ready to evaluate priority?</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Jump to our AI-scored RICE calculator</p>
                </div>
                <button onClick={() => setActiveModule('prioritization')} className="btn btn-primary btn-sm">
                  <span>Prioritization Engine</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
