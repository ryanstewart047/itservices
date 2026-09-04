import { NextRequest, NextResponse } from 'next/server';
import { addDonation } from '@/lib/db';
import { handleNewDonation } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const donorName = (body.donorName || body.name || '').trim();
    const donorEmail = (body.donorEmail || body.email || '').trim().toLowerCase();
    const amount = Number(body.amount);
    const currency = body.currency || 'USD';
    const frequency = body.frequency || 'one-time';
    const projectName = body.projectName || body.project || 'General Ecological Fund';
    const paymentMethod = body.paymentMethod || 'Online Contribution';
    const notes = body.notes || '';

    // Validation
    if (!donorName) {
      return NextResponse.json({ success: false, error: 'Donor name is required.' }, { status: 400 });
    }

    if (!donorEmail || !donorEmail.includes('@') || !donorEmail.includes('.')) {
      return NextResponse.json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
    }

    const dotCount = (donorEmail.match(/\./g) || []).length;
    if (dotCount > 2) {
      return NextResponse.json(
        { success: false, error: 'Invalid email: emails containing more than two dots are not accepted.' },
        { status: 400 }
      );
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: 'A valid donation amount greater than zero is required.' }, { status: 400 });
    }

    // 1. Capture into Database (Neon Postgres) -> Immediately visible in /admin/donations
    const donation = await addDonation({
      donorName,
      donorEmail,
      amount,
      currency,
      frequency,
      projectName,
      paymentMethod,
      status: 'completed',
      notes,
    });

    // 2. Dispatch automated donor receipt & admin notification
    await handleNewDonation({
      donorName,
      donorEmail,
      amount,
      currency,
      frequency,
      projectName,
      paymentMethod,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: `Thank you, ${donorName}! Your tax-deductible contribution of $${amount.toLocaleString()} ${currency} has been recorded.`,
      donation,
    });
  } catch (error: any) {
    console.error('Public Donation API error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing your donation. Please try again.' },
      { status: 500 }
    );
  }
}
