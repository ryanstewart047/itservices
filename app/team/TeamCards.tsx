'use client';

import Image from 'next/image';

const teamMembers = [
  { name: 'Alimamy Sesay',       role: 'Executive Director',                 image: '/assets/img/team/team-4.jpg',  badge: 'Leadership',     bio: 'Founder and Executive Director driving EARPI\'s visionary leadership, international partnerships, and grassroots climate programs across Sierra Leone.' },
  { name: 'Ryan J. Stewart',     role: 'Website Developer & Technical Lead', image: '/assets/img/team/team-1.jpg',  badge: 'Technology',     bio: 'Website developer and digital architect responsible for EARPI\'s website platform, digital infrastructure, and online systems.' },
  { name: 'Habibu R. Bundu',     role: 'Director of Operations',   image: '/assets/img/team/team-5.jpg',  badge: 'Operations',     bio: 'Manages day-to-day operations ensuring seamless execution of field projects and organisational efficiency.' },
  { name: 'Hassan Kamara',       role: 'Finance & Administration', image: '/assets/img/team/team-2.jpg',  badge: 'Finance',        bio: 'Oversees financial planning, reporting, and administrative systems that keep EARPI accountable.' },
  { name: 'Usman Felix Cole',    role: 'Program Manager',          image: '/assets/img/team/team-3.jpg',  badge: 'Programs',       bio: 'Coordinates multi-country programs and monitors impact metrics across all active field sites.' },
  { name: 'Abu Maurice Bangura', role: 'Public Relations Officer', image: '/assets/img/team/team-6.jpg',  badge: 'Communications', bio: 'Manages media relations, public outreach, and EARPI\'s community engagement initiatives.' },
  { name: 'John Bobor Smart',    role: 'National Coordinator',     image: '/assets/img/team/team-7.jpg',  badge: 'Coordination',   bio: 'Coordinates national-level partnerships and ensures local implementation aligns with strategic goals.' },
  { name: 'Isatu Kamara',        role: 'Procurement Officer',      image: '/assets/img/team/team-9.jpg',  badge: 'Procurement',    bio: 'Manages procurement processes and supply chain to support efficient field operations.' },
  { name: 'Samuella Kanu',       role: 'Finance Officer',          image: '/assets/img/team/team-12.jpg', badge: 'Finance',        bio: 'Handles financial records, donor reporting, and budget tracking across all EARPI programs.' },
  { name: 'Mubo Mahmud',         role: 'Administrative Secretary', image: '/assets/img/team/team-13.jpg', badge: 'Administration', bio: 'Provides administrative support and coordinates internal communications across departments.' },
];

const badgeColors: Record<string, { bg: string; text: string }> = {
  Leadership:     { bg: 'rgba(250,204,21,0.15)',  text: '#fbbf24' },
  Technology:     { bg: 'rgba(56,189,248,0.15)',   text: '#38bdf8' },
  Board:          { bg: 'rgba(139,92,246,0.15)',   text: '#a78bfa' },
  Operations:     { bg: 'rgba(59,130,246,0.15)',   text: '#60a5fa' },
  Finance:        { bg: 'rgba(52,199,89,0.15)',    text: '#4ade80' },
  Programs:       { bg: 'rgba(236,72,153,0.15)',   text: '#f472b6' },
  Communications: { bg: 'rgba(251,146,60,0.15)',   text: '#fb923c' },
  Coordination:   { bg: 'rgba(20,184,166,0.15)',   text: '#2dd4bf' },
  Procurement:    { bg: 'rgba(99,102,241,0.15)',   text: '#818cf8' },
  Administration: { bg: 'rgba(244,63,94,0.15)',    text: '#fb7185' },
};

export default function TeamCards() {
  return (
    <div style={{ background: '#071b15', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #061a14 0%, #0c2e22 60%, #071b15 100%)', borderBottom: '1px solid rgba(52,199,89,0.15)', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem 3rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(52,199,89,0.1)', border: '1px solid rgba(52,199,89,0.3)', borderRadius: 999, padding: '0.35rem 1rem', marginBottom: '1.25rem' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
          <span style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Board &amp; Leadership</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          The People Behind<br /><span style={{ color: '#4ade80' }}>Our Mission</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 2rem', lineHeight: 1.7 }}>
          A dedicated team of professionals and community leaders committed to building climate resilience across West Africa through evidence-based action.
        </p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[{ value: '10+', label: 'Team Members' }, { value: '5+', label: 'Countries Reached' }, { value: '8+', label: 'Years of Impact' }].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#4ade80' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3.5rem 1.5rem 5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {teamMembers.map((member) => {
          const bc = badgeColors[member.badge] ?? { bg: 'rgba(52,199,89,0.15)', text: '#4ade80' };
          return (
            <div
              key={member.name}
              className="team-card"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s, transform 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgba(74,222,128,0.35)'; el.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.transform = 'translateY(0)'; }}
            >
              <div style={{ position: 'relative', width: '100%', height: 200, background: 'rgba(255,255,255,0.03)', overflow: 'hidden' }}>
                <Image src={member.image} alt={member.name} fill style={{ objectFit: 'cover', objectPosition: 'center top' }} sizes="220px" />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(7,27,21,0.85) 0%, transparent 100%)' }} />
              </div>
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ display: 'inline-block', background: bc.bg, color: bc.text, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', borderRadius: 999, padding: '0.2rem 0.65rem', alignSelf: 'flex-start' }}>{member.badge}</span>
                <h3 style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', margin: 0, lineHeight: 1.3 }}>{member.name}</h3>
                <p style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>{member.role}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', margin: 0, lineHeight: 1.5, flexGrow: 1 }}>{member.bio}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ background: 'rgba(52,199,89,0.07)', borderTop: '1px solid rgba(52,199,89,0.12)', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', margin: '0 0 1.25rem' }}>Want to join our growing team?</p>
        <a href="/contact" style={{ display: 'inline-block', background: '#16a34a', color: '#fff', padding: '0.75rem 2rem', borderRadius: 10, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>Get in Touch →</a>
      </div>
    </div>
  );
}
