import { ok } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

/**
 * Versioned health probe. First endpoint under the `/api/v1` contract that all
 * clients (web, admin, future iOS/Android) consume through the shared API client.
 */
export function GET() {
  return ok({
    status: "ok",
    service: "maisonfondjo",
    version: "v1",
    timestamp: new Date().toISOString(),
  });
}
