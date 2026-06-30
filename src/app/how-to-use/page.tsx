import {
  buildRouteMetadata,
  LandingRoutePage,
} from "@/features/elixir/components/landing-route-page";

export const metadata = buildRouteMetadata(
  "How To Use",
  "Learn how to apply SÈVE hair treatment oil with a careful scalp, hairline, beard, and protective-style routine.",
);

export default function HowToUsePage() {
  return <LandingRoutePage />;
}
