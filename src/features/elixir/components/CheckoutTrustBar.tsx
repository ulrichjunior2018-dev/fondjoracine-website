"use client";

import { Elements, PaymentRequestButtonElement, useStripe } from "@stripe/react-stripe-js";
import type { PaymentRequest } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  BadgeCheck,
  CreditCard,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { fondjoProductPricing } from "@/config/product-pricing";
import { cn } from "@/lib/utils/cn";

type GeoState = {
  countryCode: string | null;
  countryName: string;
  status: "loading" | "ready" | "fallback";
};

type CheckoutTrustBarProps = {
  className?: string;
  compact?: boolean;
  whatsappUrl: string;
};

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const walletPaymentsEnabled = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_REQUEST_ENABLED === "true";
const stripePromise =
  stripePublishableKey && walletPaymentsEnabled ? loadStripe(stripePublishableKey) : null;

function getShippingEstimate(countryCode: string | null) {
  if (countryCode === "CM") {
    return {
      estimate: "Estimated Cameroon delivery: 1-4 business days after dispatch.",
      isCameroon: true,
      notice: "National delivery available across Cameroon.",
    };
  }

  if (countryCode === "US" || countryCode === "CA") {
    return {
      estimate: "Estimated North America shipping: 7-14 business days after dispatch.",
      isCameroon: false,
      notice: "Duties and import taxes may apply at delivery.",
    };
  }

  if (["ES", "FR", "DE", "IT", "NL", "BE", "PT"].includes(countryCode ?? "")) {
    return {
      estimate: "Estimated Europe shipping: 8-16 business days after dispatch.",
      isCameroon: false,
      notice: "Duties and import taxes may apply at delivery.",
    };
  }

  return {
    estimate: "International shipping is available; WhatsApp the team for a precise timeline.",
    isCameroon: false,
    notice: "Duties and import taxes may apply at delivery.",
  };
}

function useGeoLocation(): GeoState {
  const [geo, setGeo] = useState<GeoState>({
    countryCode: null,
    countryName: "your location",
    status: "loading",
  });

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 2200);

    async function detectCountry() {
      try {
        const response = await fetch("https://ipapi.co/json/", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Geolocation unavailable");
        }

        const data = (await response.json()) as {
          country_code?: string;
          country_name?: string;
        };

        setGeo({
          countryCode: data.country_code?.toUpperCase() ?? null,
          countryName: data.country_name || "your location",
          status: "ready",
        });
      } catch {
        setGeo({
          countryCode: null,
          countryName: "your location",
          status: "fallback",
        });
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void detectCountry();

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  return geo;
}

function WalletPaymentRequestButton() {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [walletStatus, setWalletStatus] = useState<"checking" | "available" | "unavailable">(
    "checking",
  );

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const request = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      requestPayerEmail: true,
      requestPayerName: true,
      total: {
        amount: fondjoProductPricing.usdCents,
        label: "FONDJO RACINE SÈVE",
      },
    });

    request.on("paymentmethod", (event) => {
      event.complete("fail");
      window.location.hash = "checkout";
    });

    request
      .canMakePayment()
      .then((result) => {
        if (result) {
          setPaymentRequest(request);
          setWalletStatus("available");
          return;
        }

        setWalletStatus("unavailable");
      })
      .catch(() => setWalletStatus("unavailable"));
  }, [stripe]);

  if (walletStatus !== "available" || !paymentRequest) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-sm">
      <PaymentRequestButtonElement options={{ paymentRequest }} />
    </div>
  );
}

function PaymentRequestSlot() {
  if (!stripePromise) {
    return null;
  }

  return (
    <Elements stripe={stripePromise}>
      <WalletPaymentRequestButton />
    </Elements>
  );
}

export function CheckoutTrustBar({
  className,
  compact = false,
  whatsappUrl,
}: CheckoutTrustBarProps) {
  const geo = useGeoLocation();
  const shipping = useMemo(() => getShippingEstimate(geo.countryCode), [geo.countryCode]);

  return (
    <aside
      aria-label="Checkout trust, shipping, and payment support"
      className={cn(
        "rounded-md border border-[#d6b75b]/18 bg-[#0b0906]/88 p-3 text-[#f6f0e4] shadow-[0_18px_70px_rgb(0_0_0/.22)] backdrop-blur-xl",
        compact ? "sm:p-3" : "sm:p-4",
        className,
      )}
    >
      <div className="grid gap-3 md:grid-cols-[1.15fr_.85fr] md:items-start">
        <div className="grid gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-[#d6b75b]/28 bg-[#d6b75b]/10 text-[#d6b75b]">
              <Truck className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#d6b75b]">
                Shipping estimate
              </p>
              <p className="mt-1 text-sm leading-6 text-[#f6f0e4]/82">
                {geo.status === "loading" ? "Checking your delivery region..." : shipping.estimate}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#f6f0e4]/58">{shipping.notice}</p>
            </div>
          </div>

          <a
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-[#d6b75b]/24 bg-white/[0.04] px-4 text-sm font-semibold text-[#f6f0e4] transition-transform active:scale-[0.98]"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="size-4 text-[#d6b75b]" aria-hidden="true" />
            WhatsApp support
          </a>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <PaymentRequestSlot />
            <p className="text-sm leading-6 text-[#f6f0e4]/74">
              {stripePromise ? "Apple Pay / Google Pay appears here when available, " : ""}
              or pay by card.
            </p>
            {shipping.isCameroon ? (
              <p className="text-sm leading-6 text-[#f6f0e4]/74">
                MTN Mobile Money and Orange Money are available for Cameroon customers.
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#f6f0e4]/68 sm:grid-cols-4 md:grid-cols-2">
            {[
              { icon: LockKeyhole, label: "SSL secure" },
              { icon: CreditCard, label: "Stripe card" },
              { icon: ShieldCheck, label: "Encrypted" },
              { icon: BadgeCheck, label: "Support" },
            ].map((badge) => (
              <span
                className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-white/10 bg-white/[0.035] px-3"
                key={badge.label}
              >
                <badge.icon className="size-3.5 text-[#d6b75b]" aria-hidden="true" />
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
