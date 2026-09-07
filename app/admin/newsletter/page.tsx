'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Send,
  Upload,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  X,
  FileText,
  CheckSquare,
  Square,
  Search,
} from 'lucide-react';

interface Subscriber {
  email: string;
  name: string;
}

export default function AdminNewsletterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [loadingStats, setLoadingStats] = useState(true);
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [showSubscriberPanel, setShowSubscriberPanel] = useState(false);

  // Form State
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('Support Our Mission');
  const [ctaUrl, setCtaUrl] = useState('https://earpi.org/donation');
  const [testEmail, setTestEmail] = useState('');

  // UI state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewTab, setPreviewTab] = useState<'edit' | 'preview'>('edit');
  const [sending, setSending] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function loadSubscribers() {
      try {
        const res = await fetch('/api/admin/newsletter');
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        if (data.subscribers) {
          setSubscribers(data.subscribers);
          // Select all by default
          setSelectedEmails(new Set(data.subscribers.map((s: Subscriber) => s.email)));
        }
      } catch (err) {
        console.error('Failed to load subscriber stats:', err);
      } finally {
        setLoadingStats(false);
      }
    }
    loadSubscribers();
  }, [router]);

  const filteredSubscribers = subscribers.filter((s) => {
    const q = subscriberSearch.toLowerCase();
    return s.email.toLowerCase().includes(q) || (s.name || '').toLowerCase().includes(q);
  });

  const allFiltered = filteredSubscribers.length > 0 && filteredSubscribers.every((s) => selectedEmails.has(s.email));

  const toggleSubscriber = (email: string) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(email)) {
        next.delete(email);
      } else {
        next.add(email);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allFiltered) {
      setSelectedEmails((prev) => {
        const next = new Set(prev);
        filteredSubscribers.forEach((s) => next.delete(s.email));
        return next;
      });
    } else {
      setSelectedEmails((prev) => {
        const next = new Set(prev);
        filteredSubscribers.forEach((s) => next.add(s.email));
        return next;
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'photo');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.url);
      } else {
        setFeedback({ type: 'error', message: `Image upload failed: ${data.error}` });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Image upload failed. Try again.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const insertFormatting = (tag: string) => {
    if (tag === 'p') setBody((prev) => prev + '\n\nNew paragraph content here.');
    if (tag === 'b') setBody((prev) => prev + ' <strong>Bold text</strong> ');
    if (tag === 'link') setBody((prev) => prev + ' <a href="https://earpi.org" style="color:#10b981;text-decoration:underline;">link text</a> ');
    if (tag === 'bullet') setBody((prev) => prev + '\n\u2022 Ground-truth verified milestone');
  };

  const handleSendTest = async () => {
    if (!subject.trim() || !title.trim() || !body.trim()) {
      setFeedback({ type: 'error', message: 'Subject, Headline, and Message Body are required for test preview.' });
      return;
    }
    setSendingTest(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          title,
          bodyHtml: body.replace(/\n/g, '<br/>'),
          imageUrl: imageUrl || undefined,
          ctaText: ctaText || undefined,
          ctaUrl: ctaUrl || undefined,
          isTest: true,
          testEmail: testEmail.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: data.message || 'Test email dispatched successfully!' });
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to dispatch test email.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error sending test email.' });
    } finally {
      setSendingTest(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !title.trim() || !body.trim()) {
      setFeedback({ type: 'error', message: 'Subject, Headline, and Content are required.' });
      return;
    }
    if (selectedEmails.size === 0) {
      setFeedback({ type: 'error', message: 'Please select at least one subscriber to send to.' });
      return;
    }

    if (!window.confirm(`Are you sure you want to broadcast this newsletter to ${selectedEmails.size} selected subscriber${selectedEmails.size === 1 ? '' : 's'}?`)) {
      return;
    }

    setSending(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          title,
          bodyHtml: body.replace(/\n/g, '<br/>'),
          imageUrl: imageUrl || undefined,
          ctaText: ctaText || undefined,
          ctaUrl: ctaUrl || undefined,
          isTest: false,
          selectedEmails: Array.from(selectedEmails),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'success',
          message: `Newsletter broadcast complete! Sent to ${data.sentCount} of ${data.totalTargeted} selected subscribers.`,
        });
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to broadcast newsletter.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error during broadcast.' });
    } finally {
      setSending(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    backgroundColor: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#a7b8b2',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '26px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px', color: '#ffffff' }}>
            Compose &amp; Broadcast Newsletter
          </h1>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#8aa69b' }}>
            Select recipients, compose your message, and send verified field updates to your subscribers.
          </p>
        </div>

        {/* Audience Pill — click to toggle subscriber panel */}
        <button
          type="button"
          onClick={() => setShowSubscriberPanel((v) => !v)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '30px',
            backgroundColor: selectedEmails.size > 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${selectedEmails.size > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: selectedEmails.size > 0 ? '#34d399' : '#fca5a5',
            fontSize: '13.5px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Users size={16} />
          <span>{loadingStats ? 'Loading...' : `${selectedEmails.size} of ${subscribers.length} selected`}</span>
          <span style={{ fontSize: '11px', opacity: 0.7 }}>{showSubscriberPanel ? '\u25b2 Hide' : '\u25bc Manage'}</span>
        </button>
      </div>

      {/* Subscriber Selection Panel */}
      {showSubscriberPanel && (
        <div style={{ backgroundColor: '#0c261e', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', padding: '18px 20px', marginBottom: '22px' }}>
          {/* Panel Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#d1fae5' }}>Recipient Selection</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={toggleSelectAll}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '5px 12px', borderRadius: '6px',
                  backgroundColor: allFiltered ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.07)',
                  border: `1px solid ${allFiltered ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.12)'}`,
                  color: allFiltered ? '#34d399' : '#a7b8b2',
                  fontSize: '12.5px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                {allFiltered ? <CheckSquare size={13} /> : <Square size={13} />}
                {allFiltered ? 'Deselect All' : 'Select All'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedEmails(new Set())}
                style={{
                  padding: '5px 12px', borderRadius: '6px',
                  backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                  color: '#fca5a5', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8aa69b' }} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={subscriberSearch}
              onChange={(e) => setSubscriberSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '32px', padding: '8px 12px 8px 32px', fontSize: '13px' }}
            />
          </div>

          {/* Subscriber List */}
          {loadingStats ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#8aa69b' }}>
              <Loader2 size={18} className="animate-spin" style={{ display: 'inline' }} />
              <span style={{ marginLeft: '8px' }}>Loading subscribers...</span>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <p style={{ color: '#8aa69b', fontSize: '13px', textAlign: 'center', padding: '16px' }}>
              {subscribers.length === 0 ? 'No active subscribers found.' : 'No subscribers match your search.'}
            </p>
          ) : (
            <div style={{ maxHeight: '280px', overflowY: 'auto', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)' }}>
              {filteredSubscribers.map((sub, idx) => {
                const isChecked = selectedEmails.has(sub.email);
                return (
                  <div
                    key={sub.email}
                    onClick={() => toggleSubscriber(sub.email)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 14px', cursor: 'pointer',
                      backgroundColor: isChecked ? 'rgba(16,185,129,0.07)' : idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    {/* Checkbox */}
                    <div style={{
                      width: '17px', height: '17px', borderRadius: '4px', flexShrink: 0,
                      border: `2px solid ${isChecked ? '#10b981' : 'rgba(255,255,255,0.3)'}`,
                      backgroundColor: isChecked ? '#10b981' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isChecked && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#06281e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    {/* Avatar */}
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                      backgroundColor: isChecked ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700,
                      color: isChecked ? '#34d399' : '#8aa69b',
                    }}>
                      {(sub.name || sub.email).charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {sub.name && (
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#e6f4ee', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sub.name}
                        </p>
                      )}
                      <p style={{ margin: 0, fontSize: '12px', color: '#8aa69b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {sub.email}
                      </p>
                    </div>
                    {isChecked && <CheckCircle2 size={15} style={{ color: '#10b981', flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>
          )}

          <p style={{ margin: '10px 0 0', fontSize: '11.5px', color: '#8aa69b', textAlign: 'right' }}>
            {selectedEmails.size} recipient{selectedEmails.size !== 1 ? 's' : ''} selected for broadcast
          </p>
        </div>
      )}

      {/* Feedback Banner */}
      {feedback && (
        <div style={{
          backgroundColor: feedback.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${feedback.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: feedback.type === 'success' ? '#6ee7b7' : '#fca5a5',
          padding: '14px 18px', borderRadius: '8px', marginBottom: '22px', fontSize: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.7 }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Editor & Preview Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        {(['edit', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setPreviewTab(tab)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 18px', borderRadius: '8px', border: 'none',
              backgroundColor: previewTab === tab ? '#10b981' : 'rgba(255,255,255,0.06)',
              color: previewTab === tab ? '#06281e' : '#a7b8b2',
              fontWeight: 700, fontSize: '13.5px', cursor: 'pointer',
            }}
          >
            {tab === 'edit' ? <FileText size={15} /> : <Eye size={15} />}
            <span>{tab === 'edit' ? 'Editor' : 'Live Email Preview'}</span>
          </button>
        ))}
      </div>

      {/* Edit View */}
      {previewTab === 'edit' ? (
        <form onSubmit={handleBroadcast}>
          <div style={{ backgroundColor: '#0c261e', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '24px', marginBottom: '20px' }}>

            {/* Subject */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Email Subject Line *</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Field Report: 5,000 Mangrove Saplings Planted in Yawri Bay" required style={inputStyle} />
            </div>

            {/* Headline */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Headline / Internal Story Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Restoring Coastal Buffers with Yawri Bay Communities" required style={inputStyle} />
            </div>

            {/* Featured Image */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Featured Image (Upload or URL)</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL (e.g. https://... or /assets/img/hero/slider-1.jpg)"
                  style={{ ...inputStyle, flex: 1, minWidth: '240px' }}
                />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '11px 18px', borderRadius: '8px', backgroundColor: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>
                  {uploadingImage ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                  <span>Upload Image</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
              </div>
              {imageUrl && (
                <div style={{ position: 'relative', marginTop: '12px', width: '220px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <img src={imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => setImageUrl('')} style={{ position: 'absolute', top: '6px', right: '6px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.7)', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Formatting Helpers */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11.5px', color: '#8aa69b', fontWeight: 600, textTransform: 'uppercase' }}>Insert:</span>
              {[['p', '+ Paragraph'], ['b', '+ Bold'], ['link', '+ Link'], ['bullet', '+ Bullet Point']].map(([tag, label]) => (
                <button key={tag} type="button" onClick={() => insertFormatting(tag)}
                  style={{ padding: '4px 10px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#d1fae5', fontSize: '12px', cursor: 'pointer' }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Message Body * (HTML or Plain Text with formatting)</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your newsletter message here..." rows={9} required style={{ ...inputStyle, resize: 'vertical', minHeight: '180px', lineHeight: 1.6 }} />
            </div>

            {/* CTA */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Call To Action Button Label</label>
                <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="e.g. Read Full Field Report" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Call To Action Destination URL</label>
                <input type="url" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="e.g. https://earpi.org/projects" style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Send Actions */}
          <div style={{ backgroundColor: '#0c261e', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <input type="email" placeholder="Test email address (e.g. you@gmail.com)" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} style={{ ...inputStyle, width: '260px', padding: '10px 12px', fontSize: '13px' }} />
              <button type="button" onClick={handleSendTest} disabled={sendingTest || sending}
                style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', color: '#d1fae5', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                {sendingTest ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                <span>Send Test Email</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={sending || sendingTest || selectedEmails.size === 0}
              title={selectedEmails.size === 0 ? 'Select at least one subscriber above' : undefined}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '13px 30px',
                backgroundColor: selectedEmails.size === 0 ? '#2d5a45' : '#10b981',
                color: selectedEmails.size === 0 ? '#8aa69b' : '#06281e',
                border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '15px',
                cursor: selectedEmails.size === 0 ? 'not-allowed' : 'pointer',
                boxShadow: selectedEmails.size > 0 ? '0 4px 18px rgba(16,185,129,0.35)' : 'none',
              }}
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              <span>
                {sending ? 'Broadcasting...' : selectedEmails.size === 0 ? 'No Recipients Selected' : `Send to ${selectedEmails.size} Subscriber${selectedEmails.size === 1 ? '' : 's'}`}
              </span>
            </button>
          </div>
        </form>
      ) : (
        /* Live Preview */
        <div style={{ backgroundColor: '#061a14', borderRadius: '14px', border: '1px solid rgba(52,199,89,0.25)', maxWidth: '620px', margin: '0 auto', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
          <div style={{ background: 'linear-gradient(135deg,#061a14 0%,#0c2e22 100%)', padding: '28px 30px', borderBottom: '1px solid rgba(52,199,89,0.18)', textAlign: 'center' }}>
            <h2 style={{ margin: 0, color: '#ffffff', fontSize: '24px', fontWeight: 800, letterSpacing: '1px' }}>EARPI</h2>
            <p style={{ margin: '4px 0 0', color: '#34d399', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600 }}>Earth Regenerative Projects International</p>
          </div>
          <div style={{ padding: '32px 28px', color: '#e6f4ee', backgroundColor: '#0c261e' }}>
            <h1 style={{ color: '#ffffff', fontSize: '22px', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.3 }}>{title || 'Your Newsletter Headline Goes Here'}</h1>
            {imageUrl && (
              <div style={{ marginBottom: '20px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={imageUrl} alt="Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            )}
            <div style={{ fontSize: '14px', lineHeight: 1.75, color: '#d1fae5', whiteSpace: 'pre-wrap', marginBottom: '24px' }}
              dangerouslySetInnerHTML={{ __html: body ? body.replace(/\n/g, '<br/>') : 'This is where your formatted newsletter message will appear...' }} />
            {ctaText && ctaUrl && (
              <div style={{ textAlign: 'center', margin: '28px 0 16px' }}>
                <a href={ctaUrl} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-block', padding: '13px 28px', backgroundColor: '#10b981', color: '#06281e', fontSize: '14.5px', fontWeight: 'bold', textDecoration: 'none', borderRadius: '8px' }}>
                  {ctaText}
                </a>
              </div>
            )}
          </div>
          <div style={{ backgroundColor: '#051410', padding: '22px 28px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', color: '#7b958c', fontSize: '11px', lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 4px', color: '#a7b8b2', fontWeight: 600 }}>USA Non-profit Corporation Registration MA 001751059; EIN: 99-0979318</p>
            <p style={{ margin: '0 0 8px' }}>Headquarters: 32 Wallace Johnson St, Freetown, Sierra Leone</p>
            <p style={{ margin: 0 }}>
              <span style={{ color: '#34d399' }}>Website</span> &bull; <span style={{ color: '#34d399' }}>Projects</span> &bull; <span style={{ color: '#34d399' }}>Donate</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
