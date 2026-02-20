// Vercel Serverless Function: Visitor & Form Notification via Pushover
// Endpoint: /api/notify

// In-memory rate limiting (resets on cold start, per-instance)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // max 10 requests per minute per IP

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  return false;
}

// Periodic cleanup to prevent memory leak (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS * 5) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export default async function handler(req, res) {
  // CORS: restrict to APP_URL origin
  const allowedOrigin = process.env.APP_URL || 'https://bertrandbrands.ca';
  const origin = req.headers.origin;

  if (origin === allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting by IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
             req.headers['x-real-ip'] ||
             'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  // Determine notification type based on request body
  const { type, name, email, service, message, page, referrer, utm,
          source, business, website, details, concerns, situation,
          budget, timeline, phone, description, challenge,
          tier, price, context, outcome, industry, contact_pref,
          offer } = req.body || {};

  // Pushover credentials (from environment variables)
  const PUSHOVER_USER = process.env.PUSHOVER_USER_KEY;
  const PUSHOVER_TOKEN = process.env.PUSHOVER_API_TOKEN;

  if (!PUSHOVER_USER || !PUSHOVER_TOKEN) {
    console.error('Pushover credentials not configured');
    return res.status(500).json({ error: 'Notification service not configured' });
  }

  try {
    let notificationMessage;
    let notificationTitle;
    let notificationUrl;
    let notificationUrlTitle;
    let priority;
    let sound;

    if (type === 'visitor') {
      // Visitor notification

      // Geolocation via Vercel headers (free, instant, no external API call)
      const geoCity = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : '';
      const geoRegion = req.headers['x-vercel-ip-country-region'] || '';
      const geoCountry = req.headers['x-vercel-ip-country'] || '';
      let location = '';
      if (geoCity) {
        location = geoCity;
        if (geoRegion) location += `, ${geoRegion}`;
        if (geoCountry) location += `, ${geoCountry}`;
      } else if (geoCountry) {
        location = geoCountry;
      }

      // Parse user agent for device summary
      const ua = req.headers['user-agent'] || '';
      let device = '';
      if (ua) {
        const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
        let browser = 'Unknown';
        if (/Edg\//i.test(ua)) browser = 'Edge';
        else if (/Chrome\//i.test(ua)) browser = 'Chrome';
        else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
        else if (/Firefox\//i.test(ua)) browser = 'Firefox';
        device = `${isMobile ? '📱' : '💻'} ${browser}`;
      }

      // Build source attribution line (UTM > referrer > nothing)
      let sourceLine = '';
      if (utm && utm.source) {
        const parts = [utm.source];
        if (utm.medium) parts.push(utm.medium);
        if (utm.campaign) parts.push(utm.campaign);
        sourceLine = parts.join(' / ');
        if (utm.gclid) sourceLine += ' (Google Ads)';
      } else if (referrer) {
        // Extract domain from referrer for cleaner display
        try {
          const refHost = new URL(referrer).hostname.replace('www.', '');
          sourceLine = refHost;
        } catch (e) {
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
      sound = null;
    } else if (type === 'intake') {
      // Intake form submission (high priority with distinct sound)

      // Geolocation via Vercel headers (free, instant, no external API call)
      const intakeCity = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : '';
      const intakeRegion = req.headers['x-vercel-ip-country-region'] || '';
      const intakeCountry = req.headers['x-vercel-ip-country'] || '';
      let location = '';
      if (intakeCity) {
        location = intakeCity;
        if (intakeRegion) location += `, ${intakeRegion}`;
        if (intakeCountry) location += `, ${intakeCountry}`;
      } else if (intakeCountry) {
        location = intakeCountry;
      }

      // Source labels for notification title
      const sourceLabels = {
        'exploratory-guided-intake': 'Exploratory Intake',
        'website_conversion_snapshot': 'Website Snapshot',
        'brand-clarity-diagnostic-intake': 'Brand Diagnostic',
        'sudbury_focus_studio': 'Sudbury Lead',
        'unified-intake': 'V10 Intake',
        'inline-starter': 'Starter Package Inquiry',
        'inline-refresh': 'Refresh Package Inquiry',
        'inline-platform': 'Platform Package Inquiry',
        'tier-intake': 'General Intake',
        'tier-intake-amber': 'Build Tier Inquiry',
        'tier-intake-violet': 'Transform Tier Inquiry',
        'tier-intake-blue': 'Care Tier Inquiry',
      };
      const sourceLabel = sourceLabels[source] || source || 'Intake';

      notificationMessage = `${name || 'Unknown'}`;
      if (email) notificationMessage += `\n${email}`;
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
      notificationMessage = `New inquiry from ${name || 'Unknown'}`;
      if (email) notificationMessage += `\nEmail: ${email}`;
      if (service) notificationMessage += `\nService: ${service}`;
      if (message) notificationMessage += `\n\n${message.substring(0, 200)}${message.length > 200 ? '...' : ''}`;

      notificationTitle = 'BG Brands Inquiry';
      notificationUrl = 'https://bertrandbrands.ca/#contact';
      notificationUrlTitle = 'View Contact Form';
      priority = 0; // Normal priority
      sound = 'pushover';
    }

    // Build Pushover payload
    const pushoverPayload = {
      token: PUSHOVER_TOKEN,
      user: PUSHOVER_USER,
      message: notificationMessage,
      title: notificationTitle,
      url: notificationUrl,
      url_title: notificationUrlTitle,
      priority: priority,
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
      return res.status(500).json({ error: 'Failed to send notification' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Notification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
