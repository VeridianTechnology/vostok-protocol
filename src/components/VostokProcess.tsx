import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { getImageVariants } from "@/lib/utils";

type StageKey = "before" | "20" | "45" | "70" | "100";

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

const VostokProcess = () => {
  const [activeStage, setActiveStage] = useState<StageKey>("before");
  const [activeImage, setActiveImage] = useState("/Comparison/3z.jpg");
  const activeStageRef = useRef(activeStage);
  const activeImageRef = useRef(activeImage);
  const rotationTimerRef = useRef<number | null>(null);
  const currentStage = stages.find((stage) => stage.key === activeStage) ?? stages[0];
  const activeVariants = getImageVariants(activeImage);
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

  useEffect(() => {
    if (rotationTimerRef.current) {
      window.clearInterval(rotationTimerRef.current);
    }
    rotationTimerRef.current = window.setInterval(() => {
      const currentIndex = iconSequence.findIndex(
        (entry) =>
          entry.stageKey === activeStageRef.current && entry.icon === activeImageRef.current
      );
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % iconSequence.length;
      const next = iconSequence[nextIndex];
      setActiveStage(next.stageKey);
      setActiveImage(next.icon);
    }, 35000);

    return () => {
      if (rotationTimerRef.current) {
        window.clearInterval(rotationTimerRef.current);
      }
    };
  }, [iconSequence]);

  return (
    <section
      id="vostok-process"
      className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-gradient-to-b from-black/70 via-black/60 to-black/50 px-6 py-6 md:py-14"
    >
      <p className="mb-6 text-center text-sm uppercase tracking-[0.35em] text-chrome/70 md:mb-8 md:text-base">
        The Vostok Process
      </p>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row md:items-stretch md:gap-12">
        <div className="md:w-3/5">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-white/10 md:aspect-auto md:h-full">
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
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            ) : (
              <img
                src={activeImage}
                alt={`${currentStage.title} comparison`}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        </div>
        <div className="md:w-2/5">
          <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 md:h-full md:p-6">
            {stages.map((stage) => (
              <div key={stage.key} className="mt-4 border-t border-white/10 pt-3 first:mt-0 first:border-t-0 first:pt-0">
                <p className="text-xs uppercase tracking-[0.35em] text-chrome/80">
                  {stage.title}
                </p>
                <div className="mt-3 grid grid-cols-2 justify-items-center gap-3">
                  {stage.icons.map((icon) => {
                    const iconThumb = getThumbVariants(icon);
                    return (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => selectStage(stage.key as StageKey, icon)}
                        className={`h-20 w-20 overflow-hidden rounded border transition-all ${
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
                              sizes="80px"
                            />
                            <source
                              type="image/webp"
                              srcSet={`${iconThumb.mobile.webp} 96w, ${iconThumb.desktop.webp} 128w`}
                              sizes="80px"
                            />
                            <img
                              src={iconThumb.desktop.jpg}
                              srcSet={`${iconThumb.mobile.jpg} 96w, ${iconThumb.desktop.jpg} 128w`}
                              sizes="80px"
                              alt={`${stage.title} option`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          </picture>
                        ) : (
                          <img
                            src={icon}
                            alt={`${stage.title} option`}
                            className="h-full w-full object-cover"
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
      <motion.div
        key={activeStage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="mx-auto mt-6 w-full max-w-6xl rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-relaxed text-steel/90 md:mt-10 md:p-8"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-chrome/80">
          {currentStage.title}
        </p>
        <div className="mt-4">{currentStage.text}</div>
      </motion.div>
    </section>
  );
};

export default VostokProcess;
