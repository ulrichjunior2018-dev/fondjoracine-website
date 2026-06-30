"use client";

import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <section className="w-full max-w-md text-center" role="alert">
        <h1 className="text-2xl font-semibold tracking-normal text-foreground">{title}</h1>
        {message ? <p className="mt-3 text-sm leading-6 text-foreground/70">{message}</p> : null}
        {onRetry ? (
          <Button className="mt-6" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </section>
    </main>
  );
}
