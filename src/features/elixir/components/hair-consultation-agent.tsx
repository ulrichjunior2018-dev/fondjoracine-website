"use client";

import {
  ArrowLeft,
  ArrowRight,
  Download,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, Input, Textarea } from "@/components/ui/input";
import type { HairConsultationAnswersInput } from "@/domain/commerce/schemas";
import type { Locale } from "@/features/elixir/data/content";
import { cn } from "@/lib/utils/cn";
import type { HairConsultationRecommendation } from "@/services/commerce/hair-consultation-service";

type HairConsultationAgentProps = {
  locale: Locale;
};

type Option = {
  label: Record<Locale, string>;
  value: string;
};

type Question =
  | {
      id: keyof HairConsultationAnswersInput;
      mode: "single";
      options: Option[];
      prompt: Record<Locale, string>;
    }
  | {
      id: keyof HairConsultationAnswersInput;
      mode: "multi";
      options: Option[];
      prompt: Record<Locale, string>;
    }
  | {
      id: keyof HairConsultationAnswersInput;
      mode: "text";
      prompt: Record<Locale, string>;
    };

type ApiResponse = {
  data?: {
    consultation: {
      id: string;
      recommendation: HairConsultationRecommendation;
    };
    whatsappUrl: string;
  };
  error?: {
    message: string;
  };
};

const single = (value: string, en: string, fr: string): Option => ({
  label: { en, fr },
  value,
});

const questions: Question[] = [
  {
    id: "hairType",
    mode: "single",
    options: [
      single("natural", "Natural", "Naturel"),
      single("relaxed", "Relaxed", "Defrise"),
      single("braided", "Braided", "Tresse"),
      single("locs", "Locs", "Locs"),
      single("transitioning", "Transitioning", "Transition"),
      single("heat_damaged", "Heat-damaged", "Abime par la chaleur"),
      single("not_sure", "Not sure", "Pas sure"),
    ],
    prompt: { en: "What is your hair type?", fr: "Quel est votre type de cheveux ?" },
  },
  {
    id: "mainConcern",
    mode: "single",
    options: [
      single("slow_growth", "Slow growth", "Pousse lente"),
      single("breakage", "Breakage", "Casse"),
      single("dryness", "Dryness", "Secheresse"),
      single("itchy_scalp", "Itchy scalp", "Cuir chevelu qui gratte"),
      single("thinning_edges", "Thinning edges", "Tempes clairsemees"),
      single("dandruff", "Dandruff", "Pellicules"),
      single("hair_shedding", "Hair shedding", "Chute de cheveux"),
      single("weak_hair", "Weak hair", "Cheveux fragiles"),
      single("damaged_hair", "Damaged hair", "Cheveux abimes"),
    ],
    prompt: { en: "What is your main concern?", fr: "Quel est votre probleme principal ?" },
  },
  {
    id: "concernDuration",
    mode: "single",
    options: [
      single("less_than_1_month", "Less than 1 month", "Moins d un mois"),
      single("1_to_3_months", "1-3 months", "1 a 3 mois"),
      single("3_to_6_months", "3-6 months", "3 a 6 mois"),
      single("6_to_12_months", "6-12 months", "6 a 12 mois"),
      single("more_than_1_year", "More than 1 year", "Plus d un an"),
    ],
    prompt: {
      en: "How long have you had this problem?",
      fr: "Depuis quand avez-vous ce probleme ?",
    },
  },
  {
    id: "scalpOiling",
    mode: "single",
    options: [
      single("never", "Never", "Jamais"),
      single("once_weekly", "Once a week", "Une fois par semaine"),
      single("two_to_three_times_weekly", "2-3 times weekly", "2 a 3 fois par semaine"),
      single("daily", "Daily", "Chaque jour"),
      single("only_when_dry", "Only when hair feels dry", "Seulement quand c est sec"),
    ],
    prompt: {
      en: "How often do you oil your scalp?",
      fr: "A quelle frequence huilez-vous le cuir chevelu ?",
    },
  },
  {
    id: "styles",
    mode: "multi",
    options: [
      single("braids", "Braids", "Tresses"),
      single("wigs", "Wigs", "Perruques"),
      single("weaves", "Weaves", "Tissages"),
      single("natural_afro", "Natural afro", "Afro naturel"),
      single("silk_press", "Silk press", "Silk press"),
      single("relaxed_styles", "Relaxed styles", "Coiffures defrisees"),
      single("locs", "Locs", "Locs"),
      single("protective_styles", "Protective styles", "Coiffures protectrices"),
    ],
    prompt: { en: "What styles do you wear most?", fr: "Quelles coiffures portez-vous le plus ?" },
  },
  {
    id: "heatUse",
    mode: "single",
    options: [
      single("never", "Never", "Jamais"),
      single("rarely", "Rarely", "Rarement"),
      single("weekly", "Weekly", "Chaque semaine"),
      single("multiple_times_weekly", "Multiple times weekly", "Plusieurs fois par semaine"),
    ],
    prompt: { en: "Do you use heat?", fr: "Utilisez-vous la chaleur ?" },
  },
  {
    id: "scalpSymptoms",
    mode: "multi",
    options: [
      single("none", "None", "Aucun"),
      single("itching", "Itching", "Demangeaisons"),
      single("flaking", "Flaking", "Desquamation"),
      single("pain", "Pain", "Douleur"),
      single("burning", "Burning", "Brulure"),
      single("sores", "Sores", "Plaies"),
      single("redness", "Redness", "Rougeur"),
      single("heavy_dandruff", "Heavy dandruff", "Pellicules importantes"),
    ],
    prompt: { en: "Do you have scalp symptoms?", fr: "Avez-vous des symptomes du cuir chevelu ?" },
  },
  {
    id: "previousProducts",
    mode: "text",
    prompt: {
      en: "What products have you tried before?",
      fr: "Quels produits avez-vous deja essayes ?",
    },
  },
  {
    id: "sensitiveStatus",
    mode: "single",
    options: [
      single("yes", "Yes", "Oui"),
      single("no", "No", "Non"),
      single("not_sure", "Not sure", "Pas sure"),
    ],
    prompt: {
      en: "Are you pregnant, breastfeeding, allergic to essential oils, or sensitive-skinned?",
      fr: "Etes-vous enceinte, allaitante, allergique aux huiles essentielles ou sensible ?",
    },
  },
  {
    id: "photoReview",
    mode: "single",
    options: [single("true", "Yes", "Oui"), single("false", "No", "Non")],
    prompt: {
      en: "Would you like to send a hair photo on WhatsApp for human review?",
      fr: "Voulez-vous envoyer une photo cheveux sur WhatsApp pour analyse humaine ?",
    },
  },
];

const initialAnswers: Partial<HairConsultationAnswersInput> = {
  scalpSymptoms: [],
  styles: [],
};

function copy(locale: Locale) {
  return {
    back: locale === "fr" ? "Retour" : "Back",
    consent:
      locale === "fr"
        ? "J accepte que FONDJO enregistre mes reponses pour generer mon guide et assurer un suivi WhatsApp."
        : "I agree that FONDJO can store my answers to generate my guide and support WhatsApp follow-up.",
    contact: locale === "fr" ? "Vos coordonnees" : "Your details",
    download: locale === "fr" ? "Telecharger le resume" : "Download summary",
    email: locale === "fr" ? "Email optionnel" : "Email optional",
    error:
      locale === "fr"
        ? "Impossible de terminer le diagnostic."
        : "Unable to complete consultation.",
    intro:
      locale === "fr"
        ? "Repondez a quelques questions. FONDJO cree un guide cosmetique personnalise, puis vous passe a WhatsApp pour un suivi humain."
        : "Answer a few questions. FONDJO creates a personalized cosmetic guide, then hands you to WhatsApp for human follow-up.",
    medical:
      locale === "fr"
        ? "Ce diagnostic ne remplace pas un dermatologue. Douleur, plaies, brulure, reaction allergique ou chute soudaine par plaques demandent un avis medical."
        : "This consultation does not replace a dermatologist. Pain, sores, burning, allergic reaction, or sudden patchy hair loss needs medical review.",
    name: locale === "fr" ? "Nom complet" : "Full name",
    next: locale === "fr" ? "Continuer" : "Continue",
    phone: locale === "fr" ? "Telephone WhatsApp" : "WhatsApp phone",
    privacy:
      locale === "fr"
        ? "Vos reponses sont utilisees pour personnaliser le conseil FONDJO et aider l equipe admin a assurer le suivi."
        : "Your answers are used to personalize FONDJO guidance and help the admin team follow up.",
    result: locale === "fr" ? "Votre profil capillaire" : "Your hair profile",
    send: locale === "fr" ? "Envoyer le resume sur WhatsApp" : "Send summary to WhatsApp",
    start: locale === "fr" ? "Demarrer le diagnostic" : "Start diagnosis",
    submit: locale === "fr" ? "Generer mon guide" : "Generate my guide",
    subtitle: locale === "fr" ? "Diagnostic capillaire IA" : "AI hair consultation",
  };
}

function isAnswered(question: Question, answers: Partial<HairConsultationAnswersInput>) {
  const value = answers[question.id];

  if (question.mode === "text") {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== undefined && value !== "";
}

export function HairConsultationAgent({ locale }: HairConsultationAgentProps) {
  const c = copy(locale);
  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<HairConsultationAnswersInput>>(initialAnswers);
  const [customer, setCustomer] = useState({ email: "", name: "", phone: "" });
  const [consentGiven, setConsentGiven] = useState(false);
  const [company, setCompany] = useState("");
  const [result, setResult] = useState<ApiResponse["data"] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const question = questions[step];
  const progress = useMemo(() => Math.round(((step + 1) / questions.length) * 100), [step]);
  const isContactStep = step >= questions.length;
  const canContinue = question ? isAnswered(question, answers) : true;
  const canSubmit = customer.name.length >= 2 && customer.phone.length >= 8 && consentGiven;

  function setSingle(questionId: keyof HairConsultationAnswersInput, value: string) {
    setAnswers((current) => ({
      ...current,
      [questionId]: questionId === "photoReview" ? value === "true" : value,
    }));
  }

  function toggleMulti(questionId: keyof HairConsultationAnswersInput, value: string) {
    setAnswers((current) => {
      const currentValues = Array.isArray(current[questionId])
        ? ([...(current[questionId] as string[])] as string[])
        : [];
      const nextValues =
        value === "none"
          ? ["none"]
          : currentValues.includes(value)
            ? currentValues.filter((item) => item !== value)
            : [...currentValues.filter((item) => item !== "none"), value];

      return {
        ...current,
        [questionId]: nextValues,
      };
    });
  }

  async function submitConsultation() {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/hair-consultation", {
        body: JSON.stringify({
          answers,
          company,
          consentGiven,
          customer,
          locale,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as ApiResponse;

      if (!response.ok || !payload.data) {
        throw new Error(payload.error?.message ?? c.error);
      }

      setResult(payload.data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : c.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function downloadSummary() {
    if (!result) {
      return;
    }

    const recommendation = result.consultation.recommendation;
    const text = [
      "FONDJO Hair Consultation",
      "",
      recommendation.hairProfile,
      "",
      `${locale === "fr" ? "Probleme" : "Main issue"}: ${recommendation.mainIssue}`,
      `${locale === "fr" ? "Risque" : "Risk"}: ${recommendation.riskLevel}`,
      "",
      recommendation.disclaimer,
      recommendation.medicalReferral ?? "",
      "",
      ...recommendation.recommendedRoutine.map((item) => `- ${item}`),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "fondjoracine-hair-consultation.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function openWhatsapp() {
    if (!result) {
      return;
    }

    await fetch(`/api/hair-consultation/${result.consultation.id}/whatsapp`, { method: "PATCH" });
    window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
  }

  if (result) {
    const recommendation = result.consultation.recommendation;

    return (
      <Card
        className="border-[#b8860b]/30 bg-[#071b0f] text-[#FAF7F0] shadow-[0_34px_90px_rgb(0_0_0/.28)]"
        variant="default"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge className="bg-[#f0dfb7] text-[#1C1C1C]" tone="accent">
              {c.result}
            </Badge>
            <h3 className="mt-5 text-3xl font-semibold leading-tight">
              {recommendation.mainIssue}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#FAF7F0]/72">{recommendation.hairProfile}</p>
          </div>
          <Badge
            tone={
              recommendation.riskLevel === "high"
                ? "danger"
                : recommendation.riskLevel === "medium"
                  ? "warning"
                  : "success"
            }
          >
            {recommendation.riskLevel.toUpperCase()}
          </Badge>
        </div>

        {recommendation.medicalReferral ? (
          <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm leading-6 text-[#FAF7F0]">
            {recommendation.medicalReferral}
          </div>
        ) : null}

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {[
            {
              title: locale === "fr" ? "Causes possibles" : "Likely causes",
              items: recommendation.likelyCauses,
            },
            {
              title: locale === "fr" ? "Routine FONDJO" : "FONDJO routine",
              items: recommendation.recommendedRoutine,
            },
            { title: locale === "fr" ? "A faire" : "What to do", items: recommendation.whatToDo },
            {
              title: locale === "fr" ? "A eviter" : "What not to do",
              items: recommendation.whatNotToDo,
            },
          ].map((group) => (
            <div className="rounded-lg border border-white/12 bg-white/7 p-5" key={group.title}>
              <h4 className="font-semibold text-[#f0dfb7]">{group.title}</h4>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-[#FAF7F0]/72">
                {group.items.map((item) => (
                  <li className="flex gap-2" key={item}>
                    <Sparkles className="mt-1 size-4 shrink-0 text-[#d5a72f]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-[#b8860b]/30 bg-[#f0dfb7]/10 p-5">
          <h4 className="font-semibold text-[#f0dfb7]">Routine tracking plan</h4>
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            {recommendation.sixtyDayPlan.map((stage) => (
              <div className="rounded-md border border-white/12 bg-black/12 p-3" key={stage.day}>
                <p className="font-mono text-xs text-[#f0dfb7]">{stage.day}</p>
                <p className="mt-2 text-xs leading-5 text-[#FAF7F0]/70">{stage.focus}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs leading-5 text-[#FAF7F0]/58">{recommendation.disclaimer}</p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button
            className="bg-[#f0c76a] text-[#111611] hover:bg-[#f7d98b]"
            leadingIcon={<MessageCircle className="size-4" />}
            onClick={() => void openWhatsapp()}
            size="lg"
          >
            {c.send}
          </Button>
          <Button
            className="border-white/16 bg-white/8 text-[#FAF7F0] hover:bg-white/12"
            leadingIcon={<Download className="size-4" />}
            onClick={downloadSummary}
            size="lg"
            variant="secondary"
          >
            {c.download}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="overflow-hidden border-[#b8860b]/28 bg-[#071b0f] p-0 text-[#FAF7F0] shadow-[0_34px_90px_rgb(0_0_0/.28)]"
      variant="default"
    >
      <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="relative bg-[radial-gradient(circle_at_30%_20%,rgb(184_134_11/.32),transparent_30%),linear-gradient(150deg,#0b2814,#06140a)] p-6 sm:p-8">
          <Badge className="bg-[#f0dfb7] text-[#1C1C1C]" tone="accent">
            {c.subtitle}
          </Badge>
          <h3 className="mt-6 text-3xl font-semibold leading-tight">
            {locale === "fr"
              ? "Votre rituel commence par vos reponses."
              : "Your ritual starts with your answers."}
          </h3>
          <p className="mt-4 text-sm leading-7 text-[#FAF7F0]/72">{c.intro}</p>
          <div className="mt-8 grid gap-3 text-sm text-[#FAF7F0]/72">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 size-5 text-[#f0dfb7]" aria-hidden="true" />
              <span>{c.privacy}</span>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 size-5 text-[#f0dfb7]" aria-hidden="true" />
              <span>{c.medical}</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {!hasStarted ? (
            <div>
              <p className="text-sm leading-7 text-[#FAF7F0]/72">
                {locale === "fr"
                  ? "10 questions, une a la fois, puis un guide personnalise avec routine, alertes et suivi WhatsApp."
                  : "10 questions, one at a time, then a personalized guide with routine, warning signs, and WhatsApp follow-up."}
              </p>
              <Button
                className="mt-8 bg-[#f0c76a] text-[#111611] hover:bg-[#f7d98b]"
                onClick={() => setHasStarted(true)}
                size="lg"
                trailingIcon={<ArrowRight className="size-4" />}
              >
                {c.start}
              </Button>
            </div>
          ) : isContactStep ? (
            <div className="grid gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d5a72f]">
                  {c.contact}
                </p>
                <h4 className="mt-3 text-2xl font-semibold">{c.submit}</h4>
              </div>
              <Field className="text-[#FAF7F0]" label={c.name} required>
                <Input
                  className="border-white/14 bg-white/8 text-[#FAF7F0] placeholder:text-[#FAF7F0]/38"
                  value={customer.name}
                  onChange={(event) =>
                    setCustomer((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </Field>
              <Field className="text-[#FAF7F0]" label={c.phone} required>
                <Input
                  className="border-white/14 bg-white/8 text-[#FAF7F0] placeholder:text-[#FAF7F0]/38"
                  inputMode="tel"
                  value={customer.phone}
                  onChange={(event) =>
                    setCustomer((current) => ({ ...current, phone: event.target.value }))
                  }
                />
              </Field>
              <Field className="text-[#FAF7F0]" label={c.email}>
                <Input
                  className="border-white/14 bg-white/8 text-[#FAF7F0] placeholder:text-[#FAF7F0]/38"
                  type="email"
                  value={customer.email}
                  onChange={(event) =>
                    setCustomer((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </Field>
              <input
                aria-hidden="true"
                className="hidden"
                tabIndex={-1}
                value={company}
                onChange={(event) => setCompany(event.target.value)}
              />
              <label className="flex gap-3 rounded-md border border-white/12 bg-white/7 p-4 text-sm leading-6 text-[#FAF7F0]/72">
                <Checkbox
                  checked={consentGiven}
                  onCheckedChange={(checked) => setConsentGiven(checked === true)}
                />
                <span>{c.consent}</span>
              </label>
              {errorMessage ? (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-[#FAF7F0]">
                  {errorMessage}
                </p>
              ) : null}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="border-white/16 bg-white/8 text-[#FAF7F0] hover:bg-white/12"
                  leadingIcon={<ArrowLeft className="size-4" />}
                  onClick={() => setStep(questions.length - 1)}
                  variant="secondary"
                >
                  {c.back}
                </Button>
                <Button
                  className="bg-[#f0c76a] text-[#111611] hover:bg-[#f7d98b]"
                  disabled={!canSubmit}
                  isLoading={isSubmitting}
                  onClick={() => void submitConsultation()}
                >
                  {c.submit}
                </Button>
              </div>
            </div>
          ) : question ? (
            <div>
              <div className="mb-7">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#f0c76a] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#d5a72f]">
                  {step + 1} / {questions.length}
                </p>
                <h4 className="mt-3 text-2xl font-semibold leading-tight">
                  {question.prompt[locale]}
                </h4>
              </div>

              {question.mode === "text" ? (
                <Textarea
                  className="min-h-36 border-white/14 bg-white/8 text-[#FAF7F0] placeholder:text-[#FAF7F0]/38"
                  value={String(answers.previousProducts ?? "")}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      previousProducts: event.target.value,
                    }))
                  }
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const currentValue = answers[question.id] as
                      string | boolean | string[] | undefined;
                    const selected = Array.isArray(currentValue)
                      ? currentValue.includes(option.value)
                      : String(currentValue) === option.value ||
                        (question.id === "photoReview" &&
                          String(Boolean(currentValue)) === option.value);

                    return (
                      <button
                        className={cn(
                          "min-h-12 rounded-lg border border-white/12 bg-white/7 px-4 py-3 text-left text-sm font-semibold text-[#FAF7F0]/78 transition-colors hover:border-[#f0c76a]/70 hover:bg-[#f0c76a]/10",
                          selected && "border-[#f0c76a] bg-[#f0c76a]/18 text-[#f0dfb7]",
                        )}
                        key={option.value}
                        onClick={() =>
                          question.mode === "multi"
                            ? toggleMulti(question.id, option.value)
                            : setSingle(question.id, option.value)
                        }
                        type="button"
                      >
                        {option.label[locale]}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  className="border-white/16 bg-white/8 text-[#FAF7F0] hover:bg-white/12"
                  disabled={step === 0}
                  leadingIcon={<ArrowLeft className="size-4" />}
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                  variant="secondary"
                >
                  {c.back}
                </Button>
                <Button
                  className="bg-[#f0c76a] text-[#111611] hover:bg-[#f7d98b]"
                  disabled={!canContinue}
                  onClick={() => setStep((current) => current + 1)}
                  trailingIcon={<ArrowRight className="size-4" />}
                >
                  {c.next}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
