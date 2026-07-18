import { appleProvider } from "./providers/apple";
import { facebookProvider } from "./providers/facebook";
import { googleProvider } from "./providers/google";
import { passwordProvider } from "./providers/password";
import { phoneProvider } from "./providers/phone";
import type {
  IdentityProviderDescriptor,
  IdentityProviderId,
  IdentityProviderOption,
  IdentitySurface,
} from "./types";

/**
 * Single source of truth for how users authenticate — used by login, signup,
 * Security, Settings, `/api/v1/identity-providers`, and future clients.
 *
 * To add a method: create `providers/<id>.ts` and register it below.
 * To pause a method: turn off its env flag (button/API entry disappears).
 */
const providers: readonly IdentityProviderDescriptor[] = [
  passwordProvider,
  googleProvider,
  appleProvider,
  facebookProvider,
  phoneProvider,
];

export function getIdentityProvider(id: IdentityProviderId): IdentityProviderDescriptor {
  const provider = providers.find((candidate) => candidate.id === id);

  if (!provider) {
    throw new Error(`Unsupported identity provider: ${id}.`);
  }

  return provider;
}

export function listIdentityProviders(): readonly IdentityProviderDescriptor[] {
  return providers;
}

export function isIdentityProviderConfigured(id: IdentityProviderId): boolean {
  return getIdentityProvider(id).isConfigured();
}

/** All methods currently configured (password + social/OTP). */
export function listConfiguredIdentityProviders(): IdentityProviderOption[] {
  return providers.filter((provider) => provider.isConfigured()).map(toOption);
}

/**
 * Methods available on a product surface (auth gate, security, API discovery).
 * Prefer this over hardcoding which providers belong where.
 */
export function listIdentityProvidersForSurface(
  surface: IdentitySurface,
): IdentityProviderOption[] {
  return providers
    .filter((provider) => provider.surfaces.includes(surface) && provider.isConfigured())
    .map(toOption);
}

/**
 * Button methods for login / signup (and any other auth gate).
 * Password is excluded — it has its own forms.
 */
export function listSocialIdentityProviders(): IdentityProviderOption[] {
  return providers
    .filter(
      (provider) =>
        provider.surfacesAsButton &&
        provider.surfaces.includes("auth_gate") &&
        provider.isConfigured(),
    )
    .map(toOption);
}

/** Connected-account rows on Security (configured + upcoming stubs). */
export function listSecurityIdentityProviders(): IdentityProviderDescriptor[] {
  return providers.filter((provider) => provider.surfaces.includes("security"));
}

/** Public API shape — mirrors `listAvailablePaymentMethods`. */
export function listAvailableIdentityProviders(): IdentityProviderOption[] {
  return listIdentityProvidersForSurface("api");
}

function toOption(provider: IdentityProviderDescriptor): IdentityProviderOption {
  return {
    id: provider.id,
    kind: provider.kind,
    displayName: provider.displayName,
    label: provider.label,
    description: provider.description,
    surfacesAsButton: provider.surfacesAsButton,
    ...(provider.oauthSlug ? { oauthSlug: provider.oauthSlug } : {}),
  };
}
