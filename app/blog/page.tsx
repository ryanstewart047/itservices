'use client';

import Link from 'next/link';

export default function BlogPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #061a14 0%, #0c2e22 50%, #071b15 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(52, 199, 89, 0.12)',
          border: '2px solid rgba(52, 199, 89, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}
      >
        <span style={{ fontSize: '3rem' }}>📰</span>
      </div>

      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800,
          color: '#ffffff',
          textAlign: 'center',
          margin: '0 0 1rem',
          letterSpacing: '-0.02em',
        }}
      >
        News &amp; Updates
      </h1>

      <div
        style={{
          display: 'inline-block',
          background: 'rgba(52, 199, 89, 0.15)',
          border: '1px solid rgba(52, 199, 89, 0.4)',
          borderRadius: 999,
          padding: '0.4rem 1.2rem',
          marginBottom: '1.5rem',
        }}
      >
        <span style={{ color: '#4ade80', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Coming Soon
        </span>
      </div>

      <p
        style={{
          color: 'rgba(255,255,255,0.65)',
          fontSize: '1.1rem',
          textAlign: 'center',
          maxWidth: 520,
          lineHeight: 1.7,
          margin: '0 0 2.5rem',
        }}
      >
        We&apos;re building a powerful news hub to keep you updated on our field projects,
        research publications, and climate action milestones. Stay tuned.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '3rem',
        }}
      >
        {[
          { icon: '🌱', label: 'Field Reports' },
          { icon: '📊', label: 'Research Insights' },
          { icon: '🤝', label: 'Partner Stories' },
          { icon: '🌍', label: 'Impact Metrics' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: '1rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              minWidth: 120,
            }}
          >
            <span style={{ fontSize: '1.75rem' }}>{item.icon}</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            background: '#16a34a',
            color: '#fff',
            padding: '0.85rem 2rem',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: '0.95rem',
            textDecoration: 'none',
          }}
        >
          ← Back to Home
        </Link>
        <Link
          href="/projects"
          style={{
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            padding: '0.85rem 2rem',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: '0.95rem',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          Explore Projects →
        </Link>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '3rem', textAlign: 'center' }}>
        Subscribe to our newsletter to be the first to know when we launch.
      </p>
    </div>
  );
}
