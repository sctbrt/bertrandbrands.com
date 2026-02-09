// Shared cookie utilities for API endpoints

const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

/**
 * Build a secure cookie string
 * @param {string} name - Cookie name (e.g. 'bb_pricing_session')
 * @param {string} value - Cookie value (e.g. session ID)
 * @param {number} maxAgeSeconds - Cookie lifetime in seconds
 */
export function buildCookie(name, value, maxAgeSeconds) {
  const parts = [
    `${name}=${value}`,
    `Path=/`,
    `Max-Age=${maxAgeSeconds}`,
    `HttpOnly`,
    `SameSite=Lax`
  ];

  if (IS_PRODUCTION) {
    parts.push('Secure');
    parts.push('Domain=.bertrandgroup.ca');
  }

  return parts.join('; ');
}
