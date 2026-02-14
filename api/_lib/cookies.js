// Shared cookie utilities for API endpoints

const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

/**
 * Build a secure cookie string
 * @param {string} name - Cookie name (e.g. 'bb_pricing_session')
 * @param {string} value - Cookie value (e.g. session ID)
 * @param {number} maxAgeSeconds - Cookie lifetime in seconds
 * @param {object} [options] - Optional settings
 * @param {string} [options.hostname] - Request hostname for domain detection
 */
export function buildCookie(name, value, maxAgeSeconds, options = {}) {
  const parts = [
    `${name}=${value}`,
    `Path=/`,
    `Max-Age=${maxAgeSeconds}`,
    `HttpOnly`,
    `SameSite=Lax`
  ];

  if (IS_PRODUCTION) {
    parts.push('Secure');
    // Set cookie domain based on which domain served the request
    const hostname = options.hostname || '';
    if (hostname.endsWith('bertrandgroup.ca')) {
      parts.push('Domain=.bertrandgroup.ca');
    } else if (hostname.endsWith('bertrandbrands.ca')) {
      parts.push('Domain=.bertrandbrands.ca');
    } else {
      // Fallback: let browser set domain to exact origin
    }
  }

  return parts.join('; ');
}
