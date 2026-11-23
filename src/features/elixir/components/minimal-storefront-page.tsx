"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { MarketingMobileMenu } from "@/components/marketing-mobile-menu";
import { NavAuthButton } from "@/components/nav-auth-button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { t } from "@/features/elixir/data/content";
import {
  buildWaLink,
  config,
  formatXaf,
  getSeveRacinePriceXaf,
  SEVE_RACINE_SIZES,
  type SeveRacineSize,
} from "@/lib/config";
import { useI18n } from "@/lib/i18n-context";
import {
  getMarketingDesktopNav,
  getMarketingMobileNav,
  isMarketingNavActive,
} from "@/lib/marketing-nav";
import { siteImages } from "@/lib/site-images";
import { cn } from "@/lib/utils/cn";

/**
 * Minimalist homepage. One idea per screen, ivory and ink, gold only for
 * small labels. Content comes from the existing dictionaries/CMS wherever it
 * already exists; prices and delivery always come from `config`.
 */

type MinimalStorefrontPageProps = {
  content: ElixirContent;
  locale: Locale;
};

type Translate = (en: string, fr: string) => string;

/** Small mono label with a section number — the page's quiet signature. */
function SectionLabel({
  children,
  index,
  tone = "light",
}: {
  children: React.ReactNode;
  index: string;
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={cn(
        "font-mono text-[0.68rem] uppercase tracking-[0.28em]",
        tone === "light" ? "text-[#7b622d]" : "text-[#B8935A]",
      )}
    >
      {index} — {children}
    </p>
  );
}

function sizeName(size: SeveRacineSize, tr: Translate) {
  return size === "100ml" ? "100 ml" : tr("50 ml · Travel size", "50 ml · Format voyage");
}

function MinimalHeader({ locale }: { locale: Locale }) {
  const { copy: localizedCopy } = useI18n();
  const copy = localizedCopy.home;
  const pathname = usePathname();
  const desktopNav = getMarketingDesktopNav(copy.nav);
  const mobileNav = getMarketingMobileNav(copy.nav);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0B0B0B]/92 text-[#F5EFE3] backdrop-blur-md"
      key={locale}
    >
      <Container className="flex h-14 items-center justify-between gap-4 sm:h-16">
        <Link aria-label="Maison Fondjo home" href="/">
          <span className="font-serif text-[0.8rem] uppercase tracking-[0.34em] sm:text-sm">
            Maison Fondjo
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#F5EFE3]/60 lg:flex notranslate"
          translate="no"
        >
          {desktopNav.map(([label, href]) => {
            const active = isMarketingNavActive(pathname, href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  "pb-1 transition-colors duration-150 hover:text-[#F5EFE3]",
                  active && "text-[#F5EFE3]",
                )}
                href={href as Route}
                key={href}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            className="inline-flex h-9 items-center justify-center rounded-sm bg-[#F5EFE3] px-4 text-xs font-semibold text-[#0B0B0B] transition-transform duration-100 active:scale-[0.97]"
            href={"/shop" as Route}
          >
            {copy.buy}
          </Link>
          <NavAuthButton />
          <MarketingMobileMenu
            closeLabel={copy.navigationClose}
            links={mobileNav}
            openLabel={copy.navigationOpen}
          />
        </div>
      </Container>
    </header>
  );
}

function PrimaryLink({
  children,
  href,
  tone = "light",
}: {
  children: React.ReactNode;
  href: Route;
  tone?: "light" | "dark";
}) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-7 text-sm font-semibold transition-transform duration-100 active:scale-[0.97]",
        tone === "light" ? "bg-[#0B0B0B] text-[#F7F4EC]" : "bg-[#F5EFE3] text-[#0B0B0B]",
      )}
      href={href}
    >
      {children}
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  );
}

function SecondaryAnchor({
  children,
  href,
  tone = "light",
}: {
  children: React.ReactNode;
  href: string;
  tone?: "light" | "dark";
}) {
  return (
    <a
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-sm border px-7 text-sm font-semibold transition-colors duration-150",
        tone === "light"
          ? "border-[#0B0B0B]/25 text-[#0B0B0B] hover:border-[#0B0B0B]"
          : "border-[#F5EFE3]/30 text-[#F5EFE3] hover:border-[#F5EFE3]",
      )}
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

function Hero({ tr, locale }: { tr: Translate; locale: Locale }) {
  const p100 = getSeveRacinePriceXaf("100ml");
  const p50 = getSeveRacinePriceXaf("50ml");
  const waHref = buildWaLink("order", `100 ml · ${formatXaf(p100)}`, locale);

  return (
    <section className="bg-[#F7F4EC] pt-14 sm:pt-16" id="hero">
      <Container className="grid gap-10 pb-16 pt-10 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-0 lg:pt-0">
        <ScrollReveal className="lg:py-24">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[#7b622d]">
            Buea, Cameroon · 4.15° N, 9.24° E
          </p>
          <h1 className="mt-6 font-serif text-[clamp(3.6rem,13vw,9.5rem)] font-light leading-[0.84] tracking-[-0.02em] text-[#0B0B0B]">
            Sève
            <br />
            Racine
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-[#0B0B0B]/68">
            {tr(
              "A botanical treatment for scalp and hair. Born in Buea, Cameroon.",
              "Un soin botanique pour le cuir chevelu et les cheveux. Né à Buea, au Cameroun.",
            )}
          </p>

          <p className="mt-8 font-mono text-sm tracking-wide text-[#0B0B0B]">
            100 ml — {formatXaf(p100)}
            <span className="mx-3 text-[#0B0B0B]/30">/</span>
            50 ml — {formatXaf(p50)}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryLink href={"/checkout?size=100ml" as Route}>
              {tr("Order Sève Racine", "Commander Sève Racine")}
            </PrimaryLink>
            <SecondaryAnchor href={waHref}>
              {tr("Order on WhatsApp", "Commander sur WhatsApp")}
            </SecondaryAnchor>
          </div>
        </ScrollReveal>

        {/* Image sits outside the reveal wrapper so it paints immediately (LCP). */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#E4D2B4] lg:aspect-[4/5] lg:max-h-[calc(100svh-8rem)] lg:justify-self-end">
          <Image
            alt={tr(
              "Sève Racine botanical hair treatment bottle on stone, with olive branches",
              "Flacon Sève Racine, soin capillaire botanique, posé sur une pierre avec des branches d'olivier",
            )}
            className="object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            src={siteImages.studioBottle}
          />
        </div>
      </Container>
    </section>
  );
}

function Statement({ tr }: { tr: Translate }) {
  const points = [
    tr("Nourishes the scalp", "Nourrit le cuir chevelu"),
    tr("Supports stronger-feeling hair", "Soutient des cheveux qui se sentent plus forts"),
    tr("Softens dry, brittle lengths", "Assouplit les longueurs sèches et cassantes"),
  ];

  return (
    <section className="border-t border-[#0B0B0B]/10 bg-[#F7F4EC] py-24 sm:py-32">
      <Container>
        <ScrollReveal>
          <SectionLabel index="01">{tr("Scalp first", "Le cuir chevelu d'abord")}</SectionLabel>
          <h2 className="mt-8 max-w-5xl font-serif text-[clamp(2.4rem,6.5vw,5.6rem)] font-light leading-[0.98] tracking-[-0.015em] text-[#0B0B0B]">
            {tr(
              "Your hair does not begin at the ends. It begins at the scalp.",
              "Vos cheveux ne commencent pas aux pointes. Ils commencent au cuir chevelu.",
            )}
          </h2>
          <p className="mt-8 max-w-xl text-base leading-7 text-[#0B0B0B]/68">
            {tr(
              "Sève Racine is made for the scalp first: a few drops, massaged at the root, as part of a regular ritual.",
              "Sève Racine est pensé d'abord pour le cuir chevelu : quelques gouttes, massées à la racine, dans un rituel régulier.",
            )}
          </p>
        </ScrollReveal>

        <ul className="mt-16 grid border-t border-[#0B0B0B]/12 md:grid-cols-3">
          {points.map((point, index) => (
            <li
              className="flex items-baseline gap-4 border-b border-[#0B0B0B]/12 py-6 md:border-b-0 md:border-r md:py-8 md:pr-8 md:last:border-r-0 md:[&:not(:first-child)]:pl-8"
              key={point}
            >
              <span className="font-mono text-xs text-[#7b622d]">0{index + 1}</span>
              <span className="text-sm font-medium leading-6 text-[#0B0B0B]">{point}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Product({
  tr,
  locale,
  copy,
}: {
  tr: Translate;
  locale: Locale;
  copy: ReturnType<typeof useI18n>["copy"]["home"];
}) {
  const [size, setSize] = useState<SeveRacineSize>("100ml");
  const price = getSeveRacinePriceXaf(size);
  const waHref = buildWaLink("order", `${size.replace("ml", " ml")} · ${formatXaf(price)}`, locale);

  const rows: Array<[string, string]> = [
    [
      tr("Delivery", "Livraison"),
      tr(
        `Local delivery ${formatXaf(config.delivery.min)}. Other regions confirmed on WhatsApp.`,
        `Livraison locale ${formatXaf(config.delivery.min)}. Autres régions confirmées sur WhatsApp.`,
      ),
    ],
    [tr("Payment", "Paiement"), "MTN Mobile Money · Orange Money"],
    [
      tr("Batch", "Lot"),
      tr("Founder Batch — 150 numbered bottles", "Lot Fondateur — 150 flacons numérotés"),
    ],
  ];

  return (
    <section
      className="border-t border-[#0B0B0B]/10 bg-[#F7F4EC] py-24 sm:py-32"
      data-section="product"
      id="product"
    >
      <Container className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-24">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#E4D2B4]">
          <Image
            alt={copy.mediaAlts.product}
            className="object-cover"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 40vw, 100vw"
            src={siteImages.productOutdoorAlt}
          />
        </div>

        <ScrollReveal>
          <SectionLabel index="02">{tr("The product", "Le produit")}</SectionLabel>
          <h2 className="mt-6 font-serif text-[clamp(2.8rem,7vw,5.5rem)] font-light leading-[0.92] tracking-[-0.015em] text-[#0B0B0B]">
            Sève Racine
          </h2>
          <p className="mt-3 font-serif text-lg italic text-[#0B0B0B]/55">
            {tr("Sève — essence. Racine — root.", "Sève — l'essence. Racine — la racine.")}
          </p>
          <p className="mt-8 max-w-lg text-base leading-7 text-[#0B0B0B]/68">{copy.productText}</p>

          <div className="mt-10" role="group" aria-label={tr("Choose a size", "Choisir un format")}>
            <div className="grid grid-cols-2 gap-3">
              {SEVE_RACINE_SIZES.map((option) => {
                const active = option === size;

                return (
                  <button
                    aria-pressed={active}
                    className={cn(
                      "rounded-sm border px-4 py-4 text-left transition-colors duration-150",
                      active
                        ? "border-[#0B0B0B] bg-[#0B0B0B] text-[#F7F4EC]"
                        : "border-[#0B0B0B]/20 text-[#0B0B0B] hover:border-[#0B0B0B]/60",
                    )}
                    key={option}
                    onClick={() => setSize(option)}
                    type="button"
                  >
                    <span className="block text-xs uppercase tracking-[0.16em] opacity-70">
                      {sizeName(option, tr)}
                    </span>
                    <span className="mt-2 block font-mono text-lg">
                      {formatXaf(getSeveRacinePriceXaf(option))}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <PrimaryLink href={`/checkout?size=${size}` as Route}>
              {tr("Order Sève Racine", "Commander Sève Racine")}
            </PrimaryLink>
            <SecondaryAnchor href={waHref}>
              {tr("Order on WhatsApp", "Commander sur WhatsApp")}
            </SecondaryAnchor>
          </div>

          <dl className="mt-12 border-t border-[#0B0B0B]/12">
            {rows.map(([label, value]) => (
              <div
                className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-[#0B0B0B]/12 py-4 text-sm"
                key={label}
              >
                <dt className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-[#7b622d]">
                  {label}
                </dt>
                <dd className="leading-6 text-[#0B0B0B]/80">{value}</dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>
      </Container>
    </section>
  );
}

function Ritual({ tr, copy }: { tr: Translate; copy: ReturnType<typeof useI18n>["copy"]["home"] }) {
  return (
    <section className="bg-[#0B0B0B] py-24 text-[#F5EFE3] sm:py-32" id="ritual">
      <Container className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <ScrollReveal>
          <SectionLabel index="03" tone="dark">
            {copy.ritual}
          </SectionLabel>
          <h2 className="mt-6 font-serif text-[clamp(2.4rem,5.5vw,4.4rem)] font-light leading-[1] tracking-[-0.015em]">
            {copy.ritualTitle}
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-[#F5EFE3]/62">{copy.ritualBody}</p>
          <Link
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#F5EFE3] underline decoration-[#F5EFE3]/30 underline-offset-8 transition-colors hover:decoration-[#F5EFE3]"
            href={"/diagnostic" as Route}
          >
            {tr("Not sure? Take the hair diagnostic", "Un doute ? Faites le diagnostic capillaire")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </ScrollReveal>

        <ol className="border-t border-white/12">
          {copy.ritualSteps.map((step, index) => {
            const [title, ...rest] = step.split(" — ");

            return (
              <li
                className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/12 py-7 sm:grid-cols-[4rem_1fr]"
                key={step}
              >
                <span className="font-mono text-xs text-[#B8935A]">0{index + 1}</span>
                <div>
                  <p className="font-serif text-2xl font-light">{title}</p>
                  {rest.length > 0 ? (
                    <p className="mt-2 text-sm leading-6 text-[#F5EFE3]/62">{rest.join(" — ")}</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

function Customers({
  tr,
  copy,
}: {
  tr: Translate;
  copy: ReturnType<typeof useI18n>["copy"]["home"];
}) {
  const tt = copy.testimonials;

  return (
    <section className="bg-[#F7F4EC] py-24 sm:py-32" id="testimonials">
      <Container>
        <ScrollReveal className="max-w-2xl">
          <SectionLabel index="04">{tt.eyebrow}</SectionLabel>
          <h2 className="mt-6 font-serif text-[clamp(2.4rem,5.5vw,4.4rem)] font-light leading-[1] tracking-[-0.015em] text-[#0B0B0B]">
            {tt.title}
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-x-12 gap-y-14 lg:grid-cols-3">
          {tt.items.map((item, index) => (
            <figure className="border-t border-[#0B0B0B]/15 pt-6" key={item.name}>
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.22em] text-[#7b622d]">
                {String(index + 1).padStart(3, "0")}
              </p>
              <blockquote className="mt-5 font-serif text-xl font-light italic leading-8 text-[#0B0B0B]/88">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0B0B0B]/70">
                {item.name}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-20 grid max-w-md grid-cols-2 gap-4">
          {[
            { src: siteImages.ritualBefore, label: tt.beforeLabel },
            { src: siteImages.ritualAfter, label: tt.afterLabel },
          ].map(({ src, label }) => (
            <figure key={label}>
              <div className="relative aspect-[2/3] overflow-hidden bg-[#E4D2B4]">
                <Image
                  alt={label}
                  className="object-cover"
                  fill
                  loading="lazy"
                  sizes="(min-width: 768px) 220px, 45vw"
                  src={src}
                />
              </div>
              <figcaption className="mt-3 font-mono text-[0.66rem] uppercase tracking-[0.22em] text-[#7b622d]">
                {label}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-xs text-[#0B0B0B]/55">
          {tr("Individual results vary.", "Les résultats varient d'une personne à l'autre.")}
        </p>
      </Container>
    </section>
  );
}

function Origin({ copy }: { copy: ReturnType<typeof useI18n>["copy"]["home"] }) {
  return (
    <section className="bg-[#0B0B0B] py-28 text-[#F5EFE3] sm:py-40" id="origin">
      <Container>
        <ScrollReveal>
          <SectionLabel index="05" tone="dark">
            {copy.originEyebrow}
          </SectionLabel>
          <h2 className="mt-8 font-serif text-[clamp(3.6rem,15vw,12rem)] font-light leading-[0.82] tracking-[-0.03em]">
            {copy.originTitle}
          </h2>
          <p className="mt-12 max-w-2xl font-serif text-xl font-light leading-[1.6] text-[#F5EFE3]/76 sm:text-2xl">
            {copy.originBody}
          </p>
        </ScrollReveal>
      </Container>
    </section>
  );
}

function Faq({
  content,
  copy,
  locale,
}: {
  content: ElixirContent;
  copy: ReturnType<typeof useI18n>["copy"]["home"];
  locale: Locale;
}) {
  return (
    <section className="bg-[#F7F4EC] py-24 sm:py-32" id="faq">
      <Container className="max-w-3xl">
        <ScrollReveal>
          <SectionLabel index="06">{copy.faqSection.eyebrow}</SectionLabel>
          <h2 className="mt-6 font-serif text-[clamp(2.4rem,5.5vw,4.4rem)] font-light leading-[1] tracking-[-0.015em] text-[#0B0B0B]">
            {copy.faqSection.title}
          </h2>
        </ScrollReveal>
        <Accordion className="mt-12 border-t border-[#0B0B0B]/15" collapsible type="single">
          {content.faq.items.map((item, index) => (
            <AccordionItem
              className="border-[#0B0B0B]/15"
              key={`${t(item.question, locale)}-${index}`}
              value={`faq-${index}`}
            >
              <AccordionTrigger className="text-[#0B0B0B] hover:text-[#7b622d]">
                {t(item.question, locale)}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-[#0B0B0B]/68">
                {t(item.answer, locale)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}

function Closing({ tr, locale }: { tr: Translate; locale: Locale }) {
  const p100 = getSeveRacinePriceXaf("100ml");
  const waHref = buildWaLink("order", `100 ml · ${formatXaf(p100)}`, locale);

  return (
    <section className="bg-[#0B0B0B] py-28 text-[#F5EFE3] sm:py-40" id="contact">
      <Container>
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-[clamp(2.8rem,8vw,6.5rem)] font-light leading-[0.92] tracking-[-0.02em]">
            {tr("Start with one bottle.", "Commencez par un flacon.")}
          </h2>
          <p className="mt-8 font-mono text-sm tracking-wide text-[#F5EFE3]/70">
            Sève Racine · 100 ml · {formatXaf(p100)}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryLink href={"/checkout?size=100ml" as Route} tone="dark">
              {tr("Order Sève Racine", "Commander Sève Racine")}
            </PrimaryLink>
            <SecondaryAnchor href={waHref} tone="dark">
              {tr("Order on WhatsApp", "Commander sur WhatsApp")}
            </SecondaryAnchor>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}

export function MinimalStorefrontPage({ content }: MinimalStorefrontPageProps) {
  const { copy: localizedCopy, locale } = useI18n();
  const copy = localizedCopy.home;
  const contentLocale: Locale = locale;
  const tr: Translate = (en, fr) => (locale === "fr" ? fr : en);

  return (
    <main className="min-h-screen bg-[#F7F4EC] text-[#0B0B0B] notranslate" translate="no">
      <MinimalHeader locale={contentLocale} />
      <Hero locale={contentLocale} tr={tr} />
      <Statement tr={tr} />
      <Product copy={copy} locale={contentLocale} tr={tr} />
      <Ritual copy={copy} tr={tr} />
      <Customers copy={copy} tr={tr} />
      <Origin copy={copy} />
      <Faq content={content} copy={copy} locale={contentLocale} />
      <Closing locale={contentLocale} tr={tr} />
      <SiteFooter />
    </main>
  );
}
