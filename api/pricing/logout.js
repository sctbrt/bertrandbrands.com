// POST /api/pricing/logout
// Clears pricing session cookie and deletes session from database

import {
  initializeDatabase,
  deletePricingSession
} from '../lib/db.js';

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
    parts.push('Domain=.bertrandbrands.com');
  }

  return parts.join('; ');
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Initialize database if needed
  await initializeDatabase();

  // Parse session ID from cookie
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies.bb_pricing_session;

  // Clear cookie regardless
  res.setHeader('Set-Cookie', buildClearCookie());

  // Delete session from database if exists
  if (sessionId) {
    try {
      await deletePricingSession(sessionId);
    } catch (error) {
      console.error('Logout error:', error);
      // Continue anyway - cookie is cleared
    }
  }

  return res.status(200).json({ ok: true });
}
