import type { Metadata } from "next";

import { ResetPasswordView } from "@/features/account/components/reset-password-view";
import { getDictionary } from "@/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    robots: { follow: false, index: false },
    title: getDictionary(locale).auth.metaReset,
  };
}

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}
