import { en as storefrontEn } from "@/i18n/dictionaries/en";
import { fr as storefrontFr } from "@/i18n/dictionaries/fr";

import { advisorCopy as advisorFr } from "./advisor-copy";

const publicFr = {
  errors: {
    genericMessage: "Un incident est survenu. Rechargez la page ou revenez par WhatsApp.",
    genericTitle: "La page n'a pas pu se charger",
    notFoundBody: "Cette page Maison Fondjo n'est pas disponible.",
    notFoundTitle: "Page introuvable",
  },
  metadata: {
    contact: {
      description:
        "Contact Maison Fondjo pour Sève Racine, la livraison au Cameroun, le suivi diagnostic et les questions de sécurité produit.",
      title: "Contact | Maison Fondjo",
    },
    faq: {
      description:
        "Réponses sur Sève Racine, les 11 botaniques, la livraison au Cameroun, la sécurité produit et l'assistance WhatsApp.",
      title: "FAQ | Maison Fondjo",
    },
    howToUse: {
      description:
        "Mode d'emploi de Sève Racine : quelques gouttes, racine, longueurs, barbe et geste mesuré.",
      title: "Mode d'emploi | Maison Fondjo",
    },
    origin: {
      description:
        "L'origine Maison Fondjo : Buea, le Mont Cameroun, le nom Fondjo et le sens de Racine.",
      title: "Origine | Maison Fondjo",
    },
    orderConfirmation: {
      description:
        "Confirmation de commande Maison Fondjo : paiement, référence Mobile Money et livraison au Cameroun.",
      title: "Confirmation | Maison Fondjo",
    },
    privacy: {
      description:
        "Comment Maison Fondjo protège les informations de commande, paiement, livraison et diagnostic.",
      title: "Confidentialité | Maison Fondjo",
    },
    returns: {
      description:
        "Conditions de retour Maison Fondjo : produit personnel, dommage vérifié à la livraison, échange étudié.",
      title: "Retours | Maison Fondjo",
    },
    shipping: {
      description:
        "Livraison Sève Racine au Cameroun : zones, frais confirmés avant paiement et coordination WhatsApp.",
      title: "Livraison | Maison Fondjo",
    },
    terms: {
      description:
        "Conditions Maison Fondjo pour utiliser le site, commander Sève Racine et vérifier le paiement.",
      title: "Conditions | Maison Fondjo",
    },
  },
  orderConfirmation: {
    actions: {
      backHome: "Retour à l'accueil",
      newOrder: "Commander à nouveau",
    },
    delivery: "Livraison",
    missing: {
      body: "Revenez au parcours de commande Sève Racine ou contactez l'assistance WhatsApp pour retrouver votre confirmation.",
      title: "Lien de confirmation absent",
    },
    paymentReference: "Référence",
    status: {
      cancelled: "Cette commande a été annulée.",
      confirmed: "Le paiement est confirmé. La commande passe ensuite en préparation.",
      delivered: "La commande est marquée comme livrée.",
      fallback:
        "Votre commande Maison Fondjo est reçue. Les paiements Mobile Money sont vérifiés avant confirmation.",
      packed: "La commande est préparée et attend la livraison.",
      payment_submitted: "La référence de paiement est reçue et attend la vérification.",
      pending_payment:
        "La commande est créée. Envoyez le paiement, puis ajoutez votre référence de transaction.",
      refunded: "Cette commande a été remboursée.",
      shipped: "La commande est en livraison.",
    },
    title: "Confirmation de commande",
  },
  contactPage: {
    cards: {
      email: {
        label: "Email",
        title: "Presse et administration",
      },
      safety: {
        label: "Sécurité",
        text: "Usage externe. Test cutané recommandé.",
        title: "Questions sécurité produit",
      },
      whatsapp: {
        label: "WhatsApp",
        title: "Livraison et conseil produit",
      },
    },
    heading: "Conseil produit, livraison au Cameroun, presse et sécurité.",
    intro:
      "Maison Fondjo travaille depuis Buea. WhatsApp reste le chemin le plus direct pour confirmer une zone de livraison, poser une question sur Sève Racine ou demander un suivi après diagnostic.",
    kicker: "Contact",
  },
  policies: {
    backHome: "Retour à l'accueil",
    kicker: "Politique",
    privacy: {
      body: [
        "Maison Fondjo collecte uniquement les informations nécessaires pour préparer Sève Racine, vérifier le paiement, coordonner la livraison au Cameroun, répondre sur WhatsApp et améliorer le diagnostic capillaire.",
        "Le paiement par carte, lorsqu'il est activé, est traité par Stripe. Les références MTN Mobile Money et Orange Money sont vérifiées avant confirmation.",
        "Pour corriger ou supprimer vos informations, contactez l'équipe par WhatsApp. Les dossiers utiles à la livraison, à la sécurité et au suivi client sont conservés avec mesure.",
      ],
      title: "Confidentialité",
    },
    returns: {
      body: [
        "Sève Racine est un soin personnel : un flacon ouvert ne peut pas être repris pour des raisons d'hygiène.",
        "Si un coffret arrive endommagé, incorrect ou incomplet, signalez-le à la livraison avec des photos claires. L'équipe étudie alors l'échange ou le remboursement.",
        "Les annulations sont examinées avant préparation. Après expédition, les conditions de livraison et d'hygiène limitent les options.",
      ],
      title: "Retours et échanges",
    },
    shipping: {
      body: [
        "Nous livrons dans tout le Cameroun. Frais de livraison à partir de 1 000 FCFA, selon votre distance de Buea.",
        "Le client fournit la ville, le quartier, le repère et le numéro WhatsApp avant validation.",
      ],
      title: "Livraison au Cameroun",
    },
    terms: {
      body: [
        "En commandant Sève Racine ou en contactant Maison Fondjo, vous acceptez de fournir des informations exactes pour la livraison et la vérification du paiement.",
        "Sève Racine est une huile cosmétique à usage externe. Elle ne diagnostique pas, ne traite pas, ne guérit pas et ne remplace pas un dermatologue.",
        "Maison Fondjo peut refuser, annuler ou rembourser une commande si le paiement ne peut pas être vérifié, si le stock est indisponible ou si la livraison ne peut pas être réalisée.",
      ],
      title: "Conditions d'utilisation",
    },
  },
} as const;

const publicEn = {
  errors: {
    genericMessage: "Something went wrong. Reload the page or return through WhatsApp.",
    genericTitle: "The page could not load",
    notFoundBody: "This Maison Fondjo page is not available.",
    notFoundTitle: "Page not found",
  },
  metadata: {
    contact: {
      description:
        "Contact Maison Fondjo for Sève Racine, delivery in Cameroon, diagnostic follow-up and product safety questions.",
      title: "Contact | Maison Fondjo",
    },
    faq: {
      description:
        "Answers about Sève Racine, the 11 botanicals, Cameroon delivery, product safety and WhatsApp assistance.",
      title: "FAQ | Maison Fondjo",
    },
    howToUse: {
      description:
        "How to use Sève Racine: a few drops, roots, lengths, beard and a measured gesture.",
      title: "How to use | Maison Fondjo",
    },
    origin: {
      description:
        "Maison Fondjo origin: Buea, Mount Cameroon, the Fondjo name and the meaning of Racine.",
      title: "Origin | Maison Fondjo",
    },
    orderConfirmation: {
      description:
        "Maison Fondjo order confirmation: payment, Mobile Money reference and delivery in Cameroon.",
      title: "Confirmation | Maison Fondjo",
    },
    privacy: {
      description:
        "How Maison Fondjo protects order, payment, delivery and diagnostic information.",
      title: "Privacy | Maison Fondjo",
    },
    returns: {
      description:
        "Maison Fondjo returns: personal product, damage verified at delivery, exchange reviewed.",
      title: "Returns | Maison Fondjo",
    },
    shipping: {
      description:
        "Sève Racine delivery in Cameroon: zones, fees confirmed before payment and WhatsApp coordination.",
      title: "Delivery | Maison Fondjo",
    },
    terms: {
      description:
        "Maison Fondjo terms for using the site, ordering Sève Racine and verifying payment.",
      title: "Terms | Maison Fondjo",
    },
  },
  orderConfirmation: {
    actions: {
      backHome: "Back home",
      newOrder: "Order again",
    },
    delivery: "Delivery",
    missing: {
      body: "Return to the Sève Racine order flow or contact WhatsApp assistance to recover your confirmation.",
      title: "Confirmation link missing",
    },
    paymentReference: "Reference",
    status: {
      cancelled: "This order has been cancelled.",
      confirmed: "Payment is confirmed. The order now moves into preparation.",
      delivered: "The order is marked as delivered.",
      fallback:
        "Your Maison Fondjo order has been received. Mobile Money payments are verified before confirmation.",
      packed: "The order is packed and awaiting delivery.",
      payment_submitted: "The payment reference has been received and awaits verification.",
      pending_payment: "The order is created. Send payment, then add your transaction reference.",
      refunded: "This order has been refunded.",
      shipped: "The order is out for delivery.",
    },
    title: "Order confirmation",
  },
  policies: {
    backHome: "Back home",
    kicker: "Policy",
    privacy: {
      body: [
        "Maison Fondjo collects only the information needed to prepare Sève Racine, verify payment, coordinate delivery in Cameroon, answer on WhatsApp and improve the hair diagnostic.",
        "Card payment, when enabled, is processed by Stripe. MTN Mobile Money and Orange Money references are verified before confirmation.",
        "To correct or delete your information, contact the team by WhatsApp. Records useful for delivery, safety and customer follow-up are kept with restraint.",
      ],
      title: "Privacy",
    },
    returns: {
      body: [
        "Sève Racine is a personal care product: an opened bottle cannot be returned for hygiene reasons.",
        "If a box arrives damaged, incorrect or incomplete, report it at delivery with clear photos. The team then reviews exchange or refund options.",
        "Cancellations are reviewed before preparation. After dispatch, delivery and hygiene conditions limit available options.",
      ],
      title: "Returns and exchanges",
    },
    shipping: {
      body: [
        "We deliver nationwide across Cameroon. Delivery fees start at 1,000 FCFA and increase with distance from Buea.",
        "The customer provides city, neighborhood, landmark and WhatsApp number before validation.",
      ],
      title: "Delivery in Cameroon",
    },
    terms: {
      body: [
        "By ordering Sève Racine or contacting Maison Fondjo, you agree to provide accurate information for delivery and payment verification.",
        "Sève Racine is a cosmetic oil for external use. It does not diagnose, treat, cure or replace a dermatologist.",
        "Maison Fondjo may refuse, cancel or refund an order if payment cannot be verified, stock is unavailable or delivery cannot be completed.",
      ],
      title: "Terms of use",
    },
  },
} as const;

const advisorEn = {
  footerLinks: [
    ["Wholesale", "/grossistes"],
    ["Contact", "/contact"],
    ["Delivery", "/policies/shipping"],
  ],
  nav: [
    ["Diagnostic", "/diagnostic"],
    ["Botanicals", "/botanique"],
    ["Sève Racine", "/seve-racine"],
    ["Bespoke", "/sur-mesure"],
  ],
  botanique: {
    body: "This QR destination presents 11 botanicals, Latin names, plant origin and the reason each belongs in Sève Racine.",
    chosenFor: "Chosen for",
    description:
      "Maison Fondjo herbarium: 11 Sève Racine ingredients, Latin names and botanical role.",
    eyebrow: "Digital herbarium",
    title: "Eleven ingredients. One precise botanical language.",
  },
  diagnostic: {
    ...advisorFr.diagnostic,
    eyebrow: "Maison Fondjo diagnostic",
    nextStep: "Your next step",
    privateBody:
      "Some signals need closer attention. The Private Consultation is offered at {price}, credited if a formula is then prepared.",
    privateTitle: "Private Consultation recommended.",
    redo: "Retake the diagnostic",
    standardBody:
      "Your main concern ({problem}) can be framed through Sève Racine with {botanicalOne} and {botanicalTwo}, without overload.",
    standardTitle: "Sève Racine can structure your ritual.",
    title: "Hair diagnostic | Maison Fondjo",
    description:
      "Maison Fondjo hair diagnostic in Buea before Sève Racine or a Private Consultation.",
    whatsapp: "Continue on WhatsApp",
    questions: [
      {
        id: "objectif",
        prompt: "What concerns you most today?",
        summaryLabel: "Concern",
        options: [
          { label: "Breakage", value: "casse" },
          { label: "Dryness", value: "secheresse" },
          { label: "Uncomfortable scalp", value: "cuir_chevelu" },
          {
            label: "Sudden shedding or sparse areas",
            severity: "serious",
            value: "chute_soudaine",
          },
        ],
      },
      {
        id: "texture",
        prompt: "Which description is closest to your hair?",
        summaryLabel: "Hair",
        options: [
          { label: "natural 4C", value: "naturels_4c" },
          { label: "Curly", value: "boucles" },
          { label: "Wavy", value: "ondules" },
          { label: "Fine or straight", value: "fins_lisses" },
        ],
      },
      {
        id: "routine",
        prompt: "Your current routine is mostly...",
        summaryLabel: "Routine",
        options: [
          { label: "Protective styles or braids", value: "protective_styles" },
          { label: "Regular wash day", value: "wash_day" },
          { label: "Beard and edges", value: "grooming" },
          { label: "Very irregular", value: "irreguliere" },
        ],
      },
      {
        id: "sensibilite",
        prompt: "Do you have pain, wounds, burning or a persistent reaction?",
        summaryLabel: "Scalp",
        options: [
          { label: "No", value: "non" },
          { label: "itching", value: "demangeaisons" },
          {
            label: "Yes, persistent pain or irritation",
            severity: "serious",
            value: "douleur_irritation",
          },
        ],
      },
      {
        id: "duree",
        prompt: "How long have you noticed this concern?",
        summaryLabel: "Duration",
        options: [
          { label: "less than one month", value: "moins_1_mois" },
          { label: "6 months", value: "6_mois" },
          { label: "more than one year", value: "plus_1_an" },
        ],
      },
    ],
  },
  grossistes: {
    cardMinimum: "Minimum order",
    cardPrice: "Professional unit price",
    cardValidation: "Direct validation",
    cta: "Contact on WhatsApp",
    description:
      "Maison Fondjo wholesale conditions: minimum 20, professional pricing and WhatsApp contact.",
    eyebrow: "Professional access",
    title: "Wholesalers and retailers.",
  },
  seveRacine: {
    ...advisorFr.seveRacine,
    alt: "Sève Racine bottle photographed in a reflective black studio",
    batchLine: "Numbered box — Founder Batch, 200 pieces",
    cta: "Order on WhatsApp",
    description: "Sève Racine by Maison Fondjo: numbered box, 15 000 F, Cameroon delivery.",
    intro:
      "One bottle, one box, one simple recommendation: place the oil where the fibre and scalp actually need it.",
    payment: ["MTN Mobile Money", "Orange Money"],
    shippingCards: [
      {
        label: "Cameroon delivery",
        text: "Nationwide delivery from 1,000 FCFA. Payment before delivery.",
      },
      {
        label: "Refund",
        text: "Damage verified at delivery only.",
      },
      {
        label: "Founder Batch",
        text: "200 numbered boxes.",
      },
    ],
    steps: ["Warm a few drops", "Massage the roots", "Finish lengths or beard"],
    title: "Sève Racine, prepared for the ritual.",
  },
  shell: {
    cta: "Diagnostic",
    footer: "Maison Fondjo · Rooted in nature. Made to last.",
    homeLabel: "Maison Fondjo home",
    logoAlt: "Maison Fondjo",
    place: "Buea, Cameroon",
  },
  texturePending: {
    body: "This area will host a Maison Fondjo photography series dedicated to real hair, without reusing one image for several textures.",
    label: "Real photography pending",
  },
  surMesure: {
    body: "Bespoke care gives structure to needs that require more than a standard bottle. It makes Sève Racine accessible, and the private formula exceptional.",
    cta: "Request a consultation",
    description:
      "Maison Fondjo bespoke care in Buea: diagnostic, Private Consultation and 25 000 F formula.",
    eyebrow: "The premium ceiling",
    steps: [
      ["01", "Diagnostic", "Understand texture, rhythm, scalp and limits."],
      ["02", "Consultation", "5 000 F, credited if the formula is prepared."],
      ["03", "Formula", "Bespoke preparation at 25 000 F."],
    ],
    title: "Diagnostic. Consultation. Formula.",
  },
};

const homeFr = {
  ...storefrontFr,
  formulaNote:
    "La liste n'est pas présentée comme un ordre de concentration ; l'ordre exact de l'étiquette attend confirmation du formulateur.",
  hero: {
    backgroundAlt: "Atmosphère botanique Maison Fondjo à Buea, près du Mont Cameroun",
    bottleAlt: "Flacon Sève Racine, huile capillaire botanique Maison Fondjo",
    eyebrow: "MAISON FONDJO — BUEA, CAMEROUN",
    primary: "Commencer mon diagnostic",
    secondary: "Découvrir Sève Racine",
    story: "Avant le flacon, nous commençons par vous écouter.",
    pending: "Photographie produit réelle en attente",
    titleFirst: "Onze racines.",
    titleSecond: "Une seule sève.",
    titleThird: "",
    trustLabel: "Repères du coffret Maison Fondjo",
    trustItems: [
      ["Coffret numéroté", "Lot Fondateur 2026, 200 exemplaires"],
      ["Ligne signature", "La famille Fondjo"],
      ["Marques paiement", "MTN Mobile Money + Orange Money"],
    ],
  },
  language: {
    bannerAccept: "Passer en français",
    bannerDismiss: "Continuer en anglais",
    bannerText: "On dirait que vous préférez le français",
    toggleLabel: "Switch language / Changer de langue",
  },
  shell: advisorFr.shell,
} as const;

const homeEn = {
  ...storefrontEn,
  formulaNote:
    "This list is not presented as concentration order; the exact label order awaits formulator confirmation.",
  hero: {
    backgroundAlt: "Maison Fondjo botanical atmosphere in Buea, near Mount Cameroon",
    bottleAlt: "Sève Racine bottle, Maison Fondjo botanical hair oil",
    eyebrow: "MAISON FONDJO — BUEA, CAMEROON",
    primary: "Start my diagnostic",
    secondary: "Discover Sève Racine",
    story: "Before the bottle, we begin by listening.",
    pending: "Real product photography pending",
    titleFirst: "Eleven roots.",
    titleSecond: "One sap.",
    titleThird: "",
    trustLabel: "Maison Fondjo box trust signals",
    trustItems: [
      ["Numbered box", "Founder Batch 2026, 200 pieces"],
      ["Founder signature", "The Fondjo family"],
      ["Payment marks", "MTN Mobile Money + Orange Money"],
    ],
  },
  language: {
    bannerAccept: "Switch to French",
    bannerDismiss: "Continue in English",
    bannerText: "It looks like you prefer French",
    toggleLabel: "Switch language / Changer de langue",
  },
  shell: advisorEn.shell,
} as const;

const diagnosticFr = {
  ...advisorFr.diagnostic,
  recommendation: {
    credited: "créditée",
    fallbackAnswer: "Non renseigné",
    for: "pour",
    privateDirection: "Consultation Privée recommandée",
    recommendationLabel: "Recommandation Sève Racine",
    recommendationText: "commencer par un rituel mesuré avec {botanicalOne} et {botanicalTwo}.",
    severityHigh: "élevée",
    severityStandard: "standard",
    summaryConcern: "Problème",
    summaryDirection: "Orientation",
    summaryHair: "Cheveux",
    summaryRoutine: "Routine",
    summaryScalp: "Cuir chevelu",
    summarySeverity: "Sévérité",
  },
} as const;

const diagnosticEn = {
  ...advisorEn.diagnostic,
  recommendation: {
    credited: "credited",
    fallbackAnswer: "Not provided",
    for: "for",
    privateDirection: "Private Consultation recommended",
    recommendationLabel: "Sève Racine recommendation",
    recommendationText: "start with a measured ritual using {botanicalOne} and {botanicalTwo}.",
    severityHigh: "high",
    severityStandard: "standard",
    summaryConcern: "Concern",
    summaryDirection: "Direction",
    summaryHair: "Hair",
    summaryRoutine: "Routine",
    summaryScalp: "Scalp",
    summarySeverity: "Severity",
  },
} as const;

export const copy = {
  en: {
    botanique: advisorEn.botanique,
    diagnostic: diagnosticEn,
    grossistes: advisorEn.grossistes,
    home: homeEn,
    seveRacine: advisorEn.seveRacine,
    surMesure: advisorEn.surMesure,
  },
  fr: {
    botanique: advisorFr.botanique,
    diagnostic: diagnosticFr,
    grossistes: advisorFr.grossistes,
    home: homeFr,
    seveRacine: advisorFr.seveRacine,
    surMesure: advisorFr.surMesure,
  },
} as const;

export type Locale = keyof typeof copy;

export const publicCopy = publicFr;
