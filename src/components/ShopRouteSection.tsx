"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { MotionCard, MotionDiamond, MotionInView } from "@/components/motion/living-motion";
import { catalogProducts, type CatalogProduct } from "@/content/products";
import { useCopy, useI18n } from "@/lib/i18n-context";
import { pickLocale } from "@/lib/locale";
import { cn } from "@/lib/utils/cn";

const eyebrowClass = "text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]";
const soonBadgeClass =
  "inline-flex items-center rounded-sm border border-[#B8935A]/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B8935A]";

function ProductCatalogCard({
  product,
  index,
  soonLabel,
  viewLabel,
}: {
  product: CatalogProduct;
  index: number;
  soonLabel: string;
  viewLabel: string;
}) {
  const { locale } = useI18n();
  const available = product.status === "available";
  const name = pickLocale(locale, { english: product.name.en, french: product.name.fr });
  const tagline = pickLocale(locale, {
    english: product.tagline.en,
    french: product.tagline.fr,
  });
  const imageAlt = pickLocale(locale, {
    english: product.imageAlt.en,
    french: product.imageAlt.fr,
  });

  const body = (
    <>
      <div
        className={cn(
          "relative overflow-hidden bg-black",
          available ? "aspect-[4/5]" : "mx-auto mt-5 aspect-[4/5] w-[min(100%,14rem)] sm:w-[16rem]",
        )}
      >
        <Image
          alt={imageAlt}
          className={cn(
            "object-cover",
            available && "md:transition-transform md:duration-500 md:group-hover:scale-[1.03]",
            !available && "scale-105 blur-md brightness-[0.75] saturate-75",
          )}
          fill
          priority={index < 3}
          sizes={
            available
              ? "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              : "(min-width: 640px) 16rem, 14rem"
          }
          src={product.image}
        />
        {!available ? (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/35 via-transparent to-transparent"
            />
            <span className={`absolute left-3 top-3 ${soonBadgeClass} bg-[#0B0B0B]/70`}>
              {soonLabel}
            </span>
          </>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="font-serif text-2xl font-light leading-snug text-[#F5EFE3]">{name}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#F5EFE3]/66">{tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          {product.priceXaf ? (
            <p className="font-mono text-lg text-[#B8935A]">{product.priceXaf}</p>
          ) : (
            <span className={soonBadgeClass}>{soonLabel}</span>
          )}
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#B8935A]">
            {viewLabel}
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </>
  );

  return (
    <MotionInView delay={Math.min(index, 8) * 0.04}>
      <Link
        className={cn(
          "group flex h-full flex-col border border-[#B8935A]/16 transition duration-300",
          available
            ? "bg-white/[0.025] hover:border-[#B8935A]/45 hover:bg-[#B8935A]/[0.045]"
            : "bg-white/[0.02] hover:border-[#B8935A]/35",
        )}
        href={product.href as Route}
      >
        {body}
      </Link>
    </MotionInView>
  );
}

/**
 * Scalable shop catalog: intro + responsive product grid.
 * Add products in `src/content/products.ts` — this page grows with the collection.
 */
export function ShopRouteSection() {
  const copy = useCopy();
  const shop = copy.home.shop;

  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <MotionInView className="max-w-3xl">
          <p className={eyebrowClass}>{shop.eyebrow}</p>
          <h1 className="mt-5 font-serif text-4xl font-light leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {shop.title}
          </h1>
          <MotionDiamond className="mt-5" />
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#F5EFE3]/68 sm:text-lg sm:leading-8">
            {shop.intro}
          </p>
        </MotionInView>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {catalogProducts.map((product, index) => (
            <ProductCatalogCard
              index={index}
              key={product.slug}
              product={product}
              soonLabel={shop.soon}
              viewLabel={shop.viewProduct}
            />
          ))}

          <MotionCard
            className="flex min-h-[18rem] flex-col justify-center border border-dashed border-[#B8935A]/22 bg-white/[0.012] p-6 sm:min-h-0"
            lift
          >
            <span className={soonBadgeClass}>{shop.soon}</span>
            <h2 className="mt-5 font-serif text-2xl font-light leading-snug text-[#F5EFE3]/80">
              {shop.comingSoonTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#F5EFE3]/56">{shop.comingSoonBody}</p>
          </MotionCard>
        </div>
      </div>
    </section>
  );
}
