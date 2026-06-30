import {
  buildRouteMetadata,
  LandingRoutePage,
} from "@/features/elixir/components/landing-route-page";

export const metadata = buildRouteMetadata(
  "Ingredients",
  "Review the botanical oils and extracts in FONDJO RACINE SÈVE, presented as cosmetic hair-care support.",
);

export default function IngredientsPage() {
  return <LandingRoutePage />;
}
