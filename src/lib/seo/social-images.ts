import { siteConfig } from "@/config/site";

/** Default social preview — real Sève Racine studio product shot. */
export const defaultSocialImage = {
  path: "/images/studio.png",
  width: 1086,
  height: 1448,
  alt: "Sève Racine bottle in a reflective black studio",
} as const;

export function absoluteSiteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

type ShareImageInput = {
  alt: string;
  height: number;
  src: string;
  width: number;
};

export function resolveShareImage(image?: ShareImageInput) {
  const resolved = image ?? {
    alt: defaultSocialImage.alt,
    height: defaultSocialImage.height,
    src: defaultSocialImage.path,
    width: defaultSocialImage.width,
  };

  return {
    alt: resolved.alt,
    height: resolved.height,
    url: absoluteSiteUrl(resolved.src),
    width: resolved.width,
  };
}
