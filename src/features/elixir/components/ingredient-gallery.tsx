"use client";

import { motion } from "framer-motion";

import { formulaIngredients } from "@/content/formula";
import type { ElixirContent, Locale } from "@/features/elixir/data/content";

type IngredientGalleryProps = {
  content: ElixirContent;
  locale: Locale;
};

function EngravedBotanical({ index }: { index: number }) {
  const side = index % 2 === 0 ? 1 : -1;

  return (
    <svg aria-hidden="true" className="mx-auto h-28 w-36 text-[#7b622d]" viewBox="0 0 160 120">
      <path
        d={`M80 108 C ${78 + side * 8} 84, ${84 - side * 18} 54, 80 18`}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.1"
      />
      {[0, 1, 2, 3].map((leaf) => (
        <path
          d={`M80 ${88 - leaf * 18} C ${105 + side * leaf * 2} ${78 - leaf * 18}, ${106 + side * 4} ${54 - leaf * 12}, 82 ${72 - leaf * 16} C ${96 + side * 4} ${76 - leaf * 18}, ${96 + side * 6} ${86 - leaf * 14}, 80 ${88 - leaf * 18}`}
          fill="none"
          key={leaf}
          stroke="currentColor"
          strokeWidth="0.9"
        />
      ))}
    </svg>
  );
}

export function IngredientGallery({ content, locale }: IngredientGalleryProps) {
  const eyebrow = locale.startsWith("fr")
    ? content.ingredientScience.eyebrow.fr
    : content.ingredientScience.eyebrow.en;
  const title = locale.startsWith("fr")
    ? content.ingredientScience.title.fr
    : content.ingredientScience.title.en;

  return (
    <section className="bg-[#0B0B0B] px-5 py-16 text-[#F5EFE3] sm:px-8 lg:px-12" id="ingredients">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B8935A]">
          {eyebrow}
        </p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl font-light leading-tight text-[#F5EFE3] sm:text-6xl">
          {title}
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {formulaIngredients.map((ingredient, index) => {
            const name = locale.startsWith("fr") ? ingredient.name_fr : ingredient.name_en;
            const note = locale.startsWith("fr") ? ingredient.chosen_for : ingredient.chosen_for_en;

            return (
              <motion.article
                className="relative min-h-[22rem] overflow-hidden rounded-sm border border-[#B8935A]/46 bg-[#F5EFE3] p-6 text-[#0B0B0B]"
                initial={{ opacity: 0, y: 16 }}
                key={ingredient.latin}
                transition={{ duration: 0.42, delay: index * 0.02 }}
                viewport={{ once: true, margin: "-12%" }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div aria-hidden="true" className="absolute inset-3 border border-[#B8935A]/28" />
                <div className="relative text-center">
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[#7b622d]/80">
                    Maison Fondjo Herbier
                  </p>
                  <EngravedBotanical index={index} />
                  <h3 className="mt-5 font-serif text-4xl font-light leading-none">{name}</h3>
                  <p className="mt-2 font-serif text-lg italic text-[#7b622d]">
                    {ingredient.latin}
                  </p>
                  <div className="mx-auto mt-5 h-px w-20 bg-[#B8935A]" />
                  <p className="mt-5 text-sm leading-7 text-[#0B0B0B]/70">{note}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
