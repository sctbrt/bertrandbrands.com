// Vercel Serverless Function: Form Submission Notification via Pushover
// Endpoint: /api/notify

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get form data from request
  const { name, email, service, message } = req.body || {};

  // Pushover credentials (from environment variables)
  const PUSHOVER_USER = process.env.PUSHOVER_USER_KEY;
  const PUSHOVER_TOKEN = process.env.PUSHOVER_API_TOKEN;

  if (!PUSHOVER_USER || !PUSHOVER_TOKEN) {
    console.error('Pushover credentials not configured');
    return res.status(500).json({ error: 'Notification service not configured' });
  }

  try {
    // Build notification message
    let notificationMessage = `New inquiry from ${name || 'Unknown'}`;
    if (email) notificationMessage += `\nEmail: ${email}`;
    if (service) notificationMessage += `\nService: ${service}`;
    if (message) notificationMessage += `\n\n${message.substring(0, 200)}${message.length > 200 ? '...' : ''}`;

    // Send to Pushover
    const response = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: PUSHOVER_TOKEN,
        user: PUSHOVER_USER,
        message: notificationMessage,
        title: 'Bertrand Brands Inquiry',
        url: 'https://bertrandbrands.com/#contact',
        url_title: 'View Contact Form',
        priority: 0, // Normal priority
        sound: 'pushover',
      }),
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
