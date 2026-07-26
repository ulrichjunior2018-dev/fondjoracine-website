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

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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

      <div
        className={cn(
          "absolute inset-x-0 top-full origin-top transition-[opacity,transform] duration-200",
          "bg-[linear-gradient(180deg,rgb(11_11_11/.72)_0%,rgb(11_11_11/.42)_70%,transparent_100%)] pb-4 backdrop-blur-[2px]",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
        id={panelId}
      >
        <nav
          aria-label="Marketing sections"
          className="mx-auto grid max-w-7xl gap-1 px-4 py-3 sm:px-6"
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
                    : "text-[#F5EFE3]/72 hover:bg-white/5 hover:text-[#F5EFE3]",
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
