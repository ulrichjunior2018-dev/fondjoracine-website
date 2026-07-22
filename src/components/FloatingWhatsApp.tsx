"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

import { buildWaLink } from "@/lib/config";
import { useI18n } from "@/lib/i18n-context";

export function FloatingWhatsApp() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const href = buildWaLink("support", "", locale);

  // Checkout has its own sticky pay + WhatsApp fallback — floating button covers mobile UI.
  if (pathname?.includes("/checkout")) {
    return null;
  }

  return (
    <a
      aria-label="Need help on WhatsApp"
      className="fixed bottom-20 right-4 z-[55] grid size-14 place-items-center rounded-full bg-[#25D366] shadow-[0_4px_24px_rgb(0_0_0/.28)] transition-transform duration-100 active:scale-[0.94] md:bottom-6 md:right-6"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle aria-hidden="true" className="size-6 text-white" />
    </a>
  );
}
