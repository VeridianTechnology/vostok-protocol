import HeroSection from "@/components/HeroSection";
import { Suspense, useEffect, useRef, useState, lazy } from "react";
const VideoSection = lazy(() => import("@/components/VideoSection"));
const FeatureThumbnails = lazy(() => import("@/components/FeatureThumbnails"));
const ResearchStudies = lazy(() => import("@/components/ResearchStudies"));
const QuoteSection = lazy(() => import("@/components/QuoteSection"));
const SpecComparison = lazy(() => import("@/components/SpecComparison"));
const VostokProcess = lazy(() => import("@/components/VostokProcess"));
const CTAFooter = lazy(() => import("@/components/CTAFooter"));
import { track } from "@vercel/analytics";
import { trackOnce } from "@/lib/analytics";

const Index = () => {
  const [isVideoClosed, setIsVideoClosed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadVostokProcess, setLoadVostokProcess] = useState(true);
  const [loadChangeYourFace, setLoadChangeYourFace] = useState(true);
  const [loadResearch, setLoadResearch] = useState(true);
  const [loadChapterPreview, setLoadChapterPreview] = useState(true);
  const [loadRest, setLoadRest] = useState(true);
  const [hasVostokLoaded, setHasVostokLoaded] = useState(false);
  const [isFacebookEntry, setIsFacebookEntry] = useState(false);
  const [isFourChanEntry, setIsFourChanEntry] = useState(false);
  const [isInstagramEntry, setIsInstagramEntry] = useState(false);
  const [isTikTokEntry, setIsTikTokEntry] = useState(false);
  const [isRedditEntry, setIsRedditEntry] = useState(false);
  const [isTwitterEntry, setIsTwitterEntry] = useState(false);
  const stayTimerRef = useRef<number | null>(null);
  const stay60TimerRef = useRef<number | null>(null);
  const loadTimersRef = useRef<number[]>([]);
  const hasScheduledLoadRef = useRef(false);
  const scrollRafRef = useRef<number | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const vostokRef = useRef<HTMLDivElement | null>(null);
  const changeFaceRef = useRef<HTMLDivElement | null>(null);
  const researchRef = useRef<HTMLDivElement | null>(null);
  const chapterRef = useRef<HTMLDivElement | null>(null);
  const quoteRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMatch = () => {
      const mobile = mediaQuery.matches;
      setIsMobile(mobile);
      setLoadVostokProcess(true);
      setLoadChangeYourFace(!mobile);
      setLoadResearch(!mobile);
      setLoadChapterPreview(!mobile);
      setLoadRest(!mobile);
      setHasVostokLoaded(!mobile);
      hasScheduledLoadRef.current = false;
      loadTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      loadTimersRef.current = [];
    };
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  const scheduleMobileLoad = () => {
    if (!isMobile || !hasVostokLoaded || hasScheduledLoadRef.current) {
      return;
    }
    hasScheduledLoadRef.current = true;
    const timers = [
      window.setTimeout(() => setLoadChangeYourFace(true), 2000),
      window.setTimeout(() => setLoadResearch(true), 3000),
      window.setTimeout(() => setLoadChapterPreview(true), 4000),
      window.setTimeout(() => setLoadRest(true), 5000),
    ];
    loadTimersRef.current = timers;
  };

  useEffect(() => {
    if (!isMobile) {
      return;
    }
    if (hasVostokLoaded) {
      scheduleMobileLoad();
    }
    return () => {
      loadTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      loadTimersRef.current = [];
      hasScheduledLoadRef.current = false;
    };
  }, [isMobile, hasVostokLoaded]);

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
    const targets: Array<{ ref: React.RefObject<HTMLDivElement>; event: string }> = [
      { ref: heroRef, event: "section_hero_view" },
      { ref: vostokRef, event: "section_vostok_view" },
      { ref: changeFaceRef, event: "section_change_face_view" },
      { ref: researchRef, event: "section_research_view" },
      { ref: chapterRef, event: "section_chapter_view" },
      { ref: quoteRef, event: "section_quote_view" },
      { ref: videoRef, event: "section_video_view" },
      { ref: ctaRef, event: "section_cta_view" },
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = targets.find((item) => item.ref.current === entry.target);
            if (match) {
              trackOnce(match.event);
            }
          }
        });
      },
      { threshold: 0.4 }
    );
    targets.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    return () => observer.disconnect();
  }, [
    loadVostokProcess,
    loadChangeYourFace,
    loadResearch,
    loadChapterPreview,
    loadRest,
  ]);

  const handleRequestBuy = (continueToCheckout: () => void) => {
    continueToCheckout();
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <div ref={heroRef}>
        <HeroSection
          hideWatchPrompt={isVideoClosed}
          onMobileFlashComplete={() => {
            trackOnce("hero_flash_complete");
            scheduleMobileLoad();
          }}
          onRequestBuy={handleRequestBuy}
          entrySource={
            isFacebookEntry
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
                      : "direct"
          }
        />
      </div>
      <div className="divider-line hidden md:block" />
      {loadVostokProcess ? (
        <Suspense
          fallback={
            <div className="flex min-h-[40vh] items-center justify-center bg-white text-black/70">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em]">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                <span>Loading...</span>
              </div>
            </div>
          }
        >
          <div ref={vostokRef}>
            <VostokProcess
              onLoaded={() => {
                if (!hasVostokLoaded) {
                  setHasVostokLoaded(true);
                }
              }}
              entrySource={
                isFacebookEntry
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
                          : "direct"
              }
            />
          </div>
        </Suspense>
      ) : (
        <div className="min-h-[40vh]" />
      )}
      <div className="divider-line" />
      {loadChangeYourFace ? (
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <div ref={changeFaceRef}>
            <FeatureThumbnails
              entrySource={
                isFacebookEntry
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
                          : "direct"
              }
            />
          </div>
        </Suspense>
      ) : (
        <div className="min-h-[60vh]" />
      )}
      {loadResearch ? (
        <Suspense fallback={<div className="min-h-[50vh]" />}>
          <div ref={researchRef}>
            <ResearchStudies
              entrySource={
                isFacebookEntry
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
                          : "direct"
              }
            />
          </div>
        </Suspense>
      ) : (
        <div className="min-h-[50vh]" />
      )}
      {loadChapterPreview ? (
        <Suspense fallback={<div className="min-h-[50vh]" />}>
          <div ref={chapterRef}>
            <SpecComparison
              entrySource={
                isFacebookEntry
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
                          : "direct"
              }
            />
          </div>
        </Suspense>
      ) : (
        <div className="min-h-[50vh]" />
      )}
      <div className="h-1 w-full bg-black/80" />
      {loadRest ? (
        <Suspense fallback={<div className="min-h-[20vh]" />}>
          <div ref={quoteRef}>
            <QuoteSection
              entrySource={
                isFacebookEntry
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
                          : "direct"
              }
            />
          </div>
        </Suspense>
      ) : (
        <div className="min-h-[20vh]" />
      )}
      <div className="h-1 w-full bg-black/80" />
      {loadRest ? (
        <Suspense fallback={<div className="min-h-[50vh]" />}>
          <div ref={videoRef}>
            <VideoSection
              onClosed={() => setIsVideoClosed(true)}
              entrySource={
                isFacebookEntry
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
                          : "direct"
              }
            />
          </div>
        </Suspense>
      ) : (
        <div className="min-h-[50vh]" />
      )}
      <div className="divider-line" />
      {loadRest ? (
        <Suspense fallback={<div className="min-h-[40vh]" />}>
          <div ref={ctaRef}>
            <CTAFooter
              onRequestBuy={handleRequestBuy}
              entrySource={
                isFacebookEntry
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
                          : "direct"
              }
            />
          </div>
        </Suspense>
      ) : (
        <div className="min-h-[40vh]" />
      )}
    </main>
  );
};

export default Index;
