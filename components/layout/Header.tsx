'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const toggleDropdown = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className={`header-wrap ${isSticky ? 'sticky' : ''}`}>
      {/* Header Top Bar */}
      <div className="header-top">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-8">
              <div className="header-top-left">
                <div
                  style={{
                    backgroundColor: '#338F7A',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    marginBottom: '6px',
                    display: 'inline-block',
                  }}
                >
                  USA Non-profit Corporation Registration MA 001751059; EIN: 99-0979318
                </div>
                <ul className="contact-info list-style">
                  <li>
                    <i className="flaticon-phone-call"></i>
                    <a href="tel:+12024386441">+1 (202) 438-6441</a>
                  </li>
                  <li>
                    <i className="flaticon-email-2"></i>
                    <a href="mailto:official@earpi.org">official@earpi.org</a>
                  </li>
                  <li>
                    <i className="flaticon-pin"></i>
                    <p>32 Wallace Johnson St Freetown SL</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="header-top-right">
                <div className="select-lang">
                  <i className="ri-earth-fill"></i>
                  <span style={{ fontSize: '13px', color: '#fff', marginLeft: '5px' }}>Global (EN)</span>
                </div>
                <ul className="social-profile list-style style1">
                  <li>
                    <a href="https://facebook.com/itservicefreetown" target="_blank" rel="noopener noreferrer">
                      <i className="ri-facebook-fill"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://twitter.com/earpsierraleone" target="_blank" rel="noopener noreferrer">
                      <i className="ri-twitter-fill"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/in/ryan-josiah-stewart-19808a152/" target="_blank" rel="noopener noreferrer">
                      <i className="ri-linkedin-fill"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.tiktok.com/@itservicesfreetown" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-tiktok"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Navigation */}
      <div className="header-bottom">
        <div className="container">
          <nav className="navbar navbar-expand-md navbar-light">
            <Link className="navbar-brand" href="/">
              <img className="logo-light" src="/assets/img/logo.png" alt="EARPI Logo" style={{ maxHeight: '60px' }} />
              <img className="logo-dark" src="/assets/img/logo-white.png" alt="EARPI Logo" style={{ maxHeight: '60px' }} />
            </Link>

            {/* Mobile Hamburger Button */}
            <div className="mobile-bar-wrap d-lg-none">
              <button
                type="button"
                className="mobile-menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation"
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '28px',
                  color: '#338F7A',
                  cursor: 'pointer',
                }}
              >
                <i className={mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}></i>
              </button>
            </div>

            {/* Main Menu Links */}
            <div className={`collapse navbar-collapse main-menu-wrap ${mobileMenuOpen ? 'open' : ''}`} id="navbarSupportedContent">
              <div className="menu-close d-lg-none" onClick={() => setMobileMenuOpen(false)}>
                <i className="ri-close-line"></i>
              </div>
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
                    About Us
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/projects" className={`nav-link ${pathname.startsWith('/project') ? 'active' : ''}`}>
                    Projects
                  </Link>
                </li>

                <li className={`nav-item has-dropdown ${openDropdown === 'priorities' ? 'menu-open' : ''}`}>
                  <a
                    href="#priorities"
                    className={`nav-link ${pathname.startsWith('/priority') ? 'active' : ''}`}
                    onClick={(e) => toggleDropdown('priorities', e)}
                  >
                    Priorities <i className="ri-arrow-down-s-line"></i>
                  </a>
                  <ul className={`dropdown-menu ${openDropdown === 'priorities' ? 'show d-block' : ''}`}>
                    <li className="nav-item">
                      <Link href="/priority-one" className="nav-link">
                        Priority 1: Ecosystem Restoration
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/priority-two" className="nav-link">
                        Priority 2: Renewable Clean Energy
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/priority-three" className="nav-link">
                        Priority 3: Regenerative Agriculture
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/priority-four" className="nav-link">
                        Priority 4: Climate Education
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/priority-five" className="nav-link">
                        Priority 5: Water &amp; Climate Adaptation
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className={`nav-item has-dropdown ${openDropdown === 'people' ? 'menu-open' : ''}`}>
                  <a
                    href="#people"
                    className={`nav-link ${pathname === '/team' || pathname === '/ambassadors' ? 'active' : ''}`}
                    onClick={(e) => toggleDropdown('people', e)}
                  >
                    People <i className="ri-arrow-down-s-line"></i>
                  </a>
                  <ul className={`dropdown-menu ${openDropdown === 'people' ? 'show d-block' : ''}`}>
                    <li className="nav-item">
                      <Link href="/team" className="nav-link">
                        Board &amp; Leadership
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/ambassadors" className="nav-link">
                        Global Ambassadors
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className={`nav-item has-dropdown ${openDropdown === 'more' ? 'menu-open' : ''}`}>
                  <a
                    href="#more"
                    className="nav-link"
                    onClick={(e) => toggleDropdown('more', e)}
                  >
                    More <i className="ri-arrow-down-s-line"></i>
                  </a>
                  <ul className={`dropdown-menu ${openDropdown === 'more' ? 'show d-block' : ''}`}>
                    <li className="nav-item">
                      <Link href="/event" className="nav-link">
                        Events
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/faq" className="nav-link">
                        FAQ
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/privacy-policy" className="nav-link">
                        Privacy Policy
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/terms-of-service" className="nav-link">
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <Link href="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
                    Contact
                  </Link>
                </li>
              </ul>

              <div className="others-options md-none">
                <div className="header-btn">
                  <Link href="/donation" className="btn style1">
                    Donate Now <i className="ri-heart-line"></i>
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
