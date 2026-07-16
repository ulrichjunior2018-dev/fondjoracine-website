import type { Metadata } from "next";

import { AuthCard } from "@/features/account/components/auth-card";
import { ResetPasswordForm } from "@/features/account/components/reset-password-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Set New Password | Maison Fondjo",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard description="Choose a new password for your account." title="Set a new password">
      <ResetPasswordForm />
    </AuthCard>
  );
}
