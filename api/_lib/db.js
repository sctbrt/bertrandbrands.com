// Database utilities for Vercel Postgres
// Uses @vercel/postgres for serverless-friendly connection pooling

import { sql } from '@vercel/postgres';

/**
 * Initialize database tables if they don't exist
 * Called on first request or can be run manually
 */
export async function initializeDatabase() {
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

    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create a magic link record
 */
export async function createMagicLink({ email, tokenHash, expiresAt }) {
  const result = await sql`
    INSERT INTO pricing_magic_links (email, token_hash, expires_at)
    VALUES (${email}, ${tokenHash}, ${expiresAt})
    RETURNING id
  `;
  return result.rows[0];
}

/**
 * Find and validate a magic link by token hash
 * Returns null if not found, expired, or already used
 */
export async function findValidMagicLink(tokenHash) {
  const result = await sql`
    SELECT id, email, expires_at, used_at
    FROM pricing_magic_links
    WHERE token_hash = ${tokenHash}
      AND used_at IS NULL
      AND expires_at > NOW()
  `;
  return result.rows[0] || null;
}

/**
 * Mark a magic link as used (atomic operation)
 * Returns the link if successfully marked, null if already used or invalid
 */
export async function consumeMagicLink(tokenHash) {
  const result = await sql`
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
export async function createPricingSession({ email, expiresAt }) {
  const result = await sql`
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
export async function validatePricingSession(sessionId) {
  if (!sessionId) return null;

  try {
    const result = await sql`
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
export async function deletePricingSession(sessionId) {
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
 * Returns count of requests in the last hour for given email or IP
 */
export async function countRecentRequests({ email, ip }) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  // Count by email
  const emailResult = await sql`
    SELECT COUNT(*) as count
    FROM pricing_magic_links
    WHERE email = ${email}
      AND created_at > ${oneHourAgo}::timestamptz
  `;

  return {
    emailCount: parseInt(emailResult.rows[0]?.count || 0, 10)
  };
}

// ============================================
// BOOKING ACCESS FUNCTIONS
// ============================================

/**
 * Create a booking access token
 */
export async function createBookingToken({ clientId, bookingType, tokenHash, expiresAt, createdBy }) {
  const result = await sql`
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
export async function consumeBookingToken(tokenHash) {
  const result = await sql`
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
export async function createBookingSession({ clientId, bookingType, clientEmail, expiresAt }) {
  const result = await sql`
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
export async function validateBookingSession(sessionId) {
  if (!sessionId) return null;

  try {
    const result = await sql`
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
export async function deleteBookingSession(sessionId) {
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

/**
 * Clean up expired records (optional maintenance)
 */
export async function cleanupExpiredRecords() {
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

    return { success: true };
  } catch (error) {
    console.error('Cleanup error:', error);
    return { success: false, error: error.message };
  }
}
