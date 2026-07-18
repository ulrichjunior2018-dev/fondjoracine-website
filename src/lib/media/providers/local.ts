import type { MediaProviderDescriptor } from "../types";

/** Local / static public assets under `/public` — always available as fallback. */
export const localMediaProvider: MediaProviderDescriptor = {
  id: "local",
  label: "Local static assets",
  isConfigured: () => true,
};
