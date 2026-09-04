'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Leaf, AlertCircle, Sparkles } from 'lucide-react';
import SubscriptionSuccessModal from './SubscriptionSuccessModal';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');

  useEffect(() => {
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
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Client-side validation: basic format
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // 2. Strict Rule: Flag any email that has more than two dots as invalid before pushing to database
    const dotCount = (cleanEmail.match(/\./g) || []).length;
    if (dotCount > 2) {
      setErrorMessage('Invalid email format: emails containing more than two dots are not allowed.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, name, source: 'Newsletter Popup' }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubscribedEmail(cleanEmail);
        setEmail('');
        setName('');
        closePopup();
        setShowSuccessModal(true);
      } else {
        if (data.error === 'DUPLICATE_EMAIL') {
          setErrorMessage('This email is already subscribed to EARPI. Thank you for your continued support!');
        } else if (data.error === 'INVALID_EMAIL_DOTS') {
          setErrorMessage('Invalid email format: emails containing more than two dots are not allowed.');
        } else {
          setErrorMessage(data.response || 'Failed to subscribe. Please try again.');
        }
      }
    } catch {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Success Celebration Popup */}
      <SubscriptionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        email={subscribedEmail}
      />

      {/* Main Newsletter Invite Popup */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 26, 20, 0.8)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.25s ease',
          }}
          onClick={closePopup}
        >
          <div
            style={{
              backgroundColor: '#0c261e',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.15)',
              position: 'relative',
              color: '#ffffff',
              border: '1.5px solid rgba(16, 185, 129, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Graphic Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0d9488 100%)',
                padding: '30px 24px 22px',
                color: '#ffffff',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <button
                onClick={closePopup}
                aria-label="Close popup"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.25)',
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

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#10b981',
                  color: '#06281e',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Leaf size={26} strokeWidth={2.5} />
              </div>

              <h3 style={{ color: '#ffffff', margin: '0 0 6px', fontSize: '21px', fontWeight: 800 }}>
                Join the Climate Movement
              </h3>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#a7f3d0' }}>
                USA Non-profit MA 001751059 • Freetown, Sierra Leone
              </p>
            </div>

            {/* Content Body */}
            <div style={{ padding: '24px 28px' }}>
              <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#c6d8d0', marginBottom: '18px', textAlign: 'center' }}>
                Get quarterly field briefings on mangrove reforestation, community agroforestry, and youth eco-action in West Africa.
              </p>

              <form onSubmit={handleSubscribe}>
                <div style={{ marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Your Name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '13.5px',
                      outline: 'none',
                      color: '#ffffff',
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
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '13.5px',
                      outline: 'none',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {errorMessage && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      marginBottom: '14px',
                      fontSize: '12.5px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid #ef4444',
                      color: '#fca5a5',
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#10b981',
                    color: '#06281e',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  {submitting ? 'Connecting...' : 'Join the Community'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
                <span style={{ fontSize: '12.5px', color: '#8aa69b' }}>Want to take direct action? </span>
                <Link
                  href="/donation"
                  onClick={closePopup}
                  style={{ color: '#10b981', fontWeight: 'bold', fontSize: '12.5px', textDecoration: 'underline' }}
                >
                  Make a Direct Donation
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
