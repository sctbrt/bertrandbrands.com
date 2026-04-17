// /api/questionnaire — single-file router for all questionnaire endpoints.
//
// Dispatches to one of six actions via ?action=<name>. Consolidated from 6
// individual files to stay under Vercel Hobby's 12-function-per-deployment cap.
//
// Routes:
//   GET  /api/questionnaire?action=access&token=...  — magic link redeem (HTML redirect)
//   GET  /api/questionnaire?action=check-access      — session hydration (JSON)
//   POST /api/questionnaire?action=save-field        — per-field autosave (JSON)
//   POST /api/questionnaire?action=complete          — finalize + email (JSON)
//   POST /api/questionnaire?action=logout            — clear cookie (JSON)
//   POST /api/questionnaire?action=create-token      — admin magic-link creation (JSON)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { Resend } from 'resend';
import {
  initializeDatabase,
  consumeQuestionnaireToken,
  findOrCreateQuestionnaireSession,
  getQuestionnaireSessionById,
  getQuestionnaireProject,
  saveQuestionnaireField,
  completeQuestionnaireSession,
  createQuestionnaireToken,
} from '../_lib/db.js';
import { hashToken, generateToken } from '../_lib/crypto.js';
import { buildCookie, parseCookies, buildClearCookie } from '../_lib/cookies.js';
import { errorPageHtml, escapeHtml } from '../_lib/html.js';
import { createRateLimiter, getClientIp } from '../_lib/rate-limit.js';
import { EMAIL_REGEX, UUID_REGEX, maskEmail } from '../_lib/validation.js';
import {
  STANDARD_STEPS,
  getFieldByKey,
  validateFieldValue,
  validateAllRequired,
  serializeResponsesAsHtmlTable,
  serializeResponsesAsPlainText,
  type QuestionnaireStep,
} from '../../src/lib/questionnaire-schema.js';
import { getAddendumStep } from '../../src/lib/questionnaire-addendums/index.js';

const APP_URL = process.env.APP_URL || 'https://bertrandbrands.ca';
const SESSION_TTL_DAYS = 30;
const TOKEN_TTL_DAYS = 14;
const ADMIN_EMAIL = process.env.QUESTIONNAIRE_ADMIN_EMAIL || 'hello@bertrandgroup.ca';

// Rate limiters (per warm instance)
const accessRateLimit = createRateLimiter(60_000, 10);
const createTokenRateLimit = createRateLimiter(60_000, 10);
const saveFieldRateLimit = createRateLimiter(60_000, 120); // per-session, typing is fast

// ============================================================================
// Router
// ============================================================================

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const action = typeof req.query.action === 'string' ? req.query.action : '';

  // CORS preamble (not applied to `access` and `create-token` — those have their own handling)
  if (action !== 'access' && action !== 'create-token') {
    const allowedOrigin = APP_URL;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  }

  switch (action) {
    case 'access':         return accessHandler(req, res);
    case 'check-access':   return checkAccessHandler(req, res);
    case 'save-field':     return saveFieldHandler(req, res);
    case 'complete':       return completeHandler(req, res);
    case 'logout':         return logoutHandler(req, res);
    case 'create-token':   return createTokenHandler(req, res);
    default:
      res.status(404).json({ error: 'Unknown action' });
      return;
  }
}

// ============================================================================
// access — GET, consumes magic-link token, sets cookie, 302s to /questionnaire
// ============================================================================

async function accessHandler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ip = getClientIp(req.headers);
  if (accessRateLimit(ip)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(429).send(errorPageHtml(
      'Too Many Requests',
      'Please wait a moment before trying again.',
      { backHref: '/', backLabel: 'Back to Home' }
    ));
    return;
  }

  await initializeDatabase();

  const token = typeof req.query.token === 'string' ? req.query.token : undefined;

  if (!token || token.length !== 64) {
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

// ============================================================================
// check-access — GET, validates cookie, returns hydration payload
// ============================================================================

async function checkAccessHandler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  await initializeDatabase();

  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies.bb_questionnaire_session;

  if (!sessionId || !UUID_REGEX.test(sessionId)) {
    res.status(200).json({ hasAccess: false });
    return;
  }

  try {
    const session = await getQuestionnaireSessionById(sessionId);
    if (!session) {
      res.setHeader('Set-Cookie', buildClearCookie('bb_questionnaire_session', req.headers.host));
      res.status(200).json({ hasAccess: false });
      return;
    }

    const project = await getQuestionnaireProject(session.project_id);
    const addendumStep = getAddendumStep(project?.addendum_key) || null;

    res.status(200).json({
      hasAccess: true,
      projectId: session.project_id,
      projectName: project?.name || 'Your Project',
      addendumKey: project?.addendum_key || null,
      addendumStep,
      clientEmail: session.client_email,
      clientName: session.client_name,
      status: session.status,
      currentStep: session.current_step,
      responses: session.responses,
      fieldUpdatedAt: session.field_updated_at,
      completedAt: session.completed_at,
      expiresAt: session.expires_at,
    });
  } catch (error) {
    console.error('Questionnaire check-access error:', error);
    res.status(200).json({ hasAccess: false });
  }
}

// ============================================================================
// save-field — POST, validates against canonical schema, JSONB partial update
// ============================================================================

interface SaveFieldBody {
  fieldKey?: string;
  value?: unknown;
  currentStep?: number;
}

async function saveFieldHandler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  await initializeDatabase();

  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies.bb_questionnaire_session;

  if (!sessionId || !UUID_REGEX.test(sessionId)) {
    res.status(401).json({ error: 'No active session' });
    return;
  }

  if (saveFieldRateLimit(sessionId)) {
    res.status(429).json({ error: 'Too many saves in a short window' });
    return;
  }

  const { fieldKey, value, currentStep } = (req.body || {}) as SaveFieldBody;

  if (!fieldKey || typeof fieldKey !== 'string') {
    res.status(400).json({ error: 'Missing fieldKey' });
    return;
  }

  if (currentStep !== undefined && (typeof currentStep !== 'number' || currentStep < 1 || currentStep > 9)) {
    res.status(400).json({ error: 'Invalid currentStep' });
    return;
  }

  try {
    const session = await getQuestionnaireSessionById(sessionId);
    if (!session) {
      res.setHeader('Set-Cookie', buildClearCookie('bb_questionnaire_session', req.headers.host));
      res.status(401).json({ error: 'Session expired' });
      return;
    }

    if (session.status === 'completed') {
      res.status(409).json({ error: 'Questionnaire already submitted' });
      return;
    }

    const project = await getQuestionnaireProject(session.project_id);
    const addendum = getAddendumStep(project?.addendum_key);
    const combined: QuestionnaireStep[] = addendum ? [...STANDARD_STEPS, addendum] : STANDARD_STEPS;

    const field = getFieldByKey(combined, fieldKey);
    if (!field) {
      res.status(400).json({ error: 'Unknown field' });
      return;
    }

    const validated = validateFieldValue(field, value);
    if ('reason' in validated) {
      res.status(400).json({ error: validated.reason });
      return;
    }

    const newExpiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

    const result = await saveQuestionnaireField({
      sessionId,
      fieldKey: field.key,
      value: validated.sanitized,
      currentStep,
      expiresAt: newExpiresAt,
    });

    if (!result) {
      res.status(500).json({ error: 'Failed to save' });
      return;
    }

    res.status(200).json({ ok: true, savedAt: result.savedAt });
  } catch (error) {
    console.error('save-field error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ============================================================================
// complete — POST, validates required, finalizes, emails admin
// ============================================================================

function buildSummaryEmailHtml(params: {
  clientName: string | null;
  clientEmail: string;
  projectName: string;
  combinedSteps: QuestionnaireStep[];
  responses: Record<string, unknown>;
  fieldUpdatedAt: Record<string, string>;
  sessionId: string;
  completedAt: string;
}): string {
  const { clientName, clientEmail, projectName, combinedSteps, responses, fieldUpdatedAt, sessionId, completedAt } = params;
  const table = serializeResponsesAsHtmlTable(combinedSteps, responses, fieldUpdatedAt, escapeHtml);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Questionnaire completed</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.5;color:#1a1a1a;max-width:720px;margin:0 auto;padding:40px 20px;background:#fafafa">
  <div style="background:#ffffff;padding:32px;border-radius:8px;border:1px solid #e5e5e5">
    <h1 style="font-size:20px;font-weight:600;margin:0 0 8px 0">Brand Discovery Questionnaire completed</h1>
    <p style="margin:0 0 4px 0;color:#555">
      <strong>${escapeHtml(clientName || 'Unknown client')}</strong> &mdash; ${escapeHtml(clientEmail)}
    </p>
    <p style="margin:0 0 4px 0;color:#555">Project: <strong>${escapeHtml(projectName)}</strong></p>
    <p style="margin:0 0 24px 0;color:#999;font-size:12px">
      Session <code>${escapeHtml(sessionId)}</code> &middot; Completed ${escapeHtml(new Date(completedAt).toLocaleString())}
    </p>
    ${table}
  </div>
  <p style="margin:24px 0 0 0;font-size:12px;color:#999;text-align:center">
    Bertrand Brands &middot; admin notification
  </p>
</body>
</html>
  `.trim();
}

function buildSummaryEmailText(params: {
  clientName: string | null;
  clientEmail: string;
  projectName: string;
  combinedSteps: QuestionnaireStep[];
  responses: Record<string, unknown>;
  sessionId: string;
  completedAt: string;
}): string {
  const { clientName, clientEmail, projectName, combinedSteps, responses, sessionId, completedAt } = params;
  const body = serializeResponsesAsPlainText(combinedSteps, responses);
  return `
Brand Discovery Questionnaire completed

Client: ${clientName || 'Unknown'} — ${clientEmail}
Project: ${projectName}
Session: ${sessionId}
Completed: ${new Date(completedAt).toLocaleString()}
${body}
  `.trim();
}

async function firePushoverNotification(params: {
  clientName: string | null;
  clientEmail: string;
  projectName: string;
  origin: string;
}): Promise<void> {
  const { clientName, clientEmail, projectName, origin } = params;
  try {
    await fetch(`${origin}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: origin },
      body: JSON.stringify({
        type: 'intake',
        source: 'questionnaire-completed',
        name: clientName || 'Unknown',
        email: clientEmail,
        service: `Brand Discovery Questionnaire — ${projectName}`,
      }),
    });
  } catch (err) {
    console.error('Pushover notify failed:', err);
  }
}

async function completeHandler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  await initializeDatabase();

  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies.bb_questionnaire_session;

  if (!sessionId || !UUID_REGEX.test(sessionId)) {
    res.status(401).json({ error: 'No active session' });
    return;
  }

  try {
    const session = await getQuestionnaireSessionById(sessionId);
    if (!session) {
      res.setHeader('Set-Cookie', buildClearCookie('bb_questionnaire_session', req.headers.host));
      res.status(401).json({ error: 'Session expired' });
      return;
    }

    if (session.status === 'completed') {
      res.status(200).json({ ok: true, alreadyCompleted: true });
      return;
    }

    const project = await getQuestionnaireProject(session.project_id);
    const addendum = getAddendumStep(project?.addendum_key);
    const combined: QuestionnaireStep[] = addendum ? [...STANDARD_STEPS, addendum] : STANDARD_STEPS;

    const requiredCheck = validateAllRequired(combined, session.responses);
    if ('missing' in requiredCheck) {
      res.status(400).json({
        error: 'Some required answers are missing',
        missing: requiredCheck.missing,
      });
      return;
    }

    const completed = await completeQuestionnaireSession(sessionId);
    if (!completed) {
      res.status(500).json({ error: 'Failed to finalize submission' });
      return;
    }

    const projectName = project?.name || 'Your Project';
    const completedAt = completed.completed_at || new Date().toISOString();

    await firePushoverNotification({
      clientName: completed.client_name,
      clientEmail: completed.client_email,
      projectName,
      origin: APP_URL,
    });

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Bertrand Brands <hello@bertrandgroup.ca>',
        to: ADMIN_EMAIL,
        subject: `Questionnaire completed — ${completed.client_name || 'Client'} (${projectName})`,
        html: buildSummaryEmailHtml({
          clientName: completed.client_name,
          clientEmail: completed.client_email,
          projectName,
          combinedSteps: combined,
          responses: completed.responses,
          fieldUpdatedAt: completed.field_updated_at,
          sessionId: completed.id,
          completedAt,
        }),
        text: buildSummaryEmailText({
          clientName: completed.client_name,
          clientEmail: completed.client_email,
          projectName,
          combinedSteps: combined,
          responses: completed.responses,
          sessionId: completed.id,
          completedAt,
        }),
      });
    } catch (emailErr) {
      console.error('Admin summary email failed for session', completed.id, maskEmail(completed.client_email), emailErr);
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('complete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ============================================================================
// logout — POST, clears cookie, preserves DB row
// ============================================================================

async function logoutHandler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  res.setHeader('Set-Cookie', buildClearCookie('bb_questionnaire_session', req.headers.host));

  const cookies = parseCookies(req.headers.cookie);
  void cookies.bb_questionnaire_session;

  res.status(200).json({ ok: true });
}

// ============================================================================
// create-token — POST, admin-only, issues magic link + emails client
// ============================================================================

interface CreateTokenBody {
  projectId?: string;
  clientEmail?: string;
  clientName?: string;
  createdBy?: string;
}

interface CreateTokenEmailParams {
  firstName: string;
  projectName: string;
  magicLink: string;
  expiresDays: number;
}

function buildCreateTokenEmailHtml({ firstName, projectName, magicLink, expiresDays }: CreateTokenEmailParams): string {
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

function buildCreateTokenEmailText({ firstName, projectName, magicLink, expiresDays }: CreateTokenEmailParams): string {
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

async function createTokenHandler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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

  const ip = getClientIp(req.headers);
  if (createTokenRateLimit(ip)) {
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

    const magicLink = `${APP_URL}/api/questionnaire?action=access&token=${rawToken}`;
    const firstName = trimmedName ? trimmedName.split(' ')[0] : '';

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Bertrand Brands <hello@bertrandgroup.ca>',
      to: normalizedEmail,
      subject: `Your Brand Discovery Questionnaire — ${project.name}`,
      html: buildCreateTokenEmailHtml({
        firstName,
        projectName: project.name,
        magicLink,
        expiresDays: TOKEN_TTL_DAYS,
      }),
      text: buildCreateTokenEmailText({
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
