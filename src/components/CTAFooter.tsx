import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";

const CTAFooter = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isDesktop, setIsDesktop] = useState(false);
  const gumroadUrl = "https://vostok67.gumroad.com/l/vostokmethod?wanted=true";
  const redirectIntervalRef = useRef<number | null>(null);
  const redirectTimeoutRef = useRef<number | null>(null);

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
  }, [isRedirecting, gumroadUrl]);

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

  return (
    <section id="purchase" className="py-10 px-6 relative md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-background to-background" />
      <div className="absolute inset-0 hud-grid opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center panel-glass rounded-3xl px-6 py-10 md:px-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-ice tracking-[0.45em] uppercase text-xs mb-3 md:mb-6 font-light">
            Begin Your Transformation
          </p>

          <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-3 md:mb-4">
            The <span className="font-semibold">Timeless Face</span>
          </h2>

          <p className="text-steel text-sm md:text-base font-light mb-3 max-w-md mx-auto leading-relaxed">
            An Engineering Approach to Aesthetics
          </p>

          <div className="divider-line max-w-xs mx-auto mb-6 md:mb-8" />

          <p className="text-chrome text-xs tracking-wider mb-7 md:mb-10">
            Instant digital delivery · 290 pages · Lifetime access
          </p>

          {/* Price */}
          <div className="mb-6 md:mb-8 flex flex-col items-center gap-2">
            <span className="text-steel text-sm line-through">$49.99</span>
            <span className="text-4xl font-light text-foreground">$29.99</span>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => {
              track("buy_button", { location: "footer" });
              if (isDesktop) {
                setCountdown(3);
                setIsRedirecting(true);
              } else {
                window.open(gumroadUrl, "_blank", "noopener,noreferrer");
              }
            }}
            className="inline-flex items-center justify-center gap-3 gradient-glossy text-foreground font-medium tracking-[0.25em] uppercase text-sm px-16 py-5 rounded-sm border border-chrome/20 shadow-luxury hover:shadow-ice transition-all duration-500"
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
              <path d="M7 10V7a5 5 0 0 1 10 0v3" />
              <rect x="4" y="10" width="16" height="10" rx="2" />
            </svg>
            Buy Now
          </motion.button>

          <p className="text-steel/50 text-[10px] tracking-wider mt-4 md:mt-6 uppercase">
            30-day precision guarantee
          </p>
        </motion.div>
      </div>

      {/* Footer bar */}
      <div className="relative z-10 mt-10 pt-4 md:mt-3 md:pt-0 md:h-[8vh]">
        <div className="divider-line mb-6 md:mb-2" />
        <div className="relative w-full text-[10px] tracking-wider text-steel/40 uppercase">
          <div className="flex w-full items-center justify-between gap-3 md:justify-center md:gap-2">
            <img
              src="/logo.png"
              alt="The Timeless Face logo"
              className="h-6 w-auto max-w-none md:absolute md:left-[5vw] md:top-2 md:h-20"
              loading="lazy"
              decoding="async"
            />
            <div className="flex flex-col items-end text-right md:items-center md:text-center">
              <span>© 2026 The Timeless Face</span>
              <span>Engineered for Excellence</span>
            </div>
          </div>
        </div>
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

export default CTAFooter;
