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
    let page = '';

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await req.json();
      name = body.name || body.custom_name || body.fname || '';
      email = body.email || body.custom_email || '';
      phone = body.phone || body.number || body.phone_number || '';
      subject = body.subject || body.msg_subject || '';
      message = body.message || body.msg || '';
      page = body.page || body.source || '';
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      name = (formData.get('name') || formData.get('custom_name') || formData.get('fname') || '') as string;
      email = (formData.get('email') || formData.get('custom_email') || '') as string;
      phone = (formData.get('phone') || formData.get('number') || formData.get('phone_number') || '') as string;
      subject = (formData.get('subject') || formData.get('msg_subject') || '') as string;
      message = (formData.get('message') || formData.get('msg') || '') as string;
      page = (formData.get('page') || formData.get('source') || '') as string;
    } else {
      const text = await req.text();
      try {
        const parsed = JSON.parse(text);
        name = parsed.name || parsed.custom_name || parsed.fname || '';
        email = parsed.email || parsed.custom_email || '';
        phone = parsed.phone || parsed.number || parsed.phone_number || '';
        subject = parsed.subject || parsed.msg_subject || '';
        message = parsed.message || parsed.msg || '';
        page = parsed.page || parsed.source || '';
      } catch {
        const params = new URLSearchParams(text);
        name = params.get('name') || params.get('custom_name') || params.get('fname') || '';
        email = params.get('email') || params.get('custom_email') || '';
        phone = params.get('phone') || params.get('number') || params.get('phone_number') || '';
        subject = params.get('subject') || params.get('msg_subject') || '';
        message = params.get('message') || params.get('msg') || '';
        page = params.get('page') || params.get('source') || '';
      }
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanMsg = message.trim();

    if (!cleanName) {
      return NextResponse.json(
        { status: 'error', message: 'Name is a required field.' },
        { status: 400 }
      );
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return NextResponse.json(
        { status: 'error', message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const dotCount = (cleanEmail.match(/\./g) || []).length;
    if (dotCount > 2) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid email: emails containing more than two dots are not accepted.' },
        { status: 400 }
      );
    }

    if (!cleanMsg) {
      return NextResponse.json(
        { status: 'error', message: 'Message cannot be empty.' },
        { status: 400 }
      );
    }

    const finalSubject = subject.trim() || (page ? `Inquiry via ${page}` : 'General Inquiry');

    // 1. Save to Database (Neon Postgres -> Immediately visible in /admin/messages)
    const savedInquiry = await addContactMessage({
      name: cleanName,
      email: cleanEmail,
      phone: phone.trim(),
      subject: finalSubject,
      message: cleanMsg,
    });

    // 2. Send email notifications (Acknowledgment to sender + Alert to admin)
    const mailResult = await handleContactForm({
      name: cleanName,
      email: cleanEmail,
      phone: phone.trim(),
      subject: finalSubject,
      message: cleanMsg,
      page,
    });

    return NextResponse.json({
      status: 'success',
      message: 'Thank you! Your message has been received. Our team will get back to you shortly.',
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
