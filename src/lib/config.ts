export type WhatsAppMessageKey = "consultation" | "diagnostic" | "order" | "support" | "wholesale";
export type WhatsAppLocale = "en" | "fr";

export const config = {
  batch: { name: "Lot Fondateur 2026", size: 150 },
  contact_secondary: "",
  delivery: {
    min: 1_000,
    policy: {
      en: "Payment before delivery",
      fr: "Paiement avant livraison",
    },
    refund: {
      en: "Damage verified at delivery only",
      fr: "Dommage vérifié à la livraison uniquement",
    },
    text: {
      en: "We deliver nationwide across Cameroon. Delivery fees start at 1,000 FCFA and increase with distance from Buea.",
      fr: "Nous livrons dans tout le Cameroun. Frais de livraison à partir de 1 000 FCFA, selon votre distance de Buea.",
    },
  },
  env: process.env.NEXT_PUBLIC_ENV ?? "staging",
  pricing: {
    consultation: 5_000,
    // Sève Racine ships in two sizes. `seveRacine` is kept as the 100ml
    // price for existing call sites that only need one number; anything
    // size-aware should use `seveRacineSizes` / `getSeveRacinePriceXaf`.
    seveRacine: 12_500,
    seveRacineSizes: {
      "100ml": 12_500,
      "50ml": 10_000,
    },
    surMesure: 25_000,
    wholesale: 9_000,
  },
  whatsapp: {
    messages: {
      en: {
        consultation: "Hello, I would like to book a Private Consultation.",
        diagnostic: (answers: string) =>
          `Hello 🌿 Here is my hair diagnostic:\n${answers}\nWhat do you recommend?`,
        order: (priceLabel: string) => `Hello, I would like to order Sève Racine (${priceLabel}).`,
        support: "Hello, I need help with my Maison Fondjo order or account.",
        wholesale: "Hello, I am interested in the wholesale offer (MOQ 20).",
      },
      fr: {
        consultation: "Bonjour, je souhaite réserver une Consultation Privée.",
        diagnostic: (answers: string) =>
          `Bonjour 🌿 Voici mon diagnostic capillaire:\n${answers}\nQue me conseillez-vous?`,
        order: (priceLabel: string) =>
          `Bonjour, je souhaite commander Sève Racine (${priceLabel}).`,
        support: "Bonjour, j’ai besoin d’aide pour ma commande ou mon compte Maison Fondjo.",
        wholesale: "Bonjour, je suis intéressé(e) par l'offre grossiste (MOQ 20).",
      },
    },
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "237682109136",
  },
} as const;

export function formatXaf(amount: number) {
  return `${amount.toLocaleString("fr-FR").replace(/\u202f/g, " ")} F`;
}

/** Sève Racine's two sizes. Keep in sync with `config.pricing.seveRacineSizes`. */
export type SeveRacineSize = "100ml" | "50ml";

export const SEVE_RACINE_SIZES: readonly SeveRacineSize[] = ["100ml", "50ml"];

export function getSeveRacinePriceXaf(size: SeveRacineSize = "100ml") {
  return config.pricing.seveRacineSizes[size];
}

export function buildWaLink(
  messageKey: WhatsAppMessageKey,
  dynamicText = "",
  locale: WhatsAppLocale = "en",
) {
  const messages = locale === "fr" ? config.whatsapp.messages.fr : config.whatsapp.messages.en;
  let message: string;

  switch (messageKey) {
    case "diagnostic":
      message = messages.diagnostic(dynamicText);
      break;
    case "consultation":
      message = dynamicText ? `${messages.consultation}\n${dynamicText}` : messages.consultation;
      break;
    case "support":
      message = messages.support;
      break;
    case "wholesale":
      message = messages.wholesale;
      break;
    default:
      message = messages.order(dynamicText || formatXaf(config.pricing.seveRacineSizes["100ml"]));
  }

  const normalized = config.whatsapp.number.replace(/\D/g, "");

  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
