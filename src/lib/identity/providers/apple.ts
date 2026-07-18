import { publicEnv } from "@/config/public-env";

import type { IdentityProviderDescriptor } from "../types";

export const appleProvider: IdentityProviderDescriptor = {
  id: "apple",
  kind: "oauth",
  displayName: "Apple",
  label: "Continue with Apple",
  description: "Sign in with your Apple ID.",
  surfaces: ["auth_gate", "security", "api"],
  surfacesAsButton: true,
  oauthSlug: "apple",
  isConfigured: () => publicEnv.authAppleEnabled,
};
