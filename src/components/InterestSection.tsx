import { type ReactNode, useEffect, useRef, useState } from "react";
import SectionSideTab from "@/components/SectionSideTab";

const getExplanationVideoSrc = (src: string, isMobile: boolean) =>
  src.replace(/\.webm$/i, isMobile ? "_mobile.webm" : "_desktop.webm");

export { getExplanationVideoSrc };

export type InterestSectionProps = {
  sectionId?: string;
  tabLabel: string;
  hideTabLabel?: boolean;
  lines: string[];
  desktopBackground: string;
  mobileBackground: string;
  backgroundVideoSrc?: string;
  fadeToImageOnVideoEnd?: boolean;
  allowVideoToggle?: boolean;
  videoPlaybackRate?: number;
  localizedBottomGlowClassName?: string;
  headingClassName?: string;
  sectionClassName?: string;
  textClassName?: string;
  overlaySrc?: string;
  overlayPosition?: "left" | "right";
  secondaryOverlaySrc?: string;
  secondaryOverlayPosition?: "left" | "right";
  useTiledBackground?: boolean;
  tiledPatternClassName?: string;
  tiledCenterGlowClassName?: string;
  mobileBackgroundPosition?: string;
  desktopBackgroundPosition?: string;
  mobileBackgroundSize?: string;
  desktopBackgroundSize?: string;
  mobileBackgroundScale?: number;
  desktopBackgroundScale?: number;
  parallaxRangeX?: number;
  parallaxRangeY?: number;
  loopBackgroundRight?: boolean;
  backgroundOverlayClassName?: string;
  tabLabelClassName?: string;
  overlayClassName?: string;
  secondaryOverlayClassName?: string;
  firstLineClassName?: string;
  disableParallax?: boolean;
  contentClassName?: string;
  innerContentClassName?: string;
  mobileInlineContent?: ReactNode;
  decoration?: ReactNode;
  children?: ReactNode;
};

const InterestSection = ({
  sectionId,
  tabLabel,
  hideTabLabel = false,
  lines,
  desktopBackground,
  mobileBackground,
  backgroundVideoSrc,
  fadeToImageOnVideoEnd = false,
  allowVideoToggle = false,
  videoPlaybackRate = 1,
  localizedBottomGlowClassName = "",
  headingClassName = "",
  sectionClassName = "",
  textClassName = "text-black",
  overlaySrc,
  overlayPosition = "right",
  secondaryOverlaySrc,
  secondaryOverlayPosition = "right",
  useTiledBackground = false,
  tiledPatternClassName = "",
  tiledCenterGlowClassName = "",
  mobileBackgroundPosition = "center",
  desktopBackgroundPosition = "center",
  mobileBackgroundSize = "cover",
  desktopBackgroundSize = "cover",
  mobileBackgroundScale = 1.08,
  desktopBackgroundScale = 1.08,
  parallaxRangeX = 34,
  parallaxRangeY = 18,
  loopBackgroundRight = false,
  backgroundOverlayClassName = "bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.1)_28%,rgba(0,0,0,0.18)_100%)]",
  tabLabelClassName = "",
  overlayClassName = "",
  secondaryOverlayClassName = "",
  firstLineClassName = "",
  disableParallax = false,
  contentClassName = "",
  innerContentClassName = "",
  mobileInlineContent,
  decoration,
  children,
}: InterestSectionProps) => {
  const rafRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [hasVideoEnded, setHasVideoEnded] = useState(false);
  const [showFallbackImage, setShowFallbackImage] = useState(false);
  const [isBackgroundVideoPaused, setIsBackgroundVideoPaused] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = videoPlaybackRate;
  }, [videoPlaybackRate, backgroundVideoSrc]);

  useEffect(() => {
    if (!videoRef.current || !allowVideoToggle) return;
    if (isBackgroundVideoPaused) {
      videoRef.current.pause();
      return;
    }
    void videoRef.current.play().catch(() => {});
  }, [allowVideoToggle, isBackgroundVideoPaused]);

  useEffect(() => {
    setHasVideoEnded(false);
    setShowFallbackImage(false);
    if (fadeTimeoutRef.current) {
      window.clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    return () => {
      if (fadeTimeoutRef.current) {
        window.clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
    };
  }, [backgroundVideoSrc]);

  const handleBackgroundVideoEnded = () => {
    if (!fadeToImageOnVideoEnd) return;
    setHasVideoEnded(true);
    fadeTimeoutRef.current = window.setTimeout(() => {
      setShowFallbackImage(true);
      fadeTimeoutRef.current = null;
    }, 1000);
  };

  const handleBackgroundVideoToggle = () => {
    if (!allowVideoToggle || !backgroundVideoSrc || hasVideoEnded) return;
    setIsBackgroundVideoPaused((current) => !current);
  };

  const handleParallaxMove = (event: React.PointerEvent<HTMLElement>) => {
    if (disableParallax) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      setParallaxOffset({ x: x * parallaxRangeX, y: y * parallaxRangeY });
    });
  };

  const handleParallaxLeave = () => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (disableParallax) return;
    setParallaxOffset({ x: 0, y: 0 });
  };

  return (
    <section
      id={sectionId}
      className={`section-surface relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-t-[3px] border-black px-6 py-16 md:py-24 ${sectionClassName}`}
      onPointerMove={handleParallaxMove}
      onPointerLeave={handleParallaxLeave}
    >
      {hideTabLabel ? null : <SectionSideTab label={tabLabel} labelClassName={tabLabelClassName} />}
      {decoration}
      <div className={`absolute inset-0 -z-10 overflow-hidden ${mobileInlineContent ? "hidden md:block" : ""}`}>
        {useTiledBackground ? (
          <>
            <div className="section-surface-fill absolute inset-0" />
            <div
              className={`absolute inset-0 opacity-60 ${tiledPatternClassName}`}
              style={{
                backgroundImage:
                  "repeating-linear-gradient(120deg, rgba(0,0,0,0.28) 0 1px, transparent 1px 160px), repeating-linear-gradient(30deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 200px)",
                transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-black/20" />
            {tiledCenterGlowClassName ? (
              <div aria-hidden="true" className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${tiledCenterGlowClassName}`} />
            ) : null}
            <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-white/35 blur-[90px]" />
            <div className="absolute -right-24 bottom-6 h-80 w-80 rounded-full bg-black/20 blur-[110px]" />
            <div className="absolute inset-0 hud-grid pointer-events-none opacity-15" />
          </>
        ) : (
          <>
            <div
              className={allowVideoToggle ? "absolute inset-0 cursor-pointer" : "absolute inset-0"}
              onClick={handleBackgroundVideoToggle}
            >
              {backgroundVideoSrc ? (
                <>
                  <video
                    ref={videoRef}
                    src={backgroundVideoSrc}
                    autoPlay
                    muted
                    loop={!fadeToImageOnVideoEnd}
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    onEnded={handleBackgroundVideoEnded}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1000ms] [backface-visibility:hidden] [transform:translateZ(0)] ${
                      hasVideoEnded ? "opacity-0" : "opacity-100"
                    }`}
                    style={{ transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0)` }}
                  />
                  <img
                    src={mobileBackground}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1000ms] md:hidden ${
                      showFallbackImage ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      objectPosition: mobileBackgroundPosition,
                      objectFit: mobileBackgroundSize === "cover" ? "cover" : "fill",
                      transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0) scale(${mobileBackgroundScale})`,
                    }}
                  />
                  <img
                    src={desktopBackground}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className={`absolute inset-0 hidden h-full w-full object-cover transition-opacity duration-[1000ms] md:block ${
                      showFallbackImage ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      objectPosition: desktopBackgroundPosition,
                      objectFit: desktopBackgroundSize === "cover" ? "cover" : "fill",
                      transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0) scale(${desktopBackgroundScale})`,
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 bg-black transition-opacity duration-[1000ms] ${
                      hasVideoEnded && !showFallbackImage ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </>
              ) : (
                <>
                  <img
                    src={mobileBackground}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full scale-[1.08] object-cover md:hidden"
                    style={{
                      objectPosition: mobileBackgroundPosition,
                      objectFit: mobileBackgroundSize === "cover" ? "cover" : "fill",
                      transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0) scale(${mobileBackgroundScale})`,
                    }}
                  />
                  {loopBackgroundRight ? (
                    <div
                      aria-hidden="true"
                      className="becoming-you-bg-scroll absolute inset-y-0 left-0 hidden w-[200%] md:block"
                      style={{
                        backgroundImage: `url("${desktopBackground}")`,
                        backgroundPosition: `${desktopBackgroundPosition} center`,
                        backgroundRepeat: "repeat-x",
                        backgroundSize: `auto ${desktopBackgroundScale * 100}%`,
                      }}
                    />
                  ) : (
                    <img
                      src={desktopBackground}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="absolute inset-0 hidden h-full w-full scale-[1.08] object-cover md:block"
                      style={{
                        objectPosition: desktopBackgroundPosition,
                        objectFit: desktopBackgroundSize === "cover" ? "cover" : "fill",
                        transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0) scale(${desktopBackgroundScale})`,
                      }}
                    />
                  )}
                </>
              )}
            </div>
            <div className={`absolute inset-0 ${backgroundOverlayClassName}`} />
            {localizedBottomGlowClassName ? (
              <div aria-hidden="true" className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${localizedBottomGlowClassName}`} />
            ) : null}
          </>
        )}
        {secondaryOverlaySrc ? (
          <img
            src={secondaryOverlaySrc}
            alt=""
            aria-hidden="true"
            draggable={false}
            className={`absolute z-[1] block w-auto object-contain opacity-95 ${
              secondaryOverlayPosition === "left" ? "left-[2vw]" : "right-[2vw]"
            } ${secondaryOverlayClassName}`}
            style={{
              transform: `translate3d(${parallaxOffset.x * 0.3}px, ${parallaxOffset.y * 0.2}px, 0)`,
            }}
          />
        ) : null}
      </div>
      {mobileInlineContent ? <div className="relative z-10 md:hidden">{mobileInlineContent}</div> : null}
      <div className={`mx-auto w-full max-w-6xl ${mobileInlineContent ? "hidden md:block " : ""}${contentClassName}`}>
        <div className={`p-6 md:p-10 ${innerContentClassName}`}>
          {children ?? (
            <h2
              className={`research-impact-title select-none text-center text-[2rem] font-black uppercase leading-[1.02] tracking-[0.08em] md:text-[5.3rem] ${textClassName} ${headingClassName}`}
            >
              {lines.map((line, index) => (
                <span
                  key={`${tabLabel}-${line}`}
                  className={index === 0 ? `block ${firstLineClassName}` : "mt-[0.9em] block"}
                >
                  {line}
                </span>
              ))}
            </h2>
          )}
        </div>
      </div>
    </section>
  );
};

export default InterestSection;
