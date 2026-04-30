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
};

const vostokScreens: IdentityScreen[] = [
  {
    lines: [
      { text: "So What Is This?", tone: "question" },
      {
        text: "This is a $30 ebook guide that can actually make you more attractive.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "So Why Trust You?", tone: "question" },
      {
        text: "Because this never began as a product to me. It began as a private obsession.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "So Why Is Your System Better?", tone: "question" },
      {
        text: "No weird injections. No Botox. No bone smashing. Nothing that could permanently damage or scar your face, or leave you infertile.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "What Makes You the Expert?", tone: "question" },
      {
        text: "I have more hours under my belt with this system than anyone else. I have used AI, proper technique, and relentless review to refine the work, and I have watched my life improve because of it.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "What's the Catch?", tone: "question" },
      {
        text: (
          <>
            Visible change can occur quickly.
            <br />
            Permanent structural adaptation cannot.
            <br />
            <br />
            The body responds to consistency, tension, posture, recovery, and time.
            <br />
            <br />
            Nothing biological transforms instantly.
            <br />
            That is precisely why transformation matters.
          </>
        ),
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "I Don't See Much Improvement.", tone: "question" },
      {
        text: "Then you don't have very good eyes. You probably don't pay attention to detail.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "How Will I Know I Get My Money's Worth?", tone: "question" },
      {
        text: "You will not know until you try.",
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

const WhatIsItSection = () => {
  const [sequenceScreenIndex, setSequenceScreenIndex] = useState(0);
  const currentSequenceScreen = vostokScreens[sequenceScreenIndex] ?? vostokScreens[0];

  return (
    <section className="section-surface relative left-1/2 right-1/2 h-[92vh] w-screen -translate-x-1/2 overflow-hidden border-t-[3px] border-black md:h-[110vh]">
      <div className="absolute inset-0 -z-10">
        <img
          src="/section_wallpaper/whatisit/3.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 hidden h-full w-full object-cover brightness-[1.4] md:block"
        />
        <img
          src="/section_wallpaper/whatisit/4.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover md:hidden"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.35)_38%,rgba(0,0,0,0.62)_100%)]" />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-4 py-[5vh] md:px-8 md:py-[8vh]">
        <div className="relative flex h-full max-h-[82vh] w-full max-w-[68rem] flex-col overflow-hidden rounded-[28px] border border-white/14 shadow-[0_30px_110px_rgba(0,0,0,0.58)] md:max-h-[94vh]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,10,0.86)_0%,rgba(8,9,12,0.79)_14%,rgba(7,8,10,0.75)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.035),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.012),transparent_22%,transparent_78%,rgba(255,255,255,0.012)),repeating-linear-gradient(0deg,rgba(255,255,255,0.014)_0px,rgba(255,255,255,0.014)_1px,transparent_1px,transparent_3px)] opacity-60"
          />

          <div className="relative z-10 border-b border-white/12 bg-[linear-gradient(180deg,rgba(8,9,11,0.74)_0%,rgba(8,9,11,0.58)_100%)] px-4 py-4 md:px-6 md:pb-5 md:pt-8">
            <p
              className="text-center text-[0.82rem] font-normal uppercase leading-none text-[#b89c6b] md:text-[0.95rem]"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontVariantCaps: "small-caps",
              }}
            >
              Philosophy
            </p>
          </div>

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
                        className={`${
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

              <div className="mx-auto mt-8 flex w-full max-w-[24rem] items-center justify-between gap-8 pb-2 md:mt-8 md:max-w-none md:justify-center md:gap-16 md:pb-0">
                <button
                  type="button"
                  onClick={() => setSequenceScreenIndex((current) => Math.max(0, current - 1))}
                  className="border border-[#b08a4a] bg-black px-6 py-3 text-[11px] uppercase tracking-[0.34em] text-white/72 transition hover:border-[#d2aa63] hover:text-white md:px-7"
                >
                  Prev
                </button>
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
                      onClick={() => setSequenceScreenIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full transition ${
                        index === sequenceScreenIndex ? "bg-white" : "bg-white/24 hover:bg-white/45"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSequenceScreenIndex((current) =>
                      Math.min(vostokScreens.length - 1, current + 1),
                    )
                  }
                  className="border border-[#b08a4a] bg-black px-6 py-3 text-[11px] uppercase tracking-[0.34em] text-white/72 transition hover:border-[#d2aa63] hover:text-white md:px-7"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsItSection;
