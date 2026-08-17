import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, AlertTriangle, Cpu, ArrowRight, Sparkles, TrendingUp, Users, CheckCircle2, FileText, Server, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

export const DashboardView = () => {
  const { data, chartData, setActiveModule, apiConnected } = useApp();

  const backend = data.backendMetrics || {};
  const totalCount = data.totalFeedbackCount || data.feedbackItems?.length || 200;
  
  const posCount = data.positiveCount !== undefined ? data.positiveCount : (backend["Positive Feedback"] || Math.round(totalCount * 0.65));
  const negCount = data.negativeCount !== undefined ? data.negativeCount : (backend["Negative Feedback"] || Math.round(totalCount * 0.25));
  const neuCount = Math.max(0, totalCount - posCount - negCount);

  const posPct = Math.round((posCount / Math.max(1, totalCount)) * 100);
  const negPct = Math.round((negCount / Math.max(1, totalCount)) * 100);
  const posNeuPct = Math.min(100, Math.round(((posCount + neuCount) / Math.max(1, totalCount)) * 100));

  // Dynamic Top Theme
  const topThemeObj = data.themes?.[0] || { name: 'Performance', ticketCount: Math.round(totalCount * 0.4) };
  const topThemeName = topThemeObj.name || topThemeObj.title || 'Performance';
  const topThemeTickets = topThemeObj.ticketCount || topThemeObj.count || Math.round(totalCount * 0.4);

  // Dynamic Top Pain Point
  const topPainPointObj = data.backendPainPoints ? Object.entries(data.backendPainPoints)[0] : null;
  const topPainPointName = topPainPointObj ? topPainPointObj[0] : (data.themes?.[0]?.title || 'Export Timeouts');
  const topPainPointCount = topPainPointObj ? topPainPointObj[1] : Math.round(totalCount * 0.28);

  // Dynamic Theme Chart Data
  const themeChartData = data.categories?.length
    ? data.categories.map(c => ({ name: c.name, tickets: c.count }))
    : data.themes?.length
    ? data.themes.map(t => ({ name: t.name || t.title, tickets: t.ticketCount || 20 }))
    : chartData.themeDistribution;

  // Dynamic Sentiment Donut Data
  const sentimentPieData = [
    { name: 'Positive', value: posCount, color: '#10b981' },
    { name: 'Neutral', value: neuCount, color: '#06b6d4' },
    { name: 'Negative', value: negCount, color: '#f43f5e' }
  ];

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
        
        {/* ROW 1: Quick Actions Bar */}
        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Quick Actions:</span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveModule('prd')} className="btn btn-primary btn-sm">Generate PRD</button>
            <button onClick={() => setActiveModule('stories')} className="btn btn-secondary btn-sm">Generate User Stories</button>
            <button onClick={() => setActiveModule('prioritization')} className="btn btn-secondary btn-sm">Prioritize Features</button>
            <button onClick={() => setActiveModule('chat')} className="btn btn-secondary btn-sm">Ask AI Assistant</button>
          </div>
        </div>

        {/* ROW 2: Top 6 KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Feedback</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>{totalCount}</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Records ingested</span>
          </div>

          <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Positive %</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>
              {posPct}%
            </div>
            <span style={{ fontSize: '0.72rem', color: '#34d399' }}>Satisfied users</span>
          </div>

          <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #f43f5e' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Negative %</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fb7185', marginTop: '4px' }}>
              {negPct}%
            </div>
            <span style={{ fontSize: '0.72rem', color: '#fb7185' }}>Pain & friction</span>
          </div>

          <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #38bdf8' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Top Theme</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {topThemeName}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{topThemeTickets} tickets</span>
          </div>

          <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Top Pain Point</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {topPainPointName}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>{topPainPointCount} complaints</span>
          </div>

          <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #c084fc' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Feature Requests</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#c084fc', marginTop: '4px' }}>{data.features?.length || 3}</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Prioritized items</span>
          </div>
        </div>

        {/* ROW 2: Visualizations (Bar & Pie) */}
        <div className="grid-2" style={{ gap: '24px' }}>
          {/* Category Bar Chart */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Theme Distribution</h3>
              <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>By Ticket Volume</span>
            </div>
            <div style={{ height: '260px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={themeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '10px', color: 'var(--text-main)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }} 
                  />
                  <Bar dataKey="tickets" radius={[8, 8, 0, 0]}>
                    {themeChartData.map((entry, index) => {
                      const colors = ['#6366f1', '#38bdf8', '#10b981', '#a855f7', '#f59e0b', '#f43f5e'];
                      return <Cell key={`bar-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sentiment Donut Chart with Center KPI */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Feedback Sentiment</h3>
              <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>{posNeuPct}% Positive/Neutral</span>
            </div>
            <div style={{ height: '260px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={95}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {sentimentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '10px', color: 'var(--text-main)' }} 
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div style={{ position: 'absolute', left: '30%', top: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>{totalCount}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total</div>
              </div>
              
              {/* Custom Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginLeft: '10px', flex: 1 }}>
                {sentimentPieData.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '10px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: s.color || '#6366f1', flexShrink: 0 }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{s.name}</span>
                      <strong style={{ color: 'var(--text-main)', marginLeft: '12px' }}>{s.value}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Area Trend Chart with Gradient Fill */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Incoming Feedback Trend</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>Weekly volume trajectory across channels</p>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={15} /> +18.4% vs last week
            </span>
          </div>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.trends} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '10px', color: 'var(--text-main)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }} 
                />
                <Area type="monotone" dataKey="tickets" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" dot={{ r: 4, fill: 'var(--bg-main)', stroke: '#38bdf8', strokeWidth: 2 }} activeDot={{ r: 7, fill: '#38bdf8' }} />
              </AreaChart>
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
