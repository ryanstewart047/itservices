'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface ItsAdBannerProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function ItsAdBanner({ className = '', style }: ItsAdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the ad is loaded even on Next.js client-side page transitions
    const triggerAdLoad = () => {
      const el = containerRef.current?.querySelector('.its-ad-unit');
      if (el && !el.getAttribute('data-its-loaded')) {
        const existingScript = document.querySelector('script[src*="its-ads.js"]');
        if (existingScript) {
          const freshScript = document.createElement('script');
          freshScript.src = 'https://itservicesfreetown.com/js/its-ads.js';
          freshScript.async = true;
          document.body.appendChild(freshScript);
        }
      }
    };

    triggerAdLoad();
  }, []);

  return (
    <aside
      aria-label="Sponsored Advertisement"
      className={`its-ad-container-wrap ${className}`}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
      ref={containerRef}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '16px 20px',
          boxSizing: 'border-box',
        }}
      >
        <div className="its-ad-unit"></div>
      </div>
      <Script
        src="https://itservicesfreetown.com/js/its-ads.js"
        strategy="afterInteractive"
      />
    </aside>
  );
}
