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
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
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
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1)',
            willChange: 'opacity',
            zIndex: 0,
          }}
        />
      ))}

      {/* Dark gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7,27,21,0.72) 0%, rgba(7,27,21,0.88) 55%, rgba(7,27,21,0.97) 100%)',
          zIndex: 1,
        }}
      />

      {/* Slide content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '960px',
          margin: '0 auto',
          padding: '110px 24px 90px',
          textAlign: 'center',
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(14px)' : 'translateY(0)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        {/* Accreditation Tag & Slide Category Pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              backgroundColor: 'rgba(16, 185, 129, 0.18)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '30px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#34d399',
            }}
          >
            <ShieldCheck size={15} />
            <span>USA 501(c)(3) Non-Profit • Freetown, Sierra Leone</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              backgroundColor: `${slide.tagColor}22`,
              border: `1px solid ${slide.tagColor}66`,
              borderRadius: '30px',
              fontSize: '12.5px',
              fontWeight: 700,
              color: slide.tagColor,
              letterSpacing: '0.3px',
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
            fontSize: 'clamp(32px, 5.5vw, 60px)',
            fontWeight: 900,
            color: '#ffffff',
            margin: '0 0 16px',
            lineHeight: 1.12,
            letterSpacing: '-0.8px',
          }}
        >
          {slide.headline}{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {slide.headlineGradient}
          </span>
        </h1>

        {/* Body text */}
        <p
          style={{
            fontSize: 'clamp(15px, 2vw, 18.5px)',
            color: '#c6d8d0',
            lineHeight: 1.7,
            maxWidth: '740px',
            margin: '0 auto 36px',
          }}
        >
          {slide.body}
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href={slide.cta.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              backgroundColor: '#10b981',
              color: '#06281e',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '15px',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(16,185,129,0.35)',
            }}
          >
            <span>{slide.cta.label}</span>
            <ArrowRight size={17} />
          </Link>
          <Link
            href="/donation"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 26px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1.5px solid rgba(255,255,255,0.24)',
              color: '#ffffff',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Heart size={16} color="#f43f5e" />
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
          style={{
            position: 'absolute',
            top: '50%',
            [dir === 'prev' ? 'left' : 'right']: '20px',
            transform: 'translateY(-50%)',
            zIndex: 3,
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '50%',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            backdropFilter: 'blur(6px)',
            transition: 'background 0.2s',
          }}
        >
          {dir === 'prev' ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>
      ))}

      {/* Dot indicators + progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* Progress bar for current slide */}
        <div
          style={{
            width: '140px',
            height: '2px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            key={current}
            style={{
              height: '100%',
              backgroundColor: '#10b981',
              borderRadius: '2px',
              animation: paused ? 'none' : `slider-progress ${AUTO_INTERVAL}ms linear forwards`,
            }}
          />
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === current ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: i === current ? '#10b981' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.35s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Slide counter */}
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '1px' }}>
          {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </span>
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
      `}</style>
    </section>
  );
}
