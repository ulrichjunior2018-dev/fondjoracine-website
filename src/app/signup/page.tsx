import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SignupView } from "@/features/account/components/signup-view";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    robots: { follow: false, index: false },
    title: getDictionary(locale).auth.metaSignUp,
  };
}

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/account" as never);
  }

  return <SignupView />;
}
