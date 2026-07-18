/**
 * Media delivery abstraction.
 * Product images / uploads resolve a media provider from the registry.
 * Cloudinary today; add S3/ImageKit later without rewriting callers.
 */

export type MediaProviderId = "cloudinary" | "local";

export type MediaProviderOption = {
  id: MediaProviderId;
  label: string;
};

export interface MediaProviderDescriptor {
  id: MediaProviderId;
  label: string;
  /** Whether this backend can be used with current env. */
  isConfigured: () => boolean;
  /** Public delivery base hint (optional; adapters may ignore). */
  getDeliveryHint?: () => string;
}
