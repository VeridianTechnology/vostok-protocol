import { useState } from 'react';
import { Lock, Users } from 'lucide-react';

const CommunitySection = () => {
  const [showLock, setShowLock] = useState(false);

  return (
    <section className="hidden py-10 md:py-14 px-4 md:px-8" aria-hidden="true">
      <div className="container mx-auto max-w-3xl">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center space-y-8 border-2 border-vostok-neon/40">
          <div className="w-20 h-20 rounded-2xl bg-vostok-mid/50 flex items-center justify-center mx-auto border border-vostok-neon/30">
            <Users className="w-10 h-10 text-vostok-neon" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-vostok-text">
              Join the Free Vostok Community
            </h2>
            
            <p className="text-xl text-vostok-muted max-w-xl mx-auto">
              Share progress, routines, form checks, and accountability. Connect with others on the same protocol.
            </p>
          </div>
          
          <button 
            type="button"
            onClick={() => setShowLock((prev) => !prev)}
            className={`btn-ghost inline-block discord-flip ${showLock ? 'discord-flip-locked' : ''}`}
            aria-pressed={showLock}
          >
            <span className="discord-flip-face discord-flip-front">Join Discord</span>
            <span className="discord-flip-face discord-flip-back" aria-hidden={!showLock}>
              <Lock className="w-4 h-4" />
              Locked
            </span>
          </button>
          
          <p className="font-mono text-sm text-vostok-muted">
            Free for all protocol members
          </p>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
