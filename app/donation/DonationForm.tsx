'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Heart, CheckCircle2, AlertCircle, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// ---------------------------------------------------------------------------
// Stripe publishable key — set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in Vercel
// ---------------------------------------------------------------------------
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

const PROJECTS = [
  'General Ecological Fund (Highest Need)',
  'Coastal Mangrove Restoration (Sierra Leone)',
  'Clean Energy Microgrids & Eco-Cookstoves',
  'Syntropic Agroforestry & Food Forests',
  'Youth Climate Eco-Literacy Campaign',
  'Solar-Powered Clean Water Wells',
];

// ---------------------------------------------------------------------------
// Shared field styles
// ---------------------------------------------------------------------------
const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.05)',
  color: '#e2f5ef',
  fontSize: '14.5px',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#a7f3d0',
  marginBottom: '6px',
};

// ---------------------------------------------------------------------------
// Success screen
// ---------------------------------------------------------------------------
function SuccessCard({
  name,
  amount,
  frequency,
  project,
  onReset,
}: {
  name: string;
  amount: number;
  frequency: string;
  project: string;
  onReset: () => void;
}) {
  return (
    <div
      style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '48px 36px',
        borderRadius: 18,
        background: 'linear-gradient(135deg,#0d2b22,#0f3826)',
        border: '1px solid rgba(52,211,153,0.2)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#10b981,#059669)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}
      >
        <CheckCircle2 size={36} color="#fff" />
      </div>

      <h2 style={{ color: '#34d399', fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>
        Thank you, {name}!
      </h2>
      <p style={{ color: '#a7b8b2', fontSize: '15px', margin: '0 0 24px' }}>
        Your {frequency === 'monthly' ? 'monthly' : ''} gift of{' '}
        <strong style={{ color: '#d1fae5' }}>${amount.toLocaleString()}</strong> to{' '}
        <em style={{ color: '#d1fae5' }}>{project}</em> has been processed. 🌿
      </p>

      <div
        style={{
          background: 'rgba(52,211,153,0.06)',
          borderRadius: 10,
          padding: '16px 20px',
          marginBottom: '28px',
          textAlign: 'left',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <p style={{ margin: '0 0 6px', color: '#34d399', fontSize: '13px', fontWeight: 700 }}>
          Receipt &amp; Tax Acknowledgment Dispatched
        </p>
        <p style={{ margin: 0, color: '#a7b8b2', fontSize: '13px', lineHeight: 1.5 }}>
          A confirmation receipt has been sent to your email. EARPI is a USA 501(c)(3) compliant
          non-profit (EIN 99-0979318).
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={onReset}
          style={{
            padding: '12px 24px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent',
            color: '#a7f3d0',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Make Another Gift
        </button>
        <Link
          href="/"
          style={{
            padding: '12px 28px',
            borderRadius: 10,
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.3)',
            color: '#34d399',
            fontWeight: 700,
            fontSize: '14px',
            textDecoration: 'none',
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// "Donations Coming Soon" interstitial modal
// ---------------------------------------------------------------------------
function DonationComingSoonModal({ onClose }: { onClose: () => void }) {
  // Close on Escape key
  if (typeof window !== 'undefined') {
    // We use an effect in the parent; this is just for the backdrop click
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3,14,10,0.85)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 9998,
          animation: 'fadeInBackdrop 0.25s ease',
        }}
      />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Donation portal coming soon"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 9999,
          width: '90%',
          maxWidth: 480,
          borderRadius: 20,
          background: 'linear-gradient(145deg,#061a14 0%,#0c2e22 60%,#0a2419 100%)',
          border: '1px solid rgba(16,185,129,0.28)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(52,211,153,0.08)',
          overflow: 'hidden',
          animation: 'slideUpModal 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Green accent top bar */}
        <div
          style={{
            height: 4,
            background: 'linear-gradient(90deg,#10b981,#059669,#34d399)',
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#8aa69b',
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* Body */}
        <div style={{ padding: '36px 32px 32px' }}>
          {/* Icon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: 28,
            }}
          >
            🌱
          </div>

          {/* Headline */}
          <h2
            style={{
              margin: '0 0 12px',
              color: '#ffffff',
              fontSize: '22px',
              fontWeight: 800,
              textAlign: 'center',
              lineHeight: 1.3,
            }}
          >
            Thank You for Your Generosity!
          </h2>

          {/* Subtext */}
          <p
            style={{
              margin: '0 0 20px',
              color: '#a7c9bc',
              fontSize: '14.5px',
              lineHeight: 1.75,
              textAlign: 'center',
            }}
          >
            We are deeply grateful for your willingness to support EARPI&apos;s ecological
            restoration work. Our online donation portal is currently being set up and will
            be available very soon.
          </p>

          {/* Highlighted notice */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 12,
              background: 'rgba(16,185,129,0.07)',
              border: '1px solid rgba(16,185,129,0.2)',
              marginBottom: 24,
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, color: '#34d399', fontWeight: 700, fontSize: '13px' }}>
              🕐 &nbsp;Please check back soon
            </p>
            <p style={{ margin: '6px 0 0', color: '#8aa69b', fontSize: '12.5px', lineHeight: 1.6 }}>
              In the meantime, you are welcome to reach out to us directly — every
              contribution, no matter the size, plants seeds for a regenerative future.
            </p>
          </div>

          {/* Contact email button */}
          <a
            href="mailto:official@earpi.org?subject=Donation%20Inquiry"
            style={{
              display: 'block',
              width: '100%',
              padding: '14px 20px',
              borderRadius: 12,
              background: 'linear-gradient(135deg,#10b981,#059669)',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 700,
              textDecoration: 'none',
              textAlign: 'center',
              boxSizing: 'border-box',
              boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
              marginBottom: 12,
            }}
          >
            ✉️ &nbsp;Contact Us to Donate
          </a>

          {/* Dismiss */}
          <button
            onClick={onClose}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px',
              borderRadius: 10,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#8aa69b',
              fontSize: '13.5px',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            Got it, I'll check back later
          </button>
        </div>

        {/* Footer blurb */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '12px 24px',
            textAlign: 'center',
            color: '#557467',
            fontSize: '11px',
            lineHeight: 1.5,
          }}
        >
          USA Non-profit Corporation Registration MA 001751059 • EIN: 99-0979318
        </div>
      </div>

      <style>{`
        @keyframes fadeInBackdrop { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpModal {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 20px)); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </>
  );
}



// ---------------------------------------------------------------------------
// Inner checkout form (rendered inside <Elements> so hooks are available)
// ---------------------------------------------------------------------------
function CheckoutForm({
  donorName,
  donorEmail,
  notes,
  amount,
  frequency,
  project,
  onSuccess,
}: {
  donorName: string;
  donorEmail: string;
  notes: string;
  amount: number;
  frequency: 'one-time' | 'monthly';
  project: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setSubmitting(true);

    try {
      // Validate & submit the PaymentElement first
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Please check your card details.');
        setSubmitting(false);
        return;
      }

      // Confirm payment — Stripe will redirect back on 3DS flows
      const returnUrl = `${window.location.origin}/donation?success=1`;
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: returnUrl },
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed. Please try again.');
        setSubmitting(false);
        return;
      }

      // Payment succeeded — now record it in DB and send emails
      await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName,
          donorEmail,
          amount,
          currency: 'USD',
          frequency,
          projectName: project,
          paymentMethod: 'Stripe',
          notes,
        }),
      });

      onSuccess();
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePay}>
      {/* Stripe Payment Element */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          <Lock size={12} style={{ marginRight: 4 }} />
          Card &amp; Payment Details
        </label>
        <div
          style={{
            padding: '14px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          <PaymentElement
            options={{
              layout: 'tabs',
              fields: { billingDetails: { email: 'never' } },
            }}
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            borderRadius: 8,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5',
            fontSize: '13.5px',
            marginBottom: '16px',
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !stripe || !elements}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 12,
          border: 'none',
          background:
            submitting || !stripe
              ? 'rgba(16,185,129,0.4)'
              : 'linear-gradient(135deg,#10b981,#059669)',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 700,
          cursor: submitting || !stripe ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'opacity 0.2s',
        }}
      >
        {submitting ? (
          <>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            Processing payment…
          </>
        ) : (
          <>
            <Heart size={18} />
            Complete Donation
          </>
        )}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Main DonationForm — multi-step: details → payment
// ---------------------------------------------------------------------------
export default function DonationForm() {
  const [amount, setAmount] = useState<number | string>(100);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [project, setProject] = useState(PROJECTS[0]);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Step: 'details' | 'payment'
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [successData, setSuccessData] = useState<{
    name: string;
    amount: number;
    frequency: string;
    project: string;
  } | null>(null);

  // "Coming Soon" interstitial — shown whenever a user tries to donate
  const [showComingSoon, setShowComingSoon] = useState(false);

  const finalAmount = customAmount ? Number(customAmount) : Number(amount);

  // Intercept donation attempts — show "Coming Soon" modal instead of proceeding
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowComingSoon(true);
  };

  const handleReset = () => {
    setSuccessData(null);
    setStep('details');
    setClientSecret(null);
    setDonorName('');
    setDonorEmail('');
    setNotes('');
    setCustomAmount('');
    setAmount(100);
  };


  // ---------------------------------------------------------------------------
  // Success screen
  // ---------------------------------------------------------------------------
  if (successData) {
    return (
      <SuccessCard
        name={successData.name}
        amount={successData.amount}
        frequency={successData.frequency}
        project={successData.project}
        onReset={handleReset}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // No Stripe key configured — still show the donation form but popup will intercept
  // ---------------------------------------------------------------------------

  const cardStyle: React.CSSProperties = {
    maxWidth: 680,
    margin: '0 auto',
    borderRadius: 20,
    background: 'linear-gradient(135deg,#0d2b22,#0f3826)',
    border: '1px solid rgba(255,255,255,0.07)',
    overflow: 'hidden',
  };

  // ---------------------------------------------------------------------------
  // Step 1 — Donation details
  // ---------------------------------------------------------------------------
  if (step === 'details') {
    return (
      <>
        {/* "Coming Soon" modal overlay — triggered by any donate attempt */}
        {showComingSoon && (
          <DonationComingSoonModal onClose={() => setShowComingSoon(false)} />
        )}
        <div style={cardStyle}>
        {/* Card header */}
        <div
          style={{
            padding: '24px 32px 20px',
            background: 'linear-gradient(135deg,#064e3b,#065f46)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Heart size={20} color="#34d399" />
            <h2 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: 800 }}>
              Make a Donation
            </h2>
          </div>
          <p style={{ margin: 0, color: '#a7f3d0', fontSize: '13px' }}>
            Support EARPI's climate &amp; ecological work in West Africa
          </p>
        </div>

        <form onSubmit={handleDetailsSubmit} style={{ padding: '28px 32px 32px' }}>
          {/* Frequency toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: '24px' }}>
            {(['one-time', 'monthly'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 10,
                  border: frequency === f ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.12)',
                  background: frequency === f ? 'rgba(16,185,129,0.15)' : 'transparent',
                  color: frequency === f ? '#34d399' : '#8aab9d',
                  fontWeight: frequency === f ? 700 : 400,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {f === 'one-time' ? 'One-Time Gift' : '🔁 Monthly Giving'}
              </button>
            ))}
          </div>

          {/* Preset amounts */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Select Amount (USD)</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {PRESET_AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => { setAmount(a); setCustomAmount(''); }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 9,
                    border:
                      amount === a && !customAmount
                        ? '2px solid #10b981'
                        : '1px solid rgba(255,255,255,0.12)',
                    background:
                      amount === a && !customAmount ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                    color: amount === a && !customAmount ? '#34d399' : '#c5d8d0',
                    fontWeight: amount === a && !customAmount ? 700 : 400,
                    fontSize: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  ${a}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              placeholder="Or enter custom amount…"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              style={fieldStyle}
            />
          </div>

          {/* Project */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Designate to</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              style={{ ...fieldStyle, cursor: 'pointer' }}
            >
              {PROJECTS.map((p) => (
                <option key={p} value={p} style={{ background: '#0d2b22' }}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text"
              required
              placeholder="Your full name"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              style={fieldStyle}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Email Address *</label>
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              style={fieldStyle}
            />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Message (optional)</label>
            <textarea
              rows={2}
              placeholder="A note for our team…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ ...fieldStyle, resize: 'vertical' }}
            />
          </div>

          {detailsError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 16px',
                borderRadius: 8,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
                fontSize: '13.5px',
                marginBottom: '16px',
              }}
            >
              <AlertCircle size={16} />
              {detailsError}
            </div>
          )}

          <button
            type="submit"
            disabled={loadingIntent}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 12,
              border: 'none',
              background: loadingIntent
                ? 'rgba(16,185,129,0.4)'
                : 'linear-gradient(135deg,#10b981,#059669)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 700,
              cursor: loadingIntent ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            {loadingIntent ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Preparing secure payment…
              </>
            ) : (
              <>
                <Lock size={16} />
                Continue to Payment — ${finalAmount > 0 ? finalAmount.toLocaleString() : '0'}
              </>
            )}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          {/* Trust badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginTop: 18,
              color: '#8aa69b',
              fontSize: '11.5px',
            }}
          >
            <ShieldCheck size={14} color="#10b981" />
            <span>USA Non-profit Corporation MA 001751059 • EIN: 99-0979318 • Tax Deductible</span>
          </div>
        </form>
        </div>
      </>
    );
  }


  // ---------------------------------------------------------------------------
  // Step 2 — Stripe payment form
  // ---------------------------------------------------------------------------
  return (
    <div style={cardStyle}>
      {/* Back button */}
      <div
        style={{
          padding: '18px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <button
          type="button"
          onClick={() => { setStep('details'); setClientSecret(null); }}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            color: '#a7f3d0',
            padding: '6px 14px',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        <div>
          <span style={{ color: '#34d399', fontWeight: 700, fontSize: '15px' }}>
            ${finalAmount.toLocaleString()} {frequency === 'monthly' ? '/ month' : 'one-time'}
          </span>
          <span style={{ color: '#6b9e8a', fontSize: '13px', marginLeft: 8 }}>→ {project}</span>
        </div>
      </div>

      <div style={{ padding: '28px 32px 32px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
          }}
        >
          <Lock size={16} color="#34d399" />
          <p style={{ margin: 0, color: '#a7f3d0', fontSize: '13px' }}>
            Secured by Stripe — your card details are never stored on our servers
          </p>
        </div>

        {clientSecret && stripePromise && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary: '#10b981',
                  colorBackground: '#0f1f19',
                  colorText: '#d1fae5',
                  colorDanger: '#f87171',
                  fontFamily: 'system-ui, sans-serif',
                  borderRadius: '10px',
                  spacingUnit: '4px',
                },
              },
            }}
          >
            <CheckoutForm
              donorName={donorName}
              donorEmail={donorEmail}
              notes={notes}
              amount={finalAmount}
              frequency={frequency}
              project={project}
              onSuccess={() =>
                setSuccessData({ name: donorName, amount: finalAmount, frequency, project })
              }
            />
          </Elements>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginTop: 18,
            color: '#8aa69b',
            fontSize: '11.5px',
          }}
        >
          <ShieldCheck size={14} color="#10b981" />
          <span>USA Non-profit Corporation MA 001751059 • EIN: 99-0979318 • Tax Deductible</span>
        </div>
      </div>
    </div>
  );
}
