// POST /api/booking/logout
// Clears booking session cookie and deletes session from database

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeDatabase, deleteBookingSession } from '../_lib/db.js';
import { parseCookies, buildClearCookie } from '../_lib/cookies.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Initialize database if needed
  await initializeDatabase();

  // Parse session ID from cookie
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies.bb_booking_session;

  // Clear cookie regardless
  res.setHeader('Set-Cookie', buildClearCookie('bb_booking_session', req.headers.host));

  // Delete session from database if exists
  if (sessionId) {
    try {
      await deleteBookingSession(sessionId);
    } catch (error) {
      console.error('Booking logout error:', error);
      // Continue anyway - cookie is cleared
    }
  }

  res.status(200).json({ ok: true });
}
