import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/config/env";
import { AppError } from "@/lib/errors/app-error";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new AppError("INTERNAL", "Supabase admin environment variables are not configured.", {
      expose: false,
    });
  }

  adminClient ??= createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
