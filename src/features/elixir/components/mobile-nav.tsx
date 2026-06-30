"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";

import { Button } from "@/components/ui/button";

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

  return (
    <div className="lg:hidden">
      <Button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setIsOpen((current) => !current)}
        size="icon"
        variant="secondary"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      {isOpen ? (
        <div className="absolute inset-x-4 top-20 z-50 rounded-lg border border-border bg-surface p-4 shadow-lifted">
          <nav className="grid gap-2">
            {links.map((link) => (
              <a
                className="rounded-md px-3 py-3 text-sm font-semibold text-foreground hover:bg-surface-muted"
                href={link.href}
                key={link.href}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
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
        </div>
      ) : null}
    </div>
  );
}
