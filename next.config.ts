import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** Current LAN IPv4s so phone preview keeps working when Wi‑Fi / hotspot changes. */
function lanDevOrigins(): string[] {
  const origins = new Set<string>();
  for (const list of Object.values(os.networkInterfaces())) {
    for (const iface of list ?? []) {
      const family = iface.family;
      if ((String(family) === "IPv4" || String(family) === "4") && !iface.internal) {
        origins.add(iface.address);
      }
    }
  }
  return [...origins];
}

const nextConfig: NextConfig = {
  // Parent folder has a stray package-lock.json; pin Turbopack to this app.
  turbopack: {
    root: projectRoot,
  },
  // Slow/corrupt FS cache on Windows can crash dev (missing .meta files). Opt out.
  experimental: {
    turbopackFileSystemCacheForDev: false,
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
    ],
  },
  // Allow HMR when opening the site from another device on your LAN (phone/tablet).
  allowedDevOrigins: lanDevOrigins(),
  async redirects() {
    return [
      { destination: "/histoire", permanent: true, source: "/origin-story" },
      { destination: "/learn", permanent: true, source: "/how-to-use" },
      { destination: "/learn", permanent: true, source: "/faq" },
      { destination: "/diagnostic", permanent: true, source: "/hair-consultation" },
      { destination: "/botanique", permanent: true, source: "/ingredients" },
      { destination: "/shop", permanent: true, source: "/boutique" },
      { destination: "/shop", permanent: true, source: "/fr/shop" },
      { destination: "/learn", permanent: true, source: "/fr/learn" },
      { destination: "/checkout", permanent: true, source: "/cart" },
      // Legacy product URLs → canonical catalog routes
      { destination: "/products/seve-racine", permanent: true, source: "/seve-racine" },
      { destination: "/shop", permanent: true, source: "/collections" },
      { destination: "/shop", permanent: true, source: "/collections/:slug*" },
      { destination: "/shop", permanent: true, source: "/pre-order" },
      { destination: "/products/seve-racine", permanent: true, source: "/product" },
      { destination: "/shop", permanent: true, source: "/search" },
      { destination: "/shop", permanent: true, source: "/wishlist" },
    ];
  },
  async headers() {
    // Pragmatic CSP baseline (PRD-production-security). Tighten in Phase 1
    // after verifying Stripe Checkout, Supabase Auth, and Cloudinary images.
    // Never send upgrade-insecure-requests in local/LAN HTTP previews — the
    // browser upgrades CSS/JS to HTTPS and the page renders as raw HTML.
    const isProd = process.env.NODE_ENV === "production";
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self' https://checkout.stripe.com",
      "img-src 'self' data: blob: https://res.cloudinary.com https://*.stripe.com",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.stripe.com https://res.cloudinary.com",
      ...(isProd ? ["upgrade-insecure-requests"] : []),
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          ...(isProd
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]
            : []),
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 430, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  typedRoutes: true,
};

export default nextConfig;
