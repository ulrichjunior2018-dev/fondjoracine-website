"use client";

import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";

type AdminLockedStateProps = {
  message?: string;
};

export function AdminLockedState({ message }: AdminLockedStateProps) {
  const { locale } = useI18n();
  const admin = getDictionary(locale).admin;

  return (
    <main className="min-h-screen bg-background py-12">
      <Container size="sm">
        <Card variant="elevated">
          <Kicker>{admin.lockedKicker}</Kicker>
          <Heading as="h1" className="mt-3" level="h2">
            {admin.lockedTitle}
          </Heading>
          <Text className="mt-4" tone="muted">
            {message ?? admin.lockedBody}
          </Text>
          <Link
            className="mt-6 inline-flex h-11 items-center rounded-md bg-foreground px-5 text-sm font-semibold text-background"
            href="/"
          >
            {admin.returnStorefront}
          </Link>
        </Card>
      </Container>
    </main>
  );
}
