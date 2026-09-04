import { NextRequest, NextResponse } from 'next/server';
import { handleNewSubscriber } from '@/lib/mail';
import { addSubscriber } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    let email = '';
    let name = '';
    let source = 'Website';

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await req.json();
      email = body.email || '';
      name = body.name || '';
      source = body.source || 'Website';
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      email = (formData.get('email') as string) || '';
      name = (formData.get('name') as string) || '';
      source = (formData.get('source') as string) || 'Website';
    } else {
      const text = await req.text();
      try {
        const parsed = JSON.parse(text);
        email = parsed.email || '';
        name = parsed.name || '';
        source = parsed.source || 'Website';
      } catch {
        const params = new URLSearchParams(text);
        email = params.get('email') || '';
        name = params.get('name') || '';
        source = params.get('source') || 'Website';
      }
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, response: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // 1. Save to Database
    const savedSubscriber = await addSubscriber(email, name, source);

    // 2. Send automated Gmail confirmation & admin alert
    const mailResult = await handleNewSubscriber(email, name);

    return NextResponse.json({
      success: true,
      response: 'Subscription successful! Thank you for joining EARPI. A confirmation email has been sent.',
      subscriber: savedSubscriber,
      mailResult,
    });
  } catch (error: any) {
    console.error('Subscription API error:', error);
    return NextResponse.json(
      { success: false, response: 'An error occurred while processing your subscription. Please try again later.' },
      { status: 500 }
    );
  }
}
