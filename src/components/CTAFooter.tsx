import { m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { track } from "@vercel/analytics";
import SectionSideTab from "@/components/SectionSideTab";

type CTAFooterProps = {
  onRequestBuy?: (continueToCheckout: () => void) => void;
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "reddit" | "twitter" | "direct";
};

const STEP_FORWARD_PHRASES = [
  "ШАГ ВПЕРЕД",
  "向前迈进",
  "앞으로 나아가기",
  "ΣΙΓΟΥΡΑ ΠΡΟΣ ΤΑ ΕΜΠΡΟΣ",
  "確信の一歩",
  "ДА, Я ГОТОВ",
  "开始蜕变",
  "결정적인 순간",
  "ТОЧНО ВПЕРЕД",
  "不留退路",
  "지금 바로",
  "ΕΜΠΡΟΣ ΟΛΟΤΑΧΩΣ",
  "ВРЕМЯ ДЕЙСТВОВАТЬ",
  "勢在必行",
  "운명의 선택",
  "ВЕРНЫЙ ХОД",
  "毫不猶豫",
  "확신의 선택",
  "ΑΠΟΦΑΣΙΣΤΙΚΟ ΒΗΜΑ",
  "ЭТО МОЁ",
  "立刻拥有",
  "결국, 나의 것",
  "НЕ ЖДАТЬ",
  "改变现在",
  "전진만이 답이다",
  "БЕЗ СОМНЕНИЙ",
  "果断抉择",
  "승리를 향해",
  "Я ЗАСЛУЖИЛ",
  "이것이 정답이다",
] as const;

const CTAFooter = ({ onRequestBuy, entrySource = "direct" }: CTAFooterProps) => {
  const isFourChan = entrySource === "4chan";
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isDesktop, setIsDesktop] = useState(false);
  const [buttonLabel, setButtonLabel] = useState<string>(STEP_FORWARD_PHRASES[0]);
  const [isTypingLabel, setIsTypingLabel] = useState(false);
  const gumroadUrl = "https://vostokmethod.gumroad.com/l/vostokmethod?wanted=true";
  const twitterProfileUrl = "https://x.com/AmoxCentur14900";
  const redirectIntervalRef = useRef<number | null>(null);
  const redirectTimeoutRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const phraseIndexRef = useRef(0);

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
    if (isFourChan) {
      return;
    }

    let isCancelled = false;
    const timers = new Set<number>();

    const scheduleTimer = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
    };

    const runPhraseCycle = () => {
      const nextIndex = (phraseIndexRef.current + 1) % STEP_FORWARD_PHRASES.length;
      const nextPhrase = STEP_FORWARD_PHRASES[nextIndex];
      const characters = Array.from(nextPhrase);
      const blankDuration = 260;
      const typingWindow = 3400;
      const stepDuration = Math.max(70, Math.floor(typingWindow / Math.max(characters.length, 1)));

      scheduleTimer(() => {
        if (isCancelled) {
          return;
        }

        setIsTypingLabel(true);
        setButtonLabel("");

        characters.forEach((_, index) => {
          scheduleTimer(() => {
            if (isCancelled) {
              return;
            }
            setButtonLabel(characters.slice(0, index + 1).join(""));
          }, blankDuration + stepDuration * (index + 1));
        });

        scheduleTimer(() => {
          if (isCancelled) {
            return;
          }
          phraseIndexRef.current = nextIndex;
          setButtonLabel(nextPhrase);
          setIsTypingLabel(false);
        }, blankDuration + stepDuration * characters.length + 40);
      }, 0);
    };

    const interval = window.setInterval(runPhraseCycle, 10000);
    scheduleTimer(runPhraseCycle, 10000);

    return () => {
      isCancelled = true;
      window.clearInterval(interval);
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      setIsTypingLabel(false);
    };
  }, [isFourChan]);

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
              <span className="relative z-[1] inline-flex min-h-[1.2em] items-center justify-center font-['Tektur'] text-[0.82rem] font-bold tracking-[0.24em] text-white/90 transition-colors duration-300 ease-in group-hover:text-white [text-rendering:geometricPrecision] md:min-h-[1.35em] md:text-[1.12rem]">
                {isFourChan ? "Proceed" : buttonLabel}
                {!isFourChan && isTypingLabel ? (
                  <span
                    aria-hidden="true"
                    className="cta-typing-cursor ml-[0.14em] inline-block h-[1em] w-[0.58em] bg-black align-middle"
                  />
                ) : null}
              </span>
            </m.button>
          </div>

          <a
            href={twitterProfileUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Visit @AmoxCentur14900 on X"
            className="absolute bottom-[9vh] right-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/30 text-black transition-transform duration-300 hover:scale-105 hover:bg-white/45 md:bottom-[8vh] md:right-8"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
            >
              <path d="M18.244 2H21.5l-7.109 8.125L22.75 22h-6.547l-5.127-6.701L5.21 22H1.95l7.605-8.693L1.55 2H8.26l4.635 6.168L18.244 2Zm-1.141 18.05h1.803L7.28 3.846H5.345L17.103 20.05Z" />
            </svg>
          </a>
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
