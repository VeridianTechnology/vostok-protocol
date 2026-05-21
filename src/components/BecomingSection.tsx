import { type ReactNode, useEffect, useRef, useState } from "react";
import InterestSection, { getExplanationVideoSrc } from "@/components/InterestSection";

type BecomingYouCaptionIndex = 0 | 1 | 2 | 3 | 4;

const renderBecomingYouCaption = (index: BecomingYouCaptionIndex): ReactNode => {
  switch (index) {
    case 0: return "LOOK LIKE A MAN";
    case 1: return "BECOME A DOLL";
    case 2: return "GET THAT BOYISH LOOK";
    case 3: return "YOU ARE UNIQUE";
    case 4: return "BECOME WHO YOU ARE";
  }
  return null;
};

const PauseIcon = () => (
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-black/45 text-white shadow-[0_14px_32px_rgba(0,0,0,0.25)]">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
    </div>
  </div>
);

type VideoCardProps = {
  videoRef: (el: HTMLVideoElement | null) => void;
  src: string | undefined;
  dataSrc: string;
  isPaused: boolean;
  isFading: boolean;
  fadeDurationMs: number;
  onToggle: (e: React.MouseEvent<HTMLDivElement>) => void;
  onEnded: () => void;
  className?: string;
};

const VideoCard = ({
  videoRef,
  src,
  dataSrc,
  isPaused,
  isFading,
  fadeDurationMs,
  onToggle,
  onEnded,
  className = "",
}: VideoCardProps) => (
  <div className={`relative ${className}`} onClick={onToggle}>
    <video
      ref={videoRef}
      className="w-full border border-black/15 object-cover shadow-[0_28px_80px_rgba(0,0,0,0.22)]"
      autoPlay
      muted
      playsInline
      preload="none"
      onEnded={onEnded}
    >
      <source data-video-src={dataSrc} src={src} type="video/webm" />
    </video>
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 bg-white transition-opacity ${
        isFading ? "opacity-100" : "opacity-0"
      }`}
      style={{ transitionDuration: `${fadeDurationMs}ms` }}
    />
    {isPaused ? <PauseIcon /> : null}
  </div>
);

const CaptionCard = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`relative overflow-hidden border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.46)_0%,rgba(255,255,255,0.24)_100%)] text-center text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-[2px] ${className}`}>
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.18] md:hidden"
      style={{
        backgroundImage: 'url("/section_wallpaper/interest/special-mobile.webp")',
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
        backgroundSize: "116px 116px",
      }}
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden opacity-[0.16] md:block"
      style={{
        backgroundImage: 'url("/section_wallpaper/interest/special-desktop.webp")',
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
        backgroundSize: "152px 152px",
      }}
    />
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/52" />
    {children}
  </div>
);

type BecomingSectionProps = {
  sectionId?: string;
  isBecomingYouActive?: boolean;
};

const BecomingSection = ({ sectionId, isBecomingYouActive = true }: BecomingSectionProps) => {
  const becomingYouSectionRef = useRef<HTMLDivElement | null>(null);
  const becomingYouVideoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const becomingYouFadeTimeoutsRef = useRef<Array<number | null>>([null, null, null, null, null]);
  const areBecomingYouVideosPausedRef = useRef(false);
  const individuallyPausedBecomingYouVideosRef = useRef([false, false, false, false, false]);
  const becomingYouLoadTimeoutRef = useRef<number | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isBecomingYouInView, setIsBecomingYouInView] = useState(false);
  const [loadedBecomingYouVideoIndices, setLoadedBecomingYouVideoIndices] = useState<boolean[]>([
    false, false, false, false, false,
  ]);
  const [areBecomingYouVideosPaused, setAreBecomingYouVideosPaused] = useState(false);
  const [becomingYouVideoFading, setBecomingYouVideoFading] = useState([false, false, false, false, false]);
  const [individuallyPausedBecomingYouVideos, setIndividuallyPausedBecomingYouVideos] = useState([
    false, false, false, false, false,
  ]);

  const becomingYouFadeDurationMs = isMobile ? 450 : 2000;
  const becomingYouRestartDelayMs = isMobile ? 220 : 2000;

  const setBecomingYouVideoRef =
    (index: number, variant: "mobile" | "desktop") => (element: HTMLVideoElement | null) => {
      if ((variant === "mobile" && !isMobile) || (variant === "desktop" && isMobile)) return;
      becomingYouVideoRefs.current[index] = element;
    };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMatch = () => setIsMobile(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  useEffect(() => {
    areBecomingYouVideosPausedRef.current = areBecomingYouVideosPaused;
  }, [areBecomingYouVideosPaused]);

  useEffect(() => {
    individuallyPausedBecomingYouVideosRef.current = individuallyPausedBecomingYouVideos;
  }, [individuallyPausedBecomingYouVideos]);

  useEffect(() => {
    if (!isMobile) {
      setIsBecomingYouInView(true);
      setLoadedBecomingYouVideoIndices([true, true, true, true, true]);
      return;
    }
    const node = becomingYouSectionRef.current;
    if (!node || !("IntersectionObserver" in window)) {
      setIsBecomingYouInView(true);
      setLoadedBecomingYouVideoIndices([true, true, true, true, true]);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setIsBecomingYouInView(true);
          setLoadedBecomingYouVideoIndices([true, true, true, true, true]);
          observer.disconnect();
        });
      },
      { threshold: 0.12, rootMargin: "30% 0px 20% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isMobile]);

  useEffect(() => {
    becomingYouVideoRefs.current.forEach((video, index) => {
      if (!video) return;
      const isLoaded = !isMobile || loadedBecomingYouVideoIndices[index];
      if (!isLoaded) { video.pause(); return; }
      if (isMobile && !isBecomingYouActive && !isBecomingYouInView) { video.pause(); return; }
      if (areBecomingYouVideosPaused || individuallyPausedBecomingYouVideos[index]) { video.pause(); return; }
      void video.play().catch(() => {});
    });
  }, [
    areBecomingYouVideosPaused,
    individuallyPausedBecomingYouVideos,
    isBecomingYouActive,
    isBecomingYouInView,
    isMobile,
    loadedBecomingYouVideoIndices,
  ]);

  useEffect(() => {
    becomingYouVideoRefs.current.forEach((video, index) => {
      if (!video) return;
      const sources = Array.from(video.querySelectorAll("source[data-video-src]"));
      if (!sources.length) return;
      const shouldLoadVideo = !isMobile || loadedBecomingYouVideoIndices[index];
      if (!shouldLoadVideo) {
        video.pause();
        if (!isMobile) {
          video.removeAttribute("src");
          sources.forEach((source) => source.removeAttribute("src"));
          video.load();
        }
        return;
      }
      if (isMobile && !isBecomingYouActive && !isBecomingYouInView) { video.pause(); return; }
      let activeVideoSrc: string | null = null;
      sources.forEach((source) => {
        const videoSrc = source.getAttribute("data-video-src");
        if (videoSrc) {
          activeVideoSrc = activeVideoSrc ?? videoSrc;
          source.setAttribute("src", videoSrc);
        }
      });
      if (activeVideoSrc) {
        const currentVideoSrc = video.getAttribute("src");
        if (currentVideoSrc !== activeVideoSrc) {
          video.setAttribute("src", activeVideoSrc);
          video.load();
        }
      }
      const tryPlay = () => {
        if (areBecomingYouVideosPausedRef.current || individuallyPausedBecomingYouVideosRef.current[index]) return;
        if (isMobile && !isBecomingYouActive && !isBecomingYouInView) return;
        void video.play().catch(() => {});
      };
      if (isMobile) {
        video.onloadedmetadata = null;
        video.oncanplay = null;
      } else {
        video.onloadedmetadata = tryPlay;
        video.oncanplay = tryPlay;
      }
      if (!areBecomingYouVideosPausedRef.current && !individuallyPausedBecomingYouVideosRef.current[index]) {
        tryPlay();
      }
    });
  }, [isBecomingYouActive, isBecomingYouInView, isMobile, loadedBecomingYouVideoIndices]);

  useEffect(() => {
    return () => {
      if (becomingYouLoadTimeoutRef.current) window.clearTimeout(becomingYouLoadTimeoutRef.current);
      becomingYouFadeTimeoutsRef.current.forEach((t) => { if (t) window.clearTimeout(t); });
    };
  }, []);

  const handleBecomingYouToggle = () => {
    const nextPausedState = !areBecomingYouVideosPaused;
    setAreBecomingYouVideosPaused(nextPausedState);
    if (!nextPausedState) setIndividuallyPausedBecomingYouVideos([false, false, false, false, false]);
  };

  const handleBecomingYouVideoToggle = (index: number, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setIndividuallyPausedBecomingYouVideos((current) =>
      current.map((value, i) => (i === index ? !value : value))
    );
  };

  const handleBecomingYouVideoEnded = (index: number) => {
    const video = becomingYouVideoRefs.current[index];
    if (!video) return;
    if (becomingYouFadeTimeoutsRef.current[index]) {
      window.clearTimeout(becomingYouFadeTimeoutsRef.current[index]!);
      becomingYouFadeTimeoutsRef.current[index] = null;
    }
    setBecomingYouVideoFading((current) => current.map((v, i) => (i === index ? true : v)));
    becomingYouFadeTimeoutsRef.current[index] = window.setTimeout(() => {
      video.currentTime = 0;
      if (!areBecomingYouVideosPausedRef.current && !individuallyPausedBecomingYouVideosRef.current[index]) {
        void video.play().catch(() => {});
      }
      setBecomingYouVideoFading((current) => current.map((v, i) => (i === index ? false : v)));
      becomingYouFadeTimeoutsRef.current[index] = null;
    }, becomingYouRestartDelayMs);
  };

  const videoSrc = (file: string) =>
    !isMobile || isBecomingYouActive
      ? getExplanationVideoSrc(file, isMobile)
      : undefined;

  return (
    <InterestSection
      sectionId={sectionId}
      tabLabel="BECOMING YOU"
      hideTabLabel
      lines={[]}
      desktopBackground="/section_wallpaper/become_you/01.webp"
      mobileBackground="/section_wallpaper/become_you/01.webp"
      sectionClassName="min-h-[78vh] py-0 md:min-h-[200vh]"
      contentClassName="flex min-h-[78vh] -translate-y-[4vh] flex-col justify-start md:min-h-[200vh] md:translate-y-0"
      innerContentClassName="pt-0 pb-[2vh] md:py-[5.5vh]"
      tabLabelClassName="!text-black"
      mobileBackgroundPosition="center"
      desktopBackgroundPosition="center"
      mobileBackgroundSize="fill"
      desktopBackgroundSize="fill"
      mobileBackgroundScale={1.7}
      desktopBackgroundScale={1.7}
      disableParallax
      backgroundOverlayClassName="bg-[linear-gradient(180deg,rgba(255,255,255,0.26)_0%,rgba(255,255,255,0.1)_18%,rgba(255,255,255,0.04)_42%,rgba(0,0,0,0.18)_100%)]"
      decoration={
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block">
            <div className="absolute left-[-18vw] top-[16vh] h-[8vw] w-[150vw] -rotate-[24deg] bg-black/82" />
            <div className="absolute left-[-22vw] top-[48vh] h-[8vw] w-[150vw] -rotate-[24deg] bg-black/82" />
            <div className="absolute left-[-14vw] top-[80vh] h-[8vw] w-[150vw] -rotate-[24deg] bg-black/82" />
          </div>
          <img src="/section_wallpaper/explaination/03.png" alt="" aria-hidden="true" draggable={false} className="pointer-events-none absolute left-0 top-0 z-[1] hidden h-[38%] w-auto max-w-none object-contain md:block" />
          <img src="/section_wallpaper/explaination/05.png" alt="" aria-hidden="true" draggable={false} className="pointer-events-none absolute bottom-0 right-[-50px] z-0 hidden h-[74%] w-auto max-w-none object-contain md:block" />
          <img src="/section_wallpaper/explaination/04.png" alt="" aria-hidden="true" draggable={false} className="pointer-events-none absolute bottom-[-8%] left-[-30px] z-0 hidden h-[60%] w-auto max-w-none -scale-x-100 object-contain md:block" />
        </>
      }
    >
      {/* Mobile layout */}
      <div
        ref={becomingYouSectionRef}
        className="relative cursor-pointer md:hidden"
        onClick={handleBecomingYouToggle}
      >
        <div className="flex flex-col gap-[2vh]">
          <h2 className="text-center font-['Tektur'] text-[2rem] font-black uppercase tracking-[0.14em] text-white [paint-order:stroke_fill] [text-shadow:0_6px_16px_rgba(0,0,0,0.18)] [-webkit-text-stroke:3px_#000]">BECØME</h2>
          <VideoCard
            videoRef={setBecomingYouVideoRef(0, "mobile")}
            src={videoSrc("https://videos.vostok.guide/01.webm")}
            dataSrc={getExplanationVideoSrc("https://videos.vostok.guide/01.webm", isMobile)}
            isPaused={areBecomingYouVideosPaused || individuallyPausedBecomingYouVideos[0]}
            isFading={becomingYouVideoFading[0]}
            fadeDurationMs={becomingYouFadeDurationMs}
            onToggle={(e) => handleBecomingYouVideoToggle(0, e)}
            onEnded={() => handleBecomingYouVideoEnded(0)}
          />
          <CaptionCard className="px-8 pt-5 pb-4">
            <p className="relative z-[1] px-8 font-['Tektur'] text-[1.45rem] font-black leading-[1.05] text-black md:px-6 md:text-[1.7rem]">{renderBecomingYouCaption(0)}</p>
          </CaptionCard>

          <h2 className="pt-[0.25vh] text-center font-['Tektur'] text-[2rem] font-black uppercase tracking-[0.14em] text-white [paint-order:stroke_fill] [text-shadow:0_6px_16px_rgba(0,0,0,0.18)] [-webkit-text-stroke:3px_#000]">BECØME ALIVE</h2>
          <VideoCard
            videoRef={setBecomingYouVideoRef(1, "mobile")}
            src={videoSrc("https://videos.vostok.guide/02.webm")}
            dataSrc={getExplanationVideoSrc("https://videos.vostok.guide/02.webm", isMobile)}
            isPaused={areBecomingYouVideosPaused || individuallyPausedBecomingYouVideos[1]}
            isFading={becomingYouVideoFading[1]}
            fadeDurationMs={becomingYouFadeDurationMs}
            onToggle={(e) => handleBecomingYouVideoToggle(1, e)}
            onEnded={() => handleBecomingYouVideoEnded(1)}
          />
          <CaptionCard className="px-8 py-5">
            <p className="relative z-[1] font-['Tektur'] text-[1.45rem] font-black leading-[1.05] text-black">{renderBecomingYouCaption(1)}</p>
          </CaptionCard>

          <h2 className="-mb-[8px] pt-0 text-center font-['Tektur'] text-[2rem] font-black uppercase tracking-[0.14em] text-white [paint-order:stroke_fill] [text-shadow:0_6px_16px_rgba(0,0,0,0.18)] [-webkit-text-stroke:3px_#000]">BØY</h2>
          <VideoCard
            videoRef={setBecomingYouVideoRef(2, "mobile")}
            src={videoSrc("https://videos.vostok.guide/03.webm")}
            dataSrc={getExplanationVideoSrc("https://videos.vostok.guide/03.webm", isMobile)}
            isPaused={areBecomingYouVideosPaused || individuallyPausedBecomingYouVideos[2]}
            isFading={becomingYouVideoFading[2]}
            fadeDurationMs={becomingYouFadeDurationMs}
            onToggle={(e) => handleBecomingYouVideoToggle(2, e)}
            onEnded={() => handleBecomingYouVideoEnded(2)}
            className="-mt-[1.2vh]"
          />
          <CaptionCard className="-mt-[1.2vh] px-8 py-5">
            <p className="relative z-[1] font-['Tektur'] text-[1.45rem] font-black leading-[1.05] text-black md:text-center md:text-[1.7rem]">{renderBecomingYouCaption(2)}</p>
          </CaptionCard>

          <h2 className="pt-[0.25vh] text-center font-['Tektur'] text-[2rem] font-black uppercase tracking-[0.14em] text-white [paint-order:stroke_fill] [text-shadow:0_6px_16px_rgba(0,0,0,0.18)] [-webkit-text-stroke:3px_#000]">WØMAN</h2>
          <VideoCard
            videoRef={setBecomingYouVideoRef(3, "mobile")}
            src={videoSrc("https://videos.vostok.guide/05.webm")}
            dataSrc={getExplanationVideoSrc("https://videos.vostok.guide/05.webm", isMobile)}
            isPaused={areBecomingYouVideosPaused || individuallyPausedBecomingYouVideos[3]}
            isFading={becomingYouVideoFading[3]}
            fadeDurationMs={becomingYouFadeDurationMs}
            onToggle={(e) => handleBecomingYouVideoToggle(3, e)}
            onEnded={() => handleBecomingYouVideoEnded(3)}
          />
          <CaptionCard className="px-8 py-5">
            <p className="relative z-[1] font-['Tektur'] text-[1.45rem] font-black leading-[1.05] text-black md:text-[1.7rem]">{renderBecomingYouCaption(3)}</p>
          </CaptionCard>

          <h2 className="pt-[0.25vh] text-center font-['Tektur'] text-[2rem] font-black uppercase tracking-[0.14em] text-white [paint-order:stroke_fill] [text-shadow:0_6px_16px_rgba(0,0,0,0.18)] [-webkit-text-stroke:3px_#000]">FAMØUS</h2>
          <VideoCard
            videoRef={setBecomingYouVideoRef(4, "mobile")}
            src={videoSrc("https://videos.vostok.guide/04.webm")}
            dataSrc={getExplanationVideoSrc("https://videos.vostok.guide/04.webm", isMobile)}
            isPaused={areBecomingYouVideosPaused || individuallyPausedBecomingYouVideos[4]}
            isFading={becomingYouVideoFading[4]}
            fadeDurationMs={becomingYouFadeDurationMs}
            onToggle={(e) => handleBecomingYouVideoToggle(4, e)}
            onEnded={() => handleBecomingYouVideoEnded(4)}
          />
          <CaptionCard className="px-8 py-7">
            <p className="relative z-[1] font-['Tektur'] text-[1.45rem] font-black leading-[1.05] text-black">{renderBecomingYouCaption(4)}</p>
          </CaptionCard>
        </div>
      </div>

      {/* Desktop layout */}
      <div
        className="relative hidden cursor-pointer md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] md:gap-[6vw]"
        onClick={handleBecomingYouToggle}
      >
        <div className="relative z-[1] max-w-[54.6rem] md:max-w-[73.7rem]">
          <h2 className="mb-[3vh] text-center font-['Tektur'] text-[2rem] font-black uppercase tracking-[0.14em] text-white [paint-order:stroke_fill] [text-shadow:0_6px_16px_rgba(0,0,0,0.18)] [-webkit-text-stroke:3px_#000] md:mb-6 md:text-[3.4rem]">BECØME</h2>
          <div className="flex flex-col gap-[3vh] md:-translate-x-[8vw]">
            <div className="flex flex-col gap-[3vh] md:flex-row md:items-stretch md:gap-0">
              <VideoCard
                videoRef={setBecomingYouVideoRef(0, "desktop")}
                src={videoSrc("https://videos.vostok.guide/01.webm")}
                dataSrc={getExplanationVideoSrc("https://videos.vostok.guide/01.webm", isMobile)}
                isPaused={areBecomingYouVideosPaused || individuallyPausedBecomingYouVideos[0]}
                isFading={becomingYouVideoFading[0]}
                fadeDurationMs={becomingYouFadeDurationMs}
                onToggle={(e) => handleBecomingYouVideoToggle(0, e)}
                onEnded={() => handleBecomingYouVideoEnded(0)}
                className="md:w-[32vw] md:min-w-[32vw]"
              />
              <CaptionCard className="px-8 py-7 md:-ml-px md:flex md:w-[8.5rem] md:flex-none md:items-center md:justify-center md:px-3 md:py-6">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.22] md:hidden" style={{ backgroundImage: 'url("/section_wallpaper/interest/special-mobile.webp")', backgroundRepeat: "repeat", backgroundPosition: "center", backgroundSize: "108px 108px" }} />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden opacity-[0.2] md:block" style={{ backgroundImage: 'url("/section_wallpaper/interest/special-desktop.webp")', backgroundRepeat: "repeat", backgroundPosition: "center", backgroundSize: "128px 128px" }} />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/48" />
                <p className="relative z-[1] font-['Tektur'] text-[1.45rem] font-black leading-[1.05] text-black md:whitespace-nowrap md:text-[1.9rem] md:leading-none md:[transform:rotate(90deg)]">{renderBecomingYouCaption(0)}</p>
              </CaptionCard>
            </div>
            <div className="md:translate-y-[20vh]">
              <div className="relative md:w-[32vw] md:min-w-[32vw]" onClick={(e) => handleBecomingYouVideoToggle(2, e)}>
                <video ref={setBecomingYouVideoRef(2, "desktop")} className="w-full border border-black/15 object-cover shadow-[0_28px_80px_rgba(0,0,0,0.22)]" autoPlay muted playsInline preload="none" onEnded={() => handleBecomingYouVideoEnded(2)}>
                  <source data-video-src={getExplanationVideoSrc("https://videos.vostok.guide/03.webm", isMobile)} src={videoSrc("https://videos.vostok.guide/03.webm")} type="video/webm" />
                </video>
                <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-white transition-opacity ${becomingYouVideoFading[2] ? "opacity-100" : "opacity-0"}`} style={{ transitionDuration: `${becomingYouFadeDurationMs}ms` }} />
                {areBecomingYouVideosPaused || individuallyPausedBecomingYouVideos[2] ? <PauseIcon /> : null}
                <h2 className="pointer-events-none absolute bottom-[calc(-1.2rem+5vh)] right-[-2.4rem] z-[6] hidden font-['Tektur'] text-[3.2rem] font-black uppercase leading-none tracking-[0.14em] text-white [paint-order:stroke_fill] [text-shadow:0_6px_16px_rgba(0,0,0,0.18)] [-webkit-text-stroke:3px_#000] md:block md:[writing-mode:vertical-rl] md:[text-orientation:mixed]">BØY</h2>
              </div>
              <CaptionCard className="relative mt-[3vh] max-w-[38rem] px-8 py-7 md:mt-[15px] md:w-[32vw] md:max-w-none md:px-10 md:py-8">
                <p className="relative z-[1] font-['Tektur'] text-[1.45rem] font-black leading-[1.05] text-black md:text-center md:text-[1.7rem]">{renderBecomingYouCaption(2)}</p>
              </CaptionCard>
              <div className="md:w-[32vw] md:min-w-[32vw]">
                <h2 className="hidden pt-[1vh] text-center font-['Tektur'] text-[2rem] font-black uppercase tracking-[0.14em] text-white [paint-order:stroke_fill] [text-shadow:0_6px_16px_rgba(0,0,0,0.18)] [-webkit-text-stroke:3px_#000] md:block md:mb-6 md:w-[32vw] md:min-w-[32vw] md:text-[3.4rem]">FAMØUS</h2>
                <div className="relative mt-[3vh]" onClick={(e) => handleBecomingYouVideoToggle(4, e)}>
                  <video ref={setBecomingYouVideoRef(4, "desktop")} className="w-full border border-black/15 object-cover shadow-[0_28px_80px_rgba(0,0,0,0.22)]" autoPlay muted playsInline preload="none" onEnded={() => handleBecomingYouVideoEnded(4)}>
                    <source data-video-src={getExplanationVideoSrc("https://videos.vostok.guide/04.webm", isMobile)} src={videoSrc("https://videos.vostok.guide/04.webm")} type="video/webm" />
                  </video>
                  <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-white transition-opacity ${becomingYouVideoFading[4] ? "opacity-100" : "opacity-0"}`} style={{ transitionDuration: `${becomingYouFadeDurationMs}ms` }} />
                  {areBecomingYouVideosPaused || individuallyPausedBecomingYouVideos[4] ? <PauseIcon /> : null}
                </div>
                <CaptionCard className="relative mt-[3vh] max-w-[38rem] px-8 py-7 md:mb-[10vh] md:w-full md:max-w-none md:px-0 md:py-8">
                  <p className="relative z-[1] px-8 font-['Tektur'] text-[1.45rem] font-black leading-[1.05] text-black md:px-6 md:text-[1.7rem]">{renderBecomingYouCaption(4)}</p>
                </CaptionCard>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-[1] max-w-[49.4rem] md:z-[1] md:max-w-[66.7rem] md:translate-x-[1vw] md:translate-y-[9%] md:justify-self-end">
          <h2 className="relative z-[9] mb-[3vh] text-center font-['Tektur'] text-[2rem] font-black uppercase tracking-[0.14em] text-white [paint-order:stroke_fill] [text-shadow:0_6px_16px_rgba(0,0,0,0.18)] [-webkit-text-stroke:3px_#000] md:mb-6 md:w-[32vw] md:min-w-[32vw] md:-translate-x-[calc(2vw+85px)] md:text-[3.4rem]">DØll</h2>
          <div className="relative z-[5] md:w-[32vw] md:min-w-[32vw]" onClick={(e) => handleBecomingYouVideoToggle(1, e)}>
            <video ref={setBecomingYouVideoRef(1, "desktop")} className="w-full border border-black/15 object-cover shadow-[0_28px_80px_rgba(0,0,0,0.22)]" autoPlay muted playsInline preload="none" onEnded={() => handleBecomingYouVideoEnded(1)}>
              <source data-video-src={getExplanationVideoSrc("https://videos.vostok.guide/02.webm", isMobile)} src={videoSrc("https://videos.vostok.guide/02.webm")} type="video/webm" />
            </video>
            <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-white transition-opacity ${becomingYouVideoFading[1] ? "opacity-100" : "opacity-0"}`} style={{ transitionDuration: `${becomingYouFadeDurationMs}ms` }} />
            {areBecomingYouVideosPaused || individuallyPausedBecomingYouVideos[1] ? <PauseIcon /> : null}
          </div>
          <CaptionCard className="relative z-[1] mt-[3vh] max-w-[38rem] px-8 py-7 md:mt-[calc(-16vw+18vh-15px)] md:w-[calc(32vw-3px)] md:max-w-none md:-translate-x-[calc(31.5vw+3px)] md:px-10 md:py-8">
            <p className="relative z-[1] font-['Tektur'] text-[1.45rem] font-black leading-[1.05] text-black md:text-right md:text-[2rem]">{renderBecomingYouCaption(1)}</p>
          </CaptionCard>
          <h2 className="hidden pt-[1vh] text-center font-['Tektur'] text-[2rem] font-black uppercase tracking-[0.14em] text-white [paint-order:stroke_fill] [text-shadow:0_6px_16px_rgba(0,0,0,0.18)] [-webkit-text-stroke:3px_#000] md:block md:mb-6 md:w-[32vw] md:min-w-[32vw] md:text-[3.4rem]">WØMAN</h2>
          <div className="relative z-[5] mt-[3vh] md:w-[32vw] md:min-w-[32vw]" onClick={(e) => handleBecomingYouVideoToggle(3, e)}>
            <video ref={setBecomingYouVideoRef(3, "desktop")} className="w-full border border-black/15 object-cover shadow-[0_28px_80px_rgba(0,0,0,0.22)]" autoPlay muted playsInline preload="none" onEnded={() => handleBecomingYouVideoEnded(3)}>
              <source data-video-src={getExplanationVideoSrc("https://videos.vostok.guide/05.webm", isMobile)} src={videoSrc("https://videos.vostok.guide/05.webm")} type="video/webm" />
            </video>
            <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-white transition-opacity ${becomingYouVideoFading[3] ? "opacity-100" : "opacity-0"}`} style={{ transitionDuration: `${becomingYouFadeDurationMs}ms` }} />
            {areBecomingYouVideosPaused || individuallyPausedBecomingYouVideos[3] ? <PauseIcon /> : null}
          </div>
          <CaptionCard className="relative z-[7] mt-[3vh] max-w-[38rem] px-8 py-7 md:w-[32vw] md:min-w-[32vw] md:max-w-none md:px-10 md:py-8">
            <p className="relative z-[1] font-['Tektur'] text-[1.45rem] font-black leading-[1.05] text-black md:text-[1.7rem]">{renderBecomingYouCaption(3)}</p>
          </CaptionCard>
        </div>
      </div>
    </InterestSection>
  );
};

export default BecomingSection;
