export type WhatsAppMessageKey = "consultation" | "diagnostic" | "order" | "wholesale";

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
      consultation: "Bonjour, je souhaite réserver une Consultation Privée.",
      diagnostic: (answers: string) =>
        `Bonjour 🌿 Voici mon diagnostic capillaire:\n${answers}\nQue me conseillez-vous?`,
      order: "Bonjour Maison Fondjo 🌿 Je souhaite commander le coffret Sève Racine.",
      wholesale: "Bonjour, je suis intéressé(e) par l'offre grossiste (MOQ 20).",
    },
    number:
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "[CLARISSE_CAMEROON_NUMBER, format 2376XXXXXXXX]",
  },
} as const;

export function formatXaf(amount: number) {
  return `${amount.toLocaleString("fr-FR").replace(/\u202f/g, " ")} F`;
}

export function buildWaLink(messageKey: WhatsAppMessageKey, dynamicText = "") {
  const message =
    messageKey === "diagnostic"
      ? config.whatsapp.messages.diagnostic(dynamicText)
      : messageKey === "consultation"
        ? dynamicText
          ? `${config.whatsapp.messages.consultation}\n${dynamicText}`
          : config.whatsapp.messages.consultation
        : messageKey === "wholesale"
          ? config.whatsapp.messages.wholesale
          : config.whatsapp.messages.order;
  const normalized = config.whatsapp.number.replace(/\D/g, "");

  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
