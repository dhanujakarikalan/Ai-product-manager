import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Filter, PlusCircle, Sparkles, ArrowRight, ShieldAlert, CheckCircle2, Search, SlidersHorizontal } from 'lucide-react';

export const FeedbackIngestionModule = () => {
  const { data, addFeedbackItem, setActiveModule } = useApp();
  const [filterSource, setFilterSource] = useState('ALL');
  const [filterSentiment, setFilterSentiment] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [simulating, setSimulating] = useState(false);

  const handleSimulateLiveTicket = () => {
    setSimulating(true);
    setTimeout(() => {
      const simulatedTickets = [
        {
          id: `fb-${Date.now()}`,
          source: 'Zendesk Ticket #5012 (Urgent)',
          author: 'Enterprise Account: GlobalPay Inc.',
          content: 'We noticed a 12% increase in latency when executing high-concurrency API calls to the refund endpoint. Our dev team needs an async webhook return.',
          sentiment: 'Urgent Negative',
          urgencyScore: 92,
          date: 'Just now (Simulated stream)',
          themeId: 'theme-1',
          status: 'New'
        },
        {
          id: `fb-${Date.now() + 1}`,
          source: 'Gong Sales Call #192',
          author: 'VP of Engineering at FinScale',
          content: 'We love the AI copilot features, but we need custom RBAC permissions where junior product managers cannot edit or approve final RICE scores without lead review.',
          sentiment: 'High Opportunity',
          urgencyScore: 85,
          date: 'Just now (Simulated stream)',
          themeId: 'theme-3',
          status: 'New'
        }
      ];
      const randomTicket = simulatedTickets[Math.floor(Math.random() * simulatedTickets.length)];
      addFeedbackItem(randomTicket);
      setSimulating(false);
    }, 800);
  };

  const filteredItems = data.feedbackItems.filter(item => {
    const matchesSource = filterSource === 'ALL' || item.source.toLowerCase().includes(filterSource.toLowerCase());
    const matchesSentiment = filterSentiment === 'ALL' || item.sentiment.toLowerCase().includes(filterSentiment.toLowerCase());
    const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase()) || item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSentiment && matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      <div className="module-header">
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Module 2: Multi-Channel Ingestion</span>
          <h1 style={{ fontSize: '1.75rem' }}>Customer Feedback & Support Ticket Ingestion</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Real-time multi-source data stream with automated AI sentiment classification and urgency scoring.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleSimulateLiveTicket} 
            disabled={simulating}
            className="btn btn-primary"
            style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}
          >
            <Sparkles size={16} />
            <span>{simulating ? 'Ingesting AI Stream...' : 'Simulate Live Incoming Ticket'}</span>
          </button>
        </div>
      </div>

      <div className="module-body">
        {/* Source Channels status bar */}
        <div className="grid-4" style={{ marginBottom: '24px' }}>
          <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={20} color="#818cf8" />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>Zendesk & Support</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>1,420 Tickets</div>
              <span style={{ fontSize: '0.68rem', color: '#34d399' }}>Live Webhook Active</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SlidersHorizontal size={20} color="#22d3ee" />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>Gong Call Notes</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>840 Transcripts</div>
              <span style={{ fontSize: '0.68rem', color: '#34d399' }}>AI NLP Parsing</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} color="#34d399" />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>App Reviews & G2</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>580 Reviews</div>
              <span style={{ fontSize: '0.68rem', color: '#34d399' }}>4.6 Avg Rating</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="#fbbf24" />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>AI Auto-Clustered</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>98.4% Accuracy</div>
              <span style={{ fontSize: '0.68rem', color: '#a855f7' }}>Sent to Theme Engine</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Filter by author or text..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px', height: '38px', fontSize: '0.82rem' }}
              />
            </div>

            <select 
              value={filterSource} 
              onChange={e => setFilterSource(e.target.value)} 
              className="input-field" 
              style={{ width: '180px', height: '38px' }}
            >
              <option value="ALL">All Sources</option>
              <option value="Zendesk">Zendesk Support</option>
              <option value="App Store">App Store Reviews</option>
              <option value="Gong">Gong Sales Calls</option>
              <option value="Intercom">Intercom Live Chat</option>
              <option value="Canny">Canny Upvotes</option>
            </select>

            <select 
              value={filterSentiment} 
              onChange={e => setFilterSentiment(e.target.value)} 
              className="input-field" 
              style={{ width: '180px', height: '38px' }}
            >
              <option value="ALL">All Sentiments</option>
              <option value="Urgent">Urgent Negative</option>
              <option value="Opportunity">High Opportunity</option>
              <option value="Feature">Feature Request</option>
            </select>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            Showing <strong>{filteredItems.length}</strong> of {data.feedbackItems.length} items
          </div>
        </div>

        {/* Feedback List Table */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '14px 20px' }}>Source & Author</th>
                <th style={{ padding: '14px 20px' }}>Feedback Content Snippet</th>
                <th style={{ padding: '14px 20px' }}>AI Sentiment</th>
                <th style={{ padding: '14px 20px' }}>Urgency</th>
                <th style={{ padding: '14px 20px' }}>AI Cluster Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => {
                const isUrgent = item.urgencyScore >= 85;
                return (
                  <tr key={item.id} style={{ borderBottom: index < filteredItems.length - 1 ? '1px solid var(--border-color)' : 'none', transition: 'background 0.2s ease' }}>
                    <td style={{ padding: '16px 20px', verticalAlign: 'top', width: '22%' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>{item.source}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>{item.author}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.date}</div>
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'top', width: '42%' }}>
                      <p style={{ fontSize: '0.86rem', lineHeight: 1.5, color: 'var(--text-main)' }}>
                        "{item.content}"
                      </p>
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                      <span className={`badge ${item.sentiment.includes('Urgent') ? 'badge-danger' : item.sentiment.includes('Opportunity') ? 'badge-success' : 'badge-primary'}`}>
                        {item.sentiment}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '40px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${item.urgencyScore}%`, height: '100%', background: isUrgent ? '#f43f5e' : '#3b82f6' }} />
                        </div>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: isUrgent ? '#f43f5e' : '#60a5fa' }}>{item.urgencyScore}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-info">{item.status}</span>
                        <button 
                          onClick={() => setActiveModule('themes')}
                          title="View Cluster Theme"
                          style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                        >
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
