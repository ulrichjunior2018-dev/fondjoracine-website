import type { Metadata } from "next";

import { LandingRoutePage } from "@/features/elixir/components/landing-route-page";
import { buildPublicMetadata, resolvePublicCopy } from "@/lib/seo/public-route-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPublicMetadata((publicCopy) => publicCopy.metadata.origin);
}

export default async function OriginStoryPage() {
  const { locale } = await resolvePublicCopy();
  return <LandingRoutePage locale={locale} />;
}
