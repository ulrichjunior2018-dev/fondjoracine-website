import { AppError } from "@/lib/errors/app-error";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

export function assertRateLimit(key: string, options: { limit: number; windowMs: number }) {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return;
  }

  if (existing.count >= options.limit) {
    throw new AppError("RATE_LIMITED", "Too many requests. Please try again soon.");
  }

  existing.count += 1;
}
