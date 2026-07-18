import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { ProfileForm } from "@/features/account/components/profile-form";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerLocale } from "@/lib/locale-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateCustomerAccount } from "@/services/customer/customer-service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: getDictionary(locale).account.profile.metaTitle };
}

export default async function AccountProfilePage() {
  const locale = await getServerLocale();
  const p = getDictionary(locale).account.profile;
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const account = await getOrCreateCustomerAccount(supabase, user!.id);

  return (
    <div className="grid gap-6">
      <div>
        <Heading as="h1" level="h2">
          {p.title}
        </Heading>
        <Text className="mt-2" tone="muted">
          {p.subtitle}
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
