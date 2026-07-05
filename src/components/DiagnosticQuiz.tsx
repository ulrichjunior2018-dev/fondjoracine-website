"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { advisorCopy } from "@/content/advisor-copy";
import { advisorPricing, buildWhatsAppUrl } from "@/lib/advisor-site";

type Question = {
  summaryLabel: string;
  id: string;
  options: ReadonlyArray<{ label: string; severity?: "serious" | "standard"; value: string }>;
  prompt: string;
};

const questions = advisorCopy.diagnostic.questions satisfies readonly Question[];

function getAnswerValue(questionId: string, answers: Record<string, string>) {
  if (questionId === "objectif") {
    return answers.objectif;
  }

  if (questionId === "texture") {
    return answers.texture;
  }

  if (questionId === "routine") {
    return answers.routine;
  }

  if (questionId === "sensibilite") {
    return answers.sensibilite;
  }

  if (questionId === "duree") {
    return answers.duree;
  }

  return undefined;
}

function getAnswerLabel(questionId: string, answers: Record<string, string>) {
  const question = questions.find((item) => item.id === questionId);
  const value = getAnswerValue(questionId, answers);

  return question?.options.find((option) => option.value === value)?.label ?? "Non renseigné";
}

function getMainProblem(answers: Record<string, string>) {
  return getAnswerLabel("objectif", answers).toLowerCase();
}

function getRecommendationBotanicals(answers: Record<string, string>) {
  const problem = answers.objectif;

  if (problem === "secheresse") {
    return ["coco", "olive"] as const;
  }

  if (problem === "cuir_chevelu") {
    return ["jojoba", "menthe"] as const;
  }

  return ["ricin", "nigelle"] as const;
}

export function DiagnosticQuiz() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const currentIndex = Math.min(Object.keys(answers).length, questions.length - 1);
  const isComplete = Object.keys(answers).length === questions.length;
  const currentQuestion = questions.find((_, index) => index === currentIndex);
  const hasSeriousSignal = useMemo(
    () =>
      Object.entries(answers).some(([questionId, value]) => {
        const question = questions.find((item) => item.id === questionId);
        const option = question?.options.find((item) => item.value === value);

        return option && "severity" in option && option.severity === "serious";
      }),
    [answers],
  );
  const severityLabel = hasSeriousSignal ? "élevée" : "standard";
  const serializedAnswers = [
    `Cheveux: ${getAnswerLabel("texture", answers)}`,
    `Cuir chevelu: ${getAnswerLabel("sensibilite", answers)}`,
    `Problème: ${getMainProblem(answers)}, ${getAnswerLabel("duree", answers)}`,
    `Routine: ${getAnswerLabel("routine", answers)}`,
    `Sévérité: ${severityLabel}`,
  ].join(" / ");
  const [botanicalOne, botanicalTwo] = getRecommendationBotanicals(answers);
  const standardRecommendation = `${serializedAnswers}\nRecommandation Sève Racine: pour ${getMainProblem(
    answers,
  )}, commencer par un rituel mesuré avec ${botanicalOne} et ${botanicalTwo}.`;
  const privateConsultationMessage = `${serializedAnswers}\nOrientation: Consultation Privée recommandée (${advisorPricing.consultationCreditXaf} créditée).`;
  const resultUrl = hasSeriousSignal
    ? buildWhatsAppUrl("consultation", privateConsultationMessage)
    : buildWhatsAppUrl("diagnostic", standardRecommendation);

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
            {advisorCopy.diagnostic.eyebrow}
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
            {advisorCopy.diagnostic.nextStep}
          </p>
          <h1 className="mt-5 font-serif text-4xl font-light leading-tight sm:text-6xl">
            {hasSeriousSignal
              ? advisorCopy.diagnostic.privateTitle
              : advisorCopy.diagnostic.standardTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#f6f0e4]/68">
            {hasSeriousSignal
              ? advisorCopy.diagnostic.privateBody.replace(
                  "{price}",
                  advisorPricing.consultationCreditXaf,
                )
              : advisorCopy.diagnostic.standardBody
                  .replace("{problem}", getMainProblem(answers))
                  .replace("{botanicalOne}", botanicalOne)
                  .replace("{botanicalTwo}", botanicalTwo)}
          </p>
          <div className="mt-6 rounded-sm border border-[#d6b75b]/14 bg-white/[0.025] p-4 text-sm leading-7 text-[#f6f0e4]/68">
            {serializedAnswers}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#d6b75b] px-6 text-sm font-semibold text-[#080706] transition-transform duration-100 active:scale-[0.98]"
              href={resultUrl}
              rel="noreferrer"
              target="_blank"
            >
              {advisorCopy.diagnostic.whatsapp}
              <MessageCircle className="size-4" aria-hidden="true" />
            </a>
            <button
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm border border-[#f6f0e4]/16 px-6 text-sm font-semibold text-[#f6f0e4] transition-transform duration-100 active:scale-[0.98]"
              onClick={() => setAnswers({})}
              type="button"
            >
              {advisorCopy.diagnostic.redo}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
