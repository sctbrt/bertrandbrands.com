// GET /api/booking/access
// Verifies booking access token, creates session, sets cookie, redirects

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeDatabase, consumeBookingToken, createBookingSession, getClientEmail } from '../_lib/db.js';
import { hashToken } from '../_lib/crypto.js';
import { buildCookie } from '../_lib/cookies.js';
import { errorPageHtml } from '../_lib/html.js';
import { createRateLimiter, getClientIp } from '../_lib/rate-limit.js';

// In-memory rate limiting (resets on cold start, per-instance)
const isRateLimited = createRateLimiter(60_000, 10);

// Config
const SESSION_TTL_MINUTES = parseInt(process.env.BOOKING_SESSION_TTL_MINUTES || '240', 10); // 4 hours
const APP_URL = process.env.APP_URL || 'https://bertrandbrands.ca';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Only allow GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Rate limit by IP
  const ip = getClientIp(req.headers);
  if (isRateLimited(ip)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(429).send(errorPageHtml(
      'Too Many Requests',
      'Please wait a moment before trying again.',
      { backHref: '/', backLabel: 'Back to Home' }
    ));
    return;
  }

  // Initialize database tables if needed
  await initializeDatabase();

  const token = req.query.token as string | undefined;

  // Validate token presence
  if (!token || typeof token !== 'string' || token.length !== 64) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(400).send(errorPageHtml(
      'Invalid Link',
      'This link appears to be malformed. Please request a new booking access link from your contact at Bertrand Brands.',
      { backHref: '/intake', backLabel: 'Back to Intake' }
    ));
    return;
  }

  try {
    const tokenHash = hashToken(token);

    // Attempt to consume the booking token (atomic operation)
    const bookingToken = await consumeBookingToken(tokenHash);

    if (!bookingToken) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(400).send(errorPageHtml(
        'Link Expired or Already Used',
        'This booking link has either expired or has already been used. Please contact Bertrand Brands for a new link.',
        { backHref: '/intake', backLabel: 'Back to Intake' }
      ));
      return;
    }

    // Look up client email from the token's client_id
    const clientEmail = await getClientEmail(bookingToken.client_id) || '';

    // Create new booking session
    const sessionExpiresAt = new Date(Date.now() + SESSION_TTL_MINUTES * 60 * 1000);

    const session = await createBookingSession({
      clientId: bookingToken.client_id,
      bookingType: bookingToken.booking_type,
      clientEmail,
      expiresAt: sessionExpiresAt.toISOString()
    });

    // Set session cookie
    const maxAgeSeconds = SESSION_TTL_MINUTES * 60;
    res.setHeader('Set-Cookie', buildCookie('bb_booking_session', session.id, maxAgeSeconds, { hostname: req.headers.host }));

    // Redirect to booking schedule page
    res.setHeader('Location', `${APP_URL}/booking/schedule`);
    res.status(302).end();

  } catch (error) {
    console.error('Booking access verification error:', error);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(500).send(errorPageHtml(
      'Something Went Wrong',
      'We encountered an error processing your request. Please try again or contact Bertrand Brands for assistance.',
      { backHref: '/intake', backLabel: 'Back to Intake' }
    ));
  }
}
