export const siteImages = {
  originMountCameroon: "/images/hero-origin.png",
  studioBottle: "/images/studio-reflection.png",
  barbershop: "/images/lifestyle-barbershop.png",
  frontLabel: "/images/front-label.png",
  backLabel: "/images/bottle-back-label-v2.png",
  profileLogo: "/images/profile-logo.png",
  volcanicBottle: "/images/volcanic-bottle.png",
  hairTextureLifestyle: "/images/hair-texture-lifestyle.png",
  mountCameroonRiverBottle: "/images/mount-cameroon-river-bottle.png",
  monogramMf: "/images/monogram-mf-black.png",
  wordmarkLockup: "/images/wordmark-lockup.png",
  lifestyleScalpRitual: "/images/lifestyle-scalp-ritual.png",
  lifestyleDiaspora: "/images/lifestyle-diaspora-travel.png",
  lifestyleFatherChild: "/images/lifestyle-father-child.png",
  productMacro: "/images/product-macro-pipette.png",
  flatlayFormula: "/images/flatlay-formula-tools.png",
  lifestyleMotherChild: "/images/lifestyle-mother-child.png",
  originBueaHarvest: "/images/origin-buea-harvest.png",
} as const;

export type SiteImageKey = keyof typeof siteImages;
