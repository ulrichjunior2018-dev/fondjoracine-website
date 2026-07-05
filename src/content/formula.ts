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

export const formulaIngredients: FormulaIngredient[] = [
  {
    chosen_for:
      "Choisie pour apporter une sensation de fraîcheur et accompagner le massage du cuir chevelu.",
    chosen_for_en: "Chosen to bring a fresh sensation and support scalp massage.",
    latin: "Mentha",
    name_en: "Mint",
    name_fr: "Menthe",
    properties: ["fraîcheur", "confort du cuir chevelu", "rituel tonifiant"],
    properties_en: ["freshness", "scalp comfort", "toning ritual"],
  },
  {
    chosen_for: "Choisi pour soutenir une routine racines-longueurs riche en actifs végétaux.",
    chosen_for_en: "Chosen to support a roots-to-lengths routine rich in plant actives.",
    latin: "Moringa oleifera",
    name_en: "Moringa",
    name_fr: "Moringa",
    properties: ["nutrition", "souplesse", "soin botanique"],
    properties_en: ["nutrition", "suppleness", "botanical care"],
  },
  {
    chosen_for: "Choisie pour renforcer la dimension protectrice du rituel sans alourdir la fibre.",
    chosen_for_en:
      "Chosen to reinforce the protective dimension of the ritual without weighing down the fibre.",
    latin: "Nigella sativa",
    name_en: "Black seed",
    name_fr: "Graine noire / Nigelle",
    properties: ["protection", "équilibre", "cuir chevelu"],
    properties_en: ["protection", "balance", "scalp"],
  },
  {
    chosen_for: "Choisi pour sa place traditionnelle dans les soins botaniques disciplinés.",
    chosen_for_en: "Chosen for its traditional place in disciplined botanical care.",
    latin: "Laurus nobilis",
    name_en: "Bay laurel",
    name_fr: "Laurier",
    properties: ["discipline", "tradition botanique", "confort"],
    properties_en: ["discipline", "botanical tradition", "comfort"],
  },
  {
    chosen_for: "Choisi pour nourrir la racine et aider à limiter la casse visible.",
    chosen_for_en: "Chosen to nourish the root and help limit visible breakage.",
    latin: "Ricinus communis",
    name_en: "Castor",
    name_fr: "Ricin",
    properties: ["racines", "nutrition", "casse"],
    properties_en: ["roots", "nutrition", "breakage"],
  },
  {
    chosen_for: "Choisi pour aider la fibre à retenir l'hydratation et gagner en brillance.",
    chosen_for_en: "Chosen to help the hair fibre retain hydration and gain shine.",
    latin: "Cocos nucifera",
    name_en: "Coconut",
    name_fr: "Coco",
    properties: ["hydratation", "brillance", "fibre capillaire"],
    properties_en: ["hydration", "shine", "hair fibre"],
  },
  {
    chosen_for: "Choisi pour sceller le soin et améliorer la douceur des pointes sèches.",
    chosen_for_en: "Chosen to seal in care and improve the softness of dry ends.",
    latin: "Olea europaea",
    name_en: "Olive",
    name_fr: "Olive",
    properties: ["douceur", "scellage", "pointes sèches"],
    properties_en: ["softness", "sealing", "dry ends"],
  },
  {
    chosen_for: "Choisie pour adoucir la fibre et améliorer la glisse à l'application.",
    chosen_for_en: "Chosen to soften the fibre and improve slip during application.",
    latin: "Prunus amygdalus dulcis",
    name_en: "Sweet almond",
    name_fr: "Amande douce",
    properties: ["glisse", "douceur", "application"],
    properties_en: ["slip", "softness", "application"],
  },
  {
    chosen_for: "Choisi pour nourrir les cheveux exigeants avec une texture riche.",
    chosen_for_en: "Chosen to nourish demanding hair with a rich texture.",
    latin: "Persea americana",
    name_en: "Avocado",
    name_fr: "Avocat",
    properties: ["nutrition", "souplesse", "conditionnement"],
    properties_en: ["nutrition", "suppleness", "conditioning"],
  },
  {
    chosen_for: "Choisi pour protéger les longueurs et donner un fini plus souple.",
    chosen_for_en: "Chosen to protect lengths and leave a more supple finish.",
    latin: "Argania spinosa",
    name_en: "Argan",
    name_fr: "Argan",
    properties: ["protection", "fini souple", "longueurs"],
    properties_en: ["protection", "supple finish", "lengths"],
  },
  {
    chosen_for: "Choisi pour équilibrer la sensation du cuir chevelu sans effet lourd.",
    chosen_for_en: "Chosen to balance the scalp feel without a heavy effect.",
    latin: "Simmondsia chinensis",
    name_en: "Jojoba",
    name_fr: "Jojoba",
    properties: ["équilibre", "légèreté", "cuir chevelu"],
    properties_en: ["balance", "lightness", "scalp"],
  },
];

export const formulaNote =
  "La liste n'est pas présentée comme un ordre de concentration ; l'ordre exact de l'étiquette attend confirmation du formulateur.";

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
