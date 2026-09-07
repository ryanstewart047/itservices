'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertCircle, Loader2, ArrowRight, Lock } from 'lucide-react';
import SubscriptionSuccessModal from './SubscriptionSuccessModal';

const BG = '#061a14';
const BORDER = 'rgba(255,255,255,0.07)';
const MUTED = '#8aab9e';
const ACCENT = '#10b981';

const navCols = [
  {
    heading: 'Organisation',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Board & Leadership', href: '/team' },
      { label: 'Global Ambassadors', href: '/ambassadors' },
      { label: 'Contact & Partnerships', href: '/contact' },
    ],
  },
  {
    heading: 'Our Work',
    links: [
      { label: 'Climate Projects', href: '/projects' },
      { label: 'Events & Summits', href: '/event' },
      { label: 'Priority 1 — Mangroves', href: '/priority-one' },
      { label: 'Priority 2 — Clean Energy', href: '/priority-two' },
      { label: 'Priority 3 — Agroforestry', href: '/priority-three' },
      { label: 'Priority 4 — Eco-Literacy', href: '/priority-four' },
      { label: 'Priority 5 — Clean Water', href: '/priority-five' },
    ],
  },
];

const socials = [
  { label: 'Facebook', href: 'https://facebook.com/itservicefreetown', icon: 'ri-facebook-fill' },
  { label: 'Twitter', href: 'https://twitter.com/earpsierraleone', icon: 'ri-twitter-fill' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ryan-josiah-stewart-19808a152/', icon: 'ri-linkedin-fill' },
];

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
      setErrorMessage('Emails with more than two dots are not accepted.');
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
          setErrorMessage('This email is already subscribed. Thank you!');
        } else if (data.error === 'INVALID_EMAIL_DOTS') {
          setErrorMessage('Emails with more than two dots are not accepted.');
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

  return (
    <>
      <footer style={{ background: BG, color: '#fff', borderTop: `1px solid ${BORDER}`, fontFamily: 'inherit' }}>
        <style>{`
          .footer-grid-layout {
            max-width: 1240px;
            margin: 0 auto;
            padding: 40px 20px 32px;
            display: grid;
            grid-template-columns: 1fr;
            gap: 36px;
          }
          @media (min-width: 640px) {
            .footer-grid-layout {
              grid-template-columns: repeat(2, 1fr);
              padding: 48px 24px 36px;
              gap: 36px;
            }
          }
          @media (min-width: 1024px) {
            .footer-grid-layout {
              grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
              padding: 60px 28px 48px;
              gap: 40px;
            }
          }
        `}</style>

        {/* ── Main grid ── */}
        <div className="footer-grid-layout">

          {/* Col 1 — Brand */}
          <div>
            <Link href="/" style={{ display: 'inline-block', marginBottom: 20 }}>
              <img src="/assets/img/logo-white.png" alt="EARPI" style={{ height: 48, objectFit: 'contain' }} />
            </Link>
            <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.7, margin: '0 0 18px' }}>
              Earth Regenerative Projects International — advancing blue carbon restoration,
              syntropic agroforestry, and youth climate education across West Africa.
            </p>

            {/* Accreditation badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 6, padding: '5px 10px', marginBottom: 20 }}>
              <ShieldCheck size={13} color={ACCENT} />
              <span style={{ color: ACCENT, fontSize: 11, fontWeight: 700, letterSpacing: '0.03em' }}>USA Non-profit Corporation Registration MA 001751059; EIN: 99-0979318</span>
            </div>

            {/* Socials */}
            <div style={{ display: 'flex', gap: 8 }}>
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                  style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED, textDecoration: 'none', fontSize: 14, transition: 'border-color 0.15s, color 0.15s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = 'rgba(16,185,129,0.5)'; el.style.color = ACCENT; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = BORDER; el.style.color = MUTED; }}
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 & 3 — Nav columns */}
          {navCols.map((col) => (
            <div key={col.heading}>
              <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 18px' }}>{col.heading}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {col.links.map((l) => (
                  <li key={l.href} style={{ marginBottom: 11 }}>
                    <Link href={l.href}
                      style={{ color: MUTED, fontSize: 13, textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#fff')}
                      onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = MUTED)}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Col 4 — Newsletter */}
          <div>
            <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 14px' }}>Field Dispatches</p>
            <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.65, margin: '0 0 18px' }}>
              Quarterly ecological audits and mangrove progress reports direct from Sierra Leone.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`,
                  color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box',
                }}
              />

              {errorMessage && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 7, padding: '7px 10px', fontSize: 12, color: '#fca5a5' }}>
                  <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={subscribing}
                style={{
                  width: '100%', padding: '11px', borderRadius: 8, border: 'none',
                  background: ACCENT, color: '#06281e', fontWeight: 700, fontSize: 13,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                {subscribing ? (
                  <><Loader2 size={14} className="animate-spin" /><span>Subscribing…</span></>
                ) : (
                  <><span>Subscribe to Updates</span><ArrowRight size={14} /></>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: '18px 28px' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ color: MUTED, fontSize: 12 }}>
              © {new Date().getFullYear()} Earth Regenerative Projects International (EARPI). All rights reserved.
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {[
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms of Service', href: '/terms-of-service' },
                { label: 'Contact', href: '/contact' },
              ].map((l) => (
                <Link key={l.href} href={l.href} style={{ color: MUTED, fontSize: 12, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#fff')}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = MUTED)}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/admin"
                aria-label="Staff Access"
                title=""
                style={{
                  color: 'rgba(255, 255, 255, 0.16)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  opacity: 0.28,
                  padding: '4px',
                  transition: 'opacity 0.2s ease, color 0.2s ease',
                  marginLeft: '2px',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = '0.7';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#8aa69b';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = '0.28';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255, 255, 255, 0.16)';
                }}
              >
                <Lock size={10} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>

      </footer>

      <SubscriptionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        email={subscribedEmail}
      />
    </>
  );
}
