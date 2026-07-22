import type { Metadata } from "next";

import { copy, getPublicCopy } from "@/content/copy";
import { siteConfig } from "@/config/site";
import { openGraphLocale } from "@/lib/locale";
import { getServerLocale } from "@/lib/locale-server";
import { buildShareMetadata } from "@/lib/seo/share-metadata";

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
    ...buildShareMetadata({
      description,
      locale: openGraphLocale(locale),
      title,
      url: siteConfig.url,
    }),
  };
}
