import { useEffect, useState } from 'react';
import PdfModal from './PdfModal';

type HeroStatement = {
  primary: string;
  secondary: string;
};

type HeroSectionProps = {
  onOpenProtocol: () => void;
};

const heroStatements: HeroStatement[] = [
  {
    primary: 'The #1 LooksMaxxing Guide - Worldwide',
    secondary:
      'Over 120+ exercises, 30+ massages, Dozens of explanations for the full sculpting and reshaping of the face.',
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

const HeroSection = ({ onOpenProtocol }: HeroSectionProps) => {
  const statementIndex = 0;
  const [isButtonShining, setIsButtonShining] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);

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

  return (
    <section className="min-h-screen flex items-center py-10 md:py-14 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <div className="space-y-10 md:space-y-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-vostok-text leading-tight -mt-2 md:-mt-4">
              <span className="text-vostok-text">The Vostok</span>
              <br />
              <span>Method</span>
            </h1>
            
            <div className="space-y-2 max-w-3xl">
              <p className="text-xl md:text-2xl text-vostok-muted font-semibold tracking-tight">
                {heroStatements[statementIndex].primary}
              </p>
              <p className="text-xl md:text-2xl text-vostok-neon font-semibold">
                {heroStatements[statementIndex].secondary}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-10">
              <button
                type="button"
                onClick={() => {
                  onOpenProtocol();
                }}
                className={`btn-neon text-center btn-shine ${isButtonShining ? 'btn-shine-active' : ''}`}
              >
                Change Your Life
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
                    window.open('/Vostok_Sampler.pdf', '_blank', 'noopener,noreferrer');
                    return;
                  }
                  setIsPdfOpen(true);
                }}
                className="btn-ghost text-center"
              >
                See What's Inside
              </button>
            </div>
            
          </div>
          
          {/* Right: Hero Image */}
          <div className="relative animate-fade-in-up animation-delay-200">
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-vostok-neon/20 rounded-full scale-75" />
            
            {/* Image container with HUD overlay */}
            <div className="relative glass-card rounded-2xl overflow-hidden">
              <div className="relative w-full aspect-[3/4] bg-black">
                <img
                  src="/main_simple.jpg"
                  alt="The Vostok Method"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              {/* HUD overlay lines */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner brackets */}
                <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-vostok-neon/50" />
                <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-vostok-neon/50" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-vostok-neon/50" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-vostok-neon/50" />
                
                {/* Scan line */}
                <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-vostok-neon/60 to-transparent top-1/3" />
                
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
