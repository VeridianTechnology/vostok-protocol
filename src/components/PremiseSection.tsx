import { useRef, useState } from 'react';
import { Pause } from 'lucide-react';

const PremiseSection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
              <div className="relative w-full aspect-[9/16] bg-[#0E0E0E] rounded-2xl overflow-hidden">
                <img
                  src="/preload.jpg"
                  alt="Video preview"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <video
                  ref={videoRef}
                  className="relative z-10 h-full w-full object-cover"
                  poster="/preload.jpg"
                  preload="metadata"
                  playsInline
                  onClick={handleTogglePlayback}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                >
                  <source
                    src="/videos/main_video_mobile_copy_562x968.webm"
                    type="video/webm"
                    media="(max-width: 767px)"
                  />
                  <source
                    src="/videos/main_video_ultra_compressed_copy_562x968.webm"
                    type="video/webm"
                    media="(min-width: 768px)"
                  />
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
