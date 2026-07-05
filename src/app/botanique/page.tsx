import type { Metadata } from "next";

import { AdvisorShell } from "@/components/AdvisorShell";
import { advisorCopy } from "@/content/advisor-copy";
import { herbariumIngredients } from "@/lib/advisor-site";

export const metadata: Metadata = {
  title: "Botanique | Maison Fondjo",
  description: advisorCopy.botanique.description,
};

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

export default function BotaniquePage() {
  return (
    <AdvisorShell>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d6b75b]">
            {advisorCopy.botanique.eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-light leading-tight sm:text-7xl">
            {advisorCopy.botanique.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#f6f0e4]/68">
            {advisorCopy.botanique.body}
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {herbariumIngredients.map((ingredient, index) => (
              <article
                className="min-h-[24rem] border border-[#d6b75b]/16 bg-white/[0.025] p-6 transition duration-300 hover:border-[#d6b75b]/45 hover:bg-[#d6b75b]/[0.045]"
                key={ingredient.latinName}
              >
                <HerbariumMark index={index} />
                <p className="mt-7 font-serif text-3xl text-[#f6f0e4]">{ingredient.commonName}</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-[#d6b75b]">
                  {ingredient.latinName}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#f6f0e4]/42">
                  {ingredient.region}
                </p>
                <p className="mt-5 text-sm leading-7 text-[#f6f0e4]/66">
                  {advisorCopy.botanique.chosenFor} : {ingredient.chosenFor}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </AdvisorShell>
  );
}
