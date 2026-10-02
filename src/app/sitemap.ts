import type { MetadataRoute } from "next";

import { catalogProducts } from "@/content/products";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const productEntries = catalogProducts.map((product) => ({
    url: `${siteConfig.url}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: product.status === "available" ? 0.9 : 0.55,
  }));

  const publicRoutes: Array<{
    route: string;
    changeFrequency: "weekly" | "monthly";
    priority: number;
  }> = [
    { route: "", changeFrequency: "weekly", priority: 1 },
    { route: "/fr", changeFrequency: "weekly", priority: 0.95 },
    { route: "/shop", changeFrequency: "weekly", priority: 0.92 },
    { route: "/diagnostic", changeFrequency: "monthly", priority: 0.88 },
    { route: "/learn", changeFrequency: "monthly", priority: 0.8 },
    { route: "/botanique", changeFrequency: "monthly", priority: 0.75 },
    { route: "/how-to-use", changeFrequency: "monthly", priority: 0.75 },
    { route: "/origin-story", changeFrequency: "monthly", priority: 0.7 },
    { route: "/histoire", changeFrequency: "monthly", priority: 0.7 },
    { route: "/faq", changeFrequency: "monthly", priority: 0.78 },
    { route: "/sur-mesure", changeFrequency: "monthly", priority: 0.65 },
    { route: "/grossistes", changeFrequency: "monthly", priority: 0.65 },
    { route: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { route: "/seve-racine", changeFrequency: "weekly", priority: 0.75 },
    { route: "/policies/privacy", changeFrequency: "monthly", priority: 0.3 },
    { route: "/policies/terms", changeFrequency: "monthly", priority: 0.3 },
    { route: "/policies/returns", changeFrequency: "monthly", priority: 0.3 },
    { route: "/policies/shipping", changeFrequency: "monthly", priority: 0.4 },
  ];

  const staticEntries = publicRoutes.map(({ route, changeFrequency, priority }) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
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

  return [...staticEntries, ...productEntries];
}
