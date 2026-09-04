'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, Mail, ArrowRight, ShieldCheck, Heart, AlertCircle, Loader2 } from 'lucide-react';
import SubscriptionSuccessModal from './SubscriptionSuccessModal';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const dotCount = (cleanEmail.match(/\./g) || []).length;
    if (dotCount > 2) {
      setErrorMessage('Invalid email: emails containing more than two dots are not accepted.');
      return;
    }

    setSubscribing(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, source: 'Footer Form' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribedEmail(cleanEmail);
        setEmail('');
        setShowSuccessModal(true);
      } else {
        if (data.error === 'DUPLICATE_EMAIL') {
          setErrorMessage('This email is already subscribed to EARPI. Thank you for your support!');
        } else if (data.error === 'INVALID_EMAIL_DOTS') {
          setErrorMessage('Invalid email: emails containing more than two dots are not accepted.');
        } else {
          setErrorMessage(data.response || 'Subscription failed. Please try again.');
        }
      }
    } catch {
      setErrorMessage('Network error. Please try again later.');
    } finally {
      setSubscribing(false);
    }
  };

  const linkStyle = {
    color: '#a7b8b2',
    textDecoration: 'none',
    fontSize: '13.5px',
    transition: 'color 0.15s ease',
    display: 'inline-block',
    marginBottom: '10px',
  };

  return (
    <footer
      style={{
        backgroundColor: '#061a14',
        color: '#ffffff',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        fontFamily: 'inherit',
      }}
    >
      {/* Top Main Footer */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '70px 24px 40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
          }}
        >
          {/* Column 1: Organization Bio */}
          <div>
            <Link href="/" style={{ display: 'inline-block', marginBottom: '18px' }}>
              <img
                src="/assets/img/logo-white.png"
                alt="EARPI Logo"
                style={{ height: '52px', objectFit: 'contain' }}
              />
            </Link>

            <p style={{ color: '#a7b8b2', fontSize: '13.5px', lineHeight: 1.65, margin: '0 0 16px' }}>
              Earth Regenerative Projects International is committed to blue carbon coastal mangrove
              restoration, syntropic agroforestry, and grassroots youth climate education across Sierra Leone.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#34d399',
                fontSize: '11.5px',
                fontWeight: 600,
                marginBottom: '18px',
              }}
            >
              <ShieldCheck size={14} />
              <span>USA 501(c)(3) MA 001751059 • EIN: 99-0979318</span>
            </div>

            {/* Social Profile Links */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href="https://facebook.com/itservicefreetown"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a7b8b2',
                  textDecoration: 'none',
                }}
              >
                <i className="ri-facebook-fill"></i>
              </a>
              <a
                href="https://twitter.com/earpsierraleone"
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter / X"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a7b8b2',
                  textDecoration: 'none',
                }}
              >
                <i className="ri-twitter-fill"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/ryan-josiah-stewart-19808a152/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a7b8b2',
                  textDecoration: 'none',
                }}
              >
                <i className="ri-linkedin-fill"></i>
              </a>
              <a
                href="https://www.tiktok.com/@itservicesfreetown"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a7b8b2',
                  textDecoration: 'none',
                }}
              >
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '18px',
                letterSpacing: '0.3px',
              }}
            >
              Explore &amp; Engage
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>
                <Link href="/" style={linkStyle}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" style={linkStyle}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/projects" style={linkStyle}>
                  Climate Projects &amp; Tracking
                </Link>
              </li>
              <li>
                <Link href="/team" style={linkStyle}>
                  Board &amp; Leadership
                </Link>
              </li>
              <li>
                <Link href="/ambassadors" style={linkStyle}>
                  Global Ambassadors
                </Link>
              </li>
              <li>
                <Link href="/event" style={linkStyle}>
                  Events &amp; Summits
                </Link>
              </li>
              <li>
                <Link href="/contact" style={linkStyle}>
                  Contact &amp; Partnerships
                </Link>
              </li>
              <li>
                <Link href="/donation" style={{ ...linkStyle, color: '#10b981', fontWeight: 600 }}>
                  💚 Support / Donate
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Strategic Priorities */}
          <div>
            <h4
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '18px',
                letterSpacing: '0.3px',
              }}
            >
              Priority Pillars
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>
                <Link href="/priority-one" style={linkStyle}>
                  Priority 1: Mangrove &amp; Coastlines
                </Link>
              </li>
              <li>
                <Link href="/priority-two" style={linkStyle}>
                  Priority 2: Clean Energy &amp; Eco-Stoves
                </Link>
              </li>
              <li>
                <Link href="/priority-three" style={linkStyle}>
                  Priority 3: Regenerative Agroforestry
                </Link>
              </li>
              <li>
                <Link href="/priority-four" style={linkStyle}>
                  Priority 4: Youth Climate Eco-Literacy
                </Link>
              </li>
              <li>
                <Link href="/priority-five" style={linkStyle}>
                  Priority 5: Solar Clean Water
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '18px',
                letterSpacing: '0.3px',
              }}
            >
              Field Dispatches
            </h4>
            <p style={{ color: '#a7b8b2', fontSize: '13px', lineHeight: 1.6, margin: '0 0 16px' }}>
              Subscribe to receive verified quarterly ecological audits and mangrove progress reports directly from Sierra Leone.
            </p>

            <form onSubmit={handleSubscribe}>
              <div style={{ position: 'relative', marginBottom: '10px' }}>
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {errorMessage && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: '#fca5a5',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    marginBottom: '10px',
                  }}
                >
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={subscribing}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#10b981',
                  color: '#06281e',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'background 0.2s',
                }}
              >
                {subscribing ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
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
          </div>
        </div>
      </div>

      {/* Bottom Footer Row */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          backgroundColor: '#061a14',
          padding: '22px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            fontSize: '12.5px',
            color: '#7b958c',
          }}
        >
          <div>
            © {new Date().getFullYear()} Earth Regenerative Projects International (EARPI). All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <Link href="/privacy-policy" style={{ color: '#7b958c', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-of-service" style={{ color: '#7b958c', textDecoration: 'none' }}>
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/contact" style={{ color: '#7b958c', textDecoration: 'none' }}>
              Contact
            </Link>
            <span>•</span>
            <Link href="/admin" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      <SubscriptionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        email={subscribedEmail}
      />
    </footer>
  );
}
