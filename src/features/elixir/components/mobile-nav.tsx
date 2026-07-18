"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type MobileNavLink = {
  href: string;
  label: string;
};

type MobileNavProps = {
  alternateHref: Route;
  languageLabel: string;
  links: MobileNavLink[];
  orderLabel: string;
};

export function MobileNav({ alternateHref, languageLabel, links, orderLabel }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

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
      <Button
        aria-controls="legacy-mobile-drawer"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setIsOpen((current) => !current)}
        size="icon"
        variant="secondary"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      <div
        aria-hidden={!isOpen}
        className={cn(
          "fixed inset-0 z-[60]",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <button
          aria-label="Close navigation"
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setIsOpen(false)}
          type="button"
        />
        <aside
          className={cn(
            "absolute inset-y-0 right-0 flex w-1/2 min-w-[15rem] max-w-[22rem] flex-col border-l border-border bg-surface shadow-lifted transition-transform duration-300 ease-out",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
          id="legacy-mobile-drawer"
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <p className="text-sm font-semibold">Menu</p>
            <button
              aria-label="Close navigation"
              className="grid size-10 place-items-center rounded-md border border-border"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <nav className="grid flex-1 gap-2 overflow-y-auto p-4">
            {links.map((link) => (
              <Link
                className="rounded-md px-3 py-3 text-sm font-semibold text-foreground hover:bg-surface-muted"
                href={link.href as Route}
                key={link.href}
                onClick={() => setIsOpen(false)}
                prefetch
              >
                {link.label}
              </Link>
            ))}
            <a
              className="rounded-md bg-foreground px-3 py-3 text-center text-sm font-semibold text-background"
              href="#order"
              onClick={() => setIsOpen(false)}
            >
              {orderLabel}
            </a>
            <Link
              className="rounded-md border border-border px-3 py-3 text-center text-sm font-semibold"
              href={alternateHref}
              onClick={() => setIsOpen(false)}
            >
              {languageLabel}
            </Link>
          </nav>
        </aside>
      </div>
    </div>
  );
}
