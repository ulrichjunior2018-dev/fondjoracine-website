"use client";

import { useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 3000;
const TIMEOUT_MS = 120_000; // MTN's own requesttopay timeout window is ~2 minutes.

type Status = "PENDING" | "SUCCESSFUL" | "FAILED" | "TIMED_OUT";

type Copy = {
  checking: string;
  failed: string;
  heading: string;
  pending: string;
  retry: string;
  subheading: string;
  timedOut: string;
};

export function MomoPendingClient({
  reference,
  token,
  copy,
}: {
  reference: string;
  token: string;
  copy: Copy;
}) {
  const [status, setStatus] = useState<Status>("PENDING");
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    startedAtRef.current = Date.now();
    let cancelled = false;

    async function poll() {
      if (cancelled) return;

      const startedAt = startedAtRef.current ?? Date.now();
      if (Date.now() - startedAt > TIMEOUT_MS) {
        setStatus("TIMED_OUT");
        return;
      }

      try {
        const response = await fetch(
          `/api/payments/mtn-momo/status?ref=${encodeURIComponent(reference)}`,
        );
        const body = (await response.json()) as { data?: { status?: Status } };
        const nextStatus = body.data?.status;

        if (nextStatus === "SUCCESSFUL") {
          window.location.href = `/order-confirmation?token=${token}`;
          return;
        }

        if (nextStatus === "FAILED") {
          setStatus("FAILED");
          return;
        }
      } catch {
        // Transient network error — keep polling, the timeout above is the backstop.
      }

      if (!cancelled) {
        setTimeout(() => void poll(), POLL_INTERVAL_MS);
      }
    }

    void poll();

    return () => {
      cancelled = true;
    };
  }, [reference, token]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-black px-6 text-center text-white">
      <div className="max-w-sm">
        {status === "PENDING" && (
          <>
            <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            <h1 className="font-serif text-2xl text-amber-400">{copy.heading}</h1>
            <p className="mt-3 text-sm text-neutral-300">{copy.subheading}</p>
            <p className="mt-4 text-sm text-neutral-400">{copy.pending}</p>
            <p className="mt-6 text-xs uppercase tracking-wide text-neutral-500">{copy.checking}</p>
          </>
        )}

        {status === "FAILED" && (
          <>
            <h1 className="font-serif text-2xl text-amber-400">{copy.heading}</h1>
            <p className="mt-4 text-sm text-neutral-300">{copy.failed}</p>
            <a
              className="mt-6 inline-block rounded-md border border-neutral-700 px-6 py-3 text-sm font-semibold text-white hover:border-amber-400"
              href="/checkout"
            >
              {copy.retry}
            </a>
          </>
        )}

        {status === "TIMED_OUT" && (
          <>
            <h1 className="font-serif text-2xl text-amber-400">{copy.heading}</h1>
            <p className="mt-4 text-sm text-neutral-300">{copy.timedOut}</p>
            <a
              className="mt-6 inline-block rounded-md border border-neutral-700 px-6 py-3 text-sm font-semibold text-white hover:border-amber-400"
              href="/checkout"
            >
              {copy.retry}
            </a>
          </>
        )}
      </div>
    </div>
  );
}
