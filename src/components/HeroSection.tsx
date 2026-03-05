import { m } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { getImageVariants } from "@/lib/utils";

type HeroSectionProps = {
  hideWatchPrompt?: boolean;
  onMobileFlashComplete?: () => void;
  onRequestBuy?: (continueToCheckout: () => void) => void;
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "direct";
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
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const suiteTimerRef = useRef<number | null>(null);
  const redirectIntervalRef = useRef<number | null>(null);
  const redirectTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const flashTimerRef = useRef<number | null>(null);
  const hasRunMobileFlash = useRef(false);
  const hasReportedMobileFlash = useRef(false);
  const maxOffsetRef = useRef(0);
  const swipeDuration = 0.5;
  const motionEnabled = isDesktop;
  const gumroadUrl = "https://vostok67.gumroad.com/l/vostokmethod?wanted=true";
  const showBefore = () => {
    if (isAfter) {
      setIsAfter(false);
    }
  };

  const showAfter = () => {
    if (!isAfter) {
      setIsAfter(true);
    }
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
  const leftMobileScale = "scale-[1.16] origin-bottom md:scale-100";
  const rightMobileScale = "scale-[1.18] origin-bottom md:scale-100";
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
      { kind: "image", src: "/images/1.jpg", alt: "Client 1 before", duration: 400 },
      { kind: "image", src: "/images/2.jpg", alt: "Client 1 after", duration: 400 },
      { kind: "text", text: "IT'S TIME", duration: 400 },
      { kind: "image", src: "/images/8.jpg", alt: "Client 2 before", duration: 400 },
      { kind: "image", src: "/images/7.jpg", alt: "Client 2 after", duration: 400 },
      { kind: "text", text: "CHANGE", duration: 400 },
      { kind: "image", src: "/images/12.jpg", alt: "Client 3 before", duration: 400 },
      { kind: "image", src: "/images/14.jpg", alt: "Client 3 after", duration: 400 },
      { kind: "text", text: "YOUR", duration: 400 },
      { kind: "text", text: "FACE", duration: 800 },
    ],
    []
  );
  const activeFlash = mobileFlashIndex !== null ? mobileFlashSequence[mobileFlashIndex] : null;
  const activeFlashVariants =
    activeFlash && activeFlash.kind === "image" ? getImageVariants(activeFlash.src) : null;
  const resetSuiteTimer = () => {
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
    resetSuiteTimer();
    return () => {
      if (suiteTimerRef.current) {
        window.clearInterval(suiteTimerRef.current);
      }
    };
  }, []);

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
      return;
    }

    const updateScroll = () => {
      if (rafRef.current) {
        return;
      }
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const scrollY = window.scrollY;
        if (scrollY > 4) {
          setHasScrolled(true);
        }
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
    if (isDesktop || hasRunMobileFlash.current) {
      return;
    }
    hasRunMobileFlash.current = true;
    let index = 0;
    setMobileFlashIndex(index);
    const step = () => {
      index += 1;
      if (index >= mobileFlashSequence.length) {
        setMobileFlashIndex(null);
        return;
      }
      setMobileFlashIndex(index);
      flashTimerRef.current = window.setTimeout(step, mobileFlashSequence[index].duration);
    };
    flashTimerRef.current = window.setTimeout(step, mobileFlashSequence[0].duration);
    return () => {
      if (flashTimerRef.current) {
        window.clearTimeout(flashTimerRef.current);
        flashTimerRef.current = null;
      }
    };
  }, [isDesktop, mobileFlashSequence.length]);

  useEffect(() => {
    if (isDesktop || !hasRunMobileFlash.current || hasReportedMobileFlash.current) {
      return;
    }
    if (mobileFlashIndex === null) {
      hasReportedMobileFlash.current = true;
      onMobileFlashComplete?.();
    }
  }, [isDesktop, mobileFlashIndex, onMobileFlashComplete]);

  useEffect(() => {
    if (isDesktop) {
      return;
    }
    setMobileImageIndex(0);
    const interval = window.setInterval(() => {
      setMobileImageIndex((current) => (current === 0 ? 1 : 0));
    }, 5000);
    return () => window.clearInterval(interval);
  }, [isDesktop, activeSuite, isAfter]);

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
    resetSuiteTimer();
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
    if (entrySource === "tiktok") {
      track("buy_button_tiktok", { location: "hero" });
    }
    if (onRequestBuy) {
      onRequestBuy(handleBuyNow);
      return;
    }
    handleBuyNow();
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
          className="fixed top-4 left-0 right-0 z-40 flex items-center justify-between bg-black/70 px-4 py-3 backdrop-blur md:hidden"
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
      <button
        type="button"
        onClick={handleChatOpen}
        aria-label="Open chat"
        className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-foreground shadow-[0_12px_24px_rgba(0,0,0,0.35)] transition hover:scale-105 md:hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M21 14a4 4 0 0 1-4 4H8l-5 3V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      </button>
      {/* Background image */}
      <div className="absolute inset-0">
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
          <m.div
            key={`mobile-hero-${transitionKey}-${mobileImageIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0"
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
            <div className="absolute inset-0 bg-black/40" />
          </m.div>
        </div>
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
            {activeFlash.kind === "image" ? (
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
                <m.div
                  key={`flash-white-${mobileFlashIndex}`}
                  initial={{ opacity: 0.85 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute inset-0 bg-white"
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-semibold tracking-[0.45em] text-white">
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
                    currentView.left === "/images/1.jpg" ? "md:scale-[1.1]" : ""
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
                  currentView.left === "/images/1.jpg" ? "md:scale-[1.1]" : ""
                }`}
                loading="eager"
                decoding="async"
              />
            )}
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
            Everyone is <em>dumb</em> (including YOU)
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
            ) : (
              <>
                For Ignoring <strong>The Number One</strong> Way to get{" "}
                <strong>Insanely HOT</strong>
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
            <m.p
              initial={motionEnabled ? { opacity: 0 } : false}
              animate={motionEnabled ? { opacity: 1 } : false}
              transition={motionEnabled ? { duration: 0.8, delay: 1.2 } : undefined}
              className="text-steel text-[10px] md:text-lg font-light max-w-2xl mx-auto leading-relaxed"
            >
              {entrySource === "4chan" ? (
                <>
                  I went from a good looking guy TO THE MAIN FUCKING CHARACTER, Don&apos;t be a
                  pussy and miss out, maybe you can escape 4chan once and for all.
                </>
              ) : (
                <>
                  Skin care, doesn&apos;t make you HOT. Working out, doesn&apos;t make you HOT. Only
                  working out the face, with <u>SPECIFIC</u> face exercises works!
                  <span className="block">
                    This is the <strong>ULTIMATE</strong> easy-to-do no BS guide! Get yours for
                    only $30!
                  </span>
                </>
              )}
            </m.p>

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
