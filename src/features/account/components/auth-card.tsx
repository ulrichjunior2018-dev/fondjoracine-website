"use client";

import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";

import { Icons } from "@/components/icons/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";

type AuthCardProps = {
  children: ReactNode;
  description?: string;
  footer?: ReactNode;
  title: string;
};

/** Shared centered shell for /login, /signup, /forgot-password, /reset-password. */
export function AuthCard({ children, description, footer, title }: AuthCardProps) {
  const { locale } = useI18n();
  const auth = getDictionary(locale).auth;

  return (
    <main className="min-h-svh overflow-x-hidden bg-background">
      <Container
        className="flex min-h-svh w-full min-w-0 flex-col justify-center py-10 sm:py-16"
        size="sm"
      >
        <div className="mb-6 flex min-w-0 flex-col gap-5">
          <Link
            className="inline-flex w-fit max-w-full items-center gap-2 text-sm font-medium text-foreground/70 transition-colors hover:text-accent"
            href={"/" as Route}
          >
            <Icons.arrowLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className="min-w-0 break-words">{auth.backToWebsite}</span>
          </Link>

          <div className="min-w-0 text-center">
            <Link
              className="inline-block max-w-full break-words font-serif text-2xl text-accent"
              href={"/" as Route}
            >
              Maison Fondjo
            </Link>
          </div>
        </div>

        <Card className="min-w-0 w-full max-w-full overflow-hidden" variant="elevated">
          <CardHeader className="min-w-0">
            <CardTitle className="min-w-0 break-words">{title}</CardTitle>
            {description ? (
              <CardDescription className="min-w-0 break-words">{description}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="min-w-0 overflow-x-hidden">{children}</CardContent>
        </Card>

        {footer ? (
          <div className="mt-6 min-w-0 break-words text-center text-sm text-foreground/68">
            {footer}
          </div>
        ) : null}
      </Container>
    </main>
  );
}
