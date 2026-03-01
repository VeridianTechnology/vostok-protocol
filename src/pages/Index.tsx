import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import FeatureThumbnails from "@/components/FeatureThumbnails";
import QuoteSection from "@/components/QuoteSection";
import SpecComparison from "@/components/SpecComparison";
import VostokProcess from "@/components/VostokProcess";
import CTAFooter from "@/components/CTAFooter";
import { useState } from "react";

const Index = () => {
  const [isVideoClosed, setIsVideoClosed] = useState(false);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection hideWatchPrompt={isVideoClosed} />
      <VideoSection onClosed={() => setIsVideoClosed(true)} />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-chrome/50 to-transparent" />
      <VostokProcess />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-chrome/50 to-transparent" />
      <FeatureThumbnails />
      <QuoteSection />
      <SpecComparison />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-chrome/50 to-transparent" />
      <CTAFooter />
    </main>
  );
};

export default Index;
