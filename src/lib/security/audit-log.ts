import type { SupabaseClient } from "@supabase/supabase-js";

type AuditLogInput = {
  action: string;
  entityTable: string;
  entityId?: string | null;
  actorProfileId?: string | null;
  beforeData?: Record<string, unknown> | null;
  afterData?: Record<string, unknown> | null;
  ipHash?: string | null;
  userAgent?: string | null;
};

/**
 * Best-effort audit writer. Failures are swallowed so security logging
 * never blocks checkout, webhooks, or admin mutations.
 */
export async function writeAuditLog(supabase: SupabaseClient, input: AuditLogInput) {
  try {
    const { error } = await supabase.from("audit_logs").insert({
      action: input.action,
      actor_profile_id: input.actorProfileId ?? null,
      after_data: input.afterData ?? null,
      before_data: input.beforeData ?? null,
      entity_id: input.entityId ?? null,
      entity_table: input.entityTable,
      ip_hash: input.ipHash ?? null,
      user_agent: input.userAgent ?? null,
    });

    if (error) {
      console.error("[audit_logs]", error.message);
    }
  } catch (error) {
    console.error("[audit_logs]", error);
  }
}
