import { Suspense, lazy, useEffect } from 'react';
import HudBackground from '@/components/HudBackground';
import HeroSection from '@/components/HeroSection';
import LazySection from '@/components/LazySection';
import { trackRedditEventOnce } from '@/utils/redditTracking';

const PremiseSection = lazy(() => import('@/components/PremiseSection'));
const LearnSection = lazy(() => import('@/components/LearnSection'));
const IncludedSection = lazy(() => import('@/components/IncludedSection'));
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection'));
const PricingSection = lazy(() => import('@/components/PricingSection'));
const CommunitySection = lazy(() => import('@/components/CommunitySection'));
const Footer = lazy(() => import('@/components/Footer'));

const Index = () => {
  useEffect(() => {
    const thresholds = [25, 50, 75, 100];
    let ticking = false;
    let rafId: number | null = null;

    const onScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      rafId = window.requestAnimationFrame(() => {
        ticking = false;
        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop;
        const scrollHeight = doc.scrollHeight - window.innerHeight;
        if (scrollHeight <= 0) {
          return;
        }
        const percent = Math.round((scrollTop / scrollHeight) * 100);
        thresholds.forEach((threshold) => {
          if (percent >= threshold) {
            trackRedditEventOnce(
              `ScrollDepth${threshold}`,
              `reddit_scroll_${threshold}`
            );
          }
        });
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    let engagedTimer: number | null = null;
    let visibleStartedAt: number | null = null;
    let accumulatedMs = 0;

    const fireEngaged = () => {
      trackRedditEventOnce('TimeOnPage30s', 'reddit_time_30s');
    };

    const scheduleEngaged = () => {
      const remaining = 30000 - accumulatedMs;
      if (remaining <= 0) {
        fireEngaged();
        return;
      }
      if (engagedTimer !== null) {
        window.clearTimeout(engagedTimer);
      }
      engagedTimer = window.setTimeout(fireEngaged, remaining);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        visibleStartedAt = performance.now();
        scheduleEngaged();
        return;
      }

      if (visibleStartedAt !== null) {
        accumulatedMs += performance.now() - visibleStartedAt;
        visibleStartedAt = null;
      }
      if (engagedTimer !== null) {
        window.clearTimeout(engagedTimer);
        engagedTimer = null;
      }
    };

    if (document.visibilityState === 'visible') {
      visibleStartedAt = performance.now();
      scheduleEngaged();
    }

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (engagedTimer !== null) {
        window.clearTimeout(engagedTimer);
      }
    };
  }, []);

  return (
    <HudBackground>
      <HeroSection />
      <LazySection>
        <Suspense fallback={null}>
          <PremiseSection />
        </Suspense>
      </LazySection>
      <LazySection>
        <Suspense fallback={null}>
          <LearnSection />
        </Suspense>
      </LazySection>
      <LazySection>
        <Suspense fallback={null}>
          <IncludedSection />
        </Suspense>
      </LazySection>
      <LazySection>
        <Suspense fallback={null}>
          <TestimonialsSection />
        </Suspense>
      </LazySection>
      <LazySection>
        <Suspense fallback={null}>
          <PricingSection />
        </Suspense>
      </LazySection>
      <LazySection>
        <Suspense fallback={null}>
          <CommunitySection />
        </Suspense>
      </LazySection>
      <LazySection>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </LazySection>
    </HudBackground>
  );
};

export default Index;
