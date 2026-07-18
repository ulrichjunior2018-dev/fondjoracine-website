"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { startIdentityProvider } from "@/features/account/lib/auth-client";
import { getDictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/lib/i18n-context";
import { listSocialIdentityProviders } from "@/lib/identity/registry";
import type { IdentityProviderId } from "@/lib/identity/types";

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
