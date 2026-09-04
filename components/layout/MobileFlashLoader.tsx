'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const MISSION_PILLARS = [
  { icon: '🌱', label: 'Ecosystem & Mangrove Restoration' },
  { icon: '⚡', label: 'Renewable Clean Energy Microgrids' },
  { icon: '🌾', label: 'Regenerative Agriculture & Food Forests' },
  { icon: '💧', label: 'Water Security & Climate Adaptation' },
];

export default function MobileFlashLoader() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(12);
  const [pillarIndex, setPillarIndex] = useState(0);

  useEffect(() => {
    // Check if splash already viewed in this session
    try {
      const alreadyShown = sessionStorage.getItem('earpi_flash_viewed');
      if (alreadyShown) {
        return; // Don't show again in current browser session
      }
    } catch {
      // Ignore if sessionStorage is unavailable (e.g. private mode)
    }

    setVisible(true);

    // Progress counter animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(progressInterval);
          return 100;
        }
        const jump = Math.floor(Math.random() * 18) + 12;
        return Math.min(prev + jump, 98);
      });
    }, 180);

    // Pillar text rotation
    const pillarInterval = setInterval(() => {
      setPillarIndex((prev) => (prev + 1) % MISSION_PILLARS.length);
    }, 600);

    // Complete loader after ~1.6s
    const exitTimer = setTimeout(() => {
      setProgress(100);
      setFading(true);

      try {
        sessionStorage.setItem('earpi_flash_viewed', 'true');
      } catch {
        // Ignore
      }

      setTimeout(() => {
        setVisible(false);
      }, 550);
    }, 1600);

    return () => {
      clearInterval(progressInterval);
      clearInterval(pillarInterval);
      clearTimeout(exitTimer);
    };
  }, []);

  const handleDismiss = () => {
    setFading(true);
    try {
      sessionStorage.setItem('earpi_flash_viewed', 'true');
    } catch {
      // Ignore
    }
    setTimeout(() => {
      setVisible(false);
    }, 400);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`flash-loader-container ${fading ? 'flash-loader-exit' : ''}`}
      role="dialog"
      aria-label="EARPI Loading Screen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'radial-gradient(ellipse at 50% 35%, #083325 0%, #051a13 55%, #020b08 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'clamp(28px, 6vh, 60px) 24px clamp(20px, 4vh, 40px)',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient bio-luminescent light spheres */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(480px, 90vw)',
          height: 'min(480px, 90vw)',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(5, 150, 105, 0.05) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          animation: 'ecoPulseGlow 3s ease-in-out infinite alternate',
        }}
      />

      {/* Top Header / App Mode Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(52, 211, 153, 0.2)',
          color: '#a7f3d0',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          backdropFilter: 'blur(10px)',
          zIndex: 2,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 10px #10b981',
            animation: 'beaconBlink 1.4s infinite',
          }}
        />
        <span>EARPI Climate Network</span>
      </div>

      {/* Center Hero: Glowing Orbital Rings & Official Emblem */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '380px',
          zIndex: 2,
        }}
      >
        {/* Orbital Ring Structure */}
        <div
          style={{
            position: 'relative',
            width: 'clamp(140px, 36vw, 180px)',
            height: 'clamp(140px, 36vw, 180px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          {/* Rotating outer dash ring */}
          <div
            style={{
              position: 'absolute',
              inset: -14,
              borderRadius: '50%',
              border: '2px dashed rgba(52, 211, 153, 0.35)',
              animation: 'spinClockwise 12s linear infinite',
            }}
          />

          {/* Glowing eco ring */}
          <div
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669, #34d399, #047857)',
              padding: '3px',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.45)',
              animation: 'ringPulse 2.4s ease-in-out infinite',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: '#041510',
              }}
            />
          </div>

          {/* Emblem container */}
          <div
            style={{
              position: 'relative',
              width: 'clamp(120px, 30vw, 150px)',
              height: 'clamp(120px, 30vw, 150px)',
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45), 0 0 20px rgba(52, 211, 153, 0.25)',
              overflow: 'hidden',
              padding: '10px',
            }}
          >
            <img
              src="/icons/icon-192x192.png"
              alt="EARPI Crest"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                animation: 'logoBreath 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1
          style={{
            margin: '0 0 6px',
            fontSize: 'clamp(28px, 7vw, 36px)',
            fontWeight: 900,
            letterSpacing: '0.12em',
            color: '#ffffff',
            textAlign: 'center',
            textShadow: '0 2px 14px rgba(16, 185, 129, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span>E</span>
          <span style={{ color: '#34d399' }}>A</span>
          <span>R</span>
          <span style={{ color: '#34d399' }}>P</span>
          <span>I</span>
        </h1>

        <p
          style={{
            margin: '0 0 16px',
            fontSize: 'clamp(12px, 3vw, 13.5px)',
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: '#94d8bc',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          Earth Regenerative Projects International
        </p>

        {/* Animated Mission Pillar Ticker */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            height: '28px',
            padding: '4px 14px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#6ee7b7',
            fontSize: 'clamp(11px, 2.8vw, 12.5px)',
            fontWeight: 500,
            transition: 'all 0.3s ease',
          }}
        >
          <span>{MISSION_PILLARS[pillarIndex].icon}</span>
          <span>{MISSION_PILLARS[pillarIndex].label}</span>
        </div>
      </div>

      {/* Bottom Progress Bar & Percentage */}
      <div
        style={{
          width: '100%',
          maxWidth: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          zIndex: 2,
        }}
      >
        {/* Progress Track */}
        <div
          style={{
            width: '100%',
            height: '4px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              borderRadius: '8px',
              background: 'linear-gradient(90deg, #059669, #10b981, #34d399)',
              boxShadow: '0 0 12px #34d399',
              transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>

        {/* Status Line + Percentage */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            fontSize: '11px',
            color: '#719e8c',
            letterSpacing: '0.02em',
          }}
        >
          <span>Initializing West Africa Initiatives…</span>
          <span style={{ color: '#34d399', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {progress}%
          </span>
        </div>

        {/* Tap to skip hint */}
        <span
          style={{
            fontSize: '10.5px',
            color: 'rgba(255, 255, 255, 0.35)',
            marginTop: '4px',
            letterSpacing: '0.04em',
          }}
        >
          Tap anywhere to continue
        </span>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes spinClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes beaconBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes ecoPulseGlow {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.95; }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 25px rgba(16, 185, 129, 0.4); }
          50% { transform: scale(1.03); box-shadow: 0 0 40px rgba(52, 211, 153, 0.65); }
        }
        @keyframes logoBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .flash-loader-container {
          opacity: 1;
          transform: scale(1);
          transition: opacity 0.45s ease-out, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .flash-loader-exit {
          opacity: 0 !important;
          transform: scale(1.05) !important;
          pointer-events: none !important;
        }
      `}</style>
    </div>
  );
}
