import Image from "next/image";

type HeroMediaProps = {
  alt: string;
  image: string;
  videoPoster: string;
  videoSrc?: string;
};

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
      className="object-cover object-[58%_center] sm:object-center"
      fill
      priority
      sizes="(min-width: 1024px) 50vw, 100vw"
      src={image}
    />
  );
}
