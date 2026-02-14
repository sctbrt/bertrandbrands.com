// POST /api/booking/create-token
// Admin-only endpoint to generate a booking access token and email it to the client
// Authenticated via BOOKING_ADMIN_SECRET header

import crypto from 'crypto';
import { Resend } from 'resend';
import {
  initializeDatabase,
  createBookingToken
} from '../_lib/db.js';
import { sql } from '@vercel/postgres';

// Config
const BOOKING_TOKEN_TTL_HOURS = 72; // Token valid for 3 days
const APP_URL = process.env.APP_URL || 'https://bertrandbrands.ca';

// Booking type labels for emails
const BOOKING_TYPE_LABELS = {
  focus_studio_kickoff: 'Build Kickoff',
  core_services_discovery: 'Transformation Discovery'
};

/**
 * Generate secure random token and its hash
 */
function generateToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, tokenHash };
}

/**
 * Upsert a client record — insert if new, return existing if found
 */
async function upsertClient({ name, email, company }) {
  // Check if client exists by email
  const existing = await sql`
    SELECT id, name, contact_email, company FROM clients
    WHERE contact_email = ${email}
  `;

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  // Create new client with a short deterministic ID
  const id = crypto.randomBytes(8).toString('hex');
  const result = await sql`
    INSERT INTO clients (id, name, contact_email, company)
    VALUES (${id}, ${name}, ${email}, ${company || null})
    RETURNING id, name, contact_email, company
  `;
  return result.rows[0];
}

/**
 * Build the booking access email HTML
 */
function buildEmailHtml({ firstName, bookingLink, bookingTypeLabel, expiresHours }) {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi,';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Booking Link</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 520px; margin: 0 auto; padding: 40px 20px; background-color: #fafafa;">
  <div style="background: #ffffff; padding: 32px; border-radius: 8px; border: 1px solid #e5e5e5;">
    <p style="margin: 0 0 16px 0; font-size: 15px;">
      ${greeting}
    </p>
    <p style="margin: 0 0 24px 0; font-size: 15px;">
      Your <strong>${bookingTypeLabel}</strong> call is ready to be scheduled. Use the link below to pick a time that works for you.
    </p>
    <a href="${bookingLink}"
       style="display: inline-block; background: #0a0a0a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px;">
      Schedule Your Call
    </a>
    <p style="margin: 24px 0 0 0; font-size: 13px; color: #666666;">
      This link expires in ${expiresHours} hours and can only be used once. If it expires, just let us know and we'll send a new one.
    </p>
  </div>
  <p style="margin: 24px 0 0 0; font-size: 12px; color: #999999; text-align: center;">
    Bertrand Group | Brand &amp; Web Systems &middot; Sudbury, Ontario
  </p>
</body>
</html>
  `.trim();
}

/**
 * Build plain text version
 */
function buildEmailText({ firstName, bookingLink, bookingTypeLabel, expiresHours }) {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi,';

  return `
${greeting}

Your ${bookingTypeLabel} call is ready to be scheduled. Use the link below to pick a time that works for you.

Schedule Your Call: ${bookingLink}

This link expires in ${expiresHours} hours and can only be used once. If it expires, just let us know and we'll send a new one.

--
Bertrand Group | Brand & Web Systems · Sudbury, Ontario
  `.trim();
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Admin authentication via shared secret
  const adminSecret = process.env.BOOKING_ADMIN_SECRET;
  if (!adminSecret) {
    console.error('BOOKING_ADMIN_SECRET not configured');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const authHeader = req.headers['x-admin-secret'];
  if (!authHeader || authHeader !== adminSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Initialize database tables if needed
  await initializeDatabase();

  const { clientName, clientEmail, company, bookingType, createdBy } = req.body || {};

  // Validate required fields
  if (!clientName || !clientEmail || !bookingType) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['clientName', 'clientEmail', 'bookingType']
    });
  }

  // Validate booking type
  if (!BOOKING_TYPE_LABELS[bookingType]) {
    return res.status(400).json({
      error: 'Invalid booking type',
      valid: Object.keys(BOOKING_TYPE_LABELS)
    });
  }

  // Validate email format
  const normalizedEmail = clientEmail.trim().toLowerCase();
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    // Upsert client
    const client = await upsertClient({
      name: clientName.trim(),
      email: normalizedEmail,
      company: company?.trim() || null
    });

    // Generate token
    const { rawToken, tokenHash } = generateToken();
    const expiresAt = new Date(Date.now() + BOOKING_TOKEN_TTL_HOURS * 60 * 60 * 1000);

    // Store token in database
    await createBookingToken({
      clientId: client.id,
      bookingType,
      tokenHash,
      expiresAt: expiresAt.toISOString(),
      createdBy: createdBy || 'admin'
    });

    // Build booking link
    const bookingLink = `${APP_URL}/booking/access?token=${rawToken}`;
    const bookingTypeLabel = BOOKING_TYPE_LABELS[bookingType];

    // Send email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    const firstName = clientName.trim().split(' ')[0];

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Bertrand Group <hello@bertrandgroup.ca>',
      to: normalizedEmail,
      subject: `Your ${bookingTypeLabel} booking link`,
      html: buildEmailHtml({
        firstName,
        bookingLink,
        bookingTypeLabel,
        expiresHours: BOOKING_TOKEN_TTL_HOURS
      }),
      text: buildEmailText({
        firstName,
        bookingLink,
        bookingTypeLabel,
        expiresHours: BOOKING_TOKEN_TTL_HOURS
      })
    });

    console.log(`Booking token created: ${normalizedEmail.substring(0, 3)}***@*** type=${bookingType} by=${createdBy || 'admin'}`);

    return res.status(200).json({
      ok: true,
      clientId: client.id,
      bookingType,
      bookingTypeLabel,
      expiresAt: expiresAt.toISOString(),
      emailSent: true
    });

  } catch (error) {
    console.error('Create booking token error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
