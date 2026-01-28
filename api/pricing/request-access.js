// POST /api/pricing/request-access
// Sends magic link email for pricing access via Resend

import crypto from 'crypto';
import { Resend } from 'resend';
import {
  initializeDatabase,
  createMagicLink,
  countRecentRequests
} from '../lib/db.js';

// Config
const MAGIC_LINK_TTL_MINUTES = parseInt(process.env.PRICING_MAGIC_LINK_TTL_MINUTES || '15', 10);
const APP_URL = process.env.APP_URL || 'https://bertrandbrands.com';
const RATE_LIMIT_EMAIL_PER_HOUR = 3;

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Generate secure random token and its hash
 */
function generateToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, tokenHash };
}

/**
 * Build the magic link email HTML
 */
function buildEmailHtml({ firstName, magicLink, expiresMinutes }) {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi,';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Pricing Access Link</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 520px; margin: 0 auto; padding: 40px 20px; background-color: #fafafa;">
  <div style="background: #ffffff; padding: 32px; border-radius: 8px; border: 1px solid #e5e5e5;">
    <p style="margin: 0 0 16px 0; font-size: 15px;">
      ${greeting}
    </p>
    <p style="margin: 0 0 24px 0; font-size: 15px;">
      Here's your link to view pricing for our advanced services. Pricing varies by scope, so this gives you a starting point before we discuss your specific needs.
    </p>
    <a href="${magicLink}"
       style="display: inline-block; background: #0a0a0a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px;">
      View Pricing
    </a>
    <p style="margin: 24px 0 0 0; font-size: 13px; color: #666666;">
      This link expires in ${expiresMinutes} minutes and can only be used once.
    </p>
  </div>
  <p style="margin: 24px 0 0 0; font-size: 12px; color: #999999; text-align: center;">
    Bertrand Brands · Sudbury, Ontario
  </p>
</body>
</html>
  `.trim();
}

/**
 * Build plain text version
 */
function buildEmailText({ firstName, magicLink, expiresMinutes }) {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi,';

  return `
${greeting}

Here's your link to view pricing for our advanced services. Pricing varies by scope, so this gives you a starting point before we discuss your specific needs.

View Pricing: ${magicLink}

This link expires in ${expiresMinutes} minutes and can only be used once.

--
Bertrand Brands · Sudbury, Ontario
  `.trim();
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Initialize database tables if needed
  await initializeDatabase();

  const { email, firstName } = req.body || {};

  // Validate email
  if (!email || typeof email !== 'string') {
    // Always return success to prevent enumeration
    return res.status(200).json({ ok: true });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail.length > 254 || !EMAIL_REGEX.test(normalizedEmail)) {
    // Always return success to prevent enumeration
    return res.status(200).json({ ok: true });
  }

  // Get client IP for logging (not for strict rate limiting to avoid false positives)
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] ||
                   req.headers['x-real-ip'] ||
                   'unknown';

  try {
    // Rate limiting check (by email)
    const { emailCount } = await countRecentRequests({ email: normalizedEmail, ip: clientIp });

    if (emailCount >= RATE_LIMIT_EMAIL_PER_HOUR) {
      // Still return success to prevent enumeration
      console.log(`Rate limit exceeded for email: ${normalizedEmail}`);
      return res.status(200).json({ ok: true });
    }

    // Generate token
    const { rawToken, tokenHash } = generateToken();
    const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MINUTES * 60 * 1000);

    // Store in database
    await createMagicLink({
      email: normalizedEmail,
      tokenHash,
      expiresAt: expiresAt.toISOString()
    });

    // Build magic link URL
    const magicLink = `${APP_URL}/pricing/access?token=${rawToken}`;

    // Send email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Bertrand Brands <hello@bertrandbrands.com>',
      to: normalizedEmail,
      subject: 'Your pricing access link',
      html: buildEmailHtml({
        firstName: firstName?.trim() || null,
        magicLink,
        expiresMinutes: MAGIC_LINK_TTL_MINUTES
      }),
      text: buildEmailText({
        firstName: firstName?.trim() || null,
        magicLink,
        expiresMinutes: MAGIC_LINK_TTL_MINUTES
      })
    });

    // Optional: Log for abuse review (without sensitive data)
    console.log(`Magic link sent: ${normalizedEmail.substring(0, 3)}***@*** from ${clientIp}`);

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Request access error:', error);
    // Still return success to prevent enumeration
    return res.status(200).json({ ok: true });
  }
}
