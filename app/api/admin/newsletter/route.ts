import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getSubscribers } from '@/lib/db';
import { sendNewsletterBroadcast } from '@/lib/mail';

export async function GET() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allSubscribers = await getSubscribers();
  const activeSubscribers = allSubscribers.filter((s) => s.status === 'active' || !s.status);

  return NextResponse.json({
    totalCount: allSubscribers.length,
    activeCount: activeSubscribers.length,
    subscribers: activeSubscribers.map((s) => ({ email: s.email, name: s.name })),
  });
}

export async function POST(req: NextRequest) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { subject, title, bodyHtml, imageUrl, ctaText, ctaUrl, isTest, testEmail, selectedEmails } = data;

    if (!subject?.trim() || !title?.trim() || !bodyHtml?.trim()) {
      return NextResponse.json(
        { error: 'Subject, Title, and Message Content are required.' },
        { status: 400 }
      );
    }

    // 1. Send Test Email
    if (isTest) {
      const recipient = testEmail?.trim() || process.env.ADMIN_EMAIL || 'official@earpi.org';
      const result = await sendNewsletterBroadcast({
        subject: `[TEST PREVIEW] ${subject}`,
        title,
        bodyHtml,
        imageUrl: imageUrl || undefined,
        ctaText: ctaText || undefined,
        ctaUrl: ctaUrl || undefined,
        recipientEmail: recipient,
        recipientName: 'EARPI Admin Tester',
      });

      return NextResponse.json({
        success: result.success,
        message: result.success
          ? `Test email dispatched to ${recipient}`
          : `Delivery failed: ${result.error}`,
        testRecipient: recipient,
        error: result.error,
      });
    }

    // 2. Broadcast to targeted/selected subscribers
    const allSubscribers = await getSubscribers();
    let targetSubscribers = allSubscribers.filter((s) => s.status === 'active' || !s.status);

    if (Array.isArray(selectedEmails) && selectedEmails.length > 0) {
      const selectedSet = new Set(selectedEmails.map((e: string) => e.toLowerCase().trim()));
      targetSubscribers = targetSubscribers.filter((s) => selectedSet.has(s.email.toLowerCase().trim()));
    }

    if (targetSubscribers.length === 0) {
      return NextResponse.json(
        { error: 'No recipients selected or found in active subscribers.' },
        { status: 400 }
      );
    }

    let sentCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    // Send in batches to avoid overwhelming SMTP
    for (const sub of targetSubscribers) {
      try {
        const res = await sendNewsletterBroadcast({
          subject,
          title,
          bodyHtml,
          imageUrl: imageUrl || undefined,
          ctaText: ctaText || undefined,
          ctaUrl: ctaUrl || undefined,
          recipientEmail: sub.email,
          recipientName: sub.name,
        });

        if (res.success) {
          sentCount++;
        } else {
          failCount++;
          if (res.error) errors.push(`${sub.email}: ${res.error}`);
        }
      } catch (err: any) {
        failCount++;
        errors.push(`${sub.email}: ${err.message || 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      sentCount,
      failCount,
      totalTargeted: targetSubscribers.length,
      errors: errors.slice(0, 5),
    });
  } catch (err: any) {
    console.error('Error broadcasting newsletter:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to send newsletter broadcast' },
      { status: 500 }
    );
  }
}
