import HeroSection from "@/components/HeroSection";
import SectionLoader from "@/components/SectionLoader";
import { getImageVariants } from "@/lib/utils";
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

type ImageFormat = "avif" | "webp" | "jpg";

const HERO_IMAGES = [
  "/images/1.jpg",
  "/images/2.png",
  "/images/4.jpg",
  "/images/3.jpeg",
  "/images/8.jpg",
  "/images/7.jpg",
  "/images/5.jpg",
  "/images/6.jpg",
  "/images/12.jpg",
  "/images/14.jpg",
  "/images/13.jpg",
  "/images/15.jpg",
];
const HERO_VIDEOS = ["/hero_section_videos/1.mp4", "/hero_section_videos/2.mp4"];

const VOSTOK_IMAGES = [
  "/Comparison/3z.jpg",
  "/Comparison/4z.jpg",
  "/Comparison/5z.jpg",
  "/Comparison/6z.jpg",
  "/Comparison/9z.jpg",
  "/Comparison/10z.jpg",
  "/Comparison/8z.jpg",
  "/Comparison/7z.jpg",
  "/Comparison/1z.jpg",
  "/Comparison/2z.jpg",
];

const FEATURE_STRUCTURE_IMAGES = Array.from({ length: 7 }, (_, index) => {
  return `/images/structure/${index + 1}.jpg`;
});
const FEATURE_HIGHLIGHT_IMAGES = Array.from({ length: 6 }, (_, index) => {
  return `/images/structure/highlight/${index + 1}.jpg`;
});
const FEATURE_ANGLE_IMAGES = Array.from({ length: 6 }, (_, index) => {
  return `/images/structure/45/${index + 1}.jpg`;
});
const FEATURE_ICON_IMAGES = [
  "/images/structure/icons/2.jpg",
  "/images/structure/icons/3.jpg",
  "/images/structure/icons/4.jpg",
  "/images/structure/icons/5.jpg",
  "/images/structure/icons/6.jpg",
  "/images/structure/icons/7.jpg",
];

const SPEC_PREVIEW_IMAGES = ["/Sections/1.jpg", "/Sections/1_page-0001.jpg"];
const VIDEO_POSTER_IMAGES = ["/1.jpg"];
const CTA_IMAGES = ["/gumroad.png", "/logo.png"];

const getThumbVariants = (src: string) => {
  if (!src.endsWith(".jpg") && !src.endsWith(".jpeg")) {
    return null;
  }
  const match = src.match(/(\.jpe?g)$/i);
  if (!match) {
    return null;
  }
  const ext = match[1];
  const base = src.slice(0, -ext.length);
  return {
    mobile: {
      jpg: `${base}_thumb_mobile${ext}`,
      avif: `${base}_thumb_mobile.avif`,
      webp: `${base}_thumb_mobile.webp`,
    },
  };
};

const resolveImageSource = (src: string, format: ImageFormat) => {
  const variants = getImageVariants(src);
  if (!variants) {
    return src;
  }
  if (format === "avif") {
    return variants.avif.mobile;
  }
  if (format === "webp") {
    return variants.webp.mobile;
  }
  return variants.mobile;
};

const resolveThumbSource = (src: string, format: ImageFormat) => {
  const variants = getThumbVariants(src);
  if (!variants) {
    return src;
  }
  if (format === "avif") {
    return variants.mobile.avif;
  }
  if (format === "webp") {
    return variants.mobile.webp;
  }
  return variants.mobile.jpg;
};

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });

const preloadVideoMetadata = (src: string) =>
  new Promise<void>((resolve) => {
    const video = document.createElement("video");
    const settle = () => resolve();
    video.preload = "metadata";
    video.onloadedmetadata = settle;
    video.onerror = settle;
    video.src = src;
    video.load();
  });

const detectPreferredImageFormat = (): ImageFormat => {
  try {
    const canvas = document.createElement("canvas");
    if (canvas.toDataURL("image/avif").startsWith("data:image/avif")) {
      return "avif";
    }
    if (canvas.toDataURL("image/webp").startsWith("data:image/webp")) {
      return "webp";
    }
  } catch {
    return "jpg";
  }
  return "jpg";
};

const Index = () => {
  const [isVideoClosed, setIsVideoClosed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imageFormat, setImageFormat] = useState<ImageFormat>("jpg");
  const [isFormatReady, setIsFormatReady] = useState(true);
  const [heroAssetsReady, setHeroAssetsReady] = useState(true);
  const [heroFlashComplete, setHeroFlashComplete] = useState(true);
  const [vostokAssetsReady, setVostokAssetsReady] = useState(true);
  const [featureAssetsReady, setFeatureAssetsReady] = useState(true);
  const [researchAssetsReady, setResearchAssetsReady] = useState(true);
  const [chapterAssetsReady, setChapterAssetsReady] = useState(true);
  const [quoteAssetsReady, setQuoteAssetsReady] = useState(true);
  const [videoAssetsReady, setVideoAssetsReady] = useState(true);
  const [ctaAssetsReady, setCtaAssetsReady] = useState(true);
  const [isFacebookEntry, setIsFacebookEntry] = useState(false);
  const [isFourChanEntry, setIsFourChanEntry] = useState(false);
  const [isInstagramEntry, setIsInstagramEntry] = useState(false);
  const [isTikTokEntry, setIsTikTokEntry] = useState(false);
  const [isRedditEntry, setIsRedditEntry] = useState(false);
  const [isTwitterEntry, setIsTwitterEntry] = useState(false);
  const stayTimerRef = useRef<number | null>(null);
  const stay60TimerRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const vostokRef = useRef<HTMLDivElement | null>(null);
  const changeFaceRef = useRef<HTMLDivElement | null>(null);
  const researchRef = useRef<HTMLDivElement | null>(null);
  const chapterRef = useRef<HTMLDivElement | null>(null);
  const quoteRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  const resetLoadState = (mobile: boolean) => {
    if (!mobile) {
      setImageFormat("jpg");
      setIsFormatReady(true);
      setHeroAssetsReady(true);
      setHeroFlashComplete(true);
      setVostokAssetsReady(true);
      setFeatureAssetsReady(true);
      setResearchAssetsReady(true);
      setChapterAssetsReady(true);
      setQuoteAssetsReady(true);
      setVideoAssetsReady(true);
      setCtaAssetsReady(true);
      return;
    }
    setIsFormatReady(false);
    setHeroAssetsReady(false);
    setHeroFlashComplete(false);
    setVostokAssetsReady(false);
    setFeatureAssetsReady(false);
    setResearchAssetsReady(false);
    setChapterAssetsReady(false);
    setQuoteAssetsReady(false);
    setVideoAssetsReady(false);
    setCtaAssetsReady(false);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMatch = () => {
      const mobile = mediaQuery.matches;
      setIsMobile(mobile);
      resetLoadState(mobile);
    };
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      return;
    }
    setImageFormat(detectPreferredImageFormat());
    setIsFormatReady(true);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !isFormatReady || heroAssetsReady) {
      return;
    }
    let isActive = true;
    const preload = async () => {
      const imageSources = HERO_IMAGES.map((src) => resolveImageSource(src, imageFormat));
      const imagePromises = imageSources.map(preloadImage);
      const videoPromises = HERO_VIDEOS.map(preloadVideoMetadata);
      await Promise.all([...imagePromises, ...videoPromises]);
      if (isActive) {
        setHeroAssetsReady(true);
      }
    };
    preload();
    return () => {
      isActive = false;
    };
  }, [isMobile, isFormatReady, heroAssetsReady, imageFormat]);

  useEffect(() => {
    if (!isMobile || !isFormatReady || !heroFlashComplete || vostokAssetsReady) {
      return;
    }
    let isActive = true;
    const preload = async () => {
      const baseImages = VOSTOK_IMAGES.map((src) => resolveImageSource(src, imageFormat));
      const thumbImages = VOSTOK_IMAGES.map((src) => resolveThumbSource(src, imageFormat));
      const uniqueImages = Array.from(new Set([...baseImages, ...thumbImages]));
      await Promise.all(uniqueImages.map(preloadImage));
      if (isActive) {
        setVostokAssetsReady(true);
      }
    };
    preload();
    return () => {
      isActive = false;
    };
  }, [isMobile, isFormatReady, heroFlashComplete, vostokAssetsReady, imageFormat]);

  useEffect(() => {
    if (!isMobile || !isFormatReady || !vostokAssetsReady || featureAssetsReady) {
      return;
    }
    let isActive = true;
    const preload = async () => {
      const structureImages = FEATURE_STRUCTURE_IMAGES.map((src) =>
        resolveImageSource(src, imageFormat)
      );
      const highlightImages = FEATURE_HIGHLIGHT_IMAGES.map((src) =>
        resolveImageSource(src, imageFormat)
      );
      const angleImages = FEATURE_ANGLE_IMAGES.map((src) =>
        resolveImageSource(src, imageFormat)
      );
      const iconImages = FEATURE_ICON_IMAGES.map((src) => resolveThumbSource(src, imageFormat));
      const uniqueImages = Array.from(
        new Set([...structureImages, ...highlightImages, ...angleImages, ...iconImages])
      );
      await Promise.all(uniqueImages.map(preloadImage));
      if (isActive) {
        setFeatureAssetsReady(true);
      }
    };
    preload();
    return () => {
      isActive = false;
    };
  }, [isMobile, isFormatReady, vostokAssetsReady, featureAssetsReady, imageFormat]);

  useEffect(() => {
    if (!isMobile || !featureAssetsReady || researchAssetsReady) {
      return;
    }
    setResearchAssetsReady(true);
  }, [isMobile, featureAssetsReady, researchAssetsReady]);

  useEffect(() => {
    if (!isMobile || !isFormatReady || !researchAssetsReady || chapterAssetsReady) {
      return;
    }
    let isActive = true;
    const preload = async () => {
      const previewImages = SPEC_PREVIEW_IMAGES.map((src) =>
        resolveImageSource(src, imageFormat)
      );
      await Promise.all(previewImages.map(preloadImage));
      if (isActive) {
        setChapterAssetsReady(true);
      }
    };
    preload();
    return () => {
      isActive = false;
    };
  }, [isMobile, isFormatReady, researchAssetsReady, chapterAssetsReady, imageFormat]);

  useEffect(() => {
    if (!isMobile || !chapterAssetsReady || quoteAssetsReady) {
      return;
    }
    setQuoteAssetsReady(true);
  }, [isMobile, chapterAssetsReady, quoteAssetsReady]);

  useEffect(() => {
    if (!isMobile || !isFormatReady || !quoteAssetsReady || videoAssetsReady) {
      return;
    }
    let isActive = true;
    const preload = async () => {
      const posterImages = VIDEO_POSTER_IMAGES.map((src) => resolveImageSource(src, imageFormat));
      await Promise.all(posterImages.map(preloadImage));
      if (isActive) {
        setVideoAssetsReady(true);
      }
    };
    preload();
    return () => {
      isActive = false;
    };
  }, [isMobile, isFormatReady, quoteAssetsReady, videoAssetsReady, imageFormat]);

  useEffect(() => {
    if (!isMobile || !videoAssetsReady || ctaAssetsReady) {
      return;
    }
    let isActive = true;
    const preload = async () => {
      await Promise.all(CTA_IMAGES.map(preloadImage));
      if (isActive) {
        setCtaAssetsReady(true);
      }
    };
    preload();
    return () => {
      isActive = false;
    };
  }, [isMobile, videoAssetsReady, ctaAssetsReady]);

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
    vostokAssetsReady,
    featureAssetsReady,
    researchAssetsReady,
    chapterAssetsReady,
    quoteAssetsReady,
    videoAssetsReady,
    ctaAssetsReady,
  ]);

  const handleRequestBuy = (continueToCheckout: () => void) => {
    continueToCheckout();
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <div ref={heroRef}>
        {isMobile && !heroAssetsReady ? (
          <SectionLoader label="Loading" minHeightClass="min-h-[70vh]" />
        ) : (
          <HeroSection
            hideWatchPrompt={isVideoClosed}
            onMobileFlashComplete={() => {
              trackOnce("hero_flash_complete");
              setHeroFlashComplete(true);
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
        )}
      </div>
      <div className="divider-line hidden md:block" />
      {vostokAssetsReady ? (
        <Suspense
          fallback={<SectionLoader label="Loading" minHeightClass="min-h-[40vh]" />}
        >
          <div ref={vostokRef}>
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
          </div>
        </Suspense>
      ) : (
        <SectionLoader label="Loading" minHeightClass="min-h-[40vh]" />
      )}
      <div className="divider-line" />
      {featureAssetsReady ? (
        <Suspense fallback={<SectionLoader label="Loading" minHeightClass="min-h-[60vh]" />}>
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
        <SectionLoader label="Loading" minHeightClass="min-h-[60vh]" />
      )}
      {researchAssetsReady ? (
        <Suspense fallback={<SectionLoader label="Loading" minHeightClass="min-h-[50vh]" />}>
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
        <SectionLoader label="Loading" minHeightClass="min-h-[50vh]" />
      )}
      {chapterAssetsReady ? (
        <Suspense fallback={<SectionLoader label="Loading" minHeightClass="min-h-[50vh]" />}>
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
        <SectionLoader label="Loading" minHeightClass="min-h-[50vh]" />
      )}
      <div className="h-1 w-full bg-black/80" />
      {quoteAssetsReady ? (
        <Suspense fallback={<SectionLoader label="Loading" minHeightClass="min-h-[20vh]" />}>
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
        <SectionLoader label="Loading" minHeightClass="min-h-[20vh]" />
      )}
      <div className="h-1 w-full bg-black/80" />
      {videoAssetsReady ? (
        <Suspense fallback={<SectionLoader label="Loading" minHeightClass="min-h-[50vh]" />}>
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
        <SectionLoader label="Loading" minHeightClass="min-h-[50vh]" />
      )}
      <div className="divider-line" />
      {ctaAssetsReady ? (
        <Suspense fallback={<SectionLoader label="Loading" minHeightClass="min-h-[40vh]" />}>
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
        <SectionLoader label="Loading" minHeightClass="min-h-[40vh]" />
      )}
    </main>
  );
};

export default Index;
