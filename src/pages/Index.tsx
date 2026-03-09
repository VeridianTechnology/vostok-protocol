import HeroSection from "@/components/HeroSection";
import { LazySection } from "@/components/LazySection";
import { useEffect, useRef, useState, lazy } from "react";
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
  const [isFacebookEntry, setIsFacebookEntry] = useState(false);
  const [isFourChanEntry, setIsFourChanEntry] = useState(false);
  const [isInstagramEntry, setIsInstagramEntry] = useState(false);
  const [isTikTokEntry, setIsTikTokEntry] = useState(false);
  const [isRedditEntry, setIsRedditEntry] = useState(false);
  const [isTwitterEntry, setIsTwitterEntry] = useState(false);
  const stayTimerRef = useRef<number | null>(null);
  const stay60TimerRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
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
    const targets: Array<{ id: string; event: string }> = [
      { id: "section-hero", event: "section_hero_view" },
      { id: "section-vostok", event: "section_vostok_view" },
      { id: "section-change-face", event: "section_change_face_view" },
      { id: "section-research", event: "section_research_view" },
      { id: "section-chapter", event: "section_chapter_view" },
      { id: "section-quote", event: "section_quote_view" },
      { id: "section-video", event: "section_video_view" },
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

  const handleRequestBuy = (continueToCheckout: () => void) => {
    continueToCheckout();
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <div id="section-hero">
          <HeroSection
            hideWatchPrompt={isVideoClosed}
            onMobileFlashComplete={() => {
              trackOnce("hero_flash_complete");
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
      <LazySection id="section-vostok" minHeightClass="min-h-[40vh]">
        <VostokProcess
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
      </LazySection>
      <div className="divider-line" />
      <LazySection id="section-change-face" minHeightClass="min-h-[60vh]">
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
      </LazySection>
      <LazySection id="section-research" minHeightClass="min-h-[50vh]">
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
      </LazySection>
      <LazySection id="section-chapter" minHeightClass="min-h-[50vh]">
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
      </LazySection>
      <div className="h-1 w-full bg-black/80" />
      <LazySection id="section-quote" minHeightClass="min-h-[20vh]">
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
      </LazySection>
      <div className="h-1 w-full bg-black/80" />
      <LazySection id="section-video" minHeightClass="min-h-[50vh]">
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
      </LazySection>
      <div className="divider-line" />
      <LazySection id="section-cta" minHeightClass="min-h-[40vh]">
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
      </LazySection>
    </main>
  );
};

export default Index;
