// Vercel Serverless Function: Website Snapshot Review Booking
// Endpoint: /api/snapshot/book

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { EMAIL_REGEX } from '../_lib/validation.js';
import { createRateLimiter, getClientIp } from '../_lib/rate-limit.js';
import type { PushoverPayload, SnapshotBookBody } from '../_lib/types.js';

// In-memory rate limiting (resets on cold start, per-instance)
const isRateLimited = createRateLimiter(60_000, 10);

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // CORS headers — restrict to own domain
  const allowedOrigin = process.env.APP_URL || 'https://bertrandbrands.ca';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Rate limit by IP
  const ip = getClientIp(req.headers);
  if (isRateLimited(ip)) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  const { name, email, website, concern, source, offer, rate } = (req.body || {}) as SnapshotBookBody;

  // Validate required fields exist and are strings
  if (!name || typeof name !== 'string' || !email || typeof email !== 'string' || !website || typeof website !== 'string') {
    res.status(400).json({ error: 'Missing required fields: name, email, website' });
    return;
  }

  // Validate email format (RFC 5321 compliant — canonical pattern in api/_lib/validation.ts)
  if (!EMAIL_REGEX.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  // Validate input lengths
  if (name.length > 200 || email.length > 254 || website.length > 500) {
    res.status(400).json({ error: 'Input exceeds maximum length' });
    return;
  }
  if (concern && (typeof concern !== 'string' || concern.length > 2000)) {
    res.status(400).json({ error: 'Concern exceeds maximum length' });
    return;
  }
  if (source && (typeof source !== 'string' || source.length > 200)) {
    res.status(400).json({ error: 'Invalid source parameter' });
    return;
  }
  if (offer && (typeof offer !== 'string' || offer.length > 200)) {
    res.status(400).json({ error: 'Invalid offer parameter' });
    return;
  }
  if (rate && (typeof rate !== 'string' || rate.length > 100)) {
    res.status(400).json({ error: 'Invalid rate parameter' });
    return;
  }

  // Pushover credentials
  const PUSHOVER_USER = process.env.PUSHOVER_USER_KEY;
  const PUSHOVER_TOKEN = process.env.PUSHOVER_API_TOKEN;

  if (!PUSHOVER_USER || !PUSHOVER_TOKEN) {
    console.error('Pushover credentials not configured');
    res.status(500).json({ error: 'Notification service not configured' });
    return;
  }

  try {
    // Build notification message
    let message = `🎯 Website Snapshot Booking\n\n`;
    message += `Name: ${name}\n`;
    message += `Email: ${email}\n`;
    message += `Website: ${website}\n`;
    if (concern) message += `\nConcern: ${concern}\n`;
    message += `\n📊 Campaign: ${source || 'direct'}\n`;
    message += `💰 Rate: ${rate || 'standard'}`;

    // Send Pushover notification
    const payload: PushoverPayload = {
      token: PUSHOVER_TOKEN,
      user: PUSHOVER_USER,
      message,
      title: 'New Snapshot Booking!',
      url: website,
      url_title: 'View Their Website',
      priority: 1, // High priority
      sound: 'cashregister',
    };

    const pushoverResponse = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!pushoverResponse.ok) {
      console.error('Pushover notification failed');
    }

    // Log booking for analytics (sanitized — no PII in server logs)
    console.log('Snapshot booking:', {
      timestamp: new Date().toISOString(),
      email: email.substring(0, 3) + '***',
      source: source || 'direct',
      offer: offer || 'website-snapshot-review',
      rate: rate || 'standard',
    });

    res.status(200).json({
      success: true,
      message: 'Booking received. We\'ll confirm within 1-2 business days.'
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
