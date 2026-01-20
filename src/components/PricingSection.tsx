import { Zap } from 'lucide-react';

type PricingSectionProps = {
  onOpenProtocol: () => void;
};

const PricingSection = ({ onOpenProtocol }: PricingSectionProps) => {
  return (
    <section id="pricing" className="py-20 md:py-24 px-4 md:px-8">
      <div className="container mx-auto max-w-2xl">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-vostok-neon/10 blur-3xl rounded-full -translate-y-1/2" />
          
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
              <p className="text-vostok-muted">
                Complete 276-page PDF Protocol
              </p>
            </div>
            
            <p className="text-vostok-muted max-w-md mx-auto">
              No gimmicks. No cosmetic procedures required. Just structured protocols and consistency.
            </p>
            
            <div className="space-y-4">
              <button
                type="button"
                onClick={onOpenProtocol}
                className="btn-neon w-full text-center text-xl py-5"
              >
                Access the Method
              </button>
              
              <p className="font-mono text-sm text-vostok-muted">
                Instant download + lifetime access
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
