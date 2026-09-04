'use client';

import Image from 'next/image';

const ambassadors = [
  { name: 'Samikshya Madhukullya', role: 'International Advisor',       region: 'Asia-Pacific',         image: '/assets/img/ambassadors/MEMBER-1.jpg',  bio: 'International advisor bridging EARPI\'s work with global climate policy frameworks and multilateral institutions.' },
  { name: 'Reguna Parakal',        role: 'Global Marketing Director',   region: 'Europe',               image: '/assets/img/ambassadors/MEMBER-2.jpg',  bio: 'Leads EARPI\'s global marketing strategy, expanding reach and amplifying climate impact stories internationally.' },
  { name: 'Jamuliro Samuel',       role: 'Research & Academia',         region: 'North America',        image: '/assets/img/ambassadors/MEMBER-3.jpg',  bio: 'PhD researcher at International University USA, advancing climate science partnerships and academic collaboration.' },
  { name: 'Dr. Koffi Abotchi',     role: 'Regional Ambassador',         region: 'West Africa (Togo)',   image: '/assets/img/ambassadors/MEMBER-4.jpg',  bio: 'Represents EARPI across Francophone West Africa, fostering cross-border climate resilience partnerships.' },
  { name: 'Dr. Rev. Solomon Raj',  role: 'International Legal Advisor', region: 'South Asia',           image: '/assets/img/ambassadors/MEMBER-05.JPG', bio: 'Provides legal expertise on international environmental law, climate agreements, and organisational compliance.' },
  { name: 'Isatu Kamara',          role: 'Procurement & Supply Chain',  region: 'West Africa',          image: '/assets/img/ambassadors/MEMBER-06.JPG', bio: 'Supports procurement strategy and sustainable supply chain management for field projects across the region.' },
];

export default function AmbassadorCards() {
  return (
    <div style={{ background: '#071b15', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #061a14 0%, #0c2e22 60%, #071b15 100%)', borderBottom: '1px solid rgba(52,199,89,0.15)', padding: 'clamp(4rem, 8vw, 7rem) 1.5rem 3rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(52,199,89,0.1)', border: '1px solid rgba(52,199,89,0.3)', borderRadius: 999, padding: '0.35rem 1rem', marginBottom: '1.25rem' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
          <span style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Global Network</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          Our Global<br /><span style={{ color: '#4ade80' }}>Ambassadors</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Champions from around the world amplifying EARPI&apos;s mission — connecting local climate action to global policy, research, and advocacy networks.
        </p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[{ value: '6+', label: 'Ambassadors' }, { value: '4', label: 'Continents' }, { value: '8+', label: 'Countries' }].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#4ade80' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ambassador Grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3.5rem 1.5rem 5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {ambassadors.map((amb) => (
          <div
            key={amb.name}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s, transform 0.2s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgba(74,222,128,0.35)'; el.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.transform = 'translateY(0)'; }}
          >
            <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
              <Image src={amb.image} alt={amb.name} fill style={{ objectFit: 'cover', objectPosition: 'center top' }} sizes="320px" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,27,21,0.9) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(6,26,20,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 999, padding: '0.25rem 0.75rem' }}>
                <span style={{ color: '#4ade80', fontSize: '0.7rem', fontWeight: 700 }}>🌍 {amb.region}</span>
              </div>
            </div>
            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem', margin: 0, lineHeight: 1.3 }}>{amb.name}</h3>
              <p style={{ color: '#4ade80', fontSize: '0.82rem', fontWeight: 600, margin: 0 }}>{amb.role}</p>
              <div style={{ width: 32, height: 2, background: 'rgba(74,222,128,0.4)', borderRadius: 2 }} />
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', margin: 0, lineHeight: 1.6, flexGrow: 1 }}>{amb.bio}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Join CTA */}
      <div style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.12) 0%, rgba(52,199,89,0.06) 100%)', borderTop: '1px solid rgba(52,199,89,0.15)', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.75rem' }}>Become a Global Ambassador</h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', margin: '0 auto 1.5rem', maxWidth: 480, lineHeight: 1.7 }}>
          Are you passionate about climate action? Join our global network and help amplify EARPI&apos;s impact in your region.
        </p>
        <a href="/contact" style={{ display: 'inline-block', background: '#16a34a', color: '#fff', padding: '0.85rem 2.5rem', borderRadius: 10, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>Apply Now →</a>
      </div>
    </div>
  );
}
