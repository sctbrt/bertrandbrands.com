// GET /api/questionnaire/access?token=...
// Consumes a magic-link token, creates/refreshes a session, sets a session
// cookie, and redirects the client to /questionnaire.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  initializeDatabase,
  consumeQuestionnaireToken,
  findOrCreateQuestionnaireSession,
} from '../_lib/db.js';
import { hashToken } from '../_lib/crypto.js';
import { buildCookie } from '../_lib/cookies.js';
import { errorPageHtml } from '../_lib/html.js';
import { createRateLimiter, getClientIp } from '../_lib/rate-limit.js';

const isRateLimited = createRateLimiter(60_000, 10);

const SESSION_TTL_DAYS = 30;
const APP_URL = process.env.APP_URL || 'https://bertrandbrands.ca';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ip = getClientIp(req.headers);
  if (isRateLimited(ip)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(429).send(errorPageHtml(
      'Too Many Requests',
      'Please wait a moment before trying again.',
      { backHref: '/', backLabel: 'Back to Home' }
    ));
    return;
  }

  await initializeDatabase();

  const token = req.query.token as string | undefined;

  if (!token || typeof token !== 'string' || token.length !== 64) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(400).send(errorPageHtml(
      'Invalid Link',
      'This questionnaire link looks malformed. Please request a fresh link from your contact at Bertrand Brands.',
      { backHref: '/', backLabel: 'Back to Home' }
    ));
    return;
  }

  try {
    const tokenHash = hashToken(token);
    const tokenRow = await consumeQuestionnaireToken(tokenHash);

    if (!tokenRow) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(400).send(errorPageHtml(
        'Link Expired or Already Used',
        'This questionnaire link has either expired or already been used. We can send a fresh one — just reply to the email we sent, or reach out to Bertrand Brands.',
        { backHref: '/', backLabel: 'Back to Home' }
      ));
      return;
    }

    const sessionExpiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

    const { id: sessionId } = await findOrCreateQuestionnaireSession({
      projectId: tokenRow.project_id,
      clientEmail: tokenRow.client_email,
      clientName: tokenRow.client_name,
      expiresAt: sessionExpiresAt.toISOString(),
    });

    const maxAgeSeconds = SESSION_TTL_DAYS * 24 * 60 * 60;
    res.setHeader(
      'Set-Cookie',
      buildCookie('bb_questionnaire_session', sessionId, maxAgeSeconds, { hostname: req.headers.host })
    );

    res.setHeader('Location', `${APP_URL}/questionnaire`);
    res.status(302).end();
  } catch (error) {
    console.error('Questionnaire access verification error:', error);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(500).send(errorPageHtml(
      'Something Went Wrong',
      'We hit an error processing your link. Please try again in a moment, or reach out to Bertrand Brands.',
      { backHref: '/', backLabel: 'Back to Home' }
    ));
  }
}
