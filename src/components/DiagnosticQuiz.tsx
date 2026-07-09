"use client";

import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Clock9,
  Droplet,
  Droplets,
  History,
  Layers,
  MessageCircle,
  Minus,
  Repeat,
  Scissors,
  Shuffle,
  Sparkles,
  Waves,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { advisorPricing, buildWhatsAppUrl } from "@/lib/advisor-site";
import { useCopy, useI18n } from "@/lib/i18n-context";

type Question = {
  summaryLabel: string;
  id: string;
  options: ReadonlyArray<{ label: string; severity?: string; value: string }>;
  prompt: string;
};

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

function getAnswerLabel(
  questionId: string,
  answers: Record<string, string>,
  questions: readonly Question[],
  fallback: string,
) {
  const question = questions.find((item) => item.id === questionId);
  const value = getAnswerValue(questionId, answers);

  return question?.options.find((option) => option.value === value)?.label ?? fallback;
}

function getMainProblem(
  answers: Record<string, string>,
  questions: readonly Question[],
  fallback: string,
) {
  return getAnswerLabel("objectif", answers, questions, fallback).toLowerCase();
}

const OPTION_ICONS: Record<string, LucideIcon> = {
  // objectif
  casse: Scissors,
  secheresse: Droplet,
  cuir_chevelu: AlertCircle,
  chute_soudaine: Wind,
  autre: MessageCircle,
  // texture
  naturels_4c: Sparkles,
  boucles: Repeat,
  ondules: Waves,
  fins_lisses: Minus,
  // routine
  protective_styles: Layers,
  wash_day: Droplets,
  grooming: Scissors,
  irreguliere: Shuffle,
  // sensibilite
  non: Check,
  demangeaisons: AlertTriangle,
  douleur_irritation: AlertOctagon,
  // duree
  moins_1_mois: Clock3,
  "6_mois": Clock9,
  plus_1_an: History,
};

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
  const copy = useCopy();
  const { locale } = useI18n();
  const diagnostic = copy.diagnostic;
  const recommendation = diagnostic.recommendation;
  const questions: readonly Question[] = diagnostic.questions;
  const fallbackAnswer = recommendation.fallbackAnswer;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pendingAutre, setPendingAutre] = useState(false);
  const [autreText, setAutreText] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [notesShown, setNotesShown] = useState(false);
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
    [answers, questions],
  );
  const severityLabel = hasSeriousSignal
    ? recommendation.severityHigh
    : recommendation.severityStandard;
  const concernText =
    answers.objectif === "autre" && autreText
      ? autreText
      : getMainProblem(answers, questions, fallbackAnswer);
  const serializedAnswers = [
    `${recommendation.summaryHair}: ${getAnswerLabel("texture", answers, questions, fallbackAnswer)}`,
    `${recommendation.summaryScalp}: ${getAnswerLabel(
      "sensibilite",
      answers,
      questions,
      fallbackAnswer,
    )}`,
    `${recommendation.summaryConcern}: ${concernText}, ${getAnswerLabel("duree", answers, questions, fallbackAnswer)}`,
    `${recommendation.summaryRoutine}: ${getAnswerLabel(
      "routine",
      answers,
      questions,
      fallbackAnswer,
    )}`,
    `${recommendation.summarySeverity}: ${severityLabel}`,
  ].join(" / ");
  const [botanicalOne, botanicalTwo] = getRecommendationBotanicals(answers);
  const standardRecommendation = [
    serializedAnswers,
    `${recommendation.recommendationLabel}: ${recommendation.for} ${concernText}, ${recommendation.recommendationText
      .replace("{botanicalOne}", botanicalOne)
      .replace("{botanicalTwo}", botanicalTwo)}`,
    additionalNotes ? additionalNotes : null,
  ]
    .filter(Boolean)
    .join("\n");
  const privateConsultationMessage = [
    serializedAnswers,
    `${recommendation.summaryDirection}: ${recommendation.privateDirection} (${advisorPricing.consultationCreditXaf} ${recommendation.credited}).`,
    additionalNotes ? additionalNotes : null,
  ]
    .filter(Boolean)
    .join("\n");
  const resultUrl = hasSeriousSignal
    ? buildWhatsAppUrl("consultation", privateConsultationMessage, locale)
    : buildWhatsAppUrl("diagnostic", standardRecommendation, locale);

  function choose(questionId: string, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function handleOptionClick(questionId: string, value: string) {
    if (questionId === "objectif" && value === "autre") {
      setPendingAutre(true);
    } else {
      choose(questionId, value);
    }
  }

  function confirmAutre() {
    choose("objectif", "autre");
    setPendingAutre(false);
  }

  function reset() {
    setAnswers({});
    setPendingAutre(false);
    setAutreText("");
    setAdditionalNotes("");
    setNotesShown(false);
  }

  const progressSteps = pendingAutre
    ? 1
    : isComplete
      ? questions.length
      : Object.keys(answers).length || 1;

  return (
    <section className="mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-5xl content-center px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 h-px overflow-hidden bg-[#F5EFE3]/12">
        <div
          className="h-full bg-[#B8935A] transition-all duration-500"
          style={{ width: `${(progressSteps / questions.length) * 100}%` }}
        />
      </div>

      {pendingAutre ? (
        <div className="animate-[fondjoFadeUp_.5s_ease-out_both]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8935A]">
            {diagnostic.eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl font-light leading-tight text-[#F5EFE3] sm:text-6xl">
            {diagnostic.autrePrompt}
          </h1>
          <textarea
            autoFocus
            className="mt-9 w-full resize-none rounded-2xl border border-[#B8935A]/18 bg-[#13281E]/40 px-5 py-4 text-base text-[#F5EFE3]/82 placeholder-[#F5EFE3]/30 outline-none focus:border-[#B8935A]/45"
            onChange={(e) => setAutreText(e.target.value)}
            placeholder={diagnostic.notesPlaceholder}
            rows={4}
            value={autreText}
          />
          <div className="mt-4 flex gap-3">
            <button
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm border border-[#F5EFE3]/16 px-6 text-sm font-semibold text-[#F5EFE3] transition-transform duration-100 active:scale-[0.98]"
              onClick={() => setPendingAutre(false)}
              type="button"
            >
              {diagnostic.autreBack}
            </button>
            <button
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#B8935A] px-6 text-sm font-semibold text-[#0B0B0B] transition-transform duration-100 active:scale-[0.98] disabled:opacity-40"
              disabled={!autreText.trim()}
              onClick={confirmAutre}
              type="button"
            >
              {diagnostic.notesContinue}
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : !isComplete && currentQuestion ? (
        <div className="animate-[fondjoFadeUp_.5s_ease-out_both]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8935A]">
            {diagnostic.eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl font-light leading-tight text-[#F5EFE3] sm:text-6xl">
            {currentQuestion.prompt}
          </h1>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {currentQuestion.options.map((option) => {
              const OptionIcon = OPTION_ICONS[option.value];
              return (
                <button
                  className="flex min-h-20 items-center justify-between rounded-2xl border border-[#B8935A]/18 bg-[#13281E]/40 px-5 text-left text-base text-[#F5EFE3]/82 transition duration-100 hover:border-[#B8935A]/45 hover:bg-[#B8935A]/8 active:scale-[0.98]"
                  key={option.value}
                  onClick={() => handleOptionClick(currentQuestion.id, option.value)}
                  type="button"
                >
                  <span className="flex items-center gap-3">
                    {OptionIcon && (
                      <OptionIcon aria-hidden className="shrink-0 text-[#B8935A]/70" size={18} />
                    )}
                    {option.label}
                  </span>
                  <ChevronRight
                    className="ml-3 size-5 shrink-0 text-[#B8935A]/60"
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : isComplete && !notesShown ? (
        <div className="animate-[fondjoFadeUp_.5s_ease-out_both]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8935A]">
            {diagnostic.eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl font-light leading-tight text-[#F5EFE3] sm:text-5xl">
            {diagnostic.notesPrompt}
          </h1>
          <textarea
            autoFocus
            className="mt-9 w-full resize-none rounded-2xl border border-[#B8935A]/18 bg-[#13281E]/40 px-5 py-4 text-base text-[#F5EFE3]/82 placeholder-[#F5EFE3]/30 outline-none focus:border-[#B8935A]/45"
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder={diagnostic.notesPlaceholder}
            rows={4}
            value={additionalNotes}
          />
          <div className="mt-4">
            <button
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#B8935A] px-6 text-sm font-semibold text-[#0B0B0B] transition-transform duration-100 active:scale-[0.98]"
              onClick={() => setNotesShown(true)}
              type="button"
            >
              {diagnostic.notesContinue}
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-[fondjoFadeUp_.5s_ease-out_both] border border-[#B8935A]/18 bg-[#0B0B0B]/62 p-6 shadow-[0_24px_90px_rgb(0_0_0/.28)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8935A]">
            {diagnostic.nextStep}
          </p>
          <h1 className="mt-5 font-serif text-4xl font-light leading-tight sm:text-6xl">
            {hasSeriousSignal ? diagnostic.privateTitle : diagnostic.standardTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#F5EFE3]/68">
            {hasSeriousSignal
              ? diagnostic.privateBody.replace("{price}", advisorPricing.consultationCreditXaf)
              : diagnostic.standardBody
                  .replace("{problem}", concernText)
                  .replace("{botanicalOne}", botanicalOne)
                  .replace("{botanicalTwo}", botanicalTwo)}
          </p>
          <div className="mt-6 rounded-sm border border-[#B8935A]/14 bg-white/[0.025] p-4 text-sm leading-7 text-[#F5EFE3]/68">
            {serializedAnswers}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-[#B8935A] px-6 text-sm font-semibold text-[#0B0B0B] transition-transform duration-100 active:scale-[0.98]"
              href={resultUrl}
              rel="noreferrer"
              target="_blank"
            >
              {diagnostic.whatsapp}
              <MessageCircle className="size-4" aria-hidden="true" />
            </a>
            <button
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm border border-[#F5EFE3]/16 px-6 text-sm font-semibold text-[#F5EFE3] transition-transform duration-100 active:scale-[0.98]"
              onClick={reset}
              type="button"
            >
              {diagnostic.redo}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
