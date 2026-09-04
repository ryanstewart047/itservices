'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [mobileMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

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
                  USA 501(c)(3) Non-Profit • EIN: 99-0979318
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
                <div className="social-profile list-style">
                  <ul>
                    <li><a href="https://www.facebook.com/earpi.org" target="_blank" rel="noreferrer"><i className="ri-facebook-fill"></i></a></li>
                    <li><a href="https://x.com/earpiorg" target="_blank" rel="noreferrer"><i className="ri-twitter-x-line"></i></a></li>
                    <li><a href="https://www.instagram.com/earpi.org/" target="_blank" rel="noreferrer"><i className="ri-instagram-line"></i></a></li>
                    <li><a href="https://www.linkedin.com/company/earpi-org" target="_blank" rel="noreferrer"><i className="ri-linkedin-fill"></i></a></li>
                    <li><a href="https://www.youtube.com/@earpiorg" target="_blank" rel="noreferrer"><i className="ri-youtube-fill"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Navigation */}
      <div className="header-bottom">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light" style={{ position: 'relative' }}>
            <Link className="navbar-brand" href="/">
              <img className="logo-light" src="/assets/img/logo.png" alt="EARPI Logo" style={{ maxHeight: '60px' }} />
              <img className="logo-dark" src="/assets/img/logo-white.png" alt="EARPI Logo" style={{ maxHeight: '60px' }} />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="d-lg-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
              style={{
                background: 'transparent',
                border: '2px solid #338F7A',
                borderRadius: '6px',
                padding: '6px 10px',
                cursor: 'pointer',
                marginLeft: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {mobileMenuOpen ? (
                <i className="ri-close-line" style={{ fontSize: '22px', color: '#338F7A', lineHeight: 1 }}></i>
              ) : (
                <>
                  <span style={{ display: 'block', width: '22px', height: '2px', background: '#338F7A' }}></span>
                  <span style={{ display: 'block', width: '22px', height: '2px', background: '#338F7A' }}></span>
                  <span style={{ display: 'block', width: '22px', height: '2px', background: '#338F7A' }}></span>
                </>
              )}
            </button>

            {/* Mobile Backdrop */}
            {mobileMenuOpen && (
              <div
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  zIndex: 998,
                }}
              />
            )}

            {/* Main Menu — visible on desktop always, sliding panel on mobile */}
            <div
              ref={menuRef}
              style={{
                /* Desktop: normal flex row */
                /* Mobile: slide-in panel from left */
              }}
              className="main-menu-wrap"
              // Override Bootstrap's collapse hiding with inline styles
              {...({
                style: {
                  // On desktop (lg+): reset to flex
                  // On mobile: full-height overlay
                  position: 'fixed' as const,
                  top: 0,
                  left: mobileMenuOpen ? 0 : '-100%',
                  width: '280px',
                  height: '100vh',
                  background: '#0d2b22',
                  zIndex: 999,
                  overflowY: 'auto' as const,
                  transition: 'left 0.35s cubic-bezier(.4,0,.2,1)',
                  padding: '60px 24px 40px',
                  display: 'flex',
                  flexDirection: 'column' as const,
                },
              })}
              id="navbarSupportedContent"
            >
              {/* Mobile close button inside panel */}
              <button
                className="d-lg-none"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <i className="ri-close-line"></i>
              </button>

              <ul className="navbar-nav ms-auto" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
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

                {/* Donate button inside mobile menu */}
                <li className="nav-item d-lg-none" style={{ marginTop: '16px' }}>
                  <Link href="/donation" className="btn style1" style={{ display: 'block', textAlign: 'center' }}>
                    Donate Now <i className="ri-heart-line"></i>
                  </Link>
                </li>
              </ul>

              {/* Desktop-only Donate button (outside ul) */}
              <div className="others-options d-none d-lg-flex">
                <div className="header-btn">
                  <Link href="/donation" className="btn style1">
                    Donate Now <i className="ri-heart-line"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Desktop menu override — show as normal flex on large screens */}
            <style>{`
              @media (min-width: 992px) {
                .main-menu-wrap {
                  position: static !important;
                  width: auto !important;
                  height: auto !important;
                  background: transparent !important;
                  padding: 0 !important;
                  flex-direction: row !important;
                  overflow: visible !important;
                  transition: none !important;
                  display: flex !important;
                  align-items: center !important;
                  flex: 1 !important;
                }
                .main-menu-wrap .navbar-nav {
                  flex-direction: row !important;
                  align-items: center !important;
                  gap: 4px !important;
                }
                .main-menu-wrap .nav-link {
                  color: inherit !important;
                  padding: 8px 12px !important;
                  border-bottom: none !important;
                  font-size: 15px !important;
                }
                .main-menu-wrap .others-options {
                  margin-left: auto !important;
                }
                .main-menu-wrap > button.d-lg-none {
                  display: none !important;
                }
              }
              @media (max-width: 991.98px) {
                .main-menu-wrap .nav-link {
                  color: #d1f7e8 !important;
                  padding: 13px 0 !important;
                  border-bottom: 1px solid rgba(255,255,255,0.1) !important;
                  font-size: 15px !important;
                  display: block !important;
                }
                .main-menu-wrap .nav-link.active {
                  color: #34d399 !important;
                }
                .main-menu-wrap .dropdown-menu {
                  background: rgba(255,255,255,0.06) !important;
                  border: none !important;
                  border-radius: 8px !important;
                  padding: 8px 0 8px 16px !important;
                  margin-top: 4px !important;
                  position: static !important;
                  float: none !important;
                  box-shadow: none !important;
                }
                .main-menu-wrap .dropdown-menu .nav-link {
                  font-size: 13.5px !important;
                  padding: 10px 0 !important;
                  border-bottom: 1px solid rgba(255,255,255,0.07) !important;
                }
                .main-menu-wrap .others-options {
                  display: none !important;
                }
              }
            `}</style>
          </nav>
        </div>
      </div>
    </header>
  );
}
