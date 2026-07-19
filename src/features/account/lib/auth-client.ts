"use client";

import { getIdentityProvider } from "@/lib/identity/registry";
import type { IdentityProviderId } from "@/lib/identity/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

import { buildAuthCallbackUrl } from "./auth-urls";

/**
 * Browser-side auth actions. Password + identity-provider flows talk to
 * Supabase from the client (standard App Router pattern for session cookies).
 * Profile/orders/etc. still go through `/api/v1`.
 *
 * Social / alternate signup methods are resolved from `src/lib/identity` —
 * never hardcode a provider name here beyond the registry lookup.
 */

export async function signUpWithPassword(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { first_name: input.firstName, last_name: input.lastName },
      emailRedirectTo: buildAuthCallbackUrl("/account"),
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function signInWithPassword(input: { email: string; password: string }) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithPassword(input);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Starts a configured identity provider (Google, Apple, …).
 * Redirect uses the current browser origin so local / LAN / production work.
 */
export async function startIdentityProvider(providerId: IdentityProviderId, nextPath = "/account") {
  const descriptor = getIdentityProvider(providerId);

  if (!descriptor.isConfigured()) {
    throw new Error(`${descriptor.label} is not enabled.`);
  }

  if (descriptor.kind === "password") {
    throw new Error("Use the email and password form to sign in.");
  }

  if (descriptor.kind === "otp") {
    throw new Error(
      `${descriptor.label} is registered but the OTP UI is not wired yet. Add it without changing other providers.`,
    );
  }

  if (descriptor.kind !== "oauth" || !descriptor.oauthSlug) {
    throw new Error(`Unsupported identity flow for ${descriptor.id}.`);
  }

  const supabase = createSupabaseBrowserClient();
  const redirectTo = buildAuthCallbackUrl(nextPath);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: descriptor.oauthSlug,
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}

/** @deprecated Prefer `startIdentityProvider("google", next)`. */
export async function signInWithGoogle(nextPath = "/account") {
  return startIdentityProvider("google", nextPath);
}

/** @deprecated Prefer `listSocialIdentityProviders()` from the identity registry. */
export function isGoogleAuthEnabled(): boolean {
  return getIdentityProvider("google").isConfigured();
}

/** Signs out of this device only. Pass `{ everywhere: true }` from Security to end all sessions. */
export async function signOut(options?: { everywhere?: boolean }) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut({
    scope: options?.everywhere ? "global" : "local",
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function requestPasswordReset(email: string, redirectTo: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updatePassword(password: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error(error.message);
  }
}
