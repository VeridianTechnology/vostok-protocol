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
const COACHING_URL = "https://nyxvostok.gumroad.com/l/wdjpwh?wanted=true";

const MOBILE_BAR_INACTIVITY_DELAY = 5000;

const proof = {
  title: "I Changed Mine.",
  body: [
    "It’s really not that complicated—the face is a series of 42 muscles that combine to create expressions. They are much thinner and of a different type than the muscles of the body, so they require more precision and more repetitions. As long as you take a scientific approach, you should see results. It takes time, but the rewards are great.",
  ],
  tagline: "The Face is like the Body, it needs Gym Time",
};

const transformationPortraits = [
  {
    src: "/landing/method-before-upright.webp",
    alt: "Nyx before beginning the Vostok Method",
    label: "Before",
  },
  {
    src: "/landing/method-after.webp",
    alt: "Nyx after practicing the Vostok Method",
    label: "After",
  },
] as const;

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
      "The Vostok Method is a structured guide to facial exercise, massage, posture, and better resting patterns. Get 11 illustrated chapters for a one-time $44.99.",
    path: "/",
  });
  const [entrySource, setEntrySource] = useState("direct");
  const [transformationIndex, setTransformationIndex] = useState(0);
  const [zoomedTransformationIndex, setZoomedTransformationIndex] = useState<number | null>(null);
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

  useEffect(() => {
    if (zoomedTransformationIndex !== null) return undefined;

    const rotation = window.setInterval(() => {
      setTransformationIndex((current) => (current + 1) % transformationPortraits.length);
    }, 5000);

    return () => window.clearInterval(rotation);
  }, [zoomedTransformationIndex]);

  useEffect(() => {
    if (zoomedTransformationIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeZoom = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomedTransformationIndex(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeZoom);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeZoom);
    };
  }, [zoomedTransformationIndex]);

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

  const fireBuyTracking = (location: string, offer: "method" | "coaching" = "method") => {
    const isCoaching = offer === "coaching";
    markBuyClicked();
    try {
      const ttq = (window as unknown as Record<string, unknown>).ttq as
        | { track?: (event: string, props: unknown) => void }
        | undefined;
      ttq?.track?.("InitiateCheckout", {
        contents: [{
          content_id: isCoaching ? "five-coaching-sessions" : "vostokmethod",
          content_type: "product",
          content_name: isCoaching ? "Five Coaching Sessions" : "Vostok Method",
        }],
        value: isCoaching ? 1000 : 44.99,
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
    trackSafe("buy_click", { location, source: entrySource, offer });
    trackSafe(`buy_click_${entrySource}`, { location, offer });
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
          <a
            className="vl-bar-buy"
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => fireBuyTracking("sticky_bar")}
          >
            $44.99
          </a>
        </div>
      </div>

      {/* Hero: title + slideshow centerpiece */}
      <section className="vl-hero" id="top" ref={heroRef}>
        <div className="vl-hero-bg" aria-hidden="true" />
        <nav className="vl-topnav">
          <span className="vl-topnav-tab vl-topnav-tab--active">Vostok Method</span>
          <Link className="vl-topnav-tab" to="/radio">
            Radio
          </Link>
          <a
            className="vl-bar-buy vl-topnav-buy"
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => fireBuyTracking("hero_nav")}
          >
            $44.99
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
            <button
              className="vl-method-image-button"
              type="button"
              aria-label={`Enlarge ${transformationPortraits[transformationIndex].label.toLowerCase()} portrait`}
              onClick={() => setZoomedTransformationIndex(transformationIndex)}
            >
              {transformationPortraits.map((portrait, index) => (
                <img
                  key={portrait.src}
                  className={`vl-method-portrait vl-method-portrait--${portrait.label.toLowerCase()}${
                    transformationIndex === index ? " vl-method-portrait--active" : ""
                  }`}
                  src={methodMediaNear ? portrait.src : undefined}
                  alt={transformationIndex === index ? portrait.alt : ""}
                  aria-hidden={transformationIndex !== index}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </button>
            <figcaption key={transformationPortraits[transformationIndex].label}>
              {transformationPortraits[transformationIndex].label}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Nyx's challenge video */}
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

      {/* Method card */}
      <section className="vl-section vl-company-section" id="company">
        <div className="vl-signal vl-signal--standalone vl-company-card vl-reveal">
          <div className="vl-signal-body">
            <h3>The Best Looksmaxxing Method of All Time</h3>
            <p>
              A 230-page illustrated guide used by dozens of people to achieve amazing results. I
              pioneered facial exercises, working muscle by muscle across the face, with diagrams,
              full explanations, before-and-after examples, and massages designed to reshape the face.
            </p>
            <p>
              I’ve worked with people of all ages and genders and seen consistent improvement,
              systematically helping people become more beautiful. Results can come quickly—with
              life-changing changes most people wouldn’t believe.
            </p>
          </div>
          <div className="vl-company-actions" aria-label="Purchase options">
            <a
              className="vl-company-buy"
              href={BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => fireBuyTracking("company")}
            >
              <span>Vostok Method</span>
              <strong>$44.99</strong>
            </a>
            <span className="vl-company-or">or</span>
            <a
              className="vl-company-buy"
              href={COACHING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => fireBuyTracking("company_coaching", "coaching")}
            >
              <span>Five Coaching Sessions</span>
              <strong>$1,000</strong>
            </a>
          </div>
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

      <footer className="vl-footer">
        <div className="vl-socials">
          <a href="https://www.instagram.com/nyx_vostok/" target="_blank" rel="noopener noreferrer" aria-label="Nyx Vostok on Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle className="vl-instagram-dot" cx="17.5" cy="6.5" r="1" />
            </svg>
          </a>
        </div>
        <p className="vl-fineprint">The VØSTOK Method</p>
      </footer>

      {zoomedTransformationIndex !== null && (
        <div
          className="vl-lightbox vl-portrait-lightbox vl-transformation-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${transformationPortraits[zoomedTransformationIndex].label} portrait`}
          onClick={() => setZoomedTransformationIndex(null)}
        >
          <button
            className="vl-lightbox-close"
            type="button"
            onClick={() => setZoomedTransformationIndex(null)}
            aria-label="Close enlarged portrait"
          >
            ×
          </button>
          <div
            className="vl-portrait-lightbox-card"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={transformationPortraits[zoomedTransformationIndex].src}
              alt={transformationPortraits[zoomedTransformationIndex].alt}
            />
            <div className="vl-portrait-lightbox-caption">
              <span>{transformationPortraits[zoomedTransformationIndex].label}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Landing;
