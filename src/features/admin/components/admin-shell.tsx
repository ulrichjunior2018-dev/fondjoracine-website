"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

import { Icons } from "@/components/icons/icons";
import { resolveAccountTheme, type AccountTheme } from "@/features/account/lib/account-theme";
import { useMounted } from "@/hooks/use-mounted";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils/cn";

type AdminShellProps = {
  children: ReactNode;
};

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
 * Admin pages share the account dashboard palette (`data-account-theme`)
 * and the same next-themes preference (light / dark / system).
 */
export function AdminShell({ children }: AdminShellProps) {
  const { locale } = useI18n();
  const admin = getDictionary(locale).admin;
  const menu = getDictionary(locale).account.menu;
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();
  const systemPreference = useSystemColorPreference();
  const [appearanceChoice, setAppearanceChoice] = useState<string | null>(null);
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

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("account-page");
    root.dataset.accountTheme = accountTheme;

    return () => {
      root.classList.remove("account-page");
      delete root.dataset.accountTheme;
    };
  }, [accountTheme]);

  const themeOptions = [
    { icon: "sun" as const, label: menu.themeLight, value: "light" as const },
    { icon: "moon" as const, label: menu.themeDark, value: "dark" as const },
    { icon: "monitor" as const, label: menu.themeSystem, value: "system" as const },
  ];

  return (
    <div
      className="account-root min-h-svh bg-background text-foreground"
      data-account-theme={accountTheme}
      suppressHydrationWarning
    >
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:px-6">
          <Link
            aria-label={admin.goToAccount}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-foreground/75 transition-colors hover:bg-accent-muted hover:text-accent"
            href="/account"
            title={admin.goToAccount}
          >
            <Icons.arrowLeft aria-hidden="true" className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-base tracking-tight text-accent sm:text-lg">
              {admin.kicker}
            </p>
          </div>
          <div
            aria-label={menu.appearance}
            className="inline-flex items-center gap-0.5 rounded-xl border border-border bg-surface p-1"
            role="group"
          >
            {themeOptions.map((option) => {
              const OptionIcon = Icons[option.icon];
              const selected = selectedAppearance === option.value;

              return (
                <button
                  aria-label={option.label}
                  aria-pressed={selected}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-lg transition-colors",
                    selected
                      ? "bg-accent-muted text-accent"
                      : "text-foreground/65 hover:bg-accent-muted/60 hover:text-foreground",
                  )}
                  key={option.value}
                  onClick={() => handleAppearanceChange(option.value)}
                  title={option.label}
                  type="button"
                >
                  <OptionIcon aria-hidden="true" className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
