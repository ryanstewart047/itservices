'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="back-to-top bounce open"
      aria-label="Back to top"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: 'none',
        background: '#10b981',
        color: '#ffffff',
        borderRadius: '50%',
        width: '46px',
        height: '46px',
        position: 'fixed',
        bottom: '28px',
        left: '28px',
        right: 'auto',
        zIndex: 990,
        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.45)',
        transition: 'transform 0.2s ease, background 0.2s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLButtonElement).style.background = '#059669';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLButtonElement).style.background = '#10b981';
      }}
    >
      <ArrowUp size={22} strokeWidth={2.5} />
    </button>
  );
}

