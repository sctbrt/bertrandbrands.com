// POST /api/questionnaire/logout
// Clears the session cookie on the client. The DB row is preserved — the client
// can return via a fresh magic link and resume their in-progress responses.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parseCookies, buildClearCookie } from '../_lib/cookies.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const allowedOrigin = process.env.APP_URL || 'https://bertrandbrands.ca';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Always clear the cookie, regardless of whether a session existed
  res.setHeader('Set-Cookie', buildClearCookie('bb_questionnaire_session', req.headers.host));

  // Parse is only used for logging clarity — we intentionally do NOT delete the DB row.
  const cookies = parseCookies(req.headers.cookie);
  void cookies.bb_questionnaire_session;

  res.status(200).json({ ok: true });
}
