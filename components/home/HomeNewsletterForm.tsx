'use client';

import { useState } from 'react';
import { ArrowRight, AlertCircle, Mail, Loader2 } from 'lucide-react';
import SubscriptionSuccessModal from '@/components/layout/SubscriptionSuccessModal';

export default function HomeNewsletterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Basic validation
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // 2. Strict rule: emails with more than two dots are flagged as invalid
    const dotCount = (cleanEmail.match(/\./g) || []).length;
    if (dotCount > 2) {
      setErrorMessage('Invalid email format: emails containing more than two dots are not accepted.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, name, source: 'Home Banner' }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubscribedEmail(cleanEmail);
        setEmail('');
        setName('');
        setShowSuccessModal(true);
      } else {
        if (data.error === 'DUPLICATE_EMAIL') {
          setErrorMessage('This email is already registered with EARPI. Thank you for your ongoing support!');
        } else if (data.error === 'INVALID_EMAIL_DOTS') {
          setErrorMessage('Invalid email format: emails containing more than two dots are not accepted.');
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
      <SubscriptionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        email={subscribedEmail}
      />

      <form onSubmit={handleSubmit} style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            padding: '8px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div style={{ flex: '1 1 200px', position: 'relative' }}>
            <Mail
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8aa69b',
              }}
            />
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '12px 24px',
              backgroundColor: '#10b981',
              color: '#06281e',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Joining...</span>
              </>
            ) : (
              <>
                <span>Get Field Reports</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '12px',
              fontSize: '12.5px',
              color: '#fca5a5',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>
    </>
  );
}
