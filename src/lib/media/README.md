# `src/lib/media` — Media delivery registry

**Pattern:** descriptor + registry (see `docs/EXTENSIBILITY.md`)

Low-level Cloudinary client stays in `src/lib/cloudinary/`. This registry decides
_which_ backend is active so features do not hardcode Cloudinary forever.

## Add a provider

1. Create `providers/<id>.ts`
2. Register in `registry.ts`
3. Call `getActiveMediaProvider()` from services — do not import Cloudinary from UI
