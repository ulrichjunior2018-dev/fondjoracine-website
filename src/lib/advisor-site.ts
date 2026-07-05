import { formulaIngredients } from "@/content/formula";
import { buildWaLink, config, formatXaf } from "@/lib/config";
import { siteImages } from "@/lib/site-images";

export const advisorPricing = {
  consultationCreditXaf: formatXaf(config.pricing.consultation),
  productXaf: formatXaf(config.pricing.seveRacine),
  surMesureXaf: formatXaf(config.pricing.surMesure),
  wholesaleMoq: "MOQ 20",
  wholesaleUnitXaf: formatXaf(config.pricing.wholesale),
} as const;

export const advisorNav = [
  ["Diagnostic", "/diagnostic"],
  ["Botanique", "/botanique"],
  ["Sève Racine", "/seve-racine"],
  ["Sur-mesure", "/sur-mesure"],
] as const;

export const advisorFooterLinks = [
  ["Grossistes", "/grossistes"],
  ["Contact", "/contact"],
  ["Livraison", "/policies/shipping"],
] as const;

export const advisorImages = {
  backLabel: siteImages.backLabel,
  frontLabel: siteImages.frontLabel,
  herbariumCover: siteImages.mountCameroonRiverBottle,
  logo: siteImages.profileLogo,
  origin: siteImages.heroOrigin,
  product: siteImages.studioBottle,
  ritual: siteImages.nightRoutine,
  unboxing: siteImages.packingOrders,
} as const;

export const herbariumIngredients = formulaIngredients.map((ingredient) => ({
  chosenFor: ingredient.chosen_for,
  commonName: ingredient.name_fr,
  latinName: ingredient.latin,
  properties: ingredient.properties,
  region: "Formule botanique",
}));

export function buildWhatsAppUrl(
  messageKey: Parameters<typeof buildWaLink>[0],
  dynamicText?: string,
) {
  return buildWaLink(messageKey, dynamicText);
}
