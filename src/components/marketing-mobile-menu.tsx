"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { isMarketingNavActive } from "@/lib/marketing-nav";
import { cn } from "@/lib/utils/cn";

type MarketingMobileMenuProps = {
  closeLabel: string;
  links: ReadonlyArray<readonly [string, string]>;
  openLabel: string;
};

export function MarketingMobileMenu({ closeLabel, links, openLabel }: MarketingMobileMenuProps) {
  const pathname = usePathname();
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);

  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-label={isOpen ? closeLabel : openLabel}
        className="grid size-10 place-items-center rounded-sm border border-white/15 text-[#F5EFE3] transition hover:border-[#B8935A]/45 hover:text-[#B8935A]"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isOpen ? (
          <X className="size-4" aria-hidden="true" />
        ) : (
          <Menu className="size-4" aria-hidden="true" />
        )}
      </button>

      <button
        aria-label={closeLabel}
        className={cn(
          "fixed inset-0 z-[60] bg-[#0B0B0B]/72 transition-opacity duration-200",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsOpen(false)}
        tabIndex={isOpen ? 0 : -1}
        type="button"
      />

      <div
        className={cn(
          "fixed inset-x-0 top-16 z-[70] origin-top border-b border-white/10 bg-[#0B0B0B] shadow-[0_18px_40px_rgb(0_0_0/.45)] transition-[opacity,transform] duration-200 sm:top-20",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
        id={panelId}
      >
        <nav
          aria-label="Marketing sections"
          className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:px-6"
        >
          {links.map(([label, href]) => {
            const active = isMarketingNavActive(pathname, href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-sm px-3 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition",
                  active
                    ? "bg-[#B8935A]/12 text-[#B8935A]"
                    : "text-[#F5EFE3]/82 hover:bg-white/5 hover:text-[#F5EFE3]",
                )}
                href={href as Route}
                key={href}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
