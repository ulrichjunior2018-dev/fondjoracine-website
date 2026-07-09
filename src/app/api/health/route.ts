import { ok } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

export function GET() {
  return ok({
    status: "ok",
    service: "maisonfondjo",
    timestamp: new Date().toISOString(),
  });
}
