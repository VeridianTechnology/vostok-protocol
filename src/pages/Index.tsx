import { useEffect, useRef, useState, lazy } from "react";
import { createPortal } from "react-dom";
import FeatureThumbnails from "@/components/FeatureThumbnails";
const PremiumLifestyleSection = lazy(() => import("@/components/PremiumLifestyleSection"));
const ResearchStudies = lazy(() => import("@/components/ResearchStudies"));
const VostokProcess = lazy(() => import("@/components/VostokProcess"));
const CTAFooter = lazy(() => import("@/components/CTAFooter"));
import { track } from "@vercel/analytics";
import { trackOnce } from "@/lib/analytics";

const orderedSectionIds = [
  "section-hero",
  "section-messianic",
  "section-wall",
  "section-become",
  "section-vostok",
  "section-research",
  "section-cta",
] as const;

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
  const systemGlitchCopyTimeoutRef = useRef<number | null>(null);
  const systemGlitchDoTimeoutRef = useRef<number | null>(null);
  const systemGlitchSystemTimeoutRef = useRef<number | null>(null);
  const systemGlitchClearTimeoutRef = useRef<number | null>(null);
  const activeSectionIdRef = useRef<(typeof orderedSectionIds)[number]>("section-hero");
  const visibleSectionsRef = useRef<Map<string, number>>(new Map());

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
      <section id="section-messianic" className="min-h-[108vh] md:min-h-[140vh]">
        <PremiumLifestyleSection
          visibleSections={["messianic"]}
          messianicSectionId={undefined}
        />
      </section>
      <section id="section-wall" className="min-h-[94vh] md:min-h-[140vh]">
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
      <div className="divider-line" />
      <section id="section-vostok" className="min-h-[40vh]">
        <VostokProcess entrySource={entrySource} />
      </section>
      <section id="section-research" className="min-h-[50vh]">
        <ResearchStudies entrySource={entrySource} />
      </section>
      <div className="h-px w-full bg-black/80" />
      <section id="section-cta" className="min-h-[40vh]">
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
