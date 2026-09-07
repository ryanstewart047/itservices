import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminPassword,
  setAdminPassword,
  generateSessionToken,
  isValidSessionToken,
  checkAdminAuth,
  safeCompare,
  ADMIN_COOKIE_NAME,
} from '@/lib/admin-auth';

// ─── POST /api/admin/auth — Log in ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required.' },
        { status: 400 }
      );
    }

    const correctPassword = await getAdminPassword();

    if (!correctPassword) {
      return NextResponse.json(
        { success: false, error: 'Admin password has not been configured. Please set ADMIN_PASSWORD in your environment variables.' },
        { status: 503 }
      );
    }

    if (!safeCompare(password, correctPassword)) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please try again.' },
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

// ─── GET /api/admin/auth — Check session ────────────────────────────────────
export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = isValidSessionToken(token);
  return NextResponse.json({ authenticated });
}

// ─── DELETE /api/admin/auth — Log out ───────────────────────────────────────
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}

// ─── PATCH /api/admin/auth — Change password ─────────────────────────────────
// Must be authenticated. Requires current password + new password + confirmation.
export async function PATCH(req: NextRequest) {
  try {
    // 1. Verify existing session
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!isValidSessionToken(token)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    // 2. Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'All three fields are required.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New password and confirmation do not match.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    // 3. Verify current password is correct
    const storedPassword = await getAdminPassword();
    if (!storedPassword || !safeCompare(currentPassword, storedPassword)) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect.' },
        { status: 401 }
      );
    }

    // 4. Save new password to database
    const saved = await setAdminPassword(newPassword);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: 'Failed to save new password. Database may be unavailable.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully. Your next login will use the new password.',
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Password change failed.' }, { status: 500 });
  }
}
