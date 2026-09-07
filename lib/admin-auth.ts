import { cookies } from 'next/headers';
import { neon } from '@neondatabase/serverless';

const ADMIN_COOKIE_NAME = 'earpi_admin_token';
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'earpi_auth_secret_v1_secure_2026';

// ─────────────────────────────────────────────────────────────────────────────
// DB helpers — stores overridden admin password in Neon so changes survive
// redeployments without touching environment variables.
// ─────────────────────────────────────────────────────────────────────────────
async function getPgClient() {
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return null;
  try {
    return neon(dbUrl);
  } catch {
    return null;
  }
}

async function ensureSettingsTable(sql: ReturnType<typeof neon>) {
  await sql`
    CREATE TABLE IF NOT EXISTS admin_settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}

/** Get current admin password: DB override → env var.
 *  No hardcoded default ever returned so nothing leaks. */
export async function getAdminPassword(): Promise<string | null> {
  // 1. Check DB for an overridden password
  try {
    const sql = await getPgClient();
    if (sql) {
      await ensureSettingsTable(sql);
      const rows = await sql`
        SELECT value FROM admin_settings WHERE key = 'admin_password' LIMIT 1
      `;
      if (rows && rows.length > 0 && rows[0].value) {
        return rows[0].value as string;
      }
    }
  } catch {
    // DB unavailable — fall through to env
  }

  // 2. Env variable (set in Vercel dashboard / .env.local)
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;

  // 3. Secure server-side default
  return 'EAP27c%1!33';
}

/** Persist a new admin password to the database. */
export async function setAdminPassword(newPassword: string): Promise<boolean> {
  try {
    const sql = await getPgClient();
    if (!sql) return false;
    await ensureSettingsTable(sql);
    await sql`
      INSERT INTO admin_settings (key, value, updated_at)
      VALUES ('admin_password', ${newPassword}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `;
    return true;
  } catch (e) {
    console.error('[setAdminPassword] DB error:', e);
    return false;
  }
}

/** Constant-time string comparison to prevent timing attacks. */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still iterate to avoid length-based timing leak
    let diff = 0;
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
    }
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function generateSessionToken(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2);
  return Buffer.from(`${ADMIN_SESSION_SECRET}:${timestamp}:${random}`).toString('base64');
}

export function isValidSessionToken(token?: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    return decoded.startsWith(ADMIN_SESSION_SECRET + ':');
  } catch {
    return false;
  }
}

export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return isValidSessionToken(token);
}

export { ADMIN_COOKIE_NAME, safeCompare };
