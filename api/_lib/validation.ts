// Shared validation utilities for API endpoints

/**
 * RFC 5321 compliant email validation regex
 * CANONICAL: Single source of truth — all API endpoints import from here.
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * UUID v4 validation regex
 * CANONICAL: Single source of truth — used by pricing and booking check-access.
 */
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Mask an email address for safe logging (PII protection).
 * "scott@example.com" → "s***@example.com"
 */
export function maskEmail(email: string): string {
  const atIndex = email.indexOf('@');
  if (atIndex <= 0) return '***';
  return email[0] + '***' + email.slice(atIndex);
}
