import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Maison Fondjo",
    short_name: "Maison Fondjo",
    description: "Sève Racine par Maison Fondjo. Enracinée dans la nature. Faite pour durer.",
    start_url: "/",
    display: "standalone",
    background_color: "#080706",
    theme_color: "#080706",
    icons: [
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
