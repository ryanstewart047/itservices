'use client';

import { useEffect, useState } from 'react';

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
        background: '#338F7A',
        color: '#fff',
        borderRadius: '50%',
        width: '45px',
        height: '45px',
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 990,
        boxShadow: '0 4px 15px rgba(51, 143, 122, 0.4)',
        transition: 'all 0.3s ease',
      }}
    >
      <i className="ri-arrow-up-s-line" style={{ fontSize: '24px' }}></i>
    </button>
  );
}
