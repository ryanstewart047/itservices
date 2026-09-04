'use client';

import { useEffect } from 'react';

export default function GlobalFormHandler() {
  useEffect(() => {
    const handleFormSubmit = async (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (!form || !(form instanceof HTMLFormElement)) return;

      // Skip custom react-managed forms that already have their own explicit handlers
      if (
        form.id === 'customContactForm' ||
        form.closest('.newsletter-form') ||
        form.getAttribute('data-managed') === 'true'
      ) {
        return;
      }

      // Check if it's a legacy static form or widget form (action = '#' or 'process_form.php' or class includes register-widget)
      const action = form.getAttribute('action') || '';
      const isLegacyForm =
        form.classList.contains('register-widget') ||
        form.classList.contains('donation-form') ||
        action === '#' ||
        action.includes('process_form') ||
        action.includes('form-process');

      if (!isLegacyForm) return;

      // Intercept the submission
      e.preventDefault();
      e.stopPropagation();

      // Gather form inputs
      const formData = new FormData(form);
      const name = (formData.get('custom_name') || formData.get('name') || formData.get('fname') || '') as string;
      const email = (formData.get('custom_email') || formData.get('email') || '') as string;
      const phone = (formData.get('number') || formData.get('phone') || formData.get('phone_number') || '') as string;
      const subject = (formData.get('subject') || formData.get('msg_subject') || '') as string;
      const message = (formData.get('msg') || formData.get('message') || '') as string;

      // Check for event selection if in an event registration widget
      const selectEl = form.querySelector('select');
      const selectedOption = selectEl?.options[selectEl.selectedIndex]?.text;
      const eventSubject = selectedOption && selectedOption !== 'Select Event' ? `Event: ${selectedOption}` : subject;

      // Find or create feedback container in form
      let feedbackEl = form.querySelector('.global-form-feedback') as HTMLElement;
      if (!feedbackEl) {
        feedbackEl = document.createElement('div');
        feedbackEl.className = 'global-form-feedback';
        feedbackEl.style.marginTop = '12px';
        feedbackEl.style.padding = '10px 14px';
        feedbackEl.style.borderRadius = '8px';
        feedbackEl.style.fontSize = '13px';
        feedbackEl.style.lineHeight = '1.4';
        feedbackEl.style.display = 'none';
        form.appendChild(feedbackEl);
      }

      const showFeedback = (text: string, isSuccess: boolean) => {
        feedbackEl.style.display = 'block';
        feedbackEl.style.backgroundColor = isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
        feedbackEl.style.border = isSuccess ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)';
        feedbackEl.style.color = isSuccess ? '#34d399' : '#fca5a5';
        feedbackEl.innerText = text;
      };

      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        showFeedback('Please enter a valid email address.', false);
        return;
      }

      const dotCount = (cleanEmail.match(/\./g) || []).length;
      if (dotCount > 2) {
        showFeedback('Invalid email: emails containing more than two dots are not accepted.', false);
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      const origBtnText = submitBtn ? submitBtn.innerText : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Submitting...';
      }

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim() || 'Website Visitor',
            email: cleanEmail,
            phone: phone.trim(),
            subject: eventSubject || `Inquiry from ${window.location.pathname}`,
            message: message.trim() || `Inquiry submitted via ${window.location.pathname} sidebar form.`,
            page: window.location.pathname,
          }),
        });

        const data = await res.json();
        if (res.ok && data.status === 'success') {
          showFeedback('✓ Thank you! Your message has been received. A confirmation has been sent to your email.', true);
          form.reset();
        } else {
          showFeedback(data.message || 'Submission failed. Please try again.', false);
        }
      } catch {
        showFeedback('Network connection error. Please try again.', false);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = origBtnText || 'Submit';
        }
      }
    };

    document.addEventListener('submit', handleFormSubmit, true);
    return () => {
      document.removeEventListener('submit', handleFormSubmit, true);
    };
  }, []);

  return null;
}
