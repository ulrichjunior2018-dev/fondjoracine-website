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

/** True when the signed-in user has any admin permission (same email/password as customers). */
export async function getCurrentUserIsAdmin(): Promise<boolean> {
  try {
    const { supabase } = await requireApiUser();
    const { data, error } = await supabase.rpc("has_admin_permission", {
      permission: "orders.read",
    });
    if (error || data !== true) {
      const analytics = await supabase.rpc("has_admin_permission", {
        permission: "analytics.read",
      });
      return analytics.data === true;
    }
    return true;
  } catch {
    return false;
  }
}
