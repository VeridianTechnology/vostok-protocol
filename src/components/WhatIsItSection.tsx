import { AnimatePresence, m } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type ScreenLine = {
  text?: ReactNode;
  tone?: "body" | "emphasis" | "italic" | "question" | "answer";
};

type IdentityScreen = {
  lines?: ScreenLine[];
  spacer?: boolean;
  holdClassName?: string;
};

type ClosePhase = "idle" | "fade" | "recede";

const vostokScreens: IdentityScreen[] = [
  {
    lines: [
      { text: "So What Is This?", tone: "question" },
      {
        text: "If you can't figure it out, you never will.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "But Why?", tone: "question" },
      {
        text: "Just learn the how.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "What is Vostok?", tone: "question" },
      {
        text: "Elevation of the spirit of Man.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "Who are You?", tone: "question" },
      {
        text: "An Expert.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "What's the Catch?", tone: "question" },
      {
        text: "None.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "I refuse.", tone: "question" },
      {
        text: "Fine.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "I don't know.", tone: "question" },
      {
        text: "And you never will.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "Is There a Refund?", tone: "question" },
      {
        text: "No.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
];

const REFUND_SCREEN_INDEX = vostokScreens.length - 1;

const WhatIsItSection = () => {
  const [sequenceScreenIndex, setSequenceScreenIndex] = useState(0);
  const [closePhase, setClosePhase] = useState<ClosePhase>("idle");
  const currentSequenceScreen = vostokScreens[sequenceScreenIndex] ?? vostokScreens[0];
  const hasFadeStarted = closePhase !== "idle";
  const isReceding = closePhase === "recede";

  useEffect(() => {
    if (sequenceScreenIndex !== REFUND_SCREEN_INDEX) {
      setClosePhase("idle");
      return;
    }

    setClosePhase("idle");

    const fadeTimer = window.setTimeout(() => setClosePhase("fade"), 3000);
    const recedeTimer = window.setTimeout(() => setClosePhase("recede"), 6000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(recedeTimer);
    };
  }, [sequenceScreenIndex]);

  return (
    <m.section
      className={`section-surface relative left-1/2 right-1/2 h-[92vh] w-screen -translate-x-1/2 overflow-hidden border-t-[3px] border-black md:h-[110vh] ${
        hasFadeStarted ? "pointer-events-none" : ""
      }`}
      animate={
        isReceding
          ? {
              backgroundColor: "rgba(0,0,0,0)",
              borderTopColor: "rgba(0,0,0,0)",
              clipPath: "inset(0 0 100% 0)",
              height: 0,
            }
          : {
              backgroundColor: hasFadeStarted ? "rgba(0,0,0,0)" : "var(--section-surface)",
              borderTopColor: hasFadeStarted ? "rgba(0,0,0,0)" : "rgba(0,0,0,1)",
              clipPath: "inset(0 0 0% 0)",
            }
      }
      transition={
        isReceding
          ? {
              backgroundColor: { duration: 0.2 },
              borderTopColor: { duration: 0.2 },
              clipPath: { duration: 3, ease: "easeInOut" },
              height: { duration: 3, ease: "easeInOut" },
            }
          : {
              backgroundColor: { duration: hasFadeStarted ? 3 : 0.2 },
              borderTopColor: { duration: hasFadeStarted ? 3 : 0.2 },
              clipPath: { duration: 0.2 },
            }
      }
      style={{ transformOrigin: "top" }}
    >
      <m.div
        className="absolute inset-0 -z-10"
        animate={{ opacity: hasFadeStarted ? 0 : 1 }}
        transition={{ duration: hasFadeStarted ? 3 : 0.2, ease: "easeOut" }}
      >
        <img
          src="/section_wallpaper/whatisit/3.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 hidden h-full w-full object-cover brightness-[1.68] md:block"
        />
        <img
          src="/section_wallpaper/whatisit/4.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover brightness-[1.2] md:hidden"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.35)_38%,rgba(0,0,0,0.62)_100%)]" />
      </m.div>

      <div className="relative z-10 flex h-full items-center justify-center px-4 py-[5vh] md:px-8 md:py-[8vh]">
        <div className="relative flex h-full max-h-[82vh] w-full max-w-[68rem] flex-col overflow-hidden rounded-[28px] md:max-h-[94vh]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,10,0)_0%,rgba(8,9,12,0)_14%,rgba(7,8,10,0)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0),transparent_22%,transparent_78%,rgba(255,255,255,0)),repeating-linear-gradient(0deg,rgba(255,255,255,0)_0px,rgba(255,255,255,0)_1px,transparent_1px,transparent_3px)] opacity-0"
          />

          <m.div
            className="relative z-10 flex h-full flex-col"
            animate={{ opacity: hasFadeStarted ? 0 : 1 }}
            transition={{ duration: hasFadeStarted ? 3 : 0.3, ease: "easeOut" }}
            aria-hidden={hasFadeStarted}
          >
            <div className="relative z-10 flex-1 overflow-hidden px-7 pb-10 pt-10 text-[#b8bec6] md:px-12 md:py-12">
              <div className="mx-auto grid h-full max-w-[50rem] grid-rows-[1fr_auto]">
                <div className="flex min-h-0 items-center justify-center overflow-visible text-center">
                  <AnimatePresence mode="wait">
                    <m.div
                      key={sequenceScreenIndex}
                      initial={{ opacity: 0, y: 26 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0.18, y: -10 }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                      className={`flex w-full flex-col items-center justify-center ${
                        currentSequenceScreen?.holdClassName ?? "min-h-[8rem] md:min-h-[10rem]"
                      }`}
                    >
                      {currentSequenceScreen?.lines?.map((line, lineIndex) => (
                        <p
                          key={`${sequenceScreenIndex}-${lineIndex}`}
                          className={`opacity-40 ${
                            line.tone === "emphasis"
                              ? "max-w-full px-2 text-[2.15rem] font-semibold leading-[1.22] tracking-[0.03em] text-[#e7ebf0] md:text-[3.9rem]"
                              : line.tone === "question"
                                ? "max-w-full px-2 pb-1 text-[2.55rem] font-semibold leading-[1.08] text-[#f2f0eb] md:text-[5rem] md:leading-[1.02]"
                                : line.tone === "answer"
                                  ? "mt-8 max-w-[46rem] px-3 text-[1.1rem] font-normal leading-[1.58] text-[#d5d8de] md:mt-12 md:max-w-[56rem] md:text-[1.36rem] md:leading-[1.55]"
                                  : line.tone === "italic"
                                    ? "max-w-full px-2 text-[1.52rem] italic leading-[1.32] text-[#afb5be] md:text-[3rem]"
                                    : "max-w-full px-2 text-[1.52rem] italic leading-[1.32] text-[#afb5be] md:text-[3rem]"
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
                </div>

                <div className="relative z-20 mx-auto mt-8 flex w-full max-w-[24rem] items-center justify-between gap-8 pb-2 md:mt-8 md:max-w-none md:justify-center md:gap-16 md:pb-0">
                  {sequenceScreenIndex > 0 ? (
                    <button
                      type="button"
                      disabled={hasFadeStarted}
                      onClick={() => setSequenceScreenIndex((current) => Math.max(0, current - 1))}
                      className="touch-manipulation border border-[#b08a4a] bg-black px-6 py-3 text-[11px] uppercase tracking-[0.34em] text-white/72 transition hover:border-[#d2aa63] hover:text-white disabled:pointer-events-none md:px-7"
                    >
                      Prev
                    </button>
                  ) : null}
                  <div className="flex min-w-0 flex-1 items-center justify-center md:hidden">
                    <span className="text-[11px] uppercase tracking-[0.28em] text-white/72">
                      {sequenceScreenIndex + 1} / {vostokScreens.length}
                    </span>
                  </div>
                  <div className="hidden items-center gap-2 md:flex">
                    {vostokScreens.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Go to screen ${index + 1}`}
                        disabled={hasFadeStarted}
                        onClick={() => setSequenceScreenIndex(index)}
                        className={`h-2.5 w-2.5 rounded-full transition disabled:pointer-events-none ${
                          index === sequenceScreenIndex
                            ? "bg-white"
                            : "bg-white/24 hover:bg-white/45"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={hasFadeStarted}
                    onClick={() =>
                      setSequenceScreenIndex((current) =>
                        Math.min(vostokScreens.length - 1, current + 1),
                      )
                    }
                    className="touch-manipulation border border-[#b08a4a] bg-black px-6 py-3 text-[11px] uppercase tracking-[0.34em] text-white/72 transition hover:border-[#d2aa63] hover:text-white disabled:pointer-events-none md:px-7"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </m.section>
  );
};

export default WhatIsItSection;
