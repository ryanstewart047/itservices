'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

const SLIDES = [
  {
    image: '/assets/img/hero/slider-1.jpg',
    tag: 'Mangrove Reforestation',
    tagColor: '#10b981',
    headline: 'Every Sapling Planted',
    headlineGradient: 'Is a Promise to the Future.',
    body: 'Community members in Yawri Bay and Sherbro Island are planting thousands of mangrove saplings, rebuilding coastal buffers that protect villages from rising sea levels and storm surges.',
    cta: { label: 'See Our Field Projects', href: '/projects' },
  },
  {
    image: '/assets/img/hero/slider-2.jpg',
    tag: 'Community Engagement',
    tagColor: '#f59e0b',
    headline: 'Change Starts',
    headlineGradient: 'With the Community.',
    body:
      "Our grassroots mobilisation model puts local voices at the centre of every climate decision. From village councils to women's cooperatives, we build lasting environmental stewardship from within.",
    cta: { label: 'Meet Our Team', href: '/team' },
  },
  {
    image: '/assets/img/hero/slider-3.jpg',
    tag: 'Blue Carbon Ecosystems',
    tagColor: '#38bdf8',
    headline: 'Restoring Forests',
    headlineGradient: 'That Breathe for All of Us.',
    body:
      "Sierra Leone's mangrove estuaries store up to 10× more carbon than terrestrial forests. Our drone-monitored restoration zones in Sherbro Island are sequestering carbon while reviving fisheries.",
    cta: { label: 'Explore the Ecosystem', href: '/priority-one' },
  },
  {
    image: '/assets/img/hero/slider-4.jpg',
    tag: 'Youth Climate Leadership',
    tagColor: '#a78bfa',
    headline: 'The Next Generation',
    headlineGradient: 'Is Already Leading.',
    body: 'Young climate advocates across 20 Sierra Leonean schools are driving green clubs, school nurseries, and public awareness campaigns — turning eco-literacy into lifelong environmental leadership.',
    cta: { label: 'Support Youth Programs', href: '/priority-four' },
  },
];

const AUTO_INTERVAL = 6000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => setAnimating(false), 700);
    },
    [animating]
  );

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTO_INTERVAL);
    return () => clearInterval(timer);
  }, [next, paused]);

  const slide = SLIDES[current];

  return (
    <section
      className="hero-slider-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        minHeight: 'clamp(560px, 86vh, 800px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#051812',
      }}
    >
      {/* Background images — all preloaded, transition with opacity */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          aria-hidden={i !== current}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${s.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            backgroundRepeat: 'no-repeat',
            opacity: i === current ? 1 : 0,
            transform: i === current ? 'scale(1)' : 'scale(1.03)',
            transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 6s linear',
            willChange: 'opacity, transform',
            zIndex: 0,
          }}
        />
      ))}

      {/* Subtle cinematic gradient overlay to ensure text readability while keeping photos vivid and clear */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(5, 20, 15, 0.2) 0%, rgba(5, 20, 15, 0.5) 65%, rgba(4, 16, 12, 0.82) 100%), linear-gradient(180deg, rgba(4, 16, 12, 0.35) 0%, transparent 40%, rgba(4, 16, 12, 0.85) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Slide content */}
      <div
        className="hero-slide-content"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '960px',
          width: '100%',
          margin: '0 auto',
          padding: 'clamp(50px, 8vw, 100px) clamp(16px, 4vw, 32px) clamp(70px, 10vw, 90px)',
          textAlign: 'center',
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(12px)' : 'translateY(0)',
          transition: 'opacity 0.45s ease, transform 0.45s ease',
        }}
      >
        {/* Accreditation Tag & Slide Category Pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: 'rgba(6, 26, 19, 0.72)',
              border: '1px solid rgba(16, 185, 129, 0.45)',
              borderRadius: '30px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#34d399',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            }}
          >
            <ShieldCheck size={14} />
            <span>USA Non-Profit MA 001751059 • EIN: 99-0979318</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '6px 14px',
              backgroundColor: 'rgba(6, 26, 19, 0.72)',
              border: `1px solid ${slide.tagColor}88`,
              borderRadius: '30px',
              fontSize: '12px',
              fontWeight: 700,
              color: slide.tagColor,
              letterSpacing: '0.3px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: slide.tagColor,
                display: 'inline-block',
                animation: 'pulse-dot 1.6s ease-in-out infinite',
              }}
            />
            {slide.tag}
          </div>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(28px, 5.2vw, 56px)',
            fontWeight: 900,
            color: '#ffffff',
            margin: '0 0 16px',
            lineHeight: 1.14,
            letterSpacing: '-0.5px',
            textShadow: '0 3px 16px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0,0,0,0.9)',
          }}
        >
          {slide.headline}{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
              filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.8))',
            }}
          >
            {slide.headlineGradient}
          </span>
        </h1>

        {/* Body text */}
        <p
          style={{
            fontSize: 'clamp(14px, 1.8vw, 18px)',
            color: '#f0fdf4',
            lineHeight: 1.65,
            maxWidth: '740px',
            margin: '0 auto 32px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.85), 0 1px 2px rgba(0,0,0,0.95)',
          }}
        >
          {slide.body}
        </p>

        {/* CTA buttons */}
        <div
          className="hero-cta-group"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href={slide.cta.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '13px 26px',
              backgroundColor: '#10b981',
              color: '#06281e',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '14.5px',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(16,185,129,0.4)',
              minWidth: '180px',
            }}
          >
            <span>{slide.cta.label}</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/donation"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '13px 24px',
              backgroundColor: 'rgba(6, 26, 19, 0.72)',
              border: '1.5px solid rgba(255,255,255,0.3)',
              color: '#ffffff',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14.5px',
              textDecoration: 'none',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
              minWidth: '160px',
            }}
          >
            <Heart size={15} color="#f43f5e" />
            <span>Donate Now</span>
          </Link>
        </div>
      </div>

      {/* Arrow navigation */}
      {(['prev', 'next'] as const).map((dir) => (
        <button
          key={dir}
          onClick={dir === 'prev' ? prev : next}
          aria-label={dir === 'prev' ? 'Previous slide' : 'Next slide'}
          className={`hero-arrow-btn hero-arrow-${dir}`}
          style={{
            position: 'absolute',
            top: '50%',
            [dir === 'prev' ? 'left' : 'right']: '16px',
            transform: 'translateY(-50%)',
            zIndex: 3,
            background: 'rgba(6, 26, 19, 0.65)',
            border: '1px solid rgba(255,255,255,0.22)',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.2s, transform 0.15s ease',
          }}
        >
          {dir === 'prev' ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>
      ))}

      {/* Dot indicators + progress bar (slide counter 01/04 removed) */}
      <div
        style={{
          position: 'absolute',
          bottom: '22px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {/* Progress bar for current slide */}
        <div
          style={{
            width: '120px',
            height: '3px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div
            key={current}
            style={{
              height: '100%',
              backgroundColor: '#10b981',
              borderRadius: '3px',
              animation: paused ? 'none' : `slider-progress ${AUTO_INTERVAL}ms linear forwards`,
            }}
          />
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === current ? '26px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: i === current ? '#10b981' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.35s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slider-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
        @media (max-width: 640px) {
          .hero-arrow-btn {
            width: 36px !important;
            height: 36px !important;
            background: rgba(6, 26, 19, 0.8) !important;
          }
          .hero-arrow-prev { left: 8px !important; }
          .hero-arrow-next { right: 8px !important; }
          .hero-cta-group {
            flex-direction: column !important;
            width: 100% !important;
          }
          .hero-cta-group a {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
