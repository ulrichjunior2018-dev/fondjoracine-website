"use client";

import { BadgeCheck, CreditCard, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";

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
    <svg aria-hidden="true" className="h-28 w-full text-[#d6b75b]/72" viewBox="0 0 160 120">
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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d6b75b]">
          {botanique.eyebrow}
        </p>
        <h1 className="mt-6 max-w-4xl font-serif text-5xl font-light leading-tight sm:text-7xl">
          {botanique.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[#f6f0e4]/68">{botanique.body}</p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {herbariumIngredients.map((ingredient, index) => {
            const ingredientCopy = getHerbariumIngredientCopy(ingredient, locale);

            return (
              <article
                className="min-h-[24rem] border border-[#d6b75b]/16 bg-white/[0.025] p-6 transition duration-300 hover:border-[#d6b75b]/45 hover:bg-[#d6b75b]/[0.045]"
                key={ingredient.latinName}
              >
                <HerbariumMark index={index} />
                <p className="mt-7 font-serif text-3xl text-[#f6f0e4]">
                  {ingredientCopy.commonName}
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-[#d6b75b]">
                  {ingredient.latinName}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#f6f0e4]/42">
                  {ingredientCopy.region}
                </p>
                <p className="mt-5 text-sm leading-7 text-[#f6f0e4]/66">
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
        <div className="relative aspect-[4/5] overflow-hidden border border-[#d6b75b]/16 bg-black">
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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d6b75b]">
          {seveRacine.batchLine}
        </p>
        <h1 className="mt-6 font-serif text-5xl font-light leading-tight sm:text-7xl">
          {seveRacine.title}
        </h1>
        <p className="mt-6 text-lg leading-8 text-[#f6f0e4]/68">{seveRacine.intro}</p>
        <p className="mt-7 font-mono text-2xl text-[#d6b75b]">{advisorPricing.productXaf}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {seveRacine.steps.map((step, index) => (
            <div className="border border-[#d6b75b]/14 bg-white/[0.025] p-4" key={step}>
              <p className="font-mono text-xs text-[#d6b75b]">0{index + 1}</p>
              <p className="mt-3 text-sm leading-6 text-[#f6f0e4]/68">{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {seveRacine.shippingCards.map((item, index) => (
            <div className="border border-[#d6b75b]/14 bg-white/[0.025] p-4" key={item.label}>
              <div className="flex items-center gap-2 text-[#d6b75b]">
                {index === 0 ? (
                  <Truck className="size-4" aria-hidden="true" />
                ) : index === 1 ? (
                  <ShieldCheck className="size-4" aria-hidden="true" />
                ) : (
                  <PackageCheck className="size-4" aria-hidden="true" />
                )}
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">{item.label}</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#f6f0e4]/68">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {seveRacine.payment.map((label, index) => (
            <div
              className="flex min-h-12 items-center gap-3 border border-[#d6b75b]/14 bg-[#d6b75b]/[0.055] px-4 text-sm font-semibold text-[#f6f0e4]"
              key={label}
            >
              <span className="text-[#d6b75b]">
                {index === 0 ? (
                  <BadgeCheck className="size-4" aria-hidden="true" />
                ) : (
                  <CreditCard className="size-4" aria-hidden="true" />
                )}
              </span>
              {label}
            </div>
          ))}
        </div>
        <a
          className="mt-9 inline-flex min-h-13 items-center justify-center rounded-sm bg-[#d6b75b] px-7 text-sm font-semibold text-[#080706] transition-transform duration-100 active:scale-[0.98]"
          href={whatsappUrl}
          rel="noreferrer"
          target="_blank"
        >
          {seveRacine.cta}
        </a>
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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d6b75b]">
          {surMesure.eyebrow}
        </p>
        <h1 className="mt-6 max-w-4xl font-serif text-5xl font-light leading-tight sm:text-7xl">
          {surMesure.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f6f0e4]/68">{surMesure.body}</p>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {surMesure.steps.map(([number, title, text]) => (
            <article className="border border-[#d6b75b]/16 bg-white/[0.025] p-6" key={title}>
              <p className="font-mono text-xs text-[#d6b75b]">{number}</p>
              <h2 className="mt-8 font-serif text-3xl">{title}</h2>
              <p className="mt-4 text-sm leading-7 text-[#f6f0e4]/66">{text}</p>
            </article>
          ))}
        </div>
        <a
          className="mt-10 inline-flex min-h-13 items-center justify-center rounded-sm bg-[#d6b75b] px-7 text-sm font-semibold text-[#080706] transition-transform duration-100 active:scale-[0.98]"
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
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d6b75b]">
        {grossistes.eyebrow}
      </p>
      <h1 className="mt-6 font-serif text-5xl font-light leading-tight sm:text-7xl">
        {grossistes.title}
      </h1>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="border border-[#d6b75b]/16 bg-white/[0.025] p-6">
          <p className="font-mono text-2xl text-[#d6b75b]">{advisorPricing.wholesaleMoq}</p>
          <p className="mt-3 text-sm text-[#f6f0e4]/62">{grossistes.cardMinimum}</p>
        </div>
        <div className="border border-[#d6b75b]/16 bg-white/[0.025] p-6">
          <p className="font-mono text-2xl text-[#d6b75b]">{advisorPricing.wholesaleUnitXaf}</p>
          <p className="mt-3 text-sm text-[#f6f0e4]/62">{grossistes.cardPrice}</p>
        </div>
        <div className="border border-[#d6b75b]/16 bg-white/[0.025] p-6">
          <p className="font-mono text-2xl text-[#d6b75b]">WhatsApp</p>
          <p className="mt-3 text-sm text-[#f6f0e4]/62">{grossistes.cardValidation}</p>
        </div>
      </div>
      <a
        className="mt-10 inline-flex min-h-13 w-fit items-center justify-center rounded-sm bg-[#d6b75b] px-7 text-sm font-semibold text-[#080706] transition-transform duration-100 active:scale-[0.98]"
        href={whatsappUrl}
        rel="noreferrer"
        target="_blank"
      >
        {grossistes.cta}
      </a>
    </section>
  );
}
