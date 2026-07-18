import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { ChangePasswordForm } from "@/features/account/components/change-password-form";
import { SignOutButton } from "@/features/account/components/sign-out-button";
import { SocialAuthButtons } from "@/features/account/components/social-auth-buttons";
import { getDictionary } from "@/i18n/dictionaries";
import {
  isIdentityProviderConfigured,
  listSecurityIdentityProviders,
} from "@/lib/identity/registry";
import { listLinkedIdentityProviderIds } from "@/lib/identity/user-identities";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: getDictionary(locale).account.security.metaTitle };
}

export default async function AccountSecurityPage() {
  const locale = await getServerLocale();
  const s = getDictionary(locale).account.security;
  const nav = getDictionary(locale).account.nav;
  const user = await getCurrentUser();
  const linked = new Set(listLinkedIdentityProviderIds(user));
  const passwordEnabled = isIdentityProviderConfigured("password");
  const securityProviders = listSecurityIdentityProviders().filter(
    (provider) => provider.id !== "password",
  );

  return (
    <div className="grid gap-6">
      <div>
        <Heading as="h1" level="h2">
          {s.title}
        </Heading>
        <Text className="mt-2" tone="muted">
          {s.subtitle}
        </Text>
      </div>

      {passwordEnabled ? (
        <Card>
          <CardHeader>
            <CardTitle>{s.passwordSection}</CardTitle>
            <CardDescription>
              {linked.has("password") ? s.passwordUpdate : s.passwordSet}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{s.methodsTitle}</CardTitle>
          <CardDescription>{s.methodsBody}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {securityProviders.map((provider) => {
            const enabled = provider.isConfigured();
            const isLinked = linked.has(provider.id);

            return (
              <div
                className="flex items-center justify-between gap-4 rounded-md border border-border p-4"
                key={provider.id}
              >
                <div>
                  <p className="text-sm font-medium">{provider.displayName}</p>
                  <p className="text-xs text-foreground/58">{provider.description}</p>
                  {isLinked ? (
                    <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent">
                      {s.connected}
                    </p>
                  ) : null}
                </div>
                {enabled ? (
                  <div className="min-w-[10rem]">
                    {isLinked ? (
                      <Badge tone="sage">{s.active}</Badge>
                    ) : (
                      <SocialAuthButtons
                        next="/account/security"
                        providerId={provider.id}
                        showDivider={false}
                      />
                    )}
                  </div>
                ) : (
                  <Badge tone="neutral">{nav.comingSoon}</Badge>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{s.sessionsTitle}</CardTitle>
          <CardDescription>{s.sessionsBody}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <SignOutButton label={s.signOutDevice} />
          <SignOutButton everywhere label={s.signOutAll} />
        </CardContent>
      </Card>

      <p className="text-center text-sm text-foreground/55">
        {s.preferLogin}{" "}
        <Link className="font-semibold text-accent" href="/login">
          {s.signInPage}
        </Link>
      </p>
    </div>
  );
}
