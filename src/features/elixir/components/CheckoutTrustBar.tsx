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
import { config, formatXaf } from "@/lib/config";
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
  const deliveryRange = `${formatXaf(config.delivery.min)}–${formatXaf(config.delivery.max)}`;

  if (countryCode === "CM") {
    return {
      estimate: `Livraison Cameroun : zones ${deliveryRange}, délai confirmé avant paiement.`,
      isCameroon: true,
      notice: config.delivery.policy,
    };
  }

  if (countryCode === "US" || countryCode === "CA") {
    return {
      estimate: `Livraison disponible au Cameroun : zones ${deliveryRange}.`,
      isCameroon: false,
      notice: "Contactez WhatsApp si vous commandez pour une adresse au Cameroun.",
    };
  }

  if (["ES", "FR", "DE", "IT", "NL", "BE", "PT"].includes(countryCode ?? "")) {
    return {
      estimate: `Livraison disponible au Cameroun : zones ${deliveryRange}.`,
      isCameroon: false,
      notice: "Contactez WhatsApp si vous commandez pour une adresse au Cameroun.",
    };
  }

  return {
    estimate: `Livraison disponible au Cameroun : zones ${deliveryRange}.`,
    isCameroon: false,
    notice: "L'équipe confirme la ville, le quartier et les frais avant paiement.",
  };
}

function useGeoLocation(): GeoState {
  const [geo, setGeo] = useState<GeoState>({
    countryCode: null,
    countryName: "votre zone",
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
          countryName: data.country_name || "votre zone",
          status: "ready",
        });
      } catch {
        setGeo({
          countryCode: null,
          countryName: "votre zone",
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
        label: "Sève Racine",
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
      aria-label="Confiance paiement, livraison et assistance"
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
                Estimation livraison
              </p>
              <p className="mt-1 text-sm leading-6 text-[#f6f0e4]/82">
                {geo.status === "loading"
                  ? "Verification de votre zone de livraison..."
                  : shipping.estimate}
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
            Assistance WhatsApp
          </a>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <PaymentRequestSlot />
            <p className="text-sm leading-6 text-[#f6f0e4]/74">
              {stripePromise ? "Apple Pay / Google Pay apparait ici si disponible, " : ""}
              ou paiement par carte.
            </p>
            {shipping.isCameroon ? (
              <p className="text-sm leading-6 text-[#f6f0e4]/74">
                MTN Mobile Money et Orange Money sont disponibles au Cameroun.
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#f6f0e4]/68 sm:grid-cols-4 md:grid-cols-2">
            {[
              { icon: LockKeyhole, label: "SSL" },
              { icon: CreditCard, label: "Carte Stripe" },
              { icon: ShieldCheck, label: "Chiffré" },
              { icon: BadgeCheck, label: "Assistance" },
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
