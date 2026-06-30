import { createReviewSchema } from "@/domain/commerce/schemas";
import { fail, ok } from "@/lib/api/responses";
import { parseJsonBody } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/rbac";
import { createReview } from "@/services/commerce/review-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const input = await parseJsonBody(request, createReviewSchema);
    const { supabase, user } = await requireApiUser();
    const review = await createReview(supabase, user, input);

    return ok({ review }, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}
