import { siteConfig } from "@/config/site";

/** Resolve a site-relative or absolute path against the canonical site URL. */
export function absoluteSiteUrl(pathOrUrl = ""): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const base = siteConfig.url.replace(/\/$/, "");
  if (!pathOrUrl || pathOrUrl === "/") {
    return base;
  }

  return `${base}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}
