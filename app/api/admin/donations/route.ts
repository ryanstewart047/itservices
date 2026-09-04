import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getDonations, addDonation, deleteDonation } from '@/lib/db';

export async function GET() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const donations = await getDonations();
  return NextResponse.json({ donations });
}

export async function POST(req: NextRequest) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.donorName || !body.amount) {
      return NextResponse.json(
        { error: 'Donor Name and Amount are required' },
        { status: 400 }
      );
    }

    const newDonation = await addDonation({
      donorName: body.donorName,
      donorEmail: body.donorEmail || 'unspecified@donor.org',
      amount: Number(body.amount),
      currency: body.currency || 'USD',
      frequency: body.frequency || 'one-time',
      projectId: body.projectId || undefined,
      projectName: body.projectName || undefined,
      paymentMethod: body.paymentMethod || 'Manual Entry',
      status: body.status || 'completed',
      notes: body.notes || '',
    });

    return NextResponse.json({ success: true, donation: newDonation });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to record donation' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Donation ID is required' }, { status: 400 });
  }

  const deleted = await deleteDonation(id);
  return NextResponse.json({ success: deleted });
}
