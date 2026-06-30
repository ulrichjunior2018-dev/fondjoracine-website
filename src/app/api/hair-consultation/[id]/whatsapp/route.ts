import { z } from "zod";

import { fail, ok } from "@/lib/api/responses";
import { AppError } from "@/lib/errors/app-error";
import { markHairConsultationWhatsappClicked } from "@/services/commerce/hair-consultation-service";

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function PATCH(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const parsed = paramsSchema.safeParse(await context.params);

    if (!parsed.success) {
      throw new AppError("BAD_REQUEST", "Consultation id is invalid.");
    }

    const params = parsed.data;
    await markHairConsultationWhatsappClicked(params.id);

    return ok({ status: "clicked" });
  } catch (error) {
    return fail(error);
  }
}
