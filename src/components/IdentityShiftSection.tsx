import { useEffect, useRef, useState } from "react";
import SectionSideTab from "@/components/SectionSideTab";

type IdentityShiftSectionProps = { sectionId?: string };

const WHAT_IT_IS = [
  "Vostok is a facial training system designed to improve the musculature of your face. It's about strengthening the face as we would at the gym — with progressive variations and structured rebuilding — to achieve supermodel proportions.",
  "We believe beauty should be democratised. It should be free, and not belong to just an elite class of models.",
  "The beautiful thing about this workout routine is you can simply trust the process. The skull is a combination of interconnected pieces — it is not solid bone — and the face is filled with cartilage, fat, nerves, and small muscles. What we offer here is the full service: building up the muscles, refining the various plates, modifying the face in a very real way — to the point where it will look like you've had surgery.",
  "All of this for the low price of $30. About the price of six drinks.",
  "Most people never control this layer. Vostok exists to change that.",
];

const IF_I_TOLD_YOU = [
  "That I could make you attractive — what would you say? That I could make you sexy?",
  "You wouldn't believe me. You would say I'm crazy.",
  "What if I told you your personality is shaped by how attractive people perceive you to be? Not by who you actually are?",
  "This is not theory. This is observed behaviour.",
  "But here's the thing: you're going to have to work — really hard — exactly as you would at the gym, but for your face. Perhaps even harder.",
  "Every hour you put in, every practice session, you become one percent more attractive. And it stays that way — forever. If you do 40 hours, you move about one point on the scale. If you're a 4 and you do forty hours, you'll look like a 5. Another 40 hours, a 6. And so on. There really doesn't seem to be any limit — at least none that I've seen.",
  "I started as a low 8. I now feel like an 11. My photos don't do it justice, and the beautiful thing is I'm constantly learning — Vostok is still revealing itself to me. What I can say is this: it certainly isn't looksmaxxing. We won't be doing any bone smashing — this can cause brain trauma that never heals. We won't be recommending Botox or filler, as these will damage your face long-term and prevent graceful ageing. We won't be recommending peptides, as those are too intense for most people, though some may have merit. Everything we offer is very affordable — you just need the guide, some facial oil, and a mirror. With work, dedication, and practically zero money but real effort and heart, you can modify your face into a version of yourself you have never even dreamed of.",
  "There is a science to becoming attractive.",
  "And I have figured it out.",
  "Every session feels like a mini surgery — quickly correcting mistakes and adjusting the face.",
  "Bryan Johnson's methods require enormous amounts of money and can produce results — but they are inefficient for the average person.",
  "Other approaches focus on surgeries that compromise your appearance in later years, sacrificing graceful ageing for marginal short-term gains.",
  "Nothing else actually targets the face with an experienced practitioner behind it. I practice everything I teach. I test and run the exercises myself, and have been doing this for years. I can speak from direct experience on what works and what doesn't.",
];

const METHOD_PILLARS: Array<{ label: string; description: string }> = [
  { label: "Structure", description: "The underlying form of the face — jaw, cheekbones, alignment, posture." },
  { label: "Function", description: "The habits that shape that structure over time — tongue position, breathing, chewing, muscular engagement." },
  { label: "Signal", description: "How that structure is interpreted — symmetry, tension, clarity, presence." },
];

const headingShadow =
  "0px 1px 0px rgba(255,255,255,0.06), 0px 2px 10px rgba(0,0,0,1), 0px 8px 32px rgba(0,0,0,0.7)";
const bodyShadow = "0px 1px 6px rgba(0,0,0,0.85)";

const IdentityShiftSection = ({ sectionId }: IdentityShiftSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [exitProgress, setExitProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > 0) {
        setExitProgress(0);
        return;
      }
      // How far above the viewport the section has scrolled (0 = just exited, 1 = fully gone)
      const gone = Math.min(1, Math.max(0, -rect.bottom / Math.max(rect.height, 1)));
      setExitProgress(gone);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isExiting = exitProgress > 0;
  const contentStyle: React.CSSProperties = isExiting
    ? {
        transform: `translateY(${-exitProgress * 56}px) scale(${1 + exitProgress * 0.05})`,
        opacity: Math.max(0, 1 - exitProgress * 2.4),
        transition: "none",
      }
    : {
        transform: "translateY(0) scale(1)",
        opacity: 1,
        transition: "transform 500ms cubic-bezier(0.4,0,0.2,1), opacity 400ms ease-out",
      };

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-t-[3px] border-black px-6 py-20 md:py-36"
      style={{
        background: "linear-gradient(170deg, #0d0d0d 0%, #131313 40%, #0b0b0b 70%, #111111 100%)",
      }}
    >
      <SectionSideTab label="IDENTITY SHIFT" />

      <div className="mx-auto max-w-2xl" style={contentStyle}>
        {/* What It Is */}
        <div className="mb-20 md:mb-28">
          <h2
            className="mb-8 text-[1.5rem] font-black uppercase tracking-[0.22em] text-stone-200 md:text-[2.4rem]"
            style={{ textShadow: headingShadow }}
          >
            What It Is
          </h2>
          <div className="space-y-6">
            {WHAT_IT_IS.map((p, i) => (
              <p
                key={i}
                className="text-[0.93rem] leading-[1.9] text-stone-400 md:text-[1rem]"
                style={{ textShadow: bodyShadow }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-20 h-px bg-gradient-to-r from-transparent via-stone-700/50 to-transparent md:mb-28" />

        {/* If I Were to Tell You */}
        <div className="mb-20 md:mb-28">
          <h2
            className="mb-8 text-[1.5rem] font-black uppercase tracking-[0.22em] text-stone-200 md:text-[2.4rem]"
            style={{ textShadow: headingShadow }}
          >
            If I Were to Tell You&hellip;
          </h2>
          <div className="space-y-6">
            {IF_I_TOLD_YOU.map((p, i) => (
              <p
                key={i}
                className="text-[0.93rem] leading-[1.9] text-stone-400 md:text-[1rem]"
                style={{ textShadow: bodyShadow }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-20 h-px bg-gradient-to-r from-transparent via-stone-700/50 to-transparent md:mb-28" />

        {/* The Method */}
        <div>
          <h2
            className="mb-8 text-[1.5rem] font-black uppercase tracking-[0.22em] text-stone-200 md:text-[2.4rem]"
            style={{ textShadow: headingShadow }}
          >
            The Method
          </h2>
          <p
            className="mb-8 text-[0.93rem] leading-[1.9] text-stone-400 md:text-[1rem]"
            style={{ textShadow: bodyShadow }}
          >
            Vostok is not a collection of tips. It is a structured approach to facial
            optimisation.
          </p>
          <p
            className="mb-8 text-[0.93rem] leading-[1.9] text-stone-400 md:text-[1rem]"
            style={{ textShadow: bodyShadow }}
          >
            It focuses on three things:
          </p>
          <div className="space-y-7">
            {METHOD_PILLARS.map(({ label, description }) => (
              <div key={label}>
                <span
                  className="block text-[0.8rem] font-bold uppercase tracking-[0.28em] text-stone-300 md:text-[0.85rem]"
                  style={{ textShadow: headingShadow }}
                >
                  {label}
                </span>
                <p
                  className="mt-2 text-[0.93rem] leading-[1.9] text-stone-500 md:text-[1rem]"
                  style={{ textShadow: bodyShadow }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
          <p
            className="mt-12 text-[0.93rem] leading-[1.9] text-stone-400 md:text-[1rem]"
            style={{ textShadow: bodyShadow }}
          >
            The goal is not artificial change. The goal is precision.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IdentityShiftSection;
