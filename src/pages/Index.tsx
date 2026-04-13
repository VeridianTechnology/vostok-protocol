import { LazySection } from "@/components/LazySection";
import { useEffect, useRef, useState, lazy } from "react";
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

const PREVIOUS_SECTION_GRACE_MS = 1400;

const Index = () => {
  const [isFacebookEntry, setIsFacebookEntry] = useState(false);
  const [isFourChanEntry, setIsFourChanEntry] = useState(false);
  const [isInstagramEntry, setIsInstagramEntry] = useState(false);
  const [isTikTokEntry, setIsTikTokEntry] = useState(false);
  const [isRedditEntry, setIsRedditEntry] = useState(false);
  const [isTwitterEntry, setIsTwitterEntry] = useState(false);
  const [activeSectionId, setActiveSectionId] =
    useState<(typeof orderedSectionIds)[number]>("section-hero");
  const [graceSectionId, setGraceSectionId] =
    useState<(typeof orderedSectionIds)[number] | null>(null);
  const stayTimerRef = useRef<number | null>(null);
  const stay60TimerRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const previousSectionGraceTimeoutRef = useRef<number | null>(null);
  const activeSectionIdRef = useRef<(typeof orderedSectionIds)[number]>("section-hero");
  const visibleSectionsRef = useRef<Map<string, number>>(new Map());
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
      if (previousSectionGraceTimeoutRef.current) {
        window.clearTimeout(previousSectionGraceTimeoutRef.current);
      }
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
          if (previousSectionGraceTimeoutRef.current) {
            window.clearTimeout(previousSectionGraceTimeoutRef.current);
            previousSectionGraceTimeoutRef.current = null;
          }
          const previousActiveSectionId = activeSectionIdRef.current;
          setGraceSectionId(previousActiveSectionId);
          previousSectionGraceTimeoutRef.current = window.setTimeout(() => {
            setGraceSectionId((currentGraceSectionId) =>
              currentGraceSectionId === previousActiveSectionId ? null : currentGraceSectionId
            );
            previousSectionGraceTimeoutRef.current = null;
          }, PREVIOUS_SECTION_GRACE_MS);
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

    const desktopQuery = window.matchMedia("(min-width: 768px)");
    let observer: IntersectionObserver | null = null;
    const seenIds = new Set<string>();
    const glitchTargets: Array<{
      id: string;
      word: "КОПИРОВАТЬ" | "ДЕЛАЙ" | "СБОЙ СИСТЕМЫ";
    }> = [
      { id: "section-hero", word: "КОПИРОВАТЬ" },
      { id: "section-messianic", word: "ДЕЛАЙ" },
      { id: "section-wall", word: "СБОЙ СИСТЕМЫ" },
    ];

    const connectObserver = () => {
      observer?.disconnect();
      observer = null;

      if (!desktopQuery.matches) {
        return;
      }

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
        { threshold: 0.55 }
      );

      glitchTargets.forEach(({ id }) => {
        const node = document.getElementById(id);
        if (node && !seenIds.has(id)) {
          observer?.observe(node);
        }
      });
    };

    connectObserver();
    desktopQuery.addEventListener("change", connectObserver);

    return () => {
      desktopQuery.removeEventListener("change", connectObserver);
      observer?.disconnect();
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
  const activeSectionIndex = orderedSectionIds.indexOf(activeSectionId);
  const shouldRenderSection = (id: (typeof orderedSectionIds)[number]) => {
    const sectionIndex = orderedSectionIds.indexOf(id);
    return (
      id === activeSectionId ||
      sectionIndex === activeSectionIndex + 1 ||
      id === graceSectionId
    );
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <section id="section-hero" className="min-h-[108vh] md:min-h-[112vh]">
        {shouldRenderSection("section-hero") ? (
          <FeatureThumbnails
            renderStructureSection={false}
            renderWallpaperSection
            entrySource={entrySource}
          />
        ) : null}
      </section>
      <div className="divider-line hidden md:block" />
      <LazySection
        id="section-messianic"
        minHeightClass="min-h-[108vh] md:min-h-[112vh]"
        loaderLabel="Loading Lifestyle"
        shouldRender={shouldRenderSection("section-messianic")}
      >
        <PremiumLifestyleSection
          visibleSections={["messianic"]}
          messianicSectionId={undefined}
        />
      </LazySection>
      <LazySection
        id="section-wall"
        minHeightClass="min-h-[108vh] md:min-h-[112vh]"
        loaderLabel="Loading Wall"
        shouldRender={shouldRenderSection("section-wall")}
      >
        <PremiumLifestyleSection
          visibleSections={["wall"]}
          wallSectionId={undefined}
        />
      </LazySection>
      <LazySection
        id="section-become"
        minHeightClass="min-h-[78vh] md:min-h-[200vh]"
        loaderLabel="Loading Become"
        shouldRender={shouldRenderSection("section-become")}
      >
        <PremiumLifestyleSection
          visibleSections={["becoming"]}
          becomingSectionId={undefined}
          isBecomingYouActive={activeSectionId === "section-become"}
        />
      </LazySection>
      <div className="divider-line" />
      <LazySection
        id="section-vostok"
        minHeightClass="min-h-[40vh]"
        loaderLabel="Loading Process"
        shouldRender={shouldRenderSection("section-vostok")}
      >
        <VostokProcess entrySource={entrySource} />
      </LazySection>
      <LazySection
        id="section-research"
        minHeightClass="min-h-[50vh]"
        loaderLabel="Loading Research"
        shouldRender={shouldRenderSection("section-research")}
      >
        <ResearchStudies entrySource={entrySource} />
      </LazySection>
      <div className="h-px w-full bg-black/80" />
      <LazySection
        id="section-cta"
        minHeightClass="min-h-[40vh]"
        loaderLabel="Loading Checkout"
        shouldRender={shouldRenderSection("section-cta")}
      >
        <CTAFooter onRequestBuy={handleRequestBuy} entrySource={entrySource} />
      </LazySection>
    </main>
  );
};

export default Index;
