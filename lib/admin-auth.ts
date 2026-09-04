import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'earpi_admin_token';
const ADMIN_SESSION_SECRET = 'earpi_auth_secret_v1_secure_2026';

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'earpi2026!Admin';
}

export function generateSessionToken(): string {
  return Buffer.from(`${ADMIN_SESSION_SECRET}:${Date.now()}`).toString('base64');
}

export function isValidSessionToken(token?: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    return decoded.startsWith(ADMIN_SESSION_SECRET);
  } catch {
    return false;
  }
}

export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return isValidSessionToken(token);
}

export { ADMIN_COOKIE_NAME };
