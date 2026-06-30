import { addCartItemSchema, updateCartItemSchema } from "@/domain/commerce/schemas";
import { fail, ok } from "@/lib/api/responses";
import { parseJsonBody } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/rbac";
import { addCartItem, getOrCreateCart, updateCartItem } from "@/services/commerce/cart-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { supabase, user } = await requireApiUser();
    const cart = await getOrCreateCart(supabase, user);

    return ok({ cart });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = await parseJsonBody(request, addCartItemSchema);
    const { supabase, user } = await requireApiUser();
    const cart = await addCartItem(supabase, user, input);

    return ok({ cart }, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const input = await parseJsonBody(request, updateCartItemSchema);
    const { supabase, user } = await requireApiUser();
    const cart = await updateCartItem(supabase, user, input);

    return ok({ cart });
  } catch (error) {
    return fail(error);
  }
}
