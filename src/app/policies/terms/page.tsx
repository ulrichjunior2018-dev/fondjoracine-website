import type { Metadata } from "next";

import { PolicyDocument } from "@/components/policy-document";
import { buildPublicMetadata, resolvePublicCopy } from "@/lib/seo/public-route-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPublicMetadata((publicCopy) => publicCopy.metadata.terms);
}

export default async function TermsPage() {
  const { publicCopy } = await resolvePublicCopy();

  return (
    <PolicyDocument
      backHome={publicCopy.policies.backHome}
      kicker={publicCopy.policies.kicker}
      sections={publicCopy.policies.terms.sections}
      title={publicCopy.policies.terms.title}
    />
  );
}
