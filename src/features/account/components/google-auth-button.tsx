"use client";

import { SocialAuthButtons } from "@/features/account/components/social-auth-buttons";

type GoogleAuthButtonProps = {
  next?: string;
  showDivider?: boolean;
  /** @deprecated Ignored — use `next` instead. Kept so old call sites type-check briefly. */
  redirectTo?: string;
};

/**
 * @deprecated Prefer `SocialAuthButtons`. Kept as a thin alias so any leftover
 * imports keep working while the identity registry becomes the source of truth.
 */
export function GoogleAuthButton({ next = "/account", showDivider = true }: GoogleAuthButtonProps) {
  return <SocialAuthButtons next={next} providerId="google" showDivider={showDivider} />;
}
