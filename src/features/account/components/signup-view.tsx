"use client";

import Link from "next/link";

import { AuthCard } from "@/features/account/components/auth-card";
import { SignupForm } from "@/features/account/components/signup-form";
import { SocialAuthButtons } from "@/features/account/components/social-auth-buttons";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";

export function SignupView() {
  const { locale } = useI18n();
  const auth = getDictionary(locale).auth;

  return (
    <AuthCard
      description={auth.signupDescription}
      footer={
        <>
          {auth.signupHasAccount}{" "}
          <Link className="font-semibold text-accent" href="/login">
            {auth.loginSubmit}
          </Link>
        </>
      }
      title={auth.signupTitle}
    >
      <div className="grid gap-4">
        <SignupForm />
        <SocialAuthButtons next="/account" />
      </div>
    </AuthCard>
  );
}
