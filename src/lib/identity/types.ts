/**
 * Identity / auth-method abstraction (system-wide).
 *
 * Any surface that cares about how someone signs in — login, signup, Security,
 * Settings, future mobile / API clients — resolves providers from the registry.
 * Never hardcode `google`, `apple`, etc. in pages or services.
 * Adding or removing a method is a new descriptor + one registry line.
 */

/** Stable provider ids. Extend this union when a new method ships. */
export type IdentityProviderId = "password" | "google" | "apple" | "facebook" | "phone";

/**
 * How the user authenticates:
 * - `password` — email + password forms
 * - `oauth` — redirect to an external IdP
 * - `otp` — one-time code (phone / magic link later)
 */
export type IdentityProviderKind = "password" | "oauth" | "otp";

/**
 * Supabase Auth OAuth provider slug when `kind === "oauth"`.
 * Keep in sync with `@supabase/supabase-js` Provider union as you add methods.
 */
export type IdentityOAuthSlug = "google" | "apple" | "facebook";

/**
 * Where this method may appear in the product. Consumers filter by surface
 * instead of special-casing provider ids.
 */
export type IdentitySurface =
  | "auth_gate" // /login, /signup
  | "security" // /account/security connected accounts
  | "api"; // public discovery for web + future clients

export interface IdentityProviderDescriptor {
  id: IdentityProviderId;
  kind: IdentityProviderKind;
  /** Short display name (e.g. "Google") for settings lists. */
  displayName: string;
  /** CTA label on auth buttons (e.g. "Continue with Google"). */
  label: string;
  /** Helper copy for Security / Settings. */
  description: string;
  /** Product surfaces this provider is allowed to appear on. */
  surfaces: readonly IdentitySurface[];
  /**
   * When true, auth gates render a button (OAuth / OTP).
   * Password stays false — it has dedicated forms.
   */
  surfacesAsButton: boolean;
  /** Supabase OAuth slug; only for `kind === "oauth"`. */
  oauthSlug?: IdentityOAuthSlug;
  /** Whether this method is usable given current env / dashboard config. */
  isConfigured: () => boolean;
}

/** Client-safe / API-safe view of an identity method. */
export type IdentityProviderOption = {
  id: IdentityProviderId;
  kind: IdentityProviderKind;
  displayName: string;
  label: string;
  description: string;
  surfacesAsButton: boolean;
  oauthSlug?: IdentityOAuthSlug;
};
