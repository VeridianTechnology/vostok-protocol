import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type RatingEntry = {
  id: string;
  thumb: string;
  all: string[];
};

const RATINGS: RatingEntry[] = [
  {
    id: "001",
    thumb: "/analysis/001/001.png",
    all: [
      "/analysis/001/001.png",
      "/analysis/001/new-york-ny-vanilla-ice-circa-1990-in-new-york-city.webp",
    ],
  },
  {
    id: "002",
    thumb: "/analysis/002/002.png",
    all: [
      "/analysis/002/002.png",
      "/analysis/002/2nd.png",
    ],
  },
  {
    id: "003",
    thumb: "/analysis/003/003.png",
    all: [
      "/analysis/003/003.png",
      "/analysis/003/couple.png",
    ],
  },
  {
    id: "004",
    thumb: "/analysis/004/004.png",
    all: [
      "/analysis/004/004.png",
      "/analysis/004/image.png",
    ],
  },
  {
    id: "005",
    thumb: "/analysis/005/005.png",
    all: [
      "/analysis/005/005.png",
      "/analysis/005/first.png",
      "/analysis/005/second.png",
    ],
  },
  {
    id: "006",
    thumb: "/analysis/006/006.png",
    all: [
      "/analysis/006/006.png",
      "/analysis/006/HLNot70WkAA69ZT.jpeg",
    ],
  },
];

const ARTICLES = [
  {
    src: "/section_wallpaper/articles/1.jpeg",
    alt: "The Perfect Female Face",
    href: "https://nyxvostok.substack.com/p/the-perfect-female-face",
  },
  {
    src: "/section_wallpaper/articles/2.jpeg",
    alt: "Looksmaxxing will usher in the end times",
    href: "https://nyxvostok.substack.com/p/looksmaxxing-will-usher-in-the-end",
  },
];

const goldLabel = "mb-4 text-[0.7rem] font-black uppercase tracking-[0.28em] text-[#f1d27a] opacity-90";
const goldLabelStyle = { fontFamily: "var(--font-display, 'Tektur', sans-serif)" };

const RatingThumb = ({
  r,
  idx,
  onOpen,
}: {
  r: RatingEntry;
  idx: number;
  onOpen: (r: RatingEntry, idx: number) => void;
}) => (
  <button
    type="button"
    onClick={() => onOpen(r, idx)}
    className="group relative overflow-hidden rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:scale-[1.04]"
    aria-label={`Rating ${r.id}`}
  >
    <img
      src={r.thumb}
      alt={`Rating ${r.id}`}
      className="h-auto w-full object-cover"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="absolute bottom-1.5 left-2 text-[0.48rem] font-mono tracking-widest text-white/70">
      {r.id}
    </div>
  </button>
);

const WhatIsItSection = () => {
  const [openRating, setOpenRating] = useState<RatingEntry | null>(null);
  const [ratingIdx, setRatingIdx] = useState(0);
  const [ratingVisible, setRatingVisible] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const openR = (r: RatingEntry, idx: number) => {
    setOpenRating(r);
    setRatingIdx(idx);
    setImgIdx(0);
    setTimeout(() => setRatingVisible(true), 16);
  };

  const closeR = () => {
    setRatingVisible(false);
    setTimeout(() => setOpenRating(null), 360);
  };

  const goToRating = (idx: number) => {
    const next = RATINGS[idx];
    if (!next) return;
    setOpenRating(next);
    setRatingIdx(idx);
    setImgIdx(0);
  };

  useEffect(() => {
    if (!openRating) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeR();
      if (e.key === "ArrowLeft" && ratingIdx > 0) goToRating(ratingIdx - 1);
      if (e.key === "ArrowRight" && ratingIdx < RATINGS.length - 1) goToRating(ratingIdx + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openRating, ratingIdx]);

  useEffect(() => {
    if (!stripRef.current) return;
    const el = stripRef.current.children[imgIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [imgIdx]);

  return (
    <>
      <section className="section-surface relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-t-[3px] border-black">
        <div className="absolute inset-0 -z-10">
          <img
            src="/section_wallpaper/whatisit/3.webp"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 hidden h-full w-full object-cover brightness-[1.68] md:block"
          />
          <img
            src="/section_wallpaper/whatisit/4.webp"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover brightness-[1.2] md:hidden"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.72)_60%,rgba(0,0,0,0.88)_100%)]" />
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 py-[8vh] md:px-16 md:py-[10vh]">

          {/* Main row: Video + Articles (+ Ratings on desktop) */}
          <div className="flex w-full max-w-5xl items-start justify-center gap-8 md:gap-12">

            {/* NYX's Story video */}
            <div className="flex w-[300px] shrink-0 flex-col items-start md:w-[420px]">
              <p className={goldLabel} style={goldLabelStyle}>NYX's Story</p>
              <video
                src="/videos/main_site.mp4"
                className="w-full rounded-xl"
                controls
                playsInline
                preload="metadata"
              />
            </div>

            {/* Right column: Articles always visible; Ratings column desktop-only */}
            <div className="flex items-start gap-6">

              {/* Articles */}
              <div className="flex shrink-0 flex-col items-start gap-3 pt-1">
                <p className={goldLabel} style={goldLabelStyle}>Articles</p>
                {ARTICLES.map((article) => (
                  <a
                    key={article.href}
                    href={article.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative w-[80px] overflow-hidden rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:scale-[1.04] md:w-[100px]"
                    aria-label={article.alt}
                  >
                    <img src={article.src} alt={article.alt} className="h-auto w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </a>
                ))}
              </div>

              {/* Ratings — desktop only, scrollable column */}
              <div className="hidden shrink-0 flex-col items-start pt-1 md:flex">
                <p className={goldLabel} style={goldLabelStyle}>Ratings</p>
                <div
                  className="flex w-[100px] flex-col gap-3 overflow-y-auto pr-0.5"
                  style={{
                    maxHeight: "calc(420px * 16 / 9 - 1.5rem)",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255,255,255,0.18) transparent",
                  }}
                >
                  {RATINGS.map((r, idx) => (
                    <RatingThumb key={r.id} r={r} idx={idx} onOpen={openR} />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Ratings — mobile only, 3-per-row grid below video+articles */}
          <div className="mt-8 w-full max-w-5xl md:hidden">
            <p className={goldLabel} style={goldLabelStyle}>Ratings</p>
            <div className="grid grid-cols-3 gap-3">
              {RATINGS.map((r, idx) => (
                <RatingThumb key={r.id} r={r} idx={idx} onOpen={openR} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Rating lightbox */}
      {openRating &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{
              backgroundColor: ratingVisible ? "rgba(0,0,0,0.93)" : "rgba(0,0,0,0)",
              transition: "background-color 300ms ease",
            }}
            onClick={closeR}
          >
            {/* Close */}
            <button
              type="button"
              aria-label="Close"
              onClick={closeR}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Prev rating */}
            {ratingIdx > 0 && (
              <button
                type="button"
                aria-label="Previous rating"
                onClick={(e) => { e.stopPropagation(); goToRating(ratingIdx - 1); }}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            {/* Next rating */}
            {ratingIdx < RATINGS.length - 1 && (
              <button
                type="button"
                aria-label="Next rating"
                onClick={(e) => { e.stopPropagation(); goToRating(ratingIdx + 1); }}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}

            {/* Content */}
            <div
              style={{
                transform: ratingVisible ? "scale(1)" : "scale(0.06)",
                opacity: ratingVisible ? 1 : 0,
                transition: "transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 280ms ease",
              }}
              className="flex max-h-[90vh] items-stretch gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                key={openRating.all[imgIdx]}
                src={openRating.all[imgIdx]}
                alt={`Rating ${openRating.id}`}
                className="max-h-[85vh] max-w-[75vw] rounded-2xl object-contain shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
              />

              {openRating.all.length > 1 && (
                <div
                  ref={stripRef}
                  className="flex w-[76px] shrink-0 flex-col gap-2 overflow-y-auto py-1 pr-1"
                  style={{ scrollbarWidth: "none" }}
                >
                  {openRating.all.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                      className={`aspect-square shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                        i === imgIdx
                          ? "border-white/80 opacity-100"
                          : "border-white/15 opacity-50 hover:opacity-80"
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.62rem] font-mono tracking-widest text-white/40">
              {String(ratingIdx + 1).padStart(3, "0")} / {String(RATINGS.length).padStart(3, "0")}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default WhatIsItSection;
