import type { Metadata } from "next";

import { copy, getPublicCopy } from "@/content/copy";
import { openGraphLocale } from "@/lib/locale";
import { getServerLocale } from "@/lib/locale-server";

export async function resolvePublicCopy() {
  const locale = await getServerLocale();
  return { locale, publicCopy: getPublicCopy(locale) };
}

export async function resolveAdvisorCopy() {
  const locale = await getServerLocale();
  return { locale, copy: locale === "fr" ? copy.fr : copy.en };
}

export async function buildPublicMetadata(
  pick: (publicCopy: ReturnType<typeof getPublicCopy>) => { title: string; description: string },
): Promise<Metadata> {
  const { locale, publicCopy } = await resolvePublicCopy();
  const { title, description } = pick(publicCopy);

  return {
    title,
    description,
    openGraph: {
      description,
      locale: openGraphLocale(locale),
      title,
    },
  };
}
