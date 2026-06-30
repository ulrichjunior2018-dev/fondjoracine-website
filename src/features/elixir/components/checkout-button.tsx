"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type CheckoutButtonProps = {
  label: string;
  locale: "en" | "fr";
};

export function CheckoutButton({ label, locale }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        body: JSON.stringify({ locale, quantity: 1 }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as {
        data?: { url: string };
        error?: { message: string };
      };

      if (!response.ok || !payload.data?.url) {
        throw new Error(payload.error?.message ?? "Checkout is unavailable.");
      }

      window.location.assign(payload.data.url);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout is temporarily unavailable. Please order on WhatsApp.",
      );
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Button
        className="w-full"
        disabled={isLoading}
        leadingIcon={
          isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )
        }
        onClick={handleCheckout}
        size="lg"
      >
        {label}
      </Button>
      {error ? (
        <p
          className="mt-3 rounded-md bg-destructive-muted px-3 py-2 text-sm leading-6 text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
