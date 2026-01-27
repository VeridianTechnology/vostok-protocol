import HudBackground from '@/components/HudBackground';
import HeroSection from '@/components/HeroSection';
import PremiseSection from '@/components/PremiseSection';
import LearnSection from '@/components/LearnSection';
import IncludedSection from '@/components/IncludedSection';
import ModulesSection from '@/components/ModulesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';
import CommunitySection from '@/components/CommunitySection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <HudBackground>
      <HeroSection />
      <PremiseSection />
      <LearnSection />
      <IncludedSection />
      <ModulesSection />
      <TestimonialsSection />
      <PricingSection />
      <CommunitySection />
      <Footer />
    </HudBackground>
  );
};

export default Index;
