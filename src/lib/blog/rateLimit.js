// src/lib/blog/rateLimit.js
import "server-only";

/**
 * Small in-memory sliding-window limiter. It is per server instance, so on serverless
 * hosts it is a best-effort brake against bursts, not a hard guarantee.
 */
const buckets = new Map();
const MAX_BUCKETS = 5000;

export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((time) => now - time < windowMs);

  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfter: Math.max(1, Math.ceil((windowMs - (now - hits[0])) / 1000)) };
  }

  hits.push(now);
  buckets.set(key, hits);

  if (buckets.size > MAX_BUCKETS) {
    for (const [bucketKey, times] of buckets) {
      if (!times.some((time) => now - time < windowMs)) buckets.delete(bucketKey);
    }
  }
  return { ok: true, retryAfter: 0 };
}