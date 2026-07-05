import {
  buildRouteMetadata,
  LandingRoutePage,
} from "@/features/elixir/components/landing-route-page";
import { publicCopy } from "@/content/copy";

export const metadata = buildRouteMetadata(
  publicCopy.metadata.faq.title,
  publicCopy.metadata.faq.description,
);

export default function FaqPage() {
  return <LandingRoutePage />;
}
