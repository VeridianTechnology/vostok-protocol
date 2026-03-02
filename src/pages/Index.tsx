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
  const stayTimerRef = useRef<number | null>(null);

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
      <HeroSection hideWatchPrompt={isVideoClosed} />
      <div className="divider-line" />
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <VostokProcess />
      </Suspense>
      <div className="divider-line" />
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <FeatureThumbnails />
      </Suspense>
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <ResearchStudies />
      </Suspense>
      <Suspense fallback={<div className="min-h-[20vh]" />}>
        <QuoteSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <SpecComparison />
      </Suspense>
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <VideoSection onClosed={() => setIsVideoClosed(true)} />
      </Suspense>
      <div className="divider-line" />
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <CTAFooter />
      </Suspense>
    </main>
  );
};

export default Index;
