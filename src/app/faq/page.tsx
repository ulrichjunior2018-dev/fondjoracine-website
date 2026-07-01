import {
  buildRouteMetadata,
  LandingRoutePage,
} from "@/features/elixir/components/landing-route-page";

export const metadata = buildRouteMetadata(
  "FAQ",
  "Answers about SÈVE shipping, safety, ingredients, and WhatsApp-assisted support.",
);

export default function FaqPage() {
  return <LandingRoutePage />;
}
