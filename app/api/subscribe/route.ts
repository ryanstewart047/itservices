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

    const cleanEmail = (email || '').trim().toLowerCase();

    // 1. Basic format validation
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return NextResponse.json(
        { success: false, error: 'INVALID_EMAIL', response: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // 2. Strict rule: Any email that has more than two dots is flagged as invalid
    const dotCount = (cleanEmail.match(/\./g) || []).length;
    if (dotCount > 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_EMAIL_DOTS',
          response: 'Invalid email address: emails containing more than two dots are not accepted.',
        },
        { status: 400 }
      );
    }

    // 3. Save to Database (handles duplicate rejection)
    try {
      const savedSubscriber = await addSubscriber(cleanEmail, name, source);

      // 4. Send automated Gmail confirmation & admin alert
      const mailResult = await handleNewSubscriber(cleanEmail, name);

      return NextResponse.json({
        success: true,
        response: 'Subscription successful! Welcome to the EARPI Climate Movement.',
        subscriber: savedSubscriber,
        mailResult,
      });
    } catch (dbErr: any) {
      if (dbErr.message === 'DUPLICATE_EMAIL') {
        return NextResponse.json(
          {
            success: false,
            error: 'DUPLICATE_EMAIL',
            response: 'This email is already subscribed to EARPI updates. Thank you for your ongoing support!',
          },
          { status: 409 }
        );
      }
      if (dbErr.message === 'INVALID_EMAIL_DOTS') {
        return NextResponse.json(
          {
            success: false,
            error: 'INVALID_EMAIL_DOTS',
            response: 'Invalid email address: emails containing more than two dots are not accepted.',
          },
          { status: 400 }
        );
      }
      throw dbErr;
    }
  } catch (error: any) {
    console.error('Subscription API error:', error);
    return NextResponse.json(
      { success: false, response: 'An error occurred while processing your subscription. Please try again later.' },
      { status: 500 }
    );
  }
}
