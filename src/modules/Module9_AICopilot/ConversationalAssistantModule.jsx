import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, Send, Sparkles, User, ArrowRight, FileText, Target, CheckCircle2, RefreshCw } from 'lucide-react';

export const ConversationalAssistantModule = () => {
  const { data, addChatMessage, setActiveModule, createPRD } = useApp();
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || thinking) return;

    // Add user message
    addChatMessage({ sender: 'user', time: 'Just now', text: query });
    if (!textToSend) setInput('');
    setThinking(true);

    // Simulate AI thinking and rich response
    setTimeout(() => {
      let aiText = `I analyzed your query: *"**${query}**"*. Based on our multi-channel telemetry and RICE scoring:`;
      let richAction = null;

      if (query.toLowerCase().includes('checkout') || query.toLowerCase().includes('conversion') || query.toLowerCase().includes('drop')) {
        aiText = `🚨 **Checkout Conversion Analysis**: We observed a **4.1% drop at the 3D-Secure settlement step**. This is directly correlated ($r = 0.89$) with **28 support tickets** reporting 408 Gateway Timeouts with Stripe during peak multi-currency sales. Total ARR at risk is **$340,000**.`;
        richAction = {
          type: 'FEATURE_RECOMMENDATION',
          featureId: 'feat-1',
          title: 'Resilient Checkout Gateway with Fallback & Circuit Breaker',
          rice: 573.8,
          arr: '$340,000'
        };
      } else if (query.toLowerCase().includes('enterprise') || query.toLowerCase().includes('blocker') || query.toLowerCase().includes('top')) {
        aiText = `🏢 **Enterprise Deal Blockers Summary**: There are currently **4 Tier-1 enterprise prospects** ($620,000 combined ARR) blocked by security requirements. Specifically, they require **Okta SAML SSO** and **SOC2 granular audit log export**. This is currently scheduled in **Q1 2026** development.`;
        richAction = {
          type: 'ROADMAP_ITEM',
          title: 'Enterprise SSO & Granular Audit Log',
          status: 'In Development (75% done)',
          quarter: 'Q1 2026'
        };
      } else if (query.toLowerCase().includes('rice') || query.toLowerCase().includes('highest') || query.toLowerCase().includes('priority')) {
        const topFeat = [...data.features].sort((a,b) => b.riceScore - a.riceScore)[0];
        aiText = `🎯 **Highest Priority Item by RICE Formula**: The #1 ranked feature in your backlog is **"${topFeat.title}"** with a RICE score of **${topFeat.riceScore}** (Confidence: ${topFeat.confidence}%, Impact: ${topFeat.impact}x).`;
        richAction = {
          type: 'FEATURE_RECOMMENDATION',
          featureId: topFeat.id,
          title: topFeat.title,
          rice: topFeat.riceScore,
          arr: topFeat.arrImpact
        };
      } else {
        aiText = `I have synthesized data across your active workspace (**${data.workspaces.find(w=>w.id===data.activeWorkspaceId)?.name}**). We currently have **${data.themes.length} AI clusters**, **${data.features.length} backlog features**, and **$1.16M total ARR at risk**. Would you like me to draft a PRD or adjust RICE scores?`;
      }

      addChatMessage({
        sender: 'ai',
        time: 'Just now',
        text: aiText,
        richAction
      });
      setThinking(false);
    }, 1000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 68px)' }}>
      <div className="module-header" style={{ flexShrink: 0 }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Module 9: Generative Intelligence</span>
          <h1 style={{ fontSize: '1.75rem' }}>Conversational Product Intelligence Assistant</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Ask natural language queries about customer pain points, telemetry anomalies, roadmap milestones, and RICE scores.
          </p>
        </div>
      </div>

      <div className="module-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingBottom: '20px' }}>
        {/* Chat History Area */}
        <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
          {data.chatHistory.map((msg, index) => (
            <div 
              key={index} 
              style={{ 
                display: 'flex', 
                gap: '14px', 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '75%'
              }}
            >
              {msg.sender === 'ai' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={20} color="#fff" />
                </div>
              )}

              <div style={{
                padding: '16px 20px',
                borderRadius: '16px',
                background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)' : 'rgba(22, 29, 46, 0.9)',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.74rem', color: msg.sender === 'user' ? '#e0e7ff' : 'var(--text-dim)' }}>
                  <span>{msg.sender === 'user' ? data.userProfile.name : 'AI Product Copilot (Gemini 3.1 Pro)'}</span>
                  <span>{msg.time}</span>
                </div>

                <div style={{ fontSize: '0.92rem', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />

                {/* Quick Option Chips */}
                {msg.options && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(opt)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '9999px',
                          background: 'rgba(99, 102, 241, 0.15)',
                          border: '1px solid rgba(99, 102, 241, 0.35)',
                          color: '#c7d2fe',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Sparkles size={13} />
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Rich Action Card embedded in Chat */}
                {msg.richAction && (
                  <div className="glass-card" style={{ marginTop: '14px', padding: '14px', background: 'rgba(0,0,0,0.3)', borderLeft: '3px solid #10b981' }}>
                    {msg.richAction.type === 'FEATURE_RECOMMENDATION' ? (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>RECOMMENDED BACKLOG CANDIDATE</div>
                        <div style={{ fontSize: '0.94rem', fontWeight: 600, margin: '4px 0' }}>{msg.richAction.title}</div>
                        <div style={{ display: 'flex', gap: '14px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                          <span>RICE Score: <strong style={{ color: '#fff' }}>{msg.richAction.rice}</strong></span>
                          <span>ARR Opportunity: <strong style={{ color: '#34d399' }}>{msg.richAction.arr}</strong></span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => setActiveModule('prioritization')} className="btn btn-secondary btn-sm">Inspect in RICE Engine</button>
                          <button onClick={() => createPRD(msg.richAction.featureId)} className="btn btn-primary btn-sm">Generate AI PRD</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700 }}>ROADMAP MILESTONE STATUS</div>
                        <div style={{ fontSize: '0.94rem', fontWeight: 600, margin: '4px 0' }}>{msg.richAction.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Schedule: {msg.richAction.quarter} • Status: {msg.richAction.status}</div>
                        <button onClick={() => setActiveModule('roadmap')} className="btn btn-secondary btn-sm">Open in Gantt Roadmap</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <img src={data.userProfile.avatar} alt="User" style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
              )}
            </div>
          ))}

          {thinking && (
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="#fff" />
              </div>
              <div className="glass-panel pulse-glow" style={{ padding: '12px 18px', borderRadius: '14px', fontSize: '0.86rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={16} color="var(--primary)" />
                <span>Synthesizing multi-channel product telemetry & RICE weights...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form 
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }} 
          className="glass-panel" 
          style={{ padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}
        >
          <input 
            type="text" 
            placeholder="Ask Copilot anything (e.g. 'Why did checkout conversion drop?', 'Draft PRD for Slack alerts')..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input-field"
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.92rem' }}
          />
          <button type="submit" disabled={thinking || !input.trim()} className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <span>Ask AI</span>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
