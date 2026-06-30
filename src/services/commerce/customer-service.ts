import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { Customer } from "@/domain/commerce/types";
import { AppError } from "@/lib/errors/app-error";

function createReferralCode(userId: string) {
  return `LR-${userId.replaceAll("-", "").slice(0, 10).toUpperCase()}`;
}

export async function getCustomerForUser(supabase: SupabaseClient, user: User) {
  const { data, error } = await supabase
    .from("customers")
    .select("id, profile_id, stripe_customer_id, referral_code")
    .eq("profile_id", user.id)
    .maybeSingle<Customer>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to load customer profile.", { expose: false });
  }

  return data;
}

export async function ensureCustomerForUser(supabase: SupabaseClient, user: User) {
  const existing = await getCustomerForUser(supabase, user);

  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from("customers")
    .insert({
      profile_id: user.id,
      referral_code: createReferralCode(user.id),
    })
    .select("id, profile_id, stripe_customer_id, referral_code")
    .single<Customer>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to create customer profile.", { expose: false });
  }

  return data;
}
