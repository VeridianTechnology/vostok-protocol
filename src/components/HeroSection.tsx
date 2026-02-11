import { useEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics';
import { ChevronDown, Download, Pause, Volume2, VolumeX } from 'lucide-react';
import { trackRedditEvent } from '@/utils/redditTracking';
import { shouldLoadVideo as shouldLoadFullVideo } from '@/utils/videoGate';

const HERO_VIDEO_SRC = '/main_video.mp4';
const HERO_YOUTUBE_URL = 'https://www.youtube.com/watch?v=xeK0BKnvj7g';
const HERO_YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed/xeK0BKnvj7g?rel=0';

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
  const [canLoadVideo, setCanLoadVideo] = useState<boolean | null>(null);
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
    let active = true;
    const checkSpeed = async () => {
      const allowed = await shouldLoadFullVideo();
      if (active) {
        setCanLoadVideo(allowed);
      }
    };
    checkSpeed();
    return () => {
      active = false;
    };
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
        <div className="w-full px-[2%] md:px-[4%]">
          <div className="relative animate-fade-in-up animation-delay-200 mt-2 w-full">
            <div className="mb-3 flex items-center justify-between px-2 md:hidden">
              <img
                src="/logo-removebg-preview.png"
                alt="Vostok Method logo"
                className="h-12 w-12 object-contain"
              />
              <h1 className="text-2xl font-bold text-vostok-text leading-tight">
                Vostok - Get Hot
              </h1>
            </div>
            <div className="relative glass-card rounded-3xl overflow-hidden">
              <div className="relative w-full aspect-video bg-[#233b50]">
                {canLoadVideo === true && (
                  <video
                    ref={proofVideoRef}
                    className="h-full w-full object-contain md:object-cover hero-video-fade"
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
                  >
                    <source src={HERO_VIDEO_SRC} type="video/mp4" />
                  </video>
                )}
                {canLoadVideo === false && (
                  <iframe
                    className="absolute inset-0 z-0 h-full w-full hero-video-fade"
                    src={HERO_YOUTUBE_EMBED_URL}
                    title="Get Hot hero video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-[#233b50] transition-opacity duration-500 ${
                    isProofEnded ? 'opacity-70' : 'opacity-0'
                  }`}
                />
                {canLoadVideo === true && !isProofPlaying && (
                  <button
                    type="button"
                    aria-label="Play video"
                    className="absolute inset-0 z-10 flex items-center justify-center text-white"
                    onClick={handleProofToggle}
                  >
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#233b50]/70">
                      <Pause className="h-7 w-7" />
                    </span>
                  </button>
                )}
                {canLoadVideo === true && (
                  <button
                    type="button"
                    aria-label={isProofMuted ? 'Unmute video' : 'Mute video'}
                    className="absolute bottom-4 right-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#233b50]/70 text-white transition hover:bg-[#233b50]/80"
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsProofMuted((prev) => !prev);
                    }}
                  >
                    {isProofMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                )}
                {canLoadVideo === false && (
                  <a
                    href={HERO_YOUTUBE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-4 right-4 z-10 rounded-full bg-[#233b50]/70 px-3 py-1 text-xs text-white"
                  >
                    Watch on YouTube
                  </a>
                )}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <div className="absolute bottom-5 left-5 md:bottom-7 md:left-7 max-w-[70%] text-left hidden md:block">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-vostok-text leading-tight">
                      Get Hot
                    </h1>
                    <div className="mt-3 h-px w-20 bg-[#F7F9FB]/70 md:w-28" />
                    <div className="mt-3">
                      <p className="text-sm md:text-lg text-vostok-muted font-semibold tracking-tight min-h-[2rem] md:min-h-[2.5rem] flex items-center">
                        <span key={statementIndex} className="hero-rotating-line">
                          {heroStatements[statementIndex]}
                        </span>
                      </p>
                    </div>
                  </div>
                  <img
                    src="/logo-removebg-preview.png"
                    alt="Vostok Method logo"
                    className="absolute left-4 top-4 object-contain hidden md:block"
                    style={{ width: '120px', height: '120px' }}
                  />
                  <div className="absolute bottom-4 right-16 md:right-20 pointer-events-auto hidden md:block">
                    <a
                      href="https://amoxcenturion.gumroad.com/l/vostokmethod"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        track('sales_page click', { cta: 'get_the_method', section: 'hero' });
                        trackRedditEvent('BreakTheLooksCeiling');
                      }}
                      className="btn-green text-center inline-flex items-center justify-center gap-2 bg-[#233B50] text-[#777676]"
                    >
                      Get The Method
                      <Download className="h-4 w-4 md:h-6 md:w-6" aria-hidden="true" />
                    </a>
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
                    <a
                      href="#premise"
                      aria-label="Scroll to next section"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white/90 text-glow-white transition hover:border-white/70 hover:text-white"
                    >
                      <ChevronDown className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
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
