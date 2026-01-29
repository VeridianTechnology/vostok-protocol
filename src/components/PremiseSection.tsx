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
    <section id="premise" className="section">
      <div className="section-inner">
        <div className="divider-neon mb-10 bg-[#EDEDED]/60" />
        
        <div className="card-shell card-shell-clear">
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-12">
            <div className="w-full max-w-sm md:w-[30rem] md:max-w-none md:flex-none">
              <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-[#EDEDED]">
                WATCH: What the Vostok Method Actually Does — and Why It Works
              </p>
              <div className="relative w-full aspect-[9/16] bg-[#0E0E0E] rounded-2xl overflow-hidden">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
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
                    className="absolute inset-0 flex items-center justify-center text-white"
                    onClick={handleTogglePlayback}
                  >
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-black/70">
                      <Pause className="h-6 w-6" />
                    </span>
                  </button>
                )}
              </div>
            </div>
            <p className="hidden md:block text-xl md:text-2xl lg:text-3xl text-white font-semibold text-glow text-glow-white leading-relaxed text-left mt-0 self-start md:pt-[2.2rem]">
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
              The real secret is this: the face is modifiable.
              <br />
              And I’m living proof.
              <br />
              <br />
              This video explains the mindset, the logic, and why the Vostok Method exists:
              <br />
              hundreds of hours of experimentation and expertise, boiled down into one PDF — step-by-step — so you can follow it without guessing.
            </p>
          </div>
        </div>
        
        <div className="divider-neon mt-10 bg-[#EDEDED]/60" />
      </div>
    </section>
  );
};

export default PremiseSection;
