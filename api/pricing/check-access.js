// GET /api/pricing/check-access
// Validates pricing session from cookie
// Returns access status for frontend to show/hide pricing

import {
  initializeDatabase,
  validatePricingSession,
  deletePricingSession
} from '../_lib/db.js';
import { parseCookies, buildClearCookie } from '../_lib/cookies.js';

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Initialize database if needed
  await initializeDatabase();

  // Parse session ID from cookie
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies.bb_pricing_session;

  // Validate session ID format (must be valid UUID)
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (sessionId && !UUID_REGEX.test(sessionId)) {
    return res.status(200).json({
      hasAccess: false,
      expiresAt: null
    });
  }

  if (!sessionId) {
    return res.status(200).json({
      hasAccess: false,
      expiresAt: null
    });
  }

  try {
    // Validate session
    const session = await validatePricingSession(sessionId);

    if (!session) {
      // Session expired or invalid - clear cookie
      res.setHeader('Set-Cookie', buildClearCookie('bb_pricing_session', req.headers.host));

      return res.status(200).json({
        hasAccess: false,
        expiresAt: null
      });
    }

    // Calculate remaining time
    const expiresAt = new Date(session.expires_at);
    const remainingMinutes = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 60000));

    return res.status(200).json({
      hasAccess: true,
      expiresAt: expiresAt.toISOString(),
      remainingMinutes
    });

  } catch (error) {
    console.error('Check access error:', error);
    return res.status(200).json({
      hasAccess: false,
      expiresAt: null
    });
  }
}
