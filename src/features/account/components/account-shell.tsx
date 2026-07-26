"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
  useCallback,
  type ReactNode,
} from "react";

import { Icons } from "@/components/icons/icons";
import { AccountProfileMenu } from "@/features/account/components/account-profile-menu";
import { resolveAccountTheme, type AccountTheme } from "@/features/account/lib/account-theme";
import { accountNavGroups, type AccountNavItem } from "@/features/account/lib/nav";
import { useMounted } from "@/hooks/use-mounted";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils/cn";

type AccountShellProps = {
  children: ReactNode;
  customerName: string;
  /** Same email/password login as customers; only admins see staff tools. */
  isAdmin?: boolean;
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
    "min-h-12 gap-3 px-3 py-2.5 text-[15px]",
    "lg:min-h-9 lg:gap-2.5 lg:rounded-lg lg:px-2.5 lg:py-1.5 lg:text-[13px] lg:font-medium",
    item.comingSoon && "cursor-not-allowed opacity-55",
    !item.comingSoon && !active && "hover:bg-accent-muted",
    active && "bg-accent-muted",
  );

  const iconClass = cn(
    "h-[18px] w-[18px] shrink-0 lg:h-4 lg:w-4",
    active ? "text-accent" : "text-foreground",
  );
  const labelClass = cn("flex-1 truncate", active ? "text-accent" : "text-foreground");

  const content = (
    <>
      <Icon aria-hidden="true" className={iconClass} />
      <span className={labelClass}>{label}</span>
      {item.comingSoon ? (
        <span className="shrink-0 rounded-full bg-accent-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-accent">
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
    >
      {content}
    </Link>
  );
}

function NavGroups({
  onNavigate,
  pathname,
  isAdmin,
}: {
  onNavigate?: () => void;
  pathname: string;
  isAdmin?: boolean;
}) {
  const { locale } = useI18n();
  const nav = getDictionary(locale).account.nav;

  return (
    <nav aria-label={nav.account} className="grid gap-6 lg:gap-4">
      {isAdmin ? (
        <div className="grid gap-1 lg:gap-0.5">
          <Link
            className={cn(
              "flex w-full items-center rounded-xl text-left font-semibold transition-colors duration-200",
              "min-h-12 gap-3 px-3 py-2.5 text-[15px]",
              "lg:min-h-9 lg:gap-2.5 lg:rounded-lg lg:px-2.5 lg:py-1.5 lg:text-[13px] lg:font-medium",
              pathname.startsWith("/admin")
                ? "bg-accent-muted text-accent"
                : "hover:bg-accent-muted",
            )}
            href="/admin"
            {...(onNavigate ? { onClick: onNavigate } : {})}
          >
            <Icons.grid
              aria-hidden="true"
              className={cn(
                "h-[18px] w-[18px] shrink-0 lg:h-4 lg:w-4",
                pathname.startsWith("/admin") ? "text-accent" : "text-foreground",
              )}
            />
            <span className="flex-1 truncate">{nav.adminDashboard}</span>
          </Link>
        </div>
      ) : null}
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

function useSystemColorPreference() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
    () => "light" as const,
  );
}

/**
 * Mobile-first shell: hamburger on the right opens a slide-down feature menu
 * (light gray + near-black text + gold accents). Desktop keeps a left sidebar.
 * Appearance (light / dark / system) comes from the profile menu via `next-themes`.
 */
export function AccountShell({ children, customerName, isAdmin = false }: AccountShellProps) {
  const pathname = usePathname();
  const { locale } = useI18n();
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();
  const systemPreference = useSystemColorPreference();
  const nav = getDictionary(locale).account.nav;
  const menuId = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const [appearanceChoice, setAppearanceChoice] = useState<string | null>(null);
  const initials = initialsFromName(customerName);
  const selectedAppearance = appearanceChoice ?? theme ?? "system";
  const accountTheme: AccountTheme = mounted
    ? resolveAccountTheme(selectedAppearance, systemTheme ?? systemPreference, resolvedTheme)
    : "light";

  const handleAppearanceChange = useCallback(
    (nextTheme: "light" | "dark" | "system") => {
      setAppearanceChoice(nextTheme);
      setTheme(nextTheme);
    },
    [setTheme],
  );

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

    return () => void window.removeEventListener("keydown", onKeyDown);
  }, [isProfileMenuOpen]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("account-page");
    root.dataset.accountTheme = accountTheme;

    return () => {
      root.classList.remove("account-page");
      delete root.dataset.accountTheme;
    };
  }, [accountTheme]);

  return (
    <div
      className="account-root min-h-svh overflow-x-hidden bg-background text-foreground lg:h-svh lg:overflow-hidden"
      data-account-theme={accountTheme}
      suppressHydrationWarning
    >
      {/* Mobile top bar: back ← | brand | menu — soft fade into the page */}
      <header className="sticky top-0 z-40 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_78%,transparent)_0%,color-mix(in_srgb,var(--background)_38%,transparent)_58%,transparent_100%)] pb-4 backdrop-blur-[2px] lg:hidden">
        <div className="flex h-14 items-center gap-1 px-2 sm:px-3">
          <Link
            aria-label={nav.backToWebsite}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-accent-muted hover:text-accent"
            href="/"
          >
            <Icons.arrowLeft aria-hidden="true" className="h-5 w-5" />
          </Link>
          <Link
            className="min-w-0 flex-1 truncate px-1 font-serif text-lg tracking-tight text-accent"
            href="/account"
          >
            Maison Fondjo
          </Link>
          <button
            aria-controls={menuId}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? nav.closeMenu : nav.openMenu}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-accent-muted"
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

        <div
          className={cn(
            "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
            isMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
          id={menuId}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="account-scroll max-h-[calc(100svh-3.5rem)] overflow-y-auto overscroll-contain bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_88%,transparent)_0%,color-mix(in_srgb,var(--background)_70%,transparent)_75%,transparent_100%)] px-3 pb-8 pt-4 backdrop-blur-[2px]">
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
                    <AccountProfileMenu
                      activeAppearance={selectedAppearance}
                      isAdmin={isAdmin}
                      onAppearanceChange={handleAppearanceChange}
                      onClose={() => setIsProfileMenuOpen(false)}
                      resolvedAppearance={accountTheme}
                    />
                  </div>
                ) : null}
              </div>

              <NavGroups
                isAdmin={isAdmin}
                onNavigate={() => setIsMenuOpen(false)}
                pathname={pathname}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="lg:flex lg:h-svh lg:items-stretch">
        <aside className="sticky top-0 hidden h-svh w-[280px] shrink-0 flex-col border-r border-border bg-background lg:flex">
          <div className="flex h-14 items-center gap-1 border-b border-border px-3">
            <Link
              aria-label={nav.backToWebsite}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-foreground/75 transition-colors hover:bg-accent-muted hover:text-accent"
              href="/"
              title={nav.backToWebsite}
            >
              <Icons.arrowLeft aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              className="min-w-0 flex-1 truncate px-1 font-serif text-lg tracking-tight text-accent"
              href="/account"
            >
              Maison Fondjo
            </Link>
          </div>

          <div className="account-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-3 py-4">
            <NavGroups isAdmin={isAdmin} pathname={pathname} />
          </div>

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
                  <AccountProfileMenu
                    activeAppearance={selectedAppearance}
                    isAdmin={isAdmin}
                    onAppearanceChange={handleAppearanceChange}
                    onClose={() => setIsProfileMenuOpen(false)}
                    resolvedAppearance={accountTheme}
                  />
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
