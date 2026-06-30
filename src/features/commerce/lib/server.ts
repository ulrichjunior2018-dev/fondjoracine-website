import type { User } from "@supabase/supabase-js";

import { env } from "@/config/env";
import type { Category, Collection, ProductSummary } from "@/domain/commerce/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listCategories, listCollections, listProducts } from "@/services/commerce/catalog-service";

export function isStorefrontConfigured() {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getStorefrontSupabase() {
  if (!isStorefrontConfigured()) {
    return null;
  }

  return createSupabaseServerClient();
}

export async function getCatalogShell() {
  const supabase = await getStorefrontSupabase();

  if (!supabase) {
    return {
      categories: [] as Category[],
      collections: [] as Collection[],
    };
  }

  const [categories, collections] = await Promise.all([
    listCategories(supabase),
    listCollections(supabase),
  ]);

  return { categories, collections };
}

export async function getProductListing(options: {
  category?: string | undefined;
  collection?: string | undefined;
  limit?: number;
  offset?: number;
  q?: string | undefined;
}) {
  const supabase = await getStorefrontSupabase();

  if (!supabase) {
    return [] as ProductSummary[];
  }

  return listProducts(supabase, {
    category: options.category,
    collection: options.collection,
    limit: options.limit ?? 24,
    offset: options.offset ?? 0,
    q: options.q,
  });
}

export async function getOptionalUser(): Promise<{
  supabase: Awaited<ReturnType<typeof getStorefrontSupabase>>;
  user: User | null;
}> {
  const supabase = await getStorefrontSupabase();

  if (!supabase) {
    return { supabase, user: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}
