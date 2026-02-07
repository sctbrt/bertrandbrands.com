// Shared cryptographic utilities for API endpoints

import crypto from 'crypto';

/**
 * Hash a raw token using SHA-256
 */
export function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}
