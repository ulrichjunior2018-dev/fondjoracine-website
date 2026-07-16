import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { env } from "@/config/env";
import { AuthCard } from "@/features/account/components/auth-card";
import { ForgotPasswordLink } from "@/features/account/components/forgot-password-link";
import { GoogleAuthButton } from "@/features/account/components/google-auth-button";
import { LoginForm } from "@/features/account/components/login-form";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Sign In | Maison Fondjo",
};

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo =
    params.redirect && params.redirect.startsWith("/") ? params.redirect : "/account";

  const user = await getCurrentUser();
  if (user) {
    redirect(redirectTo as never);
  }

  return (
    <AuthCard
      description="Sign in to view your orders, hair care profile, and account settings."
      footer={
        <>
          New to Maison Fondjo?{" "}
          <Link className="font-semibold text-accent" href="/signup">
            Create an account
          </Link>
        </>
      }
      title="Welcome back"
    >
      <div className="grid gap-4">
        <LoginForm redirectTo={redirectTo} />
        <ForgotPasswordLink />
        <GoogleAuthButton
          redirectTo={`${env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${redirectTo}`}
        />
      </div>
    </AuthCard>
  );
}
