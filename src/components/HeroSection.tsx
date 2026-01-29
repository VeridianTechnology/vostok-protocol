import { useEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics';
import { ChevronDown, Download, Pause, Volume2, VolumeX } from 'lucide-react';
import PdfModal from './PdfModal';
import { trackRedditEvent } from '@/utils/redditTracking';

const heroStatements = [
  'Transform your structure, transform your destiny.',
  'A stronger face opens stronger opportunities.',
  'Your face is your first impression—make it unmissable.',
  'Build the kind of presence people remember.',
  'When your structure improves, everything in life gets easier.',
  'Look like the man you were meant to be.',
  'Your face can change—and so can your life.',
  'Most men never learn how to build their facial architecture.',
  'A better face creates a better social world around you.',
  'Structure is power—learn to shape it.',
  'A more defined face changes the way people treat you.',
  'Presence isn’t born—it’s built.',
  'Your future self has a better face. Start becoming him.',
  'This is how you become more photogenic, more magnetic, more confident.',
  'Small structural changes create big life changes.',
  'The upgrade starts with your jaw, eyes, and neck.',
  'You can sculpt the version of you people respect instantly.',
  'Your face is your billboard—design it with intention.',
  'Build the geometry that commands attention without trying.',
  'When your bone posture improves, everything improves.',
];

const HeroSection = () => {
  const [statementIndex, setStatementIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const proofVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isProofMuted, setIsProofMuted] = useState(true);
  const [isProofPlaying, setIsProofPlaying] = useState(true);
  const [isProofEnded, setIsProofEnded] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * heroStatements.length);
    setStatementIndex(randomIndex);
    const id = window.setInterval(() => {
      setStatementIndex((prev) => (prev + 1) % heroStatements.length);
    }, 10000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => setIsDesktop(mediaQuery.matches);
    handleChange();
    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const handleProofToggle = () => {
    if (!proofVideoRef.current) {
      return;
    }
    if (isProofEnded) {
      proofVideoRef.current.currentTime = 0;
      setIsProofEnded(false);
      proofVideoRef.current.play();
      return;
    }
    if (proofVideoRef.current.paused) {
      proofVideoRef.current.play();
    } else {
      proofVideoRef.current.pause();
    }
  };

  return (
    <>
      <section className="section md:min-h-screen flex items-start md:items-center">
        <div className="section-inner">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <div className="space-y-4 md:space-y-6 text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-vostok-text leading-tight -mt-2 md:-mt-4">
                Transform Your Face.
                <br />
                Transform Your Life.
              </h1>

              {!isDesktop && (
                <div className="relative animate-fade-in-up animation-delay-200 mt-4 mx-auto w-full max-w-sm">
                  <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-[#EDEDED]">
                    WATCH: My Real Before/After — No Filters
                  </p>
                  <div className="absolute inset-0 bg-vostok-neon/20 rounded-full scale-75" />
                  <div className="relative glass-card rounded-2xl overflow-hidden">
                    <div className="relative w-full aspect-[9/16] bg-[#0E0E0E]">
                      <video
                        ref={proofVideoRef}
                        className="h-full w-full object-cover"
                        src="/videos/proof.webm"
                        autoPlay
                        muted={isProofMuted}
                        playsInline
                        preload="metadata"
                        onClick={handleProofToggle}
                        onPlay={() => {
                          setIsProofPlaying(true);
                          setIsProofEnded(false);
                        }}
                        onPause={() => setIsProofPlaying(false)}
                        onEnded={() => {
                          setIsProofPlaying(false);
                          setIsProofEnded(true);
                        }}
                      />
                      <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-500 ${
                          isProofEnded ? 'opacity-70' : 'opacity-0'
                        }`}
                      />
                      {!isProofPlaying && (
                        <button
                          type="button"
                          aria-label="Play video"
                          className="absolute inset-0 flex items-center justify-center text-white"
                          onClick={handleProofToggle}
                        >
                          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-black/70">
                            <Pause className="h-6 w-6" />
                          </span>
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label={isProofMuted ? 'Unmute video' : 'Mute video'}
                        className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/80"
                        onClick={(event) => {
                          event.stopPropagation();
                          setIsProofMuted((prev) => !prev);
                        }}
                      >
                        {isProofMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mx-auto h-px w-20 bg-[#EDEDED]/70 md:mx-0 md:w-28" />

              <div className="space-y-3 md:space-y-2 max-w-3xl">
                <p className="text-xl md:text-2xl text-vostok-muted font-semibold tracking-tight min-h-[3.5rem] md:min-h-[4.5rem] flex items-center justify-center lg:justify-start">
                  <span key={statementIndex} className="hero-rotating-line">
                    {heroStatements[statementIndex]}
                  </span>
                </p>
              </div>
            
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-3 md:pt-4">
                <a
                  href="https://amoxcenturion.gumroad.com/l/vostokmethod"
                  onClick={() => {
                    track('sales_page click', { cta: 'get_the_method', section: 'hero' });
                    trackRedditEvent('BreakTheLooksCeiling');
                  }}
                  className="btn-green text-center inline-flex items-center justify-center gap-2"
                >
                  Get The Method
                  <Download className="h-4 w-4 md:h-6 md:w-6" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    track('sales_page click', { cta: 'see_whats_inside', section: 'hero' });
                    trackRedditEvent('SeeWhatsInside');
                    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
                      window.open('/Vostok_Sampler.pdf', '_blank', 'noopener,noreferrer');
                      return;
                    }
                    setIsPdfOpen(true);
                  }}
                  className="btn-link text-center"
                >
                  Free Sample
                </button>
              </div>
              
            </div>
            
            {/* Right: Proof Video */}
            {isDesktop && (
              <div className="relative animate-fade-in-up animation-delay-200 mt-10 sm:mt-0 mx-auto w-full max-w-[25.75rem]">
                <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-[#EDEDED]">
                  WATCH: My Real Before/After — No Filters
                </p>
                <div className="absolute inset-0 bg-vostok-neon/20 rounded-full scale-75" />
                <div className="relative glass-card rounded-2xl overflow-hidden">
                  <div className="relative w-full aspect-[9/16] bg-[#0E0E0E]">
                      <video
                        ref={proofVideoRef}
                        className="h-full w-full object-cover"
                        src="/videos/proof.webm"
                        autoPlay
                        muted={isProofMuted}
                        playsInline
                        preload="metadata"
                        onClick={handleProofToggle}
                        onPlay={() => {
                          setIsProofPlaying(true);
                          setIsProofEnded(false);
                        }}
                        onPause={() => setIsProofPlaying(false)}
                        onEnded={() => {
                          setIsProofPlaying(false);
                          setIsProofEnded(true);
                        }}
                      />
                      <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-500 ${
                          isProofEnded ? 'opacity-70' : 'opacity-0'
                        }`}
                      />
                    {!isProofPlaying && (
                      <button
                        type="button"
                        aria-label="Play video"
                        className="absolute inset-0 flex items-center justify-center text-white"
                        onClick={handleProofToggle}
                      >
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-black/70">
                          <Pause className="h-6 w-6" />
                        </span>
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label={isProofMuted ? 'Unmute video' : 'Mute video'}
                      className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/80"
                      onClick={(event) => {
                        event.stopPropagation();
                        setIsProofMuted((prev) => !prev);
                      }}
                    >
                      {isProofMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <PdfModal
              isOpen={isPdfOpen}
              onClose={() => setIsPdfOpen(false)}
              pdfSrc="/Vostok_Sampler.pdf"
            />
          </div>
          <div className="mt-6 hidden md:flex items-center justify-center">
            <a
              href="#premise"
              aria-label="Scroll to next section"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white/90 text-glow-white transition hover:border-white/70 hover:text-white"
            >
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
        
      </section>
    </>
  );
};

export default HeroSection;
