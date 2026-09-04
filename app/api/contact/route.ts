import { NextRequest, NextResponse } from 'next/server';
import { handleContactForm } from '@/lib/mail';
import { addContactMessage } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    let name = '';
    let email = '';
    let phone = '';
    let subject = '';
    let message = '';

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await req.json();
      name = body.name || body.custom_name || '';
      email = body.email || body.custom_email || '';
      phone = body.phone || body.number || '';
      subject = body.subject || body.msg_subject || '';
      message = body.message || body.msg || '';
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      name = (formData.get('name') || formData.get('custom_name') || '') as string;
      email = (formData.get('email') || formData.get('custom_email') || '') as string;
      phone = (formData.get('phone') || formData.get('number') || '') as string;
      subject = (formData.get('subject') || formData.get('msg_subject') || '') as string;
      message = (formData.get('message') || formData.get('msg') || '') as string;
    } else {
      const text = await req.text();
      try {
        const parsed = JSON.parse(text);
        name = parsed.name || parsed.custom_name || '';
        email = parsed.email || parsed.custom_email || '';
        phone = parsed.phone || parsed.number || '';
        subject = parsed.subject || parsed.msg_subject || '';
        message = parsed.message || parsed.msg || '';
      } catch {
        const params = new URLSearchParams(text);
        name = params.get('name') || params.get('custom_name') || '';
        email = params.get('email') || params.get('custom_email') || '';
        phone = params.get('phone') || params.get('number') || '';
        subject = params.get('subject') || params.get('msg_subject') || '';
        message = params.get('message') || params.get('msg') || '';
      }
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { status: 'error', message: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // 1. Save to Database
    const savedInquiry = await addContactMessage({
      name,
      email,
      phone,
      subject: subject || 'General Inquiry',
      message,
    });

    // 2. Send email notifications
    const mailResult = await handleContactForm({
      name,
      email,
      phone,
      subject,
      message,
    });

    return NextResponse.json({
      status: 'success',
      message: 'Thank you! Your message has been sent successfully. We will get back to you shortly.',
      inquiry: savedInquiry,
      mailResult,
    });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
