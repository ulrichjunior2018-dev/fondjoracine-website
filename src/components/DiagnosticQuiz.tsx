"use client";

import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
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
import { useMemo, useState, type ReactNode } from "react";

import { advisorPricing, buildWhatsAppUrl } from "@/lib/advisor-site";
import { useCopy, useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils/cn";

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
  casse: Scissors,
  secheresse: Droplet,
  cuir_chevelu: AlertCircle,
  chute_soudaine: Wind,
  autre: MessageCircle,
  naturels_4c: Sparkles,
  boucles: Repeat,
  ondules: Waves,
  fins_lisses: Minus,
  protective_styles: Layers,
  wash_day: Droplets,
  grooming: Scissors,
  irreguliere: Shuffle,
  non: Check,
  demangeaisons: AlertTriangle,
  douleur_irritation: AlertOctagon,
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

function StepFrame({
  eyebrow,
  stepLabel,
  progress,
  title,
  children,
  onBack,
  backLabel,
}: {
  eyebrow: string;
  stepLabel: string;
  progress: number;
  title: string;
  children: ReactNode;
  onBack?: () => void;
  backLabel?: string;
}) {
  return (
    <div className="animate-[fondjoFadeUp_.45s_ease-out_both]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#B8935A]">
          {eyebrow}
        </p>
        <p className="font-mono text-[0.7rem] tracking-[0.12em] text-[#F5EFE3]/45">{stepLabel}</p>
      </div>

      <div className="mt-4 h-[2px] overflow-hidden bg-[#F5EFE3]/10">
        <div
          className="h-full bg-[#B8935A] transition-all duration-500 ease-out"
          style={{ width: `${Math.min(Math.max(progress, 0.08), 1) * 100}%` }}
        />
      </div>

      {onBack && backLabel ? (
        <button
          className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#F5EFE3]/65 transition hover:text-[#B8935A]"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {backLabel}
        </button>
      ) : null}

      <div
        className={cn(
          "border-l border-[#B8935A]/35 pl-4 sm:pl-6",
          onBack ? "mt-5 sm:mt-6" : "mt-8 sm:mt-10",
        )}
      >
        <h1 className="max-w-2xl font-serif text-[1.85rem] font-light leading-[1.15] tracking-tight text-[#F5EFE3] sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h1>
      </div>

      <div className="mt-8 sm:mt-10">{children}</div>
    </div>
  );
}

function OptionButton({
  label,
  icon: OptionIcon,
  onClick,
}: {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "group flex w-full min-h-[3.5rem] items-center gap-3 border border-[#B8935A]/16 bg-[#F5EFE3]/[0.03] px-4 py-3.5 text-left transition",
        "hover:border-[#B8935A]/45 hover:bg-[#B8935A]/[0.07]",
        "active:scale-[0.99] sm:min-h-[3.75rem] sm:gap-4 sm:px-5",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8935A]",
      )}
      onClick={onClick}
      type="button"
    >
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-full border border-[#B8935A]/28 bg-[#0B0B0B] text-[#B8935A] transition group-hover:border-[#B8935A]/55 group-hover:bg-[#B8935A]/10 sm:size-11"
      >
        {OptionIcon ? <OptionIcon className="size-4 sm:size-[1.05rem]" /> : null}
      </span>
      <span className="min-w-0 flex-1 text-[0.95rem] font-medium leading-snug text-[#F5EFE3]/88 sm:text-base">
        {label}
      </span>
      <ChevronRight
        aria-hidden="true"
        className="size-4 shrink-0 text-[#B8935A]/50 transition group-hover:translate-x-0.5 group-hover:text-[#B8935A]"
      />
    </button>
  );
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
    setAnswers((current) => {
      const questionIndex = questions.findIndex((item) => item.id === questionId);
      const next: Record<string, string> = {};

      for (let index = 0; index < questionIndex; index += 1) {
        const id = questions[index]?.id;
        if (id && current[id] !== undefined) {
          next[id] = current[id]!;
        }
      }

      next[questionId] = value;
      return next;
    });
    setNotesShown(false);
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

  function goBack() {
    if (pendingAutre) {
      setPendingAutre(false);
      return;
    }

    if (isComplete && notesShown) {
      setNotesShown(false);
      return;
    }

    if (isComplete && !notesShown) {
      setAnswers((current) => {
        const keys = Object.keys(current);
        const lastKey = keys[keys.length - 1];
        if (!lastKey) {
          return current;
        }
        const next = { ...current };
        delete next[lastKey];
        return next;
      });
      return;
    }

    if (Object.keys(answers).length === 0) {
      return;
    }

    setAnswers((current) => {
      const keys = Object.keys(current);
      const lastKey = keys[keys.length - 1];
      if (!lastKey) {
        return current;
      }
      const next = { ...current };
      delete next[lastKey];
      return next;
    });
  }

  function reset() {
    setAnswers({});
    setPendingAutre(false);
    setAutreText("");
    setAdditionalNotes("");
    setNotesShown(false);
  }

  const answeredCount = Object.keys(answers).length;
  const canGoBack = pendingAutre || notesShown || isComplete || answeredCount > 0;
  const displayStep = pendingAutre
    ? 1
    : isComplete
      ? questions.length
      : Math.max(answeredCount + 1, 1);
  const progress = pendingAutre
    ? 1 / questions.length
    : isComplete && notesShown
      ? 1
      : isComplete
        ? 0.92
        : displayStep / questions.length;
  const stepLabel = `${String(displayStep).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;
  const backProps = canGoBack ? { onBack: goBack, backLabel: diagnostic.back } : {};

  const fieldClass =
    "mt-2 w-full resize-none border border-[#B8935A]/18 bg-[#0B0B0B] px-4 py-3.5 text-base text-[#F5EFE3]/88 placeholder:text-[#F5EFE3]/28 outline-none transition focus:border-[#B8935A]/50 sm:px-5";
  const primaryBtnClass =
    "inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#B8935A] px-6 text-sm font-semibold text-[#0B0B0B] transition active:scale-[0.98] disabled:opacity-40 sm:min-h-13 sm:w-auto";
  const secondaryBtnClass =
    "inline-flex min-h-12 w-full items-center justify-center gap-2 border border-[#F5EFE3]/18 px-6 text-sm font-semibold text-[#F5EFE3] transition hover:border-[#B8935A]/45 active:scale-[0.98] sm:min-h-13 sm:w-auto";

  return (
    <section className="relative px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_at_top,rgba(184_147_90/.12),transparent_65%)]"
      />

      <div className="relative mx-auto w-full max-w-2xl lg:max-w-3xl">
        <div className="border border-[#B8935A]/14 bg-[#0B0B0B]/80 p-5 shadow-[0_24px_80px_rgb(0_0_0/.35)] backdrop-blur-sm sm:p-8 lg:p-10">
          {pendingAutre ? (
            <StepFrame
              eyebrow={diagnostic.eyebrow}
              progress={progress}
              stepLabel={stepLabel}
              title={diagnostic.autrePrompt}
              {...backProps}
            >
              <label className="block">
                <span className="sr-only">{diagnostic.autrePrompt}</span>
                <textarea
                  autoFocus
                  className={fieldClass}
                  onChange={(e) => setAutreText(e.target.value)}
                  placeholder={diagnostic.notesPlaceholder}
                  rows={4}
                  value={autreText}
                />
              </label>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  className={secondaryBtnClass}
                  onClick={() => setPendingAutre(false)}
                  type="button"
                >
                  {diagnostic.autreBack}
                </button>
                <button
                  className={primaryBtnClass}
                  disabled={!autreText.trim()}
                  onClick={confirmAutre}
                  type="button"
                >
                  {diagnostic.notesContinue}
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </StepFrame>
          ) : !isComplete && currentQuestion ? (
            <StepFrame
              eyebrow={diagnostic.eyebrow}
              progress={progress}
              stepLabel={stepLabel}
              title={currentQuestion.prompt}
              {...backProps}
            >
              <div className="grid gap-2.5 sm:gap-3">
                {currentQuestion.options.map((option) => (
                  <OptionButton
                    icon={OPTION_ICONS[option.value]}
                    key={option.value}
                    label={option.label}
                    onClick={() => handleOptionClick(currentQuestion.id, option.value)}
                  />
                ))}
              </div>
            </StepFrame>
          ) : isComplete && !notesShown ? (
            <StepFrame
              eyebrow={diagnostic.eyebrow}
              progress={progress}
              stepLabel={stepLabel}
              title={diagnostic.notesPrompt}
              {...backProps}
            >
              <label className="block">
                <span className="sr-only">{diagnostic.notesPrompt}</span>
                <textarea
                  autoFocus
                  className={fieldClass}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder={diagnostic.notesPlaceholder}
                  rows={4}
                  value={additionalNotes}
                />
              </label>
              <div className="mt-5">
                <button
                  className={primaryBtnClass}
                  onClick={() => setNotesShown(true)}
                  type="button"
                >
                  {diagnostic.notesContinue}
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </StepFrame>
          ) : (
            <div className="animate-[fondjoFadeUp_.45s_ease-out_both]">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#B8935A]">
                {diagnostic.nextStep}
              </p>
              <div className="mt-4 h-[2px] bg-[#B8935A]/80" />
              <button
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#F5EFE3]/65 transition hover:text-[#B8935A]"
                onClick={goBack}
                type="button"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                {diagnostic.back}
              </button>
              <h1 className="mt-5 font-serif text-[1.85rem] font-light leading-[1.15] text-[#F5EFE3] sm:text-4xl lg:text-[2.75rem]">
                {hasSeriousSignal ? diagnostic.privateTitle : diagnostic.standardTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#F5EFE3]/68 sm:text-base sm:leading-8">
                {hasSeriousSignal
                  ? diagnostic.privateBody.replace("{price}", advisorPricing.consultationCreditXaf)
                  : diagnostic.standardBody
                      .replace("{problem}", concernText)
                      .replace("{botanicalOne}", botanicalOne)
                      .replace("{botanicalTwo}", botanicalTwo)}
              </p>
              <div className="mt-6 border border-[#B8935A]/16 bg-[#F5EFE3]/[0.03] p-4 text-sm leading-7 text-[#F5EFE3]/68 sm:p-5">
                {serializedAnswers}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a className={primaryBtnClass} href={resultUrl} rel="noreferrer" target="_blank">
                  {diagnostic.whatsapp}
                  <MessageCircle className="size-4" aria-hidden="true" />
                </a>
                <button className={secondaryBtnClass} onClick={reset} type="button">
                  {diagnostic.redo}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
