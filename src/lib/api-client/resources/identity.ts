import type { IdentityProviderOption } from "@/lib/identity/types";

import type { ApiClient } from "../client";

export type { IdentityProviderOption };

/** Fetch identity / sign-in methods available for the current deployment. */
export function listIdentityProviders(client: ApiClient): Promise<IdentityProviderOption[]> {
  return client.get<IdentityProviderOption[]>("/identity-providers");
}
