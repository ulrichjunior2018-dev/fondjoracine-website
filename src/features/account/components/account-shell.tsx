"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type CSSProperties, type ReactNode } from "react";

import { Icons } from "@/components/icons/icons";
import { Container } from "@/components/ui/container";
import { SignOutButton } from "@/features/account/components/sign-out-button";
import { accountNavGroups, type AccountNavItem } from "@/features/account/lib/nav";
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
  onNavigate,
  pathname,
}: {
  item: AccountNavItem;
  onNavigate?: () => void;
  pathname: string;
}) {
  const Icon = Icons[item.icon];
  const active = !item.comingSoon && isActive(pathname, item.href);

  const rowClass = cn(
    "flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] font-semibold transition-colors duration-200",
    item.comingSoon && "cursor-not-allowed opacity-55",
    !item.comingSoon && !active && "hover:bg-[rgba(184,147,90,0.12)]",
  );

  const content = (
    <>
      <Icon
        aria-hidden="true"
        className="h-[18px] w-[18px] shrink-0"
        style={{ color: active ? accountUi.accent : accountUi.text }}
      />
      <span
        className="flex-1 truncate"
        style={{ color: active ? accountUi.accent : accountUi.text }}
      >
        {item.label}
      </span>
      {item.comingSoon ? (
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
          style={{ backgroundColor: accountUi.accentMuted, color: accountUi.accent }}
        >
          Soon
        </span>
      ) : null}
    </>
  );

  if (item.comingSoon) {
    return (
      <div aria-disabled="true" className={rowClass} title="Coming soon">
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
  return (
    <nav aria-label="Account" className="grid gap-6">
      {accountNavGroups.map((group) => (
        <div className="grid gap-1" key={group.id}>
          {group.label ? (
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55">
              {group.label}
            </p>
          ) : null}
          {group.items.map((item) => (
            <NavItemRow
              item={item}
              key={item.href}
              {...(onNavigate ? { onNavigate } : {})}
              pathname={pathname}
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
  const menuId = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const initials = initialsFromName(customerName);

  // Close the drawer when the route changes (preferred over setState-in-effect).
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setIsMenuOpen(false);
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

  return (
    <div className="min-h-svh bg-background text-foreground" style={accountThemeVars}>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background lg:hidden">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <Link className="font-serif text-lg tracking-tight text-accent" href="/account">
            Maison Fondjo
          </Link>
          <button
            aria-controls={menuId}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
            <div className="max-h-[calc(100svh-3.5rem)] overflow-y-auto overscroll-contain border-t border-border bg-background px-3 pb-6 pt-4">
              <div className="mb-5 flex items-center gap-3 px-2">
                <span
                  aria-hidden="true"
                  className="grid size-11 place-items-center rounded-full bg-accent-muted text-sm font-semibold text-accent"
                >
                  {initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-foreground">{customerName}</p>
                  <p className="truncate text-xs text-foreground/55">Maison Fondjo account</p>
                </div>
              </div>

              <NavGroups onNavigate={() => setIsMenuOpen(false)} pathname={pathname} />

              <div className="mt-6 px-1">
                <SignOutButton className="w-full border-border bg-transparent text-foreground hover:bg-accent-muted hover:text-accent" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <Container
        className={cn(
          "grid gap-8 py-6 lg:grid-cols-[260px_1fr] lg:py-12",
          isMenuOpen && "max-lg:hidden",
        )}
        size="xl"
      >
        <aside className="hidden lg:block">
          <div className="sticky top-8 rounded-2xl border border-border bg-background p-4">
            <div className="mb-6 flex items-center gap-3 px-1">
              <span
                aria-hidden="true"
                className="grid size-11 place-items-center rounded-full bg-accent-muted text-sm font-semibold text-accent"
              >
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{customerName}</p>
                <p className="truncate text-xs text-foreground/55">Maison Fondjo account</p>
              </div>
            </div>
            <NavGroups pathname={pathname} />
            <SignOutButton className="mt-6 w-full border-border bg-transparent text-foreground hover:bg-accent-muted hover:text-accent" />
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </Container>
    </div>
  );
}
