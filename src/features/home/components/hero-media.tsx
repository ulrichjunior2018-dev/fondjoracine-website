import Image from "next/image";

type HeroMediaProps = {
  alt: string;
  image: string;
  videoPoster: string;
  videoSrc?: string;
};

const blurDataUrl =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3QgZmlsbD0nIzA4MDcwNicgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2Jy8+PC9zdmc+";

export function HeroMedia({ alt, image, videoPoster, videoSrc }: HeroMediaProps) {
  if (videoSrc) {
    return (
      <video
        aria-label={alt}
        autoPlay
        className="h-full w-full object-cover object-[58%_center] sm:object-center"
        loop
        muted
        playsInline
        poster={videoPoster}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    );
  }

  return (
    <Image
      alt={alt}
      blurDataURL={blurDataUrl}
      className="object-cover object-[58%_center] sm:object-center"
      fill
      placeholder="blur"
      priority
      sizes="(min-width: 1024px) 50vw, 100vw"
      src={image}
    />
  );
}
