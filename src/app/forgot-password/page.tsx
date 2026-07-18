import type { Metadata } from "next";

import { ForgotPasswordView } from "@/features/account/components/forgot-password-view";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    robots: { follow: false, index: false },
    title: getDictionary(locale).auth.metaForgot,
  };
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
