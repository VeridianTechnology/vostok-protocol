import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type AccessProtocolModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AccessProtocolModal = ({ isOpen, onClose }: AccessProtocolModalProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoFading, setIsVideoFading] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [posterVisible, setPosterVisible] = useState(false);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setIsMuted(true);
    setIsVideoFading(false);
    setShowPoster(false);
    setPosterVisible(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !videoRef.current) {
      return;
    }

    videoRef.current.muted = isMuted;
    if (!isMuted) {
      videoRef.current.volume = 0.7;
    }
  }, [isMuted, isOpen]);

  useEffect(() => {
    if (!showPoster) {
      return;
    }

    setPosterVisible(false);
    const raf = requestAnimationFrame(() => {
      setPosterVisible(true);
    });

    return () => cancelAnimationFrame(raf);
  }, [showPoster]);

  if (!isOpen) {
    return null;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-3 sm:px-6">
      <div className="absolute inset-0 bg-black/85" onClick={onClose} aria-hidden="true" />
      <div className="relative w-[98vw] h-[92vh] sm:w-[95vw] sm:h-[90vh] max-w-[96vw] bg-black border border-vostok-neon/30 shadow-2xl rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute z-20 w-12 h-12 rounded-full border-2 border-vostok-neon text-vostok-neon text-3xl hover:bg-vostok-neon/20 transition bg-vostok-bg shadow-lg flex items-center justify-center"
          style={{ top: '2.5rem', right: '2.5rem' }}
          aria-label="Close access protocol"
        >
          X
        </button>
        <div className="protocol-scroll h-full w-full flex flex-col gap-6 p-6 sm:p-10 overflow-y-auto">
          <div className="flex-none flex items-center justify-center">
            <div className="relative w-full rounded-2xl border border-vostok-neon/25 bg-black shadow-inner flex items-center justify-center overflow-hidden">
              {!showPoster ? (
                <>
                  <div className="protocol-video-frame">
                    <div className="protocol-video-inner">
                    <video
                      ref={videoRef}
                      className={`h-full w-auto transition-opacity duration-[2000ms] ${
                        isVideoFading ? 'opacity-0' : 'opacity-100'
                      }`}
                      src="/compressed-buyvideo.mp4"
                      autoPlay
                      playsInline
                      onLoadedMetadata={() => {
                        if (videoRef.current) {
                          videoRef.current.volume = 0.7;
                        }
                      }}
                      onEnded={() => {
                        setIsVideoFading(true);
                        window.setTimeout(() => {
                          setShowPoster(true);
                          setIsVideoFading(false);
                        }, 2000);
                      }}
                    />
                    </div>
                    <div className="protocol-video-scanlines" aria-hidden="true" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMuted((prev) => !prev)}
                    className="absolute top-3 left-3 rounded-full border border-vostok-neon/40 bg-black/70 px-3 py-1 text-xs font-mono text-vostok-neon hover:bg-black/90 transition"
                  >
                    {isMuted ? 'AUDIO OFF' : 'AUDIO ON'}
                  </button>
                </>
              ) : (
                <div className="protocol-video-frame">
                  <div className="protocol-video-inner">
                  <img
                    src="/vostok4.png"
                    alt="The Vostok Method"
                    className={`h-full w-auto transition-opacity duration-1000 ${
                      posterVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  </div>
                  <div className="protocol-video-scanlines" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>
          <div className="flex-[1] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: '1. Creator Direct (Gumroad) — Recommended',
                bullets: [
                  'Best for you. Best for the author. Unlimited updates.',
                  'Instant PDF download',
                  'Free future editions forever (always get the newest version)',
                  'DRM-free, offline access',
                  'Supports creators directly—highest revenue share',
                ],
                cta: 'Gumroad',
                color: '#7CFF73',
              },
              {
                title: '2. Fast Checkout (Lemon Squeezy)',
                bullets: [
                  'Great for EU buyers + still supports updates.',
                  'Clean, minimal checkout',
                  'Includes access to future updates',
                  'Handles VAT automatically (EU-friendly)',
                  'Secure digital delivery',
                ],
                cta: 'Lemon Squeezy',
                color: '#C4FF88',
              },
              {
                title: '3. Kindle Edition (Amazon Books)',
                bullets: [
                  'Best for Kindle readers. Limited flexibility.',
                  'Works on all Kindle devices',
                  'Cloud-sync reading',
                  'Formatting converted to Kindle layout',
                  'No automatic updates — new editions must be repurchased',
                  'Least supportive to creators',
                ],
                cta: 'Amazon Books',
                color: '#FFCA5F',
              },
              {
                title: '4. Apple Books Edition',
                bullets: [
                  'For people deeply inside the Apple ecosystem.',
                  'Seamless reading on iPhone/iPad/Mac',
                  'iCloud sync',
                  'Updates require store approval',
                  'Apple takes a large cut, less direct support',
                  'Most restricted version',
                ],
                cta: 'Apple Books Edition',
                color: '#FF7A6B',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="flex flex-col justify-between rounded-2xl border border-vostok-neon/25 bg-black/60 p-5 shadow-lg"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-vostok-neon">{card.title}</h3>
                  <ul className="space-y-2 text-sm text-vostok-muted list-disc list-inside">
                    {card.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  className="mt-5 w-full rounded-full px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
                  style={{ backgroundColor: card.color }}
                >
                  {card.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AccessProtocolModal;
