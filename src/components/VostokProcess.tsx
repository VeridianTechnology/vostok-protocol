import { m } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { getImageVariants } from "@/lib/utils";

type StageKey = "before" | "20" | "45" | "70" | "100";

type VostokProcessProps = {
  onLoaded?: () => void;
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "direct";
};

const getThumbVariants = (src: string) => {
  if (!src.endsWith(".jpg") && !src.endsWith(".jpeg")) {
    return null;
  }
  const match = src.match(/(\.jpe?g)$/i);
  if (!match) {
    return null;
  }
  const ext = match[1];
  const base = src.slice(0, -ext.length);
  return {
    mobile: {
      jpg: `${base}_thumb_mobile${ext}`,
      avif: `${base}_thumb_mobile.avif`,
      webp: `${base}_thumb_mobile.webp`,
    },
    desktop: {
      jpg: `${base}_thumb_desktop${ext}`,
      avif: `${base}_thumb_desktop.avif`,
      webp: `${base}_thumb_desktop.webp`,
    },
  };
};

const stages = [
  {
    key: "before",
    title: "Before Vostok",
    icons: ["/Comparison/3z.jpg", "/Comparison/4z.jpg"],
    text: (
      <>
        <p>
          Life was dull. Flat. Almost depressing.
        </p>
        <p className="mt-4">
          I couldn&apos;t understand why I wasn&apos;t getting the women I wanted, why attention
          felt slipping, why I—someone who had always been &quot;conventionally attractive&quot;—was
          suddenly getting outshined.
        </p>
        <p className="mt-4">
          I dipped into the looksmaxxing community, but most of it was noise. Still, every now
          and then, when I actually <em>did</em> a technique properly, I noticed something
          disturbing:
        </p>
        <p className="mt-4">
          <strong>My face genuinely improved.</strong>
        </p>
        <p className="mt-4">That&apos;s what pulled me in.</p>
      </>
    ),
  },
  {
    key: "20",
    title: "20 Hours of Vostok",
    icons: ["/Comparison/5z.jpg", "/Comparison/6z.jpg"],
    text: (
      <>
        <p>This is when things started to click.</p>
        <p className="mt-4">
          I wasn&apos;t obsessed yet, but once I sharpened a few muscles and angles, the world
          shifted. It was like gravity tilted in my favor.
        </p>
        <p className="mt-4">People were warmer. More open.</p>
        <p className="mt-4">
          I felt the first real <em>pull</em> of Vostok—<br />
          and it was addictive.
        </p>
      </>
    ),
  },
  {
    key: "45",
    title: "45 Hours of Vostok",
    icons: ["/Comparison/9z.jpg", "/Comparison/10z.jpg"],
    text: (
      <>
        <p>This stage hit hard.</p>
        <p className="mt-4">
          I started walking around like I was the most attractive guy in whatever room I
          entered. And honestly—
        </p>
        <p className="mt-4">I wasn&apos;t wrong.</p>
        <p className="mt-4">
          Cashiers acted differently. Girls responded instantly. Even my own mother couldn&apos;t
          understand the sudden spike in female attention.
        </p>
        <p className="mt-4">
          It was overwhelming at times, but I felt like I&apos;d unlocked a cheat code.
        </p>
      </>
    ),
  },
  {
    key: "70",
    title: "70 Hours of Vostok",
    icons: ["/Comparison/8z.jpg", "/Comparison/7z.jpg"],
    text: (
      <>
        <p>By now I thought I was untouchable.</p>
        <p className="mt-4">
          Results were obvious, not subtle. Strangers double-took. Women initiated more.
        </p>
        <p className="mt-4">
          I started questioning everything:
          <br />
          <strong>Is this really all looks? Did I just uncover something no one&apos;s been talking about?</strong>
        </p>
        <p className="mt-4">The answer was becoming clearer: yes.</p>
      </>
    ),
  },
  {
    key: "100",
    title: "100 Hours of Vostok",
    icons: ["/Comparison/1z.jpg", "/Comparison/2z.jpg"],
    text: (
      <>
        <p>Then I moved to Thailand and finished the full protocol.</p>
        <p className="mt-4">This is where everything exploded.</p>
        <p className="mt-4">
          While writing this out right now, a woman sat herself at my table—uninvited—and
          started flirting nonstop.
        </p>
        <p className="mt-4">Meanwhile, my girlfriend, a literal model, was asleep back home.</p>
        <p className="mt-4">That&apos;s when it hit me:</p>
        <p className="mt-4">
          Tall guys, muscular guys, rich guys—doesn&apos;t matter.
          <br />
          <strong>If your face wins the sexual signal game, you win.</strong>
        </p>
        <p className="mt-4">
          Life is cleaner, lighter, easier… and I haven&apos;t even maxed out the method yet.
        </p>
      </>
    ),
  },
];

const VostokProcess = ({ onLoaded, entrySource = "direct" }: VostokProcessProps) => {
  const [activeStage, setActiveStage] = useState<StageKey>("before");
  const [activeImage, setActiveImage] = useState("/Comparison/3z.jpg");
  const [parallaxShift, setParallaxShift] = useState(0);
  const [gridShift, setGridShift] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const activeStageRef = useRef(activeStage);
  const activeImageRef = useRef(activeImage);
  const rotationTimerRef = useRef<number | null>(null);
  const parallaxRef = useRef<number | null>(null);
  const flashTimersRef = useRef<number[]>([]);
  const isFlashingRef = useRef(false);
  const imageFrameRef = useRef<HTMLDivElement | null>(null);
  const currentStage = stages.find((stage) => stage.key === activeStage) ?? stages[0];
  const activeVariants = getImageVariants(activeImage);
  const handleGridShift = () => {
    const nextX = Math.round((Math.random() - 0.5) * 120);
    const nextY = Math.round((Math.random() - 0.5) * 120);
    setGridShift({ x: nextX, y: nextY });
  };
  const iconSequence = useMemo(
    () =>
      stages.flatMap((stage) =>
        stage.icons.map((icon) => ({ stageKey: stage.key as StageKey, icon }))
      ),
    []
  );

  const selectStage = (stageKey: StageKey, image: string) => {
    if (rotationTimerRef.current) {
      window.clearInterval(rotationTimerRef.current);
      rotationTimerRef.current = null;
    }
    setActiveStage(stageKey);
    setActiveImage(image);
  };

  useEffect(() => {
    activeStageRef.current = activeStage;
    activeImageRef.current = activeImage;
  }, [activeStage, activeImage]);

  const startRotation = () => {
    if (rotationTimerRef.current) {
      window.clearInterval(rotationTimerRef.current);
    }
    rotationTimerRef.current = window.setInterval(() => {
      if (isFlashingRef.current) {
        return;
      }
      const currentIndex = iconSequence.findIndex(
        (entry) =>
          entry.stageKey === activeStageRef.current && entry.icon === activeImageRef.current
      );
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % iconSequence.length;
      const next = iconSequence[nextIndex];
      setActiveStage(next.stageKey);
      setActiveImage(next.icon);
    }, 35000);
  };

  useEffect(() => {
    startRotation();
    return () => {
      if (rotationTimerRef.current) {
        window.clearInterval(rotationTimerRef.current);
      }
    };
  }, [iconSequence]);

  useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        return;
      }
      parallaxRef.current = window.requestAnimationFrame(() => {
        parallaxRef.current = null;
        const offset = window.scrollY * 0.08;
        setParallaxShift(Math.min(offset, 40));
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (parallaxRef.current) {
        window.cancelAnimationFrame(parallaxRef.current);
        parallaxRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMatch = () => setIsMobile(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  useEffect(() => {
    if (!isMobile || !imageFrameRef.current) {
      return;
    }

    const stopFlashing = () => {
      isFlashingRef.current = false;
      flashTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      flashTimersRef.current = [];
      setShowFlash(false);
    };

    const startFlashing = () => {
      if (isFlashingRef.current) {
        return;
      }
      isFlashingRef.current = true;
      if (rotationTimerRef.current) {
        window.clearInterval(rotationTimerRef.current);
        rotationTimerRef.current = null;
      }

      const sequence = iconSequence;
      const imageDuration = 700;
      const flashDuration = 120;
      let index = 0;

      const step = () => {
        if (!isFlashingRef.current) {
          return;
        }
        const entry = sequence[index];
        setActiveStage(entry.stageKey);
        setActiveImage(entry.icon);

        const flashTimer = window.setTimeout(() => {
          setShowFlash(true);
        }, imageDuration);
        const nextTimer = window.setTimeout(() => {
          setShowFlash(false);
          index += 1;
          if (index >= sequence.length) {
            isFlashingRef.current = false;
            startRotation();
            return;
          }
          step();
        }, imageDuration + flashDuration);

        flashTimersRef.current.push(flashTimer, nextTimer);
      };

      step();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startFlashing();
        } else {
          stopFlashing();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(imageFrameRef.current);

    return () => {
      observer.disconnect();
      stopFlashing();
    };
  }, [iconSequence, isMobile]);

  return (
    <section
      id="vostok-process"
      className="relative isolate left-1/2 right-1/2 w-screen -translate-x-1/2 px-6 -mt-8 pt-[10vh] pb-8 md:mt-0 md:py-14 overflow-hidden"
      onClick={handleGridShift}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#b9b9b9]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-black/15" />
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-white/35 blur-[90px]" />
        <div className="absolute -right-24 bottom-6 h-80 w-80 rounded-full bg-black/15 blur-[110px]" />
        <div
          className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-35 transition-transform duration-700"
          style={{
            transform: `translate3d(calc(-50% + ${gridShift.x + parallaxShift}px), calc(-50% + ${gridShift.y - parallaxShift}px), 0)`,
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,0.22) 1px, transparent 1px), linear-gradient(0deg, rgba(0,0,0,0.22) 1px, transparent 1px)",
            backgroundSize: "40px 40px, 40px 40px",
            backgroundPosition: "0 0, 0 0",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.15),transparent_60%)]" />
      </div>
      <p className="relative z-10 mb-6 text-center text-sm uppercase tracking-[0.35em] text-black font-semibold md:mb-8 md:text-base">
        The Vostok Process
      </p>
      {entrySource === "4chan" && (
        <p className="relative z-10 mx-auto mb-6 max-w-2xl text-center text-sm text-black/70">
          Blackpill doom is a loop. This is the off-ramp: 4s to 7s, 6s to 9s. It stacks the more
          you work it and keeps you out of the incel spiral.
        </p>
      )}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row md:items-stretch md:gap-12">
        <div className="md:w-3/5">
          <div
            ref={imageFrameRef}
            className="relative z-20 isolate aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/40 bg-black shadow-[0_0_70px_rgba(255,255,255,0.45)] md:aspect-auto md:h-full"
          >
            <div className="absolute inset-0 z-0 bg-black" />
            {activeVariants ? (
              <picture>
                <source
                  type="image/avif"
                  srcSet={`${activeVariants.avif.mobile} 640w, ${activeVariants.avif.desktop} 1600w`}
                  sizes="(max-width: 640px) 100vw, 60vw"
                />
                <source
                  type="image/webp"
                  srcSet={`${activeVariants.webp.mobile} 640w, ${activeVariants.webp.desktop} 1600w`}
                  sizes="(max-width: 640px) 100vw, 60vw"
                />
                <img
                  src={activeVariants.desktop}
                  srcSet={`${activeVariants.mobile} 640w, ${activeVariants.desktop} 1600w`}
                  sizes="(max-width: 640px) 100vw, 60vw"
                  alt={`${currentStage.title} comparison`}
                  className="relative z-10 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            ) : (
              <img
                src={activeImage}
                alt={`${currentStage.title} comparison`}
                className="relative z-10 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
            <div
              className={`pointer-events-none absolute inset-0 z-20 bg-white transition-opacity duration-150 ${
                showFlash ? "opacity-90" : "opacity-0"
              }`}
            />
          </div>
        </div>
        <div className="md:w-2/5">
          <div className="w-full rounded-2xl border border-white/15 bg-black/70 p-5 text-white/85 shadow-[0_24px_60px_rgba(0,0,0,0.55)] md:h-full md:p-6">
            {stages.map((stage) => (
              <div key={stage.key} className="mt-4 border-t border-white/10 pt-3 first:mt-0 first:border-t-0 first:pt-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.35em] text-chrome/80">
                    {stage.title}
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-2 justify-items-center gap-3">
                  {stage.icons.map((icon) => {
                    const iconThumb = getThumbVariants(icon);
                    return (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => selectStage(stage.key as StageKey, icon)}
                        className={`h-10 w-10 overflow-hidden rounded border bg-black transition-all md:h-20 md:w-20 ${
                          activeStage === stage.key && activeImage === icon
                            ? "border-chrome/60"
                            : "border-white/10 opacity-50 grayscale hover:border-white/30 hover:opacity-80"
                        }`}
                      >
                        {iconThumb ? (
                          <picture>
                            <source
                              type="image/avif"
                              srcSet={`${iconThumb.mobile.avif} 96w, ${iconThumb.desktop.avif} 128w`}
                              sizes="40px"
                            />
                            <source
                              type="image/webp"
                              srcSet={`${iconThumb.mobile.webp} 96w, ${iconThumb.desktop.webp} 128w`}
                              sizes="40px"
                            />
                            <img
                              src={iconThumb.desktop.jpg}
                              srcSet={`${iconThumb.mobile.jpg} 96w, ${iconThumb.desktop.jpg} 128w`}
                              sizes="40px"
                              alt={`${stage.title} option`}
                              className="h-full w-full object-cover bg-black"
                              loading="lazy"
                              decoding="async"
                            />
                          </picture>
                        ) : (
                          <img
                            src={icon}
                            alt={`${stage.title} option`}
                            className="h-full w-full object-cover bg-black"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <m.div
        key={activeStage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="mx-auto mt-6 w-full max-w-6xl rounded-2xl panel-glass p-6 text-sm leading-relaxed text-steel/90 md:mt-10 md:p-8"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-chrome/80">
          {currentStage.title}
        </p>
        <div className="mt-4">{currentStage.text}</div>
      </m.div>
    </section>
  );
};

export default VostokProcess;
