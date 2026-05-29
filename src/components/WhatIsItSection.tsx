import { AnimatePresence, m } from "framer-motion";
import type { ReactNode } from "react";
import { useState } from "react";

type ScreenLine = {
  text?: ReactNode;
  tone?: "body" | "emphasis" | "italic" | "question" | "answer";
};

type IdentityScreen = {
  lines?: ScreenLine[];
  spacer?: boolean;
  holdClassName?: string;
  embedUrl?: string;
  gallery?: string[];
};

const vostokScreens: IdentityScreen[] = [
  {
    lines: [
      { text: "WHAT IS VØSTOK LABS?", tone: "question" },
      {
        text: "It's an esoteric company. Bed Bath & Beyond + Apple.\n\nOur first product is a guide, and a series of tips on how to improve your looks.\n\nAnd I mean, radically... improve your looks.\n\nWe can only have so many people. Elite people.\n\nOne million exactly. I want to help you ascend.\n\nAnd with a lot of work — you will. You can become an entertainer, a leader, a companion.\n\nAnything you want, can be made and done because you look better than everyone.\n\nLet me give you the gift. The gift of Vostok.\n\nAscend with me.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
];

const PhotoGallery = ({ images }: { images: string[] }) => {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(images.length - 1, i + 1));
  const src = images[idx];

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <img
        key={src}
        src={src}
        alt={`Photo ${idx + 1}`}
        className="h-[340px] w-full object-cover object-top md:h-[460px]"
        draggable={false}
      />
      {idx > 0 && (
        <button
          type="button"
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white transition hover:bg-black/80"
          aria-label="Previous"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M13 4l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
      {idx < images.length - 1 && (
        <button
          type="button"
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white transition hover:bg-black/80"
          aria-label="Next"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
      <span className="absolute bottom-2 right-3 text-[10px] uppercase tracking-[0.25em] text-white/50">{idx + 1} / {images.length}</span>
    </div>
  );
};

const SlideLines = ({
  screen,
  index,
  withVideo,
}: {
  screen: IdentityScreen;
  index: number;
  withVideo: boolean;
}) => (
  <AnimatePresence mode="wait">
    <m.div
      key={index}
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0.18, y: -10 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={`flex w-full flex-col justify-center ${screen?.holdClassName ?? "min-h-[8rem] md:min-h-[10rem]"} ${withVideo ? "items-start" : "items-center"}`}
    >
      {screen?.lines?.map((line, lineIndex) => (
        <p
          key={`${index}-${lineIndex}`}
          className={`opacity-90 ${
            line.tone === "emphasis"
              ? "max-w-full px-2 text-[2.15rem] font-semibold leading-[1.22] tracking-[0.03em] text-white md:text-[3.9rem]"
              : line.tone === "question"
                ? `max-w-full pb-1 text-[2.15rem] font-semibold leading-[1.08] text-white md:text-[3.8rem] md:leading-[1.02] ${withVideo ? "px-0" : "px-2"}`
                : line.tone === "answer"
                  ? `mt-6 whitespace-pre-wrap text-[1rem] font-normal leading-[1.68] text-[#e8ecf2] md:mt-8 md:text-[1.1rem] md:leading-[1.65] ${withVideo ? "max-w-none px-0 text-left" : "max-w-[46rem] px-3 text-left md:max-w-[56rem]"}`
                  : line.tone === "italic"
                    ? "max-w-full px-2 text-[1.52rem] italic leading-[1.32] text-[#d0d4dc] md:text-[3rem]"
                    : "max-w-full px-2 text-[1.52rem] italic leading-[1.32] text-[#d0d4dc] md:text-[3rem]"
          }`}
          style={{
            fontFamily:
              line.tone === "answer"
                ? "var(--font-body)"
                : line.tone === "question"
                  ? "Georgia, 'Times New Roman', serif"
                  : "var(--font-display)",
          }}
        >
          {line.text}
        </p>
      ))}
    </m.div>
  </AnimatePresence>
);

const WhatIsItSection = () => {
  const [sequenceScreenIndex, setSequenceScreenIndex] = useState(0);
  const currentSequenceScreen = vostokScreens[sequenceScreenIndex] ?? vostokScreens[0];
  const hasVideo = !!currentSequenceScreen.embedUrl;
  const hasGallery = !!currentSequenceScreen.gallery?.length;

  return (
    <section className="section-surface relative left-1/2 right-1/2 h-[92vh] w-screen -translate-x-1/2 overflow-hidden border-t-[3px] border-black md:h-[110vh]">
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
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.35)_38%,rgba(0,0,0,0.62)_100%)]" />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-4 py-[5vh] md:px-8 md:py-[8vh]">
        <div className="relative flex h-full max-h-[82vh] w-full max-w-[68rem] flex-col overflow-hidden rounded-[28px] bg-[rgba(8,10,14,0.62)] backdrop-blur-sm md:max-h-[94vh]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,10,0)_0%,rgba(8,9,12,0)_14%,rgba(7,8,10,0)_100%)]"
          />

          <div className="relative z-10 flex h-full flex-col">
            <div className="relative z-10 flex-1 overflow-hidden px-7 pb-10 pt-10 text-[#b8bec6] md:px-12 md:py-12">
              <div className="mx-auto grid h-full max-w-[56rem] grid-rows-[1fr_auto]">
                <div className="flex min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {hasVideo ? (
                    <div className="flex w-full flex-col items-center gap-6 py-2 md:flex-row md:items-center md:gap-10">
                      <div className="w-[220px] shrink-0 md:w-[360px]">
                        <iframe
                          src={currentSequenceScreen.embedUrl}
                          title="Vostok short"
                          className="aspect-[9/16] w-full rounded-xl border-0"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <SlideLines screen={currentSequenceScreen} index={sequenceScreenIndex} withVideo />
                      </div>
                    </div>
                  ) : hasGallery ? (
                    <div className="flex w-full flex-col py-2">
                      <PhotoGallery images={currentSequenceScreen.gallery!} />
                      <div className="mt-8 border-t border-white/10 pt-6">
                        <SlideLines screen={currentSequenceScreen} index={sequenceScreenIndex} withVideo />
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full flex-col text-center">
                      <div className="mb-7 flex justify-center md:mb-9">
                        <img
                          src="/NYX_square.jpg"
                          alt="Nyx"
                          className="h-40 w-40 rounded-full object-cover shadow-[0_12px_48px_rgba(0,0,0,0.55)] md:h-56 md:w-56"
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <SlideLines screen={currentSequenceScreen} index={sequenceScreenIndex} withVideo={false} />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsItSection;
