import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { ProfileForm } from "@/features/account/components/profile-form";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateCustomerAccount } from "@/services/customer/customer-service";

export const metadata: Metadata = { title: "My Profile" };

export default async function AccountProfilePage() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const account = await getOrCreateCustomerAccount(supabase, user!.id);

  return (
    <div className="grid gap-6">
      <div>
        <Heading as="h1" level="h2">
          My Profile
        </Heading>
        <Text className="mt-2" tone="muted">
          Your basic information.
        </Text>
      </div>

      <Card>
        <CardContent>
          <ProfileForm
            defaultValues={{
              firstName: account.firstName ?? "",
              lastName: account.lastName ?? "",
              phone: account.phone ?? "",
            }}
            email={account.email}
          />
        </CardContent>
      </Card>
    </div>
  );
}
