import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const HeroSection = () => {
  const [isAfter, setIsAfter] = useState(false);
  const [activeSuite, setActiveSuite] = useState<"precision" | "adaptive" | "sculpted">(
    "precision"
  );
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isDesktop, setIsDesktop] = useState(false);
  const suiteTimerRef = useRef<number | null>(null);
  const redirectIntervalRef = useRef<number | null>(null);
  const redirectTimeoutRef = useRef<number | null>(null);
  const swipeDuration = 0.5;
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
  const transitionKey = `${activeSuite}-${isAfter ? "side" : "front"}`;
  const suiteOrder: Array<"precision" | "adaptive" | "sculpted"> = [
    "precision",
    "adaptive",
    "sculpted",
  ];

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

  return (
    <section className="relative min-h-[100svh] flex items-start justify-center overflow-hidden pt-10 pb-8 md:min-h-[100vh] md:pt-0 md:pb-16 md:items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <motion.div
          key={`pane-${transitionKey}`}
          initial={{ x: "0%" }}
          animate={{ x: "-102vw" }}
          transition={{ duration: swipeDuration, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[1.5vw] md:block z-20"
        >
          <div className="h-full w-full bg-black/40 backdrop-blur-sm shadow-[0_0_45px_rgba(120,120,120,0.25)]" />
        </motion.div>
        <motion.div
          key={transitionKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="grid h-full w-full grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1"
        >
          <div className="relative">
            <img
              src={currentView.left}
              alt="Before transformation"
              className={`h-full w-full object-contain md:object-cover ${
                currentView.left === "/images/1.jpg" ? "md:scale-[1.1]" : ""
              }`}
              loading="eager"
            />
            <motion.div
              key={`shade-left-mobile-${transitionKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: swipeDuration, ease: "easeInOut" }}
              className="absolute inset-0 bg-black/40 md:hidden"
            />
            <motion.div
              key={`shade-left-${transitionKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: swipeDuration, ease: "easeInOut" }}
              className="absolute inset-0 hidden bg-black/40 md:block"
            />
          </div>
          <div className="relative">
            <img
              src={currentView.right}
              alt="After transformation"
              className={`h-full w-full object-contain md:object-cover ${rightImageFocus} ${
                activeSuite === "adaptive" && !isAfter ? "scale-[1.06]" : ""
              }`}
              loading="eager"
            />
            <motion.div
              key={`shade-right-mobile-${transitionKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: swipeDuration, ease: "easeInOut" }}
              className="absolute inset-0 bg-black/10 md:hidden"
            />
            <motion.div
              key={`shade-right-${transitionKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: swipeDuration, ease: "easeInOut" }}
              className="absolute inset-0 hidden bg-black/10 md:block"
            />
          </div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        <div className="absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative mx-auto max-w-3xl rounded-3xl border border-white/10 bg-black/20 px-4 py-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-5 sm:py-7 md:bg-black/30 md:px-10 md:py-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 mb-4 flex flex-wrap items-center justify-center gap-3 text-[10px] uppercase tracking-[0.35em] text-chrome md:mb-5"
          >
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
              Vostok Method Version 4
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="relative z-10 text-chrome tracking-[0.4em] uppercase text-xs md:text-sm mb-5 font-light"
          >
            This is the Guide for a Timeless Face
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative z-10 text-2xl md:text-4xl lg:text-5xl font-light tracking-tight text-foreground mb-5 md:mb-6"
          >
            Your Face can be Engineered, Not Inherited
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="divider-line max-w-sm mx-auto mb-6"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="relative z-10 text-steel text-sm md:text-lg font-light max-w-xl mx-auto leading-relaxed"
          >
            An engineering approach to aesthetics. Precision-crafted methods for timeless beauty.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.35 }}
            className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3 text-[10px] uppercase tracking-[0.25em] text-steel"
          >
            <button
              type="button"
              onClick={() => handleSuiteChange("precision")}
              className={`rounded-full border px-4 py-2 transition-colors duration-300 ${
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
              className={`rounded-full border px-4 py-2 transition-colors duration-300 ${
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
              className={`rounded-full border px-4 py-2 transition-colors duration-300 ${
                activeSuite === "sculpted"
                  ? "border-white/20 bg-white/15 text-foreground"
                  : "border-white/10 bg-white/5 text-steel"
              }`}
            >
              Client #2
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="relative z-10 mt-10 inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1 text-xs tracking-[0.3em] uppercase text-steel"
          >
            <button
              type="button"
              onClick={showBefore}
              className={`rounded-full px-6 py-2 transition-colors duration-500 ${
                isAfter ? "text-steel" : "bg-white/15 text-foreground"
              }`}
            >
              Front
            </button>
            <button
              type="button"
              onClick={showAfter}
              className={`rounded-full px-6 py-2 transition-colors duration-500 ${
                isAfter ? "bg-white/15 text-foreground" : "text-steel"
              }`}
            >
              Side
            </button>
          </motion.div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={() => {
          if (isDesktop) {
            setCountdown(3);
            setIsRedirecting(true);
          } else {
            window.open(gumroadUrl, "_blank", "noopener,noreferrer");
          }
        }}
        className="group fixed bottom-[20%] right-4 z-30 flex h-24 w-8 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black/60 text-chrome shadow-card transition-colors duration-300 hover:border-white/40 hover:text-foreground md:bottom-auto md:right-5 md:top-1/2 md:h-44 md:w-12 md:-translate-y-1/2"
        aria-label="Buy now"
      >
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10 opacity-70" />
        <span className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <span className="buy-scroll flex flex-col items-center text-[11px] font-light uppercase tracking-[0.45em] md:text-sm">
            <span className="flex flex-col items-center leading-none">
              <span>B</span>
              <span>U</span>
              <span>Y</span>
            </span>
          </span>
        </span>
      </button>

      <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-chrome/70">
          Watch the Explanation
        </p>
        <button
          type="button"
          onClick={() => {
            document.getElementById("hero-video")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-chrome/30 bg-black/50 text-chrome transition-colors duration-300 hover:border-chrome/60 hover:text-foreground"
          aria-label="Scroll to video section"
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
