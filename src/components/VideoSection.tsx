import { useEffect, useRef, useState } from "react";

type VideoSectionProps = {
  onClosed?: () => void;
};

const VideoSection = ({ onClosed }: VideoSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const videoSrc = isMobile ? "/website_video_web_mobile.webm" : "/website_video_web.webm";

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMatch = () => setIsMobile(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.pause();
    videoRef.current.load();
    setIsPlaying(false);
    setIsReady(false);
  }, [videoSrc]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.paused) {
      try {
        setIsMuted(false);
        video.muted = false;
        await video.play();
      } catch {
        return;
      }
    } else {
      video.pause();
    }
  };

  if (isClosed) {
    return null;
  }

  return (
    <section id="hero-video" className="relative w-full bg-black">
      <div className="relative w-full overflow-hidden border-y border-white/40 md:border-white/50">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/5 opacity-70" />
        <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-full gradient-silver opacity-80" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full gradient-silver opacity-80" />
        <video
          ref={videoRef}
          className="relative z-10 h-[42vh] w-full object-contain py-1 md:h-[78vh] md:py-6"
          src={videoSrc}
          muted={isMuted}
          controls
          controlsList="nodownload noplaybackrate"
          playsInline
          preload="metadata"
          onCanPlay={() => setIsReady(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsClosed(true);
            onClosed?.();
          }}
        />

        {isReady && !isPlaying && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Play video"
            className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-foreground transition-opacity duration-300 hover:border-white/60 hover:bg-black/60"
          >
            <svg
              aria-hidden="true"
              className="ml-1 h-6 w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7-11-7z" />
            </svg>
          </button>
        )}

      </div>
    </section>
  );
};

export default VideoSection;
