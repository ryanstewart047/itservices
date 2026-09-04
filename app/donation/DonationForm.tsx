'use client';

import { useState } from 'react';
import { ShieldCheck, Heart, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

const PROJECTS = [
  'General Ecological Fund (Highest Need)',
  'Coastal Mangrove Restoration (Sierra Leone)',
  'Clean Energy Microgrids & Eco-Cookstoves',
  'Syntropic Agroforestry & Food Forests',
  'Youth Climate Eco-Literacy Campaign',
  'Solar-Powered Clean Water Wells',
];

export default function DonationForm() {
  const [amount, setAmount] = useState<number | string>(100);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [project, setProject] = useState(PROJECTS[0]);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Online Pledge / Card');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ name: string; amount: number; frequency: string; project: string } | null>(null);

  const finalAmount = customAmount ? Number(customAmount) : Number(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = donorEmail.trim().toLowerCase();
    if (!donorName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    const dotCount = (cleanEmail.match(/\./g) || []).length;
    if (dotCount > 2) {
      setError('Invalid email: emails containing more than two dots are not accepted.');
      return;
    }

    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      setError('Please choose or enter a valid donation amount.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: donorName.trim(),
          donorEmail: cleanEmail,
          amount: finalAmount,
          currency: 'USD',
          frequency,
          projectName: project,
          paymentMethod,
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessData({
          name: donorName.trim(),
          amount: finalAmount,
          frequency,
          project,
        });
      } else {
        setError(data.error || 'Failed to process contribution. Please try again.');
      }
    } catch {
      setError('Network connection error. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          backgroundColor: '#0c261e',
          border: '1px solid rgba(52,199,89,0.3)',
          borderRadius: 20,
          padding: '44px 36px',
          textAlign: 'center',
          boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: 'rgba(16,185,129,0.15)',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#10b981',
          }}
        >
          <CheckCircle2 size={40} />
        </div>

        <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: 800, margin: '0 0 10px' }}>
          Thank You, {successData.name}! 💚
        </h2>

        <p style={{ color: '#8aa69b', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px' }}>
          Your contribution of <strong style={{ color: '#10b981' }}>${successData.amount.toLocaleString()} USD</strong> ({successData.frequency})
          has been logged in our central registry and directed to <strong>{successData.project}</strong>.
        </p>

        <div
          style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: 12,
            padding: '18px 24px',
            marginBottom: '28px',
            textAlign: 'left',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p style={{ margin: '0 0 6px', color: '#34d399', fontSize: '13px', fontWeight: 700 }}>
            Receipt &amp; Tax Acknowledgment Dispatched
          </p>
          <p style={{ margin: 0, color: '#a7b8b2', fontSize: '13px', lineHeight: 1.5 }}>
            A confirmation receipt has been sent to your email. EARPI is a USA 501(c)(3) compliant non-profit (MA 001751059, EIN 99-0979318).
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setSuccessData(null);
              setDonorName('');
              setDonorEmail('');
              setNotes('');
              setCustomAmount('');
            }}
            style={{
              padding: '12px 24px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.15)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '13.5px',
              cursor: 'pointer',
            }}
          >
            Make Another Contribution
          </button>
          <Link
            href="/projects"
            style={{
              padding: '12px 26px',
              borderRadius: 10,
              backgroundColor: '#10b981',
              color: '#06281e',
              fontWeight: 700,
              fontSize: '13.5px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>See Project Impact</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 720,
        margin: '0 auto',
        backgroundColor: '#0c261e',
        border: '1px solid rgba(52,199,89,0.2)',
        borderRadius: 20,
        padding: '36px 30px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Frequency Toggle */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, background: 'rgba(0,0,0,0.3)', padding: 5, borderRadius: 12 }}>
          <button
            type="button"
            onClick={() => setFrequency('one-time')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 9,
              border: 'none',
              backgroundColor: frequency === 'one-time' ? '#10b981' : 'transparent',
              color: frequency === 'one-time' ? '#06281e' : '#a7b8b2',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            One-Time Contribution
          </button>
          <button
            type="button"
            onClick={() => setFrequency('monthly')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 9,
              border: 'none',
              backgroundColor: frequency === 'monthly' ? '#10b981' : 'transparent',
              color: frequency === 'monthly' ? '#06281e' : '#a7b8b2',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Monthly Sustainer 💚
          </button>
        </div>

        {/* Preset Amounts */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', color: '#e6f4ee', fontSize: '13px', fontWeight: 600, marginBottom: 10 }}>
            Select Amount (USD)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 10 }}>
            {PRESET_AMOUNTS.map((val) => {
              const isSelected = !customAmount && amount === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setAmount(val);
                    setCustomAmount('');
                  }}
                  style={{
                    padding: '12px 10px',
                    borderRadius: 10,
                    border: isSelected ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.12)',
                    backgroundColor: isSelected ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                    color: isSelected ? '#34d399' : '#fff',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  ${val}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Amount Input */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8aa69b', fontWeight: 700, fontSize: '15px' }}>
              $
            </span>
            <input
              type="number"
              min="1"
              step="any"
              placeholder="Or enter custom amount in USD..."
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 32px',
                borderRadius: 10,
                border: customAmount ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(0,0,0,0.25)',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Project Designation */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', color: '#e6f4ee', fontSize: '13px', fontWeight: 600, marginBottom: 8 }}>
            Designate Your Impact
          </label>
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.12)',
              backgroundColor: '#061a14',
              color: '#fff',
              fontSize: '13.5px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          >
            {PROJECTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Donor Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          <div>
            <label style={{ display: 'block', color: '#e6f4ee', fontSize: '13px', fontWeight: 600, marginBottom: 8 }}>
              Full Name *
            </label>
            <input
              type="text"
              placeholder="Your name or organization"
              required
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 9,
                border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(0,0,0,0.25)',
                color: '#fff',
                fontSize: '13.5px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#e6f4ee', fontSize: '13px', fontWeight: 600, marginBottom: 8 }}>
              Email Address *
            </label>
            <input
              type="email"
              placeholder="For tax receipt & updates"
              required
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 9,
                border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(0,0,0,0.25)',
                color: '#fff',
                fontSize: '13.5px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Payment Channel / Method */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', color: '#e6f4ee', fontSize: '13px', fontWeight: 600, marginBottom: 8 }}>
            Contribution Preference
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            {['Credit / Debit Card', 'PayPal / Digital', 'Bank Wire / ACH', 'Institutional Grant'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMethod(m)}
                style={{
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: paymentMethod === m ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                  backgroundColor: paymentMethod === m ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.02)',
                  color: paymentMethod === m ? '#34d399' : '#a7b8b2',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Note */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', color: '#e6f4ee', fontSize: '13px', fontWeight: 600, marginBottom: 8 }}>
            Dedication or Notes (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="In memory of, dedicated to, or specific project milestones..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 9,
              border: '1px solid rgba(255,255,255,0.12)',
              backgroundColor: 'rgba(0,0,0,0.25)',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Error notice */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 16px',
              borderRadius: 9,
              backgroundColor: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5',
              fontSize: '13px',
              marginBottom: 18,
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 10,
            border: 'none',
            backgroundColor: '#10b981',
            color: '#06281e',
            fontWeight: 800,
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 6px 20px rgba(16,185,129,0.35)',
            transition: 'background-color 0.2s',
          }}
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Recording Contribution...</span>
            </>
          ) : (
            <>
              <Heart size={18} fill="#06281e" />
              <span>Confirm ${finalAmount ? finalAmount.toLocaleString() : '0'} USD Contribution</span>
            </>
          )}
        </button>

        {/* Tax Accreditation */}
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
          <span>USA 501(c)(3) MA 001751059 • EIN: 99-0979318 • Tax Deductible</span>
        </div>
      </form>
    </div>
  );
}
