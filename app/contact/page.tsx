import type { Metadata } from 'next';
import ContactForm from '@/components/forms/ContactForm';
import Link from 'next/link';

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
                  <ul className="social-profile style2 list-style">
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
      </section>
    </div>
  );
}
