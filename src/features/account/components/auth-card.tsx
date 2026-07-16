import Link from "next/link";
import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

type AuthCardProps = {
  children: ReactNode;
  description?: string;
  footer?: ReactNode;
  title: string;
};

/** Shared centered shell for /login, /signup, /forgot-password, /reset-password. */
export function AuthCard({ children, description, footer, title }: AuthCardProps) {
  return (
    <main className="flex min-h-svh items-center bg-background py-16">
      <Container size="sm">
        <div className="mb-8 text-center">
          <Link className="font-serif text-2xl text-accent" href="/">
            Maison Fondjo
          </Link>
        </div>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
        {footer ? (
          <div className="mt-6 text-center text-sm text-foreground/68">{footer}</div>
        ) : null}
      </Container>
    </main>
  );
}
