import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const DEFAULT_SECRET = 'digiworku_default_secret_jwt_key_2026';

function getJwtSecret(): string {
  return process.env.JWT_SECRET || DEFAULT_SECRET;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false, error: 'No token provided' });
  }

  const token = authHeader.substring(7).trim();

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { email: string; role: string };
    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ authenticated: false, error: 'Invalid admin token' });
    }

    return res.status(200).json({
      authenticated: true,
      email: decoded.email,
      role: decoded.role,
    });
  } catch (err: any) {
    return res.status(401).json({ authenticated: false, error: 'Token invalid or expired' });
  }
}
