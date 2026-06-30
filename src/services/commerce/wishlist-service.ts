import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { WishlistItemInput } from "@/domain/commerce/schemas";
import type { ProductSummary } from "@/domain/commerce/types";
import { AppError } from "@/lib/errors/app-error";
import { ensureCustomerForUser } from "@/services/commerce/customer-service";

type WishlistItemRow = {
  created_at: string;
  id: string;
  product_id: string;
  products: ProductSummary | ProductSummary[] | null;
};

async function getOrCreateWishlist(supabase: SupabaseClient, user: User) {
  const customer = await ensureCustomerForUser(supabase, user);
  const { data: existing, error: existingError } = await supabase
    .from("wishlists")
    .select("id, name")
    .eq("customer_id", customer.id)
    .eq("is_default", true)
    .maybeSingle<{ id: string; name: string }>();

  if (existingError) {
    throw new AppError("INTERNAL", "Unable to load wishlist.", { expose: false });
  }

  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from("wishlists")
    .insert({ customer_id: customer.id })
    .select("id, name")
    .single<{ id: string; name: string }>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to create wishlist.", { expose: false });
  }

  return data;
}

export async function getWishlist(supabase: SupabaseClient, user: User) {
  const wishlist = await getOrCreateWishlist(supabase, user);
  const { data, error } = await supabase
    .from("wishlist_items")
    .select(
      `
      id,
      product_id,
      created_at,
      products (
        id,
        title,
        slug,
        subtitle,
        status,
        seo_title,
        seo_description,
        product_variants (
          id,
          title,
          sku,
          price_cents,
          compare_at_price_cents,
          currency,
          is_active
        ),
        product_images (
          id,
          url,
          alt,
          position
        )
      )
    `,
    )
    .eq("wishlist_id", wishlist.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new AppError("INTERNAL", "Unable to load wishlist items.", { expose: false });
  }

  const items = (data as WishlistItemRow[]).map((item) => ({
    ...item,
    products: Array.isArray(item.products) ? (item.products[0] ?? null) : item.products,
  }));

  return { ...wishlist, items };
}

export async function addWishlistItem(
  supabase: SupabaseClient,
  user: User,
  input: WishlistItemInput,
) {
  const wishlist = await getOrCreateWishlist(supabase, user);
  const { error } = await supabase
    .from("wishlist_items")
    .upsert(
      { product_id: input.product_id, wishlist_id: wishlist.id },
      { onConflict: "wishlist_id,product_id" },
    );

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  return getWishlist(supabase, user);
}

export async function removeWishlistItem(
  supabase: SupabaseClient,
  user: User,
  input: WishlistItemInput,
) {
  const wishlist = await getOrCreateWishlist(supabase, user);
  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("wishlist_id", wishlist.id)
    .eq("product_id", input.product_id);

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  return getWishlist(supabase, user);
}
