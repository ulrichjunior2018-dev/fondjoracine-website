import { headers } from "next/headers";

import { createHairConsultationSchema } from "@/domain/commerce/schemas";
import { getElixirContent } from "@/features/elixir/lib/cms";
import { fail, ok } from "@/lib/api/responses";
import { AppError } from "@/lib/errors/app-error";
import { assertRateLimit } from "@/lib/security/rate-limit";
import { createHairConsultation } from "@/services/commerce/hair-consultation-service";

function getClientKey(headersList: Headers) {
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "anonymous"
  );
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    assertRateLimit(`hair-consultation:${getClientKey(headersList)}`, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    const payload = await request.json();
    const parsed = createHairConsultationSchema.safeParse(payload);

    if (!parsed.success) {
      throw new AppError(
        "BAD_REQUEST",
        parsed.error.issues[0]?.message ?? "Consultation answers are invalid.",
      );
    }

    const content = await getElixirContent();
    const result = await createHairConsultation(parsed.data, content);

    return ok(result);
  } catch (error) {
    return fail(error);
  }
}
