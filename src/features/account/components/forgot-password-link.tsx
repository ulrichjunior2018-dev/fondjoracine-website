"use client";

import Link from "next/link";

import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";

export function ForgotPasswordLink() {
  const { locale } = useI18n();
  const auth = getDictionary(locale).auth;

  return (
    <Link className="text-center text-sm font-semibold text-accent" href="/forgot-password">
      {auth.forgotLink}
    </Link>
  );
}
