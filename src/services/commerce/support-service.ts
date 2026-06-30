import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { CreateSupportTicketInput } from "@/domain/commerce/schemas";
import { AppError } from "@/lib/errors/app-error";
import { getCustomerForUser } from "@/services/commerce/customer-service";

export async function createSupportTicket(
  supabase: SupabaseClient,
  user: User | null,
  input: CreateSupportTicketInput,
) {
  const customer = user ? await getCustomerForUser(supabase, user) : null;
  const { data: ticket, error: ticketError } = await supabase
    .from("support_tickets")
    .insert({
      customer_id: customer?.id,
      email: input.email,
      priority: input.priority,
      subject: input.subject,
    })
    .select("id, status")
    .single<{ id: string; status: string }>();

  if (ticketError) {
    throw new AppError("BAD_REQUEST", ticketError.message);
  }

  const { error: messageError } = await supabase.from("support_ticket_messages").insert({
    author_email: input.email,
    author_profile_id: user?.id,
    body: input.body,
    ticket_id: ticket.id,
  });

  if (messageError) {
    throw new AppError("BAD_REQUEST", messageError.message);
  }

  return ticket;
}
