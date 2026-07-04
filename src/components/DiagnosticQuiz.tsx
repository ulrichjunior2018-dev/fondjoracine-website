"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { advisorPricing, buildWhatsAppUrl } from "@/lib/advisor-site";

type DiagnosticQuizProps = {
  whatsappPhone: string;
};

type Question = {
  id: string;
  options: Array<{ label: string; severity?: "serious" | "standard"; value: string }>;
  prompt: string;
};

const questions: Question[] = [
  {
    id: "objectif",
    prompt: "Qu'est-ce qui vous préoccupe le plus aujourd'hui ?",
    options: [
      { label: "Casse et longueurs fragiles", value: "casse" },
      { label: "Sécheresse ou manque de douceur", value: "secheresse" },
      { label: "Cuir chevelu inconfortable", value: "cuir_chevelu" },
      {
        label: "Chute soudaine ou zones clairsemées",
        severity: "serious",
        value: "chute_soudaine",
      },
    ],
  },
  {
    id: "texture",
    prompt: "Quelle description se rapproche le plus de vos cheveux ?",
    options: [
      { label: "Crépus / coils", value: "crepus" },
      { label: "Bouclés", value: "boucles" },
      { label: "Ondulés", value: "ondules" },
      { label: "Fins ou lisses", value: "fins_lisses" },
    ],
  },
  {
    id: "routine",
    prompt: "Votre routine actuelle est plutôt...",
    options: [
      { label: "Protective styles ou tresses", value: "protective_styles" },
      { label: "Wash day régulier", value: "wash_day" },
      { label: "Grooming barbe / contours", value: "grooming" },
      { label: "Très irrégulière", value: "irreguliere" },
    ],
  },
  {
    id: "sensibilite",
    prompt: "Avez-vous douleur, plaies, brûlure ou réaction persistante ?",
    options: [
      { label: "Non", value: "non" },
      { label: "Parfois une gêne légère", value: "gene_legere" },
      {
        label: "Oui, douleur ou irritation persistante",
        severity: "serious",
        value: "douleur_irritation",
      },
    ],
  },
  {
    id: "frequence",
    prompt: "Combien de fois par semaine pouvez-vous appliquer un rituel simple ?",
    options: [
      { label: "1 fois", value: "1_fois" },
      { label: "2 à 3 fois", value: "2_3_fois" },
      { label: "Plus souvent, si c'est léger", value: "plus_souvent" },
    ],
  },
] as const;

export function DiagnosticQuiz({ whatsappPhone }: DiagnosticQuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const currentIndex = Math.min(Object.keys(answers).length, questions.length - 1);
  const isComplete = Object.keys(answers).length === questions.length;
  const currentQuestion = questions.find((_, index) => index === currentIndex);
  const hasSeriousSignal = useMemo(
    () =>
      Object.entries(answers).some(([questionId, value]) => {
        const question = questions.find((item) => item.id === questionId);
        return question?.options.find((option) => option.value === value)?.severity === "serious";
      }),
    [answers],
  );
  const serializedAnswers = questions
    .map((question) => {
      const value = answers[question.id];
      const label =
        question.options.find((option) => option.value === value)?.label ?? "Non renseigné";
      return `${question.prompt} ${label}`;
    })
    .join(" | ");
  const resultMessage = hasSeriousSignal
    ? `Bonjour FONDJO RACINE, je souhaite une Consultation Privee (${advisorPricing.consultationCreditXaf}, creditee) apres mon diagnostic. Reponses: ${serializedAnswers}`
    : `Bonjour FONDJO RACINE, voici mon diagnostic cheveux. Je veux une recommandation Seve Racine adaptee. Reponses: ${serializedAnswers}`;
  const resultUrl = buildWhatsAppUrl(whatsappPhone, resultMessage);

  function choose(questionId: string, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  return (
    <section className="mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-5xl content-center px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 h-px overflow-hidden bg-[#f6f0e4]/12">
        <div
          className="h-full bg-[#d6b75b] transition-all duration-500"
          style={{ width: `${((Object.keys(answers).length || 1) / questions.length) * 100}%` }}
        />
      </div>

      {!isComplete && currentQuestion ? (
        <div className="animate-[fondjoFadeUp_.5s_ease-out_both]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d6b75b]">
            Diagnostic FONDJO RACINE
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl font-light leading-tight text-[#f6f0e4] sm:text-6xl">
            {currentQuestion.prompt}
          </h1>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {currentQuestion.options.map((option) => (
              <button
                className="min-h-20 rounded-sm border border-[#d6b75b]/18 bg-white/[0.035] px-5 text-left text-base text-[#f6f0e4]/82 transition duration-100 hover:border-[#d6b75b]/45 hover:bg-[#d6b75b]/8 active:scale-[0.98]"
                key={option.value}
                onClick={() => choose(currentQuestion.id, option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-[fondjoFadeUp_.5s_ease-out_both] border border-[#d6b75b]/18 bg-[#0d0d0d]/62 p-6 shadow-[0_24px_90px_rgb(0_0_0/.28)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d6b75b]">
            Votre prochaine étape
          </p>
          <h1 className="mt-5 font-serif text-4xl font-light leading-tight sm:text-6xl">
            {hasSeriousSignal
              ? "Consultation Privée recommandée."
              : "Sève Racine peut structurer votre rituel."}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#f6f0e4]/68">
            {hasSeriousSignal
              ? `Certains signaux demandent une écoute plus précise. La Consultation Privée est proposée à ${advisorPricing.consultationCreditXaf}, créditée si une formule est ensuite préparée.`
              : "Vos réponses indiquent un besoin de discipline, de douceur et de placement précis de l'huile. Nous préparons la recommandation Sève Racine à partir de vos réponses."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#d6b75b] px-6 text-sm font-semibold text-[#080706] transition-transform duration-100 active:scale-[0.98]"
              href={resultUrl}
              rel="noreferrer"
              target="_blank"
            >
              Continuer sur WhatsApp
              <MessageCircle className="size-4" aria-hidden="true" />
            </a>
            <button
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm border border-[#f6f0e4]/16 px-6 text-sm font-semibold text-[#f6f0e4] transition-transform duration-100 active:scale-[0.98]"
              onClick={() => setAnswers({})}
              type="button"
            >
              Refaire le diagnostic
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
