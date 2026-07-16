import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/features/account/components/auth-card";
import { ForgotPasswordForm } from "@/features/account/components/forgot-password-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Reset Password | Maison Fondjo",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      description="We'll email you a link to reset your password."
      footer={
        <Link className="font-semibold text-accent" href="/login">
          Back to sign in
        </Link>
      }
      title="Reset your password"
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
