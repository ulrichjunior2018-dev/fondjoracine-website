"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { catalogProducts, type CatalogProduct } from "@/content/products";
import { buildWhatsAppUrl } from "@/lib/advisor-site";
import { useCopy, useI18n } from "@/lib/i18n-context";
import { pickLocale } from "@/lib/locale";

type CatalogProductSectionProps = {
  product: CatalogProduct;
};

/**
 * Shared product detail layout for any catalog SKU.
 * Coming soon SKUs keep sharp titles with a soft blurred image tease until bottles are ready.
 */
export function CatalogProductSection({ product }: CatalogProductSectionProps) {
  const copy = useCopy();
  const { locale } = useI18n();
  const shop = copy.home.shop;
  const whatsappUrl = buildWhatsAppUrl("order", "", locale);
  const available = product.status === "available";

  const name = pickLocale(locale, { english: product.name.en, french: product.name.fr });
  const eyebrow = pickLocale(locale, {
    english: product.eyebrow.en,
    french: product.eyebrow.fr,
  });
  const intro = pickLocale(locale, { english: product.intro.en, french: product.intro.fr });
  const imageAlt = pickLocale(locale, {
    english: product.imageAlt.en,
    french: product.imageAlt.fr,
  });
  const orderLabel = locale === "fr" ? "Commander maintenant" : "Order now";
  const backLabel = locale === "fr" ? "Retour à la boutique" : "Back to shop";
  const comingNextLabel =
    locale === "fr" ? "Bientôt dans la collection" : "Coming next in the collection";

  const comingSoonOthers = catalogProducts.filter(
    (item) => item.status === "coming-soon" && item.slug !== product.slug,
  );

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div
          className={
            available ? "mx-auto w-full max-w-xl lg:order-2" : "mx-auto w-full max-w-sm lg:order-2"
          }
        >
          <div className="relative aspect-[4/5] overflow-hidden border border-[#B8935A]/16 bg-black">
            <Image
              alt={imageAlt}
              className={
                available
                  ? "object-cover"
                  : "scale-105 object-cover blur-md brightness-[0.75] saturate-75"
              }
              fill
              priority
              sizes={
                available ? "(min-width: 1024px) 46vw, 100vw" : "(min-width: 1024px) 24rem, 20rem"
              }
              src={product.image}
            />
            {!available ? (
              <>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/35 via-transparent to-transparent"
                />
                <span className="absolute left-3 top-3 inline-flex items-center rounded-sm border border-[#B8935A]/30 bg-[#0B0B0B]/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B8935A]">
                  {shop.soon}
                </span>
              </>
            ) : null}
          </div>
        </div>

        <div className="mx-auto max-w-2xl lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]">
            {eyebrow}
          </p>
          <h1 className="mt-6 font-serif text-5xl font-light leading-tight text-[#F5EFE3] sm:text-7xl">
            {name}
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#F5EFE3]/68">{intro}</p>

          {product.priceXaf ? (
            <p className="mt-7 font-mono text-2xl text-[#B8935A]">{product.priceXaf}</p>
          ) : (
            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-[#B8935A]">
              {shop.soon}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {available && product.orderHref ? (
              <Link
                className="inline-flex min-h-13 items-center justify-center rounded-sm bg-[#B8935A] px-7 text-sm font-semibold text-[#0B0B0B] transition-transform duration-100 hover:-translate-y-0.5 active:scale-[0.98]"
                href={product.orderHref as Route}
              >
                {orderLabel}
              </Link>
            ) : null}
            <a
              className="inline-flex min-h-13 items-center justify-center rounded-sm border border-[#B8935A]/35 px-7 text-sm font-semibold text-[#F5EFE3] transition hover:border-[#B8935A]"
              href={whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              WhatsApp
            </a>
            <Link
              className="inline-flex min-h-13 items-center justify-center px-2 text-sm font-semibold text-[#B8935A] transition hover:text-[#F5EFE3]"
              href={"/shop" as Route}
            >
              {backLabel}
            </Link>
          </div>
        </div>
      </div>

      {available && comingSoonOthers.length > 0 ? (
        <div className="mx-auto mt-16 max-w-7xl border-t border-[#B8935A]/14 pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]">
            {comingNextLabel}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comingSoonOthers.map((item) => {
              const itemName = pickLocale(locale, {
                english: item.name.en,
                french: item.name.fr,
              });
              const itemAlt = pickLocale(locale, {
                english: item.imageAlt.en,
                french: item.imageAlt.fr,
              });

              return (
                <Link
                  className="group border border-[#B8935A]/16 bg-white/[0.02] transition hover:border-[#B8935A]/35"
                  href={item.href as Route}
                  key={item.slug}
                >
                  <div className="relative mx-auto aspect-[4/5] w-full max-w-[12rem] overflow-hidden bg-black sm:max-w-[14rem]">
                    <Image
                      alt={itemAlt}
                      className="scale-105 object-cover blur-md brightness-[0.75] saturate-75"
                      fill
                      sizes="14rem"
                      src={item.image}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/35 via-transparent to-transparent"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center rounded-sm border border-[#B8935A]/30 bg-[#0B0B0B]/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B8935A]">
                      {shop.soon}
                    </span>
                  </div>
                  <div className="p-4">
                    <h2 className="font-serif text-xl font-light text-[#F5EFE3]">{itemName}</h2>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
