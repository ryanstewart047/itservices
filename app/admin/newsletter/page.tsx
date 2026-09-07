'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Send,
  Upload,
  Image as ImageIcon,
  Link2,
  Users,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X,
  FileText,
} from 'lucide-react';

export default function AdminNewsletterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSubscribersCount, setActiveSubscribersCount] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState(true);

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
        if (data.activeCount !== undefined) {
          setActiveSubscribersCount(data.activeCount);
        }
      } catch (err) {
        console.error('Failed to load subscriber stats:', err);
      } finally {
        setLoadingStats(false);
      }
    }
    loadSubscribers();
  }, [router]);

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
    if (tag === 'bullet') setBody((prev) => prev + '\n• Ground-truth verified milestone');
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

    if (
      !window.confirm(
        `Are you sure you want to broadcast this newsletter to all ${activeSubscribersCount} active subscribers?`
      )
    ) {
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
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'success',
          message: `Newsletter broadcast complete! Successfully sent to ${data.sentCount} out of ${data.totalTargeted} subscribers.`,
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

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    backgroundColor: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#a7b8b2',
    marginBottom: '6px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.4px',
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '26px',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px', color: '#ffffff' }}>
            Compose & Broadcast Newsletter
          </h1>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#8aa69b' }}>
            Send verified field updates, photo stories, and impact bulletins to all registered subscribers.
          </p>
        </div>

        {/* Audience Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '30px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            fontSize: '13.5px',
            fontWeight: 600,
          }}
        >
          <Users size={16} />
          <span>
            {loadingStats ? 'Counting subscribers...' : `${activeSubscribersCount} Active Subscribers`}
          </span>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          style={{
            backgroundColor: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${feedback.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: feedback.type === 'success' ? '#6ee7b7' : '#fca5a5',
            padding: '14px 18px',
            borderRadius: '8px',
            marginBottom: '22px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.7 }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Editor & Preview Mode Switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        <button
          type="button"
          onClick={() => setPreviewTab('edit')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: previewTab === 'edit' ? '#10b981' : 'rgba(255,255,255,0.06)',
            color: previewTab === 'edit' ? '#06281e' : '#a7b8b2',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
          }}
        >
          <FileText size={15} />
          <span>Editor</span>
        </button>
        <button
          type="button"
          onClick={() => setPreviewTab('preview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: previewTab === 'preview' ? '#10b981' : 'rgba(255,255,255,0.06)',
            color: previewTab === 'preview' ? '#06281e' : '#a7b8b2',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
          }}
        >
          <Eye size={15} />
          <span>Live Email Preview</span>
        </button>
      </div>

      {/* Edit View */}
      {previewTab === 'edit' ? (
        <form onSubmit={handleBroadcast}>
          <div
            style={{
              backgroundColor: '#0c261e',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '24px',
              marginBottom: '20px',
            }}
          >
            {/* Subject Line */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Email Subject Line *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Field Report: 5,000 Mangrove Saplings Planted in Yawri Bay 🌱"
                required
                style={inputStyle}
              />
            </div>

            {/* Title / Headline */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Headline / Internal Story Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Restoring Coastal Buffers with Yawri Bay Communities"
                required
                style={inputStyle}
              />
            </div>

            {/* Featured Image (Upload or URL) */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Featured Image (Upload or URL)</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL (e.g. https://... or /assets/img/hero/slider-1.jpg)"
                  style={{ ...inputStyle, flex: 1, minWidth: '240px' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '11px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {uploadingImage ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                  <span>Upload Image</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>

              {imageUrl && (
                <div style={{ position: 'relative', marginTop: '12px', width: '220px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <img src={imageUrl} alt="Newsletter Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Formatting Helpers */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11.5px', color: '#8aa69b', fontWeight: 600, textTransform: 'uppercase' }}>
                Insert:
              </span>
              <button
                type="button"
                onClick={() => insertFormatting('p')}
                style={{ padding: '4px 10px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#d1fae5', fontSize: '12px', cursor: 'pointer' }}
              >
                + Paragraph
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('b')}
                style={{ padding: '4px 10px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#d1fae5', fontSize: '12px', cursor: 'pointer' }}
              >
                + Bold
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('link')}
                style={{ padding: '4px 10px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#d1fae5', fontSize: '12px', cursor: 'pointer' }}
              >
                + Link
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('bullet')}
                style={{ padding: '4px 10px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#d1fae5', fontSize: '12px', cursor: 'pointer' }}
              >
                + Bullet Point
              </button>
            </div>

            {/* Content Body */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Message Body * (HTML or Plain Text with formatting)</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your newsletter message here... Share project progress, community stories, upcoming volunteer sessions, or donation milestones."
                rows={9}
                required
                style={{ ...inputStyle, resize: 'vertical', minHeight: '180px', lineHeight: 1.6 }}
              />
            </div>

            {/* Call to Action Button Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '10px' }}>
              <div>
                <label style={labelStyle}>Call To Action Button Label</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Read Full Field Report"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Call To Action Destination URL</label>
                <input
                  type="url"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="e.g. https://earpi.org/projects"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Test & Broadcast Actions */}
          <div
            style={{
              backgroundColor: '#0c261e',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            {/* Test Send Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="Test email address (e.g. you@gmail.com)"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                style={{ ...inputStyle, width: '260px', padding: '10px 12px', fontSize: '13px' }}
              />
              <button
                type="button"
                onClick={handleSendTest}
                disabled={sendingTest || sending}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#d1fae5',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {sendingTest ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                <span>Send Test Email</span>
              </button>
            </div>

            {/* Broadcast Button */}
            <button
              type="submit"
              disabled={sending || sendingTest}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 30px',
                backgroundColor: '#10b981',
                color: '#06281e',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(16, 185, 129, 0.35)',
              }}
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              <span>{sending ? 'Broadcasting Email...' : `Blast to All ${activeSubscribersCount} Subscribers`}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Live Preview Card */
        <div
          style={{
            backgroundColor: '#061a14',
            borderRadius: '14px',
            border: '1px solid rgba(52, 199, 89, 0.25)',
            maxWidth: '620px',
            margin: '0 auto',
            overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
          }}
        >
          {/* Email Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #061a14 0%, #0c2e22 100%)',
              padding: '28px 30px',
              borderBottom: '1px solid rgba(52, 199, 89, 0.18)',
              textAlign: 'center',
            }}
          >
            <h2 style={{ margin: 0, color: '#ffffff', fontSize: '24px', fontWeight: 800, letterSpacing: '1px' }}>
              EARPI
            </h2>
            <p style={{ margin: '4px 0 0', color: '#34d399', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600 }}>
              Earth Regenerative Projects International
            </p>
          </div>

          {/* Email Body Preview */}
          <div style={{ padding: '32px 28px', color: '#e6f4ee', backgroundColor: '#0c261e' }}>
            <h1 style={{ color: '#ffffff', fontSize: '22px', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.3 }}>
              {title || 'Your Newsletter Headline Goes Here'}
            </h1>

            {imageUrl && (
              <div style={{ marginBottom: '20px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={imageUrl} alt="Newsletter Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            )}

            <div
              style={{ fontSize: '14px', lineHeight: 1.75, color: '#d1fae5', whiteSpace: 'pre-wrap', marginBottom: '24px' }}
              dangerouslySetInnerHTML={{
                __html: body ? body.replace(/\n/g, '<br/>') : 'This is where your formatted newsletter message will appear to all subscribers...',
              }}
            />

            {ctaText && ctaUrl && (
              <div style={{ textAlign: 'center', margin: '28px 0 16px' }}>
                <a
                  href={ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '13px 28px',
                    backgroundColor: '#10b981',
                    color: '#06281e',
                    fontSize: '14.5px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)',
                  }}
                >
                  {ctaText}
                </a>
              </div>
            )}
          </div>

          {/* Email Footer Preview */}
          <div
            style={{
              backgroundColor: '#051410',
              padding: '22px 28px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'center',
              color: '#7b958c',
              fontSize: '11px',
              lineHeight: 1.6,
            }}
          >
            <p style={{ margin: '0 0 4px', color: '#a7b8b2', fontWeight: 600 }}>
              USA Non-profit Corporation Registration MA 001751059; EIN: 99-0979318
            </p>
            <p style={{ margin: '0 0 8px' }}>
              Headquarters: 32 Wallace Johnson St, Freetown, Sierra Leone
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ color: '#34d399' }}>Website</span> • <span style={{ color: '#34d399' }}>Projects</span> • <span style={{ color: '#34d399' }}>Donate</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
