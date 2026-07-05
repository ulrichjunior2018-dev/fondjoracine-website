export type WhatsAppMessageKey = "consultation" | "diagnostic" | "order" | "wholesale";
export type WhatsAppLocale = "en" | "fr";

export const config = {
  batch: { name: "Lot Fondateur 2026", size: 200 },
  contact_secondary: "",
  delivery: {
    max: 3_000,
    min: 500,
    policy: "Paiement avant livraison",
    refund: "Dommage vérifié à la livraison uniquement",
  },
  env: process.env.NEXT_PUBLIC_ENV ?? "staging",
  pricing: {
    consultation: 5_000,
    seveRacine: 15_000,
    surMesure: 25_000,
    wholesale: 9_000,
  },
  whatsapp: {
    messages: {
      en: {
        consultation: "Hello, I would like to book a Private Consultation.",
        diagnostic: (answers: string) =>
          `Hello 🌿 Here is my hair diagnostic:\n${answers}\nWhat do you recommend?`,
        order: "Hello Maison Fondjo 🌿 I would like to order the Sève Racine box.",
        wholesale: "Hello, I am interested in the wholesale offer (MOQ 20).",
      },
      fr: {
        consultation: "Bonjour, je souhaite réserver une Consultation Privée.",
        diagnostic: (answers: string) =>
          `Bonjour 🌿 Voici mon diagnostic capillaire:\n${answers}\nQue me conseillez-vous?`,
        order: "Bonjour Maison Fondjo 🌿 Je souhaite commander le coffret Sève Racine.",
        wholesale: "Bonjour, je suis intéressé(e) par l'offre grossiste (MOQ 20).",
      },
    },
    number:
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "[CLARISSE_CAMEROON_NUMBER, format 2376XXXXXXXX]",
  },
} as const;

export function formatXaf(amount: number) {
  return `${amount.toLocaleString("fr-FR").replace(/\u202f/g, " ")} F`;
}

export function buildWaLink(
  messageKey: WhatsAppMessageKey,
  dynamicText = "",
  locale: WhatsAppLocale = "fr",
) {
  const messages = config.whatsapp.messages[locale];
  const message =
    messageKey === "diagnostic"
      ? messages.diagnostic(dynamicText)
      : messageKey === "consultation"
        ? dynamicText
          ? `${messages.consultation}\n${dynamicText}`
          : messages.consultation
        : messageKey === "wholesale"
          ? messages.wholesale
          : messages.order;
  const normalized = config.whatsapp.number.replace(/\D/g, "");

  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
