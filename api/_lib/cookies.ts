// Shared cookie utilities for API endpoints

import type { BuildCookieOptions } from './types.js';

const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

/**
 * Parse cookies from a Cookie header string
 */
export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};

  return cookieHeader.split(';').reduce<Record<string, string>>((cookies, cookie) => {
    const idx = cookie.indexOf('=');
    if (idx === -1) return cookies;
    const name = cookie.slice(0, idx).trim();
    const value = cookie.slice(idx + 1).trim();
    if (name) {
      cookies[name] = value;
    }
    return cookies;
  }, {});
}

/**
 * Build a cookie string that clears/expires a session cookie
 */
export function buildClearCookie(cookieName: string, hostname: string | undefined): string {
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
    const hn = hostname || '';
    if (hn.endsWith('bertrandbrands.ca')) {
      parts.push('Domain=.bertrandbrands.ca');
    }
  }

  return parts.join('; ');
}

/**
 * Build a secure cookie string
 */
export function buildCookie(
  name: string,
  value: string,
  maxAgeSeconds: number,
  options: BuildCookieOptions = {}
): string {
  const parts = [
    `${name}=${value}`,
    `Path=/`,
    `Max-Age=${maxAgeSeconds}`,
    `HttpOnly`,
    `SameSite=Lax`
  ];

  if (IS_PRODUCTION) {
    parts.push('Secure');
    // Set cookie domain for cross-subdomain sharing
    const hostname = options.hostname || '';
    if (hostname.endsWith('bertrandbrands.ca')) {
      parts.push('Domain=.bertrandbrands.ca');
    }
  }

  return parts.join('; ');
}
