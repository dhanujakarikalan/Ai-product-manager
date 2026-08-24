import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, RefreshCw, CheckCircle2, TrendingDown, Users, Zap, ExternalLink, ShieldCheck } from 'lucide-react';

export const AnalyticsIntegrationModule = () => {
  const { data, setActiveModule } = useApp();

  return (
    <div className="animate-fade-in">
      <div className="module-header">
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Module 3: Behavioral Telemetry</span>
          <h1 style={{ fontSize: '1.75rem' }}>Product Analytics Data Integration</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Real-time API connector sync with CDP and behavioral pipelines to correlate quantitative drop-offs with qualitative tickets.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => alert('Manually triggered full pipeline sync! All 5 CDP streams up to date.')}>
            <RefreshCw size={16} />
            <span>Sync Pipelines Now</span>
          </button>
        </div>
      </div>

      <div className="module-body">
        {/* Analytics Connectors Grid */}
        <h3 style={{ fontSize: '1.05rem', marginBottom: '14px', color: 'var(--text-main)' }}>Connected Analytics & CDP Pipelines</h3>
        <div className="grid-3" style={{ marginBottom: '32px' }}>
          {data.analyticsConnectors.map(conn => (
            <div key={conn.id} className="glass-card" style={{ padding: '18px', borderLeft: conn.status === 'Connected' ? '4px solid #10b981' : '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{conn.name}</span>
                <span className={`badge ${conn.status === 'Connected' ? 'badge-success' : 'badge-warning'}`}>
                  {conn.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                <span>Health Score: <strong style={{ color: '#34d399' }}>{conn.health}%</strong></span>
                <span>Sync: {conn.lastSync}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingTop: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Ingestion Rate</span>
                <strong style={{ color: 'var(--text-main)' }}>{conn.eventsToday}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* Behavioral Metrics Summary & Funnel Drop-off Correlation */}
        <div className="grid-2" style={{ gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <Users size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem' }}>Core Behavioral Metrics (Last 30 Days)</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Daily Active Users (DAU)</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, margin: '6px 0', color: 'var(--text-main)' }}>{data.analyticsMetrics.dau}</div>
                <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>{data.analyticsMetrics.dauGrowth} MoM</span>
              </div>

              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Checkout Conversion</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, margin: '6px 0', color: 'var(--text-main)' }}>{data.analyticsMetrics.checkoutConversion}</div>
                <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 600 }}>{data.analyticsMetrics.checkoutDropoff}</span>
              </div>

              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>30-Day Retention</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, margin: '6px 0', color: 'var(--text-main)' }}>{data.analyticsMetrics.retention30d}</div>
                <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 600 }}>Top 10% B2B SaaS Benchmark</span>
              </div>

              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Feature Adoption Rate</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, margin: '6px 0', color: 'var(--text-main)' }}>{data.analyticsMetrics.featureAdoptionRate}</div>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>New Dark Mode & Export</span>
              </div>
            </div>
          </div>

          {/* Quantitative to Qualitative Correlation Card */}
          <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(244, 63, 94, 0.4)', background: 'radial-gradient(circle at top right, rgba(244, 63, 94, 0.12) 0%, transparent 70%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingDown size={20} color="#fb7185" />
                <h3 style={{ fontSize: '1.1rem', color: '#fb7185' }}>AI Funnel Drop-off Correlation</h3>
              </div>
              <span className="badge badge-danger">High Confidence (r = 0.89)</span>
            </div>

            <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '16px' }}>
              Our telemetry anomaly detection caught a sharp <strong>4.1% conversion drop</strong> at the `3D-Secure Multicurrency Gateway` step.
            </p>

            <div style={{ padding: '14px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', marginBottom: '20px', borderLeft: '3px solid #fb7185' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                Directly Correlated Customer Feedback Theme
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-main)' }}>
                "Checkout Gateway Latency & Timeouts" (28 Support Tickets)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Affected Revenue Opportunity: <strong>$340,000 ARR</strong>
              </div>
            </div>

            <button onClick={() => setActiveModule('themes')} className="btn btn-primary" style={{ width: '100%' }}>
              <span>View AI Root Cause in Theme Engine</span>
              <ExternalLink size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
