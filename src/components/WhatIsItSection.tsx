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
      { text: "WHAT IS VØSTOK?", tone: "question" },
      {
        text: "Vostok gives you an advantage across these three vecta. It makes you more confident — able to show up and lighten the energy of any place, find your role in social situations, avoid unpleasant social confrontations over hierarchy, and give the room a good environment. It also increases competence. The competence vecta gives you authority, possession, and capability. It allows you to get things done — faster, with the help of people — and learn more about yourself. It's the ability to say, \"I've been in worse situations and made it out. I know how to handle this.\" Believe it or not, beauty is linked to competence. There are no studies that show this; there is no innate human knowledge — but it's fundamentally true.\n\nThe last vecta is compliance: the ability to get compliance from people. What's the difference between someone making a fool of themselves and impressing the entire scene? How they look. By having higher-acting people in society due to their looks, we can improve society itself — but that's for another story. The point of Vostok is to ascend the spirit. Everyone else will call it crazy, and that's fine — leave them behind. We are here to ascend spiritually, and it starts with getting the Vostok Life Pass: lifetime Vostok updates.\n\nThat may be too much for most people, so I'll leave some links to my writing on Substack — which I will get to. Until then, when you feel ready, go ahead on your own — and join the rest of us.",
        tone: "answer",
      },
    ],
    holdClassName: "",
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
          className={`${
            line.tone === "question"
              ? "mb-5 text-[0.7rem] font-black uppercase tracking-[0.28em] text-[#f1d27a] opacity-90"
              : line.tone === "answer"
                ? `whitespace-pre-wrap text-[0.88rem] font-normal leading-[1.82] text-white/70 md:text-[0.95rem] ${withVideo ? "max-w-none text-left" : "text-left"}`
                : line.tone === "emphasis"
                  ? "text-[1.1rem] font-semibold leading-[1.3] tracking-[0.04em] text-white/90"
                  : "text-[0.88rem] italic leading-[1.7] text-white/55"
          }`}
          style={{
            fontFamily:
              line.tone === "question"
                ? "var(--font-display, 'Tektur', sans-serif)"
                : "var(--font-body)",
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

      <div className="relative z-10 flex items-start justify-center px-6 py-[8vh] md:px-16 md:py-[10vh]">
        <div className="relative flex w-full max-w-[72rem] flex-col">
          <div className="relative z-10 flex flex-col">
            <div className="relative z-10">
              <div className="mx-auto max-w-[64rem]">
                <div className="flex flex-col">
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
                    <div className="flex w-full flex-col gap-8 md:flex-row md:items-start md:gap-10">
                      <div className="flex shrink-0 justify-center md:justify-start">
                        <img
                          src="/Differences2/04.jpg"
                          alt=""
                          aria-hidden="true"
                          className="w-full max-w-[16rem] rounded-2xl object-cover shadow-[0_16px_56px_rgba(0,0,0,0.65)] md:max-w-[22rem]"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col text-left">
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
