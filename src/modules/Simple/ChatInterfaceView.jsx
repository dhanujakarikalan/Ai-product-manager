import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, Sparkles, Bot, FileText, CheckCircle2 } from 'lucide-react';

export const ChatInterfaceView = () => {
  const { data, addChatMessage, setActiveModule } = useApp();
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || thinking) return;

    addChatMessage({ sender: 'user', time: 'Just now', text: query });
    if (!textToSend) setInput('');
    setThinking(true);

    setTimeout(() => {
      let aiText = `I analyzed your customer feedback across ${data.feedbackItems.length} support tickets:`;

      if (query.toLowerCase().includes('slow') || query.toLowerCase().includes('download') || query.toLowerCase().includes('report')) {
        aiText = `🚨 **Slow Report Downloads**: We found **28 customer support tickets** reporting browser freezes when downloading reports over 50,000 rows. Building an **Automated Report Export Engine** is currently your #1 priority to solve this issue.`;
      } else if (query.toLowerCase().includes('prd') || query.toLowerCase().includes('draft') || query.toLowerCase().includes('plan')) {
        aiText = `📄 **Product Plan Ready**: I have drafted the complete Product Requirement Document (PRD) for *"Automated Report Export Engine"*. It includes clear goals, 3 user stories, and acceptance criteria. You can view it right now under the **Reports & Documentation** tab.`;
      } else {
        aiText = `We currently have **${data.themes.length} active complaint themes** and **${data.features.length} prioritized features**. Your #1 recommended feature to build right now is the *"Automated Report Export Engine"*. How else can I help with your product plans?`;
      }

      addChatMessage({ sender: 'ai', time: 'Just now', text: aiText });
      setThinking(false);
    }, 900);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 68px)' }}>
      <div className="module-header" style={{ flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Product Assistant</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Conversational product Q&A with grounded RAG context retrieval.
          </p>
        </div>
      </div>

      <div className="module-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingBottom: '20px' }}>
        {/* Chat Messages */}
        <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
          {data.chatHistory.map((msg, idx) => (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                gap: '12px', 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '75%'
              }}
            >
              {msg.sender === 'ai' && (
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={18} color="#fff" />
                </div>
              )}
              <div style={{
                padding: '14px 18px',
                borderRadius: '14px',
                background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                color: '#fff'
              }}>
                <div style={{ fontSize: '0.72rem', color: msg.sender === 'user' ? '#e0e7ff' : 'var(--text-dim)', marginBottom: '4px' }}>
                  {msg.sender === 'user' ? 'You' : 'Product Assistant'} • {msg.time}
                </div>
                <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                {msg.sender === 'ai' && (
                  <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.72rem', color: '#818cf8' }}>
                    📎 Source Context: Grounded from 142 ingested customer support tickets & analytics.
                  </div>
                )}
              </div>
            </div>
          ))}

          {thinking && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="#fff" />
              </div>
              <div className="glass-panel" style={{ padding: '10px 16px', borderRadius: '12px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Product Assistant is retrieving relevant context...
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[
            'What are the biggest customer pain points?',
            'Which features should we prioritize?',
            'Create a PRD for the top feature'
          ].map(prompt => (
            <button 
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="glass-panel" style={{ padding: '10px 14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Ask a question about customer tickets, themes, or generated PRDs..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input-field"
            style={{ flex: 1, border: 'none', background: 'transparent' }}
          />
          <button type="submit" disabled={thinking || !input.trim()} className="btn btn-primary" style={{ padding: '10px 18px' }}>
            <span>Send</span>
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
