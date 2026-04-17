// POST /api/questionnaire/save-field
// Auto-save endpoint called on every debounced field change.
// Validates the field against the canonical schema (never trusts the client)
// and uses JSONB partial update to atomically persist the new value.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  initializeDatabase,
  getQuestionnaireSessionById,
  getQuestionnaireProject,
  saveQuestionnaireField,
} from '../_lib/db.js';
import { parseCookies, buildClearCookie } from '../_lib/cookies.js';
import { UUID_REGEX } from '../_lib/validation.js';
import { createRateLimiter } from '../_lib/rate-limit.js';
import {
  STANDARD_STEPS,
  getFieldByKey,
  validateFieldValue,
  type QuestionnaireStep,
} from '../../src/lib/questionnaire-schema.js';
import { getAddendumStep } from '../../src/lib/questionnaire-addendums/index.js';

// Higher cap — a user typing fast can easily hit 60+ debounced saves per minute
// across multiple fields. Per-session, not per-IP.
const isRateLimited = createRateLimiter(60_000, 120);

const SESSION_TTL_DAYS = 30;

interface SaveFieldBody {
  fieldKey?: string;
  value?: unknown;
  currentStep?: number;
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

  // Rate limit per session (not per IP — a client may share IPs with others)
  if (isRateLimited(sessionId)) {
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

    // Build the active schema for this session's project
    const project = await getQuestionnaireProject(session.project_id);
    const addendum = getAddendumStep(project?.addendum_key);
    const combined: QuestionnaireStep[] = addendum ? [...STANDARD_STEPS, addendum] : STANDARD_STEPS;

    const field = getFieldByKey(combined, fieldKey);
    if (!field) {
      res.status(400).json({ error: 'Unknown field' });
      return;
    }

    const validated = validateFieldValue(field, value);
    if (!validated.ok) {
      res.status(400).json({ error: validated.reason });
      return;
    }

    // Sliding 30-day expiry — the client is actively using the form
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
