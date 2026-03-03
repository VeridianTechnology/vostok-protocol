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
  const [canLoadBelowFold, setCanLoadBelowFold] = useState(true);
  const stayTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMatch = () => {
      const mobile = mediaQuery.matches;
      setIsMobile(mobile);
      setCanLoadBelowFold(!mobile);
    };
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  useEffect(() => {
    if (!isMobile || canLoadBelowFold) {
      return;
    }
    const fallbackTimeout = window.setTimeout(() => {
      setCanLoadBelowFold(true);
    }, 2000);
    return () => window.clearTimeout(fallbackTimeout);
  }, [isMobile, canLoadBelowFold]);

  useEffect(() => {
    stayTimerRef.current = window.setTimeout(() => {
      track("stay_30s");
    }, 30000);

    return () => {
      if (stayTimerRef.current) {
        window.clearTimeout(stayTimerRef.current);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection
        hideWatchPrompt={isVideoClosed}
        onMobileFlashComplete={() => setCanLoadBelowFold(true)}
      />
      <div className="divider-line" />
      {canLoadBelowFold ? (
        <Suspense fallback={<div className="min-h-[40vh]" />}>
          <VostokProcess />
        </Suspense>
      ) : (
        <div className="min-h-[40vh]" />
      )}
      <div className="divider-line" />
      {canLoadBelowFold ? (
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <FeatureThumbnails />
        </Suspense>
      ) : (
        <div className="min-h-[60vh]" />
      )}
      {canLoadBelowFold ? (
        <Suspense fallback={<div className="min-h-[50vh]" />}>
          <ResearchStudies />
        </Suspense>
      ) : (
        <div className="min-h-[50vh]" />
      )}
      {canLoadBelowFold ? (
        <Suspense fallback={<div className="min-h-[20vh]" />}>
          <QuoteSection />
        </Suspense>
      ) : (
        <div className="min-h-[20vh]" />
      )}
      {canLoadBelowFold ? (
        <Suspense fallback={<div className="min-h-[50vh]" />}>
          <SpecComparison />
        </Suspense>
      ) : (
        <div className="min-h-[50vh]" />
      )}
      {canLoadBelowFold ? (
        <Suspense fallback={<div className="min-h-[50vh]" />}>
          <VideoSection onClosed={() => setIsVideoClosed(true)} />
        </Suspense>
      ) : (
        <div className="min-h-[50vh]" />
      )}
      <div className="divider-line" />
      {canLoadBelowFold ? (
        <Suspense fallback={<div className="min-h-[40vh]" />}>
          <CTAFooter />
        </Suspense>
      ) : (
        <div className="min-h-[40vh]" />
      )}
    </main>
  );
};

export default Index;
