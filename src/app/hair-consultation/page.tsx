import {
  buildRouteMetadata,
  LandingRoutePage,
} from "@/features/elixir/components/landing-route-page";

export const metadata = buildRouteMetadata(
  "Hair Consultation",
  "Start the free FONDJO RACINE hair consultation for cosmetic routine guidance and optional WhatsApp follow-up.",
);

export default function HairConsultationPage() {
  return <LandingRoutePage />;
}
