import { AppError } from "@/lib/errors/app-error";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireApiUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AppError("UNAUTHORIZED", "Authentication is required.");
  }

  return { supabase, user };
}

export async function requireAdminPermission(permission: string) {
  const { supabase, user } = await requireApiUser();
  const { data, error } = await supabase.rpc("has_admin_permission", { permission });

  if (error || data !== true) {
    throw new AppError("FORBIDDEN", `Missing required permission: ${permission}.`);
  }

  return { supabase, user };
}
