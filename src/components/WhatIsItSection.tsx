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
        text: "This is a $30 ebook guide that can actually make you more attractive, using proven methods that have worked for a dozen other people and helped fix everything from jaw issues and eye alignment to facial aging, forehead asymmetries, and lip volume. I am not even the best example anymore, because I hardly do it now.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "So Why Trust You?", tone: "question" },
      {
        text: "Because this never began as a product to me. It began as a private obsession. I followed Vostok seriously myself, built and refined many of these methods, learned others from different sources, and then spent the last year and a half, nearly two years, testing them on my own face. What started as curiosity slowly became discipline, and then something deeper. The work changed how I looked, but more than that, it changed how I carried myself. It gave me back a sense of youth, vigor, confidence, and direction that I had not felt in a long time. That is why I trust it. I do not just package this information. I live with it, every day.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "So Why Is Your System Better?", tone: "question" },
      {
        text: "No weird injections. No Botox. No bone smashing. Nothing that could permanently damage or scar your face, or leave you infertile. This is an all-natural system. All you need is a mirror and some face oil.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "What Makes You the Expert?", tone: "question" },
      {
        text: "I have more hours under my belt with this system than anyone else. I have used AI, proper technique, and relentless review to refine the work, and I have watched my life improve because of it. Women who used to feel way out of my league now swarm me. People react to me with respect and politeness. I do not just live the philosophy of the system; I built it through a massive amount of effort. No one, and I mean no one, is on my level, and you will see that very quickly the moment you start the practices.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "What's the Catch?", tone: "question" },
      {
        text: "There is none. Well, okay, you will have to put in a lot of work. Will you see results? Yes, even the very next day. But real, concrete results take months. If you put in just two hours a week, you will accelerate your progress, and if you stop, the results will stay, at least 80% of them. This is for long-lasting, life-lasting improvement. It is not filler that can shift, leak, or ruin your face. It is not surgery that can make you look like a monstrosity. This is an all-natural system for de-aging, looks, and confidence.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "I Don't See Much Improvement.", tone: "question" },
      {
        text: (
          <>
            Yeah. That is because I am five years older in my after photos, and I do not really
            have good before photos. The differences are all there. I have also been a lifelong
            smoker and used to smoke a pack a day. I should look <strong>way worse</strong>, but I
            do not. I look better. I have since quit smoking and will properly train this to show
            results. Most of my hours were spent investigating methods that worked. I wasted a ton
            of time refining this. Most of my hours now go into promoting it, not using it. You can
            far surpass me faster as a student.
          </>
        ),
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "How Will I Know I Get My Money's Worth?", tone: "question" },
      {
        text: "You will not know until you try. Stupid courses and fake gurus have ruined the online space, and I am ashamed of them. I am different. I am a former tech entrepreneur dedicated to making the highest-quality product I can. This is, and I mean it, probably the most valuable $30 you will ever spend and one of the biggest game changers in your life. Your entire environment will bend around you. I have yet to see one person who does not love this guide and this product. We are building a brand here, not an ebook store. I want you as a customer for life. You will buy every single product I release, I assure you.",
        tone: "answer",
      },
    ],
    holdClassName: "min-h-[14rem] md:min-h-[18rem]",
  },
  {
    lines: [
      { text: "Is There a Refund?", tone: "question" },
      {
        text: "No. And even if I could give a refund for a digital product, I never would anyway. I do not believe in refunds. But the more important answer is this: this is technology. It is technology for the face, and it is only going to improve. You are not buying an ebook. You are buying an ever-improving guide, techniques, and access to all of it. That is why I am not worried about copycats. The price will only go up, not down. This is as cheap as you will ever see it, I assure you.",
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
          src="/section_wallpaper/whatisit/2.jpg"
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
              className="text-center text-[3.4rem] font-normal leading-[0.96] text-white/88 md:text-[5.3rem]"
              style={{ fontFamily: "Cylburn, serif" }}
            >
              Understand
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
                        className={
                          line.tone === "emphasis"
                            ? "max-w-full px-2 text-[2.15rem] font-semibold leading-[1.22] tracking-[0.03em] text-[#e7ebf0] md:text-[3.9rem]"
                            : line.tone === "question"
                              ? "max-w-full px-2 pb-1 text-[1.82rem] font-medium leading-[1.22] tracking-[-0.02em] text-[#e7ebf0] md:text-[4rem] md:leading-[1.1]"
                              : line.tone === "answer"
                                ? "mt-8 max-w-[40rem] px-3 text-[0.8rem] font-normal leading-[1.68] tracking-[0.01em] text-[#c4cad2] md:mt-14 md:max-w-[50rem] md:text-[1.12rem]"
                                : line.tone === "italic"
                                  ? "max-w-full px-2 text-[1.52rem] italic leading-[1.32] text-[#afb5be] md:text-[3rem]"
                                  : "max-w-full px-2 text-[1.52rem] italic leading-[1.32] text-[#afb5be] md:text-[3rem]"
                        }
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
