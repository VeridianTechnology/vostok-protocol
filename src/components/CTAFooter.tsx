import { AnimatePresence, m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { trackSafe } from "@/lib/analytics";

type CTAFooterProps = {
  onRequestBuy?: (continueToCheckout: () => void) => void;
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "reddit" | "twitter" | "direct";
};

const CTAFooter = ({ onRequestBuy, entrySource = "direct" }: CTAFooterProps) => {
  const isFourChan = entrySource === "4chan";
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const gumroadUrl = "https://vostok67.gumroad.com/l/vostokmethod?wanted=true";
  const redirectIntervalRef = useRef<number | null>(null);
  const redirectTimeoutRef = useRef<number | null>(null);
  const infoTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

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

  useEffect(() => {
    return () => {
      if (infoTimeoutRef.current) {
        window.clearTimeout(infoTimeoutRef.current);
      }
    };
  }, []);

  const handleInfoClick = () => {
    setIsInfoOpen(true);
    trackSafe("gumroad_info_open");
    if (infoTimeoutRef.current) {
      window.clearTimeout(infoTimeoutRef.current);
    }
    infoTimeoutRef.current = window.setTimeout(() => {
      setIsInfoOpen(false);
    }, 15000);
  };

  const handleInfoClose = () => {
    if (infoTimeoutRef.current) {
      window.clearTimeout(infoTimeoutRef.current);
      infoTimeoutRef.current = null;
    }
    setIsInfoOpen(false);
  };

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

  const handleParallaxMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current) {
      return;
    }
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      setParallaxOffset({ x: x * 36, y: y * 26 });
    });
  };

  const handleParallaxLeave = () => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setParallaxOffset({ x: 0, y: 0 });
  };

  const handleCheckoutClick = (location: "footer" | "footer_secondary") => {
    const goToCheckout = () => {
      if (isDesktop) {
        setCountdown(3);
        setIsRedirecting(true);
      } else {
        window.open(gumroadUrl, "_blank", "noopener,noreferrer");
      }
    };
    track("buy_button", { location });
    if (entrySource === "facebook") {
      track("buy_button_facebook", { location });
    }
    if (entrySource === "4chan") {
      track("buy_button_4chan", { location });
    }
    if (entrySource === "instagram") {
      track("buy_button_instagram", { location });
    }
    if (entrySource === "twitter") {
      track("buy_button_twitter", { location });
    }
    if (entrySource === "tiktok") {
      track("buy_button_tiktok", { location });
    }
    if (onRequestBuy) {
      onRequestBuy(goToCheckout);
      return;
    }
    goToCheckout();
  };

  return (
    <section
      id="purchase"
      className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-white py-10 px-6 md:py-32 overflow-hidden"
      onPointerMove={handleParallaxMove}
      onPointerLeave={handleParallaxLeave}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden bg-white" />

      <div className="relative z-10 max-w-3xl mx-auto text-center rounded-3xl border-2 border-black bg-white/95 text-black/80 px-6 py-10 shadow-[0_30px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl md:px-10 md:py-14">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
            <div className="hidden w-full max-w-sm flex-col items-center gap-4 md:flex md:max-w-[40%]">
              <div className="relative">
                <img
                  src="/gumroad.png"
                  alt="Gumroad secure checkout"
                  className="w-auto border border-foreground/20 rounded-sm md:h-72 lg:h-80"
                  loading="lazy"
                  decoding="async"
                />
                <button
                  type="button"
                  onClick={handleInfoClick}
                  aria-label="Checkout details"
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-black/20 bg-white/90 text-xs font-semibold text-black/70 shadow-md"
                >
                  ?
                </button>
                <AnimatePresence>
                  {isInfoOpen && (
                    <m.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-3 top-12 z-10 w-64 rounded-md border border-black/10 bg-white/95 p-3 text-[10px] uppercase tracking-[0.25em] text-black/60 shadow-lg"
                    >
                      <button
                        type="button"
                        onClick={handleInfoClose}
                        aria-label="Close"
                        className="absolute left-2 top-2 text-[11px] font-semibold text-black/50 hover:text-black/80"
                      >
                        x
                      </button>
                      <p className="text-[11px] font-semibold tracking-[0.3em] text-black/70">
                        Secure Checkout
                      </p>
                      <p className="mt-2">
                        The Vostok manual is delivered instantly through Gumroad, a trusted
                        platform used by thousands of independent creators.
                      </p>
                      <p className="mt-2">
                        After purchase you will immediately receive the PDF download and all
                        future updates.
                      </p>
                      <p className="mt-2">
                        Your payment is processed securely and your email is never shared.
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
              
            </div>
            <div className="flex w-full max-w-[420px] flex-col items-center md:max-w-none md:flex-1 md:items-center">
              <p className="text-black/60 tracking-[0.45em] uppercase text-[11px] md:text-xs mb-6 md:mb-6 font-light">
                Begin Your Transformation
              </p>

              <h2 className="text-[36px] md:text-5xl font-semibold text-black tracking-tight mb-4 md:mb-4 font-serif text-center">
                Vostok Method
              </h2>

              <p className="text-black/50 text-[18px] md:text-base font-light mb-6 max-w-md mx-auto leading-relaxed">
                Engineering Facial Structure
              </p>
              <ul className="mb-8 space-y-3 text-xs md:text-sm text-black/60 font-light leading-[1.6]">
                <li>• Step-by-step facial exercises</li>
                <li>• Jaw strengthening protocols</li>
                <li>• Posture correction</li>
                <li>• Nasal breathing mechanics</li>
                <li>• Anatomy diagrams</li>
              </ul>

              <div className="relative md:hidden mt-6 mb-8">
                <img
                  src="/gumroad.png"
                  alt="Gumroad secure checkout"
                  className="w-auto border border-foreground/20 rounded-sm h-44"
                  loading="lazy"
                  decoding="async"
                />
                <button
                  type="button"
                  onClick={handleInfoClick}
                  aria-label="Checkout details"
                  className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-black/20 bg-white/90 text-[10px] font-semibold text-black/70 shadow-md"
                >
                  ?
                </button>
                <AnimatePresence>
                  {isInfoOpen && (
                    <m.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-3 top-11 z-10 w-56 rounded-md border border-black/10 bg-white/95 p-3 text-[9px] uppercase tracking-[0.25em] text-black/60 shadow-lg"
                    >
                      <button
                        type="button"
                        onClick={handleInfoClose}
                        aria-label="Close"
                        className="absolute left-2 top-2 text-[10px] font-semibold text-black/50 hover:text-black/80"
                      >
                        x
                      </button>
                      <p className="text-[10px] font-semibold tracking-[0.3em] text-black/70">
                        Secure Checkout
                      </p>
                      <p className="mt-2">
                        The Vostok manual is delivered instantly through Gumroad, a trusted
                        platform used by thousands of independent creators.
                      </p>
                      <p className="mt-2">
                        After purchase you will immediately receive the PDF download and all
                        future updates.
                      </p>
                      <p className="mt-2">
                        Your payment is processed securely and your email is never shared.
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="divider-line max-w-xs mx-auto mb-8 md:mb-8" />

              {!isFourChan && (
                <p className="text-black/50 text-xs tracking-wider mb-8 md:mb-8">
                  Lifetime Access to ALL Future Updates of Vostok Method - Sent to YOU Via Email
                </p>
              )}
              {isFourChan && (
                <div className="mb-6 space-y-3 text-black/70 text-sm">
                  <p>
                    Dude, this is not another pill or scam, this shit actually works. Do you
                    understand how hot I am? I have a hot as shit gf and I&apos;m a total autist,
                    turbo autist. Looks are EVERYTHING and this is the definitive ONLY book on the
                    internet to make it happen.
                  </p>
                  <p>BUY MY SHIT DUDE, you will THANK ME, this is like a new religion.</p>
                </div>
              )}

              {/* CTA Button */}
              <div className="mt-8 flex flex-col items-center gap-3 md:mt-2">
                <m.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => handleCheckoutClick("footer")}
                  className="mt-8 mb-4 w-[90%] max-w-[360px] inline-flex items-center justify-center gap-3 bg-black/90 text-white font-medium tracking-[0.25em] uppercase text-sm px-6 py-5 rounded-sm border border-black/20 shadow-luxury hover:bg-black transition-all duration-500 md:mt-0 md:mb-0 md:w-auto md:px-12"
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
                  {isFourChan ? "NEETBUX HERE" : "Download the Vostok Manual — $29.99"}
                </m.button>
                <p className="text-[10px] uppercase tracking-[0.2em] text-black/70">
                  Download the Vostok Structural Training Manual
                </p>
                <p className="text-[9px] uppercase tracking-[0.25em] text-black/60 mt-2">
                  Secure checkout via Gumroad
                </p>
              </div>
            </div>
          </div>

        </m.div>
      </div>

      {/* Footer bar */}
      <div className="relative z-10 mt-10 pt-4 md:mt-3 md:pt-0 bg-transparent">
        <div className="divider-line mb-6 md:mb-2" />
        <div className="relative w-full text-[10px] tracking-wider text-black/60 uppercase">
          <div className="flex w-full items-center justify-between gap-3 md:justify-center md:gap-2">
            <img
              src="/logo.png"
              alt="The Timeless Face logo"
              className="h-6 w-auto max-w-none md:absolute md:left-[5vw] md:top-2 md:h-20"
              loading="lazy"
              decoding="async"
            />
            <div className="flex items-center gap-2 md:absolute md:right-[5vw] md:top-3">
              <a
                href="https://discord.gg/DvMc34ygjx"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/30 text-black/70 transition hover:text-black"
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
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/30 text-black/70 transition hover:text-black"
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
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/30 text-black/70 transition hover:text-black"
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
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/30 text-black/70 transition hover:text-black"
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
            </div>
            <div className="flex flex-col items-end text-right md:items-center md:text-center">
              <span className="hidden md:inline">© 2026</span>
              <span>Engineering Facial Structure</span>
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
