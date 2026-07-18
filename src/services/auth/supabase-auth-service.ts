import type { AuthRole, AuthSessionUser } from "@/domain/auth/types";
import { listAvailableIdentityProviders as listConfiguredIdentityOptions } from "@/lib/identity/registry";
import type { IdentityProviderOption } from "@/lib/identity/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { AuthService } from "./auth-service";

function mapRole(appMetadata: Record<string, unknown> | undefined): AuthRole {
  return appMetadata?.role === "admin" ? "admin" : "customer";
}

export const supabaseAuthService: AuthService = {
  async getCurrentUser(): Promise<AuthSessionUser | null> {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: mapRole(user.app_metadata as Record<string, unknown> | undefined),
    };
  },

  listAvailableIdentityProviders(): IdentityProviderOption[] {
    return listConfiguredIdentityOptions();
  },
};
