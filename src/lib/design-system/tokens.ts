export const typography = {
  display: "text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl",
  h1: "text-4xl font-semibold leading-[1.08] sm:text-5xl",
  h2: "text-3xl font-semibold leading-[1.12] sm:text-4xl",
  h3: "text-2xl font-semibold leading-[1.18]",
  h4: "text-xl font-semibold leading-[1.25]",
  body: "text-base leading-7",
  bodySmall: "text-sm leading-6",
  caption: "text-xs font-medium leading-5",
  mono: "font-mono text-sm leading-6",
} as const;

export const spacing = {
  px: "1px",
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
} as const;

export const containerWidths = {
  sm: "max-w-[var(--container-sm)]",
  md: "max-w-[var(--container-md)]",
  lg: "max-w-[var(--container-lg)]",
  xl: "max-w-[var(--container-xl)]",
  "2xl": "max-w-[var(--container-2xl)]",
  full: "max-w-none",
} as const;

export const grid = {
  editorial: "grid grid-cols-1 gap-6 lg:grid-cols-12",
  product: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4",
  dashboard: "grid grid-cols-1 gap-4 lg:grid-cols-12",
} as const;

export const animationDurations = {
  fast: "var(--duration-fast)",
  base: "var(--duration-base)",
  slow: "var(--duration-slow)",
} as const;
