// Shared in-memory rate limiter for API endpoints
// LIMITATION: Resets when function cold-starts. For persistent cross-instance
// rate limiting, migrate to Vercel KV or Upstash Redis.

import type { RateLimitEntry } from './types.js';

/**
 * Create a rate limiter with configurable window and max requests.
 * Returns an `isRateLimited(key)` function and starts periodic cleanup.
 */
export function createRateLimiter(
  windowMs: number = 60_000,
  maxRequests: number = 10
) {
  const map = new Map<string, RateLimitEntry>();

  // Periodic cleanup to prevent memory leak (every 5 minutes)
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of map) {
      if (now - entry.windowStart > windowMs * 5) {
        map.delete(key);
      }
    }
  }, 5 * 60 * 1000);

  return function isRateLimited(key: string): boolean {
    const now = Date.now();
    const entry = map.get(key);

    if (!entry || now - entry.windowStart > windowMs) {
      map.set(key, { windowStart: now, count: 1 });
      return false;
    }

    entry.count++;
    return entry.count > maxRequests;
  };
}

/**
 * Extract client IP from Vercel request headers.
 */
export function getClientIp(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  const realIp = headers['x-real-ip'];
  if (typeof realIp === 'string') {
    return realIp;
  }
  return 'unknown';
}
