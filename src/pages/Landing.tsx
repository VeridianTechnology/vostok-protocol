import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  trackSafe,
  trackBeacon,
  checkAndSetOwnerParam,
  isOwner,
  markBuyClicked,
  hasBuyClicked,
  CAT_KEY,
  BOUGHT_KEY,
} from "@/lib/analytics";
import { usePageMetadata } from "@/lib/pageMetadata";
import "./landing.css";

const BUY_URL = "https://nyxvostok.gumroad.com/l/vostokmethod?wanted=true";

const MOBILE_BAR_INACTIVITY_DELAY = 5000;
const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

const decay = [
  "Respect the process.",
  "Protect the practice.",
  "Train with intention.",
  "Choose consistency over intensity.",
  "Stop chasing external validation.",
  "Return to the world with presence.",
];

const proof = {
  title: "Your face is the first signal.",
  body: [
    "Before style, status, or words, the face shapes a first impression. Structure, symmetry, posture, and expression all influence how you are read. VØSTOK treats the face as something trainable: studied with precision, practiced with discipline, and refined over time.",
  ],
  tagline: "Symmetry is trained, not wished for.",
};

const methodPortraits = [
  { image: "00", assessment: "Nose and chin require more balance." },
  { image: "02", assessment: "More level brows; stronger overall balance." },
  {
    image: "01",
    assessment: "Stronger structure and a longer nose; the eyes remain slightly misaligned.",
  },
  { image: "03", assessment: "Well-structured, though the expression reads less approachable." },
].map((portrait, index) => ({
  src: `/nyx/${portrait.image}.png`,
  alt: `Nyx facial progress portrait ${index + 1}`,
  assessment: portrait.assessment,
}));

// Begin fetching heavier section media shortly before it can enter view. The
// generous margin keeps fast scrolling seamless without paying for the entire
// page on the initial connection.
const useNearViewport = <T extends Element,>(rootMargin = "1400px 0px") => {
  const ref = useRef<T | null>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || nearViewport) return undefined;
    if (!("IntersectionObserver" in window)) {
      setNearViewport(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [nearViewport, rootMargin]);

  return [ref, nearViewport] as const;
};

const Landing = () => {
  usePageMetadata({
    title: "VØSTOK",
    description:
      "The Vostok Method is a structured guide to facial exercise, massage, posture, and better resting patterns. Get 11 illustrated chapters for a one-time $4.99.",
    path: "/",
  });
  const [entrySource, setEntrySource] = useState("direct");
  const [portraitZoom, setPortraitZoom] = useState<(typeof methodPortraits)[number] | null>(null);
  const [barShown, setBarShown] = useState(false);
  const [barDismissed, setBarDismissed] = useState(false);
  const [nyxVideoPaused, setNyxVideoPaused] = useState(true);
  const [nyxVideoReady, setNyxVideoReady] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const nyxVideoRef = useRef<HTMLVideoElement | null>(null);
  const [methodMediaRef, methodMediaNear] = useNearViewport<HTMLElement>();
  const [originMediaRef, originMediaNear] = useNearViewport<HTMLElement>();
  const [nyxMediaRef, nyxMediaNear] = useNearViewport<HTMLElement>();

  useEffect(() => {
    const video = nyxVideoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => setNyxVideoPaused(true));
  }, []);

  const toggleNyxVideo = () => {
    const video = nyxVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => setNyxVideoPaused(true));
    } else {
      video.pause();
    }
  };

  useEffect(() => {
    checkAndSetOwnerParam();
    const source = new URLSearchParams(window.location.search).get("utm_source")?.toLowerCase();
    const known = ["facebook", "4chan", "instagram", "tiktok", "reddit", "twitter"];
    if (source && known.includes(source)) setEntrySource(source);
  }, []);

  // Visitor category system — fires exactly one beacon per visitor (localStorage) on exit:
  // "canceled" | "bot_activity" | "did_check" | "checked_it_well" | "buy_button_check"
  useEffect(() => {
    if (isOwner()) return;
    if (localStorage.getItem(CAT_KEY)) return;

    const arrivalTime = Date.now();
    let hasScrolled = false;
    let pageFullyLoaded = document.readyState === "complete";

    const onPageLoad = () => {
      pageFullyLoaded = true;
    };
    if (!pageFullyLoaded) {
      window.addEventListener("load", onPageLoad);
    }

    const onScroll = () => {
      hasScrolled = true;
    };

    const fireCategory = () => {
      if (localStorage.getItem(CAT_KEY)) return;
      const elapsed = Date.now() - arrivalTime;
      let cat: string;

      if (!pageFullyLoaded) {
        cat = "canceled";
      } else if (hasBuyClicked() || sessionStorage.getItem(BOUGHT_KEY)) {
        cat = "buy_button_check";
      } else if (hasScrolled && elapsed >= 30000) {
        cat = "checked_it_well";
      } else if (hasScrolled) {
        cat = "did_check";
      } else {
        cat = "bot_activity";
      }

      localStorage.setItem(CAT_KEY, cat);
      trackBeacon(cat);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") fireCategory();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", fireCategory);
    window.addEventListener("beforeunload", fireCategory);

    return () => {
      window.removeEventListener("load", onPageLoad);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", fireCategory);
      window.removeEventListener("beforeunload", fireCategory);
    };
  }, []);

  // Sticky buy bar appears once the hero is mostly gone
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setBarShown(entry.intersectionRatio < 0.25),
      { threshold: [0, 0.25, 0.5] }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // On mobile the purchase bar gets out of the reader's way after five
  // inactive seconds. Once dismissed, it stays dismissed for this page view.
  useEffect(() => {
    if (!barShown || barDismissed || !window.matchMedia("(max-width: 768px)").matches) {
      return undefined;
    }

    let inactivityTimer = 0;
    const dismissBar = () => {
      setBarDismissed(true);
      setBarShown(false);
    };
    const restartInactivityTimer = () => {
      window.clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(dismissBar, MOBILE_BAR_INACTIVITY_DELAY);
    };

    restartInactivityTimer();
    window.addEventListener("scroll", restartInactivityTimer, { passive: true });
    window.addEventListener("touchstart", restartInactivityTimer, { passive: true });
    window.addEventListener("pointerdown", restartInactivityTimer, { passive: true });
    window.addEventListener("keydown", restartInactivityTimer);

    return () => {
      window.clearTimeout(inactivityTimer);
      window.removeEventListener("scroll", restartInactivityTimer);
      window.removeEventListener("touchstart", restartInactivityTimer);
      window.removeEventListener("pointerdown", restartInactivityTimer);
      window.removeEventListener("keydown", restartInactivityTimer);
    };
  }, [barDismissed, barShown]);

  // Scroll-reveal for sections
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const nodes = document.querySelectorAll(".vl-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vl-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // Escape closes the lightboxes
  useEffect(() => {
    if (!portraitZoom) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPortraitZoom(null);
      } else if (portraitZoom && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        const currentIndex = methodPortraits.findIndex(
          (portrait) => portrait.src === portraitZoom.src
        );
        const direction = event.key === "ArrowLeft" ? -1 : 1;
        const nextIndex =
          (currentIndex + direction + methodPortraits.length) % methodPortraits.length;
        setPortraitZoom(methodPortraits[nextIndex]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [portraitZoom]);

  const fireBuyTracking = (location: string) => {
    markBuyClicked();
    try {
      const ttq = (window as unknown as Record<string, unknown>).ttq as
        | { track?: (event: string, props: unknown) => void }
        | undefined;
      ttq?.track?.("InitiateCheckout", {
        contents: [{ content_id: "vostokmethod", content_type: "product", content_name: "Vostok Method" }],
        value: 4.99,
        currency: "USD",
      });
    } catch {
      // ignore
    }
    try {
      fetch("/api/tiktok-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAgent: navigator.userAgent, url: window.location.href }),
      }).catch(() => {});
    } catch {
      // ignore
    }
    trackSafe("buy_click", { location, source: entrySource });
    trackSafe(`buy_click_${entrySource}`, { location });
  };

  return (
    <div className="vl">
      {/* Sticky buy bar */}
      <div className={`vl-bar${barShown && !barDismissed ? " vl-bar--shown" : ""}`}>
        <a
          className="vl-bar-mark"
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          VØSTOK
        </a>
        <div className="vl-bar-right">
          <Link className="vl-bar-link" to="/radio">
            Radio
          </Link>
          <Link className="vl-bar-link" to="/polaris">
            Polaris
          </Link>
          <a
            className="vl-bar-buy"
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => fireBuyTracking("sticky_bar")}
          >
            $4.99
          </a>
        </div>
      </div>

      {/* Hero: title + slideshow centerpiece */}
      <section className="vl-hero" id="top" ref={heroRef}>
        <div className="vl-hero-bg" aria-hidden="true" />
        <nav className="vl-topnav">
          <span className="vl-topnav-tab vl-topnav-tab--active">The Method</span>
          <Link className="vl-topnav-tab" to="/radio">
            Radio
          </Link>
          <Link className="vl-topnav-tab" to="/polaris">
            Polaris
          </Link>
          <a
            className="vl-bar-buy vl-topnav-buy"
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => fireBuyTracking("hero_nav")}
          >
            $4.99
          </a>
        </nav>
        <h1 className="vl-hero-title">
          <span className="vl-hero-brand">
            <span className="vl-hero-wordmark">VØSTOK</span>
          </span>
        </h1>

        <div className="vl-hero-stack">
          <div className="vl-hero-manifesto">
            <p className="vl-hero-message">The Architecture of Facial Performance</p>
          </div>
        </div>
      </section>

      {/* The Method */}
      <section className="vl-section" id="method" ref={methodMediaRef}>
        <div className="vl-reveal">
          <h2 className="vl-h2">
            The face is meant to be <em>designed.</em>
          </h2>
        </div>
        <div className="vl-method-grid">
          <div className="vl-method-copy vl-reveal">
            <div className="vl-method-copy-inner">
              <h3>{proof.title}</h3>
              {proof.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="vl-method-tagline">{proof.tagline}</p>
            </div>
          </div>
          <figure className="vl-method-figure vl-reveal">
            {methodPortraits.map((portrait, index) => (
              <button
                key={portrait.src}
                type="button"
                className="vl-method-portrait"
                aria-label={`Enlarge facial progress portrait ${index + 1}`}
                onClick={() => setPortraitZoom(portrait)}
              >
                <img
                  src={methodMediaNear ? portrait.src : undefined}
                  alt={portrait.alt}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </figure>
        </div>
      </section>

      {/* The Diagnosis */}
      <section className="vl-section" id="diagnosis">
        <div className="vl-reveal">
          <h2 className="vl-h2">The VØSTOK Code</h2>
        </div>
        <div className="vl-decay-grid">
          {decay.map((rule, index) => (
            <div key={rule} className="vl-decay vl-reveal">
              <h3>{ROMAN_NUMERALS[index]}. {rule}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Method card */}
      <section className="vl-section vl-company-section" id="company">
        <div className="vl-signal vl-signal--standalone vl-company-card vl-reveal">
          <div className="vl-signal-body">
            <h3>The Complete Method</h3>
            <p>
              A 230-page illustrated guide to facial exercise, massage, posture, and better resting
              patterns—built to develop balance, definition, and control.
            </p>
            <p>
              No elaborate equipment. Just facial oil, a mirror, and the patience to practice. This is
              a long-term discipline; the results come from consistency.
            </p>
            </div>
            <a
              className="vl-company-buy"
              href={BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => fireBuyTracking("company")}
            >
              $4.99
            </a>
          </div>
        </section>

      {/* Dark interlude — the origin myth */}
      <section className="vl-dark" id="origin" ref={originMediaRef}>
        <div
          className="vl-dark-bg"
          style={{ backgroundImage: originMediaNear ? "url(/landing/origin-ascension.webp)" : "none" }}
          aria-hidden="true"
        />
        <div className="vl-dark-inner vl-spirituality">
          <h2 className="vl-dark-quote vl-reveal">The VØSTOK Philosophy</h2>
          <div className="vl-spirituality-articles vl-reveal">
            <a
              className="vl-spirituality-article"
              href="https://nyxvostok.substack.com/p/youre-not-ugly-your-face-is-just?r=3isgrj&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read You're not ugly, your face is just untrained on Substack"
            >
              <img
                src="/articles/youre-not-ugly.webp"
                alt="You're not ugly, your face is just untrained — Chapter 1 of The Vostok Method by Nyx"
                loading="lazy"
                decoding="async"
              />
              <span className="vl-spirituality-caption">Ch. 1 - The Fountain of Youth</span>
            </a>
            <a
              className="vl-spirituality-article"
              href="https://nyxvostok.substack.com/p/demand-side-economics-is-how-the?r=3isgrj&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read Demand Side Economics — Is how the U.S. beats China on Substack"
            >
              <img
                src="/articles/demand-side-economics.webp"
                alt="Demand Side Economics — Is how the U.S. beats China by Nyx"
                loading="lazy"
                decoding="async"
              />
              <span className="vl-spirituality-caption">
                Ch. 2 - How to make the world beautiful
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Dark interlude — Nyx's challenge */}
      <section className="vl-dark" id="nyx" ref={nyxMediaRef}>
        <div
          className="vl-dark-bg"
          style={{ backgroundImage: nyxMediaNear ? "url(/landing/nyx-pyramid.webp)" : "none" }}
          aria-hidden="true"
        />
        <div className="vl-dark-inner vl-nyx-grid">
          <div className="vl-nyx-intro">
            <img
              className="vl-nyx-statue vl-reveal"
              src="/landing/nyx-warrior.webp"
              alt="Split white marble Vostok warrior bust"
              loading="lazy"
            />
          </div>
          <div className="vl-nyx-video-showcase vl-reveal">
            <video
              ref={nyxVideoRef}
              src="/videos/side_profile_2.mp4"
              aria-label="Mogging — side profile after 140 hours"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onCanPlay={() => setNyxVideoReady(true)}
              onPlaying={() => {
                setNyxVideoReady(true);
                setNyxVideoPaused(false);
              }}
              onWaiting={() => setNyxVideoReady(false)}
              onPlay={() => setNyxVideoPaused(false)}
              onPause={() => setNyxVideoPaused(true)}
            />
            {!nyxVideoReady && <span className="vl-nyx-video-loading" aria-live="polite">loading</span>}
            {nyxVideoReady && (
              <button
                className="vl-nyx-video-toggle"
                type="button"
                onClick={toggleNyxVideo}
                aria-label={nyxVideoPaused ? "Play video" : "Pause video"}
              >
                {nyxVideoPaused ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="7" y="5" width="4" height="14" rx="1" />
                    <rect x="13" y="5" width="4" height="14" rx="1" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </section>

      <footer className="vl-footer">
        <div className="vl-socials">
          <a href="https://x.com/Nyxvostok" target="_blank" rel="noopener noreferrer" aria-label="Vøstok Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </a>
        </div>
        <p className="vl-fineprint">The VØSTOK Method</p>
      </footer>

      {portraitZoom && (
        <div
          className="vl-lightbox vl-portrait-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged facial progress portrait"
          onClick={() => setPortraitZoom(null)}
        >
          <button
            className="vl-lightbox-close"
            type="button"
            onClick={() => setPortraitZoom(null)}
            aria-label="Close enlarged portrait"
          >
            ×
          </button>
          <button
            className="vl-lightbox-arrow vl-lightbox-arrow--prev"
            type="button"
            aria-label="Previous portrait"
            onClick={(event) => {
              event.stopPropagation();
              const currentIndex = methodPortraits.findIndex(
                (portrait) => portrait.src === portraitZoom.src
              );
              setPortraitZoom(
                methodPortraits[
                  (currentIndex - 1 + methodPortraits.length) % methodPortraits.length
                ]
              );
            }}
          >
            ‹
          </button>
          <div
            className="vl-portrait-lightbox-card"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={portraitZoom.src} alt={portraitZoom.alt} />
            <div className="vl-portrait-lightbox-caption">
              <span>
                {methodPortraits.findIndex((portrait) => portrait.src === portraitZoom.src) === 0
                  ? "Most recent"
                  : `Earlier image ${methodPortraits.findIndex(
                      (portrait) => portrait.src === portraitZoom.src
                    ) + 1}`}
              </span>
              <p>{portraitZoom.assessment}</p>
            </div>
          </div>
          <button
            className="vl-lightbox-arrow vl-lightbox-arrow--next"
            type="button"
            aria-label="Next portrait"
            onClick={(event) => {
              event.stopPropagation();
              const currentIndex = methodPortraits.findIndex(
                (portrait) => portrait.src === portraitZoom.src
              );
              setPortraitZoom(
                methodPortraits[(currentIndex + 1) % methodPortraits.length]
              );
            }}
          >
            ›
          </button>
        </div>
      )}

    </div>
  );
};

export default Landing;
