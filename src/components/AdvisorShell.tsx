"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

import { NavAuthButton } from "@/components/nav-auth-button";
import { SiteFooter } from "@/components/site-footer";
import { useCopy } from "@/lib/i18n-context";
import {
  getMarketingDesktopNav,
  getMarketingMobileNav,
  isMarketingNavActive,
} from "@/lib/marketing-nav";
import { cn } from "@/lib/utils/cn";

type AdvisorShellProps = {
  children: React.ReactNode;
};

export function AdvisorShell({ children }: AdvisorShellProps) {
  const copy = useCopy();
  const pathname = usePathname();
  const shell = copy.home.shell;
  const desktopNav = getMarketingDesktopNav(copy.home.nav);
  const mobileNav = getMarketingMobileNav(copy.home.nav);

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5EFE3]">
      <header className="sticky top-0 z-50 border-b border-[#B8935A]/14 bg-[#0B0B0B]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/" aria-label={shell.homeLabel}>
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-full border border-[#B8935A]/35 bg-[#0f2415] font-serif text-xs text-[#B8935A] sm:size-10 sm:text-sm"
            >
              MF
            </span>
            <span className="hidden sm:block">
              <span className="block font-serif text-2xl leading-none text-[#B8935A]">
                Maison Fondjo
              </span>
              <span className="block text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-[#F5EFE3]/58">
                {shell.place}
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-[0.16em] text-[#F5EFE3]/62 md:flex">
            {desktopNav.map(([label, href]) => {
              const active = isMarketingNavActive(pathname, href);

              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b-2 pb-1 transition-colors hover:text-[#B8935A]",
                    active ? "border-[#B8935A] text-[#F5EFE3]" : "border-transparent",
                  )}
                  href={href as Route}
                  key={href}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-sm bg-[#B8935A] px-3 text-sm font-semibold text-[#0B0B0B] transition-transform duration-100 hover:-translate-y-0.5 active:scale-[0.98] sm:px-4"
              href={"/shop" as Route}
            >
              {copy.home.buy}
            </Link>
            <NavAuthButton />
          </div>
        </div>
        <nav
          aria-label="Marketing sections"
          className="flex gap-5 overflow-x-auto border-t border-[#B8935A]/10 px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#F5EFE3]/62 md:hidden"
        >
          {mobileNav.map(([label, href]) => {
            const active = isMarketingNavActive(pathname, href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 border-b-2 pb-1 transition-colors",
                  active
                    ? "border-[#B8935A] text-[#F5EFE3]"
                    : "border-transparent hover:text-[#B8935A]",
                )}
                href={href as Route}
                key={href}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
      {children}
      <SiteFooter />
    </main>
  );
}
