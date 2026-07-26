import { siteConfig } from "@/config/site";

/** Default social preview — Maison Fondjo Sève Racine product shot. */
export const defaultSocialImage = {
  path: "/images/maison-fondjo-seve-racine.jpg",
  width: 963,
  height: 1280,
  alt: "Maison Fondjo Sève Racine bottle on stone in natural light",
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
