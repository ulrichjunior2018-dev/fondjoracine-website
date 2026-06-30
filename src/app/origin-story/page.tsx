import {
  buildRouteMetadata,
  LandingRoutePage,
} from "@/features/elixir/components/landing-route-page";

export const metadata = buildRouteMetadata(
  "Origin Story",
  "Read the FONDJO RACINE origin story from Buea, Cameroon, at the base of Mount Cameroon.",
);

export default function OriginStoryPage() {
  return <LandingRoutePage />;
}
