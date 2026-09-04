'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquareText, X, Send, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! 🌱 I'm the EARPI Climate AI Assistant. How can I help you today? Feel free to ask about our projects in Sierra Leone, our 5 priority areas, how to donate, or ways to partner with us!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    '🌱 5 Priority Areas',
    '💚 How to Donate',
    '🇸🇱 Sierra Leone Projects',
    '🤝 How to Volunteer',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || loading) return;

    const userMessage: Message = { role: 'user', content: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Thank you for your question! EARPI is actively restoring coastal mangroves, promoting agroforestry, and empowering youth in Sierra Leone. Please feel free to email official@earpi.org for specific questions!',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I encountered a brief connection issue. Please feel free to reach out directly to us at official@earpi.org or visit our Contact page!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open EARPI AI Climate Assistant"
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 6px 22px rgba(16, 185, 129, 0.45)',
          cursor: 'pointer',
          zIndex: 995,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
        }}
      >
        {isOpen ? (
          <X size={26} strokeWidth={2.4} />
        ) : (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquareText size={25} strokeWidth={2.2} />
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#34d399',
                border: '2px solid #059669',
                boxShadow: '0 0 6px rgba(52, 211, 153, 0.9)',
              }}
            ></span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '25px',
            width: '380px',
            maxWidth: 'calc(100vw - 40px)',
            height: '520px',
            maxHeight: 'calc(100vh - 120px)',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 996,
            border: '1px solid #eaeaea',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #061a14 0%, #0d3829 100%)',
              padding: '14px 18px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={18} color="#34d399" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#fff', fontWeight: 'bold' }}>
                  EARPI Climate AI
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', opacity: 0.9 }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#34d399',
                    }}
                  ></span>
                  Online • Sierra Leone &amp; Global
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              backgroundColor: '#f9fbfb',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '10px 14px',
                    borderRadius:
                      msg.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    backgroundColor: msg.role === 'user' ? '#338F7A' : '#ffffff',
                    color: msg.role === 'user' ? '#ffffff' : '#222222',
                    fontSize: '13.5px',
                    lineHeight: '1.45',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: '14px 14px 14px 2px',
                    backgroundColor: '#ffffff',
                    color: '#777',
                    fontSize: '12px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
                  }}
                >
                  🌱 EARPI Assistant is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div
            style={{
              padding: '6px 12px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: '1px solid #338F7A',
                  background: 'rgba(51, 143, 122, 0.08)',
                  color: '#338F7A',
                  fontSize: '11px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #eaeaea',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about EARPI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                fontSize: '13px',
                outline: 'none',
                color: '#333',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              aria-label="Send Message"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: loading || !input.trim() ? 0.6 : 1,
                transition: 'background-color 0.2s',
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
