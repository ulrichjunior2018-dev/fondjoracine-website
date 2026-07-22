import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { resolveShareImage } from "@/lib/seo/social-images";

type ShareMetadataInput = {
  description: string;
  image?: {
    alt: string;
    height: number;
    src: string;
    width: number;
  };
  locale?: string;
  title: string;
  url?: string;
};

export function buildShareMetadata({
  description,
  image,
  locale = siteConfig.locale,
  title,
  url = siteConfig.url,
}: ShareMetadataInput): Pick<Metadata, "openGraph" | "twitter"> {
  const shareImage = resolveShareImage(image);

  return {
    openGraph: {
      description,
      images: [
        {
          alt: shareImage.alt,
          height: shareImage.height,
          url: shareImage.url,
          width: shareImage.width,
        },
      ],
      locale,
      title,
      url,
    },
    twitter: {
      card: "summary_large_image",
      description,
      images: [shareImage.url],
      title,
    },
  };
}
