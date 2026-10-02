/**
 * Report failures to Sentry when the SDK is configured (client or server).
 * No-op when DSN is empty so local/dev stays quiet.
 */

export async function reportException(
  error: unknown,
  context?: Record<string, unknown>,
): Promise<void> {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
  if (!dsn) {
    return;
  }

  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(error, context ? { extra: context } : undefined);
  } catch {
    // Sentry optional
  }
}

export async function reportMessage(
  message: string,
  context?: Record<string, unknown>,
): Promise<void> {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
  if (!dsn) {
    return;
  }

  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureMessage(message, {
      level: "error",
      ...(context ? { extra: context } : {}),
    });
  } catch {
    // Sentry optional
  }
}
