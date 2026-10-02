"use client";

import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { startIdentityProvider } from "@/features/account/lib/auth-client";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";
import { listSocialIdentityProviders } from "@/lib/identity/registry";
import type { IdentityProviderId } from "@/lib/identity/types";

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="size-[18px]" viewBox="0 0 48 48">
      <path
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
        fill="#EA4335"
      />
      <path
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65Z"
        fill="#4285F4"
      />
      <path
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.97-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19Z"
        fill="#FBBC05"
      />
      <path
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-5.04 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
        fill="#34A853"
      />
    </svg>
  );
}

/** Brand marks for button-rendered providers; text-only when a mark is missing. */
const PROVIDER_MARKS: Partial<Record<IdentityProviderId, ReactNode>> = {
  google: <GoogleMark />,
};

type SocialAuthButtonsProps = {
  /** Path after OAuth callback, e.g. `/account` or `/account/security`. */
  next?: string;
  /** Hide the "or" divider (e.g. Security settings). */
  showDivider?: boolean;
  /**
   * When set, only render this provider (Security row). Omit to render every
   * configured social / alternate method from the identity registry.
   */
  providerId?: IdentityProviderId;
};

/**
 * Renders configured identity providers for any auth surface (login, signup,
 * Security). Pages never hardcode provider names — add/remove in `src/lib/identity`.
 */
export function SocialAuthButtons({
  next = "/account",
  showDivider = true,
  providerId,
}: SocialAuthButtonsProps) {
  const { toast } = useToast();
  const { locale } = useI18n();
  const auth = getDictionary(locale).auth;
  const [loadingId, setLoadingId] = useState<IdentityProviderId | null>(null);

  const providers = listSocialIdentityProviders().filter((provider) =>
    providerId ? provider.id === providerId : true,
  );

  if (providers.length === 0) {
    return null;
  }

  async function handleClick(id: IdentityProviderId) {
    setLoadingId(id);

    try {
      await startIdentityProvider(id, next);
    } catch (error) {
      setLoadingId(null);
      toast({
        title: auth.signInFailed,
        description: error instanceof Error ? error.message : auth.tryAgain,
        tone: "danger",
      });
    }
  }

  return (
    <div className="grid gap-3">
      {showDivider ? (
        <div className="relative flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground/45">
            {auth.orDivider}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
      ) : null}
      {providers.map((provider) => (
        <Button
          className="w-full"
          isLoading={loadingId === provider.id}
          key={provider.id}
          {...(PROVIDER_MARKS[provider.id] ? { leadingIcon: PROVIDER_MARKS[provider.id] } : {})}
          onClick={() => void handleClick(provider.id)}
          type="button"
          variant="secondary"
        >
          {provider.label}
        </Button>
      ))}
    </div>
  );
}
