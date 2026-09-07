'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Leaf, AlertCircle, ArrowRight, Loader2, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import SubscriptionSuccessModal from './SubscriptionSuccessModal';

const SIX_HOURS_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');

  useEffect(() => {
    // Clear old 7-day legacy key so users are no longer blocked for a week
    try {
      localStorage.removeItem('earpi_newsletter_dismissed');
    } catch {}

    // Check 6-hour dismissal window
    try {
      const dismissedAt = localStorage.getItem('earpi_newsletter_dismissed_at');
      if (dismissedAt) {
        const elapsed = Date.now() - parseInt(dismissedAt, 10);
        if (elapsed < SIX_HOURS_MS) {
          return; // Suppressed until 6 hours have passed
        }
      }
    } catch {}

    // Trigger popup after a friendly 3-second delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    try {
      localStorage.setItem('earpi_newsletter_dismissed_at', Date.now().toString());
    } catch {}
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Format validation
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // 2. Strict Rule: Flag any email that has more than two dots
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
        body: JSON.stringify({ email: cleanEmail, name: name.trim() || undefined, source: 'Newsletter Split Popup' }),
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
          setErrorMessage('This email is already subscribed to EARPI. Thank you for your support!');
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

      {/* Main Split-Screen Newsletter Popup */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(4, 18, 14, 0.82)',
            backdropFilter: 'blur(7px)',
            WebkitBackdropFilter: 'blur(7px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 0.25s ease',
          }}
          onClick={closePopup}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.97); }
              to { opacity: 1; transform: scale(1); }
            }
            .newsletter-split-modal {
              display: grid;
              grid-template-columns: 1fr;
              max-width: 440px;
              width: 100%;
              background-color: #0c261e;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(16, 185, 129, 0.2);
              border: 1px solid rgba(16, 185, 129, 0.35);
              position: relative;
            }
            @media (min-width: 768px) {
              .newsletter-split-modal {
                grid-template-columns: 310px 1fr;
                max-width: 740px;
              }
            }
            .newsletter-image-side {
              position: relative;
              min-height: 180px;
              background-color: #061a14;
              overflow: hidden;
            }
            @media (min-width: 768px) {
              .newsletter-image-side {
                min-height: 100%;
              }
            }
          `}</style>

          <div
            className="newsletter-split-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── LEFT SIDE: High Quality Real Field Image ── */}
            <div className="newsletter-image-side">
              <img
                src="/assets/img/hero/slider-1.jpg"
                alt="EARPI Mangrove Field Restoration"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 40%',
                  display: 'block',
                }}
              />

              {/* Gradient Vignette over image */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(12, 38, 30, 0.95) 0%, rgba(12, 38, 30, 0.4) 50%, rgba(6, 26, 20, 0.2) 100%)',
                }}
              />

              {/* Image Badge & Impact Caption */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '18px',
                  left: '18px',
                  right: '18px',
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    backgroundColor: 'rgba(6, 26, 20, 0.85)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '20px',
                    color: '#34d399',
                    fontSize: '11px',
                    fontWeight: 700,
                    marginBottom: '8px',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <Leaf size={12} />
                  <span>Verified Field Updates</span>
                </div>
                <h4
                  style={{
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 800,
                    margin: 0,
                    lineHeight: 1.3,
                    textShadow: '0 2px 6px rgba(0,0,0,0.7)',
                  }}
                >
                  Mangrove Restoration &amp; Blue Carbon
                </h4>
                <p
                  style={{
                    color: '#a7f3d0',
                    fontSize: '11.5px',
                    margin: '3px 0 0',
                    opacity: 0.9,
                  }}
                >
                  Yawri Bay &amp; Sherbro Island · Sierra Leone
                </p>
              </div>
            </div>

            {/* ── RIGHT SIDE: Text, Email Input & Subscribe Button ── */}
            <div
              style={{
                padding: 'clamp(24px, 4vw, 32px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={closePopup}
                aria-label="Close newsletter modal"
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#e6f4ee',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  zIndex: 10,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.color = '#fca5a5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = '#e6f4ee';
                }}
              >
                <X size={16} />
              </button>

              {/* Tag / Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#34d399',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  marginBottom: '8px',
                }}
              >
                <ShieldCheck size={14} />
                <span>EARPI Field Dispatch</span>
              </div>

              {/* Headline */}
              <h3
                style={{
                  color: '#ffffff',
                  fontSize: 'clamp(20px, 3.5vw, 24px)',
                  fontWeight: 900,
                  margin: '0 0 8px',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                }}
              >
                Join Our Climate Movement
              </h3>

              <p
                style={{
                  color: '#a7b8b2',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  margin: '0 0 20px',
                }}
              >
                Receive quarterly briefings on coastal mangrove reforestation, blue carbon data, and grassroots ecological action.
              </p>

              {/* Form */}
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    border: '1.5px solid rgba(16, 185, 129, 0.4)',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)')}
                />

                {errorMessage && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      color: '#fca5a5',
                    }}
                  >
                    <AlertCircle size={15} style={{ flexShrink: 0 }} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '13px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#10b981',
                    color: '#06281e',
                    fontWeight: 800,
                    fontSize: '14.5px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe to Updates</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              {/* Sub-footer Note */}
              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '11px', color: '#6b8a7d' }}>
                  No spam. Re-prompts after 6 hours if dismissed.
                </span>
                <Link
                  href="/donation"
                  onClick={closePopup}
                  style={{
                    fontSize: '11.5px',
                    color: '#34d399',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Support with a Donation →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
