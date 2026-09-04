import type { Metadata } from 'next';
import DonationForm from './DonationForm';
import { ShieldCheck, Trees, Sun, Droplet } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Donate & Support Climate Action | EARPI',
  description: 'Support coastal mangrove restoration, syntropic agroforestry, and clean energy across Sierra Leone. USA 501(c)(3) tax-deductible non-profit contribution.',
};

export default function DonationPage() {
  return (
    <div style={{ backgroundColor: '#071b15', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #061a14 0%, #0c2e22 60%, #071b15 100%)',
          borderBottom: '1px solid rgba(52,199,89,0.15)',
          padding: 'clamp(4rem, 7vw, 6rem) 1.5rem 3rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(52,199,89,0.1)',
            border: '1px solid rgba(52,199,89,0.3)',
            borderRadius: 999,
            padding: '0.35rem 1rem',
            marginBottom: '1.25rem',
          }}
        >
          <ShieldCheck size={14} color="#4ade80" />
          <span style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            USA 501(c)(3) Compliant • Tax Deductible
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 1rem',
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
          }}
        >
          Fuel Tangible<br />
          <span style={{ color: '#4ade80' }}>Climate Action</span>
        </h1>

        <p
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: '1.05rem',
            maxWidth: 580,
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}
        >
          100% of your contribution fuels frontline mangrove propagation, syntropic agroforestry plots,
          and community clean energy in Sierra Leone.
        </p>

        {/* Impact Metric Pills */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: <Trees size={16} color="#4ade80" />, label: '$25 plants 50 mangrove propagules' },
            { icon: <Sun size={16} color="#fbbf24" />, label: '$100 equips an eco-cookstove household' },
            { icon: <Droplet size={16} color="#60a5fa" />, label: '$250 funds solar water filtration testing' },
          ].map((pill, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '8px 16px',
                borderRadius: 999,
                color: 'rgba(255,255,255,0.75)',
                fontSize: '12.5px',
                fontWeight: 500,
              }}
            >
              {pill.icon}
              <span>{pill.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Donation Form Container */}
      <div style={{ padding: '3.5rem 1.5rem 5rem' }}>
        <DonationForm />
      </div>

    </div>
  );
}
