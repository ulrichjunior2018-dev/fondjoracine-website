import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { config } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  if (config.env === "staging") {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/order-confirmation"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
