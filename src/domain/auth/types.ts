export type AuthRole = "customer" | "admin";

export type AuthSessionUser = {
  id: string;
  email: string;
  role: AuthRole;
};

/**
 * Re-export identity provider ids so domain consumers can depend on
 * `domain/auth` without importing infrastructure. Source of truth for the
 * union lives in `src/lib/identity/types.ts`.
 */
export type { IdentityProviderId, IdentityProviderKind } from "@/lib/identity/types";
