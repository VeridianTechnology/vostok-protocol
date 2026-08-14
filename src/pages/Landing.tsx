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

const decay = [
  {
    title: "Do not talk about Vostok",
    text: "You're maturing. You lost weight. You're dieting healthier. Do not mention face exercises. Do not mention Vostok.",
  },
  {
    title: "You will praise Nyx",
    text: "They hated Jesus too. You will give praise to Nyx. He showed you the way. He let you ascend. Through him you will stop Jestermaxxing forever.",
  },
  {
    title: "You will Listen",
    text: "To non-descript music. A little rap. A little country. A little classic, but general beats. Your consciousness is now formed. Head over to NYX's playlist to find what's hot.",
  },
  {
    title: "You will Practice",
    text: "Two hours a week, minimum. If you truly want to ascend, five hours a week. If you want to get hot, next month, 10 hours a week. No excuses.",
  },
  {
    title: "You will not chase Hos",
    text: "You can double text. You can send money. You can simp. But you will always put yourself first. You will facemaxx, at all times. Gym unnecessary.",
  },
  {
    title: "You will talk to the Hos",
    text: "Once you reach a blue belt, you will go up to hos, ask for their number. That's four weeks, or one month if you work hard. Keep working till you hit black belt.",
  },
];

const proof = {
  title: "Face > Everything",
  figure: {
    src: "/landing/proof/structure-follows-tension-800.webp",
    srcSet:
      "/landing/proof/structure-follows-tension-800.webp 800w, /landing/proof/structure-follows-tension-1350.webp 1350w",
    alt: "Side-by-side portraits showing changes in facial structure and tension",
  },
  body: [
    "Face is all that matters. Not your style. Not your wallet. Not how tall you are. As long as you're above 5'3\" and have $700 in your bank account and shave and shower.",
    "Also as long as you're not Indian. You'll ascend. The shorter and poorer you are, the better your face better be. Game matters too. Personality. But face above all.",
  ],
  tagline: "Asymmetry is the enemy",
};

type JourneyImage = string | { mobile: string; desktop: string };

const journeyStages: {
  title: string;
  hours: string;
  color?: string;
  img: JourneyImage;
  zoom: string;
}[] = [
  {
    title: "Jestergoon",
    hours: "Hour zero",
    img: { mobile: "/landing/journey/before-mobile.webp", desktop: "/landing/journey/before-desktop.webp" },
    zoom:
      "Hour zero. Untrained muscles, a forward neck, asymmetry left to run for years. This is the raw material every face in the program starts from.",
  },
  {
    title: "Initate",
    hours: "20 hours",
    color: "#d4b04a",
    img: "/landing/journey/belt-yellow.jpg",
    zoom:
      "Yellow belt — the first twenty hours. Pure construction: 90% exercises, 10% massage. The muscles of the face wake up and begin pulling the structure taut.",
  },
  {
    title: "Depressive",
    hours: "40 hours",
    color: "#3d5a99",
    img: "/landing/journey/belt-blue.jpg",
    zoom:
      "Blue belt — forty hours in, roughly one full point gained on the scale. Exercises still lead, massage grows to 30%, and the first refinement work begins.",
  },
  {
    title: "Vostok Human",
    hours: "70 hours",
    color: "#4a7a5a",
    img: "/landing/journey/belt-green.jpg",
    zoom:
      "Green belt — seventy hours. Precision work: the split moves to 50/40/10 as massage and targeted refinement take over from raw building.",
  },
  {
    title: "Ascended",
    hours: "100+ hours",
    color: "#1b1b1f",
    img: "/landing/journey/belt-black.jpg",
    zoom:
      "Black belt — one hundred hours and beyond. Mastery: 20% exercises, 40% massage, 40% refinement. The structure now holds itself.",
  },
  {
    title: "NYX",
    hours: "The other side",
    img: "/landing/journey/two-months-after-03.jpg",
    zoom:
      "The other side of one hundred hours. Trained, symmetrical, restructured — and permanent. This is what the protocol builds.",
  },
];

const JOURNEY_NYX_INDEX = journeyStages.findIndex((stage) => stage.title === "NYX");

const journeyZoomSrc = (img: JourneyImage) => (typeof img === "string" ? img : img.desktop);

const journeyImg = (img: JourneyImage, alt: string) =>
  typeof img === "string" ? (
    <img src={img} alt={alt} loading="lazy" />
  ) : (
    <picture>
      <source media="(min-width: 768px)" srcSet={img.desktop} />
      <img src={img.mobile} alt={alt} loading="lazy" />
    </picture>
  );

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
  // Lead with the final NYX stage.
  const [journeyIndex, setJourneyIndex] = useState(JOURNEY_NYX_INDEX);
  const [infoZoom, setInfoZoom] = useState<{ src: string; title: string; text: string } | null>(null);
  const [barShown, setBarShown] = useState(false);
  const [barDismissed, setBarDismissed] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const [methodMediaRef, methodMediaNear] = useNearViewport<HTMLElement>();
  const [originMediaRef, originMediaNear] = useNearViewport<HTMLElement>();
  const [nyxMediaRef, nyxMediaNear] = useNearViewport<HTMLElement>();
  const [obeliskMediaRef, obeliskMediaNear] = useNearViewport<HTMLDivElement>();
  const [purchaseMediaRef, purchaseMediaNear] = useNearViewport<HTMLElement>();

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
    if (!infoZoom) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setInfoZoom(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [infoZoom]);

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

  const journeyThumb = (i: number) => {
    const stage = journeyStages[i];
    return (
      <button
        key={`${stage.title}-${i}`}
        className={`vl-journey-thumb${i === journeyIndex ? " vl-journey-thumb--active" : ""}`}
        data-journey-index={i}
        onClick={() => setJourneyIndex(i)}
        aria-label={`${stage.title} — ${stage.hours}`}
      >
        <span className="vl-journey-thumb-img">{journeyImg(stage.img, `${stage.title} — ${stage.hours}`)}</span>
        <span className="vl-journey-thumb-label">
          {stage.color && <span className="vl-belt-dot" style={{ background: stage.color }} />}
          {stage.title}
        </span>
      </button>
    );
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
          <span className="vl-bar-link vl-nav-locked" aria-disabled="true">
            Agora
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5.5" y="10.5" width="13" height="10" rx="2" />
              <path d="M8.5 10.5V7.8a3.5 3.5 0 017 0v2.7" />
            </svg>
          </span>
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
          <span className="vl-topnav-tab vl-nav-locked" aria-disabled="true">
            Agora
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5.5" y="10.5" width="13" height="10" rx="2" />
              <path d="M8.5 10.5V7.8a3.5 3.5 0 017 0v2.7" />
            </svg>
          </span>
        </nav>
        <h1 className="vl-hero-title">
          <span className="vl-hero-brand">
            <img
              className="vl-hero-logo"
              src="/logo/logo-runner.webp"
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              decoding="async"
            />
            <span className="vl-hero-wordmark">VØSTOK</span>
          </span>
          <span className="vl-hero-subtitle">NEVER JESTERMAXX</span>
        </h1>

        <div className="vl-hero-stack">
          <div className="vl-hero-manifesto">
            <p className="vl-hero-message">Hypergamy is defeated here</p>
            <p className="vl-hero-message-subtitle">Here is where we ascend</p>
          </div>
        </div>
      </section>

      {/* The Method */}
      <section className="vl-section" id="method" ref={methodMediaRef}>
        <div className="vl-reveal">
          <h2 className="vl-h2">
            Jesetermaxxing is a <em>Sin</em>
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
            <img
              src={methodMediaNear ? proof.figure.src : undefined}
              srcSet={methodMediaNear ? proof.figure.srcSet : undefined}
              sizes="(max-width: 900px) calc(100vw - 48px), 700px"
              alt={proof.figure.alt}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </section>

      {/* The Diagnosis */}
      <section className="vl-section" id="diagnosis">
        <div className="vl-reveal">
          <p className="vl-kicker">The first rule of Vostok...</p>
          <h2 className="vl-h2">
            Don't talk about <em>Vostok.</em>
          </h2>
        </div>
        <div className="vl-decay-grid">
          {decay.map((item, index) => (
            <div key={item.title} className="vl-decay vl-reveal">
              <h3>{index + 1}. {item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Method card */}
      <section className="vl-section vl-company-section" id="company">
        <div className="vl-signal vl-signal--standalone vl-company-card vl-reveal">
          <div className="vl-signal-body">
            <h3>Jestermaxxing is a sin</h3>
            <p>
              You can goon.<br />
              You can simp.<br />
              You can be a foid-worshipper.
            </p>
            <p>But you will not jestermax.</p>
            <p>
              You will not entertain. You will not condone. You will simply work on your face and
              ascend.
            </p>
          </div>
        </div>
      </section>

      {/* Dark interlude — the origin myth */}
      <section className="vl-dark" id="origin" ref={originMediaRef}>
        <div
          className="vl-dark-bg"
          style={{ backgroundImage: originMediaNear ? "url(/obsidian/origin-stairway.webp)" : "none" }}
          aria-hidden="true"
        />
        <div className="vl-dark-inner">
          <h2 className="vl-dark-quote vl-reveal">Not for Pussies</h2>
          <p className="vl-dark-text vl-reveal">
            Don't care if you're broke. Stupid. Black or brown (which you are).
          </p>
          <p className="vl-dark-text vl-dark-text--continued vl-reveal">
            Vostok is to help you ascend. Sub-3 need not apply. Everyone else, buy the guide, do the work.
          </p>
          <p className="vl-dark-text vl-dark-text--continued vl-reveal">
            Do not annoy me. Do not patronize me. Do not doubt. Just do it. And ascend.
          </p>
          <p className="vl-dark-text vl-dark-text--continued vl-reveal">
            Then fuck off.
          </p>
        </div>
      </section>

      {/* Dark interlude — Nyx's challenge */}
      <section className="vl-dark" id="nyx" ref={nyxMediaRef}>
        <div
          className="vl-dark-bg"
          style={{ backgroundImage: nyxMediaNear ? "url(/obsidian/nyx-challenge.webp)" : "none" }}
          aria-hidden="true"
        />
        <div className="vl-dark-inner vl-nyx-grid">
          <div className="vl-nyx-intro">
            <img
              className="vl-nyx-statue vl-reveal"
              src="/statue/vostok-warrior.webp"
              alt="Black marble Vostok warrior bust illuminated with blue seams"
              loading="lazy"
            />
          </div>
          <div className="vl-nyx-video-showcase vl-reveal">
            <video
              src="/videos/side_profile_2.mp4"
              aria-label="Mogging — side profile after 140 hours"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      </section>

      <div className="vl-obelisk-sections" ref={obeliskMediaRef}>
      <img
        className="vl-obelisk-art"
        src={obeliskMediaNear ? "/obsidian/obelisk-cutout-lossless.webp" : undefined}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      {/* The Journey */}
      <section className="vl-section" id="journey">
        <div className="vl-reveal">
          <p className="vl-kicker">100 HOURS+</p>
          <h2 className="vl-h2">Watch the Change</h2>
        </div>
        <div className="vl-journey-slide vl-reveal">
          <button
            className="vl-journey-main"
            onClick={() =>
              setInfoZoom({
                src: journeyZoomSrc(journeyStages[journeyIndex].img),
                title: `${journeyStages[journeyIndex].title} — ${journeyStages[journeyIndex].hours}`,
                text: journeyStages[journeyIndex].zoom,
              })
            }
            aria-label={`Enlarge: ${journeyStages[journeyIndex].title}, ${journeyStages[journeyIndex].hours}`}
          >
            {journeyImg(
              journeyStages[journeyIndex].img,
              `${journeyStages[journeyIndex].title} — ${journeyStages[journeyIndex].hours}`
            )}
          </button>
          <div className="vl-journey-caption">
            <h3>
              {journeyStages[journeyIndex].color && (
                <span className="vl-belt-dot" style={{ background: journeyStages[journeyIndex].color }} />
              )}
              {journeyStages[journeyIndex].title}
            </h3>
            <span className="vl-belt-hours">{journeyStages[journeyIndex].hours}</span>
          </div>
          <div className="vl-journey-strip">
            <button
              className="vl-journey-arrow"
              aria-label="Previous stage"
              onClick={() => setJourneyIndex((journeyIndex + journeyStages.length - 1) % journeyStages.length)}
            >
              ‹
            </button>
            <div className="vl-journey-thumbs">
              <div className="vl-journey-thumb-track">
                <div className="vl-journey-primary">
                  {[0, null, JOURNEY_NYX_INDEX].map((slot) =>
                    slot === null ? (
                      <div key="belts" className="vl-journey-belt-group">
                        {[1, 2, 3, 4].map((i) => journeyThumb(i))}
                      </div>
                    ) : (
                      journeyThumb(slot)
                    )
                  )}
                </div>
              </div>
            </div>
            <button
              className="vl-journey-arrow"
              aria-label="Next stage"
              onClick={() => setJourneyIndex((journeyIndex + 1) % journeyStages.length)}
            >
              ›
            </button>
          </div>
        </div>
      </section>

      </div>

      {/* The Offer — what $4.99 actually buys */}
      <section className="vl-section vl-offer" id="offer">
        <div className="vl-offer-card vl-reveal">
          <div className="vl-offer-buy">
            <a
              className="vl-buy"
              href={BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => fireBuyTracking("offer")}
            >
              $4.99
            </a>
          </div>
        </div>
      </section>

      {/* Closing statement — dark */}
      <section className="vl-dark vl-dark--center" id="purchase" ref={purchaseMediaRef}>
        <div className="vl-dark-bg vl-dark-bg--video" aria-hidden="true">
          {purchaseMediaNear && (
            <video
              src="/landing/video/evolution-portal-loop.mp4"
              poster="/obsidian/evolution-portal.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          )}
        </div>
        <div className="vl-dark-inner">
          <h2 className="vl-dark-quote vl-reveal">
            Walking towards <em>ascension</em>
          </h2>
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
        <p className="vl-fineprint">The Vostok Method</p>
      </footer>

      {/* Journey stage lightbox: photo + title + explanation */}
      {infoZoom && (
        <div className="vl-lightbox" onClick={() => setInfoZoom(null)}>
          <button className="vl-lightbox-close" onClick={() => setInfoZoom(null)} aria-label="Close">
            ×
          </button>
          <div className="vl-info-card" onClick={(e) => e.stopPropagation()}>
            <img src={infoZoom.src} alt={infoZoom.title} />
            <div>
              <h3>{infoZoom.title}</h3>
              <p>{infoZoom.text}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Landing;
