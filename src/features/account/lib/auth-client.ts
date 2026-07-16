"use client";

import { env } from "@/config/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

/**
 * Browser-side auth actions for the customer account feature. These call
 * Supabase directly from the client (the standard Next.js + Supabase App
 * Router pattern) so session cookies are set by the Supabase SDK itself;
 * everything else in the app (profile, addresses, orders...) still goes
 * through the versioned `/api/v1` + service layer.
 */

export function isGoogleAuthEnabled(): boolean {
  return env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true";
}

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

export async function signInWithGoogle(redirectTo: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) {
    throw new Error(error.message);
  }
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
