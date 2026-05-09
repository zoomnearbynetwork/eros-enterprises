import "server-only";

type RateLimitOptions = {
  key: string;
  namespace: string;
};

type RateLimitResult = {
  allowed: boolean;
  reason?: string;
};

const memoryStore = new Map<string, { count: number; resetAt: number }>();

function getConfig() {
  return {
    enabled: process.env.RATE_LIMIT_ENABLED === "true",
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 10),
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
  };
}

export async function checkRateLimit({
  key,
  namespace,
}: RateLimitOptions): Promise<RateLimitResult> {
  const config = getConfig();

  if (!config.enabled) {
    return { allowed: true };
  }

  const now = Date.now();
  const bucketKey = `${namespace}:${key}`;
  const existing = memoryStore.get(bucketKey);

  if (!existing || existing.resetAt <= now) {
    memoryStore.set(bucketKey, {
      count: 1,
      resetAt: now + config.windowMs,
    });

    return { allowed: true };
  }

  if (existing.count >= config.maxRequests) {
    return {
      allowed: false,
      reason: "Too many requests. Please wait a moment before trying again.",
    };
  }

  existing.count += 1;
  memoryStore.set(bucketKey, existing);

  return { allowed: true };
}
