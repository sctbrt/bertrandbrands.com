// POST /api/questionnaire/complete
// Finalizes a questionnaire session. Validates all required fields are
// populated, marks the row completed, then fires:
//   1. Pushover notification via /api/notify (fire-and-forget)
//   2. Admin summary email via Resend (awaited — so failures surface in logs)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import {
  initializeDatabase,
  getQuestionnaireSessionById,
  getQuestionnaireProject,
  completeQuestionnaireSession,
} from '../_lib/db.js';
import { parseCookies, buildClearCookie } from '../_lib/cookies.js';
import { UUID_REGEX, maskEmail } from '../_lib/validation.js';
import { escapeHtml } from '../_lib/html.js';
import {
  STANDARD_STEPS,
  validateAllRequired,
  serializeResponsesAsHtmlTable,
  serializeResponsesAsPlainText,
  type QuestionnaireStep,
} from '../../src/lib/questionnaire-schema.js';
import { getAddendumStep } from '../../src/lib/questionnaire-addendums/index.js';

const APP_URL = process.env.APP_URL || 'https://bertrandbrands.ca';
const ADMIN_EMAIL = process.env.QUESTIONNAIRE_ADMIN_EMAIL || 'hello@bertrandgroup.ca';

interface CompleteBody {
  // No body required — session cookie carries identity. Kept as interface for future extensibility.
  [key: string]: unknown;
}

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

// Fire the Pushover notification via /api/notify so it reuses the existing
// notification plumbing (source labels, geo, formatting).
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
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
      },
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
    // Don't throw — notification failure should not fail the request.
  }
}

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

  await initializeDatabase();

  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies.bb_questionnaire_session;

  if (!sessionId || !UUID_REGEX.test(sessionId)) {
    res.status(401).json({ error: 'No active session' });
    return;
  }

  // The body is currently unused but we accept POST + validate shape to keep the
  // contract extensible (e.g. a future "notes from the client" field).
  const _body = (req.body || {}) as CompleteBody;
  void _body;

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

    // Fire Pushover — awaited briefly so the fetch starts, but we don't block on a hung
    // network. The function itself swallows errors internally.
    await firePushoverNotification({
      clientName: completed.client_name,
      clientEmail: completed.client_email,
      projectName,
      origin: APP_URL,
    });

    // Admin summary email
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
      // Don't fail the user request — the DB record is the source of truth.
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('complete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
