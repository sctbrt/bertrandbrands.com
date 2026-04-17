// POST /api/questionnaire/create-token
// Admin-only endpoint that issues a magic-link for a client questionnaire
// and emails it to the client. Authenticated via QUESTIONNAIRE_ADMIN_SECRET.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { Resend } from 'resend';
import {
  initializeDatabase,
  createQuestionnaireToken,
  getQuestionnaireProject,
} from '../_lib/db.js';
import { generateToken } from '../_lib/crypto.js';
import { EMAIL_REGEX } from '../_lib/validation.js';
import { escapeHtml } from '../_lib/html.js';
import { createRateLimiter, getClientIp } from '../_lib/rate-limit.js';

const isRateLimited = createRateLimiter(60_000, 10);

const TOKEN_TTL_DAYS = 14;
const APP_URL = process.env.APP_URL || 'https://bertrandbrands.ca';

interface CreateTokenBody {
  projectId?: string;
  clientEmail?: string;
  clientName?: string;
  createdBy?: string;
}

interface EmailParams {
  firstName: string;
  projectName: string;
  magicLink: string;
  expiresDays: number;
}

function buildEmailHtml({ firstName, projectName, magicLink, expiresDays }: EmailParams): string {
  const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : 'Hi,';
  const projectLabel = escapeHtml(projectName);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Brand Discovery Questionnaire</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 520px; margin: 0 auto; padding: 40px 20px; background-color: #fafafa;">
  <div style="background: #ffffff; padding: 32px; border-radius: 8px; border: 1px solid #e5e5e5;">
    <p style="margin: 0 0 16px 0; font-size: 15px;">
      ${greeting}
    </p>
    <p style="margin: 0 0 20px 0; font-size: 15px;">
      Your Brand Discovery Questionnaire for <strong>${projectLabel}</strong> is ready.
    </p>
    <p style="margin: 0 0 24px 0; font-size: 15px;">
      Take your time, keep it simple, don&rsquo;t overthink it. Short answers are great. You can save your progress and come back anytime &mdash; nothing is final until you submit.
    </p>
    <a href="${escapeHtml(magicLink)}"
       style="display: inline-block; background: #0a0a0a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px;">
      Open My Questionnaire
    </a>
    <p style="margin: 24px 0 0 0; font-size: 13px; color: #666666;">
      This link works for the next ${expiresDays} days. If it expires before you finish, just let us know and we&rsquo;ll send a fresh one.
    </p>
  </div>
  <p style="margin: 24px 0 0 0; font-size: 12px; color: #999999; text-align: center;">
    Bertrand Brands | Brand &amp; Web Systems &middot; Sudbury, Ontario
  </p>
</body>
</html>
  `.trim();
}

function buildEmailText({ firstName, projectName, magicLink, expiresDays }: EmailParams): string {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi,';
  return `
${greeting}

Your Brand Discovery Questionnaire for ${projectName} is ready.

Take your time, keep it simple, don't overthink it. Short answers are great. You can save your progress and come back anytime — nothing is final until you submit.

Open your questionnaire: ${magicLink}

This link works for the next ${expiresDays} days. If it expires before you finish, just let us know and we'll send a fresh one.

--
Bertrand Brands | Brand & Web Systems · Sudbury, Ontario
  `.trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Admin auth (timing-safe compare)
  const adminSecret = process.env.QUESTIONNAIRE_ADMIN_SECRET;
  if (!adminSecret) {
    console.error('QUESTIONNAIRE_ADMIN_SECRET not configured');
    res.status(500).json({ error: 'Server misconfigured' });
    return;
  }

  const authHeader = req.headers['x-admin-secret'] as string | undefined;
  const authBuf = authHeader ? Buffer.from(authHeader) : Buffer.alloc(0);
  const secretBuf = Buffer.from(adminSecret);
  if (!authHeader ||
      authBuf.length !== secretBuf.length ||
      !crypto.timingSafeEqual(authBuf, secretBuf)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Rate limit
  const ip = getClientIp(req.headers);
  if (isRateLimited(ip)) {
    res.status(429).json({ error: 'Too many requests' });
    return;
  }

  await initializeDatabase();

  const { projectId, clientEmail, clientName, createdBy } = (req.body || {}) as CreateTokenBody;

  if (!projectId || !clientEmail) {
    res.status(400).json({
      error: 'Missing required fields',
      required: ['projectId', 'clientEmail'],
    });
    return;
  }

  const normalizedEmail = clientEmail.trim().toLowerCase();
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }

  try {
    const project = await getQuestionnaireProject(projectId.trim());
    if (!project) {
      res.status(400).json({ error: 'Unknown projectId' });
      return;
    }

    const trimmedName = clientName?.trim() || null;

    const { rawToken, tokenHash } = generateToken();
    const expiresAt = new Date(Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

    await createQuestionnaireToken({
      projectId: project.id,
      clientEmail: normalizedEmail,
      clientName: trimmedName,
      tokenHash,
      expiresAt: expiresAt.toISOString(),
      createdBy: createdBy?.trim() || 'admin',
    });

    const magicLink = `${APP_URL}/api/questionnaire/access?token=${rawToken}`;
    const firstName = trimmedName ? trimmedName.split(' ')[0] : '';

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Bertrand Brands <hello@bertrandgroup.ca>',
      to: normalizedEmail,
      subject: `Your Brand Discovery Questionnaire — ${project.name}`,
      html: buildEmailHtml({
        firstName,
        projectName: project.name,
        magicLink,
        expiresDays: TOKEN_TTL_DAYS,
      }),
      text: buildEmailText({
        firstName,
        projectName: project.name,
        magicLink,
        expiresDays: TOKEN_TTL_DAYS,
      }),
    });

    res.status(200).json({
      ok: true,
      projectId: project.id,
      projectName: project.name,
      expiresAt: expiresAt.toISOString(),
      emailSent: true,
    });
  } catch (error) {
    console.error('Create questionnaire token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
