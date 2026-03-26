import { type ReactNode, useEffect, useRef, useState } from "react";
import SectionSideTab from "@/components/SectionSideTab";

type InterestSectionProps = {
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
  decoration?: ReactNode;
  children?: ReactNode;
};

const InterestSection = ({
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
    if (!videoRef.current) {
      return;
    }

    videoRef.current.playbackRate = videoPlaybackRate;
  }, [videoPlaybackRate, backgroundVideoSrc]);

  useEffect(() => {
    if (!videoRef.current || !allowVideoToggle) {
      return;
    }

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
    if (!fadeToImageOnVideoEnd) {
      return;
    }

    setHasVideoEnded(true);
    fadeTimeoutRef.current = window.setTimeout(() => {
      setShowFallbackImage(true);
      fadeTimeoutRef.current = null;
    }, 1000);
  };

  const handleBackgroundVideoToggle = () => {
    if (!allowVideoToggle || !backgroundVideoSrc || hasVideoEnded) {
      return;
    }

    setIsBackgroundVideoPaused((current) => !current);
  };

  const handleParallaxMove = (event: React.PointerEvent<HTMLElement>) => {
    if (disableParallax) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current) {
      return;
    }
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
    if (disableParallax) {
      return;
    }
    setParallaxOffset({ x: 0, y: 0 });
  };

  return (
    <section
      className={`section-surface relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-t-[3px] border-black px-6 py-16 md:py-24 ${sectionClassName}`}
      onPointerMove={handleParallaxMove}
      onPointerLeave={handleParallaxLeave}
    >
      {hideTabLabel ? null : <SectionSideTab label={tabLabel} labelClassName={tabLabelClassName} />}
      {decoration}
      <div className="absolute inset-0 -z-10 overflow-hidden">
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
            <div className="absolute inset-0 hud-grid opacity-15 pointer-events-none" />
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
                    preload="auto"
                    aria-hidden="true"
                    onEnded={handleBackgroundVideoEnded}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1000ms] [backface-visibility:hidden] [transform:translateZ(0)] ${
                      hasVideoEnded ? "opacity-0" : "opacity-100"
                    }`}
                    style={{
                      transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0)`,
                    }}
                  />
                  <img
                    src={mobileBackground}
                    alt=""
                    aria-hidden="true"
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
            className={`absolute top-0 z-[1] hidden h-full w-auto object-contain opacity-95 md:block ${
              secondaryOverlayPosition === "left" ? "left-[2vw]" : "right-[2vw]"
            } ${secondaryOverlayClassName}`}
            style={{
              transform: `translate3d(${parallaxOffset.x * 0.3}px, ${parallaxOffset.y * 0.2}px, 0) scaleX(-1)`,
            }}
          />
        ) : null}
      </div>
      <div className={`mx-auto w-full max-w-6xl ${contentClassName}`}>
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

const PremiumLifestyleSection = () => {
  const becomingYouVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const becomingYouFadeTimeoutsRef = useRef<Array<number | null>>([null, null]);
  const [areBecomingYouVideosPaused, setAreBecomingYouVideosPaused] = useState(false);
  const [becomingYouVideoFading, setBecomingYouVideoFading] = useState([false, false]);

  const setBecomingYouVideoRef = (index: number) => (element: HTMLVideoElement | null) => {
    becomingYouVideoRefs.current[index] = element;
  };

  useEffect(() => {
    return () => {
      becomingYouFadeTimeoutsRef.current.forEach((timeout) => {
        if (timeout) {
          window.clearTimeout(timeout);
        }
      });
    };
  }, []);

  const handleBecomingYouToggle = () => {
    const nextPausedState = !areBecomingYouVideosPaused;
    setAreBecomingYouVideosPaused(nextPausedState);

    becomingYouVideoRefs.current.forEach((video) => {
      if (!video) {
        return;
      }
      if (nextPausedState) {
        video.pause();
        return;
      }
      void video.play().catch(() => {});
    });
  };

  const handleBecomingYouVideoEnded = (index: number) => {
    const video = becomingYouVideoRefs.current[index];
    if (!video) {
      return;
    }

    if (becomingYouFadeTimeoutsRef.current[index]) {
      window.clearTimeout(becomingYouFadeTimeoutsRef.current[index]!);
      becomingYouFadeTimeoutsRef.current[index] = null;
    }

    setBecomingYouVideoFading((current) => current.map((value, currentIndex) => (
      currentIndex === index ? true : value
    )));

    becomingYouFadeTimeoutsRef.current[index] = window.setTimeout(() => {
      video.currentTime = 0;
      void video.play().catch(() => {});
      setBecomingYouVideoFading((current) => current.map((value, currentIndex) => (
        currentIndex === index ? false : value
      )));
      becomingYouFadeTimeoutsRef.current[index] = null;
    }, 2000);
  };

  return (
    <>
      <InterestSection
        tabLabel="STAY TUNED"
        hideTabLabel
        lines={["UGLY", "", "", "PEOPLE", "", "", "CAN'T BE HAPPY"]}
        desktopBackground="/section_wallpaper/interest/06.png?v=1"
        mobileBackground="/section_wallpaper/interest/mobile/08.png?v=2"
        localizedBottomGlowClassName="h-[5vh] w-[58vw] min-w-[18rem] max-w-[44rem] rounded-t-[999px] bg-[radial-gradient(circle_at_center,rgba(136,196,255,0.42)_0%,rgba(104,170,255,0.24)_42%,rgba(74,135,230,0.12)_68%,rgba(74,135,230,0)_100%)] blur-[18px]"
        sectionClassName="min-h-[64vh] pt-[4.8rem] pb-[4rem] md:min-h-[72vh] md:pt-[6rem] md:pb-[4.8rem]"
        textClassName="text-white"
        headingClassName="font-['Tektur'] text-[2.1rem] font-black tracking-[0.14em] text-black opacity-90 [text-shadow:0_0_18px_rgba(255,255,255,0.95),0_8px_22px_rgba(255,255,255,0.7)] md:text-[5.7rem]"
        firstLineClassName="mt-[18vh] md:mt-[16vh]"
        tabLabelClassName="min-w-[15.5rem] px-8 text-center tracking-[0.34em] md:min-w-[18.5rem] md:px-10"
        mobileBackgroundPosition="58% center"
        mobileBackgroundSize="fill"
        mobileBackgroundScale={0.94}
        desktopBackgroundPosition="55% 28%"
        backgroundOverlayClassName="bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_32%,rgba(0,0,0,0.12)_62%,rgba(0,0,0,0.46)_100%)]"
        secondaryOverlaySrc="/section_wallpaper/interest/02.png?v=2"
        secondaryOverlayPosition="left"
        secondaryOverlayClassName="translate-x-0 opacity-70 brightness-[1.04] contrast-[1.06] saturate-[0.9] drop-shadow-[0_18px_48px_rgba(255,255,255,0.16)]"
        disableParallax
        contentClassName="flex min-h-[calc(64vh-8.8rem)] -translate-y-[31vh] flex-col justify-end md:min-h-[calc(72vh-10.8rem)] md:-translate-y-[8vh]"
        innerContentClassName="pb-0"
      />
      <InterestSection
        tabLabel="BECOMING YOU"
        hideTabLabel
        lines={[]}
        desktopBackground="/section_wallpaper/become_you/01.png"
        mobileBackground="/section_wallpaper/become_you/01.png"
        sectionClassName="min-h-[110vh] py-0 md:min-h-[140vh]"
        contentClassName="flex min-h-[110vh] flex-col justify-start md:min-h-[140vh]"
        innerContentClassName="py-[7vh] md:py-[5.5vh]"
        tabLabelClassName="!text-black"
        decoration={
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
            >
              <div className="absolute left-[-18vw] top-[16vh] h-[8vw] w-[150vw] -rotate-[24deg] bg-black/82" />
              <div className="absolute left-[-22vw] top-[48vh] h-[8vw] w-[150vw] -rotate-[24deg] bg-black/82" />
              <div className="absolute left-[-14vw] top-[80vh] h-[8vw] w-[150vw] -rotate-[24deg] bg-black/82" />
            </div>
            <img
              src="/section_wallpaper/explaination/03.png"
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute left-0 top-0 z-[1] hidden h-[118%] w-auto max-w-none object-contain md:block"
            />
            <img
              src="/section_wallpaper/explaination/05.png"
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute bottom-0 right-0 z-0 hidden h-[101%] w-auto max-w-none object-contain md:block"
            />
            <img
              src="/section_wallpaper/explaination/04.png"
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute right-0 top-0 z-0 hidden h-[46%] w-auto max-w-none object-contain md:block"
            />
          </>
        }
        mobileBackgroundPosition="center"
        desktopBackgroundPosition="center"
        mobileBackgroundSize="fill"
        desktopBackgroundSize="fill"
        mobileBackgroundScale={1.7}
        desktopBackgroundScale={1.7}
        loopBackgroundRight
        disableParallax
        backgroundOverlayClassName="bg-[linear-gradient(180deg,rgba(255,255,255,0.26)_0%,rgba(255,255,255,0.1)_18%,rgba(255,255,255,0.04)_42%,rgba(0,0,0,0.18)_100%)]"
      >
        <div
          className="relative grid cursor-pointer gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] md:gap-[15vw]"
          onClick={handleBecomingYouToggle}
        >
          <div className="relative z-[1] max-w-[54.6rem] md:max-w-[73.7rem]">
            <h2 className="mb-4 text-center font-['Tektur'] text-[2rem] font-black uppercase tracking-[0.14em] text-white [paint-order:stroke_fill] [text-shadow:0_6px_16px_rgba(0,0,0,0.18)] [-webkit-text-stroke:3px_#000] md:mb-6 md:text-[3.4rem]">
              BECØME
            </h2>
            <div className="flex flex-col gap-5 md:-translate-x-[15vw] md:flex-row md:items-stretch md:gap-0">
              <div className="relative md:w-[32vw] md:min-w-[32vw]">
                <video
                  ref={setBecomingYouVideoRef(0)}
                  className="w-full rounded-[28px] border border-black/15 object-cover shadow-[0_28px_80px_rgba(0,0,0,0.22)]"
                  autoPlay
                  muted
                  playsInline
                  preload="metadata"
                  onEnded={() => handleBecomingYouVideoEnded(0)}
                >
                  <source src="/section_wallpaper/explaination/01.mp4" type="video/mp4" />
                </video>
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 rounded-[28px] bg-white transition-opacity duration-[2000ms] ${
                    becomingYouVideoFading[0] ? "opacity-100" : "opacity-0"
                  }`}
                />
                {areBecomingYouVideosPaused ? (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-black/45 text-white shadow-[0_14px_32px_rgba(0,0,0,0.25)]">
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                        <rect x="6" y="5" width="4" height="14" rx="1" />
                        <rect x="14" y="5" width="4" height="14" rx="1" />
                      </svg>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="relative overflow-hidden rounded-[24px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.46)_0%,rgba(255,255,255,0.24)_100%)] px-8 py-7 text-center text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-[2px] md:-ml-px md:flex md:w-[8.5rem] md:flex-none md:items-center md:justify-center md:rounded-l-none md:px-3 md:py-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.22] md:hidden"
                  style={{
                    backgroundImage: 'url("/section_wallpaper/interest/special-mobile.png")',
                    backgroundRepeat: "repeat",
                    backgroundPosition: "center",
                    backgroundSize: "108px 108px",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 hidden opacity-[0.2] md:block"
                  style={{
                    backgroundImage: 'url("/section_wallpaper/interest/special-desktop.png")',
                    backgroundRepeat: "repeat",
                    backgroundPosition: "center",
                    backgroundSize: "128px 128px",
                  }}
                />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/48" />
                <p className="relative z-[1] font-['Tektur'] text-[1.45rem] font-black leading-[1.05] text-black md:whitespace-nowrap md:text-[1.9rem] md:leading-none md:[transform:rotate(90deg)]">
                  Like the
                  <span className="block">gym for your face.</span>
                </p>
              </div>
            </div>
          </div>
          <div className="relative z-[1] max-w-[49.4rem] md:max-w-[66.7rem] md:translate-x-[20vw] md:translate-y-[25%] md:justify-self-end">
            <h2 className="mb-4 text-center font-['Tektur'] text-[2rem] font-black uppercase tracking-[0.14em] text-white [paint-order:stroke_fill] [text-shadow:0_6px_16px_rgba(0,0,0,0.18)] [-webkit-text-stroke:3px_#000] md:mb-6 md:text-[3.4rem]">
              DØll
            </h2>
            <div className="relative md:w-[32vw] md:min-w-[32vw]">
              <video
                ref={setBecomingYouVideoRef(1)}
                className="w-full rounded-[28px] border border-black/15 object-cover shadow-[0_28px_80px_rgba(0,0,0,0.22)]"
                autoPlay
                muted
                playsInline
                preload="metadata"
                onEnded={() => handleBecomingYouVideoEnded(1)}
              >
                <source src="/section_wallpaper/explaination/02.mp4" type="video/mp4" />
              </video>
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 rounded-[28px] bg-white transition-opacity duration-[2000ms] ${
                  becomingYouVideoFading[1] ? "opacity-100" : "opacity-0"
                }`}
              />
              {areBecomingYouVideosPaused ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-black/45 text-white shadow-[0_14px_32px_rgba(0,0,0,0.25)]">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="relative mt-5 max-w-[38rem] overflow-hidden rounded-[24px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.46)_0%,rgba(255,255,255,0.24)_100%)] px-8 py-7 text-center text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-[2px] md:mt-[-7vw] md:w-[44rem] md:max-w-none md:-translate-x-[50vw] md:px-10 md:py-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.18] md:hidden"
                style={{
                  backgroundImage: 'url("/section_wallpaper/interest/special-mobile.png")',
                  backgroundRepeat: "repeat",
                  backgroundPosition: "center",
                  backgroundSize: "116px 116px",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hidden opacity-[0.16] md:block"
                style={{
                  backgroundImage: 'url("/section_wallpaper/interest/special-desktop.png")',
                  backgroundRepeat: "repeat",
                  backgroundPosition: "center",
                  backgroundSize: "152px 152px",
                }}
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/52" />
              <p className="relative z-[1] font-['Tektur'] text-[1.45rem] font-black leading-[1.05] text-black md:text-[2rem]">
                Become as hot as you want.
              </p>
            </div>
          </div>
        </div>
      </InterestSection>
    </>
  );
};

export default PremiumLifestyleSection;
