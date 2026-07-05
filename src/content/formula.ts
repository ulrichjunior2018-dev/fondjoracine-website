export type FormulaIngredient = {
  chosen_for: string;
  latin: string;
  name_fr: string;
  properties: string[];
};

export const formulaIngredients: FormulaIngredient[] = [
  {
    chosen_for:
      "Choisie pour apporter une sensation de fraîcheur et accompagner le massage du cuir chevelu.",
    latin: "Mentha",
    name_fr: "Menthe",
    properties: ["fraîcheur", "confort du cuir chevelu", "rituel tonifiant"],
  },
  {
    chosen_for: "Choisi pour soutenir une routine racines-longueurs riche en actifs végétaux.",
    latin: "Moringa oleifera",
    name_fr: "Moringa",
    properties: ["nutrition", "souplesse", "soin botanique"],
  },
  {
    chosen_for: "Choisie pour renforcer la dimension protectrice du rituel sans alourdir la fibre.",
    latin: "Nigella sativa",
    name_fr: "Graine noire / Nigelle",
    properties: ["protection", "équilibre", "cuir chevelu"],
  },
  {
    chosen_for: "Choisi pour sa place traditionnelle dans les soins botaniques disciplinés.",
    latin: "Laurus nobilis",
    name_fr: "Laurier",
    properties: ["discipline", "tradition botanique", "confort"],
  },
  {
    chosen_for: "Choisi pour nourrir la racine et aider à limiter la casse visible.",
    latin: "Ricinus communis",
    name_fr: "Ricin",
    properties: ["racines", "nutrition", "casse"],
  },
  {
    chosen_for: "Choisi pour aider la fibre à retenir l'hydratation et gagner en brillance.",
    latin: "Cocos nucifera",
    name_fr: "Coco",
    properties: ["hydratation", "brillance", "fibre capillaire"],
  },
  {
    chosen_for: "Choisi pour sceller le soin et améliorer la douceur des pointes sèches.",
    latin: "Olea europaea",
    name_fr: "Olive",
    properties: ["douceur", "scellage", "pointes sèches"],
  },
  {
    chosen_for: "Choisie pour adoucir la fibre et améliorer la glisse à l'application.",
    latin: "Prunus amygdalus dulcis",
    name_fr: "Amande douce",
    properties: ["glisse", "douceur", "application"],
  },
  {
    chosen_for: "Choisi pour nourrir les cheveux exigeants avec une texture riche.",
    latin: "Persea americana",
    name_fr: "Avocat",
    properties: ["nutrition", "souplesse", "conditionnement"],
  },
  {
    chosen_for: "Choisi pour protéger les longueurs et donner un fini plus souple.",
    latin: "Argania spinosa",
    name_fr: "Argan",
    properties: ["protection", "fini souple", "longueurs"],
  },
  {
    chosen_for: "Choisi pour équilibrer la sensation du cuir chevelu sans effet lourd.",
    latin: "Simmondsia chinensis",
    name_fr: "Jojoba",
    properties: ["équilibre", "légèreté", "cuir chevelu"],
  },
];

export const formulaNote =
  "La liste n'est pas présentée comme un ordre de concentration ; l'ordre exact de l'étiquette attend confirmation du formulateur.";
