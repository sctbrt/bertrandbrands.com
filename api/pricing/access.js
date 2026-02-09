// GET /api/pricing/access
// Verifies magic link token, creates session, sets cookie, redirects

import {
  initializeDatabase,
  consumeMagicLink,
  createPricingSession
} from '../_lib/db.js';
import { hashToken } from '../_lib/crypto.js';
import { buildCookie } from '../_lib/cookies.js';
import { errorPageHtml } from '../_lib/html.js';

// Config
const SESSION_TTL_MINUTES = parseInt(process.env.PRICING_SESSION_TTL_MINUTES || '60', 10);
const APP_URL = process.env.APP_URL || 'https://brands.bertrandgroup.ca';

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Initialize database tables if needed
  await initializeDatabase();

  const { token } = req.query;

  // Validate token presence
  if (!token || typeof token !== 'string' || token.length !== 64) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(400).send(errorPageHtml(
      'Invalid Link',
      'This link appears to be malformed. Please request a new pricing access link.'
    ));
  }

  try {
    const tokenHash = hashToken(token);

    // Attempt to consume the magic link (atomic operation)
    const magicLink = await consumeMagicLink(tokenHash);

    if (!magicLink) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(400).send(errorPageHtml(
        'Link Expired or Already Used',
        'This link has either expired or has already been used. Pricing links can only be used once and expire after 15 minutes.'
      ));
    }

    // Create new pricing session
    const sessionExpiresAt = new Date(Date.now() + SESSION_TTL_MINUTES * 60 * 1000);

    const session = await createPricingSession({
      email: magicLink.email,
      expiresAt: sessionExpiresAt.toISOString()
    });

    // Set session cookie
    const maxAgeSeconds = SESSION_TTL_MINUTES * 60;
    res.setHeader('Set-Cookie', buildCookie('bb_pricing_session', session.id, maxAgeSeconds));

    // Redirect to services section
    res.setHeader('Location', `${APP_URL}/#services`);
    return res.status(302).end();

  } catch (error) {
    console.error('Access verification error:', error);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send(errorPageHtml(
      'Something Went Wrong',
      'We encountered an error processing your request. Please try requesting a new pricing access link.'
    ));
  }
}
