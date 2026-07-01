export const siteImages = {
  heroOrigin: "/images/hero-origin.png",
  studioReflection: "/images/studio-reflection.png",
  volcanicBottle: "/images/volcanic-bottle.png",
  marketLifestyle: "/images/market-lifestyle.png",
  nightRoutine: "/images/night-routine.png",
  barbershop: "/images/barbershop.png",
  packingOrders: "/images/packing-orders.png",
  frontLabel: "/images/front-label.png",
  backLabel: "/images/back-label.png",
  facebookCover: "/images/facebook-cover.png",
  profileLogo: "/images/profile-logo.png",
} as const;

export type SiteImageKey = keyof typeof siteImages;
