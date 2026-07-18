import { publicEnv } from "@/config/public-env";

import type { IdentityProviderDescriptor } from "../types";

export const googleProvider: IdentityProviderDescriptor = {
  id: "google",
  kind: "oauth",
  displayName: "Google",
  label: "Continue with Google",
  description: "Sign in with your Google account.",
  surfaces: ["auth_gate", "security", "api"],
  surfacesAsButton: true,
  oauthSlug: "google",
  isConfigured: () => publicEnv.authGoogleEnabled,
};
