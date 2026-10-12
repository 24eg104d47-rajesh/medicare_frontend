import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { aiService } from '../../services/aiService';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  AlertTriangle, 
  Pill, 
  RotateCcw, 
  ExternalLink,
  ShieldCheck 
} from 'lucide-react';

const suggestedPrompts = [
  "What OTC medicines help with headache and mild fever?",
  "Can I take Paracetamol with Ibuprofen?",
  "What are the common side effects of Amoxicillin 500mg?",
  "How should Insulin Glargine be stored safely?",
  "What is Metformin used for and what precautions should I follow?"
];

const AiAssistant = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your MediCare AI Pharmacy Assistant. You can ask me questions regarding medicine indications, general dosage guidance, drug interactions, storage conditions, or OTC recommendations.",
      recommendedMedicines: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // If initialQuery is passed via URL query parameter, auto-submit once
  useEffect(() => {
    if (initialQuery && messages.length === 1) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : inputMessage;
    if (!query || !query.trim() || loading) return;

    const userMsg = { role: 'user', content: query.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await aiService.askQuestion({
        message: query.trim(),
        conversationId
      });

      const data = res.data;
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const botMsg = {
        role: 'assistant',
        content: data.reply || data.response || "I have analyzed your query against our pharmaceutical catalog.",
        recommendedMedicines: data.recommendedMedicines || []
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('AI chat error', err);
      const errorMsg = {
        role: 'assistant',
        content: "I apologize, but I encountered an error communicating with the pharmacy intelligence engine. Please try asking again in a moment.",
        recommendedMedicines: []
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConversationId(null);
    setMessages([
      {
        role: 'assistant',
        content: "Conversation cleared. How can I assist you with your health essentials today?",
        recommendedMedicines: []
      }
    ]);
  };

  return (
    <div style={{ padding: '2rem 0 4rem', background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              <Sparkles size={16} /> Grounded Clinical Guidance
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              MediCare AI Pharmacy Assistant
            </h1>
          </div>

          <button
            onClick={handleReset}
            className="btn btn-outline"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem', borderRadius: '10px' }}
          >
            <RotateCcw size={15} /> Reset Chat
          </button>
        </div>

        {/* Medical Disclaimer Banner */}
        <div style={{
          background: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: '16px',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertTriangle size={20} color="#e11d48" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.8rem', color: '#9f1239', lineHeight: '1.4' }}>
            <strong>Medical Disclaimer:</strong> MediCare AI provides informational reference based on our verified pharmaceutical catalogue. It does NOT constitute medical diagnosis or replace personalized doctor advice. Call <strong>112 / 911</strong> in emergencies.
          </div>
        </div>

        {/* Chat Window Card */}
        <div className="card" style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          height: '620px',
          overflow: 'hidden',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Messages Container */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';

              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    gap: '0.75rem',
                    alignItems: 'flex-start'
                  }}
                >
                  {!isUser && (
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 10px rgba(2, 132, 199, 0.2)'
                    }}>
                      <Bot size={20} />
                    </div>
                  )}

                  <div style={{
                    maxWidth: '75%',
                    background: isUser ? '#0284c7' : '#f8fafc',
                    color: isUser ? '#ffffff' : '#0f172a',
                    padding: '1rem 1.25rem',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    border: isUser ? 'none' : '1px solid #e2e8f0',
                    fontSize: '0.92rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.content}

                    {/* Grounded Recommended Medicines Chips */}
                    {msg.recommendedMedicines && msg.recommendedMedicines.length > 0 && (
                      <div style={{
                        marginTop: '1rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                          Verified Catalog Matches:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {msg.recommendedMedicines.map((item, mIdx) => (
                            <Link
                              key={item.id || mIdx}
                              to={`/medicines/${item.slug || item.id}`}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.8rem',
                                color: '#0284c7',
                                textDecoration: 'none',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Pill size={13} /> {item.name} {item.price ? `(₹${Number(item.price).toFixed(2)})` : ''}
                              <ExternalLink size={12} />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '12px',
                      background: '#e2e8f0',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <User size={20} />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: '#e0f2fe',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bot size={20} />
                </div>
                <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <span className="spinner-border spinner-border-sm" role="status" style={{ marginRight: '6px' }} />
                  Analyzing catalog for clinical guidance...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Strip */}
          <div style={{
            padding: '0.65rem 1.25rem',
            background: '#f8fafc',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.78rem',
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '1rem 1.25rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              background: '#ffffff'
            }}
          >
            <input
              type="text"
              placeholder="Ask about a medicine, dosage, interactions, or symptoms..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="form-control"
              style={{
                borderRadius: '12px',
                fontSize: '0.9rem',
                padding: '0.75rem 1rem',
                border: '1px solid #cbd5e1'
              }}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="btn btn-primary"
              style={{
                borderRadius: '12px',
                padding: '0.75rem 1.25rem',
                opacity: (!inputMessage.trim() || loading) ? 0.6 : 1
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
