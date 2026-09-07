import nodemailer from 'nodemailer';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
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
  return '"EARPI - Earth Regenerative Projects" <official@earpi.org>';
}

function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || process.env.GMAIL_USER || process.env.SMTP_USER || 'official@earpi.org';
}

/**
 * Send email using Nodemailer, or Resend API fallback, or graceful logging
 */
async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<EmailResult> {
  const from = getFromAddress();

  // 1. Try Nodemailer (SMTP or Gmail)
  const transporter = getTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
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
          reply_to: options.replyTo,
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
// Branded Email Wrapper
// ─────────────────────────────────────────────────────────────────────────────
function wrapBrandedEmail(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#061a14;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#061a14;padding:30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#0c261e;border:1px solid rgba(52,199,89,0.25);border-radius:14px;overflow:hidden;box-shadow:0 12px 35px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #061a14 0%, #0c2e22 100%);padding:28px 30px;border-bottom:1px solid rgba(52,199,89,0.18);text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:1px;">EARPI</h1>
              <p style="margin:4px 0 0;color:#34d399;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;">Earth Regenerative Projects International</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 30px;color:#e6f4ee;font-size:14px;line-height:1.65;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#051410;padding:24px 30px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;color:#7b958c;font-size:11.5px;line-height:1.6;">
              <p style="margin:0 0 6px;color:#a7b8b2;font-weight:600;">USA 501(c)(3) MA 001751059 • EIN: 99-0979318</p>
              <p style="margin:0 0 10px;">Headquarters: 32 Wallace Johnson St, Freetown, Sierra Leone</p>
              <p style="margin:0;">
                <a href="https://earpi.org" style="color:#34d399;text-decoration:none;font-weight:600;">Website</a> &bull; 
                <a href="https://earpi.org/projects" style="color:#34d399;text-decoration:none;font-weight:600;">Projects</a> &bull; 
                <a href="https://earpi.org/donation" style="color:#34d399;text-decoration:none;font-weight:600;">Donate</a>
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
 * Send branded newsletter email to a single subscriber
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
  let content = `
    <h2 style="color:#ffffff;font-size:22px;margin:0 0 16px;line-height:1.3;">${options.title}</h2>
  `;

  if (options.imageUrl) {
    content += `
      <div style="margin:0 0 20px;border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,0.15);">
        <img src="${options.imageUrl}" alt="${options.title}" style="width:100%;max-width:100%;height:auto;display:block;" />
      </div>
    `;
  }

  content += `
    <div style="color:#e6f4ee;font-size:14.5px;line-height:1.75;margin:0 0 24px;">
      ${options.bodyHtml}
    </div>
  `;

  if (options.ctaText && options.ctaUrl) {
    content += `
      <div style="text-align:center;margin:28px 0 16px;">
        <a href="${options.ctaUrl}" target="_blank" style="display:inline-block;padding:13px 30px;background-color:#10b981;color:#06281e;font-size:14.5px;font-weight:bold;text-decoration:none;border-radius:8px;box-shadow:0 4px 15px rgba(16,185,129,0.35);">
          ${options.ctaText}
        </a>
      </div>
    `;
  }

  const html = wrapBrandedEmail(options.subject, content);

  return sendEmail({
    to: options.recipientEmail,
    subject: options.subject,
    html,
  });
}

export { sendEmail, wrapBrandedEmail };
