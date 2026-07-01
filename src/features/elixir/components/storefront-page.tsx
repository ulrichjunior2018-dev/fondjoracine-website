import {
  ArrowRight,
  Camera,
  Droplets,
  FlaskConical,
  Globe2,
  Leaf,
  LockKeyhole,
  Music2,
  Quote,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { getPrimaryElixirImage, t } from "@/features/elixir/data/content";
import { getWhatsAppUrl } from "@/features/elixir/lib/cms";
import { Reveal } from "@/features/home/components/reveal";

import { GuaranteeSection } from "./guarantee-section";
import { HeroSection } from "./hero-section";
import { ImageCompareSlider } from "./image-compare-slider";
import { TextureGrid } from "./texture-grid";
import { IngredientGallery } from "./ingredient-gallery";
import { LuxuryCard } from "./luxury-card";
import { HairConsultationAgent } from "./hair-consultation-agent";
import { MobileNav } from "./mobile-nav";
import { OrderFlow } from "./order-flow";
import { ProductGallery } from "./product-gallery";
import { WhatsAppCta } from "./whatsapp-cta";

type StorefrontPageProps = {
  content: ElixirContent;
  locale: Locale;
};

const blurDataUrl =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3QgZmlsbD0nIzA4MDcwNicgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PC9zdmc+";

function getCopy(locale: Locale) {
  return {
    before: locale === "fr" ? "Avant" : "Before",
    after: locale === "fr" ? "Apres" : "After",
    language: locale === "fr" ? "English" : "Francais",
    navFaq: locale === "fr" ? "FAQ" : "FAQ",
    navHome: locale === "fr" ? "Accueil" : "Home",
    navDiagnosis: locale === "fr" ? "Diagnostic" : "Diagnosis",
    navHow: locale === "fr" ? "Routine" : "How It Works",
    navInnerCircle: locale === "fr" ? "Rituel botanique" : "Botanical ritual",
    navIngredients: locale === "fr" ? "Ingredients" : "Ingredients",
    navProduct: locale === "fr" ? "L Elixir" : "The Elixir",
    navResults: locale === "fr" ? "Resultats" : "Results",
    order: locale === "fr" ? "Commander" : "Order",
    payment: locale === "fr" ? "Paiement local" : "Local payment",
    video: locale === "fr" ? "Voir la video" : "Watch Video",
  };
}

export function StorefrontPage({ content, locale }: StorefrontPageProps) {
  const copy = getCopy(locale);
  const primaryImage = getPrimaryElixirImage(content);
  const whatsappUrl = getWhatsAppUrl(content, locale);
  const alternateHref = (locale === "fr" ? "/" : "/fr") as Route;
  const isLowStock = content.inventory.stockCount <= content.inventory.lowStockThreshold;
  const navLinks = [
    { href: "#hero", label: copy.navHome },
    { href: "#diagnosis", label: copy.navDiagnosis },
    { href: "#product", label: copy.navProduct },
    { href: "#ingredients", label: copy.navIngredients },
    { href: "#before-after", label: copy.navResults },
    { href: "#how-to-use", label: copy.navHow },
    { href: "#subscription", label: copy.navInnerCircle },
    { href: "#faq", label: copy.navFaq },
  ];
  const heroBadges = [
    {
      icon: <Leaf className="size-6" aria-hidden="true" />,
      label: locale === "fr" ? "Huiles botaniques naturelles" : "Natural botanical oils",
    },
    {
      icon: <FlaskConical className="size-6" aria-hidden="true" />,
      label: locale === "fr" ? "Formule inspiree science" : "Clinically inspired formula",
    },
    {
      icon: <Droplets className="size-6" aria-hidden="true" />,
      label: locale === "fr" ? "Concue pour cheveux africains" : "Made for African hair",
    },
    {
      icon: <Globe2 className="size-6" aria-hidden="true" />,
      label: locale === "fr" ? "Fierement fait au Cameroun" : "Proudly made in Cameroon",
    },
    {
      icon: <ShieldCheck className="size-6" aria-hidden="true" />,
      label: locale === "fr" ? "Usage externe uniquement" : "External use only",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <WhatsAppCta floating href={whatsappUrl} label={t(content.whatsapp.label, locale)} />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#06170c]/92 text-[#FAF7F0] backdrop-blur-xl">
        <Container className="relative flex h-20 items-center justify-between gap-4" size="2xl">
          <Link
            className="inline-flex flex-col text-[#f0c76a]"
            href={(locale === "fr" ? "/fr" : "/") as Route}
          >
            <span className="text-lg font-semibold tracking-[0.18em]">FONDJO</span>
            <span className="text-[0.55rem] font-semibold uppercase tracking-[0.48em] text-[#f0dfb7]/78">
              Racine
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-[#FAF7F0]/76 lg:flex">
            {navLinks.map((link) => (
              <a
                className="border-b border-transparent py-2 transition-colors hover:border-[#d5a72f] hover:text-[#f0dfb7]"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <a
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#f0c76a] px-5 text-sm font-semibold text-[#111611] shadow-[0_14px_30px_rgb(184_134_11/.24)]"
              href="#diagnosis"
            >
              {locale === "fr" ? "Diagnostic" : "Start Diagnosis"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <Link
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/16 bg-white/8 px-3 text-sm font-medium text-[#FAF7F0]"
              href={alternateHref}
            >
              <Globe2 className="h-4 w-4" aria-hidden="true" />
              {copy.language}
            </Link>
          </div>
          <MobileNav
            alternateHref={alternateHref}
            languageLabel={copy.language}
            links={navLinks}
            orderLabel={copy.order}
          />
        </Container>
      </header>

      <HeroSection content={content} locale={locale} />

      {/* z-[2] ensures these sections slide over the sticky hero (z-[1]) as user scrolls */}
      <div className="relative z-[2]">
        {/* TextureGrid: directly below the fold, first thing after the hero */}
        <TextureGrid />

        <section className="border-y border-[#ded3bf] bg-[#FAF7F0]">
          <Container className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-5" size="2xl">
            {heroBadges.map((badge) => (
              <div className="text-center text-[#4c3b16]" key={badge.label}>
                <div className="mx-auto mb-4 grid size-12 place-items-center text-[#8f6b14]">
                  {badge.icon}
                </div>
                <p className="text-sm font-medium leading-6 text-[#1C1C1C]">{badge.label}</p>
              </div>
            ))}
          </Container>
        </section>

        <section
          className="relative overflow-hidden bg-[#06170c] py-16 text-[#FAF7F0] sm:py-24"
          id="diagnosis"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgb(184_134_11/.18),transparent_28%),radial-gradient(circle_at_82%_40%,rgb(46_107_62/.46),transparent_32%)]" />
          <Container className="relative" size="2xl">
            <Reveal className="mb-10 max-w-3xl">
              <Kicker className="text-[#d5a72f]">
                {locale === "fr" ? "Diagnostic gratuit" : "Free hair diagnosis"}
              </Kicker>
              <Heading as="h2" className="mt-3 text-[#FAF7F0]" level="h2">
                {locale === "fr"
                  ? "Une consultation capillaire personnalisee avant votre premier flacon."
                  : "A personalized hair consultation before your first bottle."}
              </Heading>
              <p className="mt-4 text-sm leading-7 text-[#FAF7F0]/72">
                {locale === "fr"
                  ? "Repondez au quiz premium FONDJO, recevez une routine personnalisee, puis envoyez le resume a WhatsApp pour un suivi humain."
                  : "Answer the premium FONDJO quiz, receive a personalized routine, then send the summary to WhatsApp for human follow-up."}
              </p>
            </Reveal>
            <Reveal>
              <HairConsultationAgent locale={locale} />
            </Reveal>
          </Container>
        </section>

        {content.launchAnnouncement.enabled ? (
          <section className="border-b border-border bg-surface py-10">
            <Container>
              <Reveal>
                <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
                  <div>
                    <Badge tone="accent">{t(content.launchAnnouncement.badge, locale)}</Badge>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      {t(content.launchAnnouncement.eyebrow, locale)}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                      {t(content.launchAnnouncement.title, locale)}
                    </h2>
                    {content.launchAnnouncement.intro ? (
                      <p className="mt-4 text-sm leading-6 text-foreground/68">
                        {t(content.launchAnnouncement.intro, locale)}
                      </p>
                    ) : null}
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <a
                        className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-semibold text-background"
                        href={whatsappUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {t(content.launchAnnouncement.cta, locale)}
                      </a>
                      <p className="font-mono text-sm text-accent">
                        {isLowStock
                          ? locale === "fr"
                            ? `${content.inventory.stockCount} flacons restants`
                            : `${content.inventory.stockCount} bottles remaining`
                          : locale === "fr"
                            ? `${content.inventory.stockCount} flacons en stock`
                            : `${content.inventory.stockCount} bottles in stock`}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </Container>
          </section>
        ) : null}

        <section className="bg-background py-16 sm:py-24" id="problem">
          <Container>
            <Reveal className="max-w-3xl">
              <Kicker>{t(content.problem.eyebrow, locale)}</Kicker>
              <Heading as="h2" className="mt-3" level="h2">
                {t(content.problem.title, locale)}
              </Heading>
              {content.problem.intro ? (
                <Text className="mt-4" tone="muted">
                  {t(content.problem.intro, locale)}
                </Text>
              ) : null}
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {content.problem.concerns.map((concern) => (
                <Reveal key={t(concern.label, locale)}>
                  <LuxuryCard
                    eyebrow={locale === "fr" ? "Probleme" : "Concern"}
                    title={t(concern.label, locale)}
                  >
                    {t(concern.text, locale)}
                  </LuxuryCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-surface py-16 sm:py-24" id="product">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <Reveal>
                <ProductGallery content={content} locale={locale} />
              </Reveal>
              <Reveal>
                <Card className="lg:sticky lg:top-24" variant="elevated">
                  <Kicker>{t(content.product.eyebrow, locale)}</Kicker>
                  <Heading as="h2" className="mt-3" level="h2">
                    {t(content.product.title, locale)}
                  </Heading>
                  <p className="mt-4 text-sm leading-6 text-foreground/68">
                    {t(content.product.description, locale)}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-md bg-surface-muted p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        {locale === "fr" ? "Format" : "Size"}
                      </p>
                      <p className="mt-2 font-semibold">{t(content.product.size, locale)}</p>
                    </div>
                    <div className="rounded-md bg-surface-muted p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        {locale === "fr" ? "Prix" : "Price"}
                      </p>
                      <p className="mt-2 font-mono font-semibold">{content.product.priceXaf}</p>
                    </div>
                    <div className="col-span-2 rounded-md bg-surface-muted p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        {locale === "fr" ? "Stock" : "Stock"}
                      </p>
                      <p className="mt-2 font-mono font-semibold">
                        {isLowStock
                          ? locale === "fr"
                            ? `${content.inventory.stockCount} flacons restants`
                            : `${content.inventory.stockCount} bottles remaining`
                          : locale === "fr"
                            ? `${content.inventory.stockCount} flacons disponibles`
                            : `${content.inventory.stockCount} bottles available`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-3">
                    <a
                      className="inline-flex h-12 w-full items-center justify-center rounded-md bg-foreground px-6 text-sm font-semibold text-background"
                      href="#order"
                    >
                      {copy.order}
                    </a>
                    <a
                      className="inline-flex h-12 w-full items-center justify-center rounded-md border border-border bg-surface px-6 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                      href="#diagnosis"
                    >
                      {t(content.whatsapp.diagnosisCta, locale)}
                    </a>
                  </div>
                </Card>
              </Reveal>
            </div>
          </Container>
        </section>

        <IngredientGallery content={content} locale={locale} />

        <section className="bg-[#F2E5C8] text-[#1C1C1C]" id="how-to-use">
          <Container className="grid gap-0 px-0 lg:grid-cols-2" size="full">
            <Reveal className="relative min-h-[34rem] overflow-hidden">
              <Image
                alt={t(primaryImage.alt, locale)}
                blurDataURL={blurDataUrl}
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.035]"
                fill
                loading="lazy"
                placeholder="blur"
                sizes="(min-width: 1024px) 50vw, 100vw"
                src={primaryImage.src}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_30%,rgb(184_134_11/.16),transparent_28%),linear-gradient(180deg,transparent,rgb(0_0_0/.42))]" />
            </Reveal>
            <div className="flex items-center px-5 py-16 sm:px-10 lg:px-16">
              <Reveal className="max-w-2xl">
                <Kicker>{t(content.howToUse.eyebrow, locale)}</Kicker>
                <Heading as="h2" className="mt-3" level="h2">
                  {t(content.howToUse.title, locale)}
                </Heading>
                {content.howToUse.intro ? (
                  <p className="mt-5 text-sm leading-7 text-[#1C1C1C]/70">
                    {t(content.howToUse.intro, locale)}
                  </p>
                ) : null}
                <div className="mt-8 grid gap-5">
                  {content.howToUse.steps.map((step) => (
                    <div className="flex gap-4" key={t(step.title, locale)}>
                      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#b8860b]/45 text-xs font-semibold text-[#8f6b14]">
                        {t(step.step, locale)}
                      </span>
                      <div>
                        <h3 className="font-semibold">{t(step.title, locale)}</h3>
                        <p className="mt-1 text-sm leading-6 text-[#1C1C1C]/66">
                          {t(step.text, locale)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <GuaranteeSection content={content} locale={locale} />

        <section className="bg-surface py-16 sm:py-24" id="before-after">
          <Container>
            <Reveal className="max-w-3xl">
              <Kicker>{t(content.beforeAfter.eyebrow, locale)}</Kicker>
              <Heading as="h2" className="mt-3" level="h2">
                {t(content.beforeAfter.title, locale)}
              </Heading>
              {content.beforeAfter.intro ? (
                <Text className="mt-4" tone="muted">
                  {t(content.beforeAfter.intro, locale)}
                </Text>
              ) : null}
            </Reveal>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {content.beforeAfter.items.map((item) => (
                <Reveal key={t(item.label, locale)}>
                  <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
                    {/* Interactive comparison slider */}
                    <ImageCompareSlider
                      afterAlt={t(item.after.alt, locale)}
                      afterSrc={item.after.src}
                      beforeAlt={t(item.before.alt, locale)}
                      beforeSrc={item.before.src}
                      locale={locale}
                    />

                    {/* Customer info or placeholder CTA */}
                    <div className="p-5">
                      {item.customer ? (
                        <>
                          <div className="flex items-baseline gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              {item.customer.name}
                            </p>
                            <span className="text-foreground/36" aria-hidden="true">
                              ·
                            </span>
                            <p className="text-sm text-foreground/68">{item.customer.city}</p>
                            <span className="text-foreground/36" aria-hidden="true">
                              ·
                            </span>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                              {locale === "fr"
                                ? `Semaine ${item.customer.week}`
                                : `Week ${item.customer.week}`}
                            </p>
                          </div>
                          <p className="mt-2 text-xs leading-5 text-foreground/58">
                            {t(item.caption, locale)}
                          </p>
                        </>
                      ) : (
                        /* Placeholder: real customer photos not yet available */
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                              {item.isPlaceholder
                                ? locale === "fr"
                                  ? "Rituel botanique — bientôt disponible"
                                  : "Botanical ritual — launching soon"
                                : t(item.label, locale)}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-foreground/68">
                              {t(item.caption, locale)}
                            </p>
                          </div>
                          {item.isPlaceholder ? (
                            <a
                              className="mt-0.5 shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-accent underline underline-offset-4 hover:no-underline"
                              href="#diagnosis"
                            >
                              {locale === "fr"
                                ? "Rejoindre les 100 premiers"
                                : "Be among the first 100"}
                            </a>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-background py-16 sm:py-24" id="testimonials">
          <Container>
            <Reveal className="max-w-3xl">
              <Kicker>{t(content.testimonials.eyebrow, locale)}</Kicker>
              <Heading as="h2" className="mt-3" level="h2">
                {t(content.testimonials.title, locale)}
              </Heading>
              {content.testimonials.intro ? (
                <Text className="mt-4" tone="muted">
                  {t(content.testimonials.intro, locale)}
                </Text>
              ) : null}
            </Reveal>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {content.testimonials.items
                .filter((testimonial) => testimonial.approved)
                .map((testimonial) => (
                  <Reveal key={`${testimonial.name}-${t(testimonial.location, locale)}`}>
                    <Card className="h-full" variant="elevated">
                      <Quote className="h-5 w-5 text-accent" aria-hidden="true" />
                      <p className="mt-5 text-base leading-7 text-foreground/78">
                        &ldquo;{t(testimonial.quote, locale)}&rdquo;
                      </p>
                      <div className="mt-6 border-t border-border pt-5">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="mt-1 text-sm text-foreground/56">
                          {t(testimonial.location, locale)}
                        </p>
                        <Badge className="mt-4" tone="sage">
                          {t(testimonial.result, locale)}
                        </Badge>
                      </div>
                    </Card>
                  </Reveal>
                ))}
            </div>
          </Container>
        </section>

        <section className="bg-background pb-16 sm:pb-24" id="timeline">
          <Container>
            <Reveal className="max-w-3xl">
              <Kicker>{t(content.timeline.eyebrow, locale)}</Kicker>
              <Heading as="h2" className="mt-3" level="h2">
                {t(content.timeline.title, locale)}
              </Heading>
            </Reveal>
            <div className="mt-10 grid gap-4 lg:grid-cols-5">
              {content.timeline.stages.map((stage) => (
                <Reveal key={t(stage.day, locale)}>
                  <LuxuryCard eyebrow={t(stage.day, locale)} title={t(stage.title, locale)}>
                    {t(stage.text, locale)}
                  </LuxuryCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-foreground py-16 text-background sm:py-24" id="subscription">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <Reveal>
                <Kicker className="text-accent-muted">
                  {t(content.innerCircle.eyebrow, locale)}
                </Kicker>
                <Heading as="h2" className="mt-3 text-background" level="h2">
                  {t(content.innerCircle.title, locale)}
                </Heading>
                {content.innerCircle.intro ? (
                  <p className="mt-4 text-sm leading-7 text-background/72">
                    {t(content.innerCircle.intro, locale)}
                  </p>
                ) : null}
              </Reveal>
              <Reveal>
                <Card className="border-white/12 bg-white/8 text-background" variant="default">
                  <p className="font-mono text-3xl text-[#F0DFB7]">
                    {content.innerCircle.priceXaf}
                  </p>
                  <div className="mt-6 grid gap-3">
                    {content.innerCircle.benefits.map((benefit) => (
                      <div
                        className="flex items-center gap-2 text-sm text-background/78"
                        key={t(benefit, locale)}
                      >
                        <Sparkles className="h-4 w-4 text-[#F0DFB7]" aria-hidden="true" />
                        {t(benefit, locale)}
                      </div>
                    ))}
                  </div>
                  <a
                    className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-md bg-[#FAF7F0] px-6 text-sm font-semibold text-[#1C1C1C]"
                    href={whatsappUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {t(content.innerCircle.cta, locale)}
                  </a>
                </Card>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="bg-surface py-16 sm:py-24" id="order">
          <Container>
            <Reveal className="max-w-3xl">
              <Kicker>{copy.order}</Kicker>
              <Heading as="h2" className="mt-3" level="h2">
                {locale === "fr"
                  ? "Commandez avec WhatsApp, Mobile Money ou Stripe."
                  : "Order with WhatsApp, Mobile Money, or Stripe."}
              </Heading>
              <Text className="mt-4" tone="muted">
                {locale === "fr"
                  ? "Les commandes locales passent en attente de verification manuelle apres reference de paiement. Les paiements internationaux passent par Stripe Checkout."
                  : "Local orders move to manual verification after payment reference submission. International payments continue through Stripe Checkout."}
              </Text>
            </Reveal>
            <div className="mt-10">
              <OrderFlow content={content} locale={locale} />
            </div>
          </Container>
        </section>

        <section className="bg-background py-16 sm:py-24" id="faq">
          <Container size="lg">
            <Reveal>
              <Kicker>{t(content.faq.eyebrow, locale)}</Kicker>
              <Heading as="h2" className="mt-3" level="h2">
                {t(content.faq.title, locale)}
              </Heading>
            </Reveal>
            <Accordion
              className="mt-8 rounded-lg border border-border bg-surface px-5"
              type="single"
              collapsible
            >
              {content.faq.items.map((item) => (
                <AccordionItem key={t(item.question, locale)} value={t(item.question, locale)}>
                  <AccordionTrigger>{t(item.question, locale)}</AccordionTrigger>
                  <AccordionContent>{t(item.answer, locale)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Container>
        </section>

        <section className="bg-surface py-16 sm:py-24" id="founder">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
              <Reveal className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-muted shadow-lifted">
                <Image
                  alt={t(content.founder.image.alt, locale)}
                  blurDataURL={blurDataUrl}
                  className="object-cover transition-transform duration-700 ease-out hover:scale-[1.035]"
                  fill
                  loading="lazy"
                  placeholder="blur"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  src={content.founder.image.src}
                />
              </Reveal>
              <Reveal>
                <Kicker>{t(content.founder.eyebrow, locale)}</Kicker>
                <Heading as="h2" className="mt-3" level="h2">
                  {t(content.founder.title, locale)}
                </Heading>
                {content.founder.intro ? (
                  <Text className="mt-4" tone="muted">
                    {t(content.founder.intro, locale)}
                  </Text>
                ) : null}
                <blockquote className="mt-6 border-l-2 border-accent pl-5 text-lg leading-8">
                  &ldquo;{t(content.founder.signature, locale)}&rdquo;
                </blockquote>
                <p className="mt-5 text-sm font-semibold text-accent">{content.founder.name}</p>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="bg-foreground py-16 text-background sm:py-24" id="payment">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
              <Reveal>
                <Kicker className="text-accent-muted">{copy.payment}</Kicker>
                <Heading as="h2" className="mt-3 text-background" level="h2">
                  {t(content.manualPayments.heading, locale)}
                </Heading>
                <p className="mt-5 text-sm leading-7 text-background/72">
                  {t(content.manualPayments.intro, locale)}
                </p>
              </Reveal>
              <div className="grid gap-4 sm:grid-cols-2">
                {content.manualPayments.methods.map((method) => (
                  <Reveal key={method.label}>
                    <div className="h-full rounded-lg border border-background/14 bg-background/8 p-5 shadow-soft">
                      <Badge tone="accent">{method.label}</Badge>
                      {method.number ? (
                        <p className="mt-5 font-mono text-lg">{method.number}</p>
                      ) : (
                        <p className="mt-5 text-sm font-semibold text-background/78">
                          {locale === "fr"
                            ? "Numero partage sur WhatsApp"
                            : "Number shared on WhatsApp"}
                        </p>
                      )}
                      <p className="mt-2 text-sm text-background/68">{method.accountName}</p>
                      <p className="mt-4 text-sm leading-6 text-background/72">
                        {t(method.instructions, locale)}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-background py-16 sm:py-24" id="final-cta">
          <Container>
            <Reveal className="mx-auto max-w-3xl text-center">
              <Kicker>{t(content.finalCta.eyebrow, locale)}</Kicker>
              <Heading as="h2" className="mt-3" level="h2">
                {t(content.finalCta.title, locale)}
              </Heading>
              {content.finalCta.intro ? (
                <Text className="mt-4" tone="muted">
                  {t(content.finalCta.intro, locale)}
                </Text>
              ) : null}
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <WhatsAppCta href={whatsappUrl} label={t(content.finalCta.button, locale)} />
                <a
                  className="inline-flex h-12 items-center gap-2 text-sm font-semibold text-accent"
                  href="#product"
                >
                  {locale === "fr" ? "Voir le produit" : "View product"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              {content.socialLinks.instagram || content.socialLinks.tiktok ? (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  {content.socialLinks.instagram ? (
                    <a
                      className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground"
                      href={content.socialLinks.instagram}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Camera className="h-4 w-4 text-accent" aria-hidden="true" />
                      Instagram
                    </a>
                  ) : null}
                  {content.socialLinks.tiktok ? (
                    <a
                      className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground"
                      href={content.socialLinks.tiktok}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Music2 className="h-4 w-4 text-accent" aria-hidden="true" />
                      TikTok
                    </a>
                  ) : null}
                </div>
              ) : null}
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: <Truck className="h-5 w-5" />,
                  text: t(content.shipping, locale),
                  title: locale === "fr" ? "Livraison" : "Delivery",
                },
                {
                  icon: <LockKeyhole className="h-5 w-5" />,
                  text:
                    locale === "fr"
                      ? "Stripe Checkout garde les donnees de paiement hors de nos serveurs."
                      : "Stripe Checkout keeps card data off FONDJO servers.",
                  title: locale === "fr" ? "Paiement securise" : "Secure payment",
                },
                {
                  icon: <Leaf className="h-5 w-5" />,
                  text: t(content.brandPositioning.primary, locale),
                  title: locale === "fr" ? "Racines africaines" : "African roots",
                },
              ].map((item) => (
                <LuxuryCard eyebrow="FONDJO RACINE" key={item.title} title={item.title}>
                  <div className="mb-4 text-accent">{item.icon}</div>
                  {item.text}
                </LuxuryCard>
              ))}
            </div>
          </Container>
        </section>

        <footer className="border-t border-border bg-[#07150b] py-8 text-[#F7F4EB]/70">
          <Container className="flex flex-col gap-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold tracking-[0.18em] text-[#D4AF37]">FONDJO RACINE</p>
              <p className="mt-2 text-xs leading-5">
                Founded and made in Buea, Cameroon. For external use only. Patch test recommended.
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold">
              {[
                ["Contact", "/contact"],
                ["Privacy", "/policies/privacy"],
                ["Terms", "/policies/terms"],
                ["Returns", "/policies/returns"],
                ["Shipping", "/policies/shipping"],
              ].map(([label, href]) => (
                <Link className="hover:text-[#D4AF37]" href={href as Route} key={href}>
                  {label}
                </Link>
              ))}
            </nav>
          </Container>
        </footer>
      </div>
      {/* end z-[2] post-hero wrapper */}
    </main>
  );
}
