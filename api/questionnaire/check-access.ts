// GET /api/questionnaire/check-access
// Validates the session cookie and returns the hydrated state the wizard
// needs to render (project info, responses so far, current step, status).

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  initializeDatabase,
  getQuestionnaireSessionById,
  getQuestionnaireProject,
} from '../_lib/db.js';
import { parseCookies, buildClearCookie } from '../_lib/cookies.js';
import { UUID_REGEX } from '../_lib/validation.js';
import { getAddendumStep } from '../../src/lib/questionnaire-addendums/index.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const allowedOrigin = process.env.APP_URL || 'https://bertrandbrands.ca';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

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
      addendumStep, // full QuestionnaireStep definition (or null) so the client can render step 9
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
