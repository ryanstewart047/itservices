import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { getUpload } from './db';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Strip HTML tags to produce a clean plain-text alternative (crucial for anti-spam scoring)
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '$2 ($1)')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&bull;/g, '•')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

// Reusable Transporter resolution (Gmail, Custom SMTP, or Resend fallback)
function getTransporter() {
  // 1. Custom SMTP
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // 2. Gmail SMTP with App Password
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  }

  return null;
}

function getFromAddress(): string {
  if (process.env.SMTP_FROM) return process.env.SMTP_FROM;
  if (process.env.GMAIL_USER) return `"EARPI" <${process.env.GMAIL_USER}>`;
  return '"EARPI" <official@earpi.org>';
}

function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || process.env.GMAIL_USER || process.env.SMTP_USER || 'official@earpi.org';
}

/**
 * Send email using Nodemailer, or Resend API fallback, with full anti-spam headers & plain-text MIME alternative
 */
async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: any[];
  headers?: Record<string, string>;
}): Promise<EmailResult> {
  const from = getFromAddress();
  const plainText = options.text || stripHtml(options.html);

  // Industry-standard anti-spam deliverability headers (enforced by Google & Yahoo)
  const antiSpamHeaders: Record<string, string> = {
    'List-Unsubscribe': `<mailto:official@earpi.org?subject=Unsubscribe%20${encodeURIComponent(options.to)}>, <https://earpi.org/contact>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    'Precedence': 'bulk',
    'X-Auto-Response-Suppress': 'OOF, AutoReply',
    ...options.headers,
  };

  // 1. Try Nodemailer (SMTP or Gmail)
  const transporter = getTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: plainText,
        replyTo: options.replyTo || 'official@earpi.org',
        headers: antiSpamHeaders,
        attachments: options.attachments,
      });
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error('[Nodemailer Error]:', err.message);
      // Fall through to Resend attempt if available
    }
  }

  // 2. Try Resend API if RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'EARPI <onboarding@resend.dev>',
          to: [options.to],
          subject: options.subject,
          html: options.html,
          text: plainText,
          reply_to: options.replyTo || 'official@earpi.org',
          headers: antiSpamHeaders,
          attachments: options.attachments,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, messageId: data.id };
      }
      console.warn('[Resend API Error]:', data);
    } catch (err: any) {
      console.error('[Resend Fetch Error]:', err.message);
    }
  }

  // 3. Fallback: Log simulation in dev / unconfigured environments
  console.log(`[Email Dispatched (Simulated)]: To: ${options.to} | Subject: "${options.subject}"`);
  return { success: true, messageId: `simulated-${Date.now()}` };
}

// ─────────────────────────────────────────────────────────────────────────────
// Branded Email Wrapper (Anti-Spam & Mobile-Optimized)
// ─────────────────────────────────────────────────────────────────────────────
function wrapBrandedEmail(title: string, contentHtml: string, recipientEmail?: string): string {
  const unsubUrl = recipientEmail
    ? `https://earpi.org/contact?action=unsubscribe&email=${encodeURIComponent(recipientEmail)}`
    : 'https://earpi.org/contact?action=unsubscribe';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
      height: auto;
      max-width: 100%;
    }
    @media only screen and (max-width: 600px) {
      .email-shell {
        padding: 8px 4px !important;
      }
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 8px !important;
      }
      .email-header-cell {
        padding: 20px 16px !important;
      }
      .email-body-cell {
        padding: 20px 16px !important;
      }
      .email-footer-cell {
        padding: 18px 14px !important;
      }
      .responsive-image {
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
      }
      .btn-cta {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        padding: 14px 16px !important;
        text-align: center !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#061a14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" class="email-shell" style="background-color:#061a14;padding:24px 12px;margin:0 auto;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" class="email-container" style="max-width:580px;background-color:#0c261e;border:1px solid rgba(52,199,89,0.25);border-radius:14px;overflow:hidden;box-shadow:0 12px 35px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td class="email-header-cell" style="background:linear-gradient(135deg, #061a14 0%, #0c2e22 100%);padding:26px 24px;border-bottom:1px solid rgba(52,199,89,0.18);text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:1px;">EARPI</h1>
              <p style="margin:4px 0 0;color:#34d399;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;">Earth Regenerative Projects International</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="email-body-cell" style="padding:28px 24px;color:#e6f4ee;font-size:14.5px;line-height:1.7;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer (Complies with CAN-SPAM and Anti-Spam Guidelines) -->
          <tr>
            <td class="email-footer-cell" style="background-color:#051410;padding:22px 24px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;color:#7b958c;font-size:11.5px;line-height:1.6;">
              <p style="margin:0 0 4px;color:#a7b8b2;font-weight:700;">
                USA Non-profit Corporation Registration MA 001751059; EIN: 99-0979318
              </p>
              <p style="margin:0 0 8px;">
                Headquarters: 32 Wallace Johnson St, Freetown, Sierra Leone
              </p>
              <p style="margin:0 0 12px;">
                <a href="https://earpi.org" style="color:#34d399;text-decoration:none;font-weight:600;">Website</a> &bull; 
                <a href="https://earpi.org/projects" style="color:#34d399;text-decoration:none;font-weight:600;">Projects</a> &bull; 
                <a href="https://earpi.org/donation" style="color:#34d399;text-decoration:none;font-weight:600;">Donate</a>
              </p>
              <p style="margin:0;font-size:11px;color:#557467;line-height:1.5;border-top:1px solid rgba(255,255,255,0.05);padding-top:10px;">
                You are receiving this official field dispatch because you subscribed to updates at earpi.org.<br/>
                To manage your preferences or unsubscribe, <a href="${unsubUrl}" style="color:#34d399;text-decoration:underline;">click here to unsubscribe</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Newsletter Subscriber Handler
// ─────────────────────────────────────────────────────────────────────────────
export async function handleNewSubscriber(email: string, name?: string): Promise<EmailResult> {
  const adminEmail = getAdminEmail();
  const subscriberName = name?.trim() || 'Friend of EARPI';

  // 1. Send confirmation to subscriber
  const userHtml = wrapBrandedEmail(
    'Welcome to EARPI',
    `
      <h2 style="color:#ffffff;font-size:20px;margin:0 0 16px;">Welcome to the EARPI Community, ${subscriberName}! 🌱</h2>
      <p style="color:#b3cbbf;margin:0 0 16px;">
        Thank you for subscribing to Earth Regenerative Projects International (EARPI). You are now connected to our grassroots climate action network across West Africa.
      </p>

      <div style="background-color:rgba(16,185,129,0.08);border-left:3px solid #10b981;border-radius:6px;padding:14px 16px;margin:20px 0;">
        <p style="margin:0;color:#34d399;font-weight:700;font-size:13px;">What you will receive:</p>
        <ul style="margin:8px 0 0;padding-left:18px;color:#b3cbbf;font-size:13px;line-height:1.6;">
          <li>Quarterly verified ecological audits and tree counts</li>
          <li>Field updates on coastal mangrove restoration in Sierra Leone</li>
          <li>Invitations to international climate summits and webinars</li>
        </ul>
      </div>

      <p style="color:#b3cbbf;margin:0 0 24px;">
        Every seedling planted and every clean cookstove installed brings us one step closer to resilient, self-sustaining coastal ecosystems.
      </p>

      <div style="text-align:center;margin:24px 0 10px;">
        <a href="https://earpi.org/projects" style="background-color:#10b981;color:#06281e;padding:12px 26px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;display:inline-block;box-shadow:0 4px 14px rgba(16,185,129,0.35);">
          Explore Active Projects →
        </a>
      </div>
    `
  );

  await sendEmail({
    to: email,
    subject: 'Welcome to EARPI - Earth Regenerative Projects International',
    html: userHtml,
  });

  // 2. Alert Admin
  const adminHtml = wrapBrandedEmail(
    'New Newsletter Subscriber',
    `
      <h2 style="color:#ffffff;font-size:18px;margin:0 0 14px;">📬 New Newsletter Subscriber</h2>
      <p style="color:#b3cbbf;margin:0 0 16px;">A new user has subscribed to the EARPI newsletter.</p>
      <table width="100%" cellpadding="8" cellspacing="0" style="background:rgba(0,0,0,0.25);border-radius:8px;font-size:13px;color:#d1fae5;">
        <tr><td width="30%" style="color:#8aa69b;">Name:</td><td><strong>${subscriberName}</strong></td></tr>
        <tr><td style="color:#8aa69b;">Email:</td><td><strong><a href="mailto:${email}" style="color:#34d399;">${email}</a></strong></td></tr>
        <tr><td style="color:#8aa69b;">Time:</td><td>${new Date().toLocaleString()}</td></tr>
      </table>
    `
  );

  return sendEmail({
    to: adminEmail,
    subject: `[New Subscriber] ${email}`,
    html: adminHtml,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Contact Message Handler
// ─────────────────────────────────────────────────────────────────────────────
export async function handleContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  page?: string;
}): Promise<EmailResult> {
  const adminEmail = getAdminEmail();
  const subjectText = data.subject?.trim() || 'General Inquiry';

  // 1. Send Acknowledgment to Sender
  const userHtml = wrapBrandedEmail(
    'Message Received - EARPI',
    `
      <h2 style="color:#ffffff;font-size:20px;margin:0 0 16px;">We Received Your Message, ${data.name}!</h2>
      <p style="color:#b3cbbf;margin:0 0 16px;">
        Thank you for contacting Earth Regenerative Projects International. We have received your inquiry regarding <strong>"${subjectText}"</strong>.
      </p>
      <div style="background-color:rgba(0,0,0,0.25);border-radius:8px;padding:16px;margin:18px 0;border:1px solid rgba(255,255,255,0.06);">
        <p style="margin:0 0 6px;color:#8aa69b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Summary of your message:</p>
        <p style="margin:0;color:#e6f4ee;font-size:13px;white-space:pre-wrap;line-height:1.5;">${data.message}</p>
      </div>
      <p style="color:#b3cbbf;margin:0 0 16px;">
        A member of our team in Freetown or the USA will review your message and respond promptly.
      </p>
    `
  );

  await sendEmail({
    to: data.email,
    subject: `We received your message: ${subjectText} - EARPI`,
    html: userHtml,
  });

  // 2. Alert Admin
  const adminHtml = wrapBrandedEmail(
    'New Contact Message',
    `
      <h2 style="color:#ffffff;font-size:18px;margin:0 0 14px;">💬 New Contact Inquiry</h2>
      <table width="100%" cellpadding="8" cellspacing="0" style="background:rgba(0,0,0,0.25);border-radius:8px;font-size:13px;color:#d1fae5;margin-bottom:18px;">
        <tr><td width="30%" style="color:#8aa69b;">Name:</td><td><strong>${data.name}</strong></td></tr>
        <tr><td style="color:#8aa69b;">Email:</td><td><strong><a href="mailto:${data.email}" style="color:#34d399;">${data.email}</a></strong></td></tr>
        <tr><td style="color:#8aa69b;">Phone:</td><td>${data.phone || 'Not provided'}</td></tr>
        <tr><td style="color:#8aa69b;">Subject:</td><td><strong>${subjectText}</strong></td></tr>
        ${data.page ? `<tr><td style="color:#8aa69b;">Origin Page:</td><td>${data.page}</td></tr>` : ''}
        <tr><td style="color:#8aa69b;">Time:</td><td>${new Date().toLocaleString()}</td></tr>
      </table>

      <div style="background-color:rgba(16,185,129,0.08);border-left:3px solid #10b981;border-radius:6px;padding:16px;">
        <p style="margin:0 0 6px;color:#34d399;font-weight:700;font-size:12px;text-transform:uppercase;">Message:</p>
        <p style="margin:0;color:#ffffff;font-size:13.5px;white-space:pre-wrap;line-height:1.6;">${data.message}</p>
      </div>
    `
  );

  return sendEmail({
    to: adminEmail,
    subject: `[Contact Inquiry] ${subjectText} from ${data.name}`,
    html: adminHtml,
    replyTo: data.email,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Donation / Pledge Handler
// ─────────────────────────────────────────────────────────────────────────────
export async function handleNewDonation(data: {
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  frequency: string;
  projectName?: string;
  paymentMethod: string;
  notes?: string;
}): Promise<EmailResult> {
  const adminEmail = getAdminEmail();
  const formattedAmount = `$${Number(data.amount).toLocaleString()} ${data.currency}`;
  const designation = data.projectName || 'General Ecological Fund';

  // 1. Send Tax-Deductible Receipt to Donor
  const donorHtml = wrapBrandedEmail(
    'Donation Receipt & Appreciation - EARPI',
    `
      <h2 style="color:#ffffff;font-size:20px;margin:0 0 16px;">Thank You For Your Generous Support, ${data.donorName}! 💚</h2>
      <p style="color:#b3cbbf;margin:0 0 16px;">
        On behalf of Earth Regenerative Projects International (EARPI) and the coastal communities of Sierra Leone, thank you for your contribution of <strong style="color:#10b981;font-size:16px;">${formattedAmount}</strong> (${data.frequency}).
      </p>

      <div style="background-color:rgba(0,0,0,0.25);border-radius:8px;padding:18px;margin:20px 0;border:1px solid rgba(16,185,129,0.25);">
        <table width="100%" cellpadding="6" cellspacing="0" style="font-size:13px;color:#d1fae5;">
          <tr><td width="40%" style="color:#8aa69b;">Contribution Amount:</td><td><strong style="color:#10b981;font-size:15px;">${formattedAmount}</strong></td></tr>
          <tr><td style="color:#8aa69b;">Frequency:</td><td>${data.frequency.toUpperCase()}</td></tr>
          <tr><td style="color:#8aa69b;">Designated Program:</td><td><strong>${designation}</strong></td></tr>
          <tr><td style="color:#8aa69b;">Payment Channel:</td><td>${data.paymentMethod}</td></tr>
          <tr><td style="color:#8aa69b;">Date:</td><td>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
        </table>
      </div>

      <div style="background-color:rgba(16,185,129,0.08);border-left:3px solid #10b981;border-radius:6px;padding:14px 16px;margin:20px 0;font-size:12.5px;color:#b3cbbf;line-height:1.5;">
        <strong style="color:#34d399;">Non-Profit Tax Exemption Notice:</strong><br/>
        EARPI is a registered USA 501(c)(3) non-profit organization (MA 001751059; EIN: 99-0979318). No goods or services were provided in exchange for this contribution other than intangible religious or charitable benefits. Please retain this email for your tax records.
      </div>

      <p style="color:#b3cbbf;margin:0 0 10px;">
        Your funds directly power field seed planting, coastal mangrove replanting, and environmental education scholarships.
      </p>
    `
  );

  await sendEmail({
    to: data.donorEmail,
    subject: `Thank you for supporting EARPI! Receipt for ${formattedAmount}`,
    html: donorHtml,
  });

  // 2. Alert Admin
  const adminHtml = wrapBrandedEmail(
    'New Donation Logged',
    `
      <h2 style="color:#10b981;font-size:18px;margin:0 0 14px;">🎉 New Donation Contribution</h2>
      <table width="100%" cellpadding="8" cellspacing="0" style="background:rgba(0,0,0,0.25);border-radius:8px;font-size:13px;color:#d1fae5;">
        <tr><td width="35%" style="color:#8aa69b;">Donor Name:</td><td><strong>${data.donorName}</strong></td></tr>
        <tr><td style="color:#8aa69b;">Donor Email:</td><td><strong><a href="mailto:${data.donorEmail}" style="color:#34d399;">${data.donorEmail}</a></strong></td></tr>
        <tr><td style="color:#8aa69b;">Amount:</td><td><strong style="color:#10b981;font-size:16px;">${formattedAmount}</strong> (${data.frequency})</td></tr>
        <tr><td style="color:#8aa69b;">Designation:</td><td><strong>${designation}</strong></td></tr>
        <tr><td style="color:#8aa69b;">Method:</td><td>${data.paymentMethod}</td></tr>
        ${data.notes ? `<tr><td style="color:#8aa69b;">Notes:</td><td>${data.notes}</td></tr>` : ''}
        <tr><td style="color:#8aa69b;">Time:</td><td>${new Date().toLocaleString()}</td></tr>
      </table>
    `
  );

  return sendEmail({
    to: adminEmail,
    subject: `[Donation Received] ${formattedAmount} from ${data.donorName}`,
    html: adminHtml,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Event / Program Registration Handler
// ─────────────────────────────────────────────────────────────────────────────
export async function handleEventRegistration(data: {
  name: string;
  email: string;
  phone?: string;
  eventName: string;
  notes?: string;
}): Promise<EmailResult> {
  const adminEmail = getAdminEmail();

  // 1. Send confirmation to registrant
  const userHtml = wrapBrandedEmail(
    'Event Registration Confirmed - EARPI',
    `
      <h2 style="color:#ffffff;font-size:20px;margin:0 0 16px;">Registration Confirmed, ${data.name}! 🎟️</h2>
      <p style="color:#b3cbbf;margin:0 0 16px;">
        Thank you for registering for <strong>${data.eventName}</strong> with Earth Regenerative Projects International.
      </p>
      <div style="background-color:rgba(16,185,129,0.08);border-left:3px solid #10b981;border-radius:6px;padding:14px 16px;margin:18px 0;">
        <p style="margin:0;color:#34d399;font-weight:700;font-size:13px;">Event: ${data.eventName}</p>
        <p style="margin:4px 0 0;color:#b3cbbf;font-size:12.5px;">We will email you full venue, schedule, and participation details as the event date approaches.</p>
      </div>
    `
  );

  await sendEmail({
    to: data.email,
    subject: `Registration Confirmed: ${data.eventName} - EARPI`,
    html: userHtml,
  });

  // 2. Alert Admin
  const adminHtml = wrapBrandedEmail(
    'New Event Registration',
    `
      <h2 style="color:#ffffff;font-size:18px;margin:0 0 14px;">🎟️ New Event Registration</h2>
      <table width="100%" cellpadding="8" cellspacing="0" style="background:rgba(0,0,0,0.25);border-radius:8px;font-size:13px;color:#d1fae5;">
        <tr><td width="30%" style="color:#8aa69b;">Event:</td><td><strong>${data.eventName}</strong></td></tr>
        <tr><td style="color:#8aa69b;">Name:</td><td><strong>${data.name}</strong></td></tr>
        <tr><td style="color:#8aa69b;">Email:</td><td><strong><a href="mailto:${data.email}" style="color:#34d399;">${data.email}</a></strong></td></tr>
        <tr><td style="color:#8aa69b;">Phone:</td><td>${data.phone || 'Not provided'}</td></tr>
        <tr><td style="color:#8aa69b;">Time:</td><td>${new Date().toLocaleString()}</td></tr>
      </table>
    `
  );

  return sendEmail({
    to: adminEmail,
    subject: `[Event Registration] ${data.eventName} - ${data.name}`,
    html: adminHtml,
  });
}

/**
 * Send branded newsletter email to a single subscriber with mobile-responsive inline CID images
 */
export async function sendNewsletterBroadcast(options: {
  subject: string;
  title: string;
  bodyHtml: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  recipientEmail: string;
  recipientName?: string;
}): Promise<EmailResult> {
  const attachments: Array<{
    filename: string;
    content: Buffer;
    cid: string;
    contentType?: string;
    contentDisposition?: string;
  }> = [];

  let imageSrc: string | null = null;

  if (options.imageUrl && options.imageUrl.trim()) {
    const rawUrl = options.imageUrl.trim();
    try {
      // 1. Base64 Data URL
      if (rawUrl.startsWith('data:')) {
        const match = rawUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          const mimeType = match[1];
          const base64Data = match[2];
          const ext = mimeType.split('/')[1] || 'jpg';
          const buffer = Buffer.from(base64Data, 'base64');
          const cid = 'newsletter-featured-image';
          attachments.push({
            filename: `newsletter-banner.${ext}`,
            content: buffer,
            cid,
            contentType: mimeType,
            contentDisposition: 'inline',
          });
          imageSrc = `cid:${cid}`;
        }
      }
      // 2. Database upload via /api/media/[id]
      else if (rawUrl.startsWith('/api/media/')) {
        const parts = rawUrl.replace(/^\/api\/media\//, '').split('/');
        const id = parts[0];
        const dbUpload = await getUpload(id);
        if (dbUpload && dbUpload.buffer) {
          const cid = 'newsletter-featured-image';
          attachments.push({
            filename: dbUpload.filename || 'newsletter-banner.jpg',
            content: dbUpload.buffer,
            cid,
            contentType: dbUpload.mimeType || 'image/jpeg',
            contentDisposition: 'inline',
          });
          imageSrc = `cid:${cid}`;
        }
      }
      // 3. Local filesystem file in /public/uploads
      else if (rawUrl.startsWith('/') && !rawUrl.startsWith('//')) {
        const cleanPath = rawUrl.replace(/^\//, '');
        const localPath = path.join(process.cwd(), 'public', cleanPath);
        if (fs.existsSync(localPath)) {
          const buffer = fs.readFileSync(localPath);
          const ext = path.extname(localPath).toLowerCase();
          let mime = 'image/jpeg';
          if (ext === '.png') mime = 'image/png';
          else if (ext === '.webp') mime = 'image/webp';
          else if (ext === '.gif') mime = 'image/gif';
          else if (ext === '.svg') mime = 'image/svg+xml';
          const cid = 'newsletter-featured-image';
          attachments.push({
            filename: path.basename(localPath),
            content: buffer,
            cid,
            contentType: mime,
            contentDisposition: 'inline',
          });
          imageSrc = `cid:${cid}`;
        }
      }
      // 4. Remote HTTP/HTTPS URL
      else if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
        try {
          const fetchRes = await fetch(rawUrl, { signal: AbortSignal.timeout(6000) });
          if (fetchRes.ok) {
            const arrayBuf = await fetchRes.arrayBuffer();
            const buffer = Buffer.from(arrayBuf);
            const contentType = fetchRes.headers.get('content-type') || 'image/jpeg';
            const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg';
            const cid = 'newsletter-featured-image';
            attachments.push({
              filename: `newsletter-banner.${ext}`,
              content: buffer,
              cid,
              contentType,
              contentDisposition: 'inline',
            });
            imageSrc = `cid:${cid}`;
          }
        } catch {
          // Fallback to remote URL directly if fetch timed out
          imageSrc = rawUrl;
        }
      }

      // Fallback if none of the above converted to CID
      if (!imageSrc) {
        imageSrc = rawUrl.startsWith('http')
          ? rawUrl
          : `https://earpi.org${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
      }
    } catch (imgErr) {
      console.warn('[Mail Image Handler Warning]:', imgErr);
      imageSrc = rawUrl.startsWith('http')
        ? rawUrl
        : `https://earpi.org${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
    }
  }

  // Scan bodyHtml for any embedded inline data URIs and extract them as attachments to prevent Gmail clipping
  let processedBodyHtml = options.bodyHtml;
  let bodyImgCount = 0;
  processedBodyHtml = processedBodyHtml.replace(
    /<img([^>]+)src=["']data:([^;]+);base64,([^"']+)["']([^>]*)>/gi,
    (_match, before, mime, b64, after) => {
      bodyImgCount++;
      const cid = `newsletter-inline-img-${bodyImgCount}`;
      const ext = mime.split('/')[1] || 'jpg';
      try {
        attachments.push({
          filename: `inline-image-${bodyImgCount}.${ext}`,
          content: Buffer.from(b64, 'base64'),
          cid,
          contentType: mime,
          contentDisposition: 'inline',
        });
        return `<img${before}src="cid:${cid}"${after}>`;
      } catch {
        return _match;
      }
    }
  );

  let content = `
    <h2 style="color:#ffffff;font-size:22px;margin:0 0 16px;line-height:1.35;font-weight:700;">${options.title}</h2>
  `;

  if (imageSrc) {
    const safeTitle = options.title.replace(/"/g, '&quot;');
    content += `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 24px 0;">
        <tr>
          <td align="center" style="padding:0;">
            <img src="${imageSrc}" alt="${safeTitle}" width="532" class="responsive-image" style="width:100%;max-width:532px;height:auto;display:block;margin:0 auto;border-radius:10px;border:1px solid rgba(255,255,255,0.12);" />
          </td>
        </tr>
      </table>
    `;
  }

  content += `
    <div style="color:#e6f4ee;font-size:14.5px;line-height:1.75;margin:0 0 24px;">
      ${processedBodyHtml}
    </div>
  `;

  if (options.ctaText && options.ctaUrl) {
    content += `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:28px 0 16px;">
        <tr>
          <td align="center" style="padding:0;">
            <a href="${options.ctaUrl}" target="_blank" class="btn-cta" style="display:inline-block;padding:13px 32px;background-color:#10b981;color:#06281e;font-size:14.5px;font-weight:700;text-decoration:none;border-radius:8px;box-shadow:0 4px 15px rgba(16,185,129,0.35);">
              ${options.ctaText}
            </a>
          </td>
        </tr>
      </table>
    `;
  }

  const html = wrapBrandedEmail(options.subject, content, options.recipientEmail);

  return sendEmail({
    to: options.recipientEmail,
    subject: options.subject,
    html,
    attachments: attachments.length > 0 ? attachments : undefined,
  });
}

export { sendEmail, wrapBrandedEmail };
