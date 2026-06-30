import { MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type WhatsAppCtaProps = {
  className?: string;
  href: string;
  label: string;
  floating?: boolean;
};

export function WhatsAppCta({ className, floating = false, href, label }: WhatsAppCtaProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md bg-success px-4 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-success/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        floating && "fixed bottom-5 right-5 z-40 h-12 px-4",
        className,
      )}
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}
