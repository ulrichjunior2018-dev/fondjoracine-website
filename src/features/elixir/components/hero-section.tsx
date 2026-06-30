"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

import { Container } from "@/components/ui/container";
import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { t } from "@/features/elixir/data/content";

type HeroSectionProps = {
  content: ElixirContent;
  locale: Locale;
};

export function HeroSection({ content, locale }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const bottleY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);
  const bottleRotate = useTransform(scrollYProgress, [0, 1], [-2, 4]);

  return (
    <section
      className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-[#0D0D0D] text-[#F7F4EB]"
      id="hero"
      ref={containerRef}
    >
      <div className="absolute inset-0">
        <Image
          alt="Mount Cameroon inspired botanical landscape in Buea"
          className="object-cover opacity-42"
          fill
          priority
          sizes="100vw"
          src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=82"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0D0D0D_0%,rgb(13_13_13/.88)_36%,rgb(27_94_32/.42)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,#0D0D0D,transparent)]" />
      </div>

      <Container
        className="relative grid min-h-[calc(100svh-5rem)] gap-10 pb-24 pt-14 sm:pt-18 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
        size="2xl"
      >
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#D4AF37]">
            {t(content.hero.eyebrow, locale)}
          </p>
          <h1 className="mt-6 font-serif text-[3.2rem] font-light leading-[0.92] text-[#F7F4EB] sm:text-[5.8rem] lg:text-[7rem]">
            FROM THE SOIL TO THE BOTTLE
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-[#F7F4EB]/76">
            {t(content.description, locale)}
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <a
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#D4AF37] px-6 text-sm font-semibold text-[#0D0D0D] shadow-[0_18px_44px_rgb(212_175_55/.26)]"
              href="#order"
            >
              {t(content.hero.primaryCta, locale)}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[#D4AF37]/45 bg-[#F7F4EB]/8 px-6 text-sm font-semibold text-[#F7F4EB] backdrop-blur"
              href="#diagnosis"
            >
              {t(content.hero.secondaryCta, locale)}
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <dl className="mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {content.highlights.map((item) => (
              <div className="border-l border-[#D4AF37]/40 pl-3" key={t(item.label, locale)}>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                  {t(item.label, locale)}
                </dt>
                <dd className="mt-2 text-sm leading-5 text-[#F7F4EB]/82">
                  {t(item.value, locale)}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto w-full max-w-[34rem]"
          initial={{ opacity: 0, y: 26 }}
          transition={{ delay: 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/24 shadow-[0_0_120px_rgb(212_175_55/.22)]" />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            className="relative mx-auto aspect-[3/4] w-[58%] max-w-80 overflow-visible"
            style={{ rotate: bottleRotate, y: bottleY }}
            transition={{ duration: 5.4, ease: "easeInOut", repeat: Infinity }}
          >
            <div className="absolute left-1/2 top-0 h-[10%] w-[38%] -translate-x-1/2 rounded-t-sm border border-[#D4AF37]/45 bg-[#0D0D0D] shadow-[inset_0_10px_22px_rgb(212_175_55/.16)]" />
            <div className="absolute inset-x-[9%] top-[8%] h-[88%] overflow-hidden rounded-t-[2rem] rounded-b-md border border-[#D4AF37]/45 bg-[linear-gradient(105deg,#07180b_0%,#1B5E20_34%,#0D0D0D_66%,#234f21_100%)] shadow-[0_38px_100px_rgb(0_0_0/.42),inset_18px_0_40px_rgb(255_255_255/.05),inset_-28px_0_50px_rgb(0_0_0/.34)]">
              <div className="absolute inset-y-0 left-[18%] w-[18%] bg-[linear-gradient(90deg,transparent,rgb(247_244_235/.18),transparent)] blur-sm" />
              <div className="absolute left-1/2 top-[18%] h-[62%] w-[78%] -translate-x-1/2 border border-[#D4AF37]/55 bg-[#F7F4EB]/96 px-5 py-8 text-center text-[#0D0D0D] shadow-[0_20px_60px_rgb(0_0_0/.24)]">
                <p className="font-serif text-3xl leading-none tracking-[0.16em]">FONDJO</p>
                <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-[#1B5E20]">
                  Racine
                </p>
                <div className="mx-auto my-7 h-px w-16 bg-[#D4AF37]" />
                <p className="font-serif text-5xl leading-none text-[#1B5E20]">SÈVE</p>
                <p className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.18em]">
                  Hair Treatment Oil
                </p>
                <p className="mt-6 font-mono text-xs">100ml / 3.38 fl oz</p>
              </div>
            </div>
          </motion.div>
          <div className="absolute bottom-6 left-0 right-0 mx-auto w-[86%] rounded-md border border-[#D4AF37]/28 bg-[#0D0D0D]/82 p-4 text-center backdrop-blur">
            <p className="font-serif text-2xl text-[#D4AF37]">FONDJO RACINE SÈVE</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#F7F4EB]/72">
              Batch #001 · 100ml · 8,500 XAF
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
