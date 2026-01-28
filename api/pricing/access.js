// GET /api/pricing/access
// Verifies magic link token, creates session, sets cookie, redirects

import crypto from 'crypto';
import {
  initializeDatabase,
  consumeMagicLink,
  createPricingSession
} from '../lib/db.js';

// Config
const SESSION_TTL_MINUTES = parseInt(process.env.PRICING_SESSION_TTL_MINUTES || '60', 10);
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
    `bb_pricing_session=${sessionId}`,
    `Path=/`,
    `Max-Age=${maxAgeSeconds}`,
    `HttpOnly`,
    `SameSite=Lax`
  ];

  if (IS_PRODUCTION) {
    parts.push('Secure');
    // Set on parent domain so cookie works across subdomains
    parts.push('Domain=.bertrandbrands.com');
  }

  return parts.join('; ');
}

/**
 * Generate error page HTML
 */
function errorPageHtml(title, message) {
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
    <a href="/#services">Back to Services</a>
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
    res.setHeader('Set-Cookie', buildCookie(session.id, maxAgeSeconds));

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
