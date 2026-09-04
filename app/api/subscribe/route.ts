import { NextRequest, NextResponse } from 'next/server';
import { handleNewSubscriber } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    let email = '';
    let name = '';

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await req.json();
      email = body.email || '';
      name = body.name || '';
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      email = (formData.get('email') as string) || '';
      name = (formData.get('name') as string) || '';
    } else {
      const text = await req.text();
      try {
        const parsed = JSON.parse(text);
        email = parsed.email || '';
        name = parsed.name || '';
      } catch {
        const params = new URLSearchParams(text);
        email = params.get('email') || '';
        name = params.get('name') || '';
      }
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, response: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const mailResult = await handleNewSubscriber(email, name);

    return NextResponse.json({
      success: true,
      response: 'Subscription successful! Thank you for joining EARPI. A confirmation email has been sent.',
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
