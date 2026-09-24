import type { Locale } from "@/content/copy";
import { pickLocale } from "@/lib/locale";

export type FormulaIngredient = {
  chosen_for: string;
  chosen_for_en: string;
  latin: string;
  name_en: string;
  name_fr: string;
  properties: string[];
  properties_en: string[];
};

// Formula composition is confidential. This file intentionally describes the
// ritual and origin, not individual ingredients — never list specific
// botanicals, ratios, or an exact ingredient count here or anywhere on-site.
export const formulaIngredients: FormulaIngredient[] = [
  {
    chosen_for:
      "Un mélange riche d'huiles et d'herbes botaniques, cueillies sur les pentes du Mont Cameroun et pressées à Buea — le socle de chaque flacon.",
    chosen_for_en:
      "A rich blend of botanical oils and herbs, gathered from the slopes of Mount Cameroon and pressed in Buea — the base every bottle starts from.",
    latin: "Cueilli à Buea",
    name_en: "Botanical Base",
    name_fr: "Base Botanique",
    properties: ["pression à froid", "petit lot", "origine Buea"],
    properties_en: ["cold-pressed", "small-batch", "Buea-sourced"],
  },
  {
    chosen_for:
      "Pensée pour agir d'abord sur le cuir chevelu — confort et circulation avant l'éclat, tel que le rituel a été conçu.",
    chosen_for_en:
      "Formulated to work with the scalp first — comfort and circulation before shine, the way the ritual was designed to be used.",
    latin: "Pensé pour la racine",
    name_en: "Scalp Ritual",
    name_fr: "Rituel du Cuir Chevelu",
    properties: ["cuir chevelu d'abord", "rituel quotidien"],
    properties_en: ["scalp-first", "daily ritual"],
  },
  {
    chosen_for:
      "Une application chauffée dans les paumes, travaillée de la racine aux pointes — le rituel complet prend moins de deux minutes.",
    chosen_for_en:
      "One warmed application, worked from root to length — the full ritual takes under two minutes.",
    latin: "Un geste, trois temps",
    name_en: "Root to Length",
    name_fr: "De la Racine aux Pointes",
    properties: ["rituel en 3 gestes", "moins de 2 minutes"],
    properties_en: ["3-step ritual", "under 2 minutes"],
  },
];

export function getFormulaIngredientCopy(ingredient: FormulaIngredient, locale: Locale) {
  return {
    chosenFor: pickLocale(locale, {
      english: ingredient.chosen_for_en,
      french: ingredient.chosen_for,
    }),
    name: pickLocale(locale, {
      english: ingredient.name_en,
      french: ingredient.name_fr,
    }),
  };
}
