import { NextResponse } from "next/server";
import { getRequestContext } from "@/lib/ai/anti-abuse";

type RateLimitOptions = {
  action: string;
  limit: number;
  windowMs: number;
  userId?: string | null;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const buckets = new Map<string, number[]>();
const MAX_BUCKETS = 1_000;
const CLEANUP_AFTER_MS = 24 * 60 * 60 * 1000;

function getBucketKey(action: string, ipHash: string | null, userId?: string | null) {
  const subject = userId ? `user:${userId}` : `ip:${ipHash || "unknown"}`;
  return `${action}:${subject}:${ipHash || "no-ip"}`;
}

export async function checkRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { ipHash } = await getRequestContext();
  const now = Date.now();
  const windowStart = now - options.windowMs;
  const key = getBucketKey(options.action, ipHash, options.userId);
  const timestamps = (buckets.get(key) || []).filter((timestamp) => timestamp >= windowStart);

  if (buckets.size > MAX_BUCKETS) {
    for (const [bucketKey, bucketTimestamps] of buckets) {
      const newestTimestamp = bucketTimestamps[bucketTimestamps.length - 1] || 0;
      if (newestTimestamp < now - CLEANUP_AFTER_MS) {
        buckets.delete(bucketKey);
      }
    }
  }

  if (timestamps.length >= options.limit) {
    const oldest = timestamps[0] || now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + options.windowMs - now) / 1000));
    buckets.set(key, timestamps);

    return {
      allowed: false,
      retryAfterSeconds,
    };
  }

  timestamps.push(now);
  buckets.set(key, timestamps);

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}

export function rateLimitResponse(message = "Too many requests. Please wait a few minutes and try again.") {
  return function createResponse(result: RateLimitResult) {
    const response = NextResponse.json(
      {
        error: message,
        code: "RATE_LIMITED",
      },
      { status: 429 }
    );

    response.headers.set("Retry-After", String(result.retryAfterSeconds));
    return response;
  };
}
