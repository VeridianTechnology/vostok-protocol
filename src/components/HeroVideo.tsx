import { useEffect, useRef, useState } from "react";
import "./HeroVideo.css";

const VIDEO_SRC = "/videos/main_video_ultra_compressed.webm";
const POSTER_SRC = "/preload.jpg";
const FALLBACK_SRC = "/main_simple.jpg";
const FADE_OUT_AT_SECONDS = 0;

const HeroVideo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);

  useEffect(() => {
    const onLoad = () => setShouldLoadVideo(true);
    if (document.readyState === "complete") {
      setShouldLoadVideo(true);
      return;
    }
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo || !videoRef.current || loadFailed) {
      return;
    }

    const video = videoRef.current;
    if (!video.src) {
      video.src = VIDEO_SRC;
      video.load();
    }

    const attemptPlay = async () => {
      try {
        video.muted = true;
        await video.play();
      } catch {
        // Autoplay can fail; keep the preload image visible.
      }
    };

    attemptPlay();
  }, [shouldLoadVideo, loadFailed]);

  // Keep the media element muted state in sync with UI.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const showFallback = isVideoEnded;
  const showPoster = !showFallback && !isVideoVisible;
  const showVideo = shouldLoadVideo && !loadFailed;
  const showPlayIcon = showVideo && !isPlaying && !showFallback && isVideoReady;
  const revealVideo = isVideoVisible && !showFallback;

  const handleTogglePlay = async () => {
    if (!videoRef.current || !showVideo || isVideoEnded) {
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
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsVideoEnded(true);
  };

  return (
    <div className="hero-video">
      <img
        src={FALLBACK_SRC}
        alt="The Vostok Method book cover"
        className={`hero-video__layer hero-video__fallback ${showFallback ? "is-visible" : ""}`}
      />

      {showVideo && (
        <video
          ref={videoRef}
          className={`hero-video__layer hero-video__media ${revealVideo ? "is-visible" : ""}`}
          autoPlay
          muted={isMuted}
          playsInline
          loop
          preload="none"
          onLoadedData={() => setIsVideoReady(true)}
          onCanPlay={() => setIsVideoReady(true)}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onTimeUpdate={(event) => {
            if (FADE_OUT_AT_SECONDS <= 0 || isVideoEnded) {
              return;
            }
            const current = event.currentTarget.currentTime;
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

      {showVideo && !showFallback && (
        <div className="hero-video__controls">
          <button
            type="button"
            className="hero-video__toggle"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            <svg viewBox="0 0 64 64" aria-hidden="true" role="img">
              {isPlaying ? (
                <>
                  <rect x="20" y="18" width="8" height="28" fill="currentColor" />
                  <rect x="36" y="18" width="8" height="28" fill="currentColor" />
                </>
              ) : (
                <polygon points="24,18 46,32 24,46" fill="currentColor" />
              )}
            </svg>
          </button>
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
    </div>
  );
};

export default HeroVideo;
