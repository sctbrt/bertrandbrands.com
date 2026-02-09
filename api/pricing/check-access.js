// GET /api/pricing/check-access
// Validates pricing session from cookie
// Returns access status for frontend to show/hide pricing

import {
  initializeDatabase,
  validatePricingSession,
  deletePricingSession
} from '../_lib/db.js';

const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

/**
 * Parse cookies from header
 */
function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};

  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
    return cookies;
  }, {});
}

/**
 * Build cookie string to clear the session
 */
function buildClearCookie() {
  const parts = [
    `bb_pricing_session=`,
    `Path=/`,
    `Max-Age=0`,
    `HttpOnly`,
    `SameSite=Lax`
  ];

  if (IS_PRODUCTION) {
    parts.push('Secure');
    // Clear on parent domain to match how it was set
    parts.push('Domain=.bertrandgroup.ca');
  }

  return parts.join('; ');
}

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
      res.setHeader('Set-Cookie', buildClearCookie());

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
