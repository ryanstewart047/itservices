import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminPassword,
  generateSessionToken,
  isValidSessionToken,
  ADMIN_COOKIE_NAME,
} from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const correctPassword = getAdminPassword();

    if (!password || password !== correctPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin password' },
        { status: 401 }
      );
    }

    const token = generateSessionToken();
    const response = NextResponse.json({ success: true, message: 'Logged in successfully' });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = isValidSessionToken(token);
  return NextResponse.json({ authenticated });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
