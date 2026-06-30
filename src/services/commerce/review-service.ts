import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { CreateReviewInput } from "@/domain/commerce/schemas";
import { AppError } from "@/lib/errors/app-error";
import { ensureCustomerForUser } from "@/services/commerce/customer-service";

export async function createReview(supabase: SupabaseClient, user: User, input: CreateReviewInput) {
  const customer = await ensureCustomerForUser(supabase, user);
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      ...input,
      customer_id: customer.id,
      status: "pending",
    })
    .select("id, status")
    .single();

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  return data;
}
