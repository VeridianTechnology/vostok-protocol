import { useEffect, useRef, useState } from 'react';
import { Pause, Volume2, VolumeX } from 'lucide-react';
import { shouldLoadVideo as shouldLoadFullVideo } from '@/utils/videoGate';

const FULL_VIDEO_SRC = '/full.webm';
const YOUTUBE_URL = 'https://youtube.com/shorts/8NyVss60n7g?feature=share';
const YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed/8NyVss60n7g?feature=share';
const POSTER_SRC = '/coverjp.jpg';

const PremiseSection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canLoadVideo, setCanLoadVideo] = useState<boolean | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();
    mediaQuery.addEventListener('change', updateIsMobile);
    return () => mediaQuery.removeEventListener('change', updateIsMobile);
  }, []);

  const handleTogglePlayback = () => {
    if (!videoRef.current) {
      return;
    }
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section id="premise" className="section section-tight-mobile">
      <div className="section-inner">
        <div className="divider-neon mb-10 bg-[#F7F9FB]/60" />
        
        <div className="card-shell card-shell-dark fixed-opacity-card mx-auto max-w-5xl">
          <div className="mb-8 text-center text-3xl md:text-4xl font-semibold text-vostok-text text-glow text-glow-white">
            The Crazy Thing... This Actually Works, I'm proof...
          </div>
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
            <div className="w-full max-w-sm md:w-[30rem] md:max-w-none md:flex-none">
              <div className="relative w-full aspect-[9/16] bg-[#0E0E0E] rounded-none md:rounded-2xl overflow-hidden">
                <img
                  src={POSTER_SRC}
                  alt="Video preview"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                {canLoadVideo === true && (
                  <>
                    <video
                      ref={videoRef}
                      className={`absolute inset-0 z-10 h-full w-full object-cover ${
                        isMobile ? 'border-[3px] border-white shadow-[0_0_6px_rgba(255,255,255,0.35)]' : ''
                      }`}
                      poster={POSTER_SRC}
                      muted={isMuted}
                      preload="metadata"
                      playsInline
                      onClick={handleTogglePlayback}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                    >
                      <source src={FULL_VIDEO_SRC} type="video/webm" />
                    </video>
                    {!isPlaying && (
                      <button
                        type="button"
                        aria-label="Play video"
                        className="absolute inset-0 z-20 flex items-center justify-center text-white"
                        onClick={handleTogglePlayback}
                      >
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-black/70">
                          <Pause className="h-6 w-6" />
                        </span>
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/80"
                      onClick={(event) => {
                        event.stopPropagation();
                        setIsMuted((prev) => !prev);
                      }}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </>
                )}
                {canLoadVideo === false && (
                  <iframe
                    className={`absolute inset-0 z-10 h-full w-full ${
                      isMobile ? 'border-[3px] border-white shadow-[0_0_6px_rgba(255,255,255,0.35)]' : ''
                    }`}
                    src={YOUTUBE_EMBED_URL}
                    title="The Crazy Thing... This Actually Works, I'm proof..."
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
                {canLoadVideo === false && (
                  <a
                    href={YOUTUBE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 z-20 rounded-full bg-black/70 px-3 py-1 text-xs text-white"
                  >
                    Watch on YouTube
                  </a>
                )}
              </div>
            </div>
            <div className="premise-split-line" aria-hidden="true" />
            <div className="block text-xs md:text-sm lg:text-lg text-vostok-text font-semibold text-glow text-glow-white leading-relaxed text-center md:text-left mt-0 self-start pt-3 md:pt-4">
              <p>
                I got into looksmaxxing for a simple reason: my dating pool was shrinking.
                <br />
                I was over 30, and “game” wasn’t fixing the problem.
                <br />
                <br />
                Then I learned the uncomfortable truth: your face is the fastest shortcut in dating — and in every social room you walk into.
                <br />
                Not because it turns you into a different person…
                <br />
                but because it improves every interaction in ways you don’t notice until it’s already working.
                <br />
                <br />
                Here’s why it works: the face is muscle.
                <br />
                Where the muscle goes, the bone will follow.
                <br />
                Your skull and face are more movable than you’ve been told — and that makes the face surprisingly easy to change.
                <br />
                <br />
                This video breaks down the mindset, the logic, and why the Vostok Method exists:
                <br />
                hundreds of hours of experimentation and expertise, boiled down into one PDF — step-by-step — so you can follow it without guessing.
              </p>
            </div>
          </div>
        </div>
        
        <div className="divider-neon mt-10 bg-[#F7F9FB]/60" />
      </div>
    </section>
  );
};

export default PremiseSection;
