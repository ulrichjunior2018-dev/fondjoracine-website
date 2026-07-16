import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AccountShell } from "@/features/account/components/account-shell";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateCustomerAccount } from "@/services/customer/customer-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: { default: "My Account", template: "%s | My Account | Maison Fondjo" },
};

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/account" as never);
  }

  const supabase = await createSupabaseServerClient();
  const account = await getOrCreateCustomerAccount(supabase, user.id);
  const customerName =
    [account.firstName, account.lastName].filter(Boolean).join(" ") || account.email;

  return <AccountShell customerName={customerName}>{children}</AccountShell>;
}
