"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Last-resort UI when the root layout itself crashes.
 * Must define its own <html>/<body>; keep dependencies minimal.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0B0B",
          color: "#F5EFE3",
          fontFamily: "system-ui, sans-serif",
          padding: "1.5rem",
        }}
      >
        <section role="alert" style={{ maxWidth: "28rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ marginTop: "0.75rem", opacity: 0.75, fontSize: "0.875rem", lineHeight: 1.5 }}>
            {error.message || "Please try again."}
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              minHeight: "2.75rem",
              padding: "0 1.25rem",
              border: 0,
              borderRadius: "0.375rem",
              background: "#F5EFE3",
              color: "#0B0B0B",
              fontWeight: 600,
              cursor: "pointer",
            }}
            type="button"
          >
            Try again
          </button>
        </section>
      </body>
    </html>
  );
}
