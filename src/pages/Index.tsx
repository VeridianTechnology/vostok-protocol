import { useState } from 'react';
import AccessProtocolModal from '@/components/AccessProtocolModal';
import HudBackground from '@/components/HudBackground';
import HeroSection from '@/components/HeroSection';
import PremiseSection from '@/components/PremiseSection';
import LearnSection from '@/components/LearnSection';
import IncludedSection from '@/components/IncludedSection';
import ModulesSection from '@/components/ModulesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';
import CommunitySection from '@/components/CommunitySection';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';

const Index = () => {
  const [isProtocolOpen, setIsProtocolOpen] = useState(false);

  return (
    <HudBackground>
      <HeroSection
        onOpenProtocol={() => setIsProtocolOpen(true)}
        isProtocolOpen={isProtocolOpen}
      />
      <PremiseSection />
      <LearnSection />
      <IncludedSection />
      <ModulesSection />
      <TestimonialsSection />
      <PricingSection onOpenProtocol={() => setIsProtocolOpen(true)} />
      <CommunitySection />
      <FaqSection />
      <Footer />
      <AccessProtocolModal isOpen={isProtocolOpen} onClose={() => setIsProtocolOpen(false)} />
    </HudBackground>
  );
};

export default Index;
