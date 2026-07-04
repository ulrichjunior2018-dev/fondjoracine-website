import { siteImages } from "@/lib/site-images";

export const advisorPricing = {
  consultationCreditXaf: "5 000 F",
  productXaf: "15 000 F",
  surMesureXaf: "25 000 F",
  wholesaleMoq: "MOQ 20",
  wholesaleUnitXaf: "9 000 F",
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
  herbariumCover: siteImages.mountCameroonRiverBottle,
  origin: siteImages.heroOrigin,
  product: siteImages.studioBottle,
  ritual: siteImages.nightRoutine,
  unboxing: siteImages.packingOrders,
  frontLabel: siteImages.frontLabel,
  backLabel: siteImages.backLabel,
  logo: siteImages.profileLogo,
} as const;

export const herbariumIngredients = [
  {
    chosenFor: "Fortifier la racine, nourrir le cuir chevelu et limiter la casse visible.",
    commonName: "Huile de ricin",
    latinName: "Ricinus communis",
    region: "Afrique de l'Ouest",
  },
  {
    chosenFor: "Apporter une nutrition profonde et du confort aux cuirs chevelus secs.",
    commonName: "Huile de karité",
    latinName: "Vitellaria paradoxa",
    region: "Afrique de l'Ouest",
  },
  {
    chosenFor: "Aider la fibre à retenir l'hydratation et donner une brillance naturelle.",
    commonName: "Huile de coco",
    latinName: "Cocos nucifera",
    region: "Tropiques",
  },
  {
    chosenFor: "Équilibrer la sensation du cuir chevelu sans alourdir les longueurs.",
    commonName: "Huile de jojoba",
    latinName: "Simmondsia chinensis",
    region: "Zones arides",
  },
  {
    chosenFor: "Nourrir les cheveux exigeants avec une texture riche en acides gras.",
    commonName: "Huile d'avocat",
    latinName: "Persea americana",
    region: "Tropiques",
  },
  {
    chosenFor: "Sceller l'hydratation et améliorer la douceur des pointes sèches.",
    commonName: "Huile d'olive",
    latinName: "Olea europaea",
    region: "Méditerranée",
  },
  {
    chosenFor: "Apporter une sensation de fraîcheur dans le rituel du cuir chevelu.",
    commonName: "Menthe poivrée",
    latinName: "Mentha piperita",
    region: "Europe / Afrique du Nord",
  },
  {
    chosenFor: "Soutenir la discipline du cuir chevelu dans une routine régulière.",
    commonName: "Romarin",
    latinName: "Salvia rosmarinus",
    region: "Méditerranée",
  },
  {
    chosenFor: "Compléter le soin des cheveux secs avec une note végétale légère.",
    commonName: "Moringa",
    latinName: "Moringa oleifera",
    region: "Afrique / Asie",
  },
  {
    chosenFor: "Adoucir la fibre et améliorer la glisse au moment de l'application.",
    commonName: "Amande douce",
    latinName: "Prunus amygdalus dulcis",
    region: "Méditerranée",
  },
  {
    chosenFor: "Aider à protéger les longueurs et à donner un fini plus souple.",
    commonName: "Argan",
    latinName: "Argania spinosa",
    region: "Maroc",
  },
] as const;

export function buildWhatsAppUrl(phone: string, message: string) {
  const normalized = phone.replace(/\D/g, "");

  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
