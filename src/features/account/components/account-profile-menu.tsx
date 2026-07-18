"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Icons } from "@/components/icons/icons";
import { useToast } from "@/components/ui/toast";
import { signOut } from "@/features/account/lib/auth-client";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";
import { buildWaLink } from "@/lib/config";
import { cn } from "@/lib/utils/cn";

type AccountProfileMenuProps = {
  /** Closes the surrounding popover (called after a navigation/action). */
  onClose: () => void;
};

const itemClass =
  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium text-foreground transition-colors hover:bg-accent-muted hover:text-accent";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function AccountProfileMenu({ onClose }: AccountProfileMenuProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { locale } = useI18n();
  const menu = getDictionary(locale).account.menu;
  const nav = getDictionary(locale).account.nav;
  const auth = getDictionary(locale).auth;
  const { theme, setTheme } = useTheme();
  const [showAppearance, setShowAppearance] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  const themeOptions = [
    { icon: "sun" as const, label: menu.themeLight, value: "light" },
    { icon: "moon" as const, label: menu.themeDark, value: "dark" },
    { icon: "monitor" as const, label: menu.themeSystem, value: "system" },
  ];

  useEffect(() => {
    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  const activeTheme = theme ?? "system";
  const helpHref = buildWaLink("support", "", locale);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signOut();
      onClose();
      router.push("/");
      router.refresh();
    } catch (error) {
      setIsSigningOut(false);
      toast({
        title: auth.signOutError,
        description: error instanceof Error ? error.message : auth.tryAgain,
        tone: "danger",
      });
    }
  }

  async function handleInstall() {
    if (!installPrompt) {
      toast({
        title: menu.installTitle,
        description: menu.installBody,
      });
      onClose();
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    onClose();
  }

  return (
    <div className="grid gap-0.5">
      <Link className={itemClass} href="/" onClick={onClose}>
        <Icons.shoppingBag aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">{nav.backToWebsite}</span>
      </Link>

      <Link className={itemClass} href="/account/profile" onClick={onClose}>
        <Icons.user aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">{menu.updateProfile}</span>
      </Link>

      <div className="grid gap-0.5">
        <button
          aria-expanded={showAppearance}
          className={itemClass}
          onClick={() => setShowAppearance((open) => !open)}
          type="button"
        >
          <Icons.palette aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate">{menu.appearance}</span>
          <span className="text-[11px] capitalize text-foreground/55">{activeTheme}</span>
          <Icons.chevronRight
            aria-hidden="true"
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-transform",
              showAppearance && "rotate-90",
            )}
          />
        </button>

        {showAppearance ? (
          <div className="ml-3 grid gap-0.5 border-l border-border pl-2">
            {themeOptions.map((option) => {
              const OptionIcon = Icons[option.icon];
              const selected = activeTheme === option.value;

              return (
                <button
                  className={itemClass}
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  type="button"
                >
                  <OptionIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{option.label}</span>
                  {selected ? (
                    <Icons.check aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <a className={itemClass} href={helpHref} onClick={onClose} rel="noreferrer" target="_blank">
        <Icons.lifeBuoy aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">{menu.helpWhatsapp}</span>
      </a>

      <button className={itemClass} onClick={handleInstall} type="button">
        <Icons.download aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">{menu.installApp}</span>
      </button>

      <div className="my-1 h-px bg-border" />

      <button
        className={cn(itemClass, isSigningOut && "opacity-60")}
        disabled={isSigningOut}
        onClick={handleSignOut}
        type="button"
      >
        <Icons.logOut aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">{menu.signOut}</span>
      </button>
    </div>
  );
}
