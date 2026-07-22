import { config, formatXaf } from "@/lib/config";
import { buildMarketingNav } from "@/lib/marketing-nav";

const consultationPrice = formatXaf(config.pricing.consultation);
const surMesurePrice = formatXaf(config.pricing.surMesure);

export const advisorCopy = {
  footerLinks: [
    ["Grossistes", "/grossistes"],
    ["Contact", "/contact"],
    ["Livraison", "/policies/shipping"],
  ],
  nav: buildMarketingNav("fr"),
  botanique: {
    body: "Cette page sert de destination QR : un mélange riche d'huiles et d'herbes botaniques, noms latins, origine végétale et raison de présence dans Sève Racine.",
    chosenFor: "Choisi pour",
    description:
      "Herbier Maison Fondjo : les ingrédients de Sève Racine, noms latins et rôle botanique.",
    eyebrow: "Herbier digital",
    title: "Un langage botanique précis.",
  },
  diagnostic: {
    autreBack: "← Autre choix",
    autrePrompt: "Décrivez ce que vous ressentez",
    notesContinue: "Continuer",
    notesPlaceholder: "Facultatif",
    notesPrompt: "Autre chose à nous dire ?",
    eyebrow: "Diagnostic Maison Fondjo",
    nextStep: "Votre prochaine étape",
    privateBody:
      "Certains signaux demandent une écoute plus précise. La Consultation Privée est proposée à {price}, créditée si une formule est ensuite préparée.",
    privateTitle: "Consultation Privée recommandée.",
    redo: "Refaire le diagnostic",
    standardBody:
      "Votre problème principal ({problem}) peut être cadré par Sève Racine avec {botanicalOne} et {botanicalTwo}, sans surcharge.",
    standardTitle: "Sève Racine peut structurer votre rituel.",
    title: "Diagnostic cheveux | Maison Fondjo",
    description:
      "Diagnostic cheveux Maison Fondjo à Buea avant Sève Racine ou Consultation Privée.",
    whatsapp: "Continuer sur WhatsApp",
    questions: [
      {
        id: "objectif",
        prompt: "Qu'est-ce qui vous préoccupe le plus aujourd'hui ?",
        summaryLabel: "Problème",
        options: [
          { label: "Casse", value: "casse" },
          { label: "Sécheresse", value: "secheresse" },
          { label: "Cuir chevelu inconfortable", value: "cuir_chevelu" },
          {
            label: "Chute soudaine ou zones clairsemées",
            severity: "serious",
            value: "chute_soudaine",
          },
          {
            label: "Autre. Dites-nous",
            severity: "serious",
            value: "autre",
          },
        ],
      },
      {
        id: "texture",
        prompt: "Quelle description se rapproche le plus de vos cheveux ?",
        summaryLabel: "Cheveux",
        options: [
          { label: "naturels 4C", value: "naturels_4c" },
          { label: "Bouclés", value: "boucles" },
          { label: "Ondulés", value: "ondules" },
          { label: "Fins ou lisses", value: "fins_lisses" },
        ],
      },
      {
        id: "routine",
        prompt: "Votre routine actuelle est plutôt..",
        summaryLabel: "Routine",
        options: [
          { label: "Coiffures protectrices ou tresses", value: "protective_styles" },
          { label: "Jour de soin régulier", value: "wash_day" },
          { label: "Barbe et contours", value: "grooming" },
          { label: "Très irrégulière", value: "irreguliere" },
        ],
      },
      {
        id: "sensibilite",
        prompt: "Avez-vous douleur, plaies, brûlure ou réaction persistante ?",
        summaryLabel: "Cuir chevelu",
        options: [
          { label: "Non", value: "non" },
          { label: "démangeaisons", value: "demangeaisons" },
          {
            label: "Oui, douleur ou irritation persistante",
            severity: "serious",
            value: "douleur_irritation",
          },
        ],
      },
      {
        id: "duree",
        prompt: "Depuis combien de temps observez-vous ce problème ?",
        summaryLabel: "Durée",
        options: [
          { label: "moins d'un mois", value: "moins_1_mois" },
          { label: "6 mois", value: "6_mois" },
          { label: "plus d'un an", value: "plus_1_an" },
        ],
      },
    ],
  },
  grossistes: {
    cardMinimum: "Commande minimum",
    cardPrice: "Prix unitaire professionnel",
    cardValidation: "Validation directe",
    cta: "Contacter sur WhatsApp",
    description:
      "Conditions grossistes Maison Fondjo : minimum 20, tarif professionnel et contact WhatsApp.",
    eyebrow: "Accès professionnel",
    title: "Grossistes et revendeurs.",
  },
  seveRacine: {
    alt: "Flacon Sève Racine photographié en studio noir réfléchissant",
    batchLine: "Huile capillaire botanique, 100 ml",
    cta: "Commander maintenant",
    description: "Sève Racine par Maison Fondjo : huile capillaire botanique, 100 ml, 15 000 F.",
    intro:
      "Un flacon, un coffret, une recommandation simple : placer l'huile là où la fibre et le cuir chevelu en ont réellement besoin.",
    payment: ["MTN Mobile Money", "Orange Money"],
    shippingCards: [
      {
        label: "Livraison Cameroun",
        text: `${config.delivery.text.fr} ${config.delivery.policy.fr}.`,
      },
      {
        label: "Remboursement",
        text: `${config.delivery.refund.fr}.`,
      },
      {
        label: "Batch Fondateur",
        text: `${config.batch.size} coffrets numérotés.`,
      },
    ],
    steps: ["Chauffer quelques gouttes", "Masser la racine", "Finir longueurs ou barbe"],
    title: "Sève Racine",
    howToUse: {
      title: "Mode d'emploi",
      steps: [
        {
          num: "01",
          title: "Appliquer",
          text: "Quelques gouttes directement sur le cuir chevelu, les zones ciblées ou la longueur.",
        },
        {
          num: "02",
          title: "Masser",
          text: "3 à 5 minutes pour répartir l'huile et activer la microcirculation à la racine.",
        },
        {
          num: "03",
          title: "Laisser poser",
          text: "Plusieurs heures ou toute une nuit pour un soin en profondeur.",
        },
        {
          num: "04",
          title: "Fréquence",
          text: "2 à 4 fois par semaine. Test cutané recommandé à la première utilisation.",
        },
      ],
    },
  },
  shell: {
    cta: "Diagnostic",
    footer: "Maison Fondjo Enracinée dans la nature. Faite pour durer.",
    homeLabel: "Maison Fondjo accueil",
    logoAlt: "Maison Fondjo",
    place: "Buea, Cameroun",
  },
  texturePending: {
    body: "Cette zone accueillera une série photographique Maison Fondjo dédiée aux cheveux réels, sans réutiliser une même image pour plusieurs textures.",
    label: "Photographie réelle en attente",
  },
  surMesure: {
    body: "Le sur-mesure donne un cadre aux besoins qui demandent plus qu'un flacon standard. Il rend Sève Racine accessible, et la formule privée exceptionnelle.",
    cta: "Demander une consultation",
    description: `Sur-mesure Maison Fondjo à Buea : diagnostic, Consultation Privée et formule à ${surMesurePrice}.`,
    eyebrow: "Le plafond premium",
    steps: [
      ["01", "Diagnostic", "Comprendre la texture, le rythme, le cuir chevelu et les limites."],
      ["02", "Consultation", `${consultationPrice}, créditée si la formule est préparée.`],
      ["03", "Formule", `Préparation sur-mesure à ${surMesurePrice}.`],
    ],
    title: "Diagnostic. Consultation. Formule.",
  },
  histoire: {
    description:
      "Maison Fondjo est une maison de soins capillaires botaniques enracinée à Buea, Cameroun, foyer de Sève Racine et du nom de famille Fondjo.",
    eyebrow: "À propos",
    title: "Enracinée dans la nature. Faite pour durer.",
    origin: {
      label: "La maison",
      heading: "Buea, au pied du Mont Cameroun.",
      body: "Maison Fondjo est une maison de soins capillaires botaniques enracinée à Buea, Cameroun, au pied du Mont Cameroun, où le sol volcanique, l'altitude et la pluie tropicale façonnent les ingrédients avec lesquels nous travaillons.",
    },
    name: {
      label: "Le nom",
      heading: "Fondjo.",
      body: "Fondjo est un nom de famille, pas une marque inventée pour sonner d'une certaine façon. C'est le nom porté sur chaque étiquette, et l'exigence à laquelle nous nous tenons avec chaque flacon que nous fabriquons.",
    },
    product: {
      label: "Le produit",
      heading: "Sève Racine.",
      body: "Notre produit phare, Sève Racine, est né d'une conviction simple : des cheveux sains commencent par un cuir chevelu sain. Plutôt qu'une solution rapide, nous formulons des huiles et herbes botaniques pour nourrir le cuir chevelu, soutenir la fibre capillaire et aider à réduire la casse par un soin régulier et patient.",
    },
    family: {
      label: "Le début",
      heading: "Lot Fondateur, 2026.",
      body: "Fondée en 2026, chaque flacon est numéroté dans le cadre de notre Lot Fondateur, pressé et préparé à Buea. C'est le début du parcours Maison Fondjo. Notre vision est de continuer à bâtir des soins capillaires botaniques auxquels on peut faire confiance, faits avec retenue et sans raccourcis. Enracinée dans la nature. Faite pour durer.",
    },
    cta: "Commander Sève Racine",
    ctaSecondary: "Voir la formule botanique",
  },
} as const;
