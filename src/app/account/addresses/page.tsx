import type { Metadata } from "next";

import { Heading, Text } from "@/components/ui/typography";
import { AddressList } from "@/features/account/components/address-list";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerLocale } from "@/lib/locale-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateCustomerAccount, listAddresses } from "@/services/customer/customer-service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: getDictionary(locale).account.addresses.metaTitle };
}

export default async function AccountAddressesPage() {
  const locale = await getServerLocale();
  const a = getDictionary(locale).account.addresses;
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const account = await getOrCreateCustomerAccount(supabase, user!.id);
  const addresses = await listAddresses(supabase, account.id);

  return (
    <div className="grid gap-6">
      <div>
        <Heading as="h1" level="h2">
          {a.title}
        </Heading>
        <Text className="mt-2" tone="muted">
          {a.subtitle}
        </Text>
      </div>

      <AddressList initialAddresses={addresses} />
    </div>
  );
}
