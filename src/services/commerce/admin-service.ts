import type { SupabaseClient } from "@supabase/supabase-js";

import { AppError } from "@/lib/errors/app-error";

export async function getAdminAnalyticsSummary(supabase: SupabaseClient) {
  const [
    { count: ordersCount, error: ordersError },
    { count: customersCount, error: customersError },
  ] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("customers").select("id", { count: "exact", head: true }),
  ]);

  if (ordersError || customersError) {
    throw new AppError("INTERNAL", "Unable to load analytics summary.", { expose: false });
  }

  return {
    customers_count: customersCount ?? 0,
    orders_count: ordersCount ?? 0,
  };
}
