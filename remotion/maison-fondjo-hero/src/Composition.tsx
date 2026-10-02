import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const sourceVideo = staticFile("assets/source-hero.mov");
const fps = 30;
const durationInFrames = 360;

const colors = {
  black: "#0B0B0B",
  pureBlack: "#020202",
  antiqueGold: "#B8935A",
  brightGold: "#C9A24B",
  ivory: "#F5EFE3",
  cream: "#E4D2B4",
  forest: "#07130D",
};

const softEase = Easing.bezier(0.16, 1, 0.3, 1);

type HeroVariant = "desktop" | "mobile";
type HeroProps = { variant: HeroVariant; showCopy: boolean };

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="MaisonFondjoHeroDesktop"
        component={MaisonFondjoHero}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{ variant: "desktop" as HeroVariant, showCopy: true }}
      />
      <Composition
        id="MaisonFondjoHeroMobile"
        component={MaisonFondjoHero}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{ variant: "mobile" as HeroVariant, showCopy: true }}
      />
      <Composition
        id="MaisonFondjoHeroDesktopClean"
        component={MaisonFondjoHero}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{ variant: "desktop" as HeroVariant, showCopy: false }}
      />
      <Composition
        id="MaisonFondjoHeroMobileClean"
        component={MaisonFondjoHero}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{ variant: "mobile" as HeroVariant, showCopy: false }}
      />
      <Composition
        id="SourceInspect"
        component={SourceInspect}
        durationInFrames={durationInFrames}
        fps={fps}
        width={464}
        height={832}
      />
    </>
  );
};

export const SourceInspect = () => {
  return <Video src={sourceVideo} style={{ width: "100%", height: "100%" }} objectFit="cover" muted />;
};

export const MaisonFondjoHero: React.FC<HeroProps> = ({ variant, showCopy }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isDesktop = variant === "desktop";

  const openingFade = interpolate(frame, [0, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: softEase,
  });

  const endFade = interpolate(frame, [durationInFrames - 45, durationInFrames - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: softEase,
  });

  const overallOpacity = openingFade * endFade;
  const slowPush = interpolate(frame, [0, durationInFrames], [1.03, 1.13], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const mainScale = interpolate(frame, [0, durationInFrames], [isDesktop ? 0.98 : 1.02, isDesktop ? 1.04 : 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    output: "perceptual-scale",
  });

  const titleOpacity = interpolate(frame, [24, 70, 285, 330], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: [softEase, Easing.linear, softEase],
  });

  const lineScale = interpolate(frame, [42, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: softEase,
  });

  const safeX = isDesktop ? 116 : 82;
  const safeY = isDesktop ? 96 : 132;
  const mainVideoWidth = isDesktop ? 610 : width;
  const mainVideoHeight = isDesktop ? 1030 : height;
  const mainLeft = isDesktop ? width - mainVideoWidth - 135 : 0;
  const mainTop = isDesktop ? 25 : 0;
  const shimmerX = interpolate(frame, [0, durationInFrames], [isDesktop ? width * 0.57 : -180, isDesktop ? width * 0.91 : width + 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.pureBlack, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          opacity: overallOpacity * (isDesktop ? 0.72 : 0.5),
          scale: slowPush,
          filter: "blur(34px) saturate(0.74) contrast(1.22) brightness(0.34)",
        }}
      >
        <Video src={sourceVideo} muted loop style={{ width: "100%", height: "100%" }} objectFit="cover" />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 72% 36%, rgba(245,239,227,0.2) 0%, rgba(184,147,90,0.15) 18%, rgba(11,11,11,0) 42%), radial-gradient(circle at 77% 58%, rgba(184,147,90,0.22) 0%, rgba(184,147,90,0.06) 24%, rgba(11,11,11,0) 50%), linear-gradient(90deg, rgba(2,2,2,0.98) 0%, rgba(7,19,13,0.94) 34%, rgba(11,11,11,0.62) 62%, rgba(2,2,2,0.9) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          opacity: isDesktop ? 0.92 : 0.74,
          background:
            "radial-gradient(ellipse at 74% 47%, rgba(255,244,214,0.16) 0%, rgba(184,147,90,0.08) 18%, rgba(0,0,0,0) 43%), radial-gradient(ellipse at 80% 72%, rgba(255,244,214,0.1) 0%, rgba(184,147,90,0.05) 18%, rgba(0,0,0,0) 38%)",
          mixBlendMode: "screen",
        }}
      />

      <AbsoluteFill
        style={{
          opacity: isDesktop ? 0.23 : 0.18,
          backgroundImage:
            "linear-gradient(rgba(245,239,227,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,239,227,0.04) 1px, transparent 1px)",
          backgroundSize: isDesktop ? "78px 78px" : "62px 62px",
          maskImage: "linear-gradient(90deg, black 0%, rgba(0,0,0,0.58) 42%, transparent 88%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: mainLeft,
          top: mainTop,
          width: mainVideoWidth,
          height: mainVideoHeight,
          opacity: overallOpacity,
          scale: mainScale,
          filter: "contrast(1.14) saturate(0.88) brightness(0.96)",
          borderRadius: isDesktop ? 2 : 0,
          overflow: "hidden",
          boxShadow: isDesktop
            ? "0 0 42px rgba(245,239,227,0.08), 0 0 120px rgba(184,147,90,0.28), 0 54px 150px rgba(0,0,0,0.82)"
            : "inset 0 -280px 240px rgba(2,2,2,0.82), 0 0 92px rgba(184,147,90,0.18)",
        }}
      >
        <Video src={sourceVideo} muted loop style={{ width: "100%", height: "100%" }} objectFit="cover" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.26) 0%, rgba(0,0,0,0.03) 39%, rgba(255,245,220,0.12) 50%, rgba(0,0,0,0.14) 100%), radial-gradient(ellipse at 58% 24%, rgba(255,244,214,0.2) 0%, rgba(184,147,90,0.1) 14%, rgba(0,0,0,0) 34%), radial-gradient(ellipse at 54% 70%, rgba(255,244,214,0.24) 0%, rgba(255,244,214,0.12) 16%, rgba(0,0,0,0) 38%)",
            mixBlendMode: "soft-light",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 55% 68%, rgba(245,239,227,0.42) 0%, rgba(245,239,227,0.22) 18%, rgba(245,239,227,0.06) 36%, rgba(0,0,0,0) 52%)",
            mixBlendMode: "screen",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 48%, rgba(0,0,0,0.46) 100%)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: shimmerX,
          top: isDesktop ? 10 : 0,
          width: isDesktop ? 120 : 80,
          height: isDesktop ? 1040 : 1920,
          opacity: interpolate(frame, [36, 76, 210, 280], [0, 0.18, 0.14, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: [softEase, Easing.linear, softEase],
          }),
          rotate: isDesktop ? "8deg" : "4deg",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,248,222,0.42) 48%, rgba(255,255,255,0) 100%)",
          filter: "blur(18px)",
          mixBlendMode: "screen",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isDesktop
            ? "linear-gradient(90deg, rgba(2,2,2,0.04) 0%, rgba(2,2,2,0.14) 44%, rgba(2,2,2,0.46) 76%, rgba(2,2,2,0.9) 100%), radial-gradient(ellipse at center, rgba(0,0,0,0) 38%, rgba(0,0,0,0.34) 100%)"
            : "linear-gradient(180deg, rgba(2,2,2,0.04) 0%, rgba(2,2,2,0.1) 42%, rgba(2,2,2,0.92) 100%), radial-gradient(ellipse at center, rgba(0,0,0,0) 32%, rgba(0,0,0,0.42) 100%)",
        }}
      />

      {showCopy ? (
        <BrandLockup
          x={safeX}
          y={safeY}
          titleOpacity={titleOpacity}
          lineScale={lineScale}
          isDesktop={isDesktop}
        />
      ) : (
        <MinimalMark titleOpacity={titleOpacity} lineScale={lineScale} isDesktop={isDesktop} />
      )}

      {showCopy ? (
        <div
          style={{
            position: "absolute",
            left: isDesktop ? safeX : 82,
            bottom: isDesktop ? 96 : 128,
            opacity: titleOpacity * 0.9,
            color: colors.cream,
            fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: isDesktop ? 24 : 32,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            translate: `0 ${interpolate(frame, [24, 82], [24, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: softEase,
            })}px`,
          }}
        >
          Buea, Cameroon · Botanical hair oil
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          right: isDesktop ? 96 : 70,
          bottom: isDesktop ? 92 : 74,
          width: isDesktop ? 84 : 92,
          height: 1,
          backgroundColor: colors.antiqueGold,
          opacity: titleOpacity,
          transform: `scaleX(${lineScale})`,
          transformOrigin: "right center",
        }}
      />
    </AbsoluteFill>
  );
};

const MinimalMark: React.FC<{
  titleOpacity: number;
  lineScale: number;
  isDesktop: boolean;
}> = ({ titleOpacity, lineScale, isDesktop }) => {
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: isDesktop ? 112 : 70,
          top: isDesktop ? 86 : 86,
          opacity: titleOpacity * 0.72,
          display: "flex",
          alignItems: "center",
          gap: isDesktop ? 18 : 22,
          color: colors.cream,
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          fontSize: isDesktop ? 15 : 22,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            width: isDesktop ? 40 : 58,
            height: isDesktop ? 40 : 58,
            border: `1px solid ${colors.antiqueGold}`,
            rotate: "45deg",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.antiqueGold,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: isDesktop ? 13 : 18,
          }}
        >
          <span style={{ rotate: "-45deg" }}>MF</span>
        </span>
        Maison Fondjo
      </div>
      <div
        style={{
          position: "absolute",
          left: isDesktop ? 112 : 70,
          bottom: isDesktop ? 86 : 76,
          width: isDesktop ? 150 : 200,
          height: 1,
          background: `linear-gradient(90deg, ${colors.antiqueGold}, rgba(184,147,90,0))`,
          opacity: titleOpacity * 0.8,
          transform: `scaleX(${lineScale})`,
          transformOrigin: "left center",
        }}
      />
    </>
  );
};

const BrandLockup: React.FC<{
  x: number;
  y: number;
  titleOpacity: number;
  lineScale: number;
  isDesktop: boolean;
}> = ({ x, y, titleOpacity, lineScale, isDesktop }) => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [18, 72], [34, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: softEase,
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: titleOpacity,
        translate: `0 ${rise}px`,
        color: colors.ivory,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isDesktop ? 22 : 26,
          marginBottom: isDesktop ? 42 : 54,
        }}
      >
        <div
          style={{
            width: isDesktop ? 56 : 72,
            height: isDesktop ? 56 : 72,
            border: `1px solid ${colors.antiqueGold}`,
            rotate: "45deg",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.antiqueGold,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: isDesktop ? 18 : 22,
            letterSpacing: "0.08em",
          }}
        >
          <span style={{ rotate: "-45deg", translate: "1px 0" }}>MF</span>
        </div>
        <div
          style={{
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            fontSize: isDesktop ? 17 : 24,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: colors.cream,
          }}
        >
          Maison Fondjo
        </div>
      </div>

      <div
        style={{
          width: isDesktop ? 610 : 820,
          maxWidth: isDesktop ? 610 : 820,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: isDesktop ? 92 : 104,
          lineHeight: isDesktop ? 0.95 : 0.96,
          letterSpacing: "-0.035em",
          color: colors.ivory,
          textShadow: "0 22px 60px rgba(0,0,0,0.55)",
        }}
      >
        One universal oil.
        <br />
        Infinite textures.
      </div>

      <div
        style={{
          marginTop: isDesktop ? 38 : 52,
          width: isDesktop ? 188 : 226,
          height: 2,
          background: `linear-gradient(90deg, ${colors.antiqueGold}, rgba(184,147,90,0))`,
          transform: `scaleX(${lineScale})`,
          transformOrigin: "left center",
        }}
      />

      <div
        style={{
          marginTop: isDesktop ? 34 : 48,
          maxWidth: isDesktop ? 520 : 700,
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          fontSize: isDesktop ? 26 : 34,
          lineHeight: 1.45,
          color: colors.cream,
          opacity: 0.88,
        }}
      >
        Sève Racine, composed for scalp, root and daily ritual.
      </div>
    </div>
  );
};
