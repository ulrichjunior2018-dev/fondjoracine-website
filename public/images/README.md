# FONDJO RACINE Production Image Slots

These filenames are the canonical website image slots. The files currently inspected in this
folder are branded title-card placeholders that say "UPLOAD FINAL IMAGE HERE"; replace each file
with the final exported photo or logo using the same filename.

- `hero-volcanic-bottle.jpg` - hero image and volcanic stone bottle slot
- `studio-reflection.jpg` - clean reflective studio product slot
- `mount-cameroon-origin.jpg` - Mount Cameroon / Buea origin slot
- `market-lifestyle.jpg` - market lifestyle slot
- `night-routine.jpg` - nighttime self-care candle slot
- `barbershop.jpg` - barbershop grooming slot
- `packing-orders.jpg` - packaging / order fulfillment slot
- `front-label.jpg` - bottle front label slot
- `back-label.jpg` - bottle back label slot
- `facebook-cover.jpg` - wide social/about banner slot
- `profile-logo.jpg` - navigation and social profile logo slot

Keep exports compressed for web: JPG, sRGB, 1600-2400px wide for campaign images, quality 75-85.
Next.js serves optimized AVIF/WebP variants from these originals.

Ingredient timeline nodes use local FONDJO campaign slots instead of stock photography. For the
final macro-photo version, replace the mapped files in
`src/features/elixir/components/premium-storefront-page.tsx` with actual FONDJO RACINE ingredient
macro exports under `/public/images`.
