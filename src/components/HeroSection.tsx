import { motion } from "framer-motion";
import { useState } from "react";

const HeroSection = () => {
  const [isAfter, setIsAfter] = useState(false);
  const [activeSuite, setActiveSuite] = useState<"precision" | "adaptive" | "sculpted">(
    "precision"
  );
  const showBefore = () => {
    if (isAfter) {
      setIsAfter(false);
    }
  };

  const showAfter = () => {
    if (!isAfter) {
      setIsAfter(true);
    }
  };

  const imageSets = {
    precision: {
      front: { left: "/images/1.jpg", right: "/images/2.jpg" },
      side: { left: "/images/4.jpg", right: "/images/3.jpeg" },
    },
    adaptive: {
      front: { left: "/images/8.jpg", right: "/images/7.jpg" },
      side: { left: "/images/5.jpg", right: "/images/6.jpg" },
    },
    sculpted: {
      front: { left: "/images/12.jpg", right: "/images/14.jpg" },
      side: { left: "/images/13.jpg", right: "/images/15.jpg" },
    },
  };

  const currentSet = imageSets[activeSuite];
  const currentView = isAfter ? currentSet.side : currentSet.front;
  const rightImageFocus =
    activeSuite === "adaptive" ? "object-center" : "object-bottom md:object-center";

  return (
    <section className="relative min-h-[100svh] flex items-start justify-center overflow-hidden pt-10 pb-6 md:pt-0 md:pb-0 md:items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <motion.div
          key={`${activeSuite}-${isAfter ? "side" : "front"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="grid h-full w-full grid-cols-1 md:grid-cols-2"
        >
          <div className="relative">
            <img
              src={currentView.left}
              alt="Before transformation"
              className="h-full w-full object-contain md:object-cover"
              loading="eager"
            />
            <div
              className="absolute inset-0 bg-black/40"
            />
          </div>
          <div className="relative">
            <img
              src={currentView.right}
              alt="After transformation"
              className={`h-full w-full object-contain md:object-cover ${rightImageFocus} ${
                activeSuite === "adaptive" && !isAfter ? "scale-[1.06]" : ""
              }`}
              loading="eager"
            />
            <div
              className="absolute inset-0 bg-black/10"
            />
          </div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        <div className="absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative mx-auto max-w-3xl rounded-3xl border border-white/10 bg-black/20 px-4 py-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-5 sm:py-7 md:bg-black/30 md:px-10 md:py-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 mb-4 flex flex-wrap items-center justify-center gap-3 text-[10px] uppercase tracking-[0.35em] text-chrome md:mb-5"
          >
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
              Vostok Method Version 4
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="relative z-10 text-chrome tracking-[0.4em] uppercase text-xs md:text-sm mb-5 font-light"
          >
            This is the Guide for a Timeless Face
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative z-10 text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-5 md:mb-6"
          >
            Your Face can be Engineered, Not Inherited
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="divider-line max-w-sm mx-auto mb-6"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="relative z-10 text-steel text-sm md:text-lg font-light max-w-xl mx-auto leading-relaxed"
          >
            An engineering approach to aesthetics. Precision-crafted methods for timeless beauty.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.35 }}
            className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3 text-[10px] uppercase tracking-[0.25em] text-steel"
          >
            <button
              type="button"
              onClick={() => setActiveSuite("precision")}
              className={`rounded-full border px-4 py-2 transition-colors duration-300 ${
                activeSuite === "precision"
                  ? "border-white/20 bg-white/15 text-foreground"
                  : "border-white/10 bg-white/5 text-steel"
              }`}
            >
              Myself
            </button>
            <button
              type="button"
              onClick={() => setActiveSuite("adaptive")}
              className={`rounded-full border px-4 py-2 transition-colors duration-300 ${
                activeSuite === "adaptive"
                  ? "border-white/20 bg-white/15 text-foreground"
                  : "border-white/10 bg-white/5 text-steel"
              }`}
            >
              Client #1
            </button>
            <button
              type="button"
              onClick={() => setActiveSuite("sculpted")}
              className={`rounded-full border px-4 py-2 transition-colors duration-300 ${
                activeSuite === "sculpted"
                  ? "border-white/20 bg-white/15 text-foreground"
                  : "border-white/10 bg-white/5 text-steel"
              }`}
            >
              Client #2
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="relative z-10 mt-10 inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1 text-xs tracking-[0.3em] uppercase text-steel"
          >
            <button
              type="button"
              onClick={showBefore}
              className={`rounded-full px-6 py-2 transition-colors duration-500 ${
                isAfter ? "text-steel" : "bg-white/15 text-foreground"
              }`}
            >
              Front
            </button>
            <button
              type="button"
              onClick={showAfter}
              className={`rounded-full px-6 py-2 transition-colors duration-500 ${
                isAfter ? "bg-white/15 text-foreground" : "text-steel"
              }`}
            >
              Side
            </button>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
};

export default HeroSection;
