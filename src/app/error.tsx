"use client";

import { ErrorState } from "@/components/feedback/error-state";
import { publicCopy } from "@/content/copy";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title={publicCopy.errors.genericTitle}
      message={error.message || publicCopy.errors.genericMessage}
      onRetry={reset}
    />
  );
}
