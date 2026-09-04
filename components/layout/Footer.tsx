'use client';

import { useState } from 'react';
import Link from 'next/link';
import SubscriptionSuccessModal from './SubscriptionSuccessModal';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    const dotCount = (cleanEmail.match(/\./g) || []).length;
    if (dotCount > 2) {
      setMessage({ text: 'Invalid email: emails with more than two dots are not accepted.', type: 'error' });
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
          setMessage({ text: 'This email is already subscribed to EARPI. Thank you for your support!', type: 'error' });
        } else if (data.error === 'INVALID_EMAIL_DOTS') {
          setMessage({ text: 'Invalid email: emails with more than two dots are not accepted.', type: 'error' });
        } else {
          setMessage({ text: data.response || 'Subscription failed. Please try again.', type: 'error' });
        }
      }
    } catch {
      setMessage({ text: 'Network error. Please try again later.', type: 'error' });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="footer-wrap">
      <div className="container">
        <div className="footer-top pt-100 pb-70">
          <div className="row">
            {/* Column 1: Organization Bio */}
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="footer-widget">
                <Link href="/" className="footer-logo">
                  <img src="/assets/img/logo-white.png" alt="EARPI Logo" style={{ maxHeight: '60px' }} />
                </Link>
                <p className="comp-desc">
                  Earth Regenerative Projects International (EARPI) is committed to restoring degraded ecosystems, building climate resilience, and fostering sustainable livelihoods in Sierra Leone and beyond.
                </p>
                <div style={{ fontSize: '13px', color: '#338F7A', fontWeight: 'bold', marginTop: '10px' }}>
                  USA Non-profit Corporation MA 001751059 • EIN: 99-0979318
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="footer-widget">
                <h3 className="footer-widget-title">Quick Links</h3>
                <ul className="footer-menu list-style">
                  <li>
                    <Link href="/about">About Us</Link>
                  </li>
                  <li>
                    <Link href="/project-one">Our Projects</Link>
                  </li>
                  <li>
                    <Link href="/ambassadors">Ambassadors</Link>
                  </li>
                  <li>
                    <Link href="/team">Leadership Team</Link>
                  </li>
                  <li>
                    <Link href="/blog">News & Updates</Link>
                  </li>
                  <li>
                    <Link href="/donation">Make a Donation</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 3: Priority Areas */}
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer-widget">
                <h3 className="footer-widget-title">Priority Areas</h3>
                <ul className="footer-menu list-style">
                  <li>
                    <Link href="/priority-one">Priority 1: Ecosystem Restoration</Link>
                  </li>
                  <li>
                    <Link href="/priority-two">Priority 2: Clean Energy Access</Link>
                  </li>
                  <li>
                    <Link href="/priority-three">Priority 3: Regenerative Agriculture</Link>
                  </li>
                  <li>
                    <Link href="/priority-four">Priority 4: Climate Education</Link>
                  </li>
                  <li>
                    <Link href="/priority-five">Priority 5: Water Security</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 4: Newsletter Subscription */}
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer-widget">
                <h3 className="footer-widget-title">Newsletter</h3>
                <p className="newsletter-text">
                  Subscribe to receive our latest ecological impact reports and project milestones.
                </p>
                <form onSubmit={handleSubscribe} className="newsletter-form" style={{ marginTop: '15px' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 45px 12px 15px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '25px',
                        background: 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={subscribing}
                      style={{
                        position: 'absolute',
                        right: '5px',
                        top: '5px',
                        bottom: '5px',
                        width: '36px',
                        border: 'none',
                        borderRadius: '50%',
                        background: '#338F7A',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <i className={subscribing ? 'ri-loader-4-line' : 'ri-send-plane-fill'}></i>
                    </button>
                  </div>
                  {message && (
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#fff',
                        backgroundColor: message.type === 'success' ? '#2e7d32' : '#c62828',
                      }}
                    >
                      {message.text}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="copyright-text">
                © {new Date().getFullYear()} EARPI - Earth Regenerative Projects International. All rights reserved.
              </p>
            </div>
            <div className="col-md-6">
              <ul className="footer-bottom-menu list-style text-md-end">
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms-of-service">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>
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
