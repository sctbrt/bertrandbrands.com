// Vercel Serverless Function: Visitor & Form Notification via Pushover
// Endpoint: /api/notify

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Determine notification type based on request body
  const { type, name, email, service, message, page, referrer } = req.body || {};

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
      // Visitor notification (silent, low priority)
      const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
                 req.headers['x-real-ip'] ||
                 req.connection?.remoteAddress ||
                 'unknown';

      // Get location from IP (using ipapi.co — free tier supports HTTPS, 1000 req/day)
      let location = '';
      if (ip && ip !== 'unknown' && ip !== '::1' && ip !== '127.0.0.1') {
        try {
          const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
          if (geoRes.ok) {
            const geo = await geoRes.json();
            if (geo.city && !geo.error) {
              location = `${geo.city}${geo.region_code ? `, ${geo.region_code}` : ''}${geo.country_name ? `, ${geo.country_name}` : ''}`;
            }
          }
        } catch (geoErr) {
          // Silently fail - location is optional
        }
      }

      notificationMessage = `📍 ${page || 'Homepage'}`;
      if (referrer) notificationMessage += `\nFrom: ${referrer}`;
      if (location) notificationMessage += `\n📌 ${location}`;

      notificationTitle = 'Visitor on Bertrand Brands';
      notificationUrl = `https://bertrandbrands.com${page || '/'}`;
      notificationUrlTitle = 'View Page';
      priority = -1; // Low priority (silent, no sound)
      sound = null;
    } else {
      // Form submission notification (normal priority with sound)
      notificationMessage = `New inquiry from ${name || 'Unknown'}`;
      if (email) notificationMessage += `\nEmail: ${email}`;
      if (service) notificationMessage += `\nService: ${service}`;
      if (message) notificationMessage += `\n\n${message.substring(0, 200)}${message.length > 200 ? '...' : ''}`;

      notificationTitle = 'Bertrand Brands Inquiry';
      notificationUrl = 'https://bertrandbrands.com/#contact';
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
