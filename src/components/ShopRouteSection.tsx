"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { MotionCard, MotionDiamond, MotionInView } from "@/components/motion/living-motion";
import { catalogProducts } from "@/content/products";
import { useCopy, useI18n } from "@/lib/i18n-context";
import { pickLocale } from "@/lib/locale";

const eyebrowClass = "text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]";
const soonBadgeClass =
  "inline-flex items-center rounded-full border border-[#B8935A]/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B8935A]";

export function ShopRouteSection() {
  const copy = useCopy();
  const { locale } = useI18n();
  const shop = copy.home.shop;

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <MotionInView>
          <p className={eyebrowClass}>{shop.eyebrow}</p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-light leading-tight sm:text-7xl">
            {shop.title}
          </h1>
          <MotionDiamond className="mt-6" />
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#F5EFE3]/68">{shop.intro}</p>
        </MotionInView>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalogProducts.map((product, index) => {
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
            const available = product.status === "available";

            const card = (
              <>
                {/* Image stays free of hover transforms on the card shell — mobile fill safety */}
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <Image
                    alt={imageAlt}
                    className="object-cover md:transition-transform md:duration-500 md:group-hover:scale-[1.03]"
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    src={product.image}
                  />
                  {!available ? (
                    <span className={`absolute left-4 top-4 ${soonBadgeClass} bg-[#0B0B0B]/70`}>
                      {shop.soon}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-serif text-2xl font-light leading-snug">{name}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#F5EFE3]/66">{tagline}</p>
                  <div className="mt-auto flex items-center justify-between pt-6">
                    <p className="font-mono text-lg text-[#B8935A]">{product.priceXaf}</p>
                    {available ? (
                      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#B8935A]">
                        {shop.viewProduct}
                        <ArrowRight
                          className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    ) : (
                      <span className={soonBadgeClass}>{shop.soon}</span>
                    )}
                  </div>
                </div>
              </>
            );

            if (!available) {
              return (
                <MotionInView delay={index * 0.06} key={product.slug}>
                  <div className="flex flex-col border border-[#B8935A]/16 bg-white/[0.02] opacity-70">
                    {card}
                  </div>
                </MotionInView>
              );
            }

            return (
              <MotionInView delay={index * 0.06} key={product.slug}>
                <a
                  className="group flex flex-col border border-[#B8935A]/16 bg-white/[0.025] transition duration-300 hover:border-[#B8935A]/45 hover:bg-[#B8935A]/[0.045]"
                  href={product.href}
                >
                  {card}
                </a>
              </MotionInView>
            );
          })}

          <MotionCard
            className="flex min-h-[22rem] flex-col justify-center border border-dashed border-[#B8935A]/22 bg-white/[0.012] p-6"
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
