'use client';

import { useEffect, useState } from 'react';

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('clim_theme');
    if (savedTheme === 'theme-dark') {
      setIsDark(true);
      document.documentElement.className = 'theme-dark';
    } else {
      setIsDark(false);
      document.documentElement.className = 'theme-light';
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'theme-light' : 'theme-dark';
    setIsDark(!isDark);
    localStorage.setItem('clim_theme', newTheme);
    document.documentElement.className = newTheme;
  };

  return (
    <div className="switch-theme-mode" style={{ position: 'fixed', top: '150px', right: '15px', zIndex: 999 }}>
      <label id="switch" className="switch" title="Toggle Light / Dark Mode">
        <input type="checkbox" checked={!isDark} onChange={toggleTheme} id="slider" />
        <span className="slider round"></span>
      </label>
    </div>
  );
}
