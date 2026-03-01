// GET /api/pricing/check-access
// Validates pricing session from cookie
// Returns access status for frontend to show/hide pricing

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeDatabase, validatePricingSession } from '../_lib/db.js';
import { parseCookies, buildClearCookie } from '../_lib/cookies.js';
import { UUID_REGEX } from '../_lib/validation.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const allowedOrigin = process.env.APP_URL || 'https://bertrandbrands.ca';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  // Only allow GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Initialize database if needed
  await initializeDatabase();

  // Parse session ID from cookie
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies.bb_pricing_session;

  // Validate session ID format (must be valid UUID)
  if (sessionId && !UUID_REGEX.test(sessionId)) {
    res.status(200).json({
      hasAccess: false,
      expiresAt: null
    });
    return;
  }

  if (!sessionId) {
    res.status(200).json({
      hasAccess: false,
      expiresAt: null
    });
    return;
  }

  try {
    // Validate session
    const session = await validatePricingSession(sessionId);

    if (!session) {
      // Session expired or invalid - clear cookie
      res.setHeader('Set-Cookie', buildClearCookie('bb_pricing_session', req.headers.host));

      res.status(200).json({
        hasAccess: false,
        expiresAt: null
      });
      return;
    }

    // Calculate remaining time
    const expiresAt = new Date(session.expires_at);
    const remainingMinutes = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 60000));

    res.status(200).json({
      hasAccess: true,
      expiresAt: expiresAt.toISOString(),
      remainingMinutes
    });

  } catch (error) {
    console.error('Check access error:', error);
    res.status(200).json({
      hasAccess: false,
      expiresAt: null
    });
  }
}
