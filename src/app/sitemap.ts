import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = [
    "",
    "/fr",
    "/diagnostic",
    "/botanique",
    "/seve-racine",
    "/sur-mesure",
    "/grossistes",
    "/how-to-use",
    "/origin-story",
    "/faq",
    "/contact",
    "/policies/privacy",
    "/policies/terms",
    "/policies/returns",
    "/policies/shipping",
  ];

  return publicRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority:
      route === "" ? 1 : route === "/diagnostic" ? 0.95 : route === "/seve-racine" ? 0.86 : 0.7,
    ...(route === "" || route === "/fr"
      ? {
          alternates: {
            languages: {
              en: siteConfig.url,
              fr: `${siteConfig.url}/fr`,
            },
          },
        }
      : {}),
  }));
}
