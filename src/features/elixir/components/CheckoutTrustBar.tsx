"use client";

import { BadgeCheck, LockKeyhole, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getDictionary } from "@/i18n/dictionaries";
import { config } from "@/lib/config";
import { useI18n } from "@/lib/i18n-context";
import { resolveShippingZone } from "@/lib/shipping/registry";
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

function getShippingEstimate(countryCode: string | null, locale: "en" | "fr", feesNotice: string) {
  const zone = resolveShippingZone(countryCode);
  const policy = locale === "fr" ? config.delivery.policy.fr : config.delivery.policy.en;

  if (zone.id === "cameroon") {
    return {
      estimate:
        locale === "fr"
          ? "Livraison locale : 1 000 F depuis Buea. Autres régions confirmées sur WhatsApp."
          : "Local delivery: 1,000 FCFA from Buea. Other regions confirmed on WhatsApp.",
      isCameroon: true,
      notice: `${policy}. ${feesNotice}`,
    };
  }

  return {
    estimate: locale === "fr" ? zone.blurbFr : zone.blurbEn,
    isCameroon: false,
    notice: locale === "fr" ? zone.blurbFr : zone.blurbEn,
  };
}

function useGeoLocation(yourZone: string): GeoState {
  const [geo, setGeo] = useState<GeoState>({
    countryCode: null,
    countryName: yourZone,
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
          countryName: data.country_name || yourZone,
          status: "ready",
        });
      } catch {
        setGeo({
          countryCode: null,
          countryName: yourZone,
          status: "fallback",
        });
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void detectCountry();

    return () => {
      controller.abort();
    };
  }, [yourZone]);

  return geo;
}

export function CheckoutTrustBar({
  className,
  compact = false,
  whatsappUrl,
}: CheckoutTrustBarProps) {
  const { locale } = useI18n();
  const c = getDictionary(locale).checkoutTrust;
  const geo = useGeoLocation(c.yourZone);
  const shipping = useMemo(
    () => getShippingEstimate(geo.countryCode, locale, c.feesNotice),
    [geo.countryCode, locale, c.feesNotice],
  );

  return (
    <aside
      aria-label={c.ariaLabel}
      className={cn(
        "rounded-md border border-[#B8935A]/18 bg-[#0b0906]/88 p-3 text-[#F5EFE3] shadow-[0_18px_70px_rgb(0_0_0/.22)] backdrop-blur-xl",
        compact ? "sm:p-3" : "sm:p-4",
        className,
      )}
    >
      <div className="grid gap-3 md:grid-cols-[1.15fr_.85fr] md:items-start">
        <div className="grid gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-[#B8935A]/28 bg-[#B8935A]/10 text-[#B8935A]">
              <Truck className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#B8935A]">
                {c.estimateLabel}
              </p>
              <p className="mt-1 text-sm leading-6 text-[#F5EFE3]/82">
                {geo.status === "loading" ? c.verifyingZone : shipping.estimate}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#F5EFE3]/58">{shipping.notice}</p>
            </div>
          </div>

          <a
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-[#B8935A]/24 bg-white/[0.04] px-4 text-sm font-semibold text-[#F5EFE3] transition-transform active:scale-[0.98]"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="size-4 text-[#B8935A]" aria-hidden="true" />
            {c.whatsappHelp}
          </a>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            {shipping.isCameroon ? (
              <p className="text-sm leading-6 text-[#F5EFE3]/74">{c.momoAvailable}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#F5EFE3]/68 sm:grid-cols-4 md:grid-cols-2">
            {[
              { icon: LockKeyhole, label: c.badgeSsl },
              { icon: ShieldCheck, label: c.badgeEncrypted },
              { icon: BadgeCheck, label: c.badgeSupport },
            ].map((badge) => (
              <span
                className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-white/10 bg-white/[0.035] px-3"
                key={badge.label}
              >
                <badge.icon className="size-3.5 text-[#B8935A]" aria-hidden="true" />
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
