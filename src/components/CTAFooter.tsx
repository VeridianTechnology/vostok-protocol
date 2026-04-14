import { m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const gumroadUrl = "https://vostokmethod.gumroad.com/l/vostokmethod?wanted=true";
  const redirectIntervalRef = useRef<number | null>(null);
  const redirectTimeoutRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

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
      className="section-surface relative left-1/2 right-1/2 h-[78svh] min-h-[78svh] w-screen -translate-x-1/2 overflow-hidden pb-[3vh] md:h-[140vh] md:min-h-[140vh] md:pb-[5vh]"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden bg-[#d9d9d6]">
        <div className="absolute inset-0 bg-[#d9d9d6]" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 bottom-[2vh] overflow-hidden md:bottom-[10%]">
          <img
            src="/section_wallpaper/buy/11.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
            style={{
              transform: "none",
            }}
          />
          <img
            src="/section_wallpaper/buy/10.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 hidden h-full w-full object-cover object-[center_18%] md:block"
            style={{
              transform: "none",
            }}
          />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[-6vh] z-[3] h-[8vh] overflow-hidden md:bottom-[-4vh] md:h-[9vh]">
        <div aria-hidden="true" className="pod-wallpaper-bg absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.32)_0%,rgba(0,0,0,0.18)_32%,rgba(0,0,0,0.36)_100%)]" />
      </div>

      <div className="absolute inset-x-0 top-0 bottom-[2vh] z-10 text-black/80 md:bottom-[10%]">
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
              whileHover={{}}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleCheckoutClick("footer")}
              className="group relative inline-flex min-h-[70px] min-w-[156px] items-center justify-center overflow-hidden rounded-[10px] border border-white/14 bg-[rgba(8,9,11,0.82)] px-5 py-4 text-base font-medium uppercase tracking-[0.28em] text-white shadow-[0_6px_18px_rgba(0,0,0,0.28)] backdrop-blur-[8px] transition-[border-color,background-color] duration-300 ease-in md:min-h-[92px] md:min-w-[420px] md:rounded-[12px] md:px-8 md:text-[1.1rem]"
            >
              <span className="absolute inset-0">
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,24,0.92)_0%,rgba(7,8,10,0.88)_100%)] transition-opacity duration-300 ease-in group-hover:opacity-0" />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,11,13,0.96)_0%,rgba(4,5,7,0.96)_100%)] opacity-0 transition-opacity duration-300 ease-in group-hover:opacity-100" />
                <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,transparent_38%,rgba(255,255,255,0.012)_100%)] opacity-70 transition-opacity duration-300 ease-in group-hover:opacity-85" />
                <span className="absolute inset-[1px] rounded-[9px] border border-white/10 md:rounded-[11px]" />
                <span className="absolute inset-[3px] rounded-[7px] border border-white/18 opacity-0 transition-opacity duration-300 ease-in group-hover:opacity-100 md:rounded-[9px]" />
              </span>
              <span className="relative z-[1] font-['Tektur'] text-[0.82rem] font-bold uppercase tracking-[0.34em] text-white/90 transition-colors duration-300 ease-in group-hover:text-white [text-rendering:geometricPrecision] md:text-[1.12rem]">
                {isFourChan ? "Proceed" : "Step Forward"}
              </span>
            </m.button>
          </div>
        </m.div>
      </div>

      {isRedirecting && isDesktop && createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-6">
          <div className="relative flex h-full w-full items-center justify-center bg-obsidian/95 p-6 text-center">
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
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
        </div>,
        document.body
      )}
    </section>
  );
};

export default CTAFooter;
