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
  const stayTimerRef = useRef<number | null>(null);
  const loadTimersRef = useRef<number[]>([]);
  const hasScheduledLoadRef = useRef(false);

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
    }, 30000);

    return () => {
      if (stayTimerRef.current) {
        window.clearTimeout(stayTimerRef.current);
      }
    };
  }, []);

  const handleRequestBuy = (continueToCheckout: () => void) => {
    continueToCheckout();
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection
        hideWatchPrompt={isVideoClosed}
        onMobileFlashComplete={scheduleMobileLoad}
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
                : "direct"
        }
      />
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
                      : "direct"
            }
          />
        </Suspense>
      ) : (
        <div className="min-h-[40vh]" />
      )}
      <div className="divider-line" />
      {loadChangeYourFace ? (
        <Suspense fallback={<div className="min-h-[60vh]" />}>
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
                      : "direct"
            }
          />
        </Suspense>
      ) : (
        <div className="min-h-[60vh]" />
      )}
      {loadResearch ? (
        <Suspense fallback={<div className="min-h-[50vh]" />}>
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
                      : "direct"
            }
          />
        </Suspense>
      ) : (
        <div className="min-h-[50vh]" />
      )}
      {loadRest ? (
        <Suspense fallback={<div className="min-h-[20vh]" />}>
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
                      : "direct"
            }
          />
        </Suspense>
      ) : (
        <div className="min-h-[20vh]" />
      )}
      {loadChapterPreview ? (
        <Suspense fallback={<div className="min-h-[50vh]" />}>
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
                      : "direct"
            }
          />
        </Suspense>
      ) : (
        <div className="min-h-[50vh]" />
      )}
      {loadRest ? (
        <Suspense fallback={<div className="min-h-[50vh]" />}>
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
                    : "direct"
            }
          />
        </Suspense>
      ) : (
        <div className="min-h-[50vh]" />
      )}
      <div className="divider-line" />
      {loadRest ? (
        <Suspense fallback={<div className="min-h-[40vh]" />}>
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
                    : "direct"
            }
          />
        </Suspense>
      ) : (
        <div className="min-h-[40vh]" />
      )}
    </main>
  );
};

export default Index;
