import type { Metadata } from "next";

import { Heading, Text } from "@/components/ui/typography";
import { AddressList } from "@/features/account/components/address-list";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateCustomerAccount, listAddresses } from "@/services/customer/customer-service";

export const metadata: Metadata = { title: "Addresses" };

export default async function AccountAddressesPage() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const account = await getOrCreateCustomerAccount(supabase, user!.id);
  const addresses = await listAddresses(supabase, account.id);

  return (
    <div className="grid gap-6">
      <div>
        <Heading as="h1" level="h2">
          Addresses
        </Heading>
        <Text className="mt-2" tone="muted">
          Save addresses so you don&apos;t have to re-type them at checkout.
        </Text>
      </div>

      <AddressList initialAddresses={addresses} />
    </div>
  );
}
