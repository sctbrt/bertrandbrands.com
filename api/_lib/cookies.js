// Shared cookie utilities for API endpoints

const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

/**
 * Parse cookies from a Cookie header string
 * @param {string} cookieHeader - Raw Cookie header value
 * @returns {Object} Key-value map of cookie names to values
 */
export function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};

  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
    return cookies;
  }, {});
}

/**
 * Build a cookie string that clears/expires a session cookie
 * @param {string} cookieName - Cookie name to clear (e.g. 'bb_pricing_session')
 * @param {string} hostname - Request hostname for domain detection
 */
export function buildClearCookie(cookieName, hostname) {
  const parts = [
    `${cookieName}=`,
    `Path=/`,
    `Max-Age=0`,
    `HttpOnly`,
    `SameSite=Lax`
  ];

  if (IS_PRODUCTION) {
    parts.push('Secure');
    // Clear on parent domain to match how it was set
    if (hostname && hostname.endsWith('bertrandbrands.ca')) {
      parts.push('Domain=.bertrandbrands.ca');
    } else {
      parts.push('Domain=.bertrandgroup.ca');
    }
  }

  return parts.join('; ');
}

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
