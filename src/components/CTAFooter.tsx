import { m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import SectionSideTab from "@/components/SectionSideTab";

type CTAFooterProps = {
  onRequestBuy?: (continueToCheckout: () => void) => void;
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "reddit" | "twitter" | "direct";
};

const CTAFooter = ({ onRequestBuy, entrySource = "direct" }: CTAFooterProps) => {
  const isFourChan = entrySource === "4chan";
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isDesktop, setIsDesktop] = useState(false);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const gumroadUrl = "https://vostok67.gumroad.com/l/vostokmethod?wanted=true";
  const redirectIntervalRef = useRef<number | null>(null);
  const redirectTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

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

  const handleParallaxMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current) {
      return;
    }
      rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      setPointerOffset({
        x: clamp(x * 270, -270, 270),
        y: 0,
      });
    });
  };

  const handleParallaxLeave = () => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setPointerOffset({ x: 0, y: 0 });
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
      ref={sectionRef}
      id="purchase"
      className="section-surface relative left-1/2 right-1/2 h-[118svh] min-h-[118svh] w-screen -translate-x-1/2 overflow-hidden pb-[10vh]"
      onPointerMove={handleParallaxMove}
      onPointerLeave={handleParallaxLeave}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden bg-[#d9d9d6]">
        <div className="absolute inset-[-12%] bg-[#d9d9d6]" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="pod-wallpaper-bg absolute bottom-0 left-1/2 z-[1] h-[176%] w-[164%] max-w-none -translate-x-1/2 transition-transform duration-500 ease-out will-change-transform md:h-[186%] md:w-[172%]"
          style={{
            transform: `translate3d(calc(-50% + ${pointerOffset.x}px), ${pointerOffset.y}px, 0) scale(1)`,
          }}
        />
        <div className="absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(241,249,245,0.16)_0%,rgba(241,249,245,0.34)_36%,rgba(241,249,245,0.52)_100%)]" />
      </div>
      <div className="absolute inset-x-0 bottom-[-20vh] z-[3] h-[29vh] overflow-hidden md:h-[31vh]">
        <div aria-hidden="true" className="pod-wallpaper-bg absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.32)_0%,rgba(0,0,0,0.18)_32%,rgba(0,0,0,0.36)_100%)]" />
      </div>

      <div className="absolute inset-x-0 top-0 bottom-[9vh] z-10 text-black/80 md:bottom-[11vh]">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-full"
        >
          <div className="absolute left-[6vw] top-[16%] text-left md:left-[5vw] md:top-[18%]">
            {isFourChan && (
              <div className="mt-4 max-w-md space-y-3 text-sm text-black/85">
                <p>
                  Dude, this is not another pill or scam, this shit actually works. Do you
                  understand how hot I am? I have a hot as shit gf and I&apos;m a total autist,
                  turbo autist.
                </p>
                <p>BUY MY SHIT DUDE, you will THANK ME, this is like a new religion.</p>
              </div>
            )}
          </div>

          <div className="absolute inset-0 flex items-center justify-center px-6">
            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleCheckoutClick("footer")}
              className="group relative inline-flex min-h-[70px] min-w-[156px] items-center justify-center overflow-hidden rounded-[26px] border border-black/20 px-5 py-4 text-base font-medium uppercase tracking-[0.28em] text-white shadow-[0_20px_44px_rgba(0,0,0,0.38)] transition-all duration-500 md:min-h-[92px] md:min-w-[420px] md:rounded-[34px] md:px-8 md:text-[1.1rem]"
            >
              <span className="absolute inset-0">
                <span aria-hidden="true" className="pod-wallpaper-bg absolute inset-0" />
                <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.42)_100%)] transition-opacity duration-500 group-hover:opacity-80" />
                <span className="absolute inset-[1px] rounded-[25px] border border-white/18 md:rounded-[33px]" />
              </span>
              <span className="font-tangerine relative z-[1] text-[0.95rem] normal-case tracking-[0.03em] drop-shadow-[0_8px_8px_rgba(0,0,0,1)] md:text-[1.7rem]">
                {isFourChan ? "Neetbux here" : "JØIN THE CLUB"}
              </span>
            </m.button>
          </div>
        </m.div>
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
