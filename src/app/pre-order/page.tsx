import {
  buildRouteMetadata,
  LandingRoutePage,
} from "@/features/elixir/components/landing-route-page";

export const metadata = buildRouteMetadata(
  "Pre-order Batch #001",
  "Pre-order FONDJO RACINE SÈVE Batch #001 for 8,500 XAF before the price returns to 9,500 XAF.",
);

export default function PreOrderPage() {
  return <LandingRoutePage />;
}
