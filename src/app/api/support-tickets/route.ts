import { createSupportTicketSchema } from "@/domain/commerce/schemas";
import { fail, ok } from "@/lib/api/responses";
import { parseJsonBody } from "@/lib/api/request";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupportTicket } from "@/services/commerce/support-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const input = await parseJsonBody(request, createSupportTicketSchema);
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const ticket = await createSupportTicket(supabase, user, input);

    return ok({ ticket }, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}
