"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ViewItemTracker } from "@/components/analytics/conversion-trackers";
import { InternalExploreSection } from "@/components/internal-explore-section";
import { MotionCard, MotionDiamond } from "@/components/motion/living-motion";
import type { CatalogProduct } from "@/content/products";
import { buildWhatsAppUrl } from "@/lib/advisor-site";
import { trackWhatsAppClick } from "@/lib/analytics/events";
import { config } from "@/lib/config";
import { useCopy, useI18n } from "@/lib/i18n-context";
import { pickLocale } from "@/lib/locale";

type CatalogProductSectionProps = {
  product: CatalogProduct;
  /** Real FAQ copy, resolved server-side. Only passed for the flagship SKU. */
  faqItems?: Array<{ question: string; answer: string }> | undefined;
};

/**
 * Shared product detail layout for any catalog SKU.
 * Coming soon SKUs keep a sharp title with a soft blurred image tease until the
 * bottle is ready — no padded "full PDP" for products that don't exist yet.
 * The available flagship SKU gets the full editorial structure below.
 */
export function CatalogProductSection({ faqItems, product }: CatalogProductSectionProps) {
  const copy = useCopy();
  const { locale } = useI18n();
  const home = copy.home;
  const whatsappUrl = buildWhatsAppUrl("order", product.priceXaf, locale);
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
  const positioningLine =
    locale === "fr"
      ? "Pour le cuir chevelu sec, la casse et des cheveux qui semblent affaiblis ou difficiles à garder."
      : "For dry scalp, breakage and hair that feels weakened or difficult to retain.";
  const trustLine =
    locale === "fr"
      ? "Livraison nationale au Cameroun · Paiement Mobile Money · Assistance WhatsApp"
      : "Nationwide Cameroon delivery · Mobile Money payment · WhatsApp assistance";
  const priceAmount = Number.parseInt(product.priceXaf.replace(/[^\d]/g, ""), 10);

  return (
    <>
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <ViewItemTracker
          itemId={product.slug}
          itemName={name}
          {...(Number.isFinite(priceAmount) ? { price: priceAmount, currency: "XAF" } : {})}
        />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div
            className={
              available
                ? "mx-auto w-full max-w-xl lg:order-2"
                : "mx-auto w-full max-w-sm lg:order-2"
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
                    {home.shop.soon}
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
            {available ? (
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#F5EFE3]/58">{positioningLine}</p>
            ) : null}

            {product.priceXaf ? (
              <p className="mt-7 font-mono text-2xl text-[#B8935A]">{product.priceXaf}</p>
            ) : (
              <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-[#B8935A]">
                {home.shop.soon}
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
                onClick={() => trackWhatsAppClick(`product:${product.slug}`)}
                rel="noreferrer"
                target="_blank"
              >
                {locale === "fr" ? "Commander sur WhatsApp" : "Order on WhatsApp"}
              </a>
              <Link
                className="inline-flex min-h-13 items-center justify-center px-2 text-sm font-semibold text-[#B8935A] transition hover:text-[#F5EFE3]"
                href={"/shop" as Route}
              >
                {backLabel}
              </Link>
            </div>

            {available ? (
              <p className="mt-6 border-t border-[#B8935A]/14 pt-5 text-xs leading-6 text-[#F5EFE3]/55">
                {trustLine}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {available ? (
        <ProductEditorialSections home={home} locale={locale} faqItems={faqItems} />
      ) : null}

      <InternalExploreSection
        exclude={[product.href, `/products/${product.slug}`]}
        intent="commerce"
      />
    </>
  );
}

type HomeCopy = ReturnType<typeof useCopy>["home"];

/**
 * Sections 01–07 of the flagship product page. Deliberately reuses the same
 * copy keys as the homepage (ritual, concerns, testimonials, origin, Root
 * Standard) rather than forking new text — one voice, one set of facts.
 */
function ProductEditorialSections({
  faqItems,
  home,
  locale,
}: {
  faqItems?: Array<{ question: string; answer: string }> | undefined;
  home: HomeCopy;
  locale: "en" | "fr";
}) {
  const labels = {
    experiences: locale === "fr" ? "Expériences clientes" : "Customer experiences",
    faq: locale === "fr" ? "Questions fréquentes" : "Frequently asked",
    formula: locale === "fr" ? "La formule" : "The formula",
    formulaCta: locale === "fr" ? "Voir l'archive botanique" : "View the botanical archive",
    howToUse: locale === "fr" ? "Mode d'emploi" : "How to use it",
    whatItDoes: locale === "fr" ? "Ce que ça fait" : "What it does",
    delivery: locale === "fr" ? "Livraison et paiement" : "Delivery and payment",
    origin: locale === "fr" ? "Origine" : "Origin",
  };

  return (
    <div className="bg-[#0B0B0B] text-[#F5EFE3]">
      {/* 01 — What it does */}
      <section className="border-t border-[#B8935A]/14 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]">
            01 — {labels.whatItDoes}
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-3xl font-light leading-[1.05] sm:text-4xl">
            {home.concerns.title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#F5EFE3]/62">{home.concerns.body}</p>
          <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-3">
            {home.concerns.items.map(([title, body]) => (
              <div className="border-t border-[#B8935A]/16 pt-5" key={title}>
                <h3 className="font-serif text-xl font-light">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#F5EFE3]/58">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — How to use */}
      <section className="border-t border-[#B8935A]/14 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]">
            02 — {labels.howToUse}
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl font-light leading-[1.05] sm:text-4xl">
            {home.ritualTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#F5EFE3]/62">{home.ritualBody}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {home.ritualSteps.map((step, index) => (
              <MotionCard className="border border-[#B8935A]/16 bg-white/[0.02] p-5" key={step}>
                <span className="font-mono text-xs text-[#B8935A]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 text-sm leading-6 text-[#F5EFE3]/72">{step}</p>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — Formula */}
      <section className="border-t border-[#B8935A]/14 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]">
            03 — {labels.formula}
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl font-light leading-[1.05] sm:text-4xl">
            {home.formulaTitle}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#F5EFE3]/62">{home.formulaBody}</p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center gap-2 border-b border-[#B8935A]/40 text-sm font-semibold text-[#B8935A] transition hover:border-[#B8935A]"
            href={"/botanique" as Route}
          >
            {labels.formulaCta} →
          </Link>
        </div>
      </section>

      {/* 04 — Customer experiences */}
      <section className="border-t border-[#B8935A]/14 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]">
            04 — {labels.experiences}
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl font-light leading-[1.05] sm:text-4xl">
            {home.testimonials.title}
          </h2>
          <div className="mt-10 grid gap-x-8 gap-y-10 lg:grid-cols-3">
            {home.testimonials.items.map((item) => (
              <div className="border-t border-[#B8935A]/20 pt-5" key={item.name}>
                <p className="font-serif text-lg font-light italic leading-7 text-[#F5EFE3]/88">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#F5EFE3]/68">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — Buea / origin */}
      <section className="border-t border-[#B8935A]/14 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs text-[#B8935A]/70">{home.originEyebrow}</p>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl font-light leading-[1.05] sm:text-4xl">
            {home.originTitle}
          </h2>
          <MotionDiamond className="mt-5" />
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#F5EFE3]/62">{home.originBody}</p>
        </div>
      </section>

      {/* 06 — Delivery and payment */}
      <section className="border-t border-[#B8935A]/14 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]">
            06 — {labels.delivery}
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#F5EFE3]/62">
            {pickLocale(locale, {
              english: config.delivery.text.en,
              french: config.delivery.text.fr,
            })}
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-xs uppercase tracking-[0.1em] text-[#F5EFE3]/55">
            <li>
              {pickLocale(locale, {
                english: config.delivery.policy.en,
                french: config.delivery.policy.fr,
              })}
            </li>
            <li>Mobile Money</li>
            <li>{locale === "fr" ? "Assistance WhatsApp" : "WhatsApp assistance"}</li>
          </ul>
        </div>
      </section>

      {/* 07 — FAQ (real content only, omitted if none supplied) */}
      {faqItems && faqItems.length > 0 ? (
        <section className="border-t border-[#B8935A]/14 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]">
              07 — {labels.faq}
            </p>
            <Accordion className="mt-8 border-t border-[#B8935A]/16" collapsible type="single">
              {faqItems.map((item, index) => (
                <AccordionItem
                  className="border-[#B8935A]/16"
                  key={`${item.question}-${index}`}
                  value={`pdp-faq-${index}`}
                >
                  <AccordionTrigger className="text-[#F5EFE3] hover:text-[#B8935A]">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-7 text-[#F5EFE3]/68">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      ) : null}
    </div>
  );
}
