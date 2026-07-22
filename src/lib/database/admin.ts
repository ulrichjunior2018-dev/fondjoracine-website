import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/config/env";
import { AppError } from "@/lib/errors/app-error";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new AppError(
      "BAD_REQUEST",
      "Server database key is missing. Set SUPABASE_SERVICE_ROLE_KEY (and NEXT_PUBLIC_SUPABASE_URL) in Vercel Production, then redeploy.",
    );
  }

  adminClient ??= createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
