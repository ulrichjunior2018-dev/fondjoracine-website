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
      { destination: "/seve-racine", permanent: true, source: "/cart" },
      { destination: "/seve-racine", permanent: true, source: "/collections" },
      { destination: "/seve-racine", permanent: true, source: "/collections/:slug*" },
      { destination: "/seve-racine", permanent: true, source: "/pre-order" },
      { destination: "/seve-racine", permanent: true, source: "/product" },
      { destination: "/seve-racine", permanent: true, source: "/products/:slug*" },
      { destination: "/seve-racine", permanent: true, source: "/search" },
      { destination: "/seve-racine", permanent: true, source: "/wishlist" },
    ];
  },
  async headers() {
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
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
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
