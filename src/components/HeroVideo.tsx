import { useEffect, useRef, useState } from "react";
import "./HeroVideo.css";

const VIDEO_SRC = "/videos/main_video_ultra_compressed.webm";
const POSTER_SRC = "/preload.jpg";
const FALLBACK_SRC = "/main_simple.jpg";
const SPEED_THRESHOLD_MBPS = 1.5;

const HeroVideo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [canLoadVideo, setCanLoadVideo] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);

  // Detect coarse pointers to treat them as mobile (no autoplay).
  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Lightweight throughput check to decide whether to load the video at all.
  useEffect(() => {
    let cancelled = false;

    const supportsWebm = () => {
      const el = document.createElement("video");
      return el.canPlayType("video/webm") !== "";
    };

    const runSpeedTest = async () => {
      if (!supportsWebm()) {
        if (!cancelled) {
          setCanLoadVideo(false);
        }
        return;
      }

      try {
        const start = performance.now();
        const res = await fetch(`/ping.txt?ts=${Date.now()}`, { cache: "no-store" });
        const blob = await res.blob();
        const end = performance.now();
        const seconds = Math.max(0.001, (end - start) / 1000);
        const mbps = (blob.size * 8) / seconds / 1_000_000;
        if (!cancelled) {
          setCanLoadVideo(mbps >= SPEED_THRESHOLD_MBPS);
        }
      } catch {
        if (!cancelled) {
          setCanLoadVideo(false);
        }
      }
    };

    runSpeedTest();
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the media element muted state in sync with UI.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const showVideo = canLoadVideo === true;
  const showFallback = canLoadVideo === false || isVideoEnded;
  const showPoster = !showFallback && !hasStartedOnce;
  const showPlayIcon = showVideo && !isPlaying && !showFallback;
  const revealVideo = isVideoReady && !showFallback && (!isMobile || hasStartedOnce);

  const handleTogglePlay = async () => {
    if (!videoRef.current || !showVideo) {
      return;
    }

    if (isVideoEnded) {
      videoRef.current.currentTime = 0;
      setIsVideoEnded(false);
    }

    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        await videoRef.current.play();
      }
    } catch {
      // Ignore autoplay/play errors; user can retry via tap/click.
    }
  };

  const handleAudioToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setHasStartedOnce(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsVideoEnded(true);
  };

  return (
    <div className="hero-video" onClick={handleTogglePlay}>
      <img
        src={FALLBACK_SRC}
        alt="The Vostok Method book cover"
        className={`hero-video__layer hero-video__fallback ${showFallback ? "is-visible" : ""}`}
      />

      {showVideo && (
        <video
          ref={videoRef}
          className={`hero-video__layer hero-video__media ${revealVideo ? "is-visible" : ""}`}
          src={VIDEO_SRC}
          autoPlay={!isMobile}
          muted={isMuted}
          playsInline
          preload="metadata"
          onLoadedData={() => setIsVideoReady(true)}
          onCanPlay={() => setIsVideoReady(true)}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onError={() => setCanLoadVideo(false)}
        />
      )}

      <img
        src={POSTER_SRC}
        alt="Video preload"
        className={`hero-video__layer hero-video__poster ${showPoster ? "is-visible" : ""}`}
      />

      {showPlayIcon && (
        <div className="hero-video__play">
          <svg viewBox="0 0 64 64" aria-hidden="true" role="img">
            <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" fill="none" />
            <polygon points="26,20 48,32 26,44" fill="currentColor" />
          </svg>
        </div>
      )}

      {showVideo && (
        <button
          type="button"
          className="hero-video__audio"
          onClick={handleAudioToggle}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          <svg viewBox="0 0 64 64" aria-hidden="true" role="img">
            <path
              d="M14 26h10l12-10v32L24 38H14z"
              fill="currentColor"
            />
            {isMuted ? (
              <path
                d="M44 24l14 16m0-16L44 40"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M44 24c6 4 6 12 0 16m6-22c10 7 10 22 0 30"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </svg>
        </button>
      )}
    </div>
  );
};

export default HeroVideo;
