import { createOrderSchema } from "@/domain/commerce/schemas";
import { fail, ok } from "@/lib/api/responses";
import { parseJsonBody } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/rbac";
import { createOrder, listOrders } from "@/services/commerce/order-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { supabase, user } = await requireApiUser();
    const orders = await listOrders(supabase, user);

    return ok({ orders });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = await parseJsonBody(request, createOrderSchema);
    const { supabase, user } = await requireApiUser();
    const order = await createOrder(supabase, user, input);

    return ok({ order }, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}
