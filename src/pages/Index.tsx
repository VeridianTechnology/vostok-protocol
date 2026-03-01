import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import FeatureThumbnails from "@/components/FeatureThumbnails";
import QuoteSection from "@/components/QuoteSection";
import SpecComparison from "@/components/SpecComparison";
import VostokProcess from "@/components/VostokProcess";
import CTAFooter from "@/components/CTAFooter";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <VideoSection />
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
