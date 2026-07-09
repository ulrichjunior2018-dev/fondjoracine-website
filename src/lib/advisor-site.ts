import { formulaIngredients } from "@/content/formula";
import type { Locale } from "@/content/copy";
import { buildWaLink, config, formatXaf } from "@/lib/config";
import { pickLocale } from "@/lib/locale";
import { siteImages } from "@/lib/site-images";

export const advisorPricing = {
  consultationCreditXaf: formatXaf(config.pricing.consultation),
  productXaf: formatXaf(config.pricing.seveRacine),
  surMesureXaf: formatXaf(config.pricing.surMesure),
  wholesaleMoq: "MOQ 20",
  wholesaleUnitXaf: formatXaf(config.pricing.wholesale),
} as const;

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
  origin: siteImages.originMountCameroon,
  product: siteImages.studioBottle,
  ritual: siteImages.lifestyleScalpRitual,
  unboxing: siteImages.lifestyleDiaspora,
} as const;

export const herbariumIngredients = formulaIngredients.map((ingredient) => ({
  chosenFor: ingredient.chosen_for,
  chosenForEn: ingredient.chosen_for_en,
  commonName: ingredient.name_fr,
  commonNameEn: ingredient.name_en,
  latinName: ingredient.latin,
  properties: ingredient.properties,
  propertiesEn: ingredient.properties_en,
  region: "Formule botanique",
  regionEn: "Botanical formula",
}));

export function getHerbariumIngredientCopy(
  ingredient: (typeof herbariumIngredients)[number],
  locale: Locale,
) {
  return {
    chosenFor: pickLocale(locale, {
      english: ingredient.chosenForEn,
      french: ingredient.chosenFor,
    }),
    commonName: pickLocale(locale, {
      english: ingredient.commonNameEn,
      french: ingredient.commonName,
    }),
    region: pickLocale(locale, {
      english: ingredient.regionEn,
      french: ingredient.region,
    }),
  };
}

export function buildWhatsAppUrl(
  messageKey: Parameters<typeof buildWaLink>[0],
  dynamicText?: string,
  locale: Parameters<typeof buildWaLink>[2] = "fr",
) {
  return buildWaLink(messageKey, dynamicText, locale);
}
