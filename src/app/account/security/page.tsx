import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { ChangePasswordForm } from "@/features/account/components/change-password-form";
import { GoogleAuthButton } from "@/features/account/components/google-auth-button";
import { SignOutButton } from "@/features/account/components/sign-out-button";
import { env } from "@/config/env";

export const metadata: Metadata = { title: "Security" };

export default function AccountSecurityPage() {
  return (
    <div className="grid gap-6">
      <div>
        <Heading as="h1" level="h2">
          Security
        </Heading>
        <Text className="mt-2" tone="muted">
          Manage how you sign in and keep your account secure.
        </Text>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Choose a strong password you don&apos;t use elsewhere.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected accounts</CardTitle>
          <CardDescription>Sign in faster with a linked provider.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex items-center justify-between rounded-md border border-border p-4">
            <div>
              <p className="text-sm font-medium">Google</p>
              <p className="text-xs text-foreground/58">
                {env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true" ? "Available" : "Not yet enabled"}
              </p>
            </div>
            <GoogleAuthButton
              redirectTo={`${env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/account/security`}
            />
          </div>
          {/* Apple sign-in: future — add a row here in the same shape once enabled. */}
          <div className="flex items-center justify-between rounded-md border border-border p-4 opacity-60">
            <p className="text-sm font-medium">Apple</p>
            <Badge tone="neutral">Coming soon</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
          <CardDescription>Sign out if you no longer recognize a device.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <SignOutButton label="Sign out of this device" />
          <SignOutButton everywhere label="Sign out of all devices" />
        </CardContent>
      </Card>
    </div>
  );
}
