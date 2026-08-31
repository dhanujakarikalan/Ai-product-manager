import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  MessageSquare,
  Send,
  Bot,
  Upload,
  Database
} from 'lucide-react';

export const ChatInterfaceView = () => {
  const {
    data,
    addChatMessage,
    setActiveModule
  } = useApp();

  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const hasDataset =
    Number(data.totalFeedbackCount || 0) > 0 ||
    Boolean(data.uploadedFileName);

  // =========================================================
  // TIME
  // =========================================================

  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

  // =========================================================
  // ADD MESSAGE
  // =========================================================

  const addMessage = (sender, text) => {
    addChatMessage({
      id: `chat-${Date.now()}-${Math.random()}`,
      sender,
      text,
      time: getTime()
    });
  };

  // =========================================================
  // HANDLE CHAT
  // =========================================================

  const handleSend = async (quickPrompt = null) => {
    const question =
      (quickPrompt || input || '').trim();

    if (!question || thinking) {
      return;
    }

    // =======================================================
    // NO DATASET
    // =======================================================

    if (!hasDataset) {
      addMessage(
        'user',
        question
      );

      addMessage(
        'ai',
        `I can help with your product feedback, but there is no dataset loaded yet.

Please upload your CSV or Excel feedback file first. Once the data is processed, I can answer questions about:

• Customer pain points
• Sentiment
• Themes
• Feature requests
• Prioritization
• Customer feedback trends
• PRDs
• User stories

Upload your dataset and then ask me your question.`
      );

      setInput('');

      return;
    }

    // =======================================================
    // USER MESSAGE
    // =======================================================

    addMessage(
      'user',
      question
    );

    setInput('');
    setThinking(true);

    // =======================================================
    // CALL FASTAPI
    // =======================================================

    try {
      const response =
        await api.sendChatMessage(
          question
        );

      const answer =
        response?.answer ||
        response?.response ||
        response?.message ||
        response?.result ||
        response?.reply;

      if (!answer) {
        throw new Error(
          'The backend returned an empty response.'
        );
      }

      addMessage(
        'ai',
        answer
      );

    } catch (error) {

      console.error(
        'Product chat error:',
        error
      );

      addMessage(
        'ai',
        `I couldn't process that question right now.

Backend error:
${error.message || 'Unknown error'}

Please make sure:
• FastAPI is running on port 8001
• Your dataset has been uploaded successfully
• The backend has finished processing the dataset`
      );

    } finally {

      setThinking(false);
    }
  };

  // =========================================================
  // RENDER EMPTY DATASET STATE
  // =========================================================

  if (!hasDataset) {
    return (
      <div
        className="animate-fade-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 68px)'
        }}
      >

        <div
          className="module-header"
          style={{
            flexShrink: 0
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700
              }}
            >
              Product Assistant
            </h1>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.88rem',
                marginTop: '4px'
              }}
            >
              Ask questions about your customer feedback
              after uploading a dataset.
            </p>
          </div>
        </div>

        <div
          className="module-body"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px'
          }}
        >

          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '650px',
              padding: '45px',
              textAlign: 'center'
            }}
          >

            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  'rgba(99,102,241,0.12)',
                color:
                  'var(--primary)'
              }}
            >
              <Database size={34} />
            </div>

            <h2
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                marginBottom: '10px'
              }}
            >
              Upload feedback to start
            </h2>

            <p
              style={{
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                maxWidth: '520px',
                margin: '0 auto 24px'
              }}
            >
              Product Assistant uses your uploaded
              customer feedback as its source of truth.
              Upload your CSV or Excel file before asking
              questions.
            </p>

            <button
              onClick={() =>
                setActiveModule('upload')
              }
              className="btn btn-primary"
              style={{
                gap: '8px'
              }}
            >
              <Upload size={16} />
              Upload Feedback Data
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN CHAT
  // =========================================================

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 68px)'
      }}
    >

      {/* HEADER */}

      <div
        className="module-header"
        style={{
          flexShrink: 0
        }}
      >

        <div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700
            }}
          >
            Product Assistant
          </h1>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              marginTop: '4px'
            }}
          >
            Ask questions about your uploaded
            customer feedback.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            color: '#34d399'
          }}
        >
          <Database size={14} />

          {data.totalFeedbackCount} feedback records loaded
        </div>

      </div>

      {/* CHAT BODY */}

      <div
        className="module-body"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          paddingBottom: '20px'
        }}
      >

        <div
          className="glass-panel"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '16px'
          }}
        >

          {/* WELCOME MESSAGE */}

          {data.chatHistory.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                margin: 'auto',
                maxWidth: '600px'
              }}
            >

              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background:
                    'rgba(99,102,241,0.12)',
                  color:
                    'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <MessageSquare size={28} />
              </div>

              <h2
                style={{
                  fontSize: '1.2rem',
                  marginBottom: '8px'
                }}
              >
                Your feedback is ready
              </h2>

              <p
                style={{
                  color: 'var(--text-muted)',
                  lineHeight: 1.6
                }}
              >
                Ask me anything about the uploaded
                customer feedback. I will use the
                processed dataset and backend analysis
                to answer.
              </p>

            </div>
          )}

          {/* MESSAGES */}

          {data.chatHistory.map(
            (msg, idx) => (

              <div
                key={
                  msg.id ||
                  `${msg.sender}-${idx}`
                }
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignSelf:
                    msg.sender === 'user'
                      ? 'flex-end'
                      : 'flex-start',
                  maxWidth: '80%'
                }}
              >

                {msg.sender === 'ai' && (
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background:
                        'linear-gradient(135deg,#2563eb,#7c3aed)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Bot
                      size={18}
                      color="#fff"
                    />
                  </div>
                )}

                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: '14px',
                    background:
                      msg.sender === 'user'
                        ? 'var(--primary)'
                        : 'rgba(255,255,255,0.05)',
                    border:
                      msg.sender === 'user'
                        ? 'none'
                        : '1px solid var(--border-color)',
                    color:
                      'var(--text-main)'
                  }}
                >

                  <div
                    style={{
                      fontSize: '0.72rem',
                      color:
                        msg.sender === 'user'
                          ? '#e0e7ff'
                          : 'var(--text-dim)',
                      marginBottom: '6px'
                    }}
                  >
                    {msg.sender === 'user'
                      ? 'You'
                      : 'Product Assistant'}

                    {' • '}

                    {msg.time}
                  </div>

                  <div
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === 'ai' && (
                    <div
                      style={{
                        marginTop: '10px',
                        paddingTop: '8px',
                        borderTop:
                          '1px solid var(--border-color)',
                        fontSize: '0.7rem',
                        color:
                          'var(--text-dim)'
                      }}
                    >
                      Grounded in your uploaded
                      feedback dataset.
                    </div>
                  )}

                </div>

              </div>

            )
          )}

          {/* THINKING */}

          {thinking && (
            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}
            >

              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background:
                    'linear-gradient(135deg,#2563eb,#7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot
                  size={18}
                  color="#fff"
                />
              </div>

              <div
                className="glass-panel"
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  color: 'var(--text-muted)'
                }}
              >
                Analyzing your feedback...
              </div>

            </div>
          )}

        </div>

        {/* QUICK PROMPTS */}

        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '12px',
            flexWrap: 'wrap'
          }}
        >

          {[
            'What are the biggest customer pain points?',
            'Which features should we prioritize?',
            'What is the overall sentiment?',
            'Summarize the customer feedback'
          ].map(prompt => (

            <button
              key={prompt}
              onClick={() =>
                handleSend(prompt)
              }
              disabled={thinking}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.78rem'
              }}
            >
              {prompt}
            </button>

          ))}

        </div>

        {/* INPUT */}

        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="glass-panel"
          style={{
            padding: '10px 14px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}
        >

          <input
            type="text"
            placeholder="Ask about your customer feedback..."
            value={input}
            onChange={e =>
              setInput(e.target.value)
            }
            className="input-field"
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent'
            }}
          />

          <button
            type="submit"
            disabled={
              thinking ||
              !input.trim()
            }
            className="btn btn-primary"
            style={{
              padding: '10px 18px',
              gap: '6px'
            }}
          >
            <span>Send</span>
            <Send size={15} />
          </button>

        </form>

      </div>

    </div>
  );
};