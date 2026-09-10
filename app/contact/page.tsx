import type { Metadata } from 'next';
import ContactForm from '@/components/forms/ContactForm';
import Link from 'next/link';
import {
  FacebookIcon,
  XTwitterIcon,
  LinkedInIcon,
  TikTokIcon,
  InstagramIcon,
  YouTubeIcon,
} from '@/components/icons/SocialIcons';

export const metadata: Metadata = {
  title: 'Contact Us | EARPI',
  description:
    'Get in touch with Earth Regenerative Projects International (EARPI). Reach our Freetown, Sierra Leone headquarters or USA office.',
};

export default function ContactPage() {
  return (
    <div className="content-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb-wrap bg-f br-1">
        <div className="container">
          <div className="breadcrumb-title">
            <h2>Contact Us</h2>
            <ul className="breadcrumb-menu list-style">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="contact-us-wrap ptb-100">
        <div className="container">
          <div className="section-title style1 text-center mb-40">
            <span>
              Contact Us <img src="/assets/img/section-shape.png" alt="Shape" />
            </span>
            <h2>Get In Touch With Us</h2>
          </div>
          <div className="row gx-5 justify-content-center">
            <div className="col-lg-8">
              <div className="contact-form">
                <ContactForm />
              </div>
            </div>

            <div className="col-lg-4">
              <div className="contact-item-wrap">
                <div className="contact-item">
                  <h3>Our Address</h3>
                  <p>32 Wallace Johnson Street Freetown, Sierra Leone</p>
                </div>
                <div className="contact-item">
                  <h3>Email Address</h3>
                  <p style={{ margin: '4px 0' }}>
                    <a href="mailto:earthregenerativeprojectsl@gmail.com">
                      earthregenerativeprojectsl@gmail.com
                    </a>
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    <a href="mailto:official@earpi.org">official@earpi.org</a>
                  </p>
                </div>
                <div className="contact-item">
                  <h3>Support Line</h3>
                  <p style={{ margin: '4px 0' }}>
                    <a href="tel:+12024386441">+1 (202) 438-6441 (USA)</a>
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    <a href="tel:+23278046996">+232 78 046996 (Sierra Leone)</a>
                  </p>
                </div>
                <div className="contact-item">
                  <h3>Follow Us</h3>
                  <ul className="social-profile style2 list-style" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: 0, listStyle: 'none' }}>
                    <li>
                      <a href="https://www.facebook.com/earpi.org" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FacebookIcon size={16} />
                      </a>
                    </li>
                    <li>
                      <a href="https://x.com/earpiorg" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <XTwitterIcon size={15} />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/earpi.org/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <InstagramIcon size={16} />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com/company/earpi-org" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LinkedInIcon size={16} />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.youtube.com/@earpiorg" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <YouTubeIcon size={16} />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.tiktok.com/@itservicesfreetown" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TikTokIcon size={16} />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
