import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { env } from "@/config/env";
import { AuthCard } from "@/features/account/components/auth-card";
import { GoogleAuthButton } from "@/features/account/components/google-auth-button";
import { SignupForm } from "@/features/account/components/signup-form";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Create Account | Maison Fondjo",
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/account" as never);
  }

  return (
    <AuthCard
      description="Track orders, save addresses, and build your hair care profile with Maison Fondjo."
      footer={
        <>
          Already have an account?{" "}
          <Link className="font-semibold text-accent" href="/login">
            Sign in
          </Link>
        </>
      }
      title="Create your account"
    >
      <div className="grid gap-4">
        <SignupForm />
        <GoogleAuthButton redirectTo={`${env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/account`} />
      </div>
    </AuthCard>
  );
}
