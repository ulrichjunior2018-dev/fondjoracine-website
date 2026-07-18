import { publicEnv } from "@/config/public-env";

import type { IdentityProviderDescriptor } from "../types";

export const phoneProvider: IdentityProviderDescriptor = {
  id: "phone",
  kind: "otp",
  displayName: "Phone",
  label: "Continue with phone",
  description: "Sign in with a one-time code sent to your phone.",
  surfaces: ["auth_gate", "security", "api"],
  surfacesAsButton: true,
  isConfigured: () => publicEnv.authPhoneEnabled,
};
