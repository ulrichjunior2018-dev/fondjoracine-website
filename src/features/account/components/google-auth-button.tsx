"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { isGoogleAuthEnabled, signInWithGoogle } from "@/features/account/lib/auth-client";

type GoogleAuthButtonProps = {
  redirectTo: string;
};

/**
 * Renders nothing unless `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true` (Google OAuth
 * must also be configured in the Supabase dashboard — see `config/env.ts`).
 * Apple sign-in follows the same shape when it's added later.
 */
export function GoogleAuthButton({ redirectTo }: GoogleAuthButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!isGoogleAuthEnabled()) {
    return null;
  }

  async function handleClick() {
    setIsLoading(true);

    try {
      await signInWithGoogle(redirectTo);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Google sign-in failed",
        description: error instanceof Error ? error.message : "Please try again.",
        tone: "danger",
      });
    }
  }

  return (
    <Button
      className="w-full"
      isLoading={isLoading}
      onClick={handleClick}
      type="button"
      variant="secondary"
    >
      Continue with Google
    </Button>
  );
}
