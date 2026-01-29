import { useEffect, useState } from 'react';
import { track } from '@vercel/analytics';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import PdfModal from './PdfModal';
import HeroVideo from './HeroVideo';
import { trackRedditEvent } from '@/utils/redditTracking';

const heroStatements = [
  'Transform Your Face and Watch Your Entire Social World Shift Around You.',
  'Reshape Your Facial Structure and Instantly Change How People Respond.',
  'Build a Face That Commands Attention, Attraction, and Quiet Respect Everywhere You Go.',
  'Rebuild Your Features and Unlock a Level of Confidence You Didn’t Know You Had.',
  'Change Your Facial Architecture and the World Will Treat You Differently.',
  'Upgrade Your Structure and Presence — Before You Even Say a Word.',
  'Forge a More Defined, Attractive Face and Feel the Social Gravity Increase.',
  'Reconstruct Your Features With Precision and Transform Your Identity Completely.',
  'Improve Your Facial Symmetry, Tone, and Presence — People Notice Immediately.',
  'Shape Your Face Into Its Strongest Form and Watch New Opportunities Open.',
  'Strengthen Your Features and Experience the Boost in Confidence and Connection.',
  'Create a Face That Turns Heads and Makes People Pay Attention.',
  'Enhance Your Structure and Build the Version of Yourself You Know You Can Be.',
  'Transform the Way You Look and Transform the Way People React to You.',
  'Elevate Your Facial Presence and Feel Social Interactions Become Effortless.',
  'Build Unshakable Confidence By Reshaping the Foundation of Your Face.',
  'Craft a More Dynamic, Attractive Face and Feel the Energy of Every Room Shift.',
  'Unlock the Secret to a More Defined, Masculine, and Noticeable Facial Structure.',
  'Improve Your Features and Feel the World Treat You With More Warmth and Respect.',
  'Redesign Your Face and Redesign Your Life — The Change Begins With Structure.',
];

const HeroSection = () => {
  const [statementIndex, setStatementIndex] = useState(0);
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * heroStatements.length);
    setStatementIndex(randomIndex);
    const id = window.setInterval(() => {
      setStatementIndex((prev) => (prev + 1) % heroStatements.length);
    }, 10000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="md:min-h-screen flex items-start md:items-center py-6 md:py-14 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <div className="space-y-6 md:space-y-12 text-center lg:text-left">
            {/* Mobile: video directly under the title */}
            <div className="relative lg:hidden animate-fade-in-up animation-delay-200 mt-4 mx-auto w-full max-w-sm">
              <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-vostok-neon/70">
                Watch: How I rebuilt my face in 100 hours
              </p>
              <div className="absolute inset-0 bg-vostok-neon/20 rounded-full scale-75" />
              <div className="relative glass-card rounded-2xl overflow-hidden">
                <div className="relative w-full aspect-[3/4] bg-black">
                  <HeroVideo />
                </div>
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-vostok-neon/50" />
                  <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-vostok-neon/50" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-vostok-neon/50" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-vostok-neon/50" />
                  <div className="absolute bottom-6 left-6 font-mono text-xs text-vostok-neon/70">
                    SUBJECT::BASELINE_ACTIVE
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-vostok-text leading-tight -mt-2 md:-mt-4">
              Transform Your Face.
              <br />
              Transform Your Life.
            </h1>

            <div className="mx-auto h-px w-20 bg-vostok-neon/70 md:mx-0 md:w-28" />

            <div className="space-y-3 md:space-y-2 max-w-3xl">
              <p className="text-xl md:text-2xl text-vostok-muted font-semibold tracking-tight">
                <span key={statementIndex} className="hero-rotating-line">
                  {heroStatements[statementIndex]}
                </span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-6 md:pt-6">
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
              <Link
                to="/see-my-face"
                onClick={() => {
                  track('sales_page click', { cta: 'see_my_face', section: 'hero' });
                }}
                className="btn-neon text-center"
              >
                See My Before/After
              </Link>
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
                className="btn-ghost text-center"
              >
                Free Sample
              </button>
            </div>
            
          </div>
          
          {/* Right: Hero Image */}
          <div className="relative hidden lg:block animate-fade-in-up animation-delay-200 mt-10 sm:mt-0 mx-auto w-full max-w-sm sm:max-w-none">
            <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-vostok-neon/70">
              Watch: How I rebuilt my face in 100 hours
            </p>
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-vostok-neon/20 rounded-full scale-75" />
            
            {/* Image container with HUD overlay */}
            <div className="relative glass-card rounded-2xl overflow-hidden">
              <div className="relative w-full aspect-[3/4] bg-black">
                <HeroVideo />
              </div>
              
              {/* HUD overlay lines */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner brackets */}
                <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-vostok-neon/50" />
                <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-vostok-neon/50" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-vostok-neon/50" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-vostok-neon/50" />
                
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
