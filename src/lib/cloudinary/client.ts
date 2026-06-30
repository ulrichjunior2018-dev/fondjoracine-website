import { v2 as cloudinary } from "cloudinary";

import { env } from "@/config/env";
import { AppError } from "@/lib/errors/app-error";

let configured = false;

export function getCloudinaryClient() {
  if (
    !env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !env.CLOUDINARY_API_KEY ||
    !env.CLOUDINARY_API_SECRET
  ) {
    throw new AppError("INTERNAL", "Cloudinary environment variables are not configured.", {
      expose: false,
    });
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }

  return cloudinary;
}
