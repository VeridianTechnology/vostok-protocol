import { useEffect, useRef, useState, lazy } from "react";
import { createPortal } from "react-dom";
import FeatureThumbnails from "@/components/FeatureThumbnails";
const PremiumLifestyleSection = lazy(() => import("@/components/PremiumLifestyleSection"));
const ResearchStudies = lazy(() => import("@/components/ResearchStudies"));
const VostokProcess = lazy(() => import("@/components/VostokProcess"));
const CTAFooter = lazy(() => import("@/components/CTAFooter"));
const WhatIsItSection = lazy(() => import("@/components/WhatIsItSection"));
const TransitionThreshold = lazy(() => import("@/components/TransitionThreshold"));
import { track } from "@vercel/analytics";
import { trackOnce } from "@/lib/analytics";

const orderedSectionIds = [
  "section-hero",
  "section-messianic",
  "section-wall",
  "section-become",
  "section-what-is-it",
  "section-vostok",
  "section-research",
  "section-cta",
] as const;

const swallowedSectionIds = ["section-messianic", "section-wall"] as const;
type SwallowedSectionId = (typeof swallowedSectionIds)[number];
const SWALLOWED_SECTION_HEIGHT_PX = 6;
const SWALLOW_PLACEHOLDER_HOLD_MS = 1000;
const SWALLOW_PLACEHOLDER_SHRINK_MS = 50;
type SwallowPhase = "open" | "hold" | "shrinking" | "collapsed";

const createInitialSwallowProgress = (): Record<SwallowedSectionId, number> => ({
  "section-messianic": 0,
  "section-wall": 0,
});

const createInitialSwallowedSections = (): Record<SwallowedSectionId, boolean> => ({
  "section-messianic": false,
  "section-wall": false,
});

const createInitialSwallowHeights = (): Record<SwallowedSectionId, number> => ({
  "section-messianic": 0,
  "section-wall": 0,
});

const createInitialSwallowPhases = (): Record<SwallowedSectionId, SwallowPhase> => ({
  "section-messianic": "open",
  "section-wall": "open",
});

const createInitialSwallowTimers = (): Record<SwallowedSectionId, number | null> => ({
  "section-messianic": null,
  "section-wall": null,
});

const createInitialSwallowState = () => ({
  progress: createInitialSwallowProgress(),
  swallowed: createInitialSwallowedSections(),
  heights: createInitialSwallowHeights(),
  phase: createInitialSwallowPhases(),
});

const Index = () => {
  const [systemGlitchWord, setSystemGlitchWord] = useState<"КОПИРОВАТЬ" | "ДЕЛАЙ" | "СБОЙ СИСТЕМЫ" | null>(null);
  const [isFacebookEntry, setIsFacebookEntry] = useState(false);
  const [isFourChanEntry, setIsFourChanEntry] = useState(false);
  const [isInstagramEntry, setIsInstagramEntry] = useState(false);
  const [isTikTokEntry, setIsTikTokEntry] = useState(false);
  const [isRedditEntry, setIsRedditEntry] = useState(false);
  const [isTwitterEntry, setIsTwitterEntry] = useState(false);
  const [activeSectionId, setActiveSectionId] =
    useState<(typeof orderedSectionIds)[number]>("section-hero");
  const stayTimerRef = useRef<number | null>(null);
  const stay60TimerRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const swallowRafRef = useRef<number | null>(null);
  const systemGlitchCopyTimeoutRef = useRef<number | null>(null);
  const systemGlitchDoTimeoutRef = useRef<number | null>(null);
  const systemGlitchSystemTimeoutRef = useRef<number | null>(null);
  const systemGlitchClearTimeoutRef = useRef<number | null>(null);
  const activeSectionIdRef = useRef<(typeof orderedSectionIds)[number]>("section-hero");
  const visibleSectionsRef = useRef<Map<string, number>>(new Map());
  const swallowHoldTimeoutRef = useRef(createInitialSwallowTimers());
  const swallowCollapseFrameRef = useRef(createInitialSwallowTimers());
  const swallowCollapseTimeoutRef = useRef(createInitialSwallowTimers());
  const [swallowState, setSwallowState] = useState(createInitialSwallowState);

  const clearSystemGlitchTimeouts = () => {
    if (systemGlitchCopyTimeoutRef.current) {
      window.clearTimeout(systemGlitchCopyTimeoutRef.current);
      systemGlitchCopyTimeoutRef.current = null;
    }
    if (systemGlitchDoTimeoutRef.current) {
      window.clearTimeout(systemGlitchDoTimeoutRef.current);
      systemGlitchDoTimeoutRef.current = null;
    }
    if (systemGlitchSystemTimeoutRef.current) {
      window.clearTimeout(systemGlitchSystemTimeoutRef.current);
      systemGlitchSystemTimeoutRef.current = null;
    }
    if (systemGlitchClearTimeoutRef.current) {
      window.clearTimeout(systemGlitchClearTimeoutRef.current);
      systemGlitchClearTimeoutRef.current = null;
    }
  };
  useEffect(() => {
    trackOnce("page_view");
    const params = new URLSearchParams(window.location.search);
    const source = params.get("utm_source");
    const normalizedSource = source?.toLowerCase();
    if (normalizedSource === "facebook") {
      setIsFacebookEntry(true);
    }
    if (normalizedSource === "4chan") {
      setIsFourChanEntry(true);
    }
    if (normalizedSource === "instagram") {
      setIsInstagramEntry(true);
    }
    if (normalizedSource === "tiktok") {
      setIsTikTokEntry(true);
    }
    if (normalizedSource === "reddit") {
      setIsRedditEntry(true);
    }
    if (normalizedSource === "twitter") {
      setIsTwitterEntry(true);
    }

    stayTimerRef.current = window.setTimeout(() => {
      track("stay_30s");
      if (source?.toLowerCase() === "facebook") {
        track("stay_30s_facebook");
      }
      if (source?.toLowerCase() === "4chan") {
        track("stay_30s_4chan");
      }
      if (source?.toLowerCase() === "instagram") {
        track("stay_30s_instagram");
      }
      if (source?.toLowerCase() === "tiktok") {
        track("stay_30s_tiktok");
      }
      if (source?.toLowerCase() === "twitter") {
        track("stay_30s_twitter");
      }
    }, 30000);
    stay60TimerRef.current = window.setTimeout(() => {
      trackOnce("stay_60s");
    }, 60000);

    return () => {
      if (stayTimerRef.current) {
        window.clearTimeout(stayTimerRef.current);
      }
      if (stay60TimerRef.current) {
        window.clearTimeout(stay60TimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      clearSystemGlitchTimeouts();
    };
  }, []);

  useEffect(() => {
    activeSectionIdRef.current = activeSectionId;
  }, [activeSectionId]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRafRef.current) {
        return;
      }
      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = null;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) {
          return;
        }
        const progress = scrollTop / docHeight;
        if (progress >= 0.25) {
          trackOnce("scroll_25");
        }
        if (progress >= 0.5) {
          trackOnce("scroll_50");
        }
        if (progress >= 0.75) {
          trackOnce("scroll_75");
        }
        if (progress >= 0.98) {
          trackOnce("scroll_100");
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRafRef.current) {
        window.cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    swallowedSectionIds.forEach((id) => {
      if (swallowState.phase[id] !== "hold" || swallowHoldTimeoutRef.current[id]) {
        return;
      }

      swallowHoldTimeoutRef.current[id] = window.setTimeout(() => {
        swallowHoldTimeoutRef.current[id] = null;
        swallowCollapseFrameRef.current[id] = window.requestAnimationFrame(() => {
          swallowCollapseFrameRef.current[id] = null;
          setSwallowState((current) => {
            if (current.phase[id] !== "hold") {
              return current;
            }

            return {
              ...current,
              phase: { ...current.phase, [id]: "shrinking" },
            };
          });

          swallowCollapseTimeoutRef.current[id] = window.setTimeout(() => {
            swallowCollapseTimeoutRef.current[id] = null;
            setSwallowState((current) => {
              if (current.phase[id] !== "shrinking") {
                return current;
              }

              return {
                ...current,
                phase: { ...current.phase, [id]: "collapsed" },
              };
            });
            window.requestAnimationFrame(() => window.dispatchEvent(new Event("scroll")));
          }, SWALLOW_PLACEHOLDER_SHRINK_MS);
        });
      }, SWALLOW_PLACEHOLDER_HOLD_MS);
    });
  }, [swallowState.phase]);

  useEffect(() => {
    const holdTimeoutRef = swallowHoldTimeoutRef.current;
    const collapseFrameRef = swallowCollapseFrameRef.current;
    const collapseTimeoutRef = swallowCollapseTimeoutRef.current;

    return () => {
      swallowedSectionIds.forEach((id) => {
        const holdTimeoutId = holdTimeoutRef[id];
        const frameId = collapseFrameRef[id];
        const timeoutId = collapseTimeoutRef[id];

        if (holdTimeoutId) {
          window.clearTimeout(holdTimeoutId);
        }
        if (frameId) {
          window.cancelAnimationFrame(frameId);
        }
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      });
    };
  }, []);

  useEffect(() => {
    const updateSwallowProgress = () => {
      const scrollTop = window.scrollY;

      setSwallowState((current) => {
        let hasChanged = false;
        const nextProgress = { ...current.progress };
        const nextSwallowed = { ...current.swallowed };
        const nextHeights = { ...current.heights };
        const nextPhase = { ...current.phase };

        swallowedSectionIds.forEach((id, index) => {
          const node = document.getElementById(id);
          if (!node) {
            return;
          }

          const sectionTop = node.offsetTop;
          const sectionHeight = Math.max(node.scrollHeight, node.offsetHeight, 1);
          const hasPassedSection = scrollTop >= sectionTop + sectionHeight;
          const previousSectionId = swallowedSectionIds[index - 1];

          if (previousSectionId && current.phase[previousSectionId] !== "collapsed") {
            return;
          }

          if (current.swallowed[id] || hasPassedSection) {
            if (!current.swallowed[id]) {
              nextSwallowed[id] = true;
              nextHeights[id] = Math.max(sectionHeight, SWALLOWED_SECTION_HEIGHT_PX);
              nextPhase[id] = "hold";
              hasChanged = true;
            }
            if (nextProgress[id] !== 1) {
              nextProgress[id] = 1;
              hasChanged = true;
            }
            return;
          }

          const start = sectionTop;
          const end = sectionTop + sectionHeight;
          const progress = Math.min(1, Math.max(0, (scrollTop - start) / Math.max(end - start, 1)));
          const roundedProgress = Math.round(progress * 1000) / 1000;

          if (Math.abs((current.progress[id] ?? 0) - roundedProgress) > 0.004) {
            nextProgress[id] = roundedProgress;
            hasChanged = true;
          }
        });

        return hasChanged
          ? { progress: nextProgress, swallowed: nextSwallowed, heights: nextHeights, phase: nextPhase }
          : current;
      });
    };

    const requestUpdate = () => {
      if (swallowRafRef.current) {
        return;
      }

      swallowRafRef.current = window.requestAnimationFrame(() => {
        swallowRafRef.current = null;
        updateSwallowProgress();
      });
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (swallowRafRef.current) {
        window.cancelAnimationFrame(swallowRafRef.current);
        swallowRafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSectionsRef.current.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSectionsRef.current.delete(entry.target.id);
          }
        });

        let nextSectionId: (typeof orderedSectionIds)[number] | null = null;
        let nextRatio = -1;
        orderedSectionIds.forEach((id) => {
          const ratio = visibleSectionsRef.current.get(id);
          if (ratio !== undefined && ratio > nextRatio) {
            nextRatio = ratio;
            nextSectionId = id;
          }
        });

        if (nextSectionId && nextSectionId !== activeSectionIdRef.current) {
          setActiveSectionId(nextSectionId);
        }
      },
      {
        threshold: [0.1, 0.25, 0.4, 0.55, 0.7, 0.85],
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    orderedSectionIds.forEach((id) => {
      const node = document.getElementById(id);
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      return;
    }
    const targets: Array<{ id: string; event: string }> = [
      { id: "section-hero", event: "section_hero_view" },
      { id: "section-vostok", event: "section_vostok_view" },
      { id: "section-change-face", event: "section_change_face_view" },
      { id: "section-research", event: "section_research_view" },
      { id: "section-cta", event: "section_cta_view" },
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = targets.find((item) => item.id === entry.target.id);
            if (match) {
              trackOnce(match.event);
            }
          }
        });
      },
      { threshold: 0.4 }
    );
    targets.forEach(({ id }) => {
      const node = document.getElementById(id);
      if (node) {
        observer.observe(node);
      }
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      return;
    }

    let observer: IntersectionObserver | null = null;
    const seenIds = new Set<string>();
    const glitchTargets: Array<{
      id: string;
      word: "КОПИРОВАТЬ" | "ДЕЛАЙ" | "СБОЙ СИСТЕМЫ";
    }> = [
      { id: "section-hero", word: "КОПИРОВАТЬ" },
      { id: "section-messianic", word: "ДЕЛАЙ" },
    ];

    const connectObserver = () => {
      observer?.disconnect();
      observer = null;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const id = entry.target.id;
            const target = glitchTargets.find((item) => item.id === id);
            if (!target || seenIds.has(id)) {
              return;
            }

            seenIds.add(id);
            window.dispatchEvent(
              new CustomEvent("vostok:system-glitch", {
                detail: { word: target.word },
              })
            );
          });
        },
        {
          threshold: 0.3,
          rootMargin: "0px 0px -12% 0px",
        }
      );

      glitchTargets.forEach(({ id }) => {
        const node = document.getElementById(id);
        if (node && !seenIds.has(id)) {
          observer?.observe(node);
        }
      });
    };

    connectObserver();

    return () => {
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    const triggerSystemGlitchWord = (
      word: "КОПИРОВАТЬ" | "ДЕЛАЙ" | "СБОЙ СИСТЕМЫ",
      durationMs = 520
    ) => {
      clearSystemGlitchTimeouts();
      setSystemGlitchWord(word);
      systemGlitchClearTimeoutRef.current = window.setTimeout(() => {
        setSystemGlitchWord(null);
      }, durationMs);
    };

    const triggerSystemGlitchSequence = () => {
      clearSystemGlitchTimeouts();
      setSystemGlitchWord("КОПИРОВАТЬ");

      systemGlitchCopyTimeoutRef.current = window.setTimeout(() => {
        setSystemGlitchWord(null);
      }, 220);

      systemGlitchDoTimeoutRef.current = window.setTimeout(() => {
        setSystemGlitchWord("ДЕЛАЙ");
      }, 320);

      systemGlitchSystemTimeoutRef.current = window.setTimeout(() => {
        setSystemGlitchWord("СБОЙ СИСТЕМЫ");
      }, 640);

      systemGlitchClearTimeoutRef.current = window.setTimeout(() => {
        setSystemGlitchWord(null);
      }, 920);
    };

    const handleSystemGlitch = (event: Event) => {
      const customEvent = event as CustomEvent<{
        word?: "КОПИРОВАТЬ" | "ДЕЛАЙ" | "СБОЙ СИСТЕМЫ";
      }>;
      const word = customEvent.detail?.word;

      if (!word) {
        return;
      }

      triggerSystemGlitchWord(word);
    };

    const handleSystemGlitchSequence = () => {
      triggerSystemGlitchSequence();
    };

    window.addEventListener("vostok:system-glitch", handleSystemGlitch);
    window.addEventListener("vostok:system-glitch-sequence", handleSystemGlitchSequence);

    return () => {
      window.removeEventListener("vostok:system-glitch", handleSystemGlitch);
      window.removeEventListener("vostok:system-glitch-sequence", handleSystemGlitchSequence);
    };
  }, []);

  const handleRequestBuy = (continueToCheckout: () => void) => {
    continueToCheckout();
  };

  const entrySource = isFacebookEntry
    ? "facebook"
    : isFourChanEntry
      ? "4chan"
      : isInstagramEntry
        ? "instagram"
        : isTikTokEntry
          ? "tiktok"
          : isRedditEntry
            ? "reddit"
            : isTwitterEntry
              ? "twitter"
              : "direct";
  const activeSwallowSectionId: SwallowedSectionId | null =
    swallowState.phase["section-messianic"] === "open" &&
    swallowState.progress["section-messianic"] > 0
      ? "section-messianic"
      : swallowState.phase["section-wall"] === "open" && swallowState.progress["section-wall"] > 0
        ? "section-wall"
        : null;
  const getSwallowStyle = (id: SwallowedSectionId) => {
    const progress = swallowState.progress[id];
    const phase = swallowState.phase[id];
    const isActive = activeSwallowSectionId === id;
    const visualProgress = phase !== "open" ? 1 : isActive ? progress : 0;

    return {
      ["--hero-swallow-progress" as string]: visualProgress,
      ["--hero-swallow-placeholder-height" as string]: `${Math.max(
        swallowState.heights[id],
        SWALLOWED_SECTION_HEIGHT_PX
      )}px`,
      ["--hero-swallow-cover-height" as string]: isActive
        ? `${Math.round(visualProgress * 1000) / 10}%`
        : "0%",
      ["--hero-swallow-content-opacity" as string]: Math.max(0, 1 - visualProgress),
      ["--hero-swallow-content-brightness" as string]: Math.max(0.58, 1 - visualProgress * 0.42),
      ["--hero-swallow-overlay-opacity" as string]: isActive
        ? Math.min(1, visualProgress * 1.35)
        : 0,
    };
  };
  const getSwallowClassName = (id: SwallowedSectionId) => {
    const phase = swallowState.phase[id];
    return [
      "hero-swallow-section min-h-0",
      activeSwallowSectionId === id ? "hero-swallow-section--active" : "",
      phase !== "open" ? "hero-swallow-section--placeholder" : "",
      phase === "hold" ? "hero-swallow-section--hold" : "",
      phase === "shrinking" ? "hero-swallow-section--shrinking" : "",
      phase === "collapsed" ? "hero-swallow-section--collapsed" : "",
    ].filter(Boolean).join(" ");
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <section id="section-hero" className="min-h-[98vh] md:min-h-[140vh]">
        <FeatureThumbnails
          renderStructureSection={false}
          renderWallpaperSection
          entrySource={entrySource}
        />
      </section>
      <div className="divider-line hidden md:block" />
      <section
        id="section-messianic"
        className={getSwallowClassName("section-messianic")}
        style={getSwallowStyle("section-messianic")}
      >
        <PremiumLifestyleSection
          visibleSections={["messianic"]}
          messianicSectionId={undefined}
        />
      </section>
      <section
        id="section-wall"
        className={getSwallowClassName("section-wall")}
        style={getSwallowStyle("section-wall")}
      >
        <PremiumLifestyleSection
          visibleSections={["wall"]}
          wallSectionId={undefined}
        />
      </section>
      <section id="section-become" className="min-h-[78vh] md:min-h-[200vh]">
        <PremiumLifestyleSection
          visibleSections={["becoming"]}
          becomingSectionId={undefined}
          isBecomingYouActive={activeSectionId === "section-become"}
        />
      </section>
      <TransitionThreshold variant="crossing" />
      <section id="section-what-is-it" className="min-h-0">
        <WhatIsItSection />
      </section>
      <section id="section-vostok">
        <VostokProcess entrySource={entrySource} />
      </section>
      <TransitionThreshold variant="chamber" />
      <section id="section-research" className="min-h-[50vh]">
        <ResearchStudies entrySource={entrySource} />
      </section>
      <TransitionThreshold variant="fracture" />
      <section id="section-cta" className="min-h-[40vh] md:min-h-[140vh]">
        <CTAFooter onRequestBuy={handleRequestBuy} entrySource={entrySource} />
      </section>
      {systemGlitchWord && typeof document !== "undefined"
        ? createPortal(
            <div className="system-glitch-overlay fixed inset-0 z-[90] flex items-center justify-center">
              <span data-text={systemGlitchWord} className="system-glitch-word">
                {systemGlitchWord}
              </span>
            </div>,
            document.body
          )
        : null}
    </main>
  );
};

export default Index;
