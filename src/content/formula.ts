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
      "Le menthol stimule les récepteurs du froid et favorise la microcirculation du cuir chevelu, rendant chaque application perceptible. Ses propriétés antimicrobiennes contribuent à maintenir un environnement sain à la racine.",
    chosen_for_en:
      "Menthol activates cold receptors and stimulates scalp microcirculation, making every application perceptible. Its antimicrobial properties help maintain a healthy environment at the root.",
    latin: "Mentha",
    name_en: "Mint",
    name_fr: "Menthe",
    properties: ["microcirculation", "confort du cuir chevelu", "action antimicrobienne"],
    properties_en: ["microcirculation", "scalp comfort", "antimicrobial action"],
  },
  {
    chosen_for:
      "L'huile de moringa est riche en acide béhénique, un acide gras rare qui gaine la fibre capillaire et facilite le démêlage. Sa teneur en vitamines A, C et E en fait un actif antioxydant efficace contre le stress oxydatif du cuir chevelu.",
    chosen_for_en:
      "Moringa oil is rich in behenic acid, a rare fatty acid that coats the hair shaft and eases detangling. Its vitamins A, C, and E content makes it an effective antioxidant against scalp oxidative stress.",
    latin: "Moringa oleifera",
    name_en: "Moringa",
    name_fr: "Moringa",
    properties: ["acide béhénique", "vitamines A·C·E", "protection antioxydante"],
    properties_en: ["behenic acid", "vitamins A·C·E", "antioxidant protection"],
  },
  {
    chosen_for:
      "La nigelle est concentrée en thymoquinone, un antioxydant puissant, et en acide linoléique (oméga-6) qui aide à restaurer l'équilibre hydrique du cuir chevelu. Utilisée traditionnellement pour les cheveux fragilisés, elle renforce la fibre sans la charger.",
    chosen_for_en:
      "Black seed is concentrated in thymoquinone, a potent antioxidant, and linoleic acid (omega-6) which helps restore the scalp's moisture balance. Traditionally used for weakened hair, it strengthens the fibre without weighing it down.",
    latin: "Nigella sativa",
    name_en: "Black seed",
    name_fr: "Graine noire / Nigelle",
    properties: ["thymoquinone", "acide linoléique (ω-6)", "équilibre hydrique"],
    properties_en: ["thymoquinone", "linoleic acid (ω-6)", "moisture balance"],
  },
  {
    chosen_for:
      "L'huile de laurier noble contient du cinéol et du linalol, des composés terpéniques qui assainissent le cuir chevelu et apportent une légère action apaisante. Elle est présente dans les rituels capillaires méditerranéens depuis des siècles.",
    chosen_for_en:
      "Bay laurel oil contains cineole and linalool, terpenic compounds that cleanse the scalp and provide a mild soothing action. It has been part of Mediterranean hair rituals for centuries.",
    latin: "Laurus nobilis",
    name_en: "Bay laurel",
    name_fr: "Laurier",
    properties: ["cinéol", "linalol", "action apaisante"],
    properties_en: ["cineole", "linalool", "soothing action"],
  },
  {
    chosen_for:
      "L'huile de ricin est exceptionnellement riche en acide ricinoléique (environ 89 %), un acide gras hydroxylé qui pénètre le cortex capillaire et aide à retenir l'humidité au niveau du follicule. Elle soutient la résistance de la fibre à la racine.",
    chosen_for_en:
      "Castor oil is exceptionally rich in ricinoleic acid (around 89%), a hydroxyl fatty acid that penetrates the hair cortex and helps retain moisture at the follicle level. It supports fibre resilience at the root.",
    latin: "Ricinus communis",
    name_en: "Castor",
    name_fr: "Ricin",
    properties: ["acide ricinoléique (89%)", "rétention d'humidité", "résistance à la racine"],
    properties_en: ["ricinoleic acid (89%)", "moisture retention", "root resilience"],
  },
  {
    chosen_for:
      "L'acide laurique de l'huile de coco a une affinité moléculaire unique avec la kératine : sa petite chaîne lui permet de pénétrer la fibre capillaire, réduisant la perte de protéines lors des manipulations. Elle réduit aussi les frottements inter-fibres.",
    chosen_for_en:
      "Coconut oil's lauric acid has a unique molecular affinity with keratin: its small chain allows it to penetrate the hair fibre, reducing protein loss during manipulation. It also reduces friction between fibres.",
    latin: "Cocos nucifera",
    name_en: "Coconut",
    name_fr: "Coco",
    properties: ["acide laurique", "affinité avec la kératine", "réduction de la casse"],
    properties_en: ["lauric acid", "keratin affinity", "breakage reduction"],
  },
  {
    chosen_for:
      "Riche en acide oléique (70 to 80 %) et en squalène, l'huile d'olive présente une haute affinité avec la cuticule capillaire. Elle scelle les écailles et améliore la douceur des longueurs, tandis que son hydroxytyrosol agit comme antioxydant.",
    chosen_for_en:
      "Rich in oleic acid (70 to 80%) and squalene, olive oil has a high affinity with the hair cuticle. It seals the scales and improves the softness of lengths, while its hydroxytyrosol acts as an antioxidant.",
    latin: "Olea europaea",
    name_en: "Olive",
    name_fr: "Olive",
    properties: ["acide oléique (70 to 80%)", "squalène", "hydroxytyrosol antioxydant"],
    properties_en: ["oleic acid (70 to 80%)", "squalene", "hydroxytyrosol antioxidant"],
  },
  {
    chosen_for:
      "L'huile d'amande douce est constituée à 70 % d'acide oléique et contient de l'acide linoléique. Légère et pénétrante, elle lisse la cuticule, améliore la glisse à l'application et rend la fibre plus souple sans résidu.",
    chosen_for_en:
      "Sweet almond oil is 70% oleic acid and also contains linoleic acid. Light and penetrating, it smooths the cuticle, improves slip during application, and leaves the fibre more supple with no residue.",
    latin: "Prunus amygdalus dulcis",
    name_en: "Sweet almond",
    name_fr: "Amande douce",
    properties: ["acide oléique (70%)", "acide linoléique", "glisse sans résidu"],
    properties_en: ["oleic acid (70%)", "linoleic acid", "slip with no residue"],
  },
  {
    chosen_for:
      "L'huile d'avocat contient de l'acide palmitoléique et des stérols végétaux dont le profil lipidique est proche du sébum humain. Elle pénètre profondément dans la fibre et soutient la barrière du cuir chevelu, particulièrement utile pour les textures denses.",
    chosen_for_en:
      "Avocado oil contains palmitoleic acid and plant sterols whose lipid profile is close to human sebum. It penetrates deeply into the fibre and supports the scalp barrier, particularly useful for dense textures.",
    latin: "Persea americana",
    name_en: "Avocado",
    name_fr: "Avocat",
    properties: ["acide palmitoléique", "stérols végétaux", "pénétration profonde"],
    properties_en: ["palmitoleic acid", "plant sterols", "deep penetration"],
  },
  {
    chosen_for:
      "L'huile d'argan est riche en tocophérols (vitamine E) et en acides gras insaturés. Oléique et linoléique. Qui protègent la fibre des agressions mécaniques et thermiques. Elle réduit les frottements entre mèches et donne un fini souple sans effet gras.",
    chosen_for_en:
      "Argan oil is rich in tocopherols (vitamin E) and unsaturated fatty acids. Oleic and linoleic. That protect the fibre from mechanical and thermal stress. It reduces friction between strands and gives a supple finish with no greasy feel.",
    latin: "Argania spinosa",
    name_en: "Argan",
    name_fr: "Argan",
    properties: ["tocophérols (vit. E)", "acides oléique et linoléique", "protection thermique"],
    properties_en: ["tocopherols (vit. E)", "oleic and linoleic acids", "thermal protection"],
  },
  {
    chosen_for:
      "Le jojoba est techniquement une cire liquide. Non une huile. Dont la structure en esters de cires mime celle du sébum humain. Il régule naturellement la production de sébum du cuir chevelu, est non-comédogène et ne laisse aucun résidu lourd.",
    chosen_for_en:
      "Jojoba is technically a liquid wax. Not an oil. Whose wax ester structure mimics human sebum. It naturally regulates scalp sebum production, is non-comedogenic, and leaves no heavy residue.",
    latin: "Simmondsia chinensis",
    name_en: "Jojoba",
    name_fr: "Jojoba",
    properties: ["cire liquide (esters de cires)", "régulation du sébum", "non-comédogène"],
    properties_en: ["liquid wax (wax esters)", "sebum regulation", "non-comedogenic"],
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
