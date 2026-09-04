import nodemailer from 'nodemailer';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Create reusable transporter
function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Send automated confirmation to subscriber and alert to admin
 */
export async function handleNewSubscriber(email: string, name?: string): Promise<EmailResult> {
  const transporter = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || 'official@earpi.org';
  const subscriberName = name || 'Friend of EARPI';

  if (!transporter) {
    console.warn('[Gmail SMTP] GMAIL_USER or GMAIL_APP_PASSWORD not set. Logging subscription:', { email, name });
    return { success: true, messageId: 'simulated-dev-id' };
  }

  try {
    // 1. Send confirmation email to subscriber
    await transporter.sendMail({
      from: `"EARPI - Earth Regenerative Projects" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Welcome to EARPI - Earth Regenerative Projects International',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #338F7A; margin: 0;">EARPI</h1>
            <p style="color: #666; font-size: 14px; margin-top: 4px;">Earth Regenerative Projects International</p>
          </div>
          
          <h2 style="color: #333;">Welcome to our Community, ${subscriberName}!</h2>
          <p style="color: #555; line-height: 1.6;">
            Thank you for subscribing to the EARPI newsletter. Together, we are taking decisive action against climate change, fostering ecological regeneration, and empowering local communities in Sierra Leone and worldwide.
          </p>
          
          <div style="background-color: #f4fbf9; border-left: 4px solid #338F7A; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #338F7A; font-weight: bold;">Did you know?</p>
            <p style="margin: 5px 0 0; color: #555; font-size: 14px;">
              EARPI is a registered USA 501(c)(3) compliant non-profit corporation (MA 001751059; EIN: 99-0979318). Every contribution goes directly into grassroots community action.
            </p>
          </div>

          <p style="color: #555; line-height: 1.6;">
            Stay tuned for upcoming impact reports, tree planting initiatives, and sustainability summits.
          </p>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://earpi.org/donation" style="background-color: #338F7A; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 20px; font-weight: bold; display: inline-block;">
              Support Our Projects
            </a>
          </div>

          <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 12px; text-align: center;">
            EARPI Sierra Leone • 32 Wallace Johnson St, Freetown, Sierra Leone<br/>
            USA Registration MA 001751059 • EIN: 99-0979318
          </p>
        </div>
      `,
    });

    // 2. Alert Admin of new subscriber
    await transporter.sendMail({
      from: `"EARPI System" <${process.env.GMAIL_USER}>`,
      to: adminEmail,
      subject: `[New Newsletter Subscriber] ${email}`,
      text: `A new user has subscribed to the EARPI newsletter.\n\nName: ${subscriberName}\nEmail: ${email}\nTime: ${new Date().toISOString()}`,
    });

    return { success: true };
  } catch (error: any) {
    console.error('[Gmail SMTP Error handleNewSubscriber]:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send contact form alert to admin and confirmation to sender
 */
export async function handleContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<EmailResult> {
  const transporter = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || 'official@earpi.org';

  if (!transporter) {
    console.warn('[Gmail SMTP] GMAIL credentials missing. Logging contact request:', data);
    return { success: true, messageId: 'simulated-dev-id' };
  }

  try {
    // 1. Send notification to EARPI Team / Admin
    await transporter.sendMail({
      from: `"EARPI Web Form" <${process.env.GMAIL_USER}>`,
      to: adminEmail,
      replyTo: data.email,
      subject: `[Website Contact] ${data.subject || 'New Message from ' + data.name}`,
      html: `
        <h2>New Contact Form Inquiry</h2>
        <p><strong>Sender Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${data.subject || 'N/A'}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${data.message}</p>
      `,
    });

    // 2. Send acknowledgment to sender
    await transporter.sendMail({
      from: `"EARPI Support" <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: 'We received your message - EARPI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #338F7A;">Thank you for contacting EARPI!</h2>
          <p>Hello ${data.name},</p>
          <p>We have received your message regarding "<strong>${data.subject || 'Inquiry'}</strong>". Our team is reviewing it and will respond to you promptly.</p>
          <p style="color: #666; font-size: 13px;">Warm regards,<br/>The EARPI Team<br/>https://earpi.org</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error('[Gmail SMTP Error handleContactForm]:', error);
    return { success: false, error: error.message };
  }
}
