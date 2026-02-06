// GET /api/booking/access
// Verifies booking access token, creates session, sets cookie, redirects

import crypto from 'crypto';
import {
  initializeDatabase,
  consumeBookingToken,
  createBookingSession
} from '../lib/db.js';

// Config
const SESSION_TTL_MINUTES = parseInt(process.env.BOOKING_SESSION_TTL_MINUTES || '240', 10); // 4 hours
const APP_URL = process.env.APP_URL || 'https://bertrandbrands.com';
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

/**
 * Hash the raw token to match against stored hash
 */
function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Build cookie string with security flags
 */
function buildCookie(sessionId, maxAgeSeconds) {
  const parts = [
    `bb_booking_session=${sessionId}`,
    `Path=/`,
    `Max-Age=${maxAgeSeconds}`,
    `HttpOnly`,
    `SameSite=Lax`
  ];

  if (IS_PRODUCTION) {
    parts.push('Secure');
    parts.push('Domain=.bertrandbrands.com');
  }

  return parts.join('; ');
}

/**
 * Escape HTML entities for safe interpolation
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate error page HTML
 */
function errorPageHtml(title, message) {
  title = escapeHtml(title);
  message = escapeHtml(message);
  return `
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Bertrand Brands</title>
  <meta name="robots" content="noindex">
  <link rel="icon" type="image/png" href="/assets/favicon.png">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0a0a;
      color: #ffffff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      max-width: 420px;
      text-align: center;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 500;
      margin-bottom: 16px;
      color: #ffffff;
    }
    p {
      font-size: 0.95rem;
      color: #999999;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    a {
      display: inline-block;
      background: transparent;
      border: 1px solid #333333;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: border-color 0.2s, background 0.2s;
    }
    a:hover {
      border-color: #555555;
      background: rgba(255, 255, 255, 0.05);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="/book">Back to Booking</a>
  </div>
</body>
</html>
  `.trim();
}

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
      'This link appears to be malformed. Please request a new booking access link from your contact at Bertrand Brands.'
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
        'This booking link has either expired or has already been used. Please contact Bertrand Brands for a new link.'
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
    res.setHeader('Set-Cookie', buildCookie(session.id, maxAgeSeconds));

    // Redirect to booking schedule page
    res.setHeader('Location', `${APP_URL}/booking/schedule`);
    return res.status(302).end();

  } catch (error) {
    console.error('Booking access verification error:', error);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send(errorPageHtml(
      'Something Went Wrong',
      'We encountered an error processing your request. Please try again or contact Bertrand Brands for assistance.'
    ));
  }
}
