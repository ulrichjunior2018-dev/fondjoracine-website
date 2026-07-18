import { publicEnv } from "@/config/public-env";

import type { MediaProviderDescriptor } from "../types";

export const cloudinaryMediaProvider: MediaProviderDescriptor = {
  id: "cloudinary",
  label: "Cloudinary",
  isConfigured: () => Boolean(publicEnv.cloudinaryCloudName),
  getDeliveryHint: () =>
    publicEnv.cloudinaryCloudName
      ? `https://res.cloudinary.com/${publicEnv.cloudinaryCloudName}`
      : "",
};
