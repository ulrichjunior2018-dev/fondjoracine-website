"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type CSSProperties, type ReactNode } from "react";

import { Icons } from "@/components/icons/icons";
import { AccountProfileMenu } from "@/features/account/components/account-profile-menu";
import { accountNavGroups, type AccountNavItem } from "@/features/account/lib/nav";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils/cn";

/** Account shell palette — requested by product for the authenticated mobile dashboard. */
const accountUi = {
  accent: "rgb(184, 147, 90)",
  accentMuted: "rgba(184, 147, 90, 0.18)",
  bg: "rgb(229, 231, 235)",
  surface: "rgb(245, 246, 247)",
  surfaceElevated: "rgb(255, 255, 255)",
  text: "rgb(20, 20, 20)",
} as const;

/**
 * Remap design tokens for the account subtree so existing Card/Heading/Button
 * components render correctly on the light account palette.
 */
const accountThemeVars = {
  "--accent": accountUi.accent,
  "--accent-foreground": accountUi.text,
  "--accent-muted": accountUi.accentMuted,
  "--background": accountUi.bg,
  "--border": "rgba(20, 20, 20, 0.12)",
  "--border-strong": "rgba(184, 147, 90, 0.45)",
  "--foreground": accountUi.text,
  "--ink": accountUi.text,
  "--ink-muted": "rgba(20, 20, 20, 0.1)",
  "--ring": accountUi.accent,
  "--shadow-soft": "0 4px 24px rgba(20, 20, 20, 0.08)",
  "--shadow-lifted": "0 8px 32px rgba(20, 20, 20, 0.1)",
  "--surface": accountUi.surface,
  "--surface-elevated": accountUi.surfaceElevated,
  "--surface-muted": "rgba(20, 20, 20, 0.06)",
} as CSSProperties;

type AccountShellProps = {
  children: ReactNode;
  customerName: string;
};

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return href === "/account" ? pathname === href : pathname.startsWith(href);
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "MF";
  }

  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }

  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

function NavItemRow({
  item,
  label,
  comingSoonLabel,
  soonBadge,
  onNavigate,
  pathname,
}: {
  comingSoonLabel: string;
  item: AccountNavItem;
  label: string;
  onNavigate?: () => void;
  pathname: string;
  soonBadge: string;
}) {
  const Icon = Icons[item.icon];
  const active = !item.comingSoon && isActive(pathname, item.href);

  const rowClass = cn(
    "flex w-full items-center rounded-xl text-left font-semibold transition-colors duration-200",
    // Mobile drawer: comfortable touch targets. Desktop sidebar: compact.
    "min-h-12 gap-3 px-3 py-2.5 text-[15px]",
    "lg:min-h-9 lg:gap-2.5 lg:rounded-lg lg:px-2.5 lg:py-1.5 lg:text-[13px] lg:font-medium",
    item.comingSoon && "cursor-not-allowed opacity-55",
    !item.comingSoon && !active && "hover:bg-[rgba(184,147,90,0.12)]",
  );

  const content = (
    <>
      <Icon
        aria-hidden="true"
        className="h-[18px] w-[18px] shrink-0 lg:h-4 lg:w-4"
        style={{ color: active ? accountUi.accent : accountUi.text }}
      />
      <span
        className="flex-1 truncate"
        style={{ color: active ? accountUi.accent : accountUi.text }}
      >
        {label}
      </span>
      {item.comingSoon ? (
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
          style={{ backgroundColor: accountUi.accentMuted, color: accountUi.accent }}
        >
          {soonBadge}
        </span>
      ) : null}
    </>
  );

  if (item.comingSoon) {
    return (
      <div aria-disabled="true" className={rowClass} title={comingSoonLabel}>
        {content}
      </div>
    );
  }

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={rowClass}
      href={item.href}
      {...(onNavigate ? { onClick: onNavigate } : {})}
      {...(active ? { style: { backgroundColor: accountUi.accentMuted } } : {})}
    >
      {content}
    </Link>
  );
}

function NavGroups({ onNavigate, pathname }: { onNavigate?: () => void; pathname: string }) {
  const { locale } = useI18n();
  const nav = getDictionary(locale).account.nav;

  return (
    <nav aria-label={nav.account} className="grid gap-6 lg:gap-4">
      {accountNavGroups.map((group) => (
        <div className="grid gap-1 lg:gap-0.5" key={group.id}>
          {group.labelKey ? (
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55 lg:mb-0.5 lg:px-2.5 lg:text-[10px]">
              {nav[group.labelKey]}
            </p>
          ) : null}
          {group.items.map((item) => (
            <NavItemRow
              comingSoonLabel={nav.comingSoon}
              item={item}
              key={item.href}
              label={nav[item.labelKey]}
              {...(onNavigate ? { onNavigate } : {})}
              pathname={pathname}
              soonBadge={nav.soonBadge}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}

/**
 * Mobile-first shell: hamburger on the right opens a slide-down feature menu
 * (light gray + near-black text + gold accents). Desktop keeps a left sidebar.
 */
export function AccountShell({ children, customerName }: AccountShellProps) {
  const pathname = usePathname();
  const { locale } = useI18n();
  const nav = getDictionary(locale).account.nav;
  const menuId = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const initials = initialsFromName(customerName);

  // Close drawer/popover when the route changes (React "adjust state when prop changes").
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isProfileMenuOpen]);

  // Tag <html> so the document (viewport) scrollbar can match the panel while
  // on account pages, without affecting the dark storefront.
  useEffect(() => {
    document.documentElement.classList.add("account-page");

    return () => document.documentElement.classList.remove("account-page");
  }, []);

  return (
    <div
      className="account-root min-h-svh overflow-x-hidden bg-background text-foreground [color-scheme:light] lg:h-svh lg:overflow-hidden"
      style={accountThemeVars}
    >
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background lg:hidden">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <Link className="font-serif text-lg tracking-tight text-accent" href="/">
            Maison Fondjo
          </Link>
          <button
            aria-controls={menuId}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? nav.closeMenu : nav.openMenu}
            className="inline-flex size-11 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-accent-muted"
            onClick={() => setIsMenuOpen((open) => !open)}
            type="button"
          >
            {isMenuOpen ? (
              <Icons.x aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Icons.menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Slide-down feature menu */}
        <div
          className={cn(
            "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
            isMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
          id={menuId}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="account-scroll max-h-[calc(100svh-3.5rem)] overflow-y-auto overscroll-contain border-t border-border bg-background px-3 pb-6 pt-4">
              {/* Profile at the top with a ⋯ menu — same preferences as desktop */}
              <div className="mb-5">
                <div className="flex items-center gap-3 rounded-xl px-2 py-2">
                  <span
                    aria-hidden="true"
                    className="grid size-10 place-items-center rounded-full bg-accent-muted text-sm font-semibold text-accent"
                  >
                    {initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-foreground">
                      {customerName}
                    </p>
                    <p className="truncate text-xs text-foreground/55">{nav.accountSubtitle}</p>
                  </div>
                  <button
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="menu"
                    aria-label={nav.accountOptions}
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-foreground/70 transition-colors hover:bg-accent-muted hover:text-accent"
                    onClick={() => setIsProfileMenuOpen((open) => !open)}
                    type="button"
                  >
                    <Icons.moreHorizontal aria-hidden="true" className="h-5 w-5" />
                  </button>
                </div>

                {isProfileMenuOpen ? (
                  <div className="mt-2 rounded-xl border border-border bg-surface-elevated p-1">
                    <AccountProfileMenu onClose={() => setIsProfileMenuOpen(false)} />
                  </div>
                ) : null}
              </div>

              <NavGroups onNavigate={() => setIsMenuOpen(false)} pathname={pathname} />
            </div>
          </div>
        </div>
      </header>

      <div className="lg:flex lg:h-svh lg:items-stretch">
        {/* Desktop sidebar — docked flush to the left edge, full height */}
        <aside className="sticky top-0 hidden h-svh w-[280px] shrink-0 flex-col border-r border-border bg-background lg:flex">
          <div className="flex h-14 items-center px-5">
            <Link className="font-serif text-lg tracking-tight text-accent" href="/">
              Maison Fondjo
            </Link>
          </div>

          <div className="account-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-3 py-4">
            <NavGroups pathname={pathname} />
          </div>

          {/* Profile pinned at the bottom, with a ⋯ menu that reveals Sign out */}
          <div className="relative p-3">
            {isProfileMenuOpen ? (
              <>
                <button
                  aria-hidden="true"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setIsProfileMenuOpen(false)}
                  tabIndex={-1}
                  type="button"
                />
                <div
                  className="absolute bottom-full left-3 right-3 z-50 mb-2 max-h-[70svh] overflow-y-auto rounded-xl border border-border bg-surface-elevated p-1 shadow-[var(--shadow-lifted)]"
                  role="menu"
                >
                  <AccountProfileMenu onClose={() => setIsProfileMenuOpen(false)} />
                </div>
              </>
            ) : null}

            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-muted text-xs font-semibold text-accent"
              >
                {initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{customerName}</p>
                <p className="truncate text-xs text-foreground/55">{nav.accountSubtitle}</p>
              </div>
              <button
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="menu"
                aria-label={nav.accountOptions}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-accent-muted hover:text-accent"
                onClick={() => setIsProfileMenuOpen((open) => !open)}
                type="button"
              >
                <Icons.moreHorizontal aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Content — fills the remaining width out to the right edge */}
        <main
          className={cn(
            "account-scroll min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:h-svh lg:overflow-y-auto lg:overscroll-contain lg:px-10 lg:py-12",
            isMenuOpen && "max-lg:hidden",
          )}
        >
          <div className="mx-auto w-full min-w-0 max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
