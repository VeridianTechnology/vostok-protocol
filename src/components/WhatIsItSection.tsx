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
        text: "Vostok is a facial training system designed to improve the musculature of your face. It's about strengthening the face as we would at the gym, with various exercises and progressions — rebuilding it to have supermodel proportions.\n\nWe believe beauty should be democratized. It should not belong to just an elite class of models.\n\nOur skull is a combination of plates, not solid bone. The face is filled with cartilage, fat, nerves, and small muscles — and what we are offering here is the full service: building up the muscles, refining the facial structure, modifying the face in a very real way, to the point it'll look like you've had surgery.\n\nAll of this for the low price of $30 — about the price of six drinks.\n\nMost people never train this layer. Vostok exists to change that.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "But Why?", tone: "question" },
      {
        text: "If I were to tell you...\n\nThat I could make you hot, what would you say? That I could make you sexy?\n\nYou wouldn't believe me. You would say I'm crazy.\n\nWhat if I told you your personality is based on how attractive people perceive you to be? And not actually who you are?\n\nThis is not theory. This is observed behavior.\n\nBut here's the thing — you're going to have to work really hard, exactly as you would at the gym, but for your face. In fact, perhaps even more time into it.\n\nBut, again, here's the thing. Every hour you put in, every practice session, you get 1% hotter. And it stays that way — forever. So if you do 40 hours, you go about one point up on the scale. The scale of 1 to 10. If you're a 4 and you do forty hours, you should be visually looking like a 5. If you do another 40 hours, you'll look like a 6, and so on and so on. There really doesn't seem to be any limit — at least that I've seen.\n\nAnd yes, I started out as a low 8. I now feel like an 11. My photos don't really do it justice, and the beautiful thing is I'm constantly learning about Vostok — what it is. I myself couldn't fully describe it. It certainly isn't looksmaxxing. We won't be doing any bone smashing, as this can cause brain trauma that never heals. We won't be doing Botox or filler, as this will damage your face down the line and you won't be able to age gracefully. We won't be recommending peptides as those are just too intense for most people, although some may work. Everything we offer is very cheap — you just need the guide, some facial oil, and a mirror. That's it. And a way to wash your hands.\n\nWith a lot of work, dedication, and practically zero money — just effort and heart — you too can modify your face to become a version of yourself you've never even dreamed of.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "What is Vostok?", tone: "question" },
      {
        text: "Vostok is not a collection of tips. It is a structured approach to facial optimization.\n\nIt focuses on three things:\n\n- Structure: The underlying form of the face — jaw, cheekbones, alignment, posture.\n- Function: The habits that shape that structure over time — tongue position, breathing, chewing, muscular engagement.\n- Signal: How that structure is interpreted — symmetry, tension, clarity, presence.\n\nThe goal is not artificial change. The goal is precision.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "What's the Catch?", tone: "question" },
      {
        text: "It's going to take a lot of work, a lot of hours to get to the level you'll want to be at. But you'll find the whole world changing around you as people begin to treat you better.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "Is There a Refund?", tone: "question" },
      {
        text: "If you're not totally satisfied after 10 session workouts, just send a before and after picture to my Instagram and I will give you a full refund — at any point: a week from now, a year from now, or ten years from now. If you do ten hours of Vostok and it's not the greatest book you've ever bought, I will give you a full refund.",
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
          className="absolute inset-0 hidden h-full w-full object-cover brightness-[1.68] md:block"
        />
        <img
          src="/section_wallpaper/whatisit/4.jpg"
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
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0),transparent_22%,transparent_78%,rgba(255,255,255,0)),repeating-linear-gradient(0deg,rgba(255,255,255,0)_0px,rgba(255,255,255,0)_1px,transparent_1px,transparent_3px)] opacity-0"
          />

          <div className="relative z-10 flex h-full flex-col">
            <div className="relative z-10 flex-1 overflow-hidden px-7 pb-10 pt-10 text-[#b8bec6] md:px-12 md:py-12">
              <div className="mx-auto grid h-full max-w-[50rem] grid-rows-[1fr_auto]">
                <div className="flex min-h-0 flex-col overflow-y-auto text-center [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent">
                  <div className="flex-1" />
                  <div className="flex flex-col items-center">
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
                          className={`opacity-90 ${
                            line.tone === "emphasis"
                              ? "max-w-full px-2 text-[2.15rem] font-semibold leading-[1.22] tracking-[0.03em] text-white md:text-[3.9rem]"
                              : line.tone === "question"
                                ? "max-w-full px-2 pb-1 text-[2.55rem] font-semibold leading-[1.08] text-white md:text-[5rem] md:leading-[1.02]"
                                : line.tone === "answer"
                                  ? "mt-8 max-w-[46rem] whitespace-pre-wrap px-3 text-left text-[1.1rem] font-normal leading-[1.68] text-[#e8ecf2] md:mt-10 md:max-w-[56rem] md:text-[1.18rem] md:leading-[1.65]"
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
                  </div>
                  <div className="flex-1" />
                </div>

                <div className="relative z-20 mx-auto mt-8 flex w-full max-w-[24rem] items-center justify-between gap-8 pb-2 md:mt-8 md:max-w-none md:justify-center md:gap-16 md:pb-0">
                  {sequenceScreenIndex > 0 ? (
                    <button
                      type="button"
                      onClick={() => setSequenceScreenIndex((current) => Math.max(0, current - 1))}
                      className="touch-manipulation border border-[#b08a4a] bg-black px-6 py-3 text-[11px] uppercase tracking-[0.34em] text-white/72 transition hover:border-[#d2aa63] hover:text-white md:px-7"
                    >
                      Prev
                    </button>
                  ) : null}
                  <div className="flex min-w-0 items-center justify-center md:hidden">
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
                          index === sequenceScreenIndex
                            ? "bg-white"
                            : "bg-white/24 hover:bg-white/45"
                        }`}
                      />
                    ))}
                  </div>
                  {sequenceScreenIndex < vostokScreens.length - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSequenceScreenIndex((current) =>
                          Math.min(vostokScreens.length - 1, current + 1),
                        )
                      }
                      className="touch-manipulation border border-[#b08a4a] bg-black px-6 py-3 text-[11px] uppercase tracking-[0.34em] text-white/72 transition hover:border-[#d2aa63] hover:text-white md:px-7"
                    >
                      Next
                    </button>
                  ) : null}
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
