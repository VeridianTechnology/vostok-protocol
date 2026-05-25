import { useCallback, useEffect, useRef, useState } from "react";
import { m } from "framer-motion";

const TOTAL = 7;
const CYCLE_MS = 15000;
const HAS_45_MAX = 6;

const EXERCISE_NAMES = ["Basics", "Cheeks", "Forehead", "Nose", "Jaw", "Eyes", "Ears"] as const;

type ExerciseData = {
  subtitle: string;
  before: string;
  after: string;
  social: string;
} | null;

const BASICS_COPY = `Most people never question the face in the mirror. They wake up one day—maybe at thirty, maybe at forty—and notice the first signs: cheeks that seem lower than they used to be, a jawline that's softened into the neck, eyes that look tired even after a full night's sleep. They chalk it up to age, to genetics, to "just the way things go." But here's what's really happening: gravity is winning, and no one is fighting back.

The forehead develops horizontal lines because the muscle beneath has never been trained to stay smooth. The cheeks sag because the supporting muscle tone was never built. The jawline blurs because the platysma (the neck muscle that holds everything up) has been allowed to weaken and droop. The eyes lose their lift, the nose loses its definition, the ears lose their anchor—and piece by piece, the entire face drifts downward.

And society accepts this. We're told to moisturize, to get sleep, to "age gracefully." We're sold creams that hydrate the skin but do nothing for the muscle beneath. We're told that fillers and surgery are the only options. But no one ever says: your face is a structure. Structures need maintenance. Muscles need training.

So the unrefined face isn't just saggy—it's untrained. It's a face that has been neglected, not because of laziness, but because no one taught people that the face could be trained. The sag, the droop, the softness—none of it is inevitable. It's simply the default state of a muscle system left to atrophy.`;

const EXERCISE_DATA: ExerciseData[] = [
  null, // 01 — Basics (uses BASICS_COPY block below)
  {
    subtitle: "The Architects of Sophistication",
    before:
      "The cheeks appear flat or sagging, with no visible definition between the cheekbone and the lower face. The midface looks empty, causing the eyes to seem unsupported and the lower face to look heavy. Smiling may create puffiness rather than a sharp lift.",
    after:
      "High, prominent cheekbones create a sharp diagonal shadow from the outer eye to the corner of the mouth. The midface appears lifted, sculpted, and angular — even at rest. The cheeks frame the eyes and support the lower face, creating that coveted \"modelesque\" hollow.",
    social:
      "Strong cheeks are the #1 signal of high status and sophistication. People subconsciously associate prominent cheekbones with aristocratic genes, intelligence, and self-discipline. You'll be treated as more elegant, more memorable, and more \"high-born.\"",
  },
  {
    subtitle: "The Command Center",
    before:
      "The forehead appears flat, wrinkled, or overly prominent. Horizontal lines create a tired or worried expression. The brow sits heavy over the eyes, making the face look closed-off or stressed. The forehead blends into the scalp without any structural transition.",
    after:
      "Smooth, strong, and open — the forehead becomes a calm, commanding canvas. Horizontal lines soften or disappear. The brow sits slightly lifted, creating an alert, engaged expression. The forehead transitions cleanly into the brow ridge, framing the eyes like a pedestal.",
    social:
      "A smooth, open forehead signals wisdom, calm authority, and emotional stability. People will perceive you as more trustworthy, more reliable, and less reactive. In leadership or negotiation, you'll have an automatic advantage — your face reads as \"steady.\"",
  },
  {
    subtitle: "The Central Anchor",
    before:
      "A weak or unbalanced nose disrupts the entire midline of the face. It may appear bulbous at the tip, crooked along the bridge, or lacking definition where it meets the brow. The nose sits like an afterthought rather than an integrated feature, pulling attention away from the eyes and mouth without contributing to harmony.",
    after:
      "The nose becomes a commanding central pillar — straight, defined, and balanced. The tip sharpens without looking pinched. The bridge aligns with the brow ridge, creating a seamless transition from forehead to tip. The nose no longer demands attention; instead, it quietly elevates everything around it.",
    social:
      "A refined nose signals genetic fitness, high-class refinement, and trustworthiness. People subconsciously read a balanced nose as a sign of good breeding and health. You'll be perceived as more intelligent, more put-together, and more \"expensive\" looking — without anyone knowing why.",
  },
  {
    subtitle: "The Signature of Power",
    before:
      "The jawline appears soft, rounded, or recessed. The transition from chin to neck is blurred, creating a heavy or weak lower face. The angle of the jaw lacks definition, making the face look unfinished or adolescent. Side profile shows little separation between jaw and neck.",
    after:
      "A sharp, angular jawline cuts a clean line from ear to chin. The angle sits between 38–41 degrees — the \"golden\" slope of dominance. The lower face looks carved, masculine (or fiercely feminine), and completely finished. The jaw frames the entire face like a fortress wall.",
    social:
      "The jaw is the #1 signal of dominance, leadership, and primal strength. People will instinctively defer to you, trust your decisions, and perceive you as more competent. In dating, a strong jaw signals high testosterone and genetic fitness. In business, it signals authority.",
  },
  {
    subtitle: "The Window to Trust",
    before:
      "The eyes appear tired, asymmetrical, or unsupported. The outer corner may droop slightly, creating a sad or fatigued expression. Under-eye bags or flatness softens the gaze. The eyes lack that \"fierce\" spark — they just exist rather than command attention.",
    after:
      "Bright, sharp, and symmetrical — the eyes become the undeniable focal point. The outer corner lifts slightly (creating a subtle cat-eye tilt). The under-eye area appears supported and smooth. The gaze reads as fierce, focused, and fully present. People feel seen when you look at them.",
    social:
      "The eyes are the #1 signal of trustworthiness and emotional intelligence. Bright, lifted eyes make you appear more honest, more engaged, and more charismatic. People will open up to you faster, trust you more easily, and remember you longer. In any social interaction, your eyes will do half the work.",
  },
  {
    subtitle: "The Hidden Multiplier",
    before:
      "The ears sit flat or protrude unevenly, with no visible lift or structure. The helix (outer curve) appears soft or collapsed. The ears blend into the side of the head without contributing to the silhouette. From the front, they're invisible; from the side, they're forgettable.",
    after:
      "The ears sit elegantly against the head, with a defined helix curve and a subtle upward lift. The ears appear \"anchored\" — not pinned, but purposefully positioned. From the side profile, they create a clean, collected silhouette that frames the jaw and cheek.",
    social:
      "Ears are the secret multiplier. Few people consciously notice them, but everyone feels when they're balanced. Well-positioned ears signal attention to detail, self-awareness, and genetic symmetry. You'll be perceived as more \"put-together,\" more elegant, and strangely more trustworthy — without anyone knowing why.",
  },
];

type ViewMode = "normal" | "rotated" | "highlight";

const StructureSection = () => {
  const [activeNum, setActiveNum] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("normal");
  const cycleRef = useRef<number | null>(null);

  const hasHighlight = activeNum >= 2;
  const has45 = activeNum <= HAS_45_MAX;
  const exerciseData = EXERCISE_DATA[activeNum - 1];

  const mainSrc =
    viewMode === "rotated"
      ? `/structure/45/${activeNum}_desktop.avif`
      : viewMode === "highlight"
        ? `/structure/highlight/${activeNum}_desktop.avif`
        : `/structure/${activeNum}_desktop.avif`;

  const resetCycle = useCallback(() => {
    if (cycleRef.current) window.clearInterval(cycleRef.current);
    cycleRef.current = window.setInterval(() => {
      setActiveNum((n) => (n % TOTAL) + 1);
      setViewMode("normal");
    }, CYCLE_MS);
  }, []);

  useEffect(() => {
    resetCycle();
    return () => {
      if (cycleRef.current) window.clearInterval(cycleRef.current);
    };
  }, [resetCycle]);

  const selectImage = (num: number) => {
    setActiveNum(num);
    setViewMode("normal");
    resetCycle();
  };

  const toggleRotated = () => {
    if (!has45) return;
    setViewMode((v) => (v === "rotated" ? "normal" : "rotated"));
  };

  const toggleHighlight = () => {
    if (!hasHighlight) return;
    setViewMode((v) => (v === "highlight" ? "normal" : "highlight"));
  };

  return (
    <section className="relative isolate bg-black px-6 pt-14 pb-14 overflow-hidden left-1/2 right-1/2 w-screen -translate-x-1/2">
      <p
        className="relative z-10 mb-8 text-center text-2xl uppercase tracking-[0.18em] text-white md:text-4xl"
        style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
      >
        What Vostok Will Do For You
      </p>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row md:items-stretch md:gap-12">
        {/* Left: main image frame */}
        <div className="md:w-3/5 flex flex-col">
          <div className="relative aspect-[4/5] md:aspect-auto md:flex-1 w-full overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_0_80px_rgba(255,255,255,0.06)]">
            <m.img
              key={mainSrc}
              src={mainSrc}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />

            {/* Corner label */}
            <div className="absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-white/70 backdrop-blur-sm">
              {viewMode === "rotated" ? "45° VIEW" : viewMode === "highlight" ? "HIGHLIGHT" : EXERCISE_NAMES[activeNum - 1]}
            </div>

            {/* 45° toggle arrow */}
            {has45 && (
              <button
                type="button"
                onClick={toggleRotated}
                aria-label={viewMode === "rotated" ? "Return to standard view" : "View 45° rotation"}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/25 bg-black/75 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/75 hover:bg-white/10 hover:text-white transition-all duration-200 backdrop-blur-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  style={{ transform: viewMode === "rotated" ? "rotate(-135deg)" : "rotate(45deg)" }}
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
                <span>{viewMode === "rotated" ? "Standard" : "45°"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="relative z-30 md:w-2/5">
          <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white md:h-full md:p-6 flex flex-col gap-4">

            {/* Highlight button */}
            <div className="pb-3 border-b border-white/10 min-h-[44px] shrink-0">
              {hasHighlight ? (
                <button
                  type="button"
                  onClick={toggleHighlight}
                  className={`w-full rounded-full border px-4 py-2.5 text-[11px] uppercase tracking-[0.28em] transition-all duration-200 ${
                    viewMode === "highlight"
                      ? "border-white/50 bg-white/12 text-white"
                      : "border-white/20 bg-transparent text-white/55 hover:border-white/38 hover:text-white/85"
                  }`}
                >
                  {viewMode === "highlight" ? "Hide Highlight" : "Highlight"}
                </button>
              ) : (
                <p className="text-center text-[10px] uppercase tracking-[0.35em] text-white/20">
                  No highlight
                </p>
              )}
            </div>

            {/* Icon navigation */}
            <div className="shrink-0">
              <p className="mb-2 text-[10px] uppercase tracking-[0.4em] text-white/30">Select Exercise</p>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => selectImage(1)}
                  className={`rounded-xl border overflow-hidden aspect-square transition-all duration-200 ${
                    activeNum === 1
                      ? "border-white/50 ring-1 ring-white/20 opacity-100"
                      : "border-white/10 opacity-45 hover:opacity-80 hover:border-white/25"
                  }`}
                >
                  <img
                    src="/structure/1_desktop.avif"
                    alt="Basics"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
                {Array.from({ length: TOTAL - 1 }, (_, i) => i + 2).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => selectImage(num)}
                    className={`rounded-xl border overflow-hidden aspect-square transition-all duration-200 ${
                      activeNum === num
                        ? "border-white/50 ring-1 ring-white/20 opacity-100"
                        : "border-white/10 opacity-45 hover:opacity-80 hover:border-white/25"
                    }`}
                  >
                    <img
                      src={`/structure/icons/${num}_desktop.avif`}
                      alt={EXERCISE_NAMES[num - 1]}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise description — scrollable */}
            <m.div
              key={`text-${activeNum}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="gold-scroll min-h-0 flex-1 overflow-y-auto rounded-xl border border-white/8 bg-white/[0.03] p-4"
            >
              {exerciseData ? (
                <div className="space-y-4 text-sm leading-relaxed">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.38em] text-white/30 mb-1">
                      {String(activeNum).padStart(2, "0")} — {EXERCISE_NAMES[activeNum - 1]}
                    </p>
                    <p className="text-white/50 italic text-[11px] tracking-wide">{exerciseData.subtitle}</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.32em] text-[#b08a4a]/80 mb-1">Before Refined</p>
                    <p className="text-white/65 leading-relaxed">{exerciseData.before}</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.32em] text-[#b08a4a]/80 mb-1">After Refined</p>
                    <p className="text-white/65 leading-relaxed">{exerciseData.after}</p>
                  </div>

                  <div className="rounded-lg border border-[#b08a4a]/20 bg-[#b08a4a]/5 p-3">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-[#b08a4a] mb-1">Social Perception</p>
                    <p className="text-white/60 leading-relaxed">{exerciseData.social}</p>
                  </div>
                </div>
              ) : (
                <div className="text-sm leading-relaxed">
                  <p className="text-[10px] uppercase tracking-[0.38em] text-white/30 mb-1">
                    01 — Basics
                  </p>
                  <p className="text-white/50 italic text-[11px] tracking-wide mb-4">
                    The Unrefined Face (Before Any Work)
                  </p>
                  {BASICS_COPY.split("\n\n").map((para, i) => (
                    <p key={i} className={`text-white/65 leading-relaxed ${i > 0 ? "mt-3" : ""}`}>
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </m.div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 shrink-0">
              {Array.from({ length: TOTAL }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => selectImage(n)}
                  aria-label={`Exercise ${n}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeNum === n ? "bg-white/60 flex-1" : "bg-white/15 w-4"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StructureSection;
