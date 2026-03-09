// Vercel Serverless Function: Visitor & Form Notification via Pushover
// Endpoint: /api/notify

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createRateLimiter, getClientIp } from './_lib/rate-limit.js';
import { maskEmail } from './_lib/validation.js';
import type { NotifyRequestBody, PushoverPayload } from './_lib/types.js';

// In-memory rate limiting (resets on cold start, per-instance)
const isRateLimited = createRateLimiter(60_000, 10);

// Source labels for intake notification titles
const SOURCE_LABELS: Record<string, string> = {
  // V11 tier intake sources
  'tier-intake': 'General Intake',
  'tier-intake-amber': 'Build Tier Inquiry',
  'tier-intake-violet': 'Transform Tier Inquiry',
  'tier-intake-blue': 'Care Tier Inquiry',
  // V11 inline form sources (from InlineIntakeForm.astro)
  'inline-starter-onepage': 'Starter One-Page Inquiry',
  'inline-starter-multipage': 'Starter Multi-Page Inquiry',
  'inline-fullsite-booking': 'Full Site Inquiry',
  'inline-foundation-growth': 'Foundation + Growth Inquiry',
  'inline-smb-platform': 'SMB Platform Inquiry',
  'inline-brand-platform': 'Brand + Platform Inquiry',
  'inline-bronze': 'Bronze Care Inquiry',
  'inline-silver': 'Silver Care Inquiry',
  'inline-gold': 'Gold Care Inquiry',
  // Campaign sources
  'sudbury_focus_studio': 'Sudbury Lead',
};

/**
 * Build geo location string from Vercel headers
 */
function buildGeoLocation(headers: VercelRequest['headers']): string {
  const geoCity = headers['x-vercel-ip-city']
    ? decodeURIComponent(headers['x-vercel-ip-city'] as string)
    : '';
  const geoRegion = (headers['x-vercel-ip-country-region'] as string) || '';
  const geoCountry = (headers['x-vercel-ip-country'] as string) || '';

  if (geoCity) {
    let location = geoCity;
    if (geoRegion) location += `, ${geoRegion}`;
    if (geoCountry) location += `, ${geoCountry}`;
    return location;
  }
  return geoCountry;
}

/**
 * Parse user agent into device summary
 */
function parseDevice(ua: string): string {
  if (!ua) return '';
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  let browser = 'Unknown';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/Chrome\//i.test(ua)) browser = 'Chrome';
  else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';
  return `${isMobile ? '📱' : '💻'} ${browser}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // CORS: restrict to APP_URL origin
  const allowedOrigin = process.env.APP_URL || 'https://bertrandbrands.ca';
  const origin = req.headers.origin as string | undefined;

  if (origin === allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Rate limiting by IP
  const ip = getClientIp(req.headers);
  if (isRateLimited(ip)) {
    res.status(429).json({ error: 'Too many requests' });
    return;
  }

  // Determine notification type based on request body
  const body = (req.body || {}) as NotifyRequestBody;
  const { type } = body;

  // Pushover credentials (from environment variables)
  const PUSHOVER_USER = process.env.PUSHOVER_USER_KEY;
  const PUSHOVER_TOKEN = process.env.PUSHOVER_API_TOKEN;

  if (!PUSHOVER_USER || !PUSHOVER_TOKEN) {
    console.error('Pushover credentials not configured');
    res.status(500).json({ error: 'Notification service not configured' });
    return;
  }

  try {
    let notificationMessage: string;
    let notificationTitle: string;
    let notificationUrl: string | undefined;
    let notificationUrlTitle: string | undefined;
    let priority: number;
    let sound: string | undefined;

    if (type === 'visitor') {
      // Visitor notification
      const { page, referrer, utm } = body as { page?: string; referrer?: string; utm?: { source?: string; medium?: string; campaign?: string; gclid?: string } };

      const location = buildGeoLocation(req.headers);
      const device = parseDevice((req.headers['user-agent'] as string) || '');

      // Build source attribution line (UTM > referrer > nothing)
      let sourceLine = '';
      if (utm && utm.source) {
        const parts = [utm.source];
        if (utm.medium) parts.push(utm.medium);
        if (utm.campaign) parts.push(utm.campaign);
        sourceLine = parts.join(' / ');
        if (utm.gclid) sourceLine += ' (Google Ads)';
      } else if (referrer) {
        try {
          sourceLine = new URL(referrer).hostname.replace('www.', '');
        } catch {
          sourceLine = referrer;
        }
      }

      notificationMessage = `📍 ${page || '/'}`;
      if (sourceLine) notificationMessage += `\n🔗 ${sourceLine}`;
      if (location) notificationMessage += `\n📌 ${location}`;
      if (device) notificationMessage += `\n${device}`;

      notificationTitle = 'Visitor on BG Brands';
      notificationUrl = `https://bertrandbrands.ca${page || '/'}`;
      notificationUrlTitle = 'View Page';
      priority = -1; // Silent — no sound, no popup
      sound = undefined;

    } else if (type === 'intake') {
      // Intake form submission (high priority with distinct sound)
      const {
        source, name, email, phone, business, website, service,
        situation, budget, timeline, concerns, details, description,
        challenge, context, outcome, price, offer,
      } = body as Record<string, string | undefined>;

      const location = buildGeoLocation(req.headers);
      const sourceLabel = SOURCE_LABELS[source || ''] || source || 'Intake';

      notificationMessage = `${name || 'Unknown'}`;
      if (email) notificationMessage += `\n${maskEmail(email)}`;
      if (business) notificationMessage += `\nBusiness: ${business}`;
      if (website) notificationMessage += `\nWebsite: ${website}`;
      if (phone) notificationMessage += `\nPhone: ${phone}`;
      if (service) notificationMessage += `\nService: ${service}`;
      if (price) notificationMessage += `\nPrice: ${price}`;
      if (situation) notificationMessage += `\nSituation: ${situation}`;
      if (budget) notificationMessage += `\nBudget: ${budget}`;
      if (timeline) notificationMessage += `\nTimeline: ${timeline}`;
      if (concerns) notificationMessage += `\nConcerns: ${concerns.substring(0, 200)}`;
      if (details) notificationMessage += `\nDetails: ${details.substring(0, 200)}`;
      if (description) notificationMessage += `\nDescription: ${description.substring(0, 200)}`;
      if (challenge) notificationMessage += `\nChallenge: ${challenge.substring(0, 200)}`;
      if (context) notificationMessage += `\nContext: ${context.substring(0, 200)}`;
      if (outcome) notificationMessage += `\nOutcome: ${outcome.substring(0, 200)}`;
      if (offer) notificationMessage += `\nOffer: ${offer}`;
      if (location) notificationMessage += `\n📌 ${location}`;

      notificationTitle = `New ${sourceLabel}`;
      notificationUrl = 'https://dash.bertrandgroup.ca/leads';
      notificationUrlTitle = 'View Leads';
      priority = 1; // High priority
      sound = 'cashregister';

    } else {
      // Generic form submission notification (normal priority with sound)
      const { name, email, service, message } = body as Record<string, string | undefined>;

      notificationMessage = `New inquiry from ${name || 'Unknown'}`;
      if (email) notificationMessage += `\nEmail: ${maskEmail(email)}`;
      if (service) notificationMessage += `\nService: ${service}`;
      if (message) notificationMessage += `\n\n${message.substring(0, 200)}${message.length > 200 ? '...' : ''}`;

      notificationTitle = 'BG Brands Inquiry';
      notificationUrl = 'https://bertrandbrands.ca/#contact';
      notificationUrlTitle = 'View Contact Form';
      priority = 0; // Normal priority
      sound = 'pushover';
    }

    // Build Pushover payload
    const pushoverPayload: PushoverPayload = {
      token: PUSHOVER_TOKEN,
      user: PUSHOVER_USER,
      message: notificationMessage,
      title: notificationTitle,
      url: notificationUrl,
      url_title: notificationUrlTitle,
      priority,
    };

    if (sound) {
      pushoverPayload.sound = sound;
    }

    // Send to Pushover
    const response = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pushoverPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Pushover error:', errorData);
      res.status(500).json({ error: 'Failed to send notification' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
