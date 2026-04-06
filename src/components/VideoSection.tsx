import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { trackSafe } from "@/lib/analytics";
import { toDesktopImage } from "@/lib/utils";

type VideoSectionProps = {
  onClosed?: () => void;
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "reddit" | "twitter" | "direct";
};

const VideoSection = ({ onClosed, entrySource = "direct" }: VideoSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const hasTrackedStart = useRef(false);
  const hasTrackedFinish = useRef(false);
  const videoSources = isMobile
    ? [
        { src: "/website_video_compress_mobile.mp4", type: "video/mp4" },
        { src: "/website_video_web_mobile.webm", type: "video/webm" },
      ]
    : [
        { src: "/website_video_web.webm", type: "video/webm" },
        { src: "/website_video_compress.mp4", type: "video/mp4" },
      ];
  const overlayVideoSrc = "/section_wallpaper/hero/01.mp4";
  const videoKey = isMobile ? "mobile" : "desktop";
  const posterImage = "/1.jpg";
  const mobileHeroImage = "/section_wallpaper/mobile/refined_images/vostok_mobile.jpg";
  const mobileHeroImageWebp = "/section_wallpaper/mobile/refined_images/vostok_mobile.webp";
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
    setHasStarted(false);
  }, [videoKey]);

  useEffect(() => {
    if (!overlayVideoRef.current) {
      return;
    }
    overlayVideoRef.current.currentTime = 0;
    overlayVideoRef.current.load();
  }, [videoKey]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.paused) {
      setHasStarted(true);
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
    <section
      id="hero-video"
      className="relative w-full bg-white md:border-b md:border-black/40 mt-0 mb-0"
    >
      <div className="video-frame relative w-full overflow-hidden bg-black md:px-[14vw] md:pt-[12vh]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[18] hidden h-[24vh] bg-gradient-to-b from-black via-black via-35% to-transparent md:block"
        />
        <div
          className="relative"
          onClick={!isMobile && hasStarted ? togglePlay : undefined}
        >
          {isMobile ? (
            <picture>
              <source srcSet={mobileHeroImageWebp} type="image/webp" />
              <img
                src={mobileHeroImage}
                alt="Vostok Method hero"
                className="video-crop-mobile relative z-10 w-full aspect-video object-cover py-0"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          ) : (
            <>
              <video
                key={videoKey}
                ref={videoRef}
                className="video-crop-mobile relative z-10 w-full aspect-video object-cover py-0 md:h-[66vh] md:py-0 md:object-contain md:aspect-auto"
                poster={toDesktopImage(posterImage)}
                muted={isMuted}
                playsInline
                preload="metadata"
                onPlay={() => {
                  setIsPlaying(true);
                  setHasStarted(true);
                  if (!hasTrackedStart.current) {
                    track("start_video");
                    if (entrySource === "facebook") {
                      track("start_video_facebook");
                    }
                    if (entrySource === "4chan") {
                      track("start_video_4chan");
                    }
                    if (entrySource === "instagram") {
                      track("start_video_instagram");
                    }
                    if (entrySource === "twitter") {
                      track("start_video_twitter");
                    }
                    if (entrySource === "tiktok") {
                      track("start_video_tiktok");
                    }
                    hasTrackedStart.current = true;
                  }
                }}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                  if (!hasTrackedFinish.current) {
                    track("finish_video");
                    if (entrySource === "facebook") {
                      track("finish_video_facebook");
                    }
                    if (entrySource === "4chan") {
                      track("finish_video_4chan");
                    }
                    if (entrySource === "instagram") {
                      track("finish_video_instagram");
                    }
                    if (entrySource === "twitter") {
                      track("finish_video_twitter");
                    }
                    if (entrySource === "tiktok") {
                      track("finish_video_tiktok");
                    }
                    hasTrackedFinish.current = true;
                  }
                  trackSafe("video_closed");
                  setIsClosed(true);
                  onClosed?.();
                }}
              >
                {videoSources.map((source) => (
                  <source key={source.src} src={source.src} type={source.type} />
                ))}
              </video>
              <video
                key={`overlay-${videoKey}`}
                ref={overlayVideoRef}
                className="pointer-events-none absolute inset-0 z-[11] h-full w-full object-cover opacity-20 md:object-contain"
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              >
                <source src={overlayVideoSrc} type="video/mp4" />
              </video>
            </>
          )}
        </div>
        {!isMobile && !hasStarted && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Play video"
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/10"
          >
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/20 bg-white/60 text-black/70 transition-opacity duration-300 hover:border-black/40 hover:bg-white/80">
              <svg
                aria-hidden="true"
                className="ml-1 h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7-11-7z" />
              </svg>
            </span>
          </button>
        )}
        {!isMobile && hasStarted && !isPlaying && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Resume video"
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/10"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/45 bg-black/45 text-white shadow-[0_18px_44px_rgba(0,0,0,0.35)] backdrop-blur-sm">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8"
              >
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            </span>
          </button>
        )}

      </div>
      <div className="mx-auto max-w-3xl px-6 pb-8 pt-4 text-center text-xs leading-relaxed text-black/70 md:pb-10 md:pt-6 md:text-sm md:text-left">
        {entrySource === "4chan" ? (
          <div className="text-center">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-black/70 md:text-base">
              The Environment Is Mogging You
            </h3>
            <p className="mt-3 text-black/70">
              Gravity never takes a day off. Every year it pulls your face downward millimeter by
              millimeter. Smog. Pollution. Pet hair. Smoke. Your nose clogs. Your airway shrinks.
              The face collapses inward. Then we make it worse. We eat food so soft a toddler
              could chew it. No resistance. No strain. No development. Jaw weak. Chin recessed.
              And then we stare down at glowing rectangles all day. Head forward. Neck folded.
              Spine collapsing. Your posture decays. Your jawline disappears. Eyes locked six
              inches from a screen. Distance vision fades. Eye muscles weaken. The modern
              environment is not neutral. It is actively degrading the human face.
            </p>
          </div>
        ) : (
          <>
            This video explains how gravity—an unrelenting force—sags the face. Smog, pollution,
            pet hair, and smoke can clog the nose and reduce nasal capacity, which can contribute
            to a recessed face. Soft foods weaken jaw and chin projection, leading to a weaker
            face. On top of that, constantly looking down at our phones and screens weakens head
            posture, reducing neck and jaw strength. Prolonged screen focus also reduces distance
            vision and strains the eyes.
          </>
        )}
      </div>
    </section>
  );
};

export default VideoSection;
