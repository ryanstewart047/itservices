'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, MailOpen, Trash2, Clock, AlertCircle, Reply } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/messages');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setMessages(data.messages || []);
      setLoading(false);
    }
    load();
  }, [router]);

  const handleExpand = async (msg: Message) => {
    if (expanded === msg.id) { setExpanded(null); return; }
    setExpanded(msg.id);
    if (!msg.isRead) {
      await fetch('/api/admin/messages', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: msg.id, isRead: true }) });
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, isRead: true } : m));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    const res = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
    if (res.ok) { setMessages((prev) => prev.filter((m) => m.id !== id)); if (expanded === id) setExpanded(null); }
  };

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px' }}>Contact Inbox</h1>
        <p style={{ margin: 0, fontSize: '13.5px', color: '#8aa69b' }}>
          {unread > 0 ? <span style={{ color: '#f87171', fontWeight: 600 }}>{unread} unread</span> : 'All read'} · {messages.length} total inquiries
        </p>
      </div>

      {loading ? (
        <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', padding: '30px 0' }}><Clock size={18} /> Loading...</div>
      ) : messages.length === 0 ? (
        <div style={{ backgroundColor: '#0c261e', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#8aa69b', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <AlertCircle size={30} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p>No messages received yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                backgroundColor: '#0c261e',
                border: `1px solid ${!msg.isRead ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'border 0.2s',
              }}
            >
              {/* Header Row */}
              <div
                onClick={() => handleExpand(msg)}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px', cursor: 'pointer' }}
              >
                <div style={{ color: msg.isRead ? '#6b8a7d' : '#10b981', flexShrink: 0 }}>
                  {msg.isRead ? <MailOpen size={20} /> : <Mail size={20} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: msg.isRead ? 500 : 700, color: '#ffffff', fontSize: '14px' }}>{msg.name}</span>
                    {!msg.isRead && <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#10b981', backgroundColor: 'rgba(16,185,129,0.15)', padding: '1px 7px', borderRadius: '8px' }}>NEW</span>}
                    <span style={{ fontSize: '12px', color: '#6b8a7d' }}>&lt;{msg.email}&gt;</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#a7b8b2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span style={{ color: '#d1fae5', fontWeight: 500 }}>{msg.subject}</span> — {msg.message.substring(0, 80)}...
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <span style={{ fontSize: '12px', color: '#6b8a7d' }}>{new Date(msg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                    style={{ padding: '5px 7px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.08)', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Expanded Body */}
              {expanded === msg.id && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 20px 20px 54px' }}>
                  <p style={{ margin: '0 0 14px', color: '#d1fae5', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                  {msg.phone && <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#8aa69b' }}>📞 {msg.phone}</p>}
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 18px', backgroundColor: '#10b981', color: '#06281e', borderRadius: '8px', fontWeight: 'bold', fontSize: '13.5px', textDecoration: 'none' }}
                  >
                    <Reply size={15} /> Reply via Email
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
