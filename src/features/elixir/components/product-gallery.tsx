import Image from "next/image";

import type { ElixirContent, Locale } from "@/features/elixir/data/content";
import { getPrimaryElixirImage, t } from "@/features/elixir/data/content";

type ProductGalleryProps = {
  content: ElixirContent;
  locale: Locale;
};

const blurDataUrl =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3QgZmlsbD0nIzA4MDcwNicgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PC9zdmc+";

export function ProductGallery({ content, locale }: ProductGalleryProps) {
  const primary = getPrimaryElixirImage(content);
  const secondary = content.images.at(1);

  return (
    <div className="grid gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-muted shadow-lifted">
        <Image
          alt={t(primary.alt, locale)}
          blurDataURL={blurDataUrl}
          className="object-cover transition-transform duration-700 ease-out hover:scale-[1.035]"
          fill
          placeholder="blur"
          priority
          sizes="(min-width: 1024px) 46vw, 100vw"
          src={primary.src}
        />
      </div>
      {secondary ? (
        <div className="grid grid-cols-[0.72fr_1fr] gap-3">
          <div className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {locale.startsWith("fr") ? "Prix" : "Price"}
            </p>
            <p className="mt-3 font-mono text-xl">{content.product.priceXaf}</p>
            <p className="mt-1 text-sm text-foreground/60">
              {locale.startsWith("fr")
                ? "Prix configure depuis la marque."
                : "Brand-configured price."}
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-muted">
            <Image
              alt={t(secondary.alt, locale)}
              blurDataURL={blurDataUrl}
              className="object-cover transition-transform duration-700 ease-out hover:scale-[1.035]"
              fill
              loading="lazy"
              placeholder="blur"
              sizes="(min-width: 1024px) 22vw, 55vw"
              src={secondary.src}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
