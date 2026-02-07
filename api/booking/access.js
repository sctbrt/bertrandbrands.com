// GET /api/booking/access
// Verifies booking access token, creates session, sets cookie, redirects

import {
  initializeDatabase,
  consumeBookingToken,
  createBookingSession
} from '../lib/db.js';
import { hashToken } from '../lib/crypto.js';
import { buildCookie } from '../lib/cookies.js';
import { errorPageHtml } from '../lib/html.js';

// Config
const SESSION_TTL_MINUTES = parseInt(process.env.BOOKING_SESSION_TTL_MINUTES || '240', 10); // 4 hours
const APP_URL = process.env.APP_URL || 'https://bertrandbrands.com';

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
      'This link appears to be malformed. Please request a new booking access link from your contact at Bertrand Brands.',
      { backHref: '/book', backLabel: 'Back to Booking' }
    ));
  }

  try {
    const tokenHash = hashToken(token);

    // Attempt to consume the booking token (atomic operation)
    const bookingToken = await consumeBookingToken(tokenHash);

    if (!bookingToken) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(400).send(errorPageHtml(
        'Link Expired or Already Used',
        'This booking link has either expired or has already been used. Please contact Bertrand Brands for a new link.',
        { backHref: '/book', backLabel: 'Back to Booking' }
      ));
    }

    // Look up client email from the token's client_id
    // We need to query it since the token table doesn't store email
    const { sql } = await import('@vercel/postgres');
    const clientResult = await sql`
      SELECT contact_email FROM clients WHERE id = ${bookingToken.client_id}
    `;
    const clientEmail = clientResult.rows[0]?.contact_email || '';

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
    res.setHeader('Set-Cookie', buildCookie('bb_booking_session', session.id, maxAgeSeconds));

    // Redirect to booking schedule page
    res.setHeader('Location', `${APP_URL}/booking/schedule`);
    return res.status(302).end();

  } catch (error) {
    console.error('Booking access verification error:', error);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send(errorPageHtml(
      'Something Went Wrong',
      'We encountered an error processing your request. Please try again or contact Bertrand Brands for assistance.',
      { backHref: '/book', backLabel: 'Back to Booking' }
    ));
  }
}
