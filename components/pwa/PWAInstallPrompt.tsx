'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as installed standalone app
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Check if user dismissed prompt recently (last 5 days)
    const dismissedAt = localStorage.getItem('earpi_pwa_dismissed');
    if (dismissedAt) {
      const days = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (days < 5) {
        return;
      }
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // If iOS and not standalone, show installation guide after 4s
    if (isIOSDevice) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000);
      return () => clearTimeout(timer);
    }

    // For Android / Chrome / Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('[PWA] User accepted the EARPI app install prompt');
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('earpi_pwa_dismissed', Date.now().toString());
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        maxWidth: '440px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.22)',
        padding: '16px',
        zIndex: 9999,
        border: '1px solid #e0f2fe',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        animation: 'slideUp 0.4s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <img
          src="/assets/img/logo.png"
          alt="EARPI App"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            objectFit: 'contain',
            backgroundColor: '#f4fbf9',
            padding: '4px',
            border: '1px solid #338F7A',
          }}
        />
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontSize: '15px', color: '#111', fontWeight: 'bold' }}>
            Install EARPI App
          </h4>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
            {isIOS
              ? "Add to your iPhone Home Screen for the full native experience."
              : "Install our native-like app for fast access and offline project updates."}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss app install prompt"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#888',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          ×
        </button>
      </div>

      {isIOS ? (
        <div
          style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '10px 12px',
            fontSize: '12.5px',
            color: '#334155',
            lineHeight: '1.5',
          }}
        >
          1. Tap the Share button{' '}
          <span style={{ display: 'inline-block', fontWeight: 'bold' }}>⎋</span> in Safari.<br />
          2. Scroll down and select{' '}
          <span style={{ fontWeight: 'bold', color: '#338F7A' }}>&quot;Add to Home Screen&quot;</span>.
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleDismiss}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              backgroundColor: 'transparent',
              color: '#666',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Not Now
          </button>
          <button
            onClick={handleInstallClick}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#338F7A',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <i className="ri-download-2-line"></i> Install App
          </button>
        </div>
      )}
    </div>
  );
}
