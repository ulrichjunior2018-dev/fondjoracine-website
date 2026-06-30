import type Stripe from "stripe";

import { env } from "@/config/env";
import { fail, ok } from "@/lib/api/responses";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { AppError } from "@/lib/errors/app-error";
import { getStripeClient } from "@/lib/payments/stripe";
import { fulfillStripeOrder } from "@/services/commerce/one-product-order-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!env.STRIPE_WEBHOOK_SECRET) {
      throw new AppError("INTERNAL", "Stripe webhook secret is not configured.", {
        expose: false,
      });
    }

    const stripe = getStripeClient();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      throw new AppError("BAD_REQUEST", "Missing Stripe signature.");
    }

    const body = await request.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
    } catch {
      throw new AppError("BAD_REQUEST", "Invalid Stripe webhook signature.");
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const supabase = getSupabaseAdminClient();
      await fulfillStripeOrder(supabase, session);
    }

    return ok({ received: true });
  } catch (error) {
    return fail(error);
  }
}
