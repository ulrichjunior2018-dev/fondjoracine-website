# FONDJO RACINE Production Image Slots

These filenames are the canonical website image slots. The files currently inspected in this
folder are the production campaign image assets used by the FONDJO RACINE website.

- `volcanic-bottle.png` - hero image and volcanic stone bottle slot
- `studio-reflection.png` - clean reflective studio product slot
- `hero-origin.png` - Mount Cameroon / Buea origin slot
- `market-lifestyle.png` - market lifestyle slot
- `night-routine.png` - nighttime self-care candle slot
- `barbershop.png` - barbershop grooming slot
- `packing-orders.png` - packaging / order fulfillment slot
- `front-label.png` - bottle front label slot
- `back-label.png` - bottle back label slot
- `facebook-cover.png` - wide social/about banner slot
- `profile-logo.png` - navigation and social profile logo slot

Keep future replacements lowercase and web-safe. Next.js serves optimized AVIF/WebP variants from
these originals.

Ingredient timeline nodes use local FONDJO campaign slots instead of stock photography. For the
final macro-photo version, replace the mapped files in
`src/features/elixir/components/premium-storefront-page.tsx` with actual FONDJO RACINE ingredient
macro exports under `/public/images`.
