"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { hasSupabasePublicConfig } from "@/config/public-env";
import { useCopy } from "@/lib/i18n-context";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils/cn";

type NavAuthButtonProps = {
  className?: string;
  onNavigate?: () => void;
  variant?: "header" | "drawer";
};

function canUseBrowserAuth() {
  return hasSupabasePublicConfig();
}

export function NavAuthButton({ className, onNavigate, variant = "header" }: NavAuthButtonProps) {
  const copy = useCopy().home;
  const authEnabled = canUseBrowserAuth();
  const [user, setUser] = useState<User | null>(null);
  // Ready immediately when Supabase isn't configured — no effect setState needed.
  const [isReady, setIsReady] = useState(!authEnabled);

  useEffect(() => {
    if (!authEnabled) {
      return;
    }

    let subscription: { unsubscribe: () => void } | undefined;

    try {
      const supabase = createSupabaseBrowserClient();

      void supabase.auth
        .getSession()
        .then(({ data }) => {
          setUser(data.session?.user ?? null);
          setIsReady(true);
        })
        .catch(() => {
          setIsReady(true);
        });

      const result = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      subscription = result.data.subscription;
    } catch {
      queueMicrotask(() => setIsReady(true));
    }

    return () => subscription?.unsubscribe();
  }, [authEnabled]);

  const href = (user ? "/account" : "/login") as Route;
  const label = user ? (copy.authAccount ?? "My account") : (copy.authSignIn ?? "Sign in");

  if (!isReady) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          variant === "header"
            ? "inline-block h-10 w-[4.75rem] rounded-sm border border-white/10"
            : "min-h-12",
          className,
        )}
      />
    );
  }

  if (variant === "drawer") {
    return (
      <Link
        className={cn(
          "min-h-12 px-3 py-3 text-sm font-semibold text-[#F5EFE3]/78 transition-colors hover:text-[#B8935A]",
          className,
        )}
        href={href}
        {...(onNavigate ? { onClick: onNavigate } : {})}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-sm border border-[#B8935A]/35 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#F5EFE3] transition-colors hover:border-[#B8935A]/60 hover:text-[#B8935A] sm:px-4 sm:text-xs sm:tracking-[0.14em]",
        className,
      )}
      href={href}
      {...(onNavigate ? { onClick: onNavigate } : {})}
    >
      {label}
    </Link>
  );
}
