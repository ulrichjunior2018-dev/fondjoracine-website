import {
  buildRouteMetadata,
  LandingRoutePage,
} from "@/features/elixir/components/landing-route-page";
import { publicCopy } from "@/content/copy";

export const metadata = buildRouteMetadata(
  publicCopy.metadata.howToUse.title,
  publicCopy.metadata.howToUse.description,
);

export default function HowToUsePage() {
  return <LandingRoutePage />;
}
