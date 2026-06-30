import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { AddCartItemInput, UpdateCartItemInput } from "@/domain/commerce/schemas";
import type { Cart } from "@/domain/commerce/types";
import { AppError } from "@/lib/errors/app-error";
import { ensureCustomerForUser } from "@/services/commerce/customer-service";

export async function getOrCreateCart(supabase: SupabaseClient, user: User) {
  const customer = await ensureCustomerForUser(supabase, user);

  const { data: existingCart, error: existingError } = await supabase
    .from("carts")
    .select(
      `
      id,
      currency,
      cart_items (
        id,
        variant_id,
        quantity,
        unit_price_cents,
        product_variants (
          id,
          title,
          sku,
          product_id,
          products (
            title,
            slug,
            product_images (
              id,
              url,
              alt,
              position
            )
          )
        )
      )
    `,
    )
    .eq("customer_id", customer.id)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<Cart>();

  if (existingError) {
    throw new AppError("INTERNAL", "Unable to load cart.", { expose: false });
  }

  if (existingCart) {
    return existingCart;
  }

  const { data, error } = await supabase
    .from("carts")
    .insert({ customer_id: customer.id })
    .select("id, currency, cart_items(id, variant_id, quantity, unit_price_cents)")
    .single<Cart>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to create cart.", { expose: false });
  }

  return data;
}

export async function addCartItem(supabase: SupabaseClient, user: User, input: AddCartItemInput) {
  const cart = await getOrCreateCart(supabase, user);
  const { data: variant, error: variantError } = await supabase
    .from("product_variants")
    .select("id, price_cents")
    .eq("id", input.variant_id)
    .eq("is_active", true)
    .single<{ id: string; price_cents: number }>();

  if (variantError || !variant) {
    throw new AppError("BAD_REQUEST", "Selected product variant is not available.");
  }

  const { error } = await supabase.from("cart_items").upsert(
    {
      cart_id: cart.id,
      variant_id: input.variant_id,
      quantity: input.quantity,
      unit_price_cents: variant.price_cents,
    },
    { onConflict: "cart_id,variant_id" },
  );

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  return getOrCreateCart(supabase, user);
}

export async function updateCartItem(
  supabase: SupabaseClient,
  user: User,
  input: UpdateCartItemInput,
) {
  const cart = await getOrCreateCart(supabase, user);
  const ownsItem = cart.cart_items.some((item) => item.id === input.cart_item_id);

  if (!ownsItem) {
    throw new AppError("NOT_FOUND", "Cart item not found.");
  }

  const response =
    input.quantity === 0
      ? await supabase.from("cart_items").delete().eq("id", input.cart_item_id)
      : await supabase
          .from("cart_items")
          .update({ quantity: input.quantity })
          .eq("id", input.cart_item_id);

  if (response.error) {
    throw new AppError("BAD_REQUEST", response.error.message);
  }

  return getOrCreateCart(supabase, user);
}
