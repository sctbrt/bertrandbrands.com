// Database utilities for Vercel Postgres
// Uses @vercel/postgres for serverless-friendly connection pooling

import { sql } from '@vercel/postgres';
import type {
  MagicLinkRow,
  PricingSessionRow,
  BookingTokenRow,
  BookingSessionRow,
  CreateMagicLinkParams,
  CreatePricingSessionParams,
  CreateBookingTokenParams,
  CreateBookingSessionParams,
  QuestionnaireProjectRow,
  QuestionnaireTokenRow,
  QuestionnaireSessionRow,
  CreateQuestionnaireTokenParams,
  UpsertQuestionnaireProjectParams,
  FindOrCreateQuestionnaireSessionParams,
  SaveQuestionnaireFieldParams,
} from './types.js';

/**
 * Initialize database tables if they don't exist
 * Called on first request or can be run manually
 */
export async function initializeDatabase(): Promise<{ success: boolean; error?: string }> {
  try {
    // Create pricing_magic_links table
    await sql`
      CREATE TABLE IF NOT EXISTS pricing_magic_links (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        used_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // Create pricing_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS pricing_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // Create indexes for faster lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_magic_links_token_hash
      ON pricing_magic_links(token_hash)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_magic_links_email_created
      ON pricing_magic_links(email, created_at)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_sessions_expires
      ON pricing_sessions(expires_at)
    `;

    // NOTE: The `clients` table is owned by the system-build project
    // (CRM at dash.bertrandbrands.ca). Both projects share this Neon DB.
    // We do NOT create or index `clients` here — system-build's schema
    // uses different column names and our CREATE INDEX would fail,
    // aborting the rest of initializeDatabase(). The booking endpoints
    // in this codebase query `clients.contact_email` which doesn't
    // match system-build's schema — booking create-token is broken
    // until we reconcile column names (tracked separately).

    // Create booking_access_tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS booking_access_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id TEXT NOT NULL,
        booking_type TEXT NOT NULL,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        used_at TIMESTAMPTZ,
        created_by TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // Create booking_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS booking_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id TEXT NOT NULL,
        booking_type TEXT NOT NULL,
        client_email TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // Create indexes for booking tables
    await sql`
      CREATE INDEX IF NOT EXISTS idx_booking_tokens_hash
      ON booking_access_tokens(token_hash)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_booking_sessions_expires
      ON booking_sessions(expires_at)
    `;

    // ============================================
    // QUESTIONNAIRE TABLES (v13.4)
    // ============================================

    // Project registry — one row per project that can issue questionnaires
    await sql`
      CREATE TABLE IF NOT EXISTS questionnaire_projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        addendum_key TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // Seed the default project so admins can issue questionnaires without pre-creating a project row
    await sql`
      INSERT INTO questionnaire_projects (id, name, addendum_key)
      VALUES ('default', 'Default Project', NULL)
      ON CONFLICT (id) DO NOTHING
    `;

    // Magic-link tokens for client access
    await sql`
      CREATE TABLE IF NOT EXISTS questionnaire_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id TEXT NOT NULL REFERENCES questionnaire_projects(id),
        client_email TEXT NOT NULL,
        client_name TEXT,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        used_at TIMESTAMPTZ,
        created_by TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // Redeemed sessions with field-level response state (JSONB for atomic auto-saves)
    await sql`
      CREATE TABLE IF NOT EXISTS questionnaire_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id TEXT NOT NULL REFERENCES questionnaire_projects(id),
        client_email TEXT NOT NULL,
        client_name TEXT,
        status TEXT NOT NULL DEFAULT 'in_progress',
        current_step INTEGER NOT NULL DEFAULT 1,
        responses JSONB NOT NULL DEFAULT '{}'::jsonb,
        field_updated_at JSONB NOT NULL DEFAULT '{}'::jsonb,
        expires_at TIMESTAMPTZ NOT NULL,
        completed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_questionnaire_tokens_hash
      ON questionnaire_tokens(token_hash)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_questionnaire_tokens_expires
      ON questionnaire_tokens(expires_at)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_questionnaire_sessions_project_email
      ON questionnaire_sessions(project_id, client_email)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_questionnaire_sessions_expires
      ON questionnaire_sessions(expires_at)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_questionnaire_sessions_status
      ON questionnaire_sessions(status)
    `;

    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Create a magic link record
 */
export async function createMagicLink({ email, tokenHash, expiresAt }: CreateMagicLinkParams): Promise<{ id: string }> {
  const result = await sql<{ id: string }>`
    INSERT INTO pricing_magic_links (email, token_hash, expires_at)
    VALUES (${email}, ${tokenHash}, ${expiresAt})
    RETURNING id
  `;
  return result.rows[0];
}

/**
 * Mark a magic link as used (atomic operation)
 * Returns the link if successfully marked, null if already used or invalid
 */
export async function consumeMagicLink(tokenHash: string): Promise<MagicLinkRow | null> {
  const result = await sql<MagicLinkRow>`
    UPDATE pricing_magic_links
    SET used_at = NOW()
    WHERE token_hash = ${tokenHash}
      AND used_at IS NULL
      AND expires_at > NOW()
    RETURNING id, email
  `;
  return result.rows[0] || null;
}

/**
 * Create a pricing session
 */
export async function createPricingSession({ email, expiresAt }: CreatePricingSessionParams): Promise<{ id: string }> {
  const result = await sql<{ id: string }>`
    INSERT INTO pricing_sessions (email, expires_at)
    VALUES (${email}, ${expiresAt})
    RETURNING id
  `;
  return result.rows[0];
}

/**
 * Validate a pricing session by ID
 * Returns session if valid, null if not found or expired
 */
export async function validatePricingSession(sessionId: string): Promise<PricingSessionRow | null> {
  if (!sessionId) return null;

  try {
    const result = await sql<PricingSessionRow>`
      SELECT id, email, expires_at
      FROM pricing_sessions
      WHERE id = ${sessionId}::uuid
        AND expires_at > NOW()
    `;
    return result.rows[0] || null;
  } catch (error) {
    // Invalid UUID format or other error
    console.error('Session validation error:', error);
    return null;
  }
}

/**
 * Delete a pricing session
 */
export async function deletePricingSession(sessionId: string): Promise<boolean> {
  if (!sessionId) return false;

  try {
    await sql`
      DELETE FROM pricing_sessions
      WHERE id = ${sessionId}::uuid
    `;
    return true;
  } catch (error) {
    console.error('Session deletion error:', error);
    return false;
  }
}

/**
 * Count recent magic link requests for rate limiting
 * Returns count of requests in the last hour for given email
 */
export async function countRecentRequests({ email }: { email: string }): Promise<{ emailCount: number }> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  // Count by email
  const emailResult = await sql<{ count: string }>`
    SELECT COUNT(*) as count
    FROM pricing_magic_links
    WHERE email = ${email}
      AND created_at > ${oneHourAgo}::timestamptz
  `;

  return {
    emailCount: parseInt(emailResult.rows[0]?.count || '0', 10)
  };
}

/**
 * Look up a client's email by their ID
 */
export async function getClientEmail(clientId: string): Promise<string | null> {
  const result = await sql<{ contact_email: string }>`
    SELECT contact_email FROM clients WHERE id = ${clientId}
  `;
  return result.rows[0]?.contact_email || null;
}

// ============================================
// BOOKING ACCESS FUNCTIONS
// ============================================

/**
 * Create a booking access token
 */
export async function createBookingToken({ clientId, bookingType, tokenHash, expiresAt, createdBy }: CreateBookingTokenParams): Promise<{ id: string }> {
  const result = await sql<{ id: string }>`
    INSERT INTO booking_access_tokens (client_id, booking_type, token_hash, expires_at, created_by)
    VALUES (${clientId}, ${bookingType}, ${tokenHash}, ${expiresAt}, ${createdBy})
    RETURNING id
  `;
  return result.rows[0];
}

/**
 * Consume a booking access token (atomic operation)
 * Returns the token if successfully marked, null if already used or invalid
 */
export async function consumeBookingToken(tokenHash: string): Promise<BookingTokenRow | null> {
  const result = await sql<BookingTokenRow>`
    UPDATE booking_access_tokens
    SET used_at = NOW()
    WHERE token_hash = ${tokenHash}
      AND used_at IS NULL
      AND expires_at > NOW()
    RETURNING id, client_id, booking_type
  `;
  return result.rows[0] || null;
}

/**
 * Create a booking session
 */
export async function createBookingSession({ clientId, bookingType, clientEmail, expiresAt }: CreateBookingSessionParams): Promise<{ id: string }> {
  const result = await sql<{ id: string }>`
    INSERT INTO booking_sessions (client_id, booking_type, client_email, expires_at)
    VALUES (${clientId}, ${bookingType}, ${clientEmail}, ${expiresAt})
    RETURNING id
  `;
  return result.rows[0];
}

/**
 * Validate a booking session by ID
 * Returns session if valid, null if not found or expired
 */
export async function validateBookingSession(sessionId: string): Promise<BookingSessionRow | null> {
  if (!sessionId) return null;

  try {
    const result = await sql<BookingSessionRow>`
      SELECT id, client_id, booking_type, client_email, expires_at
      FROM booking_sessions
      WHERE id = ${sessionId}::uuid
        AND expires_at > NOW()
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Booking session validation error:', error);
    return null;
  }
}

/**
 * Delete a booking session
 */
export async function deleteBookingSession(sessionId: string): Promise<boolean> {
  if (!sessionId) return false;

  try {
    await sql`
      DELETE FROM booking_sessions
      WHERE id = ${sessionId}::uuid
    `;
    return true;
  } catch (error) {
    console.error('Booking session deletion error:', error);
    return false;
  }
}

// ============================================
// QUESTIONNAIRE FUNCTIONS (v13.4)
// ============================================

/**
 * Upsert a questionnaire project (used for seeding / admin setup)
 */
export async function upsertQuestionnaireProject({ id, name, addendumKey }: UpsertQuestionnaireProjectParams): Promise<QuestionnaireProjectRow> {
  const result = await sql<QuestionnaireProjectRow>`
    INSERT INTO questionnaire_projects (id, name, addendum_key)
    VALUES (${id}, ${name}, ${addendumKey})
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      addendum_key = EXCLUDED.addendum_key
    RETURNING id, name, addendum_key
  `;
  return result.rows[0];
}

/**
 * Look up a questionnaire project by ID
 */
export async function getQuestionnaireProject(projectId: string): Promise<QuestionnaireProjectRow | null> {
  const result = await sql<QuestionnaireProjectRow>`
    SELECT id, name, addendum_key FROM questionnaire_projects
    WHERE id = ${projectId}
  `;
  return result.rows[0] || null;
}

/**
 * Create a questionnaire magic-link token
 */
export async function createQuestionnaireToken({ projectId, clientEmail, clientName, tokenHash, expiresAt, createdBy }: CreateQuestionnaireTokenParams): Promise<{ id: string }> {
  const result = await sql<{ id: string }>`
    INSERT INTO questionnaire_tokens (project_id, client_email, client_name, token_hash, expires_at, created_by)
    VALUES (${projectId}, ${clientEmail}, ${clientName}, ${tokenHash}, ${expiresAt}, ${createdBy})
    RETURNING id
  `;
  return result.rows[0];
}

/**
 * Consume a questionnaire token (atomic operation).
 * Returns the token payload if valid, null if expired/used/missing.
 */
export async function consumeQuestionnaireToken(tokenHash: string): Promise<QuestionnaireTokenRow | null> {
  const result = await sql<QuestionnaireTokenRow>`
    UPDATE questionnaire_tokens
    SET used_at = NOW()
    WHERE token_hash = ${tokenHash}
      AND used_at IS NULL
      AND expires_at > NOW()
    RETURNING id, project_id, client_email, client_name
  `;
  return result.rows[0] || null;
}

/**
 * Find an existing in-progress session for (project, email) or create a new one.
 * If an existing session is found, its expiry is refreshed.
 */
export async function findOrCreateQuestionnaireSession({ projectId, clientEmail, clientName, expiresAt }: FindOrCreateQuestionnaireSessionParams): Promise<{ id: string; isNew: boolean }> {
  // Check for existing in-progress session
  const existing = await sql<{ id: string }>`
    SELECT id FROM questionnaire_sessions
    WHERE project_id = ${projectId}
      AND client_email = ${clientEmail}
      AND status = 'in_progress'
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (existing.rows.length > 0) {
    // Refresh expiry on existing session
    await sql`
      UPDATE questionnaire_sessions
      SET expires_at = ${expiresAt}, updated_at = NOW()
      WHERE id = ${existing.rows[0].id}::uuid
    `;
    return { id: existing.rows[0].id, isNew: false };
  }

  // Create new session
  const created = await sql<{ id: string }>`
    INSERT INTO questionnaire_sessions (project_id, client_email, client_name, expires_at)
    VALUES (${projectId}, ${clientEmail}, ${clientName}, ${expiresAt})
    RETURNING id
  `;
  return { id: created.rows[0].id, isNew: true };
}

/**
 * Fetch a questionnaire session by ID (returns full state).
 * Returns null if not found or expired.
 */
export async function getQuestionnaireSessionById(sessionId: string): Promise<QuestionnaireSessionRow | null> {
  if (!sessionId) return null;

  try {
    const result = await sql<QuestionnaireSessionRow>`
      SELECT id, project_id, client_email, client_name, status, current_step,
             responses, field_updated_at, expires_at, completed_at
      FROM questionnaire_sessions
      WHERE id = ${sessionId}::uuid
        AND expires_at > NOW()
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('Questionnaire session validation error:', error);
    return null;
  }
}

/**
 * Save a single field's response (auto-save path).
 * Uses jsonb_set for atomic partial updates.
 * Also refreshes expires_at (sliding window).
 */
export async function saveQuestionnaireField({ sessionId, fieldKey, value, currentStep, expiresAt }: SaveQuestionnaireFieldParams): Promise<{ savedAt: string } | null> {
  if (!sessionId) return null;

  const valueJson = JSON.stringify(value);
  const nowIso = new Date().toISOString();
  const timestampJson = JSON.stringify(nowIso);

  try {
    const result = await sql<{ updated_at: string }>`
      UPDATE questionnaire_sessions
      SET responses = jsonb_set(responses, ${'{' + fieldKey + '}'}, ${valueJson}::jsonb, true),
          field_updated_at = jsonb_set(field_updated_at, ${'{' + fieldKey + '}'}, ${timestampJson}::jsonb, true),
          current_step = COALESCE(${currentStep ?? null}::integer, current_step),
          expires_at = ${expiresAt},
          updated_at = NOW()
      WHERE id = ${sessionId}::uuid
        AND status = 'in_progress'
      RETURNING updated_at
    `;
    if (result.rows.length === 0) return null;
    return { savedAt: nowIso };
  } catch (error) {
    console.error('saveQuestionnaireField error:', error);
    return null;
  }
}

/**
 * Mark a questionnaire session completed.
 * Returns the full final row (for notification / email summary) or null if already completed / not found.
 */
export async function completeQuestionnaireSession(sessionId: string): Promise<QuestionnaireSessionRow | null> {
  if (!sessionId) return null;

  try {
    const result = await sql<QuestionnaireSessionRow>`
      UPDATE questionnaire_sessions
      SET status = 'completed',
          completed_at = NOW(),
          updated_at = NOW()
      WHERE id = ${sessionId}::uuid
        AND status = 'in_progress'
      RETURNING id, project_id, client_email, client_name, status, current_step,
                responses, field_updated_at, expires_at, completed_at
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error('completeQuestionnaireSession error:', error);
    return null;
  }
}

/**
 * Delete a questionnaire session (used by logout).
 * Kept soft — we actually clear the cookie client-side but retain the DB row
 * so the client can resume via a fresh magic link. This helper exists for completeness
 * and future admin cleanup flows.
 */
export async function deleteQuestionnaireSession(sessionId: string): Promise<boolean> {
  if (!sessionId) return false;

  try {
    await sql`
      DELETE FROM questionnaire_sessions
      WHERE id = ${sessionId}::uuid
    `;
    return true;
  } catch (error) {
    console.error('Questionnaire session deletion error:', error);
    return false;
  }
}

/**
 * Clean up expired records (optional maintenance)
 */
export async function cleanupExpiredRecords(): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete expired magic links older than 24 hours
    await sql`
      DELETE FROM pricing_magic_links
      WHERE expires_at < NOW() - INTERVAL '24 hours'
    `;

    // Delete expired sessions older than 24 hours
    await sql`
      DELETE FROM pricing_sessions
      WHERE expires_at < NOW() - INTERVAL '24 hours'
    `;

    // Delete expired booking tokens older than 24 hours
    await sql`
      DELETE FROM booking_access_tokens
      WHERE expires_at < NOW() - INTERVAL '24 hours'
    `;

    // Delete expired booking sessions older than 24 hours
    await sql`
      DELETE FROM booking_sessions
      WHERE expires_at < NOW() - INTERVAL '24 hours'
    `;

    // Delete expired questionnaire tokens older than 24 hours
    await sql`
      DELETE FROM questionnaire_tokens
      WHERE expires_at < NOW() - INTERVAL '24 hours'
    `;

    // Do NOT auto-delete questionnaire_sessions — they hold client response data
    // and may legitimately sit for weeks. Manual cleanup flows handle these.

    return { success: true };
  } catch (error) {
    console.error('Cleanup error:', error);
    return { success: false, error: (error as Error).message };
  }
}
