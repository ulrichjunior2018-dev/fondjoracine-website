import { AppError } from "@/lib/errors/app-error";
import type { z } from "zod";

export async function parseJsonBody<TSchema extends z.ZodType>(request: Request, schema: TSchema) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    throw new AppError("BAD_REQUEST", "Request body must be valid JSON.");
  }

  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    throw new AppError("BAD_REQUEST", parsed.error.issues[0]?.message ?? "Invalid request body.");
  }

  return parsed.data as z.infer<TSchema>;
}

export function parseSearchParams<TSchema extends z.ZodType>(request: Request, schema: TSchema) {
  const values = Object.fromEntries(new URL(request.url).searchParams.entries());
  const parsed = schema.safeParse(values);

  if (!parsed.success) {
    throw new AppError(
      "BAD_REQUEST",
      parsed.error.issues[0]?.message ?? "Invalid query parameters.",
    );
  }

  return parsed.data as z.infer<TSchema>;
}
