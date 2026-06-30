import { z } from "zod";

import { ok, fail } from "@/lib/api/responses";
import { parseJsonBody } from "@/lib/api/request";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { AppError } from "@/lib/errors/app-error";

const newsletterSchema = z.object({
  email: z.string().email(),
  source: z.string().min(2).max(80).default("homepage"),
});

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const input = await parseJsonBody(request, newsletterSchema);
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("newsletter_signups").upsert(
      {
        email: input.email.toLowerCase(),
        source: input.source,
      },
      { onConflict: "email" },
    );

    if (error) {
      throw new AppError("BAD_REQUEST", "Unable to save newsletter signup.");
    }

    return ok({ subscribed: true }, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}
