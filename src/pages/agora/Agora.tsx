import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import { usePageMetadata } from "@/lib/pageMetadata";
import "../landing.css";
import "../radio/radio.css";
import "./agora.css";

const Polaris = () => {
  usePageMetadata({
    title: "Polaris — August 2026 Edition",
    description: "Polaris, the modern playboy magazine. The August 2026 edition.",
    path: "/polaris",
  });
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    if (!isVideoOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsVideoOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isVideoOpen]);

  return (
    <div className="vl va">
      <SiteNav suffix="POLARIS" active="Polaris" />

      <section className="vl-section va-head">
        <p className="vl-kicker va-edition">August 2026 Edition</p>
        <div className="va-masthead">
          <h1 className="va-title">Polaris</h1>
        </div>
        <p className="va-subtitle">A field journal for culture, taste &amp; signal</p>
      </section>

      <section className="vl-section va-feature" aria-labelledby="va-feature-title">
        <button
          className="va-video-launcher"
          type="button"
          onClick={() => setIsVideoOpen(true)}
          aria-label="Play The chronically online are becoming a new underclass"
        >
          <img
            src="/agora/chronically-online-youtube.jpg"
            alt="A woman speaking in a YouTube video"
          />
          <span className="va-video-shade" aria-hidden="true" />
          <span className="va-video-play" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M8.5 6.5v11l9-5.5-9-5.5Z" />
            </svg>
          </span>
          <span className="va-video-cta">Click to watch</span>
        </button>

        <div className="va-feature-copy">
          <p className="vl-kicker">Watchlist / 01</p>
          <h2 id="va-feature-title">The chronically online are becoming a new underclass</h2>
          <p>
            A sharp look at how algorithmic life can erode attention, agency, and social fluency.
            The strongest argument lands in the first half.
          </p>
          <button className="va-watch-button" type="button" onClick={() => setIsVideoOpen(true)}>
            Watch video <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <section className="vl-section va-shop-feature" aria-labelledby="va-shop-title">
        <div className="va-shop-copy">
          <p className="vl-kicker">Independent Design / 01</p>
          <h2 id="va-shop-title">Bags by Uma</h2>
          <p>
            For a gift that does not feel mass-produced: sculptural, pattern-rich bags with real
            personality and a distinct point of view.
          </p>
          <a
            className="va-watch-button"
            href="https://bagsbyuma.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Shop Bags by Uma <span aria-hidden="true">↗</span>
          </a>
        </div>

        <a
          className="va-shop-image"
          href="https://bagsbyuma.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Bags by Uma"
        >
          <img
            src="/agora/bags-by-uma.webp"
            alt="A patterned orange, gray, and black handmade bag"
            loading="lazy"
          />
          <span>Visit the shop <span aria-hidden="true">↗</span></span>
        </a>
      </section>

      <footer className="vl-footer vr-footer">
        <Link to="/" className="vr-footer-link">
          ← Back to the Method
        </Link>
        <p className="vl-fineprint">Polaris — by VØSTOK</p>
      </footer>

      {isVideoOpen && (
        <div
          className="va-video-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="va-video-modal-title"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setIsVideoOpen(false);
          }}
        >
          <div className="va-video-modal-inner">
            <div className="va-video-modal-head">
              <p id="va-video-modal-title">Polaris · August 2026</p>
              <button type="button" onClick={() => setIsVideoOpen(false)} aria-label="Close video">
                Close <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="va-video-frame">
              <iframe
                src="https://www.youtube-nocookie.com/embed/Bm2Q9HkbLsQ?autoplay=1&rel=0"
                title="The chronically online are becoming a new underclass"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Polaris;
