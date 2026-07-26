"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  advisorImages,
  advisorPricing,
  buildWhatsAppUrl,
  getHerbariumIngredientCopy,
  herbariumIngredients,
} from "@/lib/advisor-site";
import { useCopy, useI18n } from "@/lib/i18n-context";

function ingredientAnchor(latinName: string) {
  return latinName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function BotaniqueRouteSection() {
  const copy = useCopy();
  const { locale } = useI18n();
  const botanique = copy.botanique;
  const countLabel =
    locale === "fr"
      ? `${herbariumIngredients.length} botaniques`
      : `${herbariumIngredients.length} botanicals`;

  return (
    <section className="relative px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_top,rgb(184_147_90/.12),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <header className="border border-[#B8935A]/14 bg-[#0B0B0B]/80 p-5 shadow-[0_24px_80px_rgb(0_0_0/.28)] backdrop-blur-sm sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#B8935A]">
              {botanique.eyebrow}
            </p>
            <p className="font-mono text-[0.7rem] tracking-[0.12em] text-[#F5EFE3]/45">
              {countLabel}
            </p>
          </div>
          <div className="mt-4 h-[2px] overflow-hidden bg-[#F5EFE3]/10">
            <div className="h-full w-1/3 bg-[#B8935A]" />
          </div>
          <div className="mt-8 border-l border-[#B8935A]/35 pl-4 sm:mt-10 sm:pl-6">
            <h1 className="max-w-3xl font-serif text-[1.85rem] font-light leading-[1.15] tracking-tight text-[#F5EFE3] sm:text-4xl lg:text-[2.85rem]">
              {botanique.title}
            </h1>
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#F5EFE3]/68 sm:mt-7 sm:text-base sm:leading-8">
            {botanique.body}
          </p>
        </header>

        <nav
          aria-label={botanique.indexLabel}
          className="mt-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:mt-8"
        >
          {herbariumIngredients.map((ingredient, index) => {
            const ingredientCopy = getHerbariumIngredientCopy(ingredient, locale);
            const href = `#${ingredientAnchor(ingredient.latinName)}`;

            return (
              <a
                className="shrink-0 border border-[#B8935A]/18 bg-[#F5EFE3]/[0.03] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#F5EFE3]/70 transition hover:border-[#B8935A]/45 hover:text-[#B8935A]"
                href={href}
                key={ingredient.latinName}
              >
                <span className="mr-2 font-mono text-[#B8935A]/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {ingredientCopy.commonName}
              </a>
            );
          })}
        </nav>

        <div className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-28 border border-[#B8935A]/14 bg-[#0B0B0B]/70 p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#B8935A]">
                {botanique.indexLabel}
              </p>
              <ul className="mt-4 grid gap-1.5">
                {herbariumIngredients.map((ingredient, index) => {
                  const ingredientCopy = getHerbariumIngredientCopy(ingredient, locale);

                  return (
                    <li key={ingredient.latinName}>
                      <a
                        className="flex items-baseline gap-2 py-1 text-sm text-[#F5EFE3]/62 transition hover:text-[#B8935A]"
                        href={`#${ingredientAnchor(ingredient.latinName)}`}
                      >
                        <span className="font-mono text-[0.65rem] text-[#B8935A]/70">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{ingredientCopy.commonName}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          <div className="grid gap-4 sm:gap-5">
            {herbariumIngredients.map((ingredient, index) => {
              const ingredientCopy = getHerbariumIngredientCopy(ingredient, locale);
              const anchor = ingredientAnchor(ingredient.latinName);

              return (
                <article
                  className="scroll-mt-28 border border-[#B8935A]/14 bg-[#0B0B0B]/55 p-5 sm:p-7"
                  id={anchor}
                  key={ingredient.latinName}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-[0.7rem] tracking-[0.16em] text-[#B8935A]">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-2 font-serif text-2xl font-light leading-tight text-[#F5EFE3] sm:text-3xl">
                        {ingredientCopy.commonName}
                      </h2>
                      <p className="mt-2 font-serif text-sm italic tracking-wide text-[#B8935A]/90 sm:text-base">
                        {ingredient.latinName}
                      </p>
                    </div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#F5EFE3]/42">
                      {ingredientCopy.region}
                    </p>
                  </div>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {ingredientCopy.properties.map((property) => (
                      <li
                        className="border border-[#B8935A]/22 bg-[#B8935A]/[0.06] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#B8935A]"
                        key={property}
                      >
                        {property}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 border-t border-[#B8935A]/12 pt-5">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#B8935A]">
                      {botanique.chosenFor}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[#F5EFE3]/68 sm:text-[0.95rem] sm:leading-8">
                      {ingredientCopy.chosenFor}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SeveRacineRouteSection() {
  const copy = useCopy();
  const { locale } = useI18n();
  const whatsappUrl = buildWhatsAppUrl("order", "", locale);
  const seveRacine = copy.seveRacine;

  return (
    <section className="grid min-h-[calc(100svh-5rem)] items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div className="mx-auto w-full max-w-xl lg:order-2">
        <div className="relative aspect-[4/5] overflow-hidden border border-[#B8935A]/16 bg-black">
          <Image
            alt={seveRacine.alt}
            className="object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 46vw, 100vw"
            src={advisorImages.product}
          />
        </div>
      </div>
      <div className="mx-auto max-w-2xl lg:order-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]">
          {seveRacine.batchLine}
        </p>
        <h1 className="mt-6 font-serif text-5xl font-light leading-tight sm:text-7xl">
          {seveRacine.title}
        </h1>
        <p className="mt-6 text-lg leading-8 text-[#F5EFE3]/68">{seveRacine.intro}</p>
        <p className="mt-7 font-mono text-2xl text-[#B8935A]">{advisorPricing.productXaf}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            className="inline-flex min-h-13 items-center justify-center rounded-sm bg-[#B8935A] px-7 text-sm font-semibold text-[#0B0B0B] transition-transform duration-100 hover:-translate-y-0.5 active:scale-[0.98]"
            href={"/checkout" as never}
          >
            {seveRacine.cta}
          </Link>
          <a
            className="inline-flex min-h-13 items-center justify-center rounded-sm border border-[#B8935A]/35 px-7 text-sm font-semibold text-[#F5EFE3] transition hover:border-[#B8935A]"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

export function SurMesureRouteSection() {
  const copy = useCopy();
  const { locale } = useI18n();
  const whatsappUrl = buildWhatsAppUrl("consultation", "", locale);
  const surMesure = copy.surMesure;

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]">
          {surMesure.eyebrow}
        </p>
        <h1 className="mt-6 max-w-4xl font-serif text-5xl font-light leading-tight sm:text-7xl">
          {surMesure.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#F5EFE3]/68">{surMesure.body}</p>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {surMesure.steps.map(([number, title, text]) => (
            <article className="border border-[#B8935A]/16 bg-white/[0.025] p-6" key={title}>
              <p className="font-mono text-xs text-[#B8935A]">{number}</p>
              <h2 className="mt-8 font-serif text-3xl">{title}</h2>
              <p className="mt-4 text-sm leading-7 text-[#F5EFE3]/66">{text}</p>
            </article>
          ))}
        </div>
        <a
          className="mt-10 inline-flex min-h-13 items-center justify-center rounded-sm bg-[#B8935A] px-7 text-sm font-semibold text-[#0B0B0B] transition-transform duration-100 active:scale-[0.98]"
          href={whatsappUrl}
          rel="noreferrer"
          target="_blank"
        >
          {surMesure.cta}
        </a>
      </div>
    </section>
  );
}

export function GrossistesRouteSection() {
  const copy = useCopy();
  const { locale } = useI18n();
  const whatsappUrl = buildWhatsAppUrl("wholesale", "", locale);
  const grossistes = copy.grossistes;

  return (
    <section className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-4xl content-center px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]">
        {grossistes.eyebrow}
      </p>
      <h1 className="mt-6 font-serif text-5xl font-light leading-tight sm:text-7xl">
        {grossistes.title}
      </h1>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="border border-[#B8935A]/16 bg-white/[0.025] p-6">
          <p className="font-mono text-2xl text-[#B8935A]">{advisorPricing.wholesaleMoq}</p>
          <p className="mt-3 text-sm text-[#F5EFE3]/62">{grossistes.cardMinimum}</p>
        </div>
        <div className="border border-[#B8935A]/16 bg-white/[0.025] p-6">
          <p className="font-mono text-2xl text-[#B8935A]">{advisorPricing.wholesaleUnitXaf}</p>
          <p className="mt-3 text-sm text-[#F5EFE3]/62">{grossistes.cardPrice}</p>
        </div>
        <div className="border border-[#B8935A]/16 bg-white/[0.025] p-6">
          <p className="font-mono text-2xl text-[#B8935A]">WhatsApp</p>
          <p className="mt-3 text-sm text-[#F5EFE3]/62">{grossistes.cardValidation}</p>
        </div>
      </div>
      <a
        className="mt-10 inline-flex min-h-13 w-fit items-center justify-center rounded-sm bg-[#B8935A] px-7 text-sm font-semibold text-[#0B0B0B] transition-transform duration-100 active:scale-[0.98]"
        href={whatsappUrl}
        rel="noreferrer"
        target="_blank"
      >
        {grossistes.cta}
      </a>
    </section>
  );
}

export function HistoireRouteSection() {
  const copy = useCopy();
  const histoire = copy.histoire;

  const chapters = [histoire.origin, histoire.name, histoire.product, histoire.family] as const;

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]">
          {histoire.eyebrow}
        </p>
        <h1 className="mt-6 font-serif text-5xl font-light leading-tight sm:text-7xl">
          {histoire.title}
        </h1>

        <div className="mt-14 grid gap-px border border-[#B8935A]/14">
          {chapters.map((chapter) => (
            <article
              className="grid gap-6 border-b border-[#B8935A]/14 bg-white/[0.018] p-8 last:border-b-0 sm:grid-cols-[10rem_1fr]"
              key={chapter.label}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#B8935A]">
                {chapter.label}
              </p>
              <div>
                <h2 className="font-serif text-2xl font-light leading-snug">{chapter.heading}</h2>
                <p className="mt-4 text-sm leading-7 text-[#F5EFE3]/68">{chapter.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#B8935A] px-7 text-sm font-semibold text-[#0B0B0B] transition-transform duration-100 hover:-translate-y-0.5 active:scale-[0.98]"
            href="/shop"
          >
            {histoire.cta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            className="inline-flex min-h-13 items-center justify-center rounded-sm border border-[#B8935A]/24 px-7 text-sm font-semibold text-[#F5EFE3] transition-transform duration-100 hover:-translate-y-0.5 active:scale-[0.98]"
            href="/botanique"
          >
            {histoire.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
