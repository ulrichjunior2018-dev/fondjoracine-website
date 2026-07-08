export const colors = {
  gold: "#B8935A",
  goldBright: "#F0D860",
  goldDark: "#8C7435",
  goldMuted: "#A08040",
  greenWhatsapp: "#25D366",
  ivory: "#F5F0E8",
  ivoryDim: "#C8C0B0",
  ivoryGhost: "#888070",
  obsidian: "#0A0905",
  obsidianCard: "#0F0E0A",
  obsidianRaised: "#161410",
} as const;

export const typography = {
  body: {
    family: "Inter",
    fontSize: "14px",
    fontWeight: 300,
    lineHeight: 1.8,
  },
  bodyLarge: {
    family: "Inter",
    fontSize: "16px",
    fontWeight: 300,
    lineHeight: 1.9,
  },
  bodySmall: {
    family: "Inter",
    fontSize: "12px",
    fontWeight: 300,
    lineHeight: 1.7,
  },
  caption: {
    family: "Inter",
    fontSize: "10px",
    fontWeight: 400,
    letterSpacing: "0.2em",
  },
  displayHero: {
    family: "Cormorant Garamond",
    fontSize: "clamp(64px, 10vw, 120px)",
    fontWeight: 300,
  },
  displayLarge: {
    family: "Cormorant Garamond",
    fontSize: "clamp(40px, 6vw, 72px)",
    fontWeight: 300,
  },
  displayMedium: {
    family: "Cormorant Garamond",
    fontSize: "clamp(28px, 4vw, 48px)",
    fontWeight: 300,
  },
  displaySmall: {
    family: "Cormorant Garamond",
    fontSize: "clamp(20px, 3vw, 32px)",
    fontWeight: 300,
  },
  eyebrow: {
    casing: "uppercase",
    family: "Inter",
    fontSize: "10px",
    fontWeight: 500,
    letterSpacing: "0.4em",
  },
} as const;

export const spacing = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  6: "24px",
  8: "32px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
  32: "128px",
  40: "160px",
} as const;

export const borders = {
  goldHairline: "1px solid rgba(200,169,81,0.15)",
  goldMedium: "1px solid rgba(200,169,81,0.45)",
  goldStrong: "1px solid rgba(200,169,81,0.8)",
  goldSubtle: "1px solid rgba(200,169,81,0.25)",
} as const;

export const shadows = {
  elevationLg: "0 16px 80px rgba(0,0,0,0.6)",
  elevationMd: "0 8px 48px rgba(0,0,0,0.5)",
  elevationSm: "0 4px 24px rgba(0,0,0,0.4)",
  goldGlowLg: "0 0 64px rgba(200,169,81,0.25)",
  goldGlowMd: "0 0 32px rgba(200,169,81,0.3)",
  goldGlowSm: "0 0 16px rgba(200,169,81,0.2)",
} as const;

export const animations = {
  durationBase: "400ms",
  durationFast: "200ms",
  durationSlow: "700ms",
  durationSlower: "1000ms",
  easeLuxury: "cubic-bezier(0.23, 1, 0.32, 1)",
  easeSnap: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const designTokens = {
  animations,
  borders,
  colors,
  shadows,
  spacing,
  typography,
} as const;

export type DesignTokens = typeof designTokens;
