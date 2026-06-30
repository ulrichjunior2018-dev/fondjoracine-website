import {
  buildRouteMetadata,
  LandingRoutePage,
} from "@/features/elixir/components/landing-route-page";

export const metadata = buildRouteMetadata(
  "SÈVE Hair Treatment Oil",
  "Explore FONDJO RACINE SÈVE, the 100ml unisex hair treatment oil founded and made in Buea, Cameroon.",
);

export default function ProductPage() {
  return <LandingRoutePage />;
}
