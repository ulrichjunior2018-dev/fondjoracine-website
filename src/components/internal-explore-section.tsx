"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

import {
  getInternalExploreLinks,
  internalExploreCopy,
  type InternalLinkItem,
} from "@/lib/internal-links";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils/cn";

type InternalExploreSectionProps = {
  /** Hide the current page (and aliases) from the list. */
  exclude?: string | readonly string[];
  intent?: "commerce" | "education" | "story" | "support";
  /** dark = storefront/advisor shell; light = policy/FAQ surfaces */
  tone?: "dark" | "light";
  className?: string;
  /** Optional hardcoded links (skips the shared map). */
  links?: InternalLinkItem[];
};

/**
 * Contextual internal links for SEO crawl paths and shopper orientation.
 * One job: related destinations after the main page content.
 */
export function InternalExploreSection({
  exclude,
  intent = "education",
  tone = "dark",
  className,
  links: linksProp,
}: InternalExploreSectionProps) {
  const { locale } = useI18n();
  const copy = internalExploreCopy(locale);
  const links =
    linksProp ??
    getInternalExploreLinks(locale, {
      intent,
      ...(exclude !== undefined ? { exclude } : {}),
    });

  if (links.length === 0) {
    return null;
  }

  const isDark = tone === "dark";

  return (
    <section
      aria-labelledby="internal-explore-heading"
      className={cn(
        "border-t px-4 py-12 sm:px-6 sm:py-14 lg:px-8",
        isDark ? "border-[#B8935A]/14 text-[#F5EFE3]" : "border-border text-foreground",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">
        <p
          className={cn(
            "text-[0.65rem] font-semibold uppercase tracking-[0.28em]",
            isDark ? "text-[#B8935A]" : "text-accent",
          )}
        >
          {copy.eyebrow}
        </p>
        <h2
          className={cn(
            "mt-4 max-w-2xl font-serif text-3xl font-light leading-tight sm:text-4xl",
            isDark ? "text-[#F5EFE3]" : "text-foreground",
          )}
          id="internal-explore-heading"
        >
          {copy.title}
        </h2>
        <p
          className={cn(
            "mt-3 max-w-xl text-sm leading-7",
            isDark ? "text-[#F5EFE3]/62" : "text-foreground/65",
          )}
        >
          {copy.intro}
        </p>

        <ul
          className={cn(
            "mt-8 divide-y border-y",
            isDark ? "divide-[#B8935A]/14 border-[#B8935A]/14" : "divide-border border-border",
          )}
        >
          {links.map((item) => (
            <li key={item.href}>
              <Link
                className="group grid gap-2 py-5 transition sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1.45fr)_auto] sm:items-center sm:gap-8"
                href={item.href as Route}
                prefetch
              >
                <span
                  className={cn(
                    "font-serif text-xl font-light transition-colors sm:text-2xl",
                    isDark
                      ? "text-[#F5EFE3] group-hover:text-[#B8935A]"
                      : "text-foreground group-hover:text-accent",
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    "text-sm leading-7",
                    isDark ? "text-[#F5EFE3]/62" : "text-foreground/65",
                  )}
                >
                  {item.description}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]",
                    isDark ? "text-[#B8935A]" : "text-accent",
                  )}
                >
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
