"use client";

import Link from "next/link";

import { AuthCard } from "@/features/account/components/auth-card";
import { ForgotPasswordLink } from "@/features/account/components/forgot-password-link";
import { LoginForm } from "@/features/account/components/login-form";
import { SocialAuthButtons } from "@/features/account/components/social-auth-buttons";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";

type LoginViewProps = {
  error?: string;
  redirectTo: string;
};

export function LoginView({ error, redirectTo }: LoginViewProps) {
  const { locale } = useI18n();
  const auth = getDictionary(locale).auth;

  return (
    <AuthCard
      description={auth.loginDescription}
      footer={
        <>
          {auth.loginNewUser}{" "}
          <Link className="font-semibold text-accent" href="/signup">
            {auth.createAccount}
          </Link>
        </>
      }
      title={auth.loginTitle}
    >
      <div className="grid gap-4">
        {error ? (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}
        <LoginForm redirectTo={redirectTo} />
        <ForgotPasswordLink />
        <SocialAuthButtons next={redirectTo} />
      </div>
    </AuthCard>
  );
}
