import { useEffect, useRef, useState, type CSSProperties } from 'react';
import PdfModal from './PdfModal';

type CaretStyle = CSSProperties & {
  '--caret-delay'?: string;
};

const statusText = 'PROTOCOL ACTIVE';
const caretStepSeconds = 10;
const statusLetters = statusText.replace(/\s+/g, '');
const caretCycleSeconds = statusLetters.length * caretStepSeconds;

type HeroStatement = {
  primary: string;
  secondary: string;
};

type HeroSectionProps = {
  onOpenProtocol: () => void;
  isProtocolOpen: boolean;
};

const heroStatements: HeroStatement[] = [
  {
    primary: 'The face outranks everything.',
    secondary: 'Height, money, status—secondary variables.',
  },
  {
    primary: 'Your face is the primary stat.',
    secondary: 'All other traits scale from it.',
  },
  {
    primary: 'Height matters. The face decides.',
    secondary: 'The hierarchy is visual.',
  },
  {
    primary: 'People rank before they listen.',
    secondary: 'The face assigns the rank.',
  },
  {
    primary: 'The halo effect is not bias.',
    secondary: 'It’s the system working as designed.',
  },
  {
    primary: 'Your face is read in milliseconds.',
    secondary: 'The verdict is instant.',
  },
  {
    primary: 'Clothes decorate. Faces command.',
    secondary: 'Confuse them at your own cost.',
  },
  {
    primary: 'The world responds to structure.',
    secondary: 'Soft signals get soft treatment.',
  },
  {
    primary: 'Your face carries authority—or it doesn’t.',
    secondary: 'Words arrive afterward.',
  },
  {
    primary: 'You don’t rise socially.',
    secondary: 'You are visually placed.',
  },
  {
    primary: 'The face is the gatekeeper.',
    secondary: 'Everything passes through it.',
  },
  {
    primary: 'The mirror is not cosmetic.',
    secondary: 'It’s diagnostic.',
  },
  {
    primary: 'Genetics set limits.',
    secondary: 'Training determines proximity.',
  },
  {
    primary: 'The gym trains the body.',
    secondary: 'This trains the face.',
  },
  {
    primary: 'Facial structure is not static.',
    secondary: 'It responds to load.',
  },
  {
    primary: 'Soft environments create soft faces.',
    secondary: 'This is corrective pressure.',
  },
  {
    primary: 'People don’t reward effort.',
    secondary: 'They reward appearance of ease.',
  },
  {
    primary: 'A trained face reduces friction.',
    secondary: 'Socially. Professionally. Romantically.',
  },
  {
    primary: 'This is not self-expression.',
    secondary: 'This is self-engineering.',
  },
  {
    primary: 'The protocol is not motivation.',
    secondary: 'It’s applied reality.',
  },
];

const secondLineDelay = 2200;
const minDisplayDuration = 6000;
const maxDisplayDuration = 10000;
const heroVideoFadeDurationMs = 2000;
const heroVideoClickDelayMs = 3000;

const getDisplayDuration = ({ primary, secondary }: HeroStatement) => {
  const totalLength = primary.length + secondary.length;
  const normalized = Math.min(totalLength / 140, 1);
  return Math.round(minDisplayDuration + (maxDisplayDuration - minDisplayDuration) * normalized);
};

const HeroSection = ({ onOpenProtocol, isProtocolOpen }: HeroSectionProps) => {
  const [statementIndex, setStatementIndex] = useState(0);
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [isButtonShining, setIsButtonShining] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [showHeroVideo, setShowHeroVideo] = useState(true);
  const [isHeroVideoVisible, setIsHeroVideoVisible] = useState(false);
  const [isHeroVideoFadingOut, setIsHeroVideoFadingOut] = useState(false);
  const [showHeroImage, setShowHeroImage] = useState(false);
  const [isHeroImageVisible, setIsHeroImageVisible] = useState(false);
  const [isHeroMuted, setIsHeroMuted] = useState(true);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const heroTransitionTimeouts = useRef<number[]>([]);

  const clearHeroTransitionTimeouts = () => {
    heroTransitionTimeouts.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    heroTransitionTimeouts.current = [];
  };

  const scheduleHeroImageTransition = (delayMs: number) => {
    if (!showHeroVideo || isHeroVideoFadingOut || showHeroImage) {
      return;
    }

    clearHeroTransitionTimeouts();

    const startTimeout = window.setTimeout(() => {
      setIsHeroVideoFadingOut(true);
      const finishTimeout = window.setTimeout(() => {
        setShowHeroVideo(false);
        setShowHeroImage(true);
        setIsHeroVideoFadingOut(false);
      }, heroVideoFadeDurationMs);
      heroTransitionTimeouts.current.push(finishTimeout);
    }, delayMs);

    heroTransitionTimeouts.current.push(startTimeout);
  };

  useEffect(() => {
    setShowSecondLine(false);
    const revealTimeout = setTimeout(() => setShowSecondLine(true), secondLineDelay);
    const rotationTimeout = setTimeout(
      () => setStatementIndex((prev) => (prev + 1) % heroStatements.length),
      getDisplayDuration(heroStatements[statementIndex])
    );

    return () => {
      clearTimeout(revealTimeout);
      clearTimeout(rotationTimeout);
    };
  }, [statementIndex]);

  useEffect(() => {
    let activationTimeout: ReturnType<typeof setTimeout>;
    let shineTimeout: ReturnType<typeof setTimeout>;

    const scheduleShine = () => {
      const delay = 30000 + Math.random() * 15000;
      activationTimeout = setTimeout(() => {
        setIsButtonShining(true);
        shineTimeout = setTimeout(() => {
          setIsButtonShining(false);
          scheduleShine();
        }, 6000);
      }, delay);
    };

    scheduleShine();

    return () => {
      clearTimeout(activationTimeout);
      clearTimeout(shineTimeout);
    };
  }, []);

  useEffect(() => {
    const playTimeout = setTimeout(() => {
      setIsHeroVideoVisible(true);
      heroVideoRef.current?.play().catch(() => undefined);
    }, 2000);

    return () => {
      clearTimeout(playTimeout);
      clearHeroTransitionTimeouts();
    };
  }, []);

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = isHeroMuted;
    }
  }, [isHeroMuted]);

  useEffect(() => {
    if (!showHeroImage) {
      return;
    }

    setIsHeroImageVisible(false);
    const raf = requestAnimationFrame(() => {
      setIsHeroImageVisible(true);
    });

    return () => cancelAnimationFrame(raf);
  }, [showHeroImage]);

  const handleHeroFrameClick = () => {
    if (!showHeroVideo) {
      return;
    }

    const video = heroVideoRef.current;
    if (video && !video.paused) {
      video.pause();
    }

    scheduleHeroImageTransition(heroVideoClickDelayMs);
  };

  useEffect(() => {
    if (isProtocolOpen) {
      handleHeroFrameClick();
    }
  }, [isProtocolOpen]);

  return (
    <section className="min-h-screen flex items-center py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-2">
              <p
                className="font-mono text-sm text-vostok-neon tracking-widest uppercase flex items-center gap-1"
                style={{ '--caret-cycle': `${caretCycleSeconds}s` } as CSSProperties}
              >
                <span>[</span>
                {(() => {
                  let caretIndex = -1;
                  return statusText.split('').map((char, index) => {
                    if (char === ' ') {
                      return (
                        <span key={`space-${index}`} className="px-1">
                          &nbsp;
                        </span>
                      );
                    }
                    caretIndex += 1;
                    return (
                      <span
                        key={`caret-${index}-${char}`}
                        className="caret-letter"
                        style={{ '--caret-delay': `${caretIndex * caretStepSeconds}s` } as CaretStyle}
                      >
                        {char}
                      </span>
                    );
                  });
                })()}
                <span>]</span>
              </p>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-vostok-text leading-tight">
              <span className="text-glow text-vostok-neon">The Vostok</span>
              <br />
              <span>Method</span>
            </h1>
            
            <div className="space-y-2 max-w-3xl">
              <p className="text-xl md:text-2xl text-vostok-muted font-semibold tracking-tight">
                {heroStatements[statementIndex].primary}
              </p>
              <p
                className={`text-xl md:text-2xl text-vostok-neon font-semibold secondary-line ${
                  showSecondLine ? 'secondary-line-visible' : ''
                }`}
              >
                {heroStatements[statementIndex].secondary}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  handleHeroFrameClick();
                  onOpenProtocol();
                }}
                className={`btn-neon text-center btn-shine ${isButtonShining ? 'btn-shine-active' : ''}`}
              >
                Access the Protocol
              </button>
              <button
                type="button"
                onClick={() => setIsPdfOpen(true)}
                className="btn-ghost text-center"
              >
                See What's Inside
              </button>
            </div>
            
            <div className="flex items-center gap-6 pt-4 text-sm text-vostok-muted font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-vostok-neon rounded-full animate-pulse" />
                276 Pages
              </span>
              <span>•</span>
              <span>Instant Access</span>
            </div>
          </div>
          
          {/* Right: Hero Image */}
          <div className="relative animate-fade-in-up animation-delay-200">
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-vostok-neon/20 blur-3xl rounded-full scale-75" />
            
            {/* Image container with HUD overlay */}
            <div className="relative glass-card rounded-2xl overflow-hidden">
              <div className="relative w-full aspect-[3/4] bg-black">
                {showHeroVideo && (
                  <>
                    <button
                      type="button"
                      onClick={handleHeroFrameClick}
                      className="absolute inset-0 z-10 cursor-pointer bg-transparent"
                      aria-label="Pause video and show poster"
                    />
                    <video
                      ref={heroVideoRef}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${
                        isHeroVideoVisible && !isHeroVideoFadingOut ? 'opacity-100' : 'opacity-0'
                      }`}
                      src="/main_website_video_compressed.mp4"
                      playsInline
                      onEnded={() => {
                        scheduleHeroImageTransition(0);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setIsHeroMuted((prev) => !prev)}
                      className="absolute top-3 right-3 z-20 rounded-full border border-vostok-neon/40 bg-black/70 px-3 py-1 text-xs font-mono text-vostok-neon hover:bg-black/90 transition"
                    >
                      {isHeroMuted ? 'AUDIO OFF' : 'AUDIO ON'}
                    </button>
                  </>
                )}
                {showHeroImage && (
                  <img
                    src="/vostok4.png"
                    alt="The Vostok Method"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${
                      isHeroImageVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
              </div>
              
              {/* HUD overlay lines */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner brackets */}
                <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-vostok-neon/50" />
                <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-vostok-neon/50" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-vostok-neon/50" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-vostok-neon/50" />
                
                {/* Scan line */}
                {showHeroImage && (
                  <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-vostok-neon/60 to-transparent top-1/3" />
                )}
                
                {/* Data readout */}
                <div className="absolute bottom-6 left-6 font-mono text-xs text-vostok-neon/70">
                  SUBJECT::BASELINE_ACTIVE
                </div>
              </div>
            </div>
          </div>

          <PdfModal
            isOpen={isPdfOpen}
            onClose={() => setIsPdfOpen(false)}
            pdfSrc="/Vostok_Sampler.pdf"
          />
        </div>
      </div>
      <div className="red-glow-pulse" />
    </section>
  );
};

export default HeroSection;
