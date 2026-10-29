import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// In-memory rate limiting per serverless function instance
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

    if (!process.env.ADMIN_EMAILS || !process.env.ADMIN_PASSWORD) {
      console.error('[admin-login] ADMIN_EMAILS or ADMIN_PASSWORD env vars are not set.');
      return res.status(503).json({ error: 'Admin login is not configured. Set ADMIN_EMAILS and ADMIN_PASSWORD environment variables.' });
    }

    const ADMIN_EMAILS = process.env.ADMIN_EMAILS
      .split(',')
      .map((e: string) => e.trim().toLowerCase());

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const cleanEmail = email.trim().toLowerCase();

    if (!ADMIN_EMAILS.includes(cleanEmail)) {
      return res.status(401).json({ error: 'Access Denied: Invalid credentials.' });
    }

    let passwordMatches = false;
    if (ADMIN_PASSWORD.startsWith('$2a$') || ADMIN_PASSWORD.startsWith('$2b$')) {
      passwordMatches = await bcrypt.compare(password, ADMIN_PASSWORD);
    } else {
      passwordMatches = password === ADMIN_PASSWORD;
    }

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Access Denied: Invalid credentials.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'digiworku_default_secret_jwt_key_2026';
    const token = jwt.sign(
      { email: cleanEmail, role: 'admin' },
      jwtSecret,
      { expiresIn: '7d', issuer: 'https://digiworku.in' }
    );

    return res.json({
      success: true,
      token,
      email: cleanEmail,
      role: 'admin',
      expiresIn: '7d',
    });
  } catch (err: any) {
    console.error('Error in /api/admin-login:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
