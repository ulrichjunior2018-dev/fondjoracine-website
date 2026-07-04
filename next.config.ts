import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { destination: "/diagnostic", permanent: true, source: "/hair-consultation" },
      { destination: "/botanique", permanent: true, source: "/ingredients" },
      { destination: "/seve-racine", permanent: true, source: "/cart" },
      { destination: "/seve-racine", permanent: true, source: "/collections" },
      { destination: "/seve-racine", permanent: true, source: "/collections/:slug*" },
      { destination: "/seve-racine", permanent: true, source: "/pre-order" },
      { destination: "/seve-racine", permanent: true, source: "/product" },
      { destination: "/seve-racine", permanent: true, source: "/products/:slug*" },
      { destination: "/seve-racine", permanent: true, source: "/search" },
      { destination: "/seve-racine", permanent: true, source: "/shop" },
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
