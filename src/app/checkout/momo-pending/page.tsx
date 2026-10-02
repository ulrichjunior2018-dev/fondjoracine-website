import type { Metadata } from "next";

import { getServerLocale } from "@/lib/locale-server";

import { MomoPendingClient } from "./momo-pending-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    title: locale === "fr" ? "Paiement en attente | Maison Fondjo" : "Payment pending | Maison Fondjo",
  };
}

const copy = {
  en: {
    checking: "Checking payment status…",
    failed: "Payment was not completed. You can try again or pay by card instead.",
    heading: "Check your phone",
    missing: "This payment link is invalid or has expired.",
    pending: "Approve the MTN MoMo prompt on your phone with your PIN to confirm payment.",
    retry: "Back to checkout",
    subheading: "We sent a payment request to your phone.",
    timedOut:
      "This is taking longer than expected. If you approved on your phone, give it a moment and refresh — otherwise, try again.",
  },
  fr: {
    checking: "Vérification du paiement…",
    failed: "Le paiement n'a pas abouti. Vous pouvez réessayer ou payer par carte.",
    heading: "Vérifiez votre téléphone",
    missing: "Ce lien de paiement est invalide ou a expiré.",
    pending:
      "Approuvez la demande MTN MoMo sur votre téléphone avec votre code PIN pour confirmer le paiement.",
    retry: "Retour au paiement",
    subheading: "Nous avons envoyé une demande de paiement à votre téléphone.",
    timedOut:
      "Cela prend plus de temps que prévu. Si vous avez approuvé sur votre téléphone, patientez puis actualisez — sinon, réessayez.",
  },
} as const;

type MomoPendingPageProps = {
  searchParams: Promise<{ ref?: string; token?: string }>;
};

export default async function MomoPendingPage({ searchParams }: MomoPendingPageProps) {
  const { ref, token } = await searchParams;
  const locale = await getServerLocale();
  const text = copy[locale === "fr" ? "fr" : "en"];

  if (!ref || !token) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-black px-6 text-center text-white">
        <div className="max-w-sm">
          <h1 className="font-serif text-2xl text-amber-400">{text.heading}</h1>
          <p className="mt-4 text-sm text-neutral-300">{text.missing}</p>
          <a
            className="mt-6 inline-block rounded-md border border-neutral-700 px-6 py-3 text-sm font-semibold text-white hover:border-amber-400"
            href="/checkout"
          >
            {text.retry}
          </a>
        </div>
      </div>
    );
  }

  return <MomoPendingClient copy={text} reference={ref} token={token} />;
}
