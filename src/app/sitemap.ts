import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = [
    "",
    "/fr",
    "/product",
    "/hair-consultation",
    "/how-to-use",
    "/ingredients",
    "/origin-story",
    "/pre-order",
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
    priority: route === "" ? 1 : route === "/pre-order" || route === "/product" ? 0.9 : 0.7,
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
