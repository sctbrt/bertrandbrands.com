// Shared cryptographic utilities for API endpoints

import crypto from 'crypto';

/**
 * Hash a raw token using SHA-256
 */
export function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Generate a secure random token and its SHA-256 hash
 */
export function generateToken(): { rawToken: string; tokenHash: string } {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, tokenHash };
}
