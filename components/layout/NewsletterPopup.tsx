'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ text: string; success: boolean } | null>(null);

  useEffect(() => {
    // Check if dismissed within the last 7 days
    const dismissedAt = localStorage.getItem('earpi_newsletter_dismissed');
    if (dismissedAt) {
      const daysSinceDismiss = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < 7) {
        return;
      }
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem('earpi_newsletter_dismissed', Date.now().toString());
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus({ text: 'Please enter a valid email address.', success: false });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ text: data.response || 'Thank you for subscribing!', success: true });
        setEmail('');
        setName('');
        setTimeout(() => {
          closePopup();
        }, 2500);
      } else {
        setStatus({ text: data.response || 'Failed to subscribe.', success: false });
      }
    } catch {
      setStatus({ text: 'Network error. Please try again.', success: false });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={closePopup}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '520px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          position: 'relative',
          color: '#333333',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header graphic banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1b4d3e 0%, #338F7A 100%)',
            padding: '28px 24px 20px',
            color: '#ffffff',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <button
            onClick={closePopup}
            aria-label="Close newsletter popup"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            ×
          </button>
          <img
            src="/assets/img/logo-white.png"
            alt="EARPI Logo"
            style={{ height: '45px', marginBottom: '10px' }}
          />
          <h3 style={{ color: '#ffffff', margin: '0 0 6px', fontSize: '22px', fontWeight: 'bold' }}>
            Join the Climate Regeneration Movement
          </h3>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
            USA Non-profit Registration MA 001751059 • EIN: 99-0979318
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px 28px' }}>
          <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#555', marginBottom: '18px', textAlign: 'center' }}>
            Stay updated with firsthand reports on mangrove restoration, clean energy kits, and grassroots youth action in Sierra Leone.
          </p>

          <form onSubmit={handleSubscribe}>
            <div style={{ marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Your Full Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#333',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <input
                type="email"
                placeholder="Your Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#333',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {status && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '14px',
                  fontSize: '13px',
                  backgroundColor: status.success ? '#e8f5e9' : '#ffebee',
                  color: status.success ? '#2e7d32' : '#c62828',
                }}
              >
                {status.text}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#338F7A',
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {submitting ? 'Subscribing...' : 'Subscribe to Updates'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '14px' }}>
            <span style={{ fontSize: '13px', color: '#777' }}>Want to take immediate impact? </span>
            <Link
              href="/donation"
              onClick={closePopup}
              style={{ color: '#338F7A', fontWeight: 'bold', fontSize: '13px', textDecoration: 'underline' }}
            >
              Make a Direct Donation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
