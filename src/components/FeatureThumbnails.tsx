import { m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getImageVariants } from "@/lib/utils";

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

const features = [
  {
    image: "/images/structure/icons/2.jpg",
    label: "Cheeks",
    value: "47%",
    spec: "More Refined, Structured Cheeks",
    detailTitle: "Cheeks",
    detailText:
      "Cheek projection improves by 12-18% with consistent, targeted work. That's the difference between a face that falls flat and one that catches light correctly. The angle break becomes cleaner, giving you that defined midface structure that signals health and high status. Your jawline tightens alongside it, reaching a 38-41 degree slope that creates a sharp, chiseled edge from every angle. This isn't subtle—this is structural remodeling that changes how light moves across your face.\n\nHarmony Index Movement: 0.68 → 0.83",
    step: 2,
  },
  {
    image: "/images/structure/icons/3.jpg",
    label: "Forehead",
    value: "45%",
    spec: "Less Wrinkles, More Angles",
    detailTitle: "Forehead",
    detailText:
      "Your forehead curvature stabilizes by 10-14%, smoothing out the brow arc and reducing frontal plane deviation. This is the difference between a tired face and a commanding one. A stable, well-supported forehead doesn't just sit there—it frames everything beneath it, giving you that open, alert look that signals wisdom and calm authority. The lines soften. The angles sharpen. Your face finally looks finished.\n\nHarmony Index Movement: 0.71 → 0.84",
    step: 3,
  },
  {
    image: "/images/structure/icons/4.jpg",
    label: "Nose",
    value: "48%",
    spec: "Bilateral Harmony Score",
    detailTitle: "Nose",
    detailText:
      "Bridge alignment can reach a 0.82-0.86 harmony index with dedicated work. That means a steadier ridge taper, more balanced transitions, and a nose that actually integrates with the rest of your face instead of sitting on it like an afterthought. The nose is your central anchor—when it's aligned, everything else falls into place. This is about restoring the midline, creating symmetry where life and gravity stole it.\n\nHarmony Index Movement: 0.69 → 0.84",
    step: 4,
  },
  {
    image: "/images/structure/icons/5.jpg",
    label: "Jaw",
    value: "46%",
    spec: "Edge Contour Balance",
    detailTitle: "Jaw",
    detailText:
      "Mandibular edge definition tightens by 9-12% with proper technique. That's a crisp angle break, a cleaner lower-third slope, and the kind of jawline that makes people trust you instantly. The jaw is your signature. A weak one whispers uncertainty. A defined one broadcasts power. This work rebuilds that foundation, giving you the sharp profile that separates leaders from followers.\n\nHarmony Index Movement: 0.72 → 0.85",
    step: 5,
  },
  {
    image: "/images/structure/icons/6.jpg",
    label: "Eyes",
    value: "43%",
    spec: "Orbital Alignment Score",
    detailTitle: "Eyes",
    detailText:
      "Orbital symmetry improves to a 0.83 balance score with consistent practice. That means reduced tilt variance, a steadier upper lid plane, and eyes that actually hold attention. The eyes are the first thing people read. When they're balanced, bright, and fierce, they signal focus, health, and trustworthiness. This work restores that primal gaze—the kind that makes people feel seen.\n\nHarmony Index Movement: 0.70 → 0.83",
    step: 6,
  },
  {
    image: "/images/structure/icons/7.jpg",
    label: "Ears",
    value: "31%",
    spec: "Lateral Symmetry Index",
    detailTitle: "Ears",
    detailText:
      "Lateral alignment gains 6-9% with targeted work, creating a tighter helix curve and a more consistent profile offset. The ears are the hidden engines of the face—when they're strong and well-positioned, they pull everything back into place. This isn't about ear shape. It's about structural lift. Strong ears anchor the cheeks, tighten the jaw, and give your entire profile that collected, finished look.\n\nHarmony Index Movement: 0.74 → 0.82",
    step: 7,
  },
];

type FeatureThumbnailsProps = {
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "direct";
};

const FeatureThumbnails = ({ entrySource = "direct" }: FeatureThumbnailsProps) => {
  const isFourChan = entrySource === "4chan";
  const [structureStep, setStructureStep] = useState(1);
  const [isHighlightOn, setIsHighlightOn] = useState(false);
  const [isAngleView, setIsAngleView] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const structureImage = `/images/structure/${structureStep}.jpg`;
  const highlightImage =
    structureStep > 1 ? `/images/structure/highlight/${structureStep - 1}.jpg` : "";
  const angleImage =
    structureStep > 1 ? `/images/structure/45/${structureStep - 1}.jpg` : "";
  const hasHighlight = structureStep > 1;
  const activeImage = isAngleView && structureStep > 1
    ? angleImage
    : isHighlightOn && hasHighlight
    ? highlightImage
    : structureImage;
  const intervalRef = useRef<number | null>(null);
  const advanceStep = () => {
    setStructureStep((currentStep) => (currentStep >= 7 ? 1 : currentStep + 1));
  };

  const resetAutoAdvance = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(advanceStep, 20000);
  };

  useEffect(() => {
    resetAutoAdvance();
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (structureStep === 1 && isHighlightOn) {
      setIsHighlightOn(false);
    }
    if (structureStep === 1 && isAngleView) {
      setIsAngleView(false);
    }
  }, [structureStep, isHighlightOn, isAngleView]);

  const activeFeature = features.find((feature) => feature.step === structureStep) ?? features[0];
  const activeVariants = getImageVariants(activeImage);
  const isActiveUnlocked = structureStep >= activeFeature.step;
  const defaultDetailTitle = "The Harmony Index Explained";
  const defaultDetailText =
    "Throughout this chapter (and the book), you'll see references to a harmony index. This is a 0.00 to 1.00 scale that measures how well a feature integrates with your overall facial structure.\n\n0.80 and above: Optimal integration. The feature works with your face, not against it.\n\n0.70 to 0.79: Functional but not refined. The feature exists but doesn't contribute to harmony.\n\nBelow 0.70: Structural drag. The feature actively detracts from your overall balance.\n\nYour goal isn't perfection—it's progress. Every decimal point you move is visible. Every percentage gain is real.\n\nNow, let's look at your starting line.";
  const detailTitle = structureStep === 1 ? defaultDetailTitle : activeFeature.detailTitle;
  const detailText = structureStep === 1 ? defaultDetailText : activeFeature.detailText;

  const handleParallaxMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current) {
      return;
    }
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      setParallaxOffset({ x: x * 50, y: y * 34 });
    });
  };

  const handleParallaxLeave = () => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setParallaxOffset({ x: 0, y: 0 });
  };


  return (
    <section
      className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-white py-8 px-6 md:py-24 overflow-hidden"
      onPointerMove={handleParallaxMove}
      onPointerLeave={handleParallaxLeave}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0)`,
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          <div className="w-full lg:flex-[1.25]">
            <div className="relative rounded-3xl border border-black/10 bg-white/90 p-2 text-black/80 shadow-[0_30px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl md:p-8">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
              <m.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center mb-3 md:mb-6"
              >
                <p className="text-black/60 tracking-[0.35em] uppercase text-xs mb-4 font-light">
                  {isFourChan
                    ? "Stop doomscrolling. This is your ladder out."
                    : "An Unrefined Face Cannot Compete with a Structured Face"}
                </p>
                <h2 className="text-3xl md:text-6xl font-light text-black tracking-tight">
                  <span className="font-semibold">Change YOUR Face</span>
                </h2>
                {isFourChan && (
                  <p className="mt-3 text-sm text-black/70">
                    This moves 4s to 7s and 6s to 9s. It stacks indefinitely if you keep doing the
                    work.
                  </p>
                )}
              </m.div>

              <m.div
                key={structureStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="relative z-10 mx-auto max-w-3xl mt-0"
              >
                  <div className="relative overflow-hidden rounded-2xl border border-transparent p-0 md:border-black/10 md:p-1">
                  <div className="relative overflow-hidden rounded-[0.9rem]">
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
                          alt="Structured face progression"
                          className="h-[26rem] w-full object-contain md:h-[48rem]"
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    ) : (
                      <img
                        src={activeImage}
                        alt="Structured face progression"
                        className="h-[26rem] w-full object-contain md:h-[48rem]"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    {structureStep > 1 && (
                      <>
                        {!isAngleView && (
                          <button
                            type="button"
                            onClick={() => setIsAngleView(true)}
                            aria-label="Show 45 degree view"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-black/20 bg-white/80 p-3 text-black/80 shadow-[0_8px_16px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1/2 hover:scale-105 md:right-5 md:p-4"
                          >
                            <svg
                              aria-hidden="true"
                              className="h-4 w-4 md:h-5 md:w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m9 6 6 6-6 6" />
                            </svg>
                          </button>
                        )}
                        {isAngleView && (
                          <button
                            type="button"
                            onClick={() => setIsAngleView(false)}
                            aria-label="Return to original view"
                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-black/20 bg-white/80 p-3 text-black/80 shadow-[0_8px_16px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1/2 hover:scale-105 md:left-5 md:p-4"
                          >
                            <svg
                              aria-hidden="true"
                              className="h-4 w-4 md:h-5 md:w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m15 6-6 6 6 6" />
                            </svg>
                          </button>
                        )}
                      </>
                    )}
                    {hasHighlight && !isAngleView && (
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setIsHighlightOn(false)}
                          className={`rounded-full border px-4 pt-2 pb-3 pl-5 text-[10px] uppercase tracking-[0.25em] transition-colors md:px-8 md:pt-3 md:pb-4 md:pl-10 md:text-xs ${
                            !isHighlightOn
                              ? "border-black/70 bg-black/90 text-white"
                              : "border-black/20 bg-white text-black/70 hover:text-black"
                          }`}
                        >
                          Highlight Off
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsHighlightOn(true)}
                          className={`rounded-full border px-4 pt-2 pb-3 pr-5 text-[10px] uppercase tracking-[0.25em] transition-colors md:px-8 md:pt-3 md:pb-4 md:pr-10 md:text-xs ${
                            isHighlightOn
                              ? "border-black/70 bg-black/90 text-white"
                              : "border-black/20 bg-white text-black/70 hover:text-black"
                          }`}
                        >
                          Highlight On
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </m.div>
            </div>
          </div>

          <div className="w-full -mt-8 lg:mt-0 lg:flex-[0.95]">
            <div className="relative flex flex-col rounded-3xl border border-black/10 bg-white/90 p-6 text-black/80 shadow-[0_30px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl md:p-8 lg:h-full lg:justify-between">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-70 pointer-events-none" />
              <div className="relative z-10 mb-3 md:mb-6 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-black/60">
                <span>Performance Suite</span>
                <span className="h-px w-10 bg-black/30" />
                <span className="hidden md:inline">Trim Level S</span>
              </div>

              <h3 className="relative z-10 mb-3 md:mb-5 text-center text-sm md:text-base uppercase tracking-[0.35em] text-black/70">
                Vostok Facial Modification
              </h3>

              <div className="relative z-10 grid grid-cols-3 gap-5 justify-items-center lg:mb-8">
                {features.map((feature, index) => {
                  const isUnlocked = structureStep >= feature.step;
                  const featureThumb = getThumbVariants(feature.image);
                  return (
                    <m.div
                      key={feature.label}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className={`relative flex flex-col items-center text-center rounded-2xl border border-black/15 bg-white/95 p-4 text-black shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-all duration-500 group cursor-pointer ${
                        isUnlocked ? "hover:-translate-y-1" : "opacity-50 grayscale"
                      }`}
                      onClick={() => {
                        advanceStep();
                        resetAutoAdvance();
                      }}
                    >
                      {/* Circular thumbnail */}
                      <div
                        className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-3 border border-black/20 shadow-card transition-shadow duration-500 ${
                          isUnlocked ? "group-hover:shadow-glow" : ""
                        }`}
                      >
                        <span className="absolute right-1 top-1 z-10 rounded-full border border-black/20 bg-white/80 px-2 py-0.5 text-[9px] tracking-[0.2em] text-black/70">
                          {String(feature.step - 1).padStart(2, "0")}
                        </span>
                        {featureThumb ? (
                          <picture>
                            <source
                              type="image/avif"
                              srcSet={`${featureThumb.mobile.avif} 96w, ${featureThumb.desktop.avif} 128w`}
                              sizes="80px"
                            />
                            <source
                              type="image/webp"
                              srcSet={`${featureThumb.mobile.webp} 96w, ${featureThumb.desktop.webp} 128w`}
                              sizes="80px"
                            />
                            <img
                              src={featureThumb.desktop.jpg}
                              srcSet={`${featureThumb.mobile.jpg} 96w, ${featureThumb.desktop.jpg} 128w`}
                              sizes="80px"
                              alt={feature.label}
                              className={`w-full h-full object-cover transition-all duration-700 ${
                                isUnlocked ? "grayscale group-hover:grayscale-0" : "grayscale"
                              }`}
                              loading="lazy"
                              decoding="async"
                            />
                          </picture>
                        ) : (
                          <img
                            src={feature.image}
                            alt={feature.label}
                            className={`w-full h-full object-cover transition-all duration-700 ${
                              isUnlocked ? "grayscale group-hover:grayscale-0" : "grayscale"
                            }`}
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                        <div className="absolute inset-0 rounded-full border border-black/10" />
                      </div>

                      {/* Value */}
                      <span className="text-lg md:text-xl font-light text-black tracking-tight mb-1">
                        {feature.value}
                      </span>

                      {/* Label */}
                      <span className="text-[10px] tracking-[0.25em] uppercase text-black/60">
                        {feature.label}
                      </span>
                      <span
                        className={`h-0.5 w-8 rounded-full transition-opacity duration-300 ${
                          isUnlocked
                          ? "bg-black/60 opacity-100"
                          : "bg-transparent opacity-0"
                        }`}
                      />

                    </m.div>
                  );
                })}
              </div>

              <m.div
                key={structureStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
                className={`relative z-10 mt-4 mb-6 rounded-2xl border border-black/10 bg-white/80 px-4 pb-3 pt-4 md:mt-0 md:px-5 md:pb-4 md:pt-8 ${
                  isActiveUnlocked ? "" : "opacity-55 grayscale"
                }`}
              >
                <p className="text-[12px] uppercase tracking-[0.3em] text-black/50 mb-2">
                  Operator Notes
                </p>
                <h3 className="text-base md:text-lg font-light text-black/80 mb-2">
                  {detailTitle}
                </h3>
                {detailText.split("\n\n").map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm md:text-base text-black/70 leading-relaxed mb-3 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </m.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureThumbnails;
