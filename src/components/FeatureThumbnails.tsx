import { m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getImageVariants } from "@/lib/utils";
import SectionSideTab from "@/components/SectionSideTab";

const getThumbVariants = (src: string) => {
  if (!src.endsWith(".jpg") && !src.endsWith(".jpeg")) {
    return null;
  }
  const match = src.match(/(\.jpe?g)$/i);
  if (!match) {
    return null;
  }
  const ext = match[1];
  const base = src.slice(0, -ext.length);
  return {
    mobile: {
      jpg: `${base}_thumb_mobile${ext}`,
      avif: `${base}_thumb_mobile.avif`,
      webp: `${base}_thumb_mobile.webp`,
    },
    desktop: {
      jpg: `${base}_thumb_desktop${ext}`,
      avif: `${base}_thumb_desktop.avif`,
      webp: `${base}_thumb_desktop.webp`,
    },
  };
};

const features = [
  {
    image: "/images/structure/icons/2.jpg",
    label: "Cheeks",
    value: "47%",
    spec: "More Refined, Structured Cheeks",
    detailTitle: "Cheeks",
    detailText:
      "Cheek projection improves by 12-18% with consistent, targeted work. That's the difference between a face that falls flat and one that catches light correctly. The angle break becomes cleaner, giving you that defined midface structure that signals health and high status. Your jawline tightens alongside it, reaching a 38-41 degree slope that creates a sharp, chiseled edge from every angle. This isn't subtle—this is structural remodeling that changes how light moves across your face.\n\nHarmony Index Movement: 0.68 → 0.83",
    step: 2,
  },
  {
    image: "/images/structure/icons/3.jpg",
    label: "Forehead",
    value: "45%",
    spec: "Less Wrinkles, More Angles",
    detailTitle: "Forehead",
    detailText:
      "Your forehead curvature stabilizes by 10-14%, smoothing out the brow arc and reducing frontal plane deviation. This is the difference between a tired face and a commanding one. A stable, well-supported forehead doesn't just sit there—it frames everything beneath it, giving you that open, alert look that signals wisdom and calm authority. The lines soften. The angles sharpen. Your face finally looks finished.\n\nHarmony Index Movement: 0.71 → 0.84",
    step: 3,
  },
  {
    image: "/images/structure/icons/4.jpg",
    label: "Nose",
    value: "48%",
    spec: "Bilateral Harmony Score",
    detailTitle: "Nose",
    detailText:
      "Bridge alignment can reach a 0.82-0.86 harmony index with dedicated work. That means a steadier ridge taper, more balanced transitions, and a nose that actually integrates with the rest of your face instead of sitting on it like an afterthought. The nose is your central anchor—when it's aligned, everything else falls into place. This is about restoring the midline, creating symmetry where life and gravity stole it.\n\nHarmony Index Movement: 0.69 → 0.84",
    step: 4,
  },
  {
    image: "/images/structure/icons/5.jpg",
    label: "Jaw",
    value: "46%",
    spec: "Edge Contour Balance",
    detailTitle: "Jaw",
    detailText:
      "Mandibular edge definition tightens by 9-12% with proper technique. That's a crisp angle break, a cleaner lower-third slope, and the kind of jawline that makes people trust you instantly. The jaw is your signature. A weak one whispers uncertainty. A defined one broadcasts power. This work rebuilds that foundation, giving you the sharp profile that separates leaders from followers.\n\nHarmony Index Movement: 0.72 → 0.85",
    step: 5,
  },
  {
    image: "/images/structure/icons/6.jpg",
    label: "Eyes",
    value: "43%",
    spec: "Orbital Alignment Score",
    detailTitle: "Eyes",
    detailText:
      "Orbital symmetry improves to a 0.83 balance score with consistent practice. That means reduced tilt variance, a steadier upper lid plane, and eyes that actually hold attention. The eyes are the first thing people read. When they're balanced, bright, and fierce, they signal focus, health, and trustworthiness. This work restores that primal gaze—the kind that makes people feel seen.\n\nHarmony Index Movement: 0.70 → 0.83",
    step: 6,
  },
  {
    image: "/images/structure/icons/7.jpg",
    label: "Ears",
    value: "31%",
    spec: "Lateral Symmetry Index",
    detailTitle: "Ears",
    detailText:
      "Lateral alignment gains 6-9% with targeted work, creating a tighter helix curve and a more consistent profile offset. The ears are the hidden engines of the face—when they're strong and well-positioned, they pull everything back into place. This isn't about ear shape. It's about structural lift. Strong ears anchor the cheeks, tighten the jaw, and give your entire profile that collected, finished look.\n\nHarmony Index Movement: 0.74 → 0.82",
    step: 7,
  },
];

const wallpaperSlides = [
  {
    id: "01",
    desktopVideoSrc: "/wallpapers/refined_videos/01_desktop.mp4",
    mobileVideoSrc: "/wallpapers/refined_videos/01_mobile.mp4",
    caption: "YOUR FACE",
  },
  {
    id: "02",
    desktopVideoSrc: "/wallpapers/refined_videos/02_desktop.mp4",
    mobileVideoSrc: "/wallpapers/refined_videos/02_mobile.mp4",
    caption: "YOUR FACE",
  },
  {
    id: "03",
    desktopVideoSrc: "/wallpapers/refined_videos/03_desktop.mp4",
    mobileVideoSrc: "/wallpapers/refined_videos/03_mobile.mp4",
    caption: "YOUR FACE",
  },
  {
    id: "04",
    desktopVideoSrc: "/wallpapers/refined_videos/04_desktop.mp4",
    mobileVideoSrc: "/wallpapers/refined_videos/04_mobile.mp4",
    caption: "YOUR FACE",
  },
  {
    id: "05",
    desktopVideoSrc: "/wallpapers/refined_videos/05_desktop.mp4",
    mobileVideoSrc: "/wallpapers/refined_videos/05_mobile.mp4",
    caption: "YOUR FACE",
  },
] as const;

type FeatureThumbnailsProps = {
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "reddit" | "twitter" | "direct";
  renderStructureSection?: boolean;
  renderWallpaperSection?: boolean;
};

const FeatureThumbnails = ({
  entrySource = "direct",
  renderStructureSection = true,
  renderWallpaperSection = true,
}: FeatureThumbnailsProps) => {
  const mobileHeroImage = "/section_wallpaper/hero/mobile.png";
  const desktopHeroImage = "/section_wallpaper/hero/final1_desktop.jpg";
  const mobileHeroThunderSrc = "/audio/effect/thunder.m4a";
  const MOBILE_HERO_THUNDER_VOLUME = 0.15;
  const MOBILE_HERO_FLASH_MIN_DELAY_MS = 9000;
  const MOBILE_HERO_FLASH_MAX_DELAY_MS = 18000;
  const MOBILE_HERO_THUNDER_LEAD_IN_MS = 300;
  const MOBILE_HERO_FIRST_FLASH_ON_MS = 400;
  const MOBILE_HERO_SECOND_FLASH_ON_MS = 700;
  const MOBILE_HERO_FLASH_GAP_MS = 1000;
  const WALLPAPER_GLITCH_MIN_DELAY_MS = 5000;
  const WALLPAPER_GLITCH_MAX_DELAY_MS = 15000;
  const WALLPAPER_GLITCH_BLACKOUT_FADE_IN_MS = 400;
  const WALLPAPER_GLITCH_BLACKOUT_FADE_OUT_MS = 200;
  const WALLPAPER_GLITCH_PLAY_MS = 200;
  const WALLPAPER_GLITCH_REWIND_SECONDS = 3;
  const WALLPAPER_CAPTION_HIDE_DELAY_MS = 10000;
  const isFourChan = entrySource === "4chan";
  const [structureStep, setStructureStep] = useState(1);
  const [isHighlightOn, setIsHighlightOn] = useState(false);
  const [isAngleView, setIsAngleView] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  );
  const [wallpaperSlideIndex, setWallpaperSlideIndex] = useState(0);
  const [isWallpaperFlashVisible, setIsWallpaperFlashVisible] = useState(false);
  const [isMobileHeroFlashVisible, setIsMobileHeroFlashVisible] = useState(false);
  const [isMobileHeroTextFlashVisible, setIsMobileHeroTextFlashVisible] = useState(false);
  const [isMobileHeroRainVisible, setIsMobileHeroRainVisible] = useState(false);
  const [isWallpaperBlackFlashVisible, setIsWallpaperBlackFlashVisible] = useState(false);
  const [isWallpaperPlaying, setIsWallpaperPlaying] = useState(true);
  const [isWallpaperUserPaused, setIsWallpaperUserPaused] = useState(false);
  const [wallpaperBlackFlashTransitionMs, setWallpaperBlackFlashTransitionMs] = useState(
    WALLPAPER_GLITCH_BLACKOUT_FADE_IN_MS
  );
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const wallpaperVideoRef = useRef<HTMLVideoElement | null>(null);
  const wallpaperOverlayVideoRef = useRef<HTMLVideoElement | null>(null);
  const wallpaperIntervalRef = useRef<number | null>(null);
  const wallpaperFlashTimeoutRef = useRef<number | null>(null);
  const wallpaperAdvanceTimeoutRef = useRef<number | null>(null);
  const wallpaperCaptionTimeoutRef = useRef<number | null>(null);
  const wallpaperGlitchTimeoutsRef = useRef<number[]>([]);
  const wallpaperGlitchSequenceTimeoutRef = useRef<number | null>(null);
  const mobileHeroFlashTimeoutsRef = useRef<number[]>([]);
  const mobileHeroFlashSequenceTimeoutRef = useRef<number | null>(null);
  const wallpaperIsUserPausedRef = useRef(false);
  const wallpaperIsGlitchingRef = useRef(false);
  const wallpaperAutoAdvanceEnabledRef = useRef(true);
  const mobileHeroThunderAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedMobileHeroThunderSequenceRef = useRef(false);
  const structureImage = `/images/structure/${structureStep}.jpg`;
  const highlightImage =
    structureStep > 1 ? `/images/structure/highlight/${structureStep - 1}.jpg` : "";
  const angleImage =
    structureStep > 1 ? `/images/structure/45/${structureStep - 1}.jpg` : "";
  const hasHighlight = structureStep > 1;
  const activeImage = isAngleView && structureStep > 1
    ? angleImage
    : isHighlightOn && hasHighlight
    ? highlightImage
    : structureImage;
  const intervalRef = useRef<number | null>(null);
  const autoAdvanceEnabledRef = useRef(true);
  const advanceStep = () => {
    setStructureStep((currentStep) => (currentStep >= 7 ? 1 : currentStep + 1));
  };

  const resetAutoAdvance = () => {
    if (!autoAdvanceEnabledRef.current) {
      return;
    }
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(advanceStep, 20000);
  };

  useEffect(() => {
    resetAutoAdvance();
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isMobile || !wallpaperAutoAdvanceEnabledRef.current) {
      return;
    }

    wallpaperIntervalRef.current = window.setInterval(() => {
      setIsWallpaperFlashVisible(true);
      wallpaperAdvanceTimeoutRef.current = window.setTimeout(() => {
        advanceWallpaperSlide("next");
      }, 90);
      wallpaperFlashTimeoutRef.current = window.setTimeout(() => {
        setIsWallpaperFlashVisible(false);
      }, 180);
    }, 20000);

    return () => {
      if (wallpaperIntervalRef.current) {
        window.clearInterval(wallpaperIntervalRef.current);
        wallpaperIntervalRef.current = null;
      }
      if (wallpaperFlashTimeoutRef.current) {
        window.clearTimeout(wallpaperFlashTimeoutRef.current);
        wallpaperFlashTimeoutRef.current = null;
      }
      if (wallpaperAdvanceTimeoutRef.current) {
        window.clearTimeout(wallpaperAdvanceTimeoutRef.current);
        wallpaperAdvanceTimeoutRef.current = null;
      }
    };
  }, [isMobile]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMatch = () => setIsMobile(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  const clearMobileHeroFlashTimeouts = () => {
    mobileHeroFlashTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    mobileHeroFlashTimeoutsRef.current = [];

    if (mobileHeroFlashSequenceTimeoutRef.current) {
      window.clearTimeout(mobileHeroFlashSequenceTimeoutRef.current);
      mobileHeroFlashSequenceTimeoutRef.current = null;
    }

    if (mobileHeroThunderAudioRef.current) {
      mobileHeroThunderAudioRef.current.pause();
      mobileHeroThunderAudioRef.current.currentTime = 0;
    }
  };

  const scheduleMobileHeroFlash = () => {
    clearMobileHeroFlashTimeouts();

    if (!isMobile) {
      setIsMobileHeroFlashVisible(false);
      setIsMobileHeroTextFlashVisible(false);
      setIsMobileHeroRainVisible(false);
      hasPlayedMobileHeroThunderSequenceRef.current = false;
      return;
    }

    if (hasPlayedMobileHeroThunderSequenceRef.current) {
      return;
    }

    const nextDelay =
      Math.floor(
        Math.random() * (MOBILE_HERO_FLASH_MAX_DELAY_MS - MOBILE_HERO_FLASH_MIN_DELAY_MS)
      ) + MOBILE_HERO_FLASH_MIN_DELAY_MS;

    mobileHeroFlashSequenceTimeoutRef.current = window.setTimeout(() => {
      hasPlayedMobileHeroThunderSequenceRef.current = true;
      if (mobileHeroThunderAudioRef.current) {
        mobileHeroThunderAudioRef.current.volume = MOBILE_HERO_THUNDER_VOLUME;
        mobileHeroThunderAudioRef.current.currentTime = 0;
        void mobileHeroThunderAudioRef.current.play().catch(() => {});
      }

      const firstOnTimeout = window.setTimeout(() => {
        setIsMobileHeroFlashVisible(true);
        setIsMobileHeroTextFlashVisible(true);
      }, MOBILE_HERO_THUNDER_LEAD_IN_MS);

      const firstOffTimeout = window.setTimeout(() => {
        setIsMobileHeroFlashVisible(false);
        setIsMobileHeroTextFlashVisible(false);
      }, MOBILE_HERO_THUNDER_LEAD_IN_MS + MOBILE_HERO_FIRST_FLASH_ON_MS);

      const secondOnTimeout = window.setTimeout(() => {
        setIsMobileHeroFlashVisible(true);
        setIsMobileHeroTextFlashVisible(true);
      }, MOBILE_HERO_THUNDER_LEAD_IN_MS + MOBILE_HERO_FIRST_FLASH_ON_MS + MOBILE_HERO_FLASH_GAP_MS);

      const secondOffTimeout = window.setTimeout(() => {
        setIsMobileHeroFlashVisible(false);
        setIsMobileHeroTextFlashVisible(false);
      }, MOBILE_HERO_THUNDER_LEAD_IN_MS + MOBILE_HERO_FIRST_FLASH_ON_MS + MOBILE_HERO_FLASH_GAP_MS + MOBILE_HERO_SECOND_FLASH_ON_MS);

      const rainRevealTimeout = window.setTimeout(() => {
        setIsMobileHeroRainVisible(true);
      }, MOBILE_HERO_THUNDER_LEAD_IN_MS + MOBILE_HERO_FIRST_FLASH_ON_MS + MOBILE_HERO_FLASH_GAP_MS + MOBILE_HERO_SECOND_FLASH_ON_MS + 120);

      mobileHeroFlashTimeoutsRef.current.push(
        firstOnTimeout,
        firstOffTimeout,
        secondOnTimeout,
        secondOffTimeout,
        rainRevealTimeout
      );
    }, nextDelay);
  };

  useEffect(() => {
    scheduleMobileHeroFlash();

    return () => {
      clearMobileHeroFlashTimeouts();
      setIsMobileHeroFlashVisible(false);
      setIsMobileHeroTextFlashVisible(false);
      setIsMobileHeroRainVisible(false);
    };
  }, [isMobile]);

  useEffect(() => {
    if (structureStep === 1 && isHighlightOn) {
      setIsHighlightOn(false);
    }
    if (structureStep === 1 && isAngleView) {
      setIsAngleView(false);
    }
  }, [structureStep, isHighlightOn, isAngleView]);

  const activeFeature = features.find((feature) => feature.step === structureStep) ?? features[0];
  const activeWallpaperSlide = wallpaperSlides[wallpaperSlideIndex] ?? wallpaperSlides[0];
  const activeVariants = getImageVariants(activeImage);
  const isActiveUnlocked = structureStep >= activeFeature.step;
  const defaultDetailTitle = "The Harmony Index Explained";
  const defaultDetailText =
    "Throughout this chapter (and the book), you'll see references to a harmony index. This is a 0.00 to 1.00 scale that measures how well a feature integrates with your overall facial structure.\n\n0.80 and above: Optimal integration. The feature works with your face, not against it.\n\n0.70 to 0.79: Functional but not refined. The feature exists but doesn't contribute to harmony.\n\nBelow 0.70: Structural drag. The feature actively detracts from your overall balance.\n\nYour goal isn't perfection—it's progress. Every decimal point you move is visible. Every percentage gain is real.\n\nNow, let's look at your starting line.";
  const detailTitle = structureStep === 1 ? defaultDetailTitle : activeFeature.detailTitle;
  const detailText = structureStep === 1 ? defaultDetailText : activeFeature.detailText;

  const handleParallaxMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current) {
      return;
    }
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      setParallaxOffset({ x: x * 50, y: y * 34 });
    });
  };

  const handleParallaxLeave = () => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setParallaxOffset({ x: 0, y: 0 });
  };

  const advanceWallpaperSlide = (direction: "previous" | "next") => {
    setWallpaperSlideIndex((current) =>
      direction === "previous"
        ? current === 0
          ? wallpaperSlides.length - 1
          : current - 1
        : current === wallpaperSlides.length - 1
        ? 0
        : current + 1
    );
  };

  const playWallpaperVideos = async (durationMs?: number) => {
    const mainVideo = wallpaperVideoRef.current;
    const overlayVideo = wallpaperOverlayVideoRef.current;

    if (!mainVideo) {
      return;
    }

    await Promise.allSettled([
      mainVideo.play(),
      overlayVideo ? overlayVideo.play() : Promise.resolve(),
    ]);
    setIsWallpaperPlaying(!mainVideo.paused);

    if (durationMs !== undefined) {
      await new Promise<void>((resolve) => {
        const timeoutId = window.setTimeout(resolve, durationMs);
        wallpaperGlitchTimeoutsRef.current.push(timeoutId);
      });
    }
  };

  const pauseWallpaperVideos = () => {
    wallpaperVideoRef.current?.pause();
    wallpaperOverlayVideoRef.current?.pause();
    setIsWallpaperPlaying(false);
  };

  const rewindWallpaperVideos = (seconds: number) => {
    const videos = [wallpaperVideoRef.current, wallpaperOverlayVideoRef.current];

    videos.forEach((video) => {
      if (!video) {
        return;
      }

      video.currentTime = Math.max(0, video.currentTime - seconds);
    });
  };

  const clearWallpaperGlitchTimeouts = () => {
    wallpaperGlitchTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    wallpaperGlitchTimeoutsRef.current = [];

    if (wallpaperGlitchSequenceTimeoutRef.current) {
      window.clearTimeout(wallpaperGlitchSequenceTimeoutRef.current);
      wallpaperGlitchSequenceTimeoutRef.current = null;
    }
  };

  const waitForWallpaperGlitchStep = (durationMs: number) =>
    new Promise<void>((resolve) => {
      const timeoutId = window.setTimeout(resolve, durationMs);
      wallpaperGlitchTimeoutsRef.current.push(timeoutId);
    });

  const flashWallpaperBlack = async () => {
    setWallpaperBlackFlashTransitionMs(WALLPAPER_GLITCH_BLACKOUT_FADE_IN_MS);
    setIsWallpaperBlackFlashVisible(true);
    await waitForWallpaperGlitchStep(WALLPAPER_GLITCH_BLACKOUT_FADE_IN_MS);
    setWallpaperBlackFlashTransitionMs(WALLPAPER_GLITCH_BLACKOUT_FADE_OUT_MS);
    setIsWallpaperBlackFlashVisible(false);
    await waitForWallpaperGlitchStep(WALLPAPER_GLITCH_BLACKOUT_FADE_OUT_MS);
  };

  const scheduleWallpaperGlitch = () => {
    clearWallpaperGlitchTimeouts();

    const nextDelay =
      Math.floor(
        Math.random() * (WALLPAPER_GLITCH_MAX_DELAY_MS - WALLPAPER_GLITCH_MIN_DELAY_MS)
      ) + WALLPAPER_GLITCH_MIN_DELAY_MS;

    wallpaperGlitchSequenceTimeoutRef.current = window.setTimeout(async () => {
      const mainVideo = wallpaperVideoRef.current;

      if (!mainVideo || wallpaperIsUserPausedRef.current || wallpaperIsGlitchingRef.current) {
        scheduleWallpaperGlitch();
        return;
      }

      wallpaperIsGlitchingRef.current = true;

      pauseWallpaperVideos();
      await flashWallpaperBlack();
      rewindWallpaperVideos(WALLPAPER_GLITCH_REWIND_SECONDS);
      await playWallpaperVideos();

      wallpaperIsGlitchingRef.current = false;
      scheduleWallpaperGlitch();
    }, nextDelay);
  };

  const showPreviousWallpaper = () => {
    wallpaperAutoAdvanceEnabledRef.current = false;
    if (wallpaperIntervalRef.current) {
      window.clearInterval(wallpaperIntervalRef.current);
      wallpaperIntervalRef.current = null;
    }
    if (wallpaperFlashTimeoutRef.current) {
      window.clearTimeout(wallpaperFlashTimeoutRef.current);
      wallpaperFlashTimeoutRef.current = null;
    }
    if (wallpaperAdvanceTimeoutRef.current) {
      window.clearTimeout(wallpaperAdvanceTimeoutRef.current);
      wallpaperAdvanceTimeoutRef.current = null;
    }
    setIsWallpaperFlashVisible(false);
    wallpaperIsUserPausedRef.current = false;
    advanceWallpaperSlide("previous");
  };

  const showNextWallpaper = () => {
    wallpaperAutoAdvanceEnabledRef.current = false;
    if (wallpaperIntervalRef.current) {
      window.clearInterval(wallpaperIntervalRef.current);
      wallpaperIntervalRef.current = null;
    }
    if (wallpaperFlashTimeoutRef.current) {
      window.clearTimeout(wallpaperFlashTimeoutRef.current);
      wallpaperFlashTimeoutRef.current = null;
    }
    if (wallpaperAdvanceTimeoutRef.current) {
      window.clearTimeout(wallpaperAdvanceTimeoutRef.current);
      wallpaperAdvanceTimeoutRef.current = null;
    }
    setIsWallpaperFlashVisible(false);
    wallpaperIsUserPausedRef.current = false;
    advanceWallpaperSlide("next");
  };

  const toggleWallpaperVideoPlayback = () => {
    if (isMobile) {
      return;
    }

    const mainVideo = wallpaperVideoRef.current;

    if (!mainVideo) {
      return;
    }

    if (mainVideo.paused) {
      wallpaperIsUserPausedRef.current = false;
      setIsWallpaperUserPaused(false);
      void playWallpaperVideos();
      scheduleWallpaperGlitch();
      return;
    }

    wallpaperIsUserPausedRef.current = true;
    setIsWallpaperUserPaused(true);
    clearWallpaperGlitchTimeouts();
    pauseWallpaperVideos();
  };

  const triggerSystemGlitch = () => {
    window.dispatchEvent(new CustomEvent("vostok:system-glitch-sequence"));
  };

  useEffect(() => {
    wallpaperIsUserPausedRef.current = false;
    setIsWallpaperUserPaused(false);
    setIsWallpaperBlackFlashVisible(false);
    setIsWallpaperPlaying(true);
    scheduleWallpaperGlitch();

    return () => {
      clearWallpaperGlitchTimeouts();
      setIsWallpaperBlackFlashVisible(false);
      wallpaperIsGlitchingRef.current = false;
    };
  }, [wallpaperSlideIndex]);


  return (
    <>
      {renderStructureSection && (
        <section
          ref={sectionRef}
          className="section-surface relative left-1/2 right-1/2 mt-[10vh] w-screen -translate-x-1/2 overflow-hidden px-6 py-8 md:mt-0 md:py-24"
          onPointerMove={handleParallaxMove}
          onPointerLeave={handleParallaxLeave}
        >
          <SectionSideTab label="YOUR PROCESS" />
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="section-surface-fill absolute inset-0" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0)`,
              }}
            />
          </div>
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-16">
              <div className="w-full lg:flex-[1.25]">
                <div className="relative rounded-3xl border border-black/10 bg-white/90 p-2 text-black/80 shadow-[0_30px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl md:p-8">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
              <m.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center mb-3 md:mb-6"
              >
                <p className="text-black/60 tracking-[0.35em] uppercase text-xs mb-4 font-light">
                  {isFourChan
                    ? "Stop doomscrolling. This is your ladder out."
                    : "An Unrefined Face Cannot Compete with a Structured Face"}
                </p>
                {isFourChan && (
                  <p className="mt-3 text-sm text-black/70">
                    This moves 4s to 7s and 6s to 9s. It stacks indefinitely if you keep doing the
                    work.
                  </p>
                )}
              </m.div>

              <m.div
                key={structureStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="relative z-10 mx-auto max-w-3xl mt-0"
              >
                  <div className="relative overflow-hidden rounded-2xl border border-transparent p-0 md:border-black/10 md:p-1">
                  <div className="relative overflow-hidden rounded-[0.9rem]">
                    {activeVariants ? (
                      <picture>
                        <source
                          type="image/avif"
                          srcSet={`${activeVariants.avif.mobile} 640w, ${activeVariants.avif.desktop} 1600w`}
                          sizes="(max-width: 640px) 100vw, 60vw"
                        />
                        <source
                          type="image/webp"
                          srcSet={`${activeVariants.webp.mobile} 640w, ${activeVariants.webp.desktop} 1600w`}
                          sizes="(max-width: 640px) 100vw, 60vw"
                        />
                        <img
                          src={activeVariants.desktop}
                          srcSet={`${activeVariants.mobile} 640w, ${activeVariants.desktop} 1600w`}
                          sizes="(max-width: 640px) 100vw, 60vw"
                          alt="Structured face progression"
                          className="h-[26rem] w-full object-contain md:h-[48rem]"
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    ) : (
                      <img
                        src={activeImage}
                        alt="Structured face progression"
                        className="h-[26rem] w-full object-contain md:h-[48rem]"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    {structureStep > 1 && (
                      <>
                        {!isAngleView && (
                          <button
                            type="button"
                            onClick={() => setIsAngleView(true)}
                            aria-label="Show 45 degree view"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-black/20 bg-white/80 p-3 text-black/80 shadow-[0_8px_16px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1/2 hover:scale-105 md:right-5 md:p-4"
                          >
                            <svg
                              aria-hidden="true"
                              className="h-4 w-4 md:h-5 md:w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m9 6 6 6-6 6" />
                            </svg>
                          </button>
                        )}
                        {isAngleView && (
                          <button
                            type="button"
                            onClick={() => setIsAngleView(false)}
                            aria-label="Return to original view"
                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-black/20 bg-white/80 p-3 text-black/80 shadow-[0_8px_16px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1/2 hover:scale-105 md:left-5 md:p-4"
                          >
                            <svg
                              aria-hidden="true"
                              className="h-4 w-4 md:h-5 md:w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m15 6-6 6 6 6" />
                            </svg>
                          </button>
                        )}
                      </>
                    )}
                    {hasHighlight && !isAngleView && (
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setIsHighlightOn(false)}
                          className={`rounded-full border px-4 pt-2 pb-3 pl-5 text-[10px] uppercase tracking-[0.25em] transition-colors md:px-8 md:pt-3 md:pb-4 md:pl-10 md:text-xs ${
                            !isHighlightOn
                              ? "border-black/70 bg-black/90 text-white"
                              : "border-black/20 bg-white text-black/70 hover:text-black"
                          }`}
                        >
                          Highlight Off
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsHighlightOn(true)}
                          className={`rounded-full border px-4 pt-2 pb-3 pr-5 text-[10px] uppercase tracking-[0.25em] transition-colors md:px-8 md:pt-3 md:pb-4 md:pr-10 md:text-xs ${
                            isHighlightOn
                              ? "border-black/70 bg-black/90 text-white"
                              : "border-black/20 bg-white text-black/70 hover:text-black"
                          }`}
                        >
                          Highlight On
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </m.div>
            </div>
          </div>

          <div className="w-full -mt-8 lg:mt-0 lg:flex-[0.95]">
            <div className="relative flex flex-col rounded-3xl border border-black/10 bg-white/90 p-6 text-black/80 shadow-[0_30px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl md:p-8 lg:h-full lg:justify-between">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-70 pointer-events-none" />
              <div className="relative z-10 mb-3 md:mb-6 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-black/60">
                <span>Performance Suite</span>
                <span className="h-px w-10 bg-black/30" />
                <span className="hidden md:inline">Trim Level S</span>
              </div>

              <h3 className="relative z-10 mb-3 md:mb-5 text-center text-sm md:text-base uppercase tracking-[0.35em] text-black/70">
                Vostok Facial Modification
              </h3>

              <div className="relative z-10 grid grid-cols-3 gap-5 justify-items-center lg:mb-8">
                {features.map((feature, index) => {
                  const isUnlocked = structureStep >= feature.step;
                  const featureThumb = getThumbVariants(feature.image);
                  return (
                    <m.div
                      key={feature.label}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className={`relative flex flex-col items-center text-center rounded-2xl border border-black/15 bg-white/95 p-4 text-black shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-all duration-500 group cursor-pointer ${
                        isUnlocked ? "hover:-translate-y-1" : "opacity-50 grayscale"
                      }`}
                      onClick={() => {
                        advanceStep();
                        resetAutoAdvance();
                      }}
                    >
                      {/* Circular thumbnail */}
                      <div
                        className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-3 border border-black/20 shadow-card transition-shadow duration-500 ${
                          isUnlocked ? "group-hover:shadow-glow" : ""
                        }`}
                      >
                        <span className="absolute right-1 top-1 z-10 rounded-full border border-black/20 bg-white/80 px-2 py-0.5 text-[9px] tracking-[0.2em] text-black/70">
                          {String(feature.step - 1).padStart(2, "0")}
                        </span>
                        {featureThumb ? (
                          <picture>
                            <source
                              type="image/avif"
                              srcSet={`${featureThumb.mobile.avif} 96w, ${featureThumb.desktop.avif} 128w`}
                              sizes="80px"
                            />
                            <source
                              type="image/webp"
                              srcSet={`${featureThumb.mobile.webp} 96w, ${featureThumb.desktop.webp} 128w`}
                              sizes="80px"
                            />
                            <img
                              src={featureThumb.desktop.jpg}
                              srcSet={`${featureThumb.mobile.jpg} 96w, ${featureThumb.desktop.jpg} 128w`}
                              sizes="80px"
                              alt={feature.label}
                              className={`w-full h-full object-cover transition-all duration-700 ${
                                isUnlocked ? "grayscale group-hover:grayscale-0" : "grayscale"
                              }`}
                              loading="lazy"
                              decoding="async"
                            />
                          </picture>
                        ) : (
                          <img
                            src={feature.image}
                            alt={feature.label}
                            className={`w-full h-full object-cover transition-all duration-700 ${
                              isUnlocked ? "grayscale group-hover:grayscale-0" : "grayscale"
                            }`}
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                        <div className="absolute inset-0 rounded-full border border-black/10" />
                      </div>

                      {/* Value */}
                      <span className="text-lg md:text-xl font-light text-black tracking-tight mb-1">
                        {feature.value}
                      </span>

                      {/* Label */}
                      <span className="text-[10px] tracking-[0.25em] uppercase text-black/60">
                        {feature.label}
                      </span>
                      <span
                        className={`h-0.5 w-8 rounded-full transition-opacity duration-300 ${
                          isUnlocked
                          ? "bg-black/60 opacity-100"
                          : "bg-transparent opacity-0"
                        }`}
                      />

                    </m.div>
                  );
                })}
              </div>

              <m.div
                key={structureStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
                className={`relative z-10 mt-4 mb-6 rounded-2xl border border-black/10 bg-white/80 px-4 pb-3 pt-4 md:mt-0 md:px-5 md:pb-4 md:pt-8 ${
                  isActiveUnlocked ? "" : "opacity-55 grayscale"
                }`}
              >
                <p className="text-[12px] uppercase tracking-[0.3em] text-black/50 mb-2">
                  Operator Notes
                </p>
                <h3 className="text-base md:text-lg font-light text-black/80 mb-2">
                  {detailTitle}
                </h3>
                {detailText.split("\n\n").map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm md:text-base text-black/70 leading-relaxed mb-3 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </m.div>

                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Wallpaper section */}
      {renderWallpaperSection && (
        <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden">
          <div
            className="relative min-h-[98vh] w-full md:min-h-[140vh]"
            onClick={!isMobile ? toggleWallpaperVideoPlayback : undefined}
          >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[-28px] z-[9] h-36 bg-[linear-gradient(180deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.55)_38%,rgba(0,0,0,0.29)_68%,rgba(0,0,0,0)_100%)] blur-xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[-10%] top-[-28px] z-[9] h-72 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.65)_24%,rgba(0,0,0,0.39)_46%,rgba(0,0,0,0.18)_66%,rgba(0,0,0,0.05)_82%,rgba(0,0,0,0)_100%)] blur-[56px] md:h-[30rem]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[-6%] bottom-[-36px] z-[9] h-72 bg-[linear-gradient(0deg,rgba(0,0,0,0.86)_0%,rgba(0,0,0,0.58)_22%,rgba(0,0,0,0.28)_48%,rgba(0,0,0,0.1)_70%,rgba(0,0,0,0)_100%)] blur-[56px] md:h-[28rem]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-8%] left-[-44px] top-[-8%] z-[9] w-44 bg-[linear-gradient(90deg,rgba(0,0,0,0.84)_0%,rgba(0,0,0,0.56)_22%,rgba(0,0,0,0.26)_48%,rgba(0,0,0,0.08)_72%,rgba(0,0,0,0)_100%)] blur-[48px] md:w-56"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-8%] right-[-44px] top-[-8%] z-[9] w-44 bg-[linear-gradient(270deg,rgba(0,0,0,0.84)_0%,rgba(0,0,0,0.56)_22%,rgba(0,0,0,0.26)_48%,rgba(0,0,0,0.08)_72%,rgba(0,0,0,0)_100%)] blur-[48px] md:w-56"
          />
          {"desktopVideoSrc" in activeWallpaperSlide ? (
            isMobile ? (
              <img
                src={mobileHeroImage}
                alt="Vostok hero"
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <img
                src={desktopHeroImage}
                alt="Vostok hero"
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            )
          ) : (
            <picture>
              <source media="(max-width: 767px)" srcSet={activeWallpaperSlide.mobileSrc} />
              <img
                key={activeWallpaperSlide.id}
                src={activeWallpaperSlide.desktopSrc}
                alt={`Vostok wallpaper ${activeWallpaperSlide.id}`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </picture>
          )}
          {!isMobile && (
            <div aria-hidden="true" className="hero-tv-noise absolute inset-0 z-[7]">
              <div className="hero-tv-noise__grain absolute inset-0" />
              <div className="hero-tv-noise__scan absolute inset-0" />
              <div className="hero-tv-noise__glitch absolute inset-0" />
            </div>
          )}
          {isMobile && (
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 z-[9] transition-opacity duration-700 ${
                isMobileHeroRainVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="mobile-hero-rain-pane mobile-hero-rain-pane--left absolute inset-y-0 left-0 w-[34%]" />
              <div className="mobile-hero-rain-pane mobile-hero-rain-pane--right absolute inset-y-0 right-0 w-[34%]" />
              <div className="mobile-hero-rain-shelter absolute inset-x-0 top-0 h-[22vh]" />
            </div>
          )}
          {!isMobile && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[7] bg-[linear-gradient(180deg,rgba(118,155,255,0.045)_0%,rgba(88,132,235,0.035)_38%,rgba(46,92,196,0.05)_100%)]"
            />
          )}
          <div className="pointer-events-none absolute inset-0 z-[8] bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.16)_35%,rgba(0,0,0,0.58)_100%)]" />
          {!isMobile && !isWallpaperPlaying && isWallpaperUserPaused && (
            <div className="pointer-events-none absolute inset-0 z-[12] flex items-center justify-center bg-black/10">
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/45 bg-black/45 text-white shadow-[0_18px_44px_rgba(0,0,0,0.35)] backdrop-blur-sm">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-8 w-8"
                >
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              </span>
            </div>
          )}
          {isMobile && (
            <div
              className={`absolute inset-0 bg-white transition-opacity duration-150 ${
                isMobileHeroFlashVisible ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            />
          )}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-[9] bg-black transition-opacity ${
              isWallpaperBlackFlashVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: `${wallpaperBlackFlashTransitionMs}ms` }}
          />
          {!isMobile && (
            <p
              className="pointer-events-none absolute left-[10.25vw] top-[7vh] z-10 font-['Tektur'] text-[1.5rem] font-black uppercase tracking-[0.28em] text-white [text-shadow:0_4px_18px_rgba(0,0,0,0.72)]"
            >
              VOSTOK
            </p>
          )}
          <audio ref={mobileHeroThunderAudioRef} src={mobileHeroThunderSrc} preload="auto" />
          <div className="absolute left-1/2 top-[44vh] z-10 w-full -translate-x-1/2 px-6 text-center md:bottom-0 md:left-0 md:top-auto md:w-auto md:translate-x-0 md:px-0 md:text-left md:pb-[12vh] md:pl-[10vw]">
            {isMobile && (
              <>
                <p
                  className={`pointer-events-none absolute left-1/2 top-[-24vh] w-full -translate-x-1/2 px-8 text-center text-[34px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-100 ${
                    isMobileHeroTextFlashVisible
                      ? "scale-[1.02] drop-shadow-[0_0_18px_rgba(255,255,255,0.95)]"
                      : "drop-shadow-[0_6px_20px_rgba(0,0,0,0.9)]"
                  }`}
                >
                  <span className="block">VØSTØKMETHØD</span>
                  <span className="block">.com</span>
                </p>
                <div
                  className={`pointer-events-none absolute left-1/2 top-[31vh] flex w-full -translate-x-1/2 justify-center px-8 text-[34px] font-medium text-white transition-all duration-100 ${
                    isMobileHeroTextFlashVisible
                      ? "scale-[1.02] drop-shadow-[0_0_18px_rgba(255,255,255,0.95)]"
                      : "drop-shadow-[0_6px_20px_rgba(0,0,0,0.9)]"
                  }`}
                >
                  <span className="inline-flex items-end gap-[0.06em]">
                    <span className="inline-block -rotate-[7.5deg] translate-y-[0.4rem]">ヴ</span>
                    <span className="inline-block -rotate-[4.5deg] translate-y-[0.18rem]">ォ</span>
                    <span className="inline-block -rotate-[1.5deg] translate-y-[0.04rem]">ス</span>
                    <span className="inline-block rotate-[1.5deg] translate-y-[0.04rem]">ト</span>
                    <span className="inline-block rotate-[4.5deg] translate-y-[0.18rem]">ク</span>
                  </span>
                </div>
              </>
            )}
            {!isMobile && (
              <>
                <p
                  className="hero-quote-glow pointer-events-none font-quote mt-6 max-w-[36rem] text-left text-[1.1rem] italic leading-[1.55] tracking-[0.05em] text-silver md:-ml-[7.5vw] md:text-[1.6rem]"
                >
                  <span className="block">Gaze upon the truth.</span>
                  <span className="mt-2 block pl-[2.9rem]">And the truth... shall set you free.</span>
                </p>
              </>
            )}
          </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FeatureThumbnails;
