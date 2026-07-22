import type { Metadata } from "next";

import { PolicyDocument } from "@/components/policy-document";
import { buildPublicMetadata, resolvePublicCopy } from "@/lib/seo/public-route-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPublicMetadata((publicCopy) => publicCopy.metadata.shipping);
}

export default async function ShippingPage() {
  const { publicCopy } = await resolvePublicCopy();

  return (
    <PolicyDocument
      backHome={publicCopy.policies.backHome}
      kicker={publicCopy.policies.kicker}
      sections={publicCopy.policies.shipping.sections}
      title={publicCopy.policies.shipping.title}
    />
  );
}
