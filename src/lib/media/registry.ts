import { cloudinaryMediaProvider } from "./providers/cloudinary";
import { localMediaProvider } from "./providers/local";
import type { MediaProviderDescriptor, MediaProviderId, MediaProviderOption } from "./types";

/**
 * Media backends. Prefer Cloudinary when configured; otherwise local static.
 * Add ImageKit / S3 = new provider module + registry line.
 */
const providers: readonly MediaProviderDescriptor[] = [cloudinaryMediaProvider, localMediaProvider];

export function listMediaProviders(): readonly MediaProviderDescriptor[] {
  return providers;
}

export function getMediaProvider(id: MediaProviderId): MediaProviderDescriptor {
  const provider = providers.find((candidate) => candidate.id === id);
  if (!provider) {
    throw new Error(`Unknown media provider: ${id}`);
  }
  return provider;
}

/** Primary configured provider (Cloudinary if ready, else local). */
export function getActiveMediaProvider(): MediaProviderDescriptor {
  return (
    providers.find((provider) => provider.id === "cloudinary" && provider.isConfigured()) ??
    localMediaProvider
  );
}

export function listConfiguredMediaProviders(): MediaProviderOption[] {
  return providers
    .filter((provider) => provider.isConfigured())
    .map((provider) => ({ id: provider.id, label: provider.label }));
}
