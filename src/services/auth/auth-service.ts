import type { AuthSessionUser } from "@/domain/auth/types";
import type { IdentityProviderOption } from "@/lib/identity/types";

/**
 * Auth application service contract.
 * Implementations must resolve identity methods from `src/lib/identity` —
 * never hardcode provider availability here.
 */
export interface AuthService {
  getCurrentUser(): Promise<AuthSessionUser | null>;
  listAvailableIdentityProviders(): IdentityProviderOption[];
}
