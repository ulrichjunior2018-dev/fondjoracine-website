import type { Metadata } from "next";

import { PolicyDocument } from "@/components/policy-document";
import { buildPublicMetadata, resolvePublicCopy } from "@/lib/seo/public-route-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPublicMetadata((publicCopy) => publicCopy.metadata.privacy);
}

export default async function PrivacyPolicyPage() {
  const { publicCopy } = await resolvePublicCopy();

  return (
    <PolicyDocument
      backHome={publicCopy.policies.backHome}
      kicker={publicCopy.policies.kicker}
      sections={publicCopy.policies.privacy.sections}
      title={publicCopy.policies.privacy.title}
    />
  );
}
