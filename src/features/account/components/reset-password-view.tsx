"use client";

import { AuthCard } from "@/features/account/components/auth-card";
import { ResetPasswordForm } from "@/features/account/components/reset-password-form";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";

export function ResetPasswordView() {
  const { locale } = useI18n();
  const auth = getDictionary(locale).auth;

  return (
    <AuthCard description={auth.resetDescription} title={auth.resetTitle}>
      <ResetPasswordForm />
    </AuthCard>
  );
}
