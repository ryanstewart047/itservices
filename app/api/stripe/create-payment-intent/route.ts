import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'usd', donorName, donorEmail, notes, frequency, project } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 503 });
    }

    // Dynamic import to avoid issues during build if stripe is not installed
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2026-08-26.dahlia' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        donorName: donorName || 'Anonymous',
        donorEmail: donorEmail || '',
        notes: notes || '',
        frequency: frequency || 'one-time',
        project: project || 'General Fund',
      },
      receipt_email: donorEmail || undefined,
      description: `EARPI Donation — ${project || 'General Fund'}`,
      statement_descriptor: 'EARPI DONATION',
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: unknown) {
    console.error('Stripe payment intent error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create payment intent';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
