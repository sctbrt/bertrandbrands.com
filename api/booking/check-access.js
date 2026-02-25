// GET /api/booking/check-access
// Validates booking session from cookie
// Returns access status + Calendly URL for frontend

import {
  initializeDatabase,
  validateBookingSession,
  deleteBookingSession
} from '../_lib/db.js';
import { parseCookies, buildClearCookie } from '../_lib/cookies.js';

// Calendly URL map — the ONLY place these URLs exist
// Set active: true when Calendly events are ready for use
const CALENDLY_MAP = {
  focus_studio_kickoff: {
    url: 'https://calendly.com/bertrandbrands/focus-studio-kickoff',
    active: true
  },
  core_services_discovery: {
    url: 'https://calendly.com/bertrandbrands/core-services-discovery',
    active: true
  }
};

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Initialize database if needed
  await initializeDatabase();

  // Parse session ID from cookie
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies.bb_booking_session;

  // Validate session ID format (must be valid UUID)
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (sessionId && !UUID_REGEX.test(sessionId)) {
    return res.status(200).json({
      hasAccess: false,
      expiresAt: null
    });
  }

  if (!sessionId) {
    return res.status(200).json({
      hasAccess: false,
      expiresAt: null
    });
  }

  try {
    // Validate session
    const session = await validateBookingSession(sessionId);

    if (!session) {
      // Session expired or invalid - clear cookie
      res.setHeader('Set-Cookie', buildClearCookie('bb_booking_session', req.headers.host));

      return res.status(200).json({
        hasAccess: false,
        expiresAt: null
      });
    }

    // Look up Calendly config for this booking type
    const calendly = CALENDLY_MAP[session.booking_type] || null;

    // Calculate remaining time
    const expiresAt = new Date(session.expires_at);
    const remainingMinutes = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 60000));

    return res.status(200).json({
      hasAccess: true,
      bookingType: session.booking_type,
      calendlyUrl: calendly?.url || null,
      calendlyActive: calendly?.active || false,
      clientEmail: session.client_email,
      expiresAt: expiresAt.toISOString(),
      remainingMinutes
    });

  } catch (error) {
    console.error('Booking check access error:', error);
    return res.status(200).json({
      hasAccess: false,
      expiresAt: null
    });
  }
}
