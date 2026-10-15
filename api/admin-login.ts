import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory rate limiting (per serverless instance — Vercel pe best effort)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 }); // 15 min window
    return false;
  }

  if (record.count >= 5) return true;

  record.count++;
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get client IP
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  // Rate limit check — 5 attempts per 15 min per IP
  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: 'Too many login attempts. Please try again after 15 minutes.',
    });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Credentials come ONLY from environment variables — never hardcoded
    if (!process.env.ADMIN_EMAILS || !process.env.ADMIN_PASSWORD) {
      console.error('[admin-login] ADMIN_EMAILS or ADMIN_PASSWORD env vars are not set.');
      return res.status(503).json({ error: 'Admin login is not configured. Set ADMIN_EMAILS and ADMIN_PASSWORD environment variables.' });
    }

    const ADMIN_EMAILS = process.env.ADMIN_EMAILS
      .split(',')
      .map((e: string) => e.trim().toLowerCase());

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    const cleanEmail = email.trim().toLowerCase();

    if (ADMIN_EMAILS.includes(cleanEmail) && password === ADMIN_PASSWORD) {
      return res.json({ success: true });
    }

    // Generic error — don't reveal which part failed
    return res.status(401).json({ error: 'Access Denied: Invalid credentials.' });
  } catch (err: any) {
    console.error('Error in /api/admin-login:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
