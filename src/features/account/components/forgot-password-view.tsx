"use client";

import { AuthCard } from "@/features/account/components/auth-card";
import { ForgotPasswordForm } from "@/features/account/components/forgot-password-form";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";

export function ForgotPasswordView() {
  const { locale } = useI18n();
  const auth = getDictionary(locale).auth;

  return (
    <AuthCard description={auth.forgotDescription} title={auth.forgotTitle}>
      <ForgotPasswordForm />
    </AuthCard>
  );
}
