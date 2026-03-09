import { m } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { getImageVariants } from "@/lib/utils";
import { track } from "@vercel/analytics";

type StageKey = "before" | "20" | "45" | "70" | "100";

type VostokProcessProps = {
  onLoaded?: () => void;
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "reddit" | "twitter" | "direct";
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

const VostokProcess = ({ onLoaded, entrySource = "direct" }: VostokProcessProps) => {
  const isFourChan = entrySource === "4chan";
  const isTwitter = entrySource === "twitter";
  const stages = useMemo(
    () => [
      {
        key: "before",
        title: "Before Vostok",
        icons: ["/Comparison/3z.jpg", "/Comparison/4z.jpg"],
        text: isTwitter ? (
          <>
            <p>Let me guess.</p>
            <p className="mt-4">You&apos;ve optimized everything else.</p>
            <p className="mt-4">
              Your timeline? Curated. Block lists. Mute words. Follow lists so tight you see exactly
              what you need and nothing you don&apos;t.
            </p>
            <p className="mt-4">
              Your setup? Monitors. Keyboards. Desk ergonomics that would make an engineer weep.
              You&apos;ve spent hours researching the difference between mechanical switches no
              normie will ever understand.
            </p>
            <p className="mt-4">
              Your body? You lift. You track macros. You&apos;ve tried carnivore, keto, OMAD, maybe
              even peptides if you&apos;re deep enough. HRT? You&apos;ve at least thought about it.
              You run the numbers on everything.
            </p>
            <p className="mt-4">But your face?</p>
            <p className="mt-4">You just... live with it.</p>
            <p className="mt-4">Here&apos;s what took me years to understand:</p>
            <p className="mt-4">The hierarchy is real.</p>
            <p className="mt-4">
              Not the fake one they tell you about - money, status, career. Those help. They&apos;re
              fine. But there&apos;s a deeper one. One that operates whether you believe in it or not.
            </p>
            <p className="mt-4">The face hierarchy.</p>
            <p className="mt-4">
              You&apos;ve seen it play out. The guy who walks into a room and everyone just... orients
              toward him. Not because he said anything. Not because he&apos;s loud. Just because his
              face fires something primal in every monkey brain in that room. And they cannot help
              themselves.
            </p>
            <p className="mt-4">
              You&apos;ve seen the opposite too. The guy who&apos;s smarter. Funnier. More successful on
              paper. But he&apos;s invisible. He&apos;s background noise. He exists, but he doesn&apos;t
              register.
            </p>
            <p className="mt-4">That gap?</p>
            <p className="mt-4">
              It&apos;s not personality. It&apos;s not money. It&apos;s not even height, though the cope
              merchants will tell you otherwise.
            </p>
            <p className="mt-4">It&apos;s face.</p>
            <p className="mt-4">I used to believe the lies.</p>
            <p className="mt-4">
              Politics matter. Be interesting. Be kind. The right one will see past your face.
            </p>
            <p className="mt-4">Then I got hot.</p>
            <p className="mt-4">
              Not rich. Not successful. Not wiser or more experienced or more confident. Just...
              hotter.
            </p>
            <p className="mt-4">And suddenly:</p>
            <p className="mt-4">Cashiers forgot my order because they couldn&apos;t stop staring.</p>
            <p className="mt-4">Strangers smiled for no reason.</p>
            <p className="mt-4">Women invented excuses to stand near me.</p>
            <p className="mt-4">
              Men - bigger men, stronger men - stepped aside. Not from fear. From recognition. Like I
              was one of them. Like my face had already done the talking so they didn&apos;t need to.
            </p>
            <p className="mt-4">
              I brought value to every interaction just by standing there like a dweeb.
            </p>
            <p className="mt-4">Here&apos;s what actually changed:</p>
            <p className="mt-4">
              Investment opportunities appeared. People assumed I knew things. Assumed I had money.
              Wanted to be near me, work with me, give me things.
            </p>
            <p className="mt-4">
              My own family started treating me better. My mother, my father, cousins - people
              who&apos;ve known me my whole life - suddenly deferred. Asked my opinion. Introduced me
              like I was someone to be proud of.
            </p>
            <p className="mt-4">
              Friends who used to talk over me started listening. Friends who used to dismiss me
              started asking what I thought.
            </p>
            <p className="mt-4">
              I didn&apos;t get smarter. I didn&apos;t get more experienced. I didn&apos;t get more
              successful.
            </p>
            <p className="mt-4">I just got hotter.</p>
            <p className="mt-4">That&apos;s it. That&apos;s the whole secret.</p>
            <p className="mt-4">The tech-bro in you is already running the numbers.</p>
            <p className="mt-4">
              You modify your timeline because information determines your reality. You modify your
              tech because tools determine your capability. You modify your body because hardware
              determines your longevity.
            </p>
            <p className="mt-4">
              Why would the one thing people judge in the first 0.3 seconds of meeting you be the one
              thing you leave to chance?
            </p>
            <p className="mt-4">It doesn&apos;t scale. It doesn&apos;t optimize. It doesn&apos;t ROI.</p>
            <p className="mt-4">
              Unless you treat it like everything else you&apos;ve ever improved.
            </p>
          </>
        ) : (
          <>
            <p>You&apos;ve optimized everything else.</p>
            <p className="mt-4">
              Timeline, tools, body. But your face is still left to chance.
            </p>
            <p className="mt-4">
              Vostok is the missing upgrade: direct, measurable, and fast.
            </p>
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
            <p>The Vostok Method</p>
            <p className="mt-4">
              I developed this system while studying the mechanics of facial structure, posture,
              and muscular influence on the skull.
            </p>
            <p className="mt-4">
              Over 100 hours were spent testing exercises, refining protocols, and documenting
              measurable changes.
            </p>
            <p className="mt-4">
              The result is a structured training manual designed to strengthen the muscles that
              influence facial form.
            </p>
          </>
        ),
      },
    ],
    [isTwitter]
  );
  const gumroadUrl = "https://vostok67.gumroad.com/l/vostokmethod?wanted=true";
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
  const hasFlashedOnceRef = useRef(false);
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
    [stages]
  );

  const stopFlashSequence = () => {
    isFlashingRef.current = false;
    flashTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    flashTimersRef.current = [];
    setShowFlash(false);
    hasFlashedOnceRef.current = true;
  };

  const selectStage = (stageKey: StageKey, image: string) => {
    if (isMobile) {
      stopFlashSequence();
    }
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

    const startFlashing = () => {
      if (isFlashingRef.current || hasFlashedOnceRef.current) {
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
          }
        },
        { threshold: 0.6 }
      );

    observer.observe(imageFrameRef.current);

    return () => {
      observer.disconnect();
      stopFlashSequence();
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
            onClick={() => {
              if (isMobile) {
                stopFlashSequence();
              }
            }}
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
          <div className="w-full rounded-2xl border border-white/15 bg-black/70 p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.55)] md:h-full md:p-6">
            {stages.map((stage) => (
              <div key={stage.key} className="mt-4 border-t border-white/10 pt-3 first:mt-0 first:border-t-0 first:pt-0">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-chrome/80">
                    {stage.title}
                  </p>
                  <div className="grid grid-cols-2 justify-items-center gap-3">
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
        className="mx-auto mt-6 w-full max-w-6xl rounded-2xl panel-glass p-6 text-sm leading-relaxed text-white/85 md:mt-10 md:p-8"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-chrome/80">
          {currentStage.title}
        </p>
        <div className="mt-4">
          {isTwitter && currentStage.key === "before" ? (
            <>
              <p>
                I was the guy in the background. Not ugly. Just... forgettable. Women looked
                through me. Men ignored me. Life was flat.
              </p>
            </>
          ) : isTwitter && currentStage.key === "20" ? (
            <>
              <p>
                The first double-take. A stranger holding eye contact too long. The cashier
                flustered. I thought it was coincidence.
              </p>
            </>
          ) : isTwitter && currentStage.key === "45" ? (
            <>
              <p>Here&apos;s what actually changed:</p>
              <p className="mt-4">
                Investment opportunities appeared. People assumed I knew things. Assumed I had
                money. Wanted to be near me, work with me, give me things.
              </p>
              <p className="mt-4">
                My own family started treating me better. My mother, my father, cousins - people
                who&apos;ve known me my whole life - suddenly deferred. Asked my opinion. Introduced
                me like I was someone to be proud of.
              </p>
              <p className="mt-4">
                Friends who used to talk over me started listening. Friends who used to dismiss me
                started asking what I thought.
              </p>
              <p className="mt-4">
                I didn&apos;t get smarter. I didn&apos;t get more experienced. I didn&apos;t get more
                successful.
              </p>
              <p className="mt-4">I just got hotter.</p>
              <p className="mt-4">That&apos;s it. That&apos;s the whole secret.</p>
            </>
          ) : isTwitter && currentStage.key === "70" ? (
            <>
              <p>The tech-bro in you is already running the numbers.</p>
              <p className="mt-4">
                You modify your timeline because information determines your reality. You modify
                your tech because tools determine your capability. You modify your body because
                hardware determines your longevity.
              </p>
              <p className="mt-4">
                Why would the one thing people judge in the first 0.3 seconds of meeting you be
                the one thing you leave to chance?
              </p>
              <p className="mt-4">It doesn&apos;t scale. It doesn&apos;t optimize. It doesn&apos;t ROI.</p>
              <p className="mt-4">
                Unless you treat it like everything else you&apos;ve ever improved.
              </p>
            </>
          ) : isFourChan && currentStage.key === "before" ? (
            <>
              <p>I used to be obsessed with politics.</p>
              <p className="mt-4">
                I consumed it like air. The podcasts, the pundits, the endless Twitter arguments
                about systems and structures and justice. I believed that being right mattered. I
                believed that if I aligned my beliefs correctly, the universe would align itself
                to me.
              </p>
              <p className="mt-4">It took me years to understand the joke.</p>
              <p className="mt-4">
                Politics is a game for men who cannot get laid. It is a coping mechanism for the
                overlooked, the invisible, the ones who need to believe that their lack of
                romantic success is the fault of "society" rather than the fault of their own
                reflection.
              </p>
              <p className="mt-4">
                I say this not as an insult, but as a confession. I was one of them.
              </p>
              <p className="mt-4">
                Then something shifted. I started putting in the work. The dull, boring, repetitive
                work of reshaping my face. And as the mirror began to return a different image, the
                world began to return a different response.
              </p>
              <p className="mt-4">
                The first hot girl was an accident. The second was a pattern. By the time I
                reached the fifth—the kind of woman who, a year earlier, would not have registered
                my existence—I understood the truth.
              </p>
              <p className="mt-4">Politics is what men discuss. Beauty is what men possess.</p>
              <p className="mt-4">And possession changes everything.</p>
            </>
          ) : isFourChan && currentStage.key === "20" ? (
            <>
              <p>Then I got super egoic.</p>
              <p className="mt-4">
                You would have laughed to see it. The same man who months earlier could not buy
                attention was now turning women down. Not cruelly—at first—but with a quiet,
                internal gatekeeping I had never known. She is a 6. Pass. She is a 7 but the
                personality is off. Pass. She is beautiful but she looked at me wrong. Pass.
              </p>
              <p className="mt-4">I had become the selector. And I loved it.</p>
              <p className="mt-4">
                But the universe, as it does, had a lesson waiting.
              </p>
              <p className="mt-4">
                I met her at a cafe. Dark hair. Green eyes. The kind of face that stops
                conversations mid-sentence. A legitimate 9. Out of my league by every metric I had
                ever known—except my metrics had changed. I approached. She responded. We talked
                for hours.
              </p>
              <p className="mt-4">
                And I fell.
              </p>
              <p className="mt-4">
                Not like an adult. Like a teenager. Like a boy who had never been loved before,
                which, in a way, I hadn't. I texted first. I overthought every pause. I bought her
                things. I waited. I hoped. I became exactly what I had despised: a simp for a
                woman who knew exactly what she was worth and exactly how much I was willing to
                give.
              </p>
              <p className="mt-4">
                She ended it after six weeks. Broke my heart in a way that surprised me with its
                weight. I sat in my apartment afterward, staring at the wall, and I laughed at the
                absurdity of it.
              </p>
              <p className="mt-4">
                I had never had a chance before—and now that I did, I had squandered it on the
                first beautiful face that looked back.
              </p>
              <p className="mt-4">Dramatic, right? Man.</p>
              <p className="mt-4">
                But here is the thing about falling: you either stay down, or you get up and keep
                moving. I got up. I kept progressing. I kept sharpening. Not for her. Not for
                revenge. Just because the work itself had become the only thing that made sense.
              </p>
              <p className="mt-4">
                And eventually, the hot girls kept coming. But this time, I was ready.
              </p>
            </>
          ) : isFourChan && currentStage.key === "45" ? (
            <>
              <p>This stage hit hard.</p>
              <p className="mt-4">
                I started walking around like I was the most attractive guy in whatever room I
                entered. And honestly--
              </p>
              <p className="mt-4">I wasn't wrong.</p>
              <p className="mt-4">
                Cashiers acted differently. Girls responded instantly. Even my own mother couldn't
                understand the sudden spike in female attention.
              </p>
              <p className="mt-4">
                It was overwhelming at times, but I felt like I'd unlocked a cheat code.
              </p>
              <p className="mt-4">Then the crypto market fell.</p>
              <p className="mt-4">
                Not that it mattered much--I was broke anyway. The bull had been good while it
                lasted, but when it turned, I had nothing left to lose. No money. No portfolio. No
                safety net. Just a face in the mirror and the creeping suspicion that this--this
                weird obsession with bone and muscle and symmetry--was the only thing I still
                controlled.
              </p>
              <p className="mt-4">So I kept working.</p>
              <p className="mt-4">Relentlessly.</p>
              <p className="mt-4">
                Every morning, the exercises. Every night, the analysis. I tore through anatomy
                textbooks like they were thrillers. I built custom AI models to track millimeter-
                level changes in my jawline over weeks. I studied the insertion points of the
                masseter, the behavior of the zygomaticus, the way the platysma could be trained to
                pull the entire lower face upward like a suspension bridge.
              </p>
              <p className="mt-4">
                I avoided bonesmashing. Avoided the retarded looksmaxxing experiments that end in
                asymmetry and regret. I kept it professional. Clinical. I treated my face like a
                research project, and I was both the scientist and the specimen.
              </p>
              <p className="mt-4">The results did not come fast. But they came.</p>
              <p className="mt-4">Then came the grocery store.</p>
              <p className="mt-4">
                I was with my mother--helping her shop, as a NEET does when the market crashes and
                time is the only currency left. She pushed the cart. I walked beside her. And
                everywhere we went, the looks followed.
              </p>
              <p className="mt-4">
                The girl in produce. The cashier at register three. The mother with her toddler who
                glanced once, then twice, then again. My mother noticed. Of course she noticed. She
                is a mother. She sees everything.
              </p>
              <p className="mt-4">Halfway through the frozen aisle, she stopped walking.</p>
              <p className="mt-4">"Does this happen everywhere?" she asked.</p>
              <p className="mt-4">I shrugged. Tried to play it cool.</p>
              <p className="mt-4">
                She shook her head, embarrassed, almost flustered. "This is insane. I can't shop
                with you anymore."
              </p>
              <p className="mt-4">
                But here is the thing about NEETs--you know how we are. No job. No money. No
                direction. Living in the basement or the spare bedroom, surviving on ramen and
                whatever our mothers bring home. We are supposed to be invisible. We are supposed
                to be ashamed.
              </p>
              <p className="mt-4">I was neither.</p>
              <p className="mt-4">
                I walked through that grocery store like I owned it. Like every glance was owed to
                me. Like every double-take was confirmation of something I had suspected but never
                proved.
              </p>
              <p className="mt-4">And I loved every second of it.</p>
            </>
          ) : isFourChan && currentStage.key === "70" ? (
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
              <p className="mt-4">I knew I would get a bad bitch. I knew I would have success.</p>
              <p className="mt-4">
                Not in a wishful way-in a factual way. The same way you know the sun will rise. It
                was not confidence anymore. It was certainty. The data was in. The experiment had
                concluded. And the results were undeniable:
              </p>
              <p className="mt-4">People REALLY started treating me different.</p>
              <p className="mt-4">And honestly? It was FUCKING annoying.</p>
              <p className="mt-4">
                You try ordering a coffee and having the cashier forget your order halfway through
                because she cannot stop staring at your face. You try standing in line at the
                grocery store while the woman in front of you turns around three times like she
                forgot something but really just wants another look. You try walking through a mall
                and feeling every pair of eyes track you like you are a fucking exhibit.
              </p>
              <p className="mt-4">YES, I GET IT. YOU&apos;VE NEVER SEEN A 10/10. MOVE ON.</p>
              <p className="mt-4">
                But they don&apos;t move on. They gawk. They fluster. They forget basic human
                functions because their lizard brain short-circuits at the sight of symmetry and
                proportion. And you are left standing there, waiting for your change, wondering if
                this is what models feel like every day and if they are all secretly exhausted by
                it.
              </p>
              <p className="mt-4">BUT I KEPT WORKING.</p>
              <p className="mt-4">
                Because here is the thing about obsession: it does not stop when you arrive. It
                only deepens.
              </p>
              <p className="mt-4">Then came the strange part.</p>
              <p className="mt-4">
                I am not a big guy. Never was. Shoulders, sure, but height? Average at best. By
                every physical metric, I should be the guy that rude muscular men push around in
                clubs. The one they cut in front of. The one they use as an armrest.
              </p>
              <p className="mt-4">But they didn&apos;t.</p>
              <p className="mt-4">
                They looked at me. They sized me up. And something in their eyes shifted. Not
                fear-recognition. Like I was one of them. Like my face had signaled something so
                primal, so dominant, that their bodies responded before their brains could
                intervene.
              </p>
              <p className="mt-4">THEY RESPECTED ME.</p>
              <p className="mt-4">
                Not because I was strong. Not because I was loud. Not because I had money or status
                or anything a man is supposed to have.
              </p>
              <p className="mt-4">I brought value TO EVERY interaction just by standing around like a dweeb.</p>
              <p className="mt-4">
                Just existing. Just breathing. Just occupying space with a face that had been
                refined and sharpened and sculpted into something the human brain cannot ignore.
              </p>
              <p className="mt-4">
                And that, more than the women, more than the attention, more than the grocery store
                gawking--that was when I knew I had won.
              </p>
            </>
          ) : isFourChan && currentStage.key === "100" ? (
            <>
              <p>Then I moved to Thailand and finished the full protocol.</p>
              <p className="mt-4">This is where everything exploded.</p>
              <p className="mt-4">
                While writing this out right now, a woman sat herself at my table-uninvited-and
                started flirting nonstop.
              </p>
              <p className="mt-4">Meanwhile, my girlfriend, a literal model, was asleep back home.</p>
              <p className="mt-4">That's when it hit me:</p>
              <p className="mt-4">
                Tall guys, muscular guys, rich guys-doesn't matter.
                <br />
                <strong>If your face wins the sexual signal game, you win.</strong>
              </p>
              <p className="mt-4">
                Life is cleaner, lighter, easier... and I haven't even maxed out the method yet.
              </p>
              <p className="mt-4">As I write this, I have a 10/10 in my bed right now.</p>
              <p className="mt-4">
                Literal 10/10. Six foot two. Twenty-three, maybe twenty-four, I don't know and I
                don't care. She is a fucking model. She could have anyone on the planet.
              </p>
              <p className="mt-4">I am five foot seven.</p>
              <p className="mt-4">
                I am broke. I am a NEET. I have no career, no savings, no direction. I eat like
                shit and I barely work out anymore. By every conventional metric, I should be
                invisible to her.
              </p>
              <p className="mt-4">
                But she is in my bed. Asleep. Naked. Wrapped around me like I am something
                precious.
              </p>
              <p className="mt-4">Why?</p>
              <p className="mt-4">
                Not because of my money-I mean, she is obviously with me for money except I don't
                have any, so no. Not because of my height-she towers over me in heels. Not because
                of my personality, because I am literally writing this sales page while she sleeps
                next to me, ignoring her.
              </p>
              <p className="mt-4">She is with me because I MOG her.</p>
              <p className="mt-4">I mog everyone.</p>
              <p className="mt-4">
                I walk into a room and the geometry shifts. Not because I am loud or charismatic or
                successful. Because my face fires neurons in people's brains that they cannot
                control. It is not fair. It is not moral. It is just biology.
              </p>
              <p className="mt-4">And I am obsessed with it.</p>
              <p className="mt-4">Here is what happens when you fix your face:</p>
              <p className="mt-4">
                Investment opportunities appear. Not because you got smarter, but because people
                take you more seriously when you look like you matter. They assume you know things.
                They assume you have money. They want to be near you, work with you, give you
                things.
              </p>
              <p className="mt-4">
                Your own family starts treating you better. Your mother, your father, your
                cousins-people who have known you your whole life-suddenly defer to you. They ask
                your opinion. They respect your space. They introduce you to their friends like you
                are someone to be proud of.
              </p>
              <p className="mt-4">
                Your friends take you seriously. The ones who used to talk over you now listen. The
                ones who used to dismiss you now ask what you think. You bring value to every
                interaction just by standing there like a dweeb, because your face has already done
                the work for you.
              </p>
              <p className="mt-4">
                I did not get any wiser. I did not get smarter. I did not get more experienced or
                more confident or more successful.
              </p>
              <p className="mt-4">I just got hotter.</p>
              <p className="mt-4">That's it. That's the whole secret.</p>
              <p className="mt-4">
                I am literally not that confident. I am literally not that successful. I am just
                another broke NEET who figured out how to manipulate bone and muscle and symmetry
                until the world had no choice but to treat me differently.
              </p>
              <p className="mt-4">And now I get respect everywhere I go.</p>
              <p className="mt-4">
                I totally get the movies now. The jaded hot guy living alone, staring out the
                window, tired of the attention. I understand him. I am close to becoming him. Maybe
                that is the full cycle: NEET to hot guy back to hot NEET. Isolation with better
                cheekbones.
              </p>
              <p className="mt-4">So here is my advice to you:</p>
              <p className="mt-4">
                Stop working out. Muscle is cope. Women do not care about your biceps when a
                well-proportioned face walks into the room. Save your tendy money and blow it on
                something real. Blow it on this.
              </p>
              <p className="mt-4">
                THIS and workout hard-for your health, for your frame-but follow every step. Every
                exercise. Every angle. Every millimeter of progress. Be disciplined. Be relentless.
                Be obsessed.
              </p>
              <p className="mt-4">And thank me later.</p>
              <p className="mt-4">You won't believe the results, NEET loser.</p>
              <p className="mt-4">Neither did I.</p>
              <m.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  track("buy_button", { location: "vostok_process" });
                  track("buy_button_4chan", { location: "vostok_process" });
                  if (entrySource === "twitter") {
                    track("buy_button_twitter", { location: "vostok_process" });
                  }
                  window.open(gumroadUrl, "_blank", "noopener,noreferrer");
                }}
                className="mt-4 inline-flex items-center justify-center rounded-sm border border-white/20 bg-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.3em] text-white transition hover:text-white"
              >
                Buy Now
              </m.button>
            </>
          ) : (
            currentStage.text
          )}
        </div>
      </m.div>
    </section>
  );
};

export default VostokProcess;
