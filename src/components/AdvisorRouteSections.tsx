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

function HerbariumMark({ index }: { index: number }) {
  const side = index % 2 === 0 ? 1 : -1;

  return (
    <svg aria-hidden="true" className="h-28 w-full text-[#B8935A]/72" viewBox="0 0 160 120">
      <path
        d={`M80 108 C ${78 + side * 8} 84, ${84 - side * 18} 54, 80 18`}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.3"
      />
      {[0, 1, 2, 3].map((leaf) => (
        <path
          d={`M80 ${88 - leaf * 18} C ${105 + side * leaf * 2} ${78 - leaf * 18}, ${106 + side * 4} ${54 - leaf * 12}, 82 ${72 - leaf * 16} C ${96 + side * 4} ${76 - leaf * 18}, ${96 + side * 6} ${86 - leaf * 14}, 80 ${88 - leaf * 18}`}
          fill="none"
          key={leaf}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

export function BotaniqueRouteSection() {
  const copy = useCopy();
  const { locale } = useI18n();
  const botanique = copy.botanique;

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B8935A]">
          {botanique.eyebrow}
        </p>
        <h1 className="mt-6 max-w-4xl font-serif text-5xl font-light leading-tight sm:text-7xl">
          {botanique.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[#F5EFE3]/68">{botanique.body}</p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {herbariumIngredients.map((ingredient, index) => {
            const ingredientCopy = getHerbariumIngredientCopy(ingredient, locale);

            return (
              <article
                className="min-h-[24rem] border border-[#B8935A]/16 bg-white/[0.025] p-6 transition duration-300 hover:border-[#B8935A]/45 hover:bg-[#B8935A]/[0.045]"
                key={ingredient.latinName}
              >
                <HerbariumMark index={index} />
                <p className="mt-7 font-serif text-3xl text-[#F5EFE3]">
                  {ingredientCopy.commonName}
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-[#B8935A]">
                  {ingredient.latinName}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#F5EFE3]/42">
                  {ingredientCopy.region}
                </p>
                <p className="mt-5 text-sm leading-7 text-[#F5EFE3]/66">
                  {botanique.chosenFor} : {ingredientCopy.chosenFor}
                </p>
              </article>
            );
          })}
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
