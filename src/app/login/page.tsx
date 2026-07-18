import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginView } from "@/features/account/components/login-view";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    robots: { follow: false, index: false },
    title: getDictionary(locale).auth.metaSignIn,
  };
}

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo =
    params.redirect && params.redirect.startsWith("/") ? params.redirect : "/account";

  const user = await getCurrentUser();
  if (user) {
    redirect(redirectTo as never);
  }

  return <LoginView redirectTo={redirectTo} {...(params.error ? { error: params.error } : {})} />;
}
