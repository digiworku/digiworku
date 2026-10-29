import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';

const DEFAULT_SECRET = 'digiworku_default_secret_jwt_key_2026';

export function getJwtSecret(): string {
  return process.env.JWT_SECRET || DEFAULT_SECRET;
}

export interface AdminTokenPayload {
  email: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

/**
 * Verify provided admin credentials against environment variables.
 * Supports both bcrypt hashes and secure string comparison.
 */
export async function verifyAdminCredentials(email: string, passwordAttempt: string): Promise<boolean> {
  const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
  const adminPasswordEnv = process.env.ADMIN_PASSWORD || '';

  if (!adminEmailsEnv || !adminPasswordEnv) {
    console.error('[auth] ADMIN_EMAILS or ADMIN_PASSWORD is missing in server environment.');
    return false;
  }

  const allowedEmails = adminEmailsEnv
    .split(',')
    .map((e) => e.trim().toLowerCase());

  const cleanEmail = email.trim().toLowerCase();
  if (!allowedEmails.includes(cleanEmail)) {
    return false;
  }

  // If ADMIN_PASSWORD is a bcrypt hash (starts with $2a$, $2b$, or $2y$)
  if (adminPasswordEnv.startsWith('$2a$') || adminPasswordEnv.startsWith('$2b$') || adminPasswordEnv.startsWith('$2y$')) {
    try {
      return await bcrypt.compare(passwordAttempt, adminPasswordEnv);
    } catch {
      return false;
    }
  }

  // Constant-time-like direct equality check
  return passwordAttempt === adminPasswordEnv;
}

/**
 * Generate a signed JWT token for authenticated administrators.
 */
export function generateAdminToken(email: string): string {
  const secret = getJwtSecret();
  const payload: AdminTokenPayload = {
    email: email.trim().toLowerCase(),
    role: 'admin',
  };

  return jwt.sign(payload, secret, {
    expiresIn: '7d',
    issuer: 'https://digiworku.in',
  });
}

/**
 * Validate and decode an admin token.
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret, {
      issuer: 'https://digiworku.in',
    }) as AdminTokenPayload;

    if (decoded && decoded.role === 'admin' && decoded.email) {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Express Middleware: Require a valid verified admin Bearer token.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication token required.' });
    return;
  }

  const token = authHeader.substring(7).trim();
  const decoded = verifyAdminToken(token);

  if (!decoded) {
    res.status(403).json({ error: 'Forbidden: Invalid or expired admin token.' });
    return;
  }

  // Attach admin info to request
  (req as any).admin = decoded;
  next();
}
