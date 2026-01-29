import { useEffect, useRef, useState } from "react";
import "./HeroVideo.css";

const VIDEO_SRC = "/videos/main_video_ultra_compressed_copy_562x968.webm";
const MOBILE_VIDEO_SRC = "/videos/main_video_mobile_copy_562x968.webm";
const POSTER_SRC = "/preload.jpg";
const FALLBACK_SRC = "";
const FADE_OUT_AT_SECONDS = 0;

const HeroVideo = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    const onLoad = () => {
      if (!isMobile && isInView) {
        setShouldLoadVideo(true);
      }
    };
    if (document.readyState === "complete") {
      if (!isMobile && isInView) {
        setShouldLoadVideo(true);
      }
      return;
    }
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [isMobile, isInView]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo || !videoRef.current || loadFailed) {
      return;
    }

    const video = videoRef.current;
    if (!video.src) {
      video.src = isMobile ? MOBILE_VIDEO_SRC : VIDEO_SRC;
      video.load();
    }

    const attemptPlay = async () => {
      try {
        video.muted = true;
        if (!isMobile || hasInteracted) {
          await video.play();
        }
      } catch {
        // Autoplay can fail; keep the preload image visible.
      }
    };

    attemptPlay();
  }, [shouldLoadVideo, loadFailed, isMobile, hasInteracted]);

  // Keep the media element muted state in sync with UI.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const showFallback = false;
  const showPoster = !isVideoVisible || (isMobile && !hasInteracted);
  const showVideo = shouldLoadVideo && isInView && !loadFailed;
  const showPlayIcon =
    isMobile && !isPlaying && !showFallback && (!shouldLoadVideo || !isVideoVisible);
  const revealVideo = isVideoVisible && !showFallback;

  const handleTogglePlay = async () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    if (!shouldLoadVideo) {
      setShouldLoadVideo(true);
    }

    if (isMobile && !isPlaying) {
      setIsLoading(true);
    }

    if (!videoRef.current || isVideoEnded || !showVideo) {
      return;
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
    setIsVideoVisible(true);
    setIsLoading(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsVideoEnded(true);
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) {
      return;
    }
    const nextTime = Number(event.target.value);
    videoRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div className="hero-video" ref={containerRef} onClick={handleTogglePlay}>
      {FALLBACK_SRC ? (
        <img
          src={FALLBACK_SRC}
          alt="The Vostok Method book cover"
          loading="lazy"
          decoding="async"
          className={`hero-video__layer hero-video__fallback ${showFallback ? "is-visible" : ""}`}
        />
      ) : null}

      {showVideo && (
        <video
          ref={videoRef}
          className={`hero-video__layer hero-video__media ${revealVideo ? "is-visible" : ""} ${isVideoEnded ? "is-ended" : ""}`}
          autoPlay
          muted={isMuted}
          playsInline
          preload="none"
          onLoadedData={() => setIsVideoReady(true)}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration || 0);
            }
          }}
          onCanPlay={() => setIsVideoReady(true)}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onTimeUpdate={(event) => {
            const current = event.currentTarget.currentTime;
            setCurrentTime(current);
            if (FADE_OUT_AT_SECONDS <= 0 || isVideoEnded) {
              return;
            }
            if (current >= FADE_OUT_AT_SECONDS) {
              event.currentTarget.pause();
              setIsVideoEnded(true);
            }
          }}
          onError={() => setLoadFailed(true)}
        />
      )}

      <img
        src={POSTER_SRC}
        alt="Video preload"
        loading="lazy"
        decoding="async"
        className={`hero-video__layer hero-video__poster ${showPoster ? "is-visible" : ""}`}
      />

      {showPlayIcon && (
        <div className={`hero-video__play ${isPlaying ? "is-hidden" : ""}`}>
          <svg viewBox="0 0 64 64" aria-hidden="true" role="img">
            <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" fill="none" />
            <polygon points="26,20 48,32 26,44" fill="currentColor" />
          </svg>
        </div>
      )}

      {isMobile && isLoading && !isPlaying && !showFallback && (
        <div className="hero-video__loading" aria-live="polite">
          Loading…
        </div>
      )}

      {showVideo && !showFallback && (
        <div className="hero-video__controls">
          <button
            type="button"
            className="hero-video__audio"
            onClick={handleAudioToggle}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            <svg viewBox="0 0 64 64" aria-hidden="true" role="img">
              <path d="M14 26h10l12-10v32L24 38H14z" fill="currentColor" />
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
        </div>
      )}

      {showVideo && revealVideo && duration > 0 && !showFallback && (
        <div className="hero-video__scrub" onClick={(event) => event.stopPropagation()}>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={Math.min(currentTime, duration)}
            onChange={handleSeek}
            aria-label="Video scrubber"
          />
        </div>
      )}
    </div>
  );
};

export default HeroVideo;
