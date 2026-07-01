export const siteImages = {
  backLabel: "/images/back-label.jpg",
  barbershop: "/images/barbershop.jpg",
  facebookCover: "/images/facebook-cover.jpg",
  frontLabel: "/images/front-label.jpg",
  hero: "/images/hero-volcanic-bottle.jpg",
  marketLifestyle: "/images/market-lifestyle.jpg",
  nightRoutine: "/images/night-routine.jpg",
  originMountCameroon: "/images/mount-cameroon-origin.jpg",
  packingOrders: "/images/packing-orders.jpg",
  profileLogo: "/images/profile-logo.jpg",
  studioBottle: "/images/studio-reflection.jpg",
} as const;

export type SiteImageKey = keyof typeof siteImages;
