// Vercel Serverless Function: Website Snapshot Review Booking
// Endpoint: /api/snapshot/book

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, website, concern, source, offer, rate } = req.body || {};

  // Validate required fields
  if (!name || !email || !website) {
    return res.status(400).json({ error: 'Missing required fields: name, email, website' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Pushover credentials
  const PUSHOVER_USER = process.env.PUSHOVER_USER_KEY;
  const PUSHOVER_TOKEN = process.env.PUSHOVER_API_TOKEN;

  if (!PUSHOVER_USER || !PUSHOVER_TOKEN) {
    console.error('Pushover credentials not configured');
    return res.status(500).json({ error: 'Notification service not configured' });
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
    const pushoverResponse = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: PUSHOVER_TOKEN,
        user: PUSHOVER_USER,
        message: message,
        title: 'New Snapshot Booking!',
        url: website,
        url_title: 'View Their Website',
        priority: 1, // High priority
        sound: 'cashregister',
      }),
    });

    if (!pushoverResponse.ok) {
      console.error('Pushover notification failed');
    }

    // Log booking for analytics (can be expanded to database later)
    console.log('Snapshot booking:', {
      timestamp: new Date().toISOString(),
      name,
      email,
      website,
      concern: concern || null,
      source: source || 'direct',
      offer: offer || 'website-snapshot-review',
      rate: rate || 'standard',
    });

    return res.status(200).json({
      success: true,
      message: 'Booking received. We\'ll confirm within 1-2 business days.'
    });

  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
