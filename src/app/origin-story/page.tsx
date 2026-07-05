import {
  buildRouteMetadata,
  LandingRoutePage,
} from "@/features/elixir/components/landing-route-page";
import { publicCopy } from "@/content/copy";

export const metadata = buildRouteMetadata(
  publicCopy.metadata.origin.title,
  publicCopy.metadata.origin.description,
);

export default function OriginStoryPage() {
  return <LandingRoutePage />;
}
