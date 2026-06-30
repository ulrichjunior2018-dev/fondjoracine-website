import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { CreateOrderInput } from "@/domain/commerce/schemas";
import { AppError } from "@/lib/errors/app-error";
import { ensureCustomerForUser } from "@/services/commerce/customer-service";

function createOrderNumber() {
  return `LR-${Date.now().toString(36).toUpperCase()}`;
}

export async function listOrders(supabase: SupabaseClient, user: User) {
  const customer = await ensureCustomerForUser(supabase, user);
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, status, fulfillment_status, total_cents, currency, created_at")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new AppError("INTERNAL", "Unable to list orders.", { expose: false });
  }

  return data;
}

export async function createOrder(supabase: SupabaseClient, user: User, input: CreateOrderInput) {
  const customer = await ensureCustomerForUser(supabase, user);
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id, cart_items(quantity, unit_price_cents)")
    .eq("id", input.cart_id)
    .eq("customer_id", customer.id)
    .single<{ id: string; cart_items: { quantity: number; unit_price_cents: number }[] }>();

  if (cartError || cart.cart_items.length === 0) {
    throw new AppError("BAD_REQUEST", "Cart is empty or unavailable.");
  }

  const subtotal = cart.cart_items.reduce(
    (total, item) => total + item.quantity * item.unit_price_cents,
    0,
  );

  const { data, error } = await supabase
    .from("orders")
    .insert({
      billing_address: input.billing_address,
      cart_id: input.cart_id,
      customer_id: customer.id,
      email: input.email,
      order_number: createOrderNumber(),
      shipping_address: input.shipping_address,
      subtotal_cents: subtotal,
      total_cents: subtotal,
    })
    .select("id, order_number, status, total_cents, currency")
    .single();

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  return data;
}
