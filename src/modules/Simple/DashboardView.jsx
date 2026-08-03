import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, AlertTriangle, Cpu, ArrowRight, Sparkles, TrendingUp, Users, CheckCircle2, FileText, Server, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export const DashboardView = () => {
  const { data, chartData, setActiveModule, apiConnected } = useApp();

  const backend = data.backendMetrics || {};
  const totalCount = data.totalFeedbackCount || 142;
  const posCount = backend["Positive Feedback"] || 84;
  const negCount = backend["Negative Feedback"] || 42;
  const neuCount = backend["Neutral Feedback"] || 16;

  // Transform backend categories or themes into chart data if present
  const themeChartData = backend.Themes
    ? Object.entries(backend.Themes).map(([name, tickets]) => ({ name, tickets }))
    : chartData.themeDistribution;

  const sentimentPieData = backend["Positive Feedback"] !== undefined
    ? [
        { name: 'Positive', value: posCount, color: 'var(--accent-emerald)' },
        { name: 'Negative', value: negCount, color: 'var(--accent-rose)' },
        { name: 'Neutral', value: neuCount, color: 'var(--accent-cyan)' }
      ]
    : chartData.sentiment;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div className="module-header">
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Analytics Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Comprehensive overview of customer feedback, sentiment trends, and prioritized roadmap features.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', padding: '6px 12px', borderRadius: '20px', background: apiConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: apiConnected ? '#34d399' : '#fbbf24', border: '1px solid currentColor', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Server size={14} /> {apiConnected ? 'FastAPI Connected' : 'FastAPI Ready'}
          </span>
          <button onClick={() => setActiveModule('upload')} className="btn btn-primary" style={{ gap: '6px' }}>
            <span>Upload New Data</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="module-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* ROW 1: KPI Cards */}
        <div className="grid-4" style={{ gap: '20px' }}>
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Feedback</span>
              <FileText size={18} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)' }}>{totalCount}</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Records ingested & analyzed</span>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-rose)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Negative Feedback</span>
              <AlertTriangle size={18} color="var(--accent-rose)" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)' }}>{negCount}</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Frustrations & friction points</span>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-amber)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Prioritized Features</span>
              <Sparkles size={18} color="var(--accent-amber)" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)' }}>{data.features.length}</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Roadmap items</span>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-emerald)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Positive Feedback</span>
              <CheckCircle2 size={18} color="var(--accent-emerald)" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)' }}>{posCount}</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)' }}>Delight & appreciation</span>
          </div>
        </div>

        {/* ROW 2: Visualizations (Bar & Pie) */}
        <div className="grid-2" style={{ gap: '24px' }}>
          {/* Category Bar Chart */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px' }}>Theme Distribution</h3>
            <div style={{ height: '260px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={themeChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} 
                  />
                  <Bar dataKey="tickets" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sentiment Pie Chart */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px' }}>Feedback Sentiment</h3>
            <div style={{ height: '260px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {sentimentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Custom Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginLeft: '20px' }}>
                {sentimentPieData.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: s.color || '#6366f1' }}></div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{s.name} ({s.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Trend Line Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px' }}>Incoming Feedback Trend</h3>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.trends} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} 
                />
                <Line type="monotone" dataKey="tickets" stroke="var(--accent-cyan)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-main)', stroke: 'var(--accent-cyan)', strokeWidth: 2 }} activeDot={{ r: 6, fill: 'var(--accent-cyan)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROW 4: Side-by-Side Lists (Pain Points & Features) */}
        <div className="grid-2" style={{ gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Top Pain Points</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.themes.map(theme => (
                <div key={theme.id} style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)' }}>{theme.title}</span>
                    <span className={`badge ${theme.severity === 'Critical' ? 'badge-danger' : 'badge-warning'}`}>{theme.severity}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{theme.aiSummary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Prioritized Feature Backlog</h3>
              <button onClick={() => setActiveModule('reports')} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.82rem', cursor: 'pointer' }}>
                View All Reports →
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.features.map(feat => (
                <div key={feat.id} style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)' }}>{feat.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>Impact: {feat.impact}x • Upvotes: {feat.upvotes}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--primary)' }}>{feat.riceScore}</div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>RICE Score</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
