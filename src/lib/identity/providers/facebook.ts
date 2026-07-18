import { publicEnv } from "@/config/public-env";

import type { IdentityProviderDescriptor } from "../types";

export const facebookProvider: IdentityProviderDescriptor = {
  id: "facebook",
  kind: "oauth",
  displayName: "Facebook",
  label: "Continue with Facebook",
  description: "Sign in with your Facebook account.",
  surfaces: ["auth_gate", "security", "api"],
  surfacesAsButton: true,
  oauthSlug: "facebook",
  isConfigured: () => publicEnv.authFacebookEnabled,
};
