import {
  buildRouteMetadata,
  LandingRoutePage,
} from "@/features/elixir/components/landing-route-page";

export const metadata = buildRouteMetadata(
  "FAQ",
  "Answers about SÈVE preorder, shipping, safety, ingredients, and WhatsApp-assisted ordering.",
);

export default function FaqPage() {
  return <LandingRoutePage />;
}
