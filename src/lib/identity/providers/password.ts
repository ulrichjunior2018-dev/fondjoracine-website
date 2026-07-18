import { hasSupabasePublicConfig } from "@/config/public-env";

import type { IdentityProviderDescriptor } from "../types";

/** Email + password — forms on login/signup; manage on Security. */
export const passwordProvider: IdentityProviderDescriptor = {
  id: "password",
  kind: "password",
  displayName: "Email & password",
  label: "Email and password",
  description: "Sign in with the email and password you created.",
  surfaces: ["auth_gate", "security", "api"],
  surfacesAsButton: false,
  isConfigured: () => hasSupabasePublicConfig(),
};
