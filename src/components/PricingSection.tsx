import { Zap } from 'lucide-react';

const PricingSection = () => {
  return (
    <section id="pricing" className="py-10 md:py-14 px-4 md:px-8">
      <div className="container mx-auto max-w-2xl">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vostok-mid/50 border border-vostok-neon/30 font-mono text-sm text-vostok-neon">
              <Zap className="w-4 h-4" />
              INSTANT ACCESS
            </div>
            
            <div className="space-y-2">
              <div className="text-6xl md:text-7xl font-bold text-vostok-neon text-glow">
                $29.99
              </div>
              <p className="text-xl text-vostok-text font-semibold">
                The Vostok Method
              </p>
              <p className="hidden text-vostok-muted" aria-hidden="true">
                Complete 276-page PDF Protocol
              </p>
            </div>
            
            <div className="space-y-4">
              <a
                href="https://amoxcenturion.gumroad.com/l/vostokmethod"
                className="btn-neon w-full text-center text-xl py-5"
              >
                Break the Looks Ceiling
              </a>
              
              <p className="font-mono text-sm text-vostok-muted">
                Everything you need to transform
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
