"use client";

import { useEffect } from "react";

import { useI18n } from "@/lib/i18n-context";
import { getDictionary } from "@/i18n/dictionaries";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Route-level error UI — keep imports minimal so Turbopack can register the client manifest. */
export default function Error({ error, reset }: ErrorProps) {
  const { locale } = useI18n();
  const errors = getDictionary(locale).errors;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-12 text-foreground">
      <section className="w-full max-w-md text-center" role="alert">
        <h1 className="text-2xl font-semibold tracking-normal">{errors.title}</h1>
        <p className="mt-3 text-sm leading-6 text-foreground/70">
          {error.message || errors.fallbackBody}
        </p>
        <button
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-semibold text-background"
          onClick={reset}
          type="button"
        >
          {errors.tryAgain}
        </button>
      </section>
    </main>
  );
}
