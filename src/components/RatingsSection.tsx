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
  { id: "002", thumb: "/analysis/002.png", all: ["/analysis/002.png"] },
  { id: "004", thumb: "/analysis/004.png", all: ["/analysis/004.png"] },
  { id: "005", thumb: "/analysis/005.png", all: ["/analysis/005.png"] },
  { id: "006", thumb: "/analysis/006.png", all: ["/analysis/006.png"] },
  { id: "007", thumb: "/analysis/007.png", all: ["/analysis/007.png"] },
  { id: "008", thumb: "/analysis/008.png", all: ["/analysis/008.png"] },
  { id: "009", thumb: "/analysis/009.png", all: ["/analysis/009.png"] },
];

const goldLabel =
  "mb-4 text-[0.7rem] font-black uppercase tracking-[0.28em] text-[#f1d27a] opacity-90";
const goldLabelStyle = { fontFamily: "var(--font-display, 'Tektur', sans-serif)" };

const RatingsSection = () => {
  const [open, setOpen] = useState<RatingEntry | null>(null);
  const [visible, setVisible] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const openRating = (r: RatingEntry) => {
    setOpen(r);
    setImgIdx(0);
    setTimeout(() => setVisible(true), 16);
  };

  const closeRating = () => {
    setVisible(false);
    setTimeout(() => setOpen(null), 360);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRating();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Scroll active thumbnail into view
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.75)_60%,rgba(0,0,0,0.9)_100%)]" />
        </div>

        <div className="relative z-10 px-6 py-[8vh] md:px-16 md:py-[10vh]">
          <p className={goldLabel} style={goldLabelStyle}>
            Ratings
          </p>
          <div className="grid grid-cols-4 gap-3 md:grid-cols-8 md:gap-4">
            {RATINGS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => openRating(r)}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:scale-[1.04]"
              >
                <img
                  src={r.thumb}
                  alt={`Rating ${r.id}`}
                  className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-100 opacity-75"
                  loading="lazy"
                />
                {r.all.length > 1 && (
                  <div className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5">
                      <rect x="2" y="3" width="9" height="18" rx="1.5" />
                      <rect x="13" y="3" width="9" height="18" rx="1.5" />
                    </svg>
                  </div>
                )}
                <div className="absolute bottom-1.5 left-2 text-[0.48rem] font-mono tracking-widest text-white/60">
                  {r.id}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{
              backgroundColor: visible ? "rgba(0,0,0,0.93)" : "rgba(0,0,0,0)",
              transition: "background-color 300ms ease",
            }}
            onClick={closeRating}
          >
            {/* Close */}
            <button
              type="button"
              aria-label="Close"
              onClick={closeRating}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div
              style={{
                transform: visible ? "scale(1)" : "scale(0.06)",
                opacity: visible ? 1 : 0,
                transition:
                  "transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 280ms ease",
              }}
              className="flex max-h-[90vh] items-stretch gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main image */}
              <div className="flex items-center justify-center">
                <img
                  key={open.all[imgIdx]}
                  src={open.all[imgIdx]}
                  alt={`Rating ${open.id}`}
                  className="max-h-[85vh] max-w-[80vw] rounded-2xl object-contain shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
                />
              </div>

              {/* Thumbnail strip (only when multiple images) */}
              {open.all.length > 1 && (
                <div
                  ref={stripRef}
                  className="flex w-[76px] flex-shrink-0 flex-col gap-2 overflow-y-auto py-1 pr-1"
                  style={{ scrollbarWidth: "none" }}
                >
                  {open.all.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImgIdx(i);
                      }}
                      className={`flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                        i === imgIdx
                          ? "border-white/80 opacity-100"
                          : "border-white/15 opacity-50 hover:opacity-80"
                      }`}
                      style={{ aspectRatio: "1 / 1" }}
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default RatingsSection;
