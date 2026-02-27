import HeroSection from "@/components/HeroSection";
import FeatureThumbnails from "@/components/FeatureThumbnails";
import SpecComparison from "@/components/SpecComparison";
import CTAFooter from "@/components/CTAFooter";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <FeatureThumbnails />
      <SpecComparison />
      <CTAFooter />
    </main>
  );
};

export default Index;
