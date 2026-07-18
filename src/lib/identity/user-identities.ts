import type { User } from "@supabase/supabase-js";

import type { IdentityProviderId } from "./types";

/**
 * Maps Supabase `user.identities[].provider` onto our registry ids.
 * Used by Security / account surfaces so linked methods stay registry-driven.
 */
const supabaseProviderToId: Record<string, IdentityProviderId> = {
  email: "password",
  google: "google",
  apple: "apple",
  facebook: "facebook",
  phone: "phone",
};

export function listLinkedIdentityProviderIds(user: User | null | undefined): IdentityProviderId[] {
  if (!user?.identities?.length) {
    return [];
  }

  const ids = new Set<IdentityProviderId>();

  for (const identity of user.identities) {
    const mapped = supabaseProviderToId[identity.provider];
    if (mapped) {
      ids.add(mapped);
    }
  }

  return [...ids];
}

/**
 * Pull first/last name from any OAuth (or email) user_metadata shape.
 * Provider-agnostic — do not special-case Google in callbacks.
 */
export function namesFromAuthMetadata(meta: Record<string, unknown> | undefined | null): {
  firstName: string | null;
  lastName: string | null;
} {
  if (!meta) {
    return { firstName: null, lastName: null };
  }

  const fullNameRaw = meta.full_name ?? meta.name;
  const fullName = typeof fullNameRaw === "string" ? fullNameRaw.trim() : "";
  const [givenFromFull, ...rest] = fullName ? fullName.split(/\s+/) : [];

  const firstName =
    (typeof meta.first_name === "string" && meta.first_name) ||
    (typeof meta.given_name === "string" && meta.given_name) ||
    givenFromFull ||
    null;

  const lastName =
    (typeof meta.last_name === "string" && meta.last_name) ||
    (typeof meta.family_name === "string" && meta.family_name) ||
    (rest.length ? rest.join(" ") : null);

  return { firstName, lastName };
}
