import { m } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { track } from "@vercel/analytics";
import { trackOnce, trackSafe } from "@/lib/analytics";
import { getImageVariants } from "@/lib/utils";

type HeroSectionProps = {
  hideWatchPrompt?: boolean;
  onMobileFlashComplete?: () => void;
  onRequestBuy?: (continueToCheckout: () => void) => void;
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "reddit" | "twitter" | "direct";
};

const HeroSection = ({
  hideWatchPrompt = false,
  onMobileFlashComplete,
  onRequestBuy,
  entrySource = "direct",
}: HeroSectionProps) => {
  const [isAfter, setIsAfter] = useState(false);
  const [activeSuite, setActiveSuite] = useState<"precision" | "adaptive" | "sculpted">(
    "precision"
  );
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);
  const [heroFloatOffset, setHeroFloatOffset] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mobileFlashIndex, setMobileFlashIndex] = useState<number | null>(null);
  const [isHeroMenuOpen, setIsHeroMenuOpen] = useState(true);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);
  const [mobileIntroPhase, setMobileIntroPhase] = useState<
    "pending" | "video1" | "video2" | "done"
  >("pending");
  const [mobileIntroKey, setMobileIntroKey] = useState(0);
  const [isHeroLocked, setIsHeroLocked] = useState(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const suiteTimerRef = useRef<number | null>(null);
  const redirectIntervalRef = useRef<number | null>(null);
  const redirectTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const flashTimersRef = useRef<number[]>([]);
  const mobileImageIntervalRef = useRef<number | null>(null);
  const heroLockTimersRef = useRef<number[]>([]);
  const afterTimersRef = useRef<number[]>([]);
  const afterIntervalRef = useRef<number | null>(null);
  const hasRunMobileFlash = useRef(false);
  const hasReportedMobileFlash = useRef(false);
  const hasStartedMobileIntro = useRef(false);
  const skipMobileIntroRef = useRef(false);
  const maxOffsetRef = useRef(0);
  const [copyIndex, setCopyIndex] = useState(0);
  const [isCopyHighlight, setIsCopyHighlight] = useState(true);
  const audioUnlockedRef = useRef(false);
  const audioCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const mainFlashAudioRef = useRef<HTMLAudioElement | null>(null);
  const mainFlashDelayRef = useRef<number | null>(null);
  const isFlashActiveRef = useRef(false);
  const [mobileSwipeKey, setMobileSwipeKey] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const swipeDuration = 0.5;
  const motionEnabled = isDesktop;
  const gumroadUrl = "https://vostok67.gumroad.com/l/vostokmethod?wanted=true";
  const isTwitter = entrySource === "twitter";
  const unlockHeroMotion = () => {
    if (!isHeroLocked) {
      return;
    }
    setIsHeroLocked(false);
    heroLockTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    heroLockTimersRef.current = [];
    trackSafe("hero_unlock");
  };

  const skipMobileFlashSequence = () => {
    if (mobileFlashIndex === null || hasReportedMobileFlash.current) {
      return;
    }
    flashTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    flashTimersRef.current = [];
    stopMainFlashAudio();
    hasRunMobileFlash.current = true;
    setMobileFlashIndex(null);
    hasReportedMobileFlash.current = true;
    setHasScrolled(true);
    onMobileFlashComplete?.();
    if (!skipMobileIntroRef.current) {
      startMobileIntro();
    }
  };

  const skipMobileIntroVideos = () => {
    skipMobileIntroRef.current = true;
    hasStartedMobileIntro.current = true;
    setMobileIntroPhase("done");
  };

  const showBefore = () => {
    setIsAfter(false);
    setMobileImageIndex(0);
    triggerMobileSwipe();
    startHeroLockSequence();
    trackSafe("hero_toggle_front");
  };

  const showAfter = () => {
    setIsAfter(true);
    setMobileImageIndex(0);
    triggerMobileSwipe();
    startHeroLockSequence();
    trackSafe("hero_toggle_side");
  };

  const startMobileIntro = () => {
    if (hasStartedMobileIntro.current) {
      return;
    }
    hasStartedMobileIntro.current = true;
    window.setTimeout(() => {
      setMobileIntroKey((current) => current + 1);
      setMobileIntroPhase("video1");
    }, 100);
  };

  const imageSets = {
    precision: {
      front: { left: "/images/1.jpg", right: "/images/2.jpg" },
      side: { left: "/images/4.jpg", right: "/images/3.jpeg" },
    },
    adaptive: {
      front: { left: "/images/8.jpg", right: "/images/7.jpg" },
      side: { left: "/images/5.jpg", right: "/images/6.jpg" },
    },
    sculpted: {
      front: { left: "/images/12.jpg", right: "/images/14.jpg" },
      side: { left: "/images/13.jpg", right: "/images/15.jpg" },
    },
  };

  const currentSet = imageSets[activeSuite];
  const currentView = isAfter ? currentSet.side : currentSet.front;
  const rightImageFocus =
    activeSuite === "adaptive" ? "object-center" : "object-bottom md:object-center";
  const leftMobileScale = "scale-[1.02] origin-bottom md:scale-100";
  const rightMobileScale = "scale-[1.04] origin-bottom md:scale-100";
  const transitionKey = `${activeSuite}-${isAfter ? "side" : "front"}`;
  const suiteOrder: Array<"precision" | "adaptive" | "sculpted"> = [
    "precision",
    "adaptive",
    "sculpted",
  ];
  const leftVariants = getImageVariants(currentView.left);
  const rightVariants = getImageVariants(currentView.right);
  const mobileImage = mobileImageIndex === 0 ? currentView.left : currentView.right;
  const mobileImageVariants = getImageVariants(mobileImage);
  const mobileFlashSequence = useMemo(
    () => [
      { kind: "text", text: "MODERN\nLIFE", atMs: 0, audioSrc: "/audio/1.m4a" },
      { kind: "image", src: "/images/1.jpg", alt: "Myself before", atMs: 700 },
      { kind: "text", text: "WEAKENS", atMs: 1400, audioSrc: "/audio/2.m4a" },
      { kind: "image", src: "/images/2.jpg", alt: "Myself after", atMs: 2100 },
      { kind: "text", text: "THE FACE", atMs: 2800, audioSrc: "/audio/3.m4a" },
      { kind: "image", src: "/images/8.jpg", alt: "Client 1 before", atMs: 3500 },
      { kind: "text", text: "SOFT FOOD", atMs: 4200, audioSrc: "/audio/4.m4a" },
      { kind: "image", src: "/images/7.jpg", alt: "Client 1 after", atMs: 4900 },
      { kind: "text", text: "SCREENS", atMs: 5600, audioSrc: "/audio/5.m4a" },
      { kind: "image", src: "/images/12.jpg", alt: "Client 2 before", atMs: 6300 },
      { kind: "text", text: "MOUTH BREATHING", atMs: 7000, audioSrc: "/audio/6.m4a" },
      { kind: "image", src: "/images/14.jpg", alt: "Client 2 after", atMs: 7700 },
      {
        kind: "text",
        text: "STRUCTURE\nRESPONDS\nTO FORCE",
        atMs: 8400,
        audioSrc: "/audio/final.m4a",
      },
      { kind: "text", text: "VOSTOK\nMETHOD", atMs: 9600 },
      { kind: "black", atMs: 11100 },
    ],
    []
  );
  const flashSequenceDuration = 12600;
  const activeFlash = mobileFlashIndex !== null ? mobileFlashSequence[mobileFlashIndex] : null;
  const activeFlashVariants =
    activeFlash && (activeFlash.kind === "image" || activeFlash.kind === "imageText")
      ? getImageVariants(activeFlash.src)
      : null;
  const playFlashAudio = (src?: string) => {
    if (!src) {
      return;
    }
    const cached = audioCacheRef.current.get(src);
    const audio = cached ?? new Audio(src);
    if (!cached) {
      audio.preload = "auto";
      audioCacheRef.current.set(src, audio);
    }
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const startMainFlashAudio = () => {
    if (mainFlashDelayRef.current) {
      window.clearTimeout(mainFlashDelayRef.current);
      mainFlashDelayRef.current = null;
    }
    if (!mainFlashAudioRef.current) {
      const audio = new Audio("/audio/main.mp3");
      audio.preload = "auto";
      audio.volume = 1;
      mainFlashAudioRef.current = audio;
    }
    const audio = mainFlashAudioRef.current;
    audio.currentTime = 0;
    mainFlashDelayRef.current = window.setTimeout(() => {
      audio.play().catch(() => {});
      mainFlashDelayRef.current = null;
    }, 150);
  };

  const stopMainFlashAudio = () => {
    if (mainFlashDelayRef.current) {
      window.clearTimeout(mainFlashDelayRef.current);
      mainFlashDelayRef.current = null;
    }
    const audio = mainFlashAudioRef.current;
    if (!audio) {
      return;
    }
    audio.pause();
    audio.currentTime = 0;
  };

  const clampZoom = (next: number) => Math.min(1.4, Math.max(0.9, next));
  const handleZoomIn = () => setZoomLevel((current) => clampZoom(current + 0.08));
  const handleZoomOut = () => setZoomLevel((current) => clampZoom(current - 0.08));

  useEffect(() => {
    const audioSources = mobileFlashSequence
      .map((entry) => entry.audioSrc)
      .filter((src): src is string => Boolean(src));
    audioSources.push("/audio/main.mp3");
    audioSources.forEach((src) => {
      if (!audioCacheRef.current.has(src)) {
        const audio = new Audio(src);
        audio.preload = "auto";
        audioCacheRef.current.set(src, audio);
      }
    });

    const unlockAudio = () => {
      if (audioUnlockedRef.current) {
        return;
      }
      audioUnlockedRef.current = true;
      const sampleSrc = audioSources[0];
      if (!sampleSrc) {
        return;
      }
      const sample = audioCacheRef.current.get(sampleSrc);
      if (!sample) {
        return;
      }
      const originalVolume = sample.volume;
      sample.volume = 0;
      sample
        .play()
        .then(() => {
          sample.pause();
          sample.currentTime = 0;
          sample.volume = originalVolume;
        })
        .catch(() => {
          sample.volume = originalVolume;
        });
      if (isFlashActiveRef.current) {
        startMainFlashAudio();
      }
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };
  }, [mobileFlashSequence]);
  const copyVariants = [
    <>
      <p>
        Modern life weakens facial structure.
        <span className="block mt-3">Soft diets reduce jaw strength.</span>
        <span className="block">Screens weaken posture.</span>
        <span className="block">Mouth breathing alters facial development.</span>
        <span className="block mt-3">
          The Vostok Method reintroduces the structural forces the face evolved to respond to.
        </span>
      </p>
    </>,
    <>
      <p>
        A structural training protocol designed to improve jaw strength, posture, and facial
        alignment
      </p>
      <p className="mt-3 text-steel/70 text-[9px] md:text-base font-light tracking-[0.08em] uppercase">
        Exercises • Anatomy diagrams • Structural mechanics
      </p>
    </>,
  ];
  const resetSuiteTimer = () => {
    if (isHeroLocked) {
      return;
    }
    if (suiteTimerRef.current) {
      window.clearInterval(suiteTimerRef.current);
    }
    suiteTimerRef.current = window.setInterval(() => {
      setActiveSuite((current) => {
        const currentIndex = suiteOrder.indexOf(current);
        return suiteOrder[(currentIndex + 1) % suiteOrder.length];
      });
    }, 30000);
  };

  useEffect(() => {
    if (isHeroLocked) {
      if (suiteTimerRef.current) {
        window.clearInterval(suiteTimerRef.current);
        suiteTimerRef.current = null;
      }
      return;
    }
    resetSuiteTimer();
    return () => {
      if (suiteTimerRef.current) {
        window.clearInterval(suiteTimerRef.current);
        suiteTimerRef.current = null;
      }
    };
  }, [isHeroLocked]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateMatch = () => setIsDesktop(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setShowMobileCta(false);
      setHeroFloatOffset(0);
      setHasScrolled(false);
      setMobileIntroPhase("done");
      hasStartedMobileIntro.current = false;
      return;
    }

    const updateScroll = () => {
      if (rafRef.current) {
        return;
      }
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const scrollY = window.scrollY;
        const nextOffset = Math.min(scrollY * 0.35, maxOffsetRef.current);
        setHeroFloatOffset((current) => Math.max(current, nextOffset));

        const sectionHeight = heroSectionRef.current?.offsetHeight ?? 0;
        setShowMobileCta(sectionHeight > 0 && scrollY >= sectionHeight - 8);
      });
    };

    const updateMetrics = () => {
      maxOffsetRef.current = window.innerHeight * 0.18;
      updateScroll();
    };

    updateMetrics();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateMetrics);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateMetrics);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isDesktop]);

  useEffect(() => {
    const timeouts: number[] = [];
    const triggerHighlight = () => {
      setIsCopyHighlight(true);
      timeouts.push(window.setTimeout(() => setIsCopyHighlight(false), 900));
    };
    triggerHighlight();
    const interval = window.setInterval(() => {
      setCopyIndex((current) => (current + 1) % copyVariants.length);
      triggerHighlight();
    }, 20000);
    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      window.clearInterval(interval);
    };
  }, [copyVariants.length]);

  useEffect(() => {
    if (isDesktop || hasRunMobileFlash.current) {
      return;
    }
    hasRunMobileFlash.current = true;
    isFlashActiveRef.current = true;
    if (audioUnlockedRef.current) {
      startMainFlashAudio();
    }
    const timeouts: number[] = [];
    mobileFlashSequence.forEach((entry, index) => {
      const timeout = window.setTimeout(() => {
        setMobileFlashIndex(index);
      }, entry.atMs);
      timeouts.push(timeout);
      if (entry.audioSrc) {
        const audioAtMs = entry.audioAtMs ?? entry.atMs;
        timeouts.push(window.setTimeout(() => playFlashAudio(entry.audioSrc), audioAtMs));
      }
    });
    timeouts.push(
      window.setTimeout(() => {
        setMobileFlashIndex(null);
        stopMainFlashAudio();
        isFlashActiveRef.current = false;
      }, flashSequenceDuration)
    );
    flashTimersRef.current = timeouts;
    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      flashTimersRef.current = [];
      stopMainFlashAudio();
      isFlashActiveRef.current = false;
    };
  }, [isDesktop, mobileFlashSequence, flashSequenceDuration]);

  useEffect(() => {
    if (isDesktop || !hasRunMobileFlash.current || hasReportedMobileFlash.current) {
      return;
    }
    if (mobileFlashIndex === null) {
      // NOTE: After the flash sequence ends, ALWAYS start with 1.mp4, then 2.mp4.
      hasReportedMobileFlash.current = true;
      setHasScrolled(true);
      onMobileFlashComplete?.();
      startMobileIntro();
    }
  }, [isDesktop, mobileFlashIndex, onMobileFlashComplete]);

  useEffect(() => {
    if (mobileFlashIndex === null || hasReportedMobileFlash.current) {
      return;
    }
    const handlePointerDown = () => {
      skipMobileFlashSequence();
    };
    window.addEventListener("pointerdown", handlePointerDown, { passive: true, capture: true });
    window.addEventListener("mousedown", handlePointerDown, { passive: true, capture: true });
    window.addEventListener("click", handlePointerDown, { passive: true, capture: true });
    window.addEventListener("touchstart", handlePointerDown, { passive: true, capture: true });
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("mousedown", handlePointerDown, true);
      window.removeEventListener("click", handlePointerDown, true);
      window.removeEventListener("touchstart", handlePointerDown, true);
    };
  }, [mobileFlashIndex]);

  useEffect(() => {
    if (isDesktop) {
      return;
    }
    if (isHeroLocked) {
      if (mobileImageIntervalRef.current) {
        window.clearInterval(mobileImageIntervalRef.current);
        mobileImageIntervalRef.current = null;
      }
      return;
    }
    setMobileImageIndex(0);
    mobileImageIntervalRef.current = window.setInterval(() => {
      setMobileImageIndex((current) => (current === 0 ? 1 : 0));
    }, 5000);
    return () => {
      if (mobileImageIntervalRef.current) {
        window.clearInterval(mobileImageIntervalRef.current);
        mobileImageIntervalRef.current = null;
      }
    };
  }, [isDesktop, activeSuite, isAfter, isHeroLocked]);

  useEffect(() => {
    if (isDesktop) {
      return;
    }
    if (!hasRunMobileFlash.current) {
      setMobileIntroPhase("pending");
    }
  }, [isDesktop]);

  useEffect(() => {
    if (isDesktop) {
      return;
    }
    if (isHeroLocked) {
      return;
    }
    setIsAfter(false);
    afterTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    afterTimersRef.current = [];
    if (afterIntervalRef.current) {
      window.clearInterval(afterIntervalRef.current);
      afterIntervalRef.current = null;
    }

    const timers: number[] = [];
    const schedule = (delay: number, callback: () => void) => {
      timers.push(window.setTimeout(callback, delay));
    };

    schedule(2000, () => setIsAfter(true));
    schedule(4000, () => setIsAfter(false));
    schedule(9000, () => setIsAfter(true));
    schedule(19000, () => {
      setIsAfter(false);
      afterIntervalRef.current = window.setInterval(() => {
        setIsAfter((current) => !current);
      }, 10000);
    });

    afterTimersRef.current = timers;

    return () => {
      afterTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      afterTimersRef.current = [];
      if (afterIntervalRef.current) {
        window.clearInterval(afterIntervalRef.current);
        afterIntervalRef.current = null;
      }
    };
  }, [isDesktop, isHeroLocked]);

  useEffect(() => {
    if (!isRedirecting || !isDesktop) {
      return;
    }

    const interval = window.setInterval(() => {
      setCountdown((current) => (current > 1 ? current - 1 : 1));
    }, 1000);
    const timeout = window.setTimeout(() => {
      window.open(gumroadUrl, "_blank", "noopener,noreferrer");
      setIsRedirecting(false);
    }, 3000);
    redirectIntervalRef.current = interval;
    redirectTimeoutRef.current = timeout;

    return () => {
      if (redirectIntervalRef.current) {
        window.clearInterval(redirectIntervalRef.current);
        redirectIntervalRef.current = null;
      }
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
    };
  }, [isRedirecting, gumroadUrl, isDesktop]);

  const closeRedirect = () => {
    if (redirectIntervalRef.current) {
      window.clearInterval(redirectIntervalRef.current);
      redirectIntervalRef.current = null;
    }
    if (redirectTimeoutRef.current) {
      window.clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
    setCountdown(3);
    setIsRedirecting(false);
  };

  const handleSuiteChange = (suite: "precision" | "adaptive" | "sculpted") => {
    setActiveSuite(suite);
    setMobileImageIndex(0);
    triggerMobileSwipe();
    startHeroLockSequence();
    trackSafe("hero_suite_change", { suite });
  };
  const handleBuyNow = () => {
    if (isDesktop) {
      setCountdown(3);
      setIsRedirecting(true);
    } else {
      window.open(gumroadUrl, "_blank", "noopener,noreferrer");
    }
  };
  const handleBuyClick = () => {
    track("buy_button", { location: "hero" });
    if (entrySource === "facebook") {
      track("buy_button_facebook", { location: "hero" });
    }
    if (entrySource === "4chan") {
      track("buy_button_4chan", { location: "hero" });
    }
    if (entrySource === "instagram") {
      track("buy_button_instagram", { location: "hero" });
    }
    if (entrySource === "twitter") {
      track("buy_button_twitter", { location: "hero" });
    }
    if (entrySource === "tiktok") {
      track("buy_button_tiktok", { location: "hero" });
    }
    if (onRequestBuy) {
      onRequestBuy(handleBuyNow);
      return;
    }
    handleBuyNow();
  };

  const triggerMobileSwipe = () => {
    if (isDesktop) {
      return;
    }
    setMobileSwipeKey((current) => current + 1);
  };

  const startHeroLockSequence = () => {
    setIsHeroLocked(true);
    skipMobileFlashSequence();
    if (skipMobileIntroRef.current) {
      skipMobileIntroVideos();
    }
    heroLockTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    heroLockTimersRef.current = [];
    if (suiteTimerRef.current) {
      window.clearInterval(suiteTimerRef.current);
      suiteTimerRef.current = null;
    }
    if (mobileImageIntervalRef.current) {
      window.clearInterval(mobileImageIntervalRef.current);
      mobileImageIntervalRef.current = null;
    }
    afterTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    afterTimersRef.current = [];
    if (afterIntervalRef.current) {
      window.clearInterval(afterIntervalRef.current);
      afterIntervalRef.current = null;
    }
    heroLockTimersRef.current.push(
      window.setTimeout(() => {
        setMobileImageIndex((current) => (current === 0 ? 1 : 0));
      }, 2000)
    );
    heroLockTimersRef.current.push(
      window.setTimeout(() => {
        setMobileImageIndex((current) => (current === 0 ? 1 : 0));
      }, 4000)
    );
    heroLockTimersRef.current.push(
      window.setTimeout(() => {
        setMobileImageIndex((current) => (current === 0 ? 1 : 0));
      }, 6000)
    );
  };

  const lockHeroMotion = (event?: ReactMouseEvent<HTMLElement>) => {
    if (isHeroLocked) {
      return;
    }
    const target = event?.target as HTMLElement | null;
    if (target?.closest("button, a, input, textarea, select, [data-hero-ignore]")) {
      skipMobileIntroVideos();
    }
    startHeroLockSequence();
    trackOnce("hero_lock_click");
  };

  const handleChatOpen = () => {
    if (window.chatbase) {
      window.chatbase("open");
      return;
    }
    if (import.meta.env.DEV) {
      console.warn("Chatbase widget not ready yet.");
    }
  };

  const heroMinHeight = isDesktop
    ? entrySource === "4chan"
      ? "126vh"
      : "115vh"
    : "100vh";

  return (
    <section
      ref={heroSectionRef}
      onClick={(event) => lockHeroMotion(event)}
      onClickCapture={(event) => lockHeroMotion(event)}
      className="relative flex items-start justify-center overflow-hidden pt-6 pb-0 md:pt-0 md:pb-16 md:items-center"
      style={{ minHeight: heroMinHeight }}
    >
      <div className="fixed top-0 left-0 right-0 z-40 hidden md:flex items-center justify-between border-b border-white/10 bg-black/70 px-6 py-2 backdrop-blur">
        <span className="text-[10px] uppercase tracking-[0.35em] text-chrome/80">
          Vostok Method
        </span>
        <div className="flex items-center gap-4">
          <a
            href="https://discord.gg/DvMc34ygjx"
            target="_blank"
            rel="noreferrer"
            aria-label="Discord"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-foreground/80 transition hover:text-foreground"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M19.54 5.07a18.3 18.3 0 0 0-4.56-1.43c-.2.36-.44.84-.6 1.22a16.9 16.9 0 0 0-4.76 0c-.17-.38-.4-.86-.6-1.22-1.6.28-3.13.77-4.56 1.43-2.88 4.27-3.66 8.43-3.27 12.52 1.7 1.27 3.35 2.04 4.98 2.55.4-.54.75-1.11 1.05-1.72a10.5 10.5 0 0 1-1.65-.8c.14-.1.27-.2.4-.31 3.18 1.5 6.6 1.5 9.74 0 .13.11.26.21.4.31-.53.32-1.08.59-1.65.8.3.61.65 1.18 1.05 1.72 1.63-.51 3.28-1.28 4.98-2.55.47-4.74-.8-8.86-3.27-12.52ZM8.98 14.06c-.86 0-1.56-.8-1.56-1.78 0-.98.68-1.78 1.56-1.78.88 0 1.58.8 1.56 1.78 0 .98-.68 1.78-1.56 1.78Zm6.04 0c-.86 0-1.56-.8-1.56-1.78 0-.98.68-1.78 1.56-1.78.88 0 1.58.8 1.56 1.78 0 .98-.68 1.78-1.56 1.78Z" />
            </svg>
          </a>
          <a
            href="https://t.me/+h5yMAzkhmcY3NTFh"
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-foreground/80 transition hover:text-foreground"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M21.6 4.4a1.2 1.2 0 0 0-1.26-.2L3.6 11.1a1.2 1.2 0 0 0 .08 2.28l4.72 1.55 1.86 5.52c.2.6.96.78 1.42.34l2.7-2.6 4.94 3.64c.5.37 1.22.08 1.32-.53l2.7-16.16a1.2 1.2 0 0 0-.74-1.34ZM8.74 13.9l9.25-5.7-7.18 6.58-.28 3.1-1.06-3.13-3.06-1 2.33-.85Z" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61588217763336"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-foreground/80 transition hover:text-foreground"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M13.5 9H15V6h-2.25C10.8 6 10 7.05 10 8.4V10H8v3h2v5h3v-5h2.1l.6-3H13V8.55c0-.36.18-.55.5-.55z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/vostok.method/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-foreground/80 transition hover:text-foreground"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="3.5" />
              <circle cx="17" cy="7" r="1" />
            </svg>
          </a>
          <button
            type="button"
            onClick={handleChatOpen}
            aria-label="Open chat"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-foreground/80 transition hover:text-foreground"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M21 14a4 4 0 0 1-4 4H8l-5 3V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleBuyClick}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-foreground/90 transition hover:text-foreground"
          >
            {entrySource === "4chan" ? "NEETBUX HERE" : "Buy Now"}
          </button>
        </div>
      </div>
      {!isHeroMenuOpen && (
        <button
          type="button"
          onClick={() => setIsHeroMenuOpen(true)}
          className="absolute right-2 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/30 bg-black/60 px-3 py-2 text-[10px] uppercase tracking-[0.35em] text-foreground"
        >
          Menu
        </button>
      )}
      {showMobileCta && (
        <m.div
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-black/70 px-4 py-3 backdrop-blur md:hidden"
        >
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="The Timeless Face logo" className="h-5 w-5" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-chrome/80">
              Vostok
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://discord.gg/DvMc34ygjx"
              target="_blank"
              rel="noreferrer"
              aria-label="Discord"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-foreground/80"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3.5 w-3.5"
              >
                <path d="M19.54 5.07a18.3 18.3 0 0 0-4.56-1.43c-.2.36-.44.84-.6 1.22a16.9 16.9 0 0 0-4.76 0c-.17-.38-.4-.86-.6-1.22-1.6.28-3.13.77-4.56 1.43-2.88 4.27-3.66 8.43-3.27 12.52 1.7 1.27 3.35 2.04 4.98 2.55.4-.54.75-1.11 1.05-1.72a10.5 10.5 0 0 1-1.65-.8c.14-.1.27-.2.4-.31 3.18 1.5 6.6 1.5 9.74 0 .13.11.26.21.4.31-.53.32-1.08.59-1.65.8.3.61.65 1.18 1.05 1.72 1.63-.51 3.28-1.28 4.98-2.55.47-4.74-.8-8.86-3.27-12.52ZM8.98 14.06c-.86 0-1.56-.8-1.56-1.78 0-.98.68-1.78 1.56-1.78.88 0 1.58.8 1.56 1.78 0 .98-.68 1.78-1.56 1.78Zm6.04 0c-.86 0-1.56-.8-1.56-1.78 0-.98.68-1.78 1.56-1.78.88 0 1.58.8 1.56 1.78 0 .98-.68 1.78-1.56 1.78Z" />
              </svg>
            </a>
            <a
              href="https://t.me/+h5yMAzkhmcY3NTFh"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-foreground/80"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3.5 w-3.5"
              >
                <path d="M21.6 4.4a1.2 1.2 0 0 0-1.26-.2L3.6 11.1a1.2 1.2 0 0 0 .08 2.28l4.72 1.55 1.86 5.52c.2.6.96.78 1.42.34l2.7-2.6 4.94 3.64c.5.37 1.22.08 1.32-.53l2.7-16.16a1.2 1.2 0 0 0-.74-1.34ZM8.74 13.9l9.25-5.7-7.18 6.58-.28 3.1-1.06-3.13-3.06-1 2.33-.85Z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61588217763336"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-foreground/80"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3.5 w-3.5"
              >
                <path d="M13.5 9H15V6h-2.25C10.8 6 10 7.05 10 8.4V10H8v3h2v5h3v-5h2.1l.6-3H13V8.55c0-.36.18-.55.5-.55z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/vostok.method/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-foreground/80"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="3.5" />
                <circle cx="17" cy="7" r="1" />
              </svg>
            </a>
            <button
              type="button"
              onClick={handleBuyClick}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-foreground"
            >
              {entrySource === "4chan" ? "NEETBUX HERE" : "Buy"}
            </button>
          </div>
        </m.div>
      )}
      {/* Background image */}
      <div className="absolute inset-0">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),transparent_45%)]" />
        <m.div
          key={`pane-${transitionKey}`}
          initial={motionEnabled ? { x: "0%" } : false}
          animate={motionEnabled ? { x: "-102vw" } : false}
          transition={motionEnabled ? { duration: swipeDuration, ease: "easeInOut" } : undefined}
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[1.5vw] md:block z-20"
        >
          <div className="h-full w-full bg-black/40 backdrop-blur-sm shadow-[0_0_45px_rgba(120,120,120,0.25)]" />
        </m.div>
        <div className="relative h-full w-full md:hidden">
          {mobileIntroPhase !== "done" ? (
            <div className="absolute inset-0 bg-black">
              {mobileIntroPhase === "video1" ? (
                <video
                  key={`mobile-intro-video-1-${mobileIntroKey}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  src="/hero_section_videos/1.mp4"
                  muted
                  playsInline
                  autoPlay
                  onLoadedMetadata={(event) => {
                    event.currentTarget.playbackRate = 1.2;
                    event.currentTarget.currentTime = 0;
                    event.currentTarget.play().catch(() => {});
                  }}
                  onEnded={() => {
                    trackOnce("hero_intro_video1_end");
                    setMobileIntroPhase("video2");
                  }}
                />
              ) : mobileIntroPhase === "video2" ? (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <video
                    key={`mobile-intro-video-2-${mobileIntroKey}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    src="/hero_section_videos/2.mp4"
                    muted
                    playsInline
                    autoPlay
                    onLoadedMetadata={(event) => {
                      event.currentTarget.playbackRate = 1.2;
                      event.currentTarget.currentTime = 0;
                      event.currentTarget.play().catch(() => {});
                    }}
                    onEnded={() => {
                      trackOnce("hero_intro_video2_end");
                      setMobileIntroPhase("done");
                    }}
                  />
                </m.div>
              ) : null}
            </div>
          ) : (
            <m.div
              key={`mobile-hero-${transitionKey}-${mobileImageIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {mobileImageVariants ? (
                <picture>
                  <source
                    type="image/avif"
                    srcSet={`${mobileImageVariants.avif.mobile} 640w, ${mobileImageVariants.avif.desktop} 1600w`}
                    sizes="100vw"
                  />
                  <source
                    type="image/webp"
                    srcSet={`${mobileImageVariants.webp.mobile} 640w, ${mobileImageVariants.webp.desktop} 1600w`}
                    sizes="100vw"
                  />
                  <img
                    src={mobileImageVariants.desktop}
                    srcSet={`${mobileImageVariants.mobile} 640w, ${mobileImageVariants.desktop} 1600w`}
                    sizes="100vw"
                    alt={mobileImageIndex === 0 ? "Front before" : "Front after"}
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </picture>
              ) : (
                <img
                  src={mobileImage}
                  alt={mobileImageIndex === 0 ? "Front before" : "Front after"}
                  className="h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18),transparent_60%)]" />
              <div className="absolute inset-0 bg-black/40" />
            </m.div>
          )}
        </div>
        <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-white/80 md:hidden">
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="h-7 w-7 rounded-full border border-white/20 text-white/80 hover:text-white"
          >
            -
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="h-7 w-7 rounded-full border border-white/20 text-white/80 hover:text-white"
          >
            +
          </button>
        </div>
        <m.div
          key={`mobile-swipe-${mobileSwipeKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0] }}
          transition={{ duration: swipeDuration, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 z-30 bg-black md:hidden"
        />
        <m.div
          initial={false}
          animate={{ opacity: mobileFlashIndex !== null ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-full bg-black md:hidden"
        />
        {activeFlash && (
          <m.div
            key={`mobile-flash-${mobileFlashIndex}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-black md:hidden"
          >
            {activeFlash.kind === "video" ? (
              <div className="flex h-full w-full items-center justify-center bg-black">
                <video
                  className="h-full w-full object-cover"
                  src={activeFlash.src}
                  muted
                  playsInline
                  autoPlay
                  onLoadedMetadata={(event) => {
                    event.currentTarget.playbackRate = 2;
                    event.currentTarget.currentTime = 0;
                    event.currentTarget.play().catch(() => {});
                  }}
                />
              </div>
            ) : activeFlash.kind === "image" || activeFlash.kind === "imageText" ? (
              <>
                {activeFlashVariants ? (
                  <picture>
                    <source
                      type="image/avif"
                      srcSet={`${activeFlashVariants.avif.mobile} 640w, ${activeFlashVariants.avif.desktop} 1600w`}
                      sizes="100vw"
                    />
                    <source
                      type="image/webp"
                      srcSet={`${activeFlashVariants.webp.mobile} 640w, ${activeFlashVariants.webp.desktop} 1600w`}
                      sizes="100vw"
                    />
                    <img
                      src={activeFlashVariants.desktop}
                      srcSet={`${activeFlashVariants.mobile} 640w, ${activeFlashVariants.desktop} 1600w`}
                      sizes="100vw"
                      alt={activeFlash.alt}
                      className="h-full w-full object-cover"
                      loading="eager"
                      decoding="async"
                    />
                  </picture>
                ) : (
                  <img
                    src={activeFlash.src}
                    alt={activeFlash.alt}
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18),transparent_60%)]" />
                {activeFlash.kind === "imageText" && activeFlash.text && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                    {activeFlash.emphasisText ? (
                      <div className="text-center text-white">
                        <span className="block text-2xl font-semibold tracking-[0.45em] whitespace-pre-line">
                          {activeFlash.text}
                        </span>
                        <span className="mt-3 block text-5xl font-semibold tracking-[0.45em] whitespace-pre-line">
                          {activeFlash.emphasisText}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-semibold tracking-[0.45em] text-white text-center whitespace-pre-line">
                        {activeFlash.text}
                      </span>
                    )}
                  </div>
                )}
                <m.div
                  key={`flash-white-${mobileFlashIndex}`}
                  initial={{ opacity: 0.85 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute inset-0 bg-white"
                />
              </>
            ) : activeFlash.kind === "black" ? (
              <div className="absolute inset-0 bg-black" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`font-semibold tracking-[0.45em] text-white text-center whitespace-pre-line ${
                    activeFlash.text?.includes("VOSTOK") ? "text-[2.1rem]" : "text-4xl"
                  }`}
                >
                  {activeFlash.text}
                </span>
              </div>
            )}
          </m.div>
        )}

        <m.div
          key={transitionKey}
          initial={motionEnabled ? { opacity: 0 } : false}
          animate={motionEnabled ? { opacity: 1 } : false}
          transition={motionEnabled ? { duration: 1.5 } : undefined}
          className="hidden h-full w-full md:grid md:grid-cols-2 md:grid-rows-1"
        >
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-[#d7d7d7] via-[#bfbfbf] to-[#9a9a9a] opacity-70" />
            <div className="absolute inset-6 rounded-3xl bg-gradient-to-br from-white/75 via-white/30 to-black/15" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.6),transparent_65%)]" />
            <div className="absolute inset-3 rounded-[28px] border border-white/30" />
          </div>
          {leftVariants ? (
            <picture>
                <source
                  type="image/avif"
                  srcSet={`${leftVariants.avif.mobile} 640w, ${leftVariants.avif.desktop} 1600w`}
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <source
                  type="image/webp"
                  srcSet={`${leftVariants.webp.mobile} 640w, ${leftVariants.webp.desktop} 1600w`}
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <img
                  src={leftVariants.desktop}
                  srcSet={`${leftVariants.mobile} 640w, ${leftVariants.desktop} 1600w`}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  alt="Before transformation"
                  className={`h-full w-full object-contain md:object-cover ${leftMobileScale} ${
                    currentView.left === "/images/1.jpg" ? "md:scale-[1.04]" : ""
                  }`}
                  loading="eager"
                  decoding="async"
                />
              </picture>
            ) : (
              <img
                src={currentView.left}
                alt="Before transformation"
                className={`h-full w-full object-contain md:object-cover ${leftMobileScale} ${
                  currentView.left === "/images/1.jpg" ? "md:scale-[1.04]" : ""
                }`}
                loading="eager"
                decoding="async"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18),transparent_60%)]" />
            <m.div
              key={`shade-left-${transitionKey}`}
              initial={motionEnabled ? { opacity: 0 } : false}
              animate={motionEnabled ? { opacity: 1 } : false}
              transition={
                motionEnabled ? { duration: swipeDuration, ease: "easeInOut" } : undefined
              }
              className="absolute inset-0 hidden bg-black/40 md:block"
            />
          </div>
          <div className="relative">
            {rightVariants ? (
              <picture>
                <source
                  type="image/avif"
                  srcSet={`${rightVariants.avif.mobile} 640w, ${rightVariants.avif.desktop} 1600w`}
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <source
                  type="image/webp"
                  srcSet={`${rightVariants.webp.mobile} 640w, ${rightVariants.webp.desktop} 1600w`}
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <img
                  src={rightVariants.desktop}
                  srcSet={`${rightVariants.mobile} 640w, ${rightVariants.desktop} 1600w`}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  alt="After transformation"
                  className={`h-full w-full object-contain md:object-cover ${rightImageFocus} ${rightMobileScale} ${
                    activeSuite === "adaptive" && !isAfter ? "md:scale-[1.06]" : ""
                  }`}
                  loading="eager"
                  decoding="async"
                />
              </picture>
            ) : (
              <img
                src={currentView.right}
                alt="After transformation"
                className={`h-full w-full object-contain md:object-cover ${rightImageFocus} ${rightMobileScale} ${
                  activeSuite === "adaptive" && !isAfter ? "md:scale-[1.06]" : ""
                }`}
                loading="eager"
                decoding="async"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.18),transparent_60%)]" />
            <m.div
              key={`shade-right-${transitionKey}`}
              initial={motionEnabled ? { opacity: 0 } : false}
              animate={motionEnabled ? { opacity: 1 } : false}
              transition={
                motionEnabled ? { duration: swipeDuration, ease: "easeInOut" } : undefined
              }
              className="absolute inset-0 hidden bg-black/10 md:block"
            />
          </div>
        </m.div>
        <div className="absolute inset-0 hidden bg-gradient-to-b from-background/60 via-background/30 to-background md:block" />
        <div className="absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 hidden h-24 bg-gradient-to-t from-black/60 to-transparent md:block" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 px-6 max-w-6xl mx-auto"
        style={!isDesktop ? { marginTop: heroFloatOffset } : undefined}
      >
        <m.div
          initial={motionEnabled ? { opacity: 0, y: 20 } : false}
          animate={motionEnabled ? { opacity: 1, y: 0 } : false}
          transition={motionEnabled ? { duration: 0.9 } : undefined}
          className={`relative mx-auto max-w-[92vw] rounded-3xl panel-glass px-2 py-3 text-center transition-opacity duration-200 sm:max-w-3xl sm:px-4 sm:py-6 md:px-10 md:py-12 ${
            mobileFlashIndex !== null
              ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
              : "opacity-100"
          } ${
            !isHeroMenuOpen
              ? "opacity-0 pointer-events-none invisible"
              : "visible opacity-100"
          }`}
        >
          <button
            type="button"
            onClick={() => setIsHeroMenuOpen(false)}
            aria-label="Hide menu"
            className="absolute -right-3 -top-3 z-50 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-black/80 text-foreground/80 shadow hover:text-foreground"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <p className="relative z-10 text-ice tracking-[0.35em] uppercase text-[11px] md:text-base mb-3 font-light">
            {entrySource === "4chan" ? (
              <>Who gives a shit about ANOTHER Middle Eastern War, Get HOT, Dude.</>
            ) : isTwitter ? (
              <>The method exists.</>
            ) : (
              <>
                Engineering Facial Structure
              </>
            )}
          </p>

          <m.h1
            initial={motionEnabled ? { opacity: 0, y: 30 } : false}
            animate={motionEnabled ? { opacity: 1, y: 0 } : false}
            transition={motionEnabled ? { duration: 1, delay: 0.5 } : undefined}
            className="relative z-10 text-2xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-3 md:mb-6"
          >
            {entrySource === "4chan" ? (
              <>
                You Don&apos;t have to be an Incel, Dude. This Method Works. Ask Mom for{" "}
                <strong>NEETBux.</strong>
              </>
            ) : isTwitter ? (
              <>
                I built it. Tested it. Lived it.
              </>
            ) : (
              <>
                VOSTOK METHOD
              </>
            )}
          </m.h1>

          <m.div
            initial={motionEnabled ? { scaleX: 0 } : false}
            animate={motionEnabled ? { scaleX: 1 } : false}
            transition={motionEnabled ? { duration: 1.2, delay: 0.8 } : undefined}
            className="divider-line max-w-sm mx-auto mb-3"
          />

          <m.div
            initial={motionEnabled ? false : { opacity: 0, height: 0 }}
            animate={
              motionEnabled ? { opacity: 1, height: "auto" } : hasScrolled
                ? { opacity: 1, height: "auto" }
                : { opacity: 0, height: 0 }
            }
            transition={
              motionEnabled ? { duration: 0.6, delay: 1.2 } : { duration: 0.6, delay: 1 }
            }
            className="relative z-10 overflow-hidden"
          >
            <m.div
              initial={motionEnabled ? { opacity: 0 } : false}
              animate={motionEnabled ? { opacity: 1 } : false}
              transition={motionEnabled ? { duration: 0.8, delay: 1.2 } : undefined}
              className="text-steel text-[10px] md:text-lg font-light max-w-2xl mx-auto leading-relaxed"
            >
              {entrySource === "4chan" ? (
                <p>
                  I went from a good looking guy TO THE MAIN FUCKING CHARACTER, Don&apos;t be a
                  pussy and miss out, maybe you can escape 4chan once and for all.
                </p>
              ) : isTwitter ? (
                <>
                  <p>You modify your timeline. Your tech. Your body.</p>
                  <p className="mt-3">Why not your face?</p>
                </>
              ) : (
                <div
                  className={`transition-colors duration-700 ${
                    isCopyHighlight ? "text-ice" : "text-steel"
                  }`}
                >
                  {copyVariants[copyIndex]}
                </div>
              )}
            </m.div>

            <m.div
              initial={motionEnabled ? { opacity: 0, y: 10 } : false}
              animate={motionEnabled ? { opacity: 1, y: 0 } : false}
              transition={motionEnabled ? { duration: 0.6, delay: 1.35 } : undefined}
              className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[8px] uppercase tracking-[0.3em] text-steel"
            >
              <button
                type="button"
                onClick={() => handleSuiteChange("precision")}
                className={`rounded-full border px-3 py-1.5 text-[8px] md:px-4 md:py-2 md:text-[10px] transition-colors duration-300 ${
                  activeSuite === "precision"
                    ? "border-white/20 bg-white/15 text-foreground"
                    : "border-white/10 bg-white/5 text-steel"
                }`}
              >
                Myself
              </button>
              <button
                type="button"
                onClick={() => handleSuiteChange("adaptive")}
                className={`rounded-full border px-3 py-1.5 text-[8px] md:px-4 md:py-2 md:text-[10px] transition-colors duration-300 ${
                  activeSuite === "adaptive"
                    ? "border-white/20 bg-white/15 text-foreground"
                    : "border-white/10 bg-white/5 text-steel"
                }`}
              >
                Client #1
              </button>
              <button
                type="button"
                onClick={() => handleSuiteChange("sculpted")}
                className={`rounded-full border px-3 py-1.5 text-[8px] md:px-4 md:py-2 md:text-[10px] transition-colors duration-300 ${
                  activeSuite === "sculpted"
                    ? "border-white/20 bg-white/15 text-foreground"
                    : "border-white/10 bg-white/5 text-steel"
                }`}
              >
                Client #2
              </button>
            </m.div>

            <m.div
              initial={motionEnabled ? { opacity: 0, y: 10 } : false}
              animate={motionEnabled ? { opacity: 1, y: 0 } : false}
              transition={motionEnabled ? { duration: 0.6, delay: 1.6 } : undefined}
              className="mt-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 p-0.5 text-[8px] md:p-1 md:text-[9px] tracking-[0.3em] uppercase text-steel"
            >
              <button
                type="button"
                onClick={showBefore}
                className={`rounded-full px-4 py-1.5 md:px-6 md:py-2 transition-colors duration-500 ${
                  isAfter ? "text-steel" : "bg-white/15 text-foreground"
                }`}
              >
                Front
              </button>
              <button
                type="button"
                onClick={showAfter}
                className={`rounded-full px-4 py-1.5 md:px-6 md:py-2 transition-colors duration-500 ${
                  isAfter ? "bg-white/15 text-foreground" : "text-steel"
                }`}
              >
                Side
              </button>
            </m.div>
          </m.div>
        </m.div>
      </div>

      {!hideWatchPrompt && isDesktop && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              document.getElementById("vostok-process")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-chrome/30 bg-black/50 text-chrome transition-colors duration-300 hover:border-chrome/60 hover:text-foreground"
            aria-label="Scroll to the Vostok Process"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {isRedirecting && isDesktop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-obsidian/95 p-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <button
              type="button"
              onClick={closeRedirect}
              aria-label="Close redirect"
              className="absolute right-4 top-4 text-foreground/70 transition-colors duration-300 hover:text-foreground"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            <p className="text-[10px] uppercase tracking-[0.3em] text-chrome/80">
              Taking you to the secure checkout Gumroad, a third party checkout for Ebooks.
            </p>
            <h3 className="mt-4 text-xl font-light text-foreground">Redirecting</h3>
            <p className="mt-2 text-sm text-steel">Counting down {countdown}...</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
