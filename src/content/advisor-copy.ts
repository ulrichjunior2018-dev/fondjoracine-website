import { config, formatXaf } from "@/lib/config";

const deliveryRange = `${formatXaf(config.delivery.min)}–${formatXaf(config.delivery.max)}`;
const batchName = config.batch.name.replace(/\s+2026$/, "");
const consultationPrice = formatXaf(config.pricing.consultation);
const surMesurePrice = formatXaf(config.pricing.surMesure);

export const advisorCopy = {
  footerLinks: [
    ["Grossistes", "/grossistes"],
    ["Contact", "/contact"],
    ["Livraison", "/policies/shipping"],
  ],
  nav: [
    ["Diagnostic", "/diagnostic"],
    ["Botanique", "/botanique"],
    ["Sève Racine", "/seve-racine"],
    ["Sur-mesure", "/sur-mesure"],
  ],
  botanique: {
    body: "Cette page sert de destination QR : 11 botaniques, noms latins, origine végétale et raison de présence dans Sève Racine.",
    chosenFor: "Choisi pour",
    description:
      "Herbier Maison Fondjo : 11 ingrédients de Sève Racine, noms latins et rôle botanique.",
    eyebrow: "Herbier digital",
    title: "Onze ingrédients. Un langage botanique précis.",
  },
  diagnostic: {
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
        prompt: "Votre routine actuelle est plutôt...",
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
    batchLine: `Coffret numéroté — ${batchName}, ${config.batch.size} exemplaires`,
    cta: "Commander sur WhatsApp",
    description: "Sève Racine par Maison Fondjo : coffret numéroté, 15 000 F, livraison Cameroun.",
    intro:
      "Un flacon, un coffret, une recommandation simple : placer l'huile là où la fibre et le cuir chevelu en ont réellement besoin.",
    payment: ["MTN Mobile Money", "Orange Money"],
    shippingCards: [
      {
        label: "Livraison Cameroun",
        text: `Zones ${deliveryRange}. ${config.delivery.policy}.`,
      },
      {
        label: "Remboursement",
        text: `${config.delivery.refund}.`,
      },
      {
        label: "Batch Fondateur",
        text: `${config.batch.size} coffrets numérotés.`,
      },
    ],
    steps: ["Chauffer quelques gouttes", "Masser la racine", "Finir longueurs ou barbe"],
    title: "Sève Racine, préparée pour le rituel.",
  },
  shell: {
    cta: "Diagnostic",
    footer: "Maison Fondjo · Enracinée dans la nature. Faite pour durer.",
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
    description:
      "Sur-mesure Maison Fondjo à Buea : diagnostic, Consultation Privée et formule à 25 000 F.",
    eyebrow: "Le plafond premium",
    steps: [
      ["01", "Diagnostic", "Comprendre la texture, le rythme, le cuir chevelu et les limites."],
      ["02", "Consultation", `${consultationPrice}, créditée si la formule est préparée.`],
      ["03", "Formule", `Préparation sur-mesure à ${surMesurePrice}.`],
    ],
    title: "Diagnostic. Consultation. Formule.",
  },
} as const;
