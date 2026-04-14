import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState } from "react";

type ScreenLine = {
  text?: string;
  tone?: "body" | "emphasis" | "italic";
};

type IdentityScreen = {
  lines?: ScreenLine[];
  spacer?: boolean;
  holdClassName?: string;
};

const vostokScreens: IdentityScreen[] = [
  {
    lines: [
      { text: "The Face", tone: "body" },
      { text: "Is The First Story", tone: "body" },
      { text: "The World Believes About You", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "Vostok Begins", tone: "body" },
      { text: "At That Threshold", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "Vostok", tone: "body" },
      { text: "Is A Facial Training System", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "Designed To Improve", tone: "body" },
      { text: "The Musculature", tone: "body" },
      { text: "Of Your Face", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "Not Surface Level", tone: "body" },
      { text: "Not Temporary", tone: "body" },
      { text: "Structural", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "It Trains The Face", tone: "body" },
      { text: "The Same Way", tone: "body" },
      { text: "You Train The Body", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "Variation", tone: "body" },
      { text: "Repetition", tone: "body" },
      { text: "Rebuilding", tone: "body" },
    ],
  },
  { lines: [{ text: "Until The Structure Changes", tone: "body" }] },
  { lines: [{ text: "Until The Proportions Shift", tone: "body" }] },
  {
    lines: [
      { text: "Until You Reach", tone: "body" },
      { text: "Supermodel-Level Balance", tone: "body" },
    ],
  },
  { lines: [{ text: "Beauty Should Be Democratized", tone: "body" }], holdClassName: "min-h-[10rem]" },
  { lines: [{ text: "It Should Be Free", tone: "body" }] },
  {
    lines: [
      { text: "It Should Not Belong", tone: "body" },
      { text: "To An Elite Class", tone: "body" },
    ],
  },
  { lines: [{ text: "You Don’t Need To Guess", tone: "body" }] },
  { lines: [{ text: "You Don’t Need To Hack", tone: "body" }] },
  { lines: [{ text: "You Trust The Process", tone: "body" }] },
  {
    lines: [
      { text: "Your Skull", tone: "body" },
      { text: "Is Not A Single Structure", tone: "body" },
    ],
  },
  { lines: [{ text: "It Is A System Of Pieces", tone: "body" }] },
  { lines: [{ text: "Your Face Is Not Fixed", tone: "body" }] },
  {
    lines: [
      { text: "It Is Cartilage", tone: "body" },
      { text: "Fat", tone: "body" },
      { text: "Nerves", tone: "body" },
      { text: "Muscle", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "Vostok Works", tone: "body" },
      { text: "On All Of It", tone: "body" },
    ],
  },
  { lines: [{ text: "Building The Muscles", tone: "body" }] },
  { lines: [{ text: "Refining The Structure", tone: "body" }] },
  { lines: [{ text: "Reshaping The Face", tone: "body" }] },
  {
    lines: [
      { text: "In A Real", tone: "body" },
      { text: "Physical", tone: "body" },
      { text: "Way", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "To The Point", tone: "emphasis" },
      { text: "It Can Look", tone: "emphasis" },
      { text: "Like Surgery", tone: "emphasis" },
    ],
    holdClassName: "min-h-[10rem]",
  },
  { lines: [{ text: "All Of This", tone: "body" }] },
  { lines: [{ text: "For $30", tone: "emphasis" }], holdClassName: "min-h-[10rem]" },
];

const identityScreens: IdentityScreen[] = [
  { lines: [{ text: "If I were to tell you...", tone: "italic" }] },
  { lines: [{ text: "That I Could Make You Hot", tone: "body" }] },
  { lines: [{ text: "What Would You Say?", tone: "body" }] },
  { lines: [{ text: "That I Could Make You Sexy?", tone: "body" }] },
  { lines: [{ text: "You Wouldn’t Believe Me.", tone: "body" }] },
  { lines: [{ text: "You Would Say I’m Crazy.", tone: "body" }] },
  { lines: [{ text: "But What If I Told You Something Worse?", tone: "body" }] },
  {
    lines: [
      { text: "Your Personality", tone: "body" },
      { text: "Is Based On How Attractive", tone: "body" },
      { text: "People Perceive You To Be", tone: "body" },
    ],
  },
  { lines: [{ text: "Not Who You Actually Are.", tone: "body" }] },
  { lines: [{ text: "This Is Not Theory.", tone: "emphasis" }], holdClassName: "min-h-[10rem]" },
  { lines: [{ text: "This Is Vostok", tone: "emphasis" }], holdClassName: "min-h-[10rem]" },
];

const methodScreens: IdentityScreen[] = [
  {
    lines: [
      { text: "There Is A Science", tone: "body" },
      { text: "To Getting Attractive", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "Most People", tone: "body" },
      { text: "Never Learn It", tone: "body" },
    ],
  },
  { lines: [{ text: "I Did", tone: "body" }] },
  {
    lines: [
      { text: "Every Session", tone: "body" },
      { text: "Feels Like A Correction", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "Like A Small", tone: "body" },
      { text: "Precise Surgery", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "Adjusting The Face", tone: "body" },
      { text: "In Real Time", tone: "body" },
    ],
  },
  { lines: [{ text: "Others Try To Buy It", tone: "body" }], holdClassName: "min-h-[10rem]" },
  {
    lines: [
      { text: "Expensive Protocols", tone: "body" },
      { text: "Endless Optimization", tone: "body" },
      { text: "Massive Cost", tone: "body" },
    ],
  },
  { lines: [{ text: "They Work", tone: "body" }] },
  {
    lines: [
      { text: "But They’re Not Built", tone: "body" },
      { text: "For You", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "They’re Inefficient", tone: "body" },
      { text: "Detached", tone: "body" },
      { text: "Unnatural", tone: "body" },
    ],
  },
  { lines: [{ text: "Others Cut", tone: "emphasis" }], holdClassName: "min-h-[10rem]" },
  {
    lines: [
      { text: "Surgery", tone: "body" },
      { text: "Fillers", tone: "body" },
      { text: "Shortcuts", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "They Trade The Future", tone: "body" },
      { text: "For The Present", tone: "body" },
    ],
  },
  { lines: [{ text: "And Still Fall Short", tone: "body" }] },
  { lines: [{ text: "Vostok Is Different", tone: "body" }], holdClassName: "min-h-[10rem]" },
  {
    lines: [
      { text: "It Trains The Face", tone: "body" },
      { text: "Directly", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "Not Around It", tone: "body" },
      { text: "Not Over It", tone: "body" },
      { text: "Through It", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "Every Exercise", tone: "body" },
      { text: "Is Tested", tone: "body" },
    ],
  },
  {
    lines: [
      { text: "Every Movement", tone: "body" },
      { text: "Is Practiced", tone: "body" },
    ],
  },
  { lines: [{ text: "On Myself", tone: "body" }] },
  { lines: [{ text: "For Years", tone: "body" }] },
  {
    lines: [
      { text: "Individually", tone: "body" },
      { text: "Deliberately", tone: "body" },
      { text: "Repeatedly", tone: "body" },
    ],
  },
  { lines: [{ text: "I Know What Works", tone: "emphasis" }], holdClassName: "min-h-[10rem]" },
  { lines: [{ text: "And What Doesn’t", tone: "body" }] },
];

const tabs = [
  {
    id: "vostok",
    label: "THRESHOLD",
    title: "Threshold",
    sequence: true,
    sequenceScreens: vostokScreens,
    hideSequenceTitle: true,
  },
  {
    id: "what-changes",
    label: "IDENTITY SHIFT",
    title: "Identity Shift",
    sequence: true,
    sequenceScreens: identityScreens,
    hideSequenceTitle: true,
  },
  {
    id: "what-it-is-not",
    label: "THE METHOD",
    title: "The Method",
    sequence: true,
    sequenceScreens: methodScreens,
    hideSequenceTitle: true,
  },
] as const;

const WhatIsItSection = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [sequenceScreenIndex, setSequenceScreenIndex] = useState(0);
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  useEffect(() => {
    if (!("sequence" in currentTab) || !currentTab.sequence) {
      return;
    }

    setSequenceScreenIndex(0);
  }, [activeTab, currentTab]);

  const currentSequenceScreens =
    "sequenceScreens" in currentTab ? currentTab.sequenceScreens ?? [] : [];
  const currentSequenceScreen = currentSequenceScreens[sequenceScreenIndex] ?? currentSequenceScreens[0];

  return (
    <section className="section-surface relative left-1/2 right-1/2 h-[66vh] w-screen -translate-x-1/2 overflow-hidden border-t-[3px] border-black md:h-[110vh]">
      <div className="absolute inset-0 -z-10">
        <img
          src="/section_wallpaper/whatisit/1.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
        />
        <img
          src="/section_wallpaper/whatisit/2.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover md:hidden"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.35)_38%,rgba(0,0,0,0.62)_100%)]" />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-4 py-[4vh] md:px-8 md:py-[8vh]">
        <div className="relative flex h-full max-h-[58vh] w-full max-w-[68rem] flex-col overflow-hidden rounded-[28px] border border-white/14 shadow-[0_30px_110px_rgba(0,0,0,0.58)] md:max-h-[94vh]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,10,0.86)_0%,rgba(8,9,12,0.79)_14%,rgba(7,8,10,0.75)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.035),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.012),transparent_22%,transparent_78%,rgba(255,255,255,0.012)),repeating-linear-gradient(0deg,rgba(255,255,255,0.014)_0px,rgba(255,255,255,0.014)_1px,transparent_1px,transparent_3px)] opacity-60"
          />

          <div className="relative z-10 border-b border-white/12 bg-[linear-gradient(180deg,rgba(8,9,11,0.74)_0%,rgba(8,9,11,0.58)_100%)] px-4 py-4 md:px-6">
            <div className="grid grid-cols-3 overflow-hidden rounded-[10px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.015)_0%,rgba(255,255,255,0.005)_100%)]">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative min-w-0 border-r border-white/10 px-3 py-3 text-center text-[11px] font-medium uppercase tracking-[0.34em] transition-all duration-300 last:border-r-0 md:px-4 md:py-3.5 md:text-xs ${
                    isActive
                      ? "text-white"
                      : "text-white/56 hover:text-white/78"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-[3px] rounded-[7px] transition-opacity duration-300 ${
                      isActive
                        ? "opacity-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.26),inset_0_0_22px_rgba(255,255,255,0.04)]"
                        : "opacity-0"
                    }`}
                  />
                  {tab.label}
                </button>
              );
            })}
            </div>
          </div>

          <div className="relative z-10 flex-1 overflow-hidden px-7 py-8 text-[#b8bec6] md:px-12 md:py-12">
            <div className="mx-auto flex h-full max-w-[42rem] flex-col">
              <h2
                className="text-[2rem] font-semibold uppercase tracking-[0.08em] text-[rgba(230,234,239,0.85)] md:text-[2.85rem]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {"hideSequenceTitle" in currentTab && currentTab.hideSequenceTitle ? "" : currentTab.title}
              </h2>
              {"hook" in currentTab ? (
                <div className="mt-5 max-w-[34rem] space-y-1.5 text-[0.98rem] leading-[1.8] text-[#9ea6b0] md:mt-6 md:text-[1.04rem]">
                  {currentTab.hook.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ) : null}

              {"sequence" in currentTab && currentTab.sequence ? (
                <div className="mt-2 grid h-full min-h-0 grid-rows-[1fr_auto] md:mt-4">
                  <div className="mx-auto flex min-h-0 w-full max-w-full flex-1 flex-col items-center justify-center overflow-hidden text-center">
                    <AnimatePresence mode="wait">
                      <m.div
                        key={`${activeTab}-${sequenceScreenIndex}`}
                        initial={{ opacity: 0, y: 26 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: activeTab === "what-changes" && sequenceScreenIndex === 10 ? 1.03 : 1,
                        }}
                        exit={{ opacity: 0.18, y: -10 }}
                        transition={{
                          duration: activeTab === "what-changes" && sequenceScreenIndex === 10 ? 0.72 : 0.55,
                          ease: "easeOut",
                        }}
                        className={`flex w-full max-w-full flex-col items-center justify-center gap-5 overflow-hidden ${currentSequenceScreen?.holdClassName ?? "min-h-[8rem] md:min-h-[10rem]"}`}
                      >
                        {currentSequenceScreen?.spacer ? (
                          <div className="h-24 w-full" />
                        ) : (
                          currentSequenceScreen?.lines?.map((line) => (
                            <p
                              key={line.text}
                              className={
                                line.tone === "emphasis"
                                  ? "max-w-full px-2 text-[2.15rem] font-semibold leading-[1.22] tracking-[0.03em] text-[#e7ebf0] md:text-[3.9rem]"
                                  : line.tone === "italic"
                                    ? "max-w-full px-2 text-[1.52rem] italic leading-[1.32] text-[#afb5be] md:text-[3rem]"
                                    : "max-w-full px-2 text-[1.52rem] italic leading-[1.32] text-[#afb5be] md:text-[3rem]"
                              }
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              {line.text}
                            </p>
                          ))
                        )}
                      </m.div>
                    </AnimatePresence>
                  </div>

                  <div className="mx-auto mt-4 flex w-full max-w-[19rem] items-center justify-between gap-3 pb-1 md:mt-8 md:max-w-none md:justify-center md:gap-4 md:pb-0">
                    <button
                      type="button"
                      onClick={() => setSequenceScreenIndex((current) => Math.max(0, current - 1))}
                      className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/72 transition hover:border-white/35 hover:text-white"
                    >
                      Prev
                    </button>
                    <div className="flex min-w-0 flex-1 items-center justify-center md:hidden">
                      <span className="text-[11px] uppercase tracking-[0.28em] text-white/72">
                        {sequenceScreenIndex + 1} / {currentSequenceScreens.length}
                      </span>
                    </div>
                    <div className="hidden items-center gap-2 md:flex">
                      {currentSequenceScreens.map((_, index) => (
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
                          Math.min(currentSequenceScreens.length - 1, current + 1),
                        )
                      }
                      className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/72 transition hover:border-white/35 hover:text-white"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-8 space-y-10 md:mt-10 md:space-y-12">
                  {currentTab.sections.map((section) => (
                    <div key={section.heading ?? section.paragraphs[0]}>
                      {section.heading ? (
                        <h3
                          className="text-[0.82rem] font-semibold uppercase tracking-[0.26em] text-[#d2d7de] md:text-[0.95rem]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {section.heading}
                        </h3>
                      ) : null}

                      <div
                        className="mt-4 space-y-5 text-[1.03rem] leading-[1.95] text-[#bcc1c8] md:mt-5 md:space-y-6 md:text-[1.12rem] md:leading-[2.02]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {"richContent" in section ? section.richContent : null}
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}

                        {section.items ? (
                          <ul className="list-disc space-y-2.5 pl-6 marker:text-[#aab0b9] md:space-y-3">
                            {section.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        ) : null}

                        {section.trailingParagraphs?.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}

                        {section.trailingItems ? (
                          <ul className="list-disc space-y-2.5 pl-6 marker:text-[#aab0b9] md:space-y-3">
                            {section.trailingItems.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        ) : null}

                        {section.closingParagraphs?.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsItSection;
