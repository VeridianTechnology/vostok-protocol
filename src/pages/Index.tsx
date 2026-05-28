import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import FeatureThumbnails from "@/components/FeatureThumbnails";
import MessianicSection from "@/components/MessianicSection";
import WallSection from "@/components/WallSection";
import BecomingSection from "@/components/BecomingSection";
import SectionLoader from "@/components/SectionLoader";
const ResearchStudies = lazy(() => import("@/components/ResearchStudies"));
const StructureSection = lazy(() => import("@/components/StructureSection"));
const VostokProcess = lazy(() => import("@/components/VostokProcess"));
const CTAFooter = lazy(() => import("@/components/CTAFooter"));
const TransitionThreshold = lazy(() => import("@/components/TransitionThreshold"));
const WhatIsItSection = lazy(() => import("@/components/WhatIsItSection"));
import { trackSafe, trackBeacon, checkAndSetOwnerParam, isOwner, hasBuyClicked, CAT_KEY, BOUGHT_KEY } from "@/lib/analytics";

const orderedSectionIds = [
  "section-hero",
  "section-messianic",
  "section-wall",
  "section-become",
  "section-structure",
  "section-vostok",
  "section-what-is-it",
  "section-research",
  "section-cta",
] as const;

const collapsibleSectionIds = ["section-messianic", "section-wall"] as const;
type CollapsibleSectionId = (typeof collapsibleSectionIds)[number];
const COLLAPSED_HEIGHT_PX = 6;
const COLLAPSE_HOLD_MS = 1000;
const COLLAPSE_SHRINK_MS = 50;
type CollapsePhase = "open" | "hold" | "shrinking" | "collapsed";

const createInitialCollapseProgress = (): Record<CollapsibleSectionId, number> => ({
  "section-messianic": 0,
  "section-wall": 0,
});

const createInitialCollapsedSections = (): Record<CollapsibleSectionId, boolean> => ({
  "section-messianic": false,
  "section-wall": false,
});

const createInitialCollapseHeights = (): Record<CollapsibleSectionId, number> => ({
  "section-messianic": 0,
  "section-wall": 0,
});

const createInitialCollapsePhases = (): Record<CollapsibleSectionId, CollapsePhase> => ({
  "section-messianic": "open",
  "section-wall": "open",
});

const createInitialCollapseTimers = (): Record<CollapsibleSectionId, number | null> => ({
  "section-messianic": null,
  "section-wall": null,
});

const createInitialCollapseState = () => ({
  progress: createInitialCollapseProgress(),
  collapsed: createInitialCollapsedSections(),
  heights: createInitialCollapseHeights(),
  phase: createInitialCollapsePhases(),
});

const Index = () => {
  const [systemGlitchWord, setSystemGlitchWord] = useState<"КОПИРОВАТЬ" | "ДЕЛАЙ" | "СБОЙ СИСТЕМЫ" | null>(null);
  const [entrySource, setEntrySource] = useState("direct");
  const [activeSectionId, setActiveSectionId] =
    useState<(typeof orderedSectionIds)[number]>("section-hero");
  const collapseRafRef = useRef<number | null>(null);
  const systemGlitchCopyTimeoutRef = useRef<number | null>(null);
  const systemGlitchDoTimeoutRef = useRef<number | null>(null);
  const systemGlitchSystemTimeoutRef = useRef<number | null>(null);
  const systemGlitchClearTimeoutRef = useRef<number | null>(null);
  const activeSectionIdRef = useRef<(typeof orderedSectionIds)[number]>("section-hero");
  const visibleSectionsRef = useRef<Map<string, number>>(new Map());
  const collapseHoldTimeoutRef = useRef(createInitialCollapseTimers());
  const collapseFrameRef = useRef(createInitialCollapseTimers());
  const collapseTimeoutRef = useRef(createInitialCollapseTimers());
  const [collapseState, setCollapseState] = useState(createInitialCollapseState);

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
    checkAndSetOwnerParam();
    const source = new URLSearchParams(window.location.search).get("utm_source")?.toLowerCase();
    const known = ["facebook", "4chan", "instagram", "tiktok", "reddit", "twitter"];
    if (source && known.includes(source)) setEntrySource(source);
  }, []);

  // Visitor category system — fires exactly one beacon per visitor (localStorage) on exit:
  // "canceled" | "bot_activity" | "did_check" | "checked_it_well" | "buy_button_check"
  useEffect(() => {
    if (isOwner()) return;
    if (localStorage.getItem(CAT_KEY)) return;

    const arrivalTime = Date.now();
    let hasScrolled = false;
    let pageFullyLoaded = document.readyState === "complete";

    const onPageLoad = () => { pageFullyLoaded = true; };
    if (!pageFullyLoaded) {
      window.addEventListener("load", onPageLoad);
    }

    const onScroll = () => {
      hasScrolled = true;
    };

    const fireCategory = () => {
      if (localStorage.getItem(CAT_KEY)) return;
      const elapsed = Date.now() - arrivalTime;
      let cat: string;

      if (!pageFullyLoaded) {
        cat = "canceled";
      } else if (hasBuyClicked() || sessionStorage.getItem(BOUGHT_KEY)) {
        cat = "buy_button_check";
      } else if (hasScrolled && elapsed >= 30000) {
        cat = "checked_it_well";
      } else if (hasScrolled) {
        cat = "did_check";
      } else {
        cat = "bot_activity";
      }

      localStorage.setItem(CAT_KEY, cat);
      trackBeacon(cat);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") fireCategory();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", fireCategory);
    window.addEventListener("beforeunload", fireCategory);

    return () => {
      window.removeEventListener("load", onPageLoad);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", fireCategory);
      window.removeEventListener("beforeunload", fireCategory);
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
    collapsibleSectionIds.forEach((id) => {
      if (collapseState.phase[id] !== "hold" || collapseHoldTimeoutRef.current[id]) {
        return;
      }

      collapseHoldTimeoutRef.current[id] = window.setTimeout(() => {
        collapseHoldTimeoutRef.current[id] = null;
        collapseFrameRef.current[id] = window.requestAnimationFrame(() => {
          collapseFrameRef.current[id] = null;
          setCollapseState((current) => {
            if (current.phase[id] !== "hold") {
              return current;
            }

            return {
              ...current,
              phase: { ...current.phase, [id]: "shrinking" },
            };
          });

          collapseTimeoutRef.current[id] = window.setTimeout(() => {
            collapseTimeoutRef.current[id] = null;
            setCollapseState((current) => {
              if (current.phase[id] !== "shrinking") {
                return current;
              }

              return {
                ...current,
                phase: { ...current.phase, [id]: "collapsed" },
              };
            });
            window.requestAnimationFrame(() => window.dispatchEvent(new Event("scroll")));
          }, COLLAPSE_SHRINK_MS);
        });
      }, COLLAPSE_HOLD_MS);
    });
  }, [collapseState.phase]);

  useEffect(() => {
    const holdTimeoutRef = collapseHoldTimeoutRef.current;
    const frameRef = collapseFrameRef.current;
    const timeoutRef = collapseTimeoutRef.current;

    return () => {
      collapsibleSectionIds.forEach((id) => {
        const holdTimeoutId = holdTimeoutRef[id];
        const frameId = frameRef[id];
        const timeoutId = timeoutRef[id];

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
    const updateCollapseProgress = () => {
      const scrollTop = window.scrollY;

      setCollapseState((current) => {
        let hasChanged = false;
        const nextProgress = { ...current.progress };
        const nextCollapsed = { ...current.collapsed };
        const nextHeights = { ...current.heights };
        const nextPhase = { ...current.phase };

        collapsibleSectionIds.forEach((id, index) => {
          const node = document.getElementById(id);
          if (!node) {
            return;
          }

          const sectionTop = node.offsetTop;
          const sectionHeight = Math.max(node.scrollHeight, node.offsetHeight, 1);
          const hasPassedSection = scrollTop >= sectionTop + sectionHeight;
          const previousSectionId = collapsibleSectionIds[index - 1];

          if (previousSectionId && current.phase[previousSectionId] !== "collapsed") {
            return;
          }

          if (current.collapsed[id] || hasPassedSection) {
            if (!current.collapsed[id]) {
              nextCollapsed[id] = true;
              nextHeights[id] = Math.max(sectionHeight, COLLAPSED_HEIGHT_PX);
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
          ? { progress: nextProgress, collapsed: nextCollapsed, heights: nextHeights, phase: nextPhase }
          : current;
      });
    };

    const requestUpdate = () => {
      if (collapseRafRef.current) {
        return;
      }

      collapseRafRef.current = window.requestAnimationFrame(() => {
        collapseRafRef.current = null;
        updateCollapseProgress();
      });
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (collapseRafRef.current) {
        window.cancelAnimationFrame(collapseRafRef.current);
        collapseRafRef.current = null;
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

  const activeCollapseSectionId: CollapsibleSectionId | null =
    collapseState.phase["section-messianic"] === "open" &&
    collapseState.progress["section-messianic"] > 0
      ? "section-messianic"
      : collapseState.phase["section-wall"] === "open" && collapseState.progress["section-wall"] > 0
        ? "section-wall"
        : null;
  const getCollapseStyle = (id: CollapsibleSectionId) => {
    const progress = collapseState.progress[id];
    const phase = collapseState.phase[id];
    const isActive = activeCollapseSectionId === id;
    const visualProgress = phase !== "open" ? 1 : isActive ? progress : 0;

    return {
      ["--hero-collapse-progress" as string]: visualProgress,
      ["--hero-collapse-placeholder-height" as string]: `${Math.max(
        collapseState.heights[id],
        COLLAPSED_HEIGHT_PX
      )}px`,
      ["--hero-collapse-cover-height" as string]: isActive
        ? `${Math.round(visualProgress * 1000) / 10}%`
        : "0%",
      ["--hero-collapse-content-opacity" as string]: Math.max(0, 1 - visualProgress),
      ["--hero-collapse-content-brightness" as string]: Math.max(0.58, 1 - visualProgress * 0.42),
      ["--hero-collapse-overlay-opacity" as string]: isActive
        ? Math.min(1, visualProgress * 1.35)
        : 0,
    };
  };
  const getCollapseClassName = (id: CollapsibleSectionId) => {
    const phase = collapseState.phase[id];
    return [
      "hero-collapse-section min-h-0",
      activeCollapseSectionId === id ? "hero-collapse-section--active" : "",
      phase !== "open" ? "hero-collapse-section--placeholder" : "",
      phase === "hold" ? "hero-collapse-section--hold" : "",
      phase === "shrinking" ? "hero-collapse-section--shrinking" : "",
      phase === "collapsed" ? "hero-collapse-section--collapsed" : "",
    ].filter(Boolean).join(" ");
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <section id="section-hero" className="md:min-h-[140vh] min-h-[98vh]">
        <FeatureThumbnails
          renderStructureSection={false}
          renderWallpaperSection
          entrySource={entrySource}
        />
      </section>
      <div className="divider-line hidden md:block" />
      <section
          id="section-messianic"
          className={getCollapseClassName("section-messianic")}
          style={getCollapseStyle("section-messianic")}
        >
          <MessianicSection />
        </section>
      <section
          id="section-wall"
          className={getCollapseClassName("section-wall")}
          style={getCollapseStyle("section-wall")}
        >
          <WallSection />
        </section>
      <section id="section-become" className="min-h-[78vh] md:min-h-[200vh]">
          <BecomingSection isBecomingYouActive={activeSectionId === "section-become"} />
        </section>
      <Suspense fallback={null}>
        <TransitionThreshold variant="crossing" />
      </Suspense>
      <section id="section-structure" className="min-h-0">
        <Suspense fallback={<SectionLoader minHeightClass="min-h-[60vh]" />}>
          <StructureSection />
        </Suspense>
      </section>
      <section id="section-vostok" className="min-h-[60vh]">
        <Suspense fallback={<SectionLoader minHeightClass="min-h-[60vh]" />}>
          <VostokProcess entrySource={entrySource} />
        </Suspense>
      </section>
      <section id="section-what-is-it" className="min-h-0">
        <Suspense fallback={null}>
          <WhatIsItSection />
        </Suspense>
      </section>
      <Suspense fallback={null}>
        <TransitionThreshold variant="chamber" />
      </Suspense>
      <section id="section-research" className="min-h-[50vh]">
          <Suspense fallback={<SectionLoader minHeightClass="min-h-[50vh]" />}>
            <ResearchStudies entrySource={entrySource} />
          </Suspense>
        </section>
      <Suspense fallback={null}>
        <TransitionThreshold variant="fracture" />
      </Suspense>
      <section id="section-cta" className="min-h-[40vh] md:min-h-[140vh]">
        <Suspense fallback={<SectionLoader minHeightClass="min-h-[40vh] md:min-h-[140vh]" />}>
          <CTAFooter onRequestBuy={handleRequestBuy} entrySource={entrySource} />
        </Suspense>
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
