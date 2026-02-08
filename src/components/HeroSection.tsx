import { useEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics';
import { ChevronDown, Download, Pause, Volume2, VolumeX } from 'lucide-react';
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

const bookPages = Array.from({ length: 10 }, (_, index) => {
  const pageNumber = index + 1;
  return {
    left: `/Sections/${pageNumber}.jpg`,
    right: `/Sections/${pageNumber}_page-0001.jpg`,
  };
});

const HeroSection = () => {
  const [statementIndex, setStatementIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );
  const proofVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isProofMuted, setIsProofMuted] = useState(true);
  const [isProofPlaying, setIsProofPlaying] = useState(true);
  const [isProofEnded, setIsProofEnded] = useState(false);
  const totalBookPages = bookPages.length * 2;
  const [bookPageIndex, setBookPageIndex] = useState(0);
  const [isBookFlipping, setIsBookFlipping] = useState(false);
  const [bookFlipDirection, setBookFlipDirection] = useState<'next' | 'prev' | null>(null);

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

  const handleBookFlip = (direction: 'next' | 'prev') => {
    if (isBookFlipping) {
      return;
    }
    if (direction === 'next' && bookPageIndex + 2 >= totalBookPages) {
      return;
    }
    if (direction === 'prev' && bookPageIndex - 2 < 0) {
      return;
    }
    setBookFlipDirection(direction);
    setIsBookFlipping(true);
    window.setTimeout(() => {
      setBookPageIndex((prev) => prev + (direction === 'next' ? 2 : -2));
      setIsBookFlipping(false);
      setBookFlipDirection(null);
    }, 450);
  };

  const leftPage = bookPageIndex;
  const rightPage = bookPageIndex + 1;
  const nextLeftPage = bookPageIndex + 2;
  const prevRightPage = bookPageIndex - 1;
  const getBookPageImage = (pageIndex: number) => {
    const spreadIndex = Math.floor(pageIndex / 2);
    if (spreadIndex < 0 || spreadIndex >= bookPages.length) {
      return null;
    }
    return pageIndex % 2 === 0 ? bookPages[spreadIndex].left : bookPages[spreadIndex].right;
  };
  const leftPageImage = getBookPageImage(leftPage);
  const rightPageImage = getBookPageImage(rightPage);
  const nextLeftPageImage = getBookPageImage(nextLeftPage);
  const prevRightPageImage = getBookPageImage(prevRightPage);

  return (
    <>
      <section className="section section-tight-mobile md:min-h-screen flex items-start md:items-center">
        <div className="section-inner">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <div className="space-y-4 md:space-y-6 text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-vostok-text leading-tight -mt-2 md:-mt-4">
                Get Hot
              </h1>

              {!isDesktop && (
                <div className="relative animate-fade-in-up animation-delay-200 mt-4 mx-auto w-full max-w-sm">
                  <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-vostok-text">
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

              <div className="mx-auto h-px w-20 bg-[#F7F9FB]/70 md:mx-0 md:w-28" />

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
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    track('sales_page click', { cta: 'get_the_method', section: 'hero' });
                    trackRedditEvent('BreakTheLooksCeiling');
                  }}
                  className="btn-green text-center inline-flex items-center justify-center gap-2"
                >
                  Get The Method
                  <Download className="h-4 w-4 md:h-6 md:w-6" aria-hidden="true" />
                </a>
              </div>
              
            </div>
            
            {/* Right: Proof Video */}
            {isDesktop && (
              <div className="relative animate-fade-in-up animation-delay-200 mt-10 sm:mt-0 mx-auto w-full max-w-[25.75rem]">
                <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-vostok-text">
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
      <section className="section section-tight-mobile">
        <div className="section-inner">
          <div className="book-shell">
            <div className="book-title">This Book will fundamentally change your life, like no other, find out way...</div>
            {isDesktop ? (
              <div className="book-spread">
                <button
                  type="button"
                  className="book-page book-page-left"
                  onClick={() => handleBookFlip('prev')}
                  disabled={bookPageIndex === 0 || isBookFlipping}
                  aria-label="Flip to previous page"
                  aria-disabled={bookPageIndex === 0 || isBookFlipping}
                >
                  <div className="book-page-inner">
                    {leftPageImage ? (
                      <img
                        src={leftPageImage}
                        alt={`Preview page ${leftPage + 1}`}
                        className="book-page-image"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="book-page-label">No preview</div>
                    )}
                    <div className="book-page-number">Page {leftPage + 1}</div>
                  </div>
                </button>
                <button
                  type="button"
                  className="book-page book-page-right"
                  onClick={() => handleBookFlip('next')}
                  disabled={bookPageIndex + 2 >= totalBookPages || isBookFlipping}
                  aria-label="Flip to next page"
                  aria-disabled={bookPageIndex + 2 >= totalBookPages || isBookFlipping}
                >
                  <div className="book-page-inner">
                    {rightPageImage ? (
                      <img
                        src={rightPageImage}
                        alt={`Preview page ${rightPage + 1}`}
                        className="book-page-image"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="book-page-label">No preview</div>
                    )}
                    <div className="book-page-number">Page {rightPage + 1}</div>
                  </div>
                </button>

                {isBookFlipping && bookFlipDirection === 'next' && (
                  <div className="book-flip-layer book-flip-next" aria-hidden="true">
                    <div className="book-flip-face book-flip-front">
                      <div className="book-page-inner">
                        {rightPageImage ? (
                          <img
                            src={rightPageImage}
                            alt={`Preview page ${rightPage + 1}`}
                            className="book-page-image"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="book-page-label">No preview</div>
                        )}
                        <div className="book-page-number">Page {rightPage + 1}</div>
                      </div>
                    </div>
                    <div className="book-flip-face book-flip-back">
                      <div className="book-page-inner">
                        {nextLeftPageImage ? (
                          <img
                            src={nextLeftPageImage}
                            alt={`Preview page ${nextLeftPage + 1}`}
                            className="book-page-image"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="book-page-label">No preview</div>
                        )}
                        <div className="book-page-number">Page {nextLeftPage + 1}</div>
                      </div>
                    </div>
                  </div>
                )}

                {isBookFlipping && bookFlipDirection === 'prev' && (
                  <div className="book-flip-layer book-flip-prev" aria-hidden="true">
                    <div className="book-flip-face book-flip-front">
                      <div className="book-page-inner">
                        {leftPageImage ? (
                          <img
                            src={leftPageImage}
                            alt={`Preview page ${leftPage + 1}`}
                            className="book-page-image"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="book-page-label">No preview</div>
                        )}
                        <div className="book-page-number">Page {leftPage + 1}</div>
                      </div>
                    </div>
                    <div className="book-flip-face book-flip-back">
                      <div className="book-page-inner">
                        {prevRightPageImage ? (
                          <img
                            src={prevRightPageImage}
                            alt={`Preview page ${prevRightPage + 1}`}
                            className="book-page-image"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="book-page-label">No preview</div>
                        )}
                        <div className="book-page-number">Page {prevRightPage + 1}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="book-spread-mobile">
                <button
                  type="button"
                  className="book-page book-page-stack book-page-top"
                  onClick={() => handleBookFlip('prev')}
                  disabled={bookPageIndex === 0 || isBookFlipping}
                  aria-label="Flip to previous page"
                  aria-disabled={bookPageIndex === 0 || isBookFlipping}
                >
                  <div className="book-page-inner">
                    {leftPageImage ? (
                      <img
                        src={leftPageImage}
                        alt={`Preview page ${leftPage + 1}`}
                        className="book-page-image"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="book-page-label">No preview</div>
                    )}
                    <div className="book-page-number">Page {leftPage + 1}</div>
                  </div>
                </button>
                <button
                  type="button"
                  className="book-page book-page-stack book-page-bottom"
                  onClick={() => handleBookFlip('next')}
                  disabled={bookPageIndex + 2 >= totalBookPages || isBookFlipping}
                  aria-label="Flip to next page"
                  aria-disabled={bookPageIndex + 2 >= totalBookPages || isBookFlipping}
                >
                  <div className="book-page-inner">
                    {rightPageImage ? (
                      <img
                        src={rightPageImage}
                        alt={`Preview page ${rightPage + 1}`}
                        className="book-page-image"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="book-page-label">No preview</div>
                    )}
                    <div className="book-page-number">Page {rightPage + 1}</div>
                  </div>
                </button>

                {isBookFlipping && bookFlipDirection === 'next' && (
                  <div className="book-flip-layer-mobile book-flip-next-mobile" aria-hidden="true">
                    <div className="book-flip-face-mobile book-flip-front-mobile">
                      <div className="book-page-inner">
                        {rightPageImage ? (
                          <img
                            src={rightPageImage}
                            alt={`Preview page ${rightPage + 1}`}
                            className="book-page-image"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="book-page-label">No preview</div>
                        )}
                        <div className="book-page-number">Page {rightPage + 1}</div>
                      </div>
                    </div>
                    <div className="book-flip-face-mobile book-flip-back-mobile">
                      <div className="book-page-inner">
                        {nextLeftPageImage ? (
                          <img
                            src={nextLeftPageImage}
                            alt={`Preview page ${nextLeftPage + 1}`}
                            className="book-page-image"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="book-page-label">No preview</div>
                        )}
                        <div className="book-page-number">Page {nextLeftPage + 1}</div>
                      </div>
                    </div>
                  </div>
                )}

                {isBookFlipping && bookFlipDirection === 'prev' && (
                  <div className="book-flip-layer-mobile book-flip-prev-mobile" aria-hidden="true">
                    <div className="book-flip-face-mobile book-flip-front-mobile">
                      <div className="book-page-inner">
                        {leftPageImage ? (
                          <img
                            src={leftPageImage}
                            alt={`Preview page ${leftPage + 1}`}
                            className="book-page-image"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="book-page-label">No preview</div>
                        )}
                        <div className="book-page-number">Page {leftPage + 1}</div>
                      </div>
                    </div>
                    <div className="book-flip-face-mobile book-flip-back-mobile">
                      <div className="book-page-inner">
                        {prevRightPageImage ? (
                          <img
                            src={prevRightPageImage}
                            alt={`Preview page ${prevRightPage + 1}`}
                            className="book-page-image"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="book-page-label">No preview</div>
                        )}
                        <div className="book-page-number">Page {prevRightPage + 1}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="book-hint">Click right to advance, left to go back.</div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
