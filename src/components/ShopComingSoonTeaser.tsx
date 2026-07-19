"use client";

import Image from "next/image";

import { MotionCard, MotionInView } from "@/components/motion/living-motion";
import { catalogProducts } from "@/content/products";
import { useCopy, useI18n } from "@/lib/i18n-context";
import { pickLocale } from "@/lib/locale";

const eyebrowClass = "text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]";
const soonBadgeClass =
  "inline-flex items-center rounded-full border border-[#B8935A]/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B8935A]";

/**
 * Renders upcoming catalog entries plus the generic "more to come" teaser card.
 * Used below the live product on `/shop` so the collection still signals growth.
 */
export function ShopComingSoonTeaser() {
  const copy = useCopy();
  const { locale } = useI18n();
  const shop = copy.home.shop;
  const comingSoonProducts = catalogProducts.filter((product) => product.status === "coming-soon");

  return (
    <section className="border-t border-[#B8935A]/14 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <MotionInView>
          <p className={eyebrowClass}>{shop.soon}</p>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl font-light leading-tight sm:text-4xl">
            {shop.comingSoonTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#F5EFE3]/62">
            {shop.comingSoonBody}
          </p>
        </MotionInView>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
          {comingSoonProducts.map((product, index) => {
            const name = pickLocale(locale, {
              english: product.name.en,
              french: product.name.fr,
            });
            const tagline = pickLocale(locale, {
              english: product.tagline.en,
              french: product.tagline.fr,
            });
            const imageAlt = pickLocale(locale, {
              english: product.imageAlt.en,
              french: product.imageAlt.fr,
            });

            return (
              <MotionInView delay={index * 0.06} key={product.slug}>
                <div className="flex flex-col border border-[#B8935A]/16 bg-white/[0.02] opacity-80">
                  <div className="relative aspect-[4/5] overflow-hidden bg-black">
                    <Image
                      alt={imageAlt}
                      className="object-cover"
                      fill
                      sizes="(min-width: 640px) 45vw, 100vw"
                      src={product.image}
                    />
                    <span className={`absolute left-4 top-4 ${soonBadgeClass} bg-[#0B0B0B]/70`}>
                      {shop.soon}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-2xl font-light leading-snug">{name}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#F5EFE3]/66">{tagline}</p>
                    <div className="mt-auto pt-6">
                      <span className={soonBadgeClass}>{shop.soon}</span>
                    </div>
                  </div>
                </div>
              </MotionInView>
            );
          })}

          <MotionCard
            className="flex min-h-[22rem] flex-col justify-center border border-dashed border-[#B8935A]/22 bg-white/[0.012] p-6"
            lift
          >
            <span className={soonBadgeClass}>{shop.soon}</span>
            <h3 className="mt-5 font-serif text-2xl font-light leading-snug text-[#F5EFE3]/80">
              {shop.comingSoonTitle}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#F5EFE3]/56">{shop.comingSoonBody}</p>
          </MotionCard>
        </div>
      </div>
    </section>
  );
}
