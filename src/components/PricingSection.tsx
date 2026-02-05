import { Download } from 'lucide-react';
import { trackRedditEvent } from '@/utils/redditTracking';

const PricingSection = () => {
  return (
    <section id="pricing" className="py-10 md:py-14 px-4 md:px-8 section-tight-mobile">
      <div className="container mx-auto max-w-2xl">
        <div className="glass-card dark-card fixed-opacity-card rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="space-y-2">
              <p className="hidden text-vostok-muted" aria-hidden="true">
                Complete 276-page PDF Protocol
              </p>
            </div>

            <div className="-mt-2 md:-mt-4 space-y-2">
              <div className="text-vostok-text text-5xl md:text-7xl font-semibold tracking-tight">
                $29.99
              </div>
              <div className="mx-auto h-px w-24 bg-[#F7F9FB]/70" />
            </div>
            <p className="pt-4 md:pt-6 text-lg md:text-xl text-vostok-text">
              The exact method that turned my face from average to magnetic in 100 hours.
            </p>
            <a
              href="https://amoxcenturion.gumroad.com/l/vostokmethod"
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                trackRedditEvent('BreakTheLooksCeiling');
              }}
              className="btn-green mt-6 md:mt-8 w-full text-center text-xl py-5 inline-flex items-center justify-center gap-2"
            >
              Get The Method
              <Download className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
