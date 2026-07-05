import type {
  CreateHairConsultationInput,
  HairConsultationAnswersInput,
} from "@/domain/commerce/schemas";
import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { buildWaLink } from "@/lib/config";
import { getSupabaseAdminClient } from "@/lib/database/admin";
import { AppError } from "@/lib/errors/app-error";

export type HairConsultationRiskLevel = "low" | "medium" | "high";

export type HairConsultationRecommendation = {
  disclaimer: string;
  hairProfile: string;
  likelyCauses: string[];
  mainIssue: string;
  medicalReferral?: string;
  recommendedRoutine: string[];
  riskLevel: HairConsultationRiskLevel;
  sixtyDayPlan: Array<{
    day: string;
    focus: string;
  }>;
  warningSigns: string[];
  whatNotToDo: string[];
  whatToDo: string[];
  whatsappMessage: string;
};

export type HairConsultationRecord = {
  created_at: string;
  customer_name: string;
  email: string | null;
  id: string;
  phone: string;
  recommendation: HairConsultationRecommendation;
  risk_level: HairConsultationRiskLevel;
  whatsapp_followup_status: string;
};

export type HairConsultationProvider = {
  generate(
    input: CreateHairConsultationInput,
    content: ElixirContent,
  ): HairConsultationRecommendation | Promise<HairConsultationRecommendation>;
};

type Labels = Record<string, Record<Locale, string>>;

function localized(english: string, french: string): Record<Locale, string> {
  return { ["en"]: english, ["fr"]: french };
}

const labels: Labels = {
  "1_to_3_months": localized("1-3 months", "1 a 3 mois"),
  "3_to_6_months": localized("3-6 months", "3 a 6 mois"),
  "6_to_12_months": localized("6-12 months", "6 a 12 mois"),
  braided: localized("Braided", "Tresse"),
  braids: localized("Braids", "Tresses"),
  breakage: localized("Breakage", "Casse"),
  burning: localized("Burning", "Brulure"),
  daily: localized("Daily", "Chaque jour"),
  damaged_hair: localized("Damaged hair", "Cheveux abimes"),
  dandruff: localized("Dandruff", "Pellicules"),
  dryness: localized("Dryness", "Secheresse"),
  flaking: localized("Flaking", "Desquamation"),
  hair_shedding: localized("Hair shedding", "Chute de cheveux"),
  heat_damaged: localized("Heat-damaged", "Abime par la chaleur"),
  heavy_dandruff: localized("Heavy dandruff", "Pellicules importantes"),
  itching: localized("Itching", "Demangeaisons"),
  itchy_scalp: localized("Itchy scalp", "Cuir chevelu qui gratte"),
  less_than_1_month: localized("Less than 1 month", "Moins d un mois"),
  locs: localized("Locs", "Locs"),
  more_than_1_year: localized("More than 1 year", "Plus d un an"),
  multiple_times_weekly: localized("Multiple times weekly", "Plusieurs fois par semaine"),
  natural: localized("Natural", "Naturel"),
  natural_afro: localized("Natural afro", "Afro naturel"),
  never: localized("Never", "Jamais"),
  no: localized("No", "Non"),
  none: localized("None", "Aucun"),
  not_sure: localized("Not sure", "Pas sure"),
  once_weekly: localized("Once a week", "Une fois par semaine"),
  only_when_dry: localized("Only when hair feels dry", "Seulement quand c est sec"),
  pain: localized("Pain", "Douleur"),
  protective_styles: localized("Protective styles", "Coiffures protectrices"),
  rarely: localized("Rarely", "Rarement"),
  redness: localized("Redness", "Rougeur"),
  relaxed: localized("Relaxed", "Defrise"),
  relaxed_styles: localized("Relaxed styles", "Coiffures defrisees"),
  silk_press: localized("Silk press", "Silk press"),
  slow_growth: localized("Slow growth", "Pousse lente"),
  sores: localized("Sores", "Plaies"),
  thinning_edges: localized("Thinning edges", "Tempes clairsemees"),
  transitioning: localized("Transitioning", "Transition"),
  two_to_three_times_weekly: localized("2-3 times weekly", "2 a 3 fois par semaine"),
  weak_hair: localized("Weak hair", "Cheveux fragiles"),
  weaves: localized("Weaves", "Tissages"),
  weekly: localized("Weekly", "Chaque semaine"),
  wigs: localized("Wigs", "Perruques"),
  yes: localized("Yes", "Oui"),
};

function label(value: string, locale: Locale) {
  return labels[value]?.[locale] ?? value;
}

function hasAny(values: string[], candidates: string[]) {
  return candidates.some((candidate) => values.includes(candidate));
}

function getRiskLevel(answers: HairConsultationAnswersInput): HairConsultationRiskLevel {
  const symptoms = answers.scalpSymptoms;
  const hasUrgentSymptoms = hasAny(symptoms, ["pain", "burning", "sores", "redness"]);
  const persistentDandruffOrItch =
    hasAny(symptoms, ["heavy_dandruff", "itching", "flaking"]) &&
    ["3_to_6_months", "6_to_12_months", "more_than_1_year"].includes(answers.concernDuration);

  if (hasUrgentSymptoms || persistentDandruffOrItch) {
    return "high";
  }

  if (
    answers.sensitiveStatus !== "no" ||
    answers.heatUse === "multiple_times_weekly" ||
    answers.concernDuration === "more_than_1_year" ||
    hasAny(symptoms, ["itching", "flaking", "heavy_dandruff"])
  ) {
    return "medium";
  }

  return "low";
}

function createCopy(locale: Locale) {
  return {
    baseline: locale.startsWith("fr") ? "Jour 0" : "Day 0",
    day14: locale.startsWith("fr") ? "Jour 14" : "Day 14",
    day30: locale.startsWith("fr") ? "Jour 30" : "Day 30",
    day60: locale.startsWith("fr") ? "Jour 60" : "Day 60",
    day90: locale.startsWith("fr") ? "Jour 90" : "Day 90",
    disclaimer: locale.startsWith("fr")
      ? "Ce guide est une consultation capillaire cosmetique. Il ne pose pas de diagnostic medical, ne traite pas une maladie et ne remplace pas un dermatologue."
      : "This is a cosmetic hair-care consultation. It does not diagnose medical conditions, treat disease, or replace a dermatologist.",
    medicalReferral: locale.startsWith("fr")
      ? "Vos reponses signalent des symptomes qui meritent l avis d un dermatologue ou professionnel de sante qualifie avant d appliquer de nouveaux produits."
      : "Your answers include symptoms that should be reviewed by a licensed dermatologist or medical professional before applying new products.",
    usage: [
      locale.startsWith("fr")
        ? "Appliquez Sève Racine tous les 2 jours le soir."
        : "Apply Sève Racine every 2 days at night.",
      locale.startsWith("fr")
        ? "Utilisez 5 a 7 gouttes, puis massez le cuir chevelu pendant 5 minutes."
        : "Use 5-7 drops, then massage the scalp for 5 minutes.",
      locale.startsWith("fr")
        ? "Evitez de surappliquer; une petite quantite reguliere est preferable."
        : "Do not overapply; a small consistent amount is better.",
    ],
    warningSigns: [
      locale.startsWith("fr")
        ? "Douleur intense, brulure, plaies ouvertes, saignement ou rougeur qui s aggrave."
        : "Severe pain, burning, open wounds, bleeding, or worsening redness.",
      locale.startsWith("fr")
        ? "Chute soudaine par plaques, reaction allergique ou irritation persistante."
        : "Sudden patchy hair loss, allergic reaction, or persistent irritation.",
      locale.startsWith("fr")
        ? "Pellicules ou demangeaisons persistantes malgre une routine douce."
        : "Dandruff or itching that persists despite a gentle routine.",
    ],
  };
}

function buildConcernGuidance(
  answers: HairConsultationAnswersInput,
  locale: Locale,
): Pick<
  HairConsultationRecommendation,
  "likelyCauses" | "recommendedRoutine" | "whatNotToDo" | "whatToDo"
> {
  const en = locale.startsWith("en");
  const likelyCauses: string[] = [];
  const recommendedRoutine: string[] = [];
  const whatToDo: string[] = [];
  const whatNotToDo: string[] = [];

  if (answers.mainConcern === "slow_growth") {
    likelyCauses.push(
      en
        ? "Inconsistent scalp stimulation, dryness, or high-tension styles may be slowing visible progress."
        : "Une stimulation irreguliere du cuir chevelu, la secheresse ou les coiffures trop serrees peuvent freiner les progres visibles.",
    );
    recommendedRoutine.push(
      en
        ? "Massage scalp for 5 minutes and apply Sève Racine every 2 days."
        : "Massez le cuir chevelu 5 minutes et appliquez Sève Racine tous les 2 jours.",
    );
    whatToDo.push(
      en
        ? "Use protective styles that do not pull at the roots."
        : "Choisissez des coiffures protectrices qui ne tirent pas les racines.",
    );
    whatNotToDo.push(
      en
        ? "Avoid tight braids and tension around the edges."
        : "Evitez tresses trop serrees et tension aux tempes.",
    );
  }

  if (answers.mainConcern === "breakage" || answers.mainConcern === "weak_hair") {
    likelyCauses.push(
      en
        ? "Low moisture retention, rough detangling, heat, or dry combing can make strands snap."
        : "Une faible retention d hydratation, le demelage agressif, la chaleur ou le peignage a sec peuvent casser la fibre.",
    );
    recommendedRoutine.push(
      en
        ? "Use Sève Racine on the scalp and a light touch on dry ends after moisturizing."
        : "Utilisez Sève Racine sur le cuir chevelu et legerement sur les pointes apres hydratation.",
    );
    whatToDo.push(en ? "Detangle gently in sections." : "Demelez doucement par sections.");
    whatNotToDo.push(
      en
        ? "Avoid dry combing and excessive heat."
        : "Evitez le peignage a sec et la chaleur excessive.",
    );
  }

  if (answers.mainConcern === "dryness") {
    likelyCauses.push(
      en
        ? "Harsh cleansing, irregular oiling, or unsealed moisture may be contributing to dryness."
        : "Les shampoings agressifs, l huile irreguliere ou une hydratation non scellee peuvent contribuer a la secheresse.",
    );
    recommendedRoutine.push(
      en
        ? "Apply a small amount every 2 days and focus on consistency."
        : "Appliquez une petite quantite tous les 2 jours et restez reguliere.",
    );
    whatToDo.push(
      en
        ? "Use gentle shampoos and seal moisture."
        : "Utilisez des shampoings doux et scellez l hydratation.",
    );
    whatNotToDo.push(en ? "Avoid scratching the scalp." : "Evitez de gratter le cuir chevelu.");
  }

  if (answers.mainConcern === "itchy_scalp" || answers.mainConcern === "dandruff") {
    likelyCauses.push(
      en
        ? "Build-up, dryness, product sensitivity, or scalp imbalance may be involved."
        : "L accumulation, la secheresse, la sensibilite produit ou un desequilibre du cuir chevelu peuvent etre en cause.",
    );
    recommendedRoutine.push(
      en
        ? "Keep the routine light: cleanse gently, use small amounts, and stop if irritation increases."
        : "Gardez une routine legere : lavage doux, petites quantites, et arretez si l irritation augmente.",
    );
    whatToDo.push(
      en
        ? "Monitor itching and flakes weekly."
        : "Surveillez demangeaisons et pellicules chaque semaine.",
    );
    whatNotToDo.push(
      en
        ? "Do not layer many active oils at once."
        : "Ne superposez pas plusieurs huiles actives a la fois.",
    );
  }

  if (answers.mainConcern === "thinning_edges") {
    likelyCauses.push(
      en
        ? "Tension from braids, wigs, glue, or repeated pulling can stress the edges."
        : "La tension des tresses, perruques, colles ou tractions repetees peut fragiliser les tempes.",
    );
    recommendedRoutine.push(
      en
        ? "Massage edges gently with 5-7 drops across the scalp; use only a light touch on the hairline."
        : "Massez doucement les tempes avec 5 a 7 gouttes reparties sur le cuir chevelu; restez leger sur la ligne frontale.",
    );
    whatToDo.push(
      en
        ? "Sleep with a soft scarf and reduce tension styles."
        : "Dormez avec un foulard doux et reduisez les coiffures tendues.",
    );
    whatNotToDo.push(
      en ? "Avoid glue wigs on the edges." : "Evitez la colle de perruque sur les tempes.",
    );
  }

  if (answers.mainConcern === "damaged_hair" || answers.hairType === "heat_damaged") {
    likelyCauses.push(
      en
        ? "Heat styling and weakened ends may be reducing shine, elasticity, and length retention."
        : "La chaleur et les pointes fragilisees peuvent reduire brillance, elasticite et retention de longueur.",
    );
    recommendedRoutine.push(
      en
        ? "Reduce heat, deep condition regularly, and consider trims for ends that keep splitting."
        : "Reduisez la chaleur, faites des soins profonds et envisagez de couper les pointes tres fourchues.",
    );
    whatToDo.push(
      en
        ? "Choose protective styling while rebuilding consistency."
        : "Choisissez des coiffures protectrices pendant la reconstruction de la routine.",
    );
    whatNotToDo.push(
      en
        ? "Avoid weekly silk press or repeated direct heat."
        : "Evitez les silk press hebdomadaires ou la chaleur directe repetee.",
    );
  }

  return { likelyCauses, recommendedRoutine, whatNotToDo, whatToDo };
}

export function generateHairConsultationRecommendation(
  input: CreateHairConsultationInput,
  _content: ElixirContent,
): HairConsultationRecommendation {
  void _content;

  const locale = input.locale;
  const copy = createCopy(locale);
  const answers = input.answers;
  const riskLevel = getRiskLevel(answers);
  const concernGuidance = buildConcernGuidance(answers, locale);
  const en = locale.startsWith("en");
  const mainIssue = label(answers.mainConcern, locale);
  const hairProfile = en
    ? `${label(answers.hairType, locale)} hair, mostly wearing ${answers.styles
        .map((style) => label(style, locale).toLowerCase())
        .join(", ")}, with ${mainIssue.toLowerCase()} for ${label(
        answers.concernDuration,
        locale,
      ).toLowerCase()}.`
    : `Cheveux ${label(answers.hairType, locale).toLowerCase()}, surtout ${answers.styles
        .map((style) => label(style, locale).toLowerCase())
        .join(", ")}, avec ${mainIssue.toLowerCase()} depuis ${label(
        answers.concernDuration,
        locale,
      ).toLowerCase()}.`;
  const medicalReferral = riskLevel === "high" ? copy.medicalReferral : undefined;
  const routine = [...copy.usage, ...concernGuidance.recommendedRoutine];
  const warningSigns = copy.warningSigns;
  const likelyCauses =
    concernGuidance.likelyCauses.length > 0
      ? concernGuidance.likelyCauses
      : [
          en
            ? "Routine inconsistency, product build-up, styling tension, or dryness may be contributing factors."
            : "L irregularite, l accumulation de produit, la tension des coiffures ou la secheresse peuvent contribuer au probleme.",
        ];
  const whatsAppLines = [
    en
      ? "Hello Maison Fondjo, here is my hair consultation summary:"
      : "Bonjour Maison Fondjo, voici mon resume diagnostic capillaire :",
    `${en ? "Name" : "Nom"}: ${input.customer.name}`,
    `${en ? "Profile" : "Profil"}: ${hairProfile}`,
    `${en ? "Main issue" : "Probleme principal"}: ${mainIssue}`,
    `${en ? "Risk level" : "Niveau de risque"}: ${riskLevel.toUpperCase()}`,
    en
      ? "I would like human follow-up and product guidance."
      : "Je souhaite un suivi humain et des conseils produit.",
  ];

  if (input.answers.photoReview) {
    whatsAppLines.push(
      en
        ? "I can send a hair photo for review."
        : "Je peux envoyer une photo cheveux pour analyse.",
    );
  }

  return {
    disclaimer: copy.disclaimer,
    hairProfile,
    likelyCauses,
    mainIssue,
    ...(medicalReferral ? { medicalReferral } : {}),
    recommendedRoutine: routine,
    riskLevel,
    sixtyDayPlan: [
      {
        day: copy.baseline,
        focus: en
          ? "Take a baseline photo and begin the every-2-days night routine."
          : "Prenez une photo de depart et commencez la routine du soir tous les 2 jours.",
      },
      {
        day: copy.day14,
        focus: en
          ? "Check scalp comfort, dryness, and whether styling tension has reduced."
          : "Verifiez confort du cuir chevelu, secheresse et reduction de la tension coiffure.",
      },
      {
        day: copy.day30,
        focus: en
          ? "Compare shine, breakage, and routine consistency."
          : "Comparez brillance, casse et regularite de la routine.",
      },
      {
        day: copy.day60,
        focus: en
          ? "Review progress photos and adjust with Maison Fondjo support."
          : "Analysez les photos de progression et ajustez avec le support Maison Fondjo.",
      },
      {
        day: copy.day90,
        focus: en
          ? "Maintain the routine and request human WhatsApp follow-up if you need adjustments."
          : "Maintenez la routine et demandez un suivi WhatsApp humain si vous avez besoin d ajustements.",
      },
    ],
    warningSigns,
    whatNotToDo: [
      ...concernGuidance.whatNotToDo,
      en
        ? "Do not use Sève Racine on open wounds or active irritation."
        : "N appliquez pas Sève Racine sur plaies ouvertes ou irritation active.",
      en
        ? "Do not expect instant changes; track photos and routine habits."
        : "N attendez pas un changement instantane; suivez photos et habitudes.",
    ],
    whatToDo: [
      ...concernGuidance.whatToDo,
      en
        ? "Use a Day 0 photo and repeat checks at Day 14, 30, 60, and 90."
        : "Prenez une photo Jour 0 puis controlez Jour 14, 30, 60 et 90.",
      en
        ? "Message Maison Fondjo on WhatsApp if symptoms worsen or if you need routine help."
        : "Ecrivez a Maison Fondjo sur WhatsApp si les symptomes empirent ou si vous avez besoin d aide.",
    ],
    whatsappMessage: whatsAppLines.join("\n"),
  };
}

export const rulesBasedHairConsultationProvider: HairConsultationProvider = {
  generate: generateHairConsultationRecommendation,
};

export async function createHairConsultation(
  input: CreateHairConsultationInput,
  content: ElixirContent,
  provider: HairConsultationProvider = rulesBasedHairConsultationProvider,
) {
  if (input.company) {
    throw new AppError("BAD_REQUEST", "Unable to process consultation.");
  }

  const recommendation = await provider.generate(input, content);
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("hair_consultations")
    .insert({
      answers: input.answers,
      consent_given: input.consentGiven,
      customer_name: input.customer.name,
      email: input.customer.email || null,
      locale: input.locale,
      phone: input.customer.phone,
      recommendation,
      risk_level: recommendation.riskLevel,
    })
    .select(
      "id, customer_name, phone, email, recommendation, risk_level, whatsapp_followup_status, created_at",
    )
    .single<HairConsultationRecord>();

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }

  return {
    consultation: data,
    whatsappUrl: buildWaLink("diagnostic", recommendation.whatsappMessage),
  };
}

export async function markHairConsultationWhatsappClicked(id: string) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("hair_consultations")
    .update({ whatsapp_followup_status: "clicked" })
    .eq("id", id);

  if (error) {
    throw new AppError("BAD_REQUEST", error.message);
  }
}
