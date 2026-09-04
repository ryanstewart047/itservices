'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ text: string; success: boolean } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setResult({
          text: data.message || 'Thank you! Your message has been sent successfully.',
          success: true,
        });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setResult({
          text: data.message || 'Failed to send message. Please try again.',
          success: false,
        });
      }
    } catch {
      setResult({ text: 'Network error. Please try again later.', success: false });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="custom-form" id="customContactForm">
      <div className="row">
        <div className="col-md-6 col-sm-6">
          <div className="form-group mb-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name*"
              required
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              style={{
                height: '52px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                padding: '0 18px',
              }}
            />
          </div>
        </div>
        <div className="col-md-6 col-sm-6">
          <div className="form-group mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email Address*"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              style={{
                height: '52px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                padding: '0 18px',
              }}
            />
          </div>
        </div>
        <div className="col-md-6 col-sm-6">
          <div className="form-group mb-3">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              style={{
                height: '52px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                padding: '0 18px',
              }}
            />
          </div>
        </div>
        <div className="col-md-6 col-sm-6">
          <div className="form-group mb-3">
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="form-control"
              style={{
                height: '52px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                padding: '0 18px',
              }}
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group mb-3">
            <textarea
              name="message"
              placeholder="Your Message*"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="form-control"
              style={{
                borderRadius: '8px',
                border: '1px solid #ddd',
                padding: '14px 18px',
              }}
            ></textarea>
          </div>
        </div>

        {result && (
          <div className="col-12 mb-3">
            <div
              style={{
                padding: '12px 18px',
                borderRadius: '8px',
                backgroundColor: result.success ? '#e8f5e9' : '#ffebee',
                color: result.success ? '#2e7d32' : '#c62828',
                fontWeight: '500',
              }}
            >
              {result.text}
            </div>
          </div>
        )}

        <div className="col-12">
          <button
            type="submit"
            disabled={submitting}
            className="btn style1"
            style={{
              backgroundColor: '#338F7A',
              color: '#fff',
              border: 'none',
              padding: '14px 34px',
              borderRadius: '25px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {submitting ? 'Sending Message...' : 'Send Message'}
          </button>
        </div>
      </div>
    </form>
  );
}
