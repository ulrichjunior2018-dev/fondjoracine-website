"use client";

import Image from "next/image";
import { useState } from "react";

import { Modal, ModalContent } from "@/components/ui/modal";
import type { ProductImage } from "@/domain/commerce/types";

type ProductGalleryProps = {
  images: ProductImage[];
  productTitle: string;
};

export function ProductGallery({ images, productTitle }: ProductGalleryProps) {
  const sortedImages = [...images].sort((a, b) => a.position - b.position);
  const [activeImage, setActiveImage] = useState<ProductImage | null>(sortedImages[0] ?? null);
  const [zoomImage, setZoomImage] = useState<ProductImage | null>(null);

  if (!activeImage) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-lg bg-surface-muted px-8 text-center text-sm text-foreground/58">
        Product imagery is being prepared for {productTitle}.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <button
        className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        onClick={() => setZoomImage(activeImage)}
        type="button"
      >
        <Image
          alt={activeImage.alt}
          className="object-cover"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          src={activeImage.url}
        />
        <span className="absolute bottom-4 right-4 rounded-md bg-background/90 px-3 py-2 text-xs font-medium text-foreground shadow-soft">
          Zoom
        </span>
      </button>
      {sortedImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {sortedImages.map((image) => (
            <button
              aria-label={`View ${image.alt}`}
              className="relative aspect-square overflow-hidden rounded-md bg-surface-muted ring-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring data-[active=true]:ring-2 data-[active=true]:ring-accent"
              data-active={image.id === activeImage.id}
              key={image.id}
              onClick={() => setActiveImage(image)}
              type="button"
            >
              <Image alt={image.alt} className="object-cover" fill sizes="8rem" src={image.url} />
            </button>
          ))}
        </div>
      ) : null}
      <Modal open={Boolean(zoomImage)} onOpenChange={(open) => !open && setZoomImage(null)}>
        {zoomImage ? (
          <ModalContent className="max-w-5xl p-3" title={productTitle}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface-muted">
              <Image
                alt={zoomImage.alt}
                className="object-contain"
                fill
                sizes="90vw"
                src={zoomImage.url}
              />
            </div>
          </ModalContent>
        ) : null}
      </Modal>
    </div>
  );
}
