import { fail } from "@/lib/api/responses";
import { AppError } from "@/lib/errors/app-error";

export const dynamic = "force-dynamic";

export async function POST() {
  return fail(
    new AppError(
      "BAD_REQUEST",
      "Use /api/elixir/orders so every Stripe checkout is attached to a FONDJO order.",
    ),
  );
}
