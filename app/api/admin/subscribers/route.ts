import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getSubscribers, deleteSubscriber } from '@/lib/db';

export async function GET() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscribers = await getSubscribers();
  return NextResponse.json({ subscribers });
}

export async function DELETE(req: NextRequest) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });
    }

    const deleted = await deleteSubscriber(id);
    return NextResponse.json({ success: deleted });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
  }
}
