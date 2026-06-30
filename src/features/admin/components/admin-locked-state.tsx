import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";

type AdminLockedStateProps = {
  message?: string;
};

export function AdminLockedState({ message }: AdminLockedStateProps) {
  return (
    <main className="min-h-screen bg-background py-12">
      <Container size="sm">
        <Card variant="elevated">
          <Kicker>Admin access</Kicker>
          <Heading as="h1" className="mt-3" level="h2">
            Protected FONDJO admin
          </Heading>
          <Text className="mt-4" tone="muted">
            {message ??
              "Sign in with an authorized admin account to manage orders, content, inventory, and payments."}
          </Text>
          <Link
            className="mt-6 inline-flex h-11 items-center rounded-md bg-foreground px-5 text-sm font-semibold text-background"
            href="/"
          >
            Return to storefront
          </Link>
        </Card>
      </Container>
    </main>
  );
}
