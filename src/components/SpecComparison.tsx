import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { toMobileImage } from "@/lib/utils";

const SpecComparison = () => {
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const flipTimeout = useRef<number | null>(null);
  const chapterPairs = [
    { left: "/Sections/1.jpg", right: "/Sections/1_page-0001.jpg" },
    { left: "/Sections/2.jpg", right: "/Sections/2_page-0001.jpg" },
    { left: "/Sections/3.jpg", right: "/Sections/3_page-0001.jpg" },
    { left: "/Sections/4.jpg", right: "/Sections/4_page-0001.jpg" },
    { left: "/Sections/5.jpg", right: "/Sections/5_page-0001.jpg" },
    { left: "/Sections/6.jpg", right: "/Sections/6_page-0001.jpg" },
    { left: "/Sections/7.jpg", right: "/Sections/7_page-0001.jpg" },
    { left: "/Sections/8.jpg", right: "/Sections/8_page-0001.jpg" },
    { left: "/Sections/9.jpg", right: "/Sections/9_page-0001.jpg" },
    { left: "/Sections/10.jpg", right: "/Sections/10_page-0001.jpg" },
    { left: "/Sections/11.jpg", right: "/Sections/11_page-0001.jpg" },
  ];
  const activePair = chapterPairs[spreadIndex];

  const goPrev = () => {
    if (spreadIndex === 0) {
      return;
    }
    if (flipTimeout.current) {
      window.clearTimeout(flipTimeout.current);
    }
    setFlipDirection("prev");
    flipTimeout.current = window.setTimeout(() => {
      setSpreadIndex((current) => (current - 1 < 0 ? 0 : current - 1));
      setFlipDirection(null);
    }, 450);
  };

  const goNext = () => {
    if (flipTimeout.current) {
      window.clearTimeout(flipTimeout.current);
    }
    setFlipDirection("next");
    flipTimeout.current = window.setTimeout(() => {
      setSpreadIndex((current) => (current + 1) % chapterPairs.length);
      setFlipDirection(null);
    }, 450);
  };

  return (
    <section className="pb-12 px-6 pt-8 gradient-chrome md:pb-24 md:pt-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-4 md:mb-16"
        >
          <p className="text-chrome tracking-[0.4em] uppercase text-xs mb-4 font-light">
            Vostok Protocol
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground tracking-tight">
            Chapter <span className="font-semibold">Preview</span>
          </h2>
        </motion.div>
      </div>

      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2">
        <div className="book-shell w-full max-w-none rounded-2xl border border-white/10 px-1 py-2 md:px-14">
          <div className="book-spread grid">
            <button
              type="button"
              className="book-page book-page-left"
              onClick={goPrev}
              style={{ height: "100%" }}
            >
              <div className="book-page-inner">
                <div className="relative w-full flex-1">
                  <motion.img
                    key={activePair.left}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    src={activePair.left}
                    srcSet={`${toMobileImage(activePair.left)} 640w, ${activePair.left} 1280w`}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    alt={`Chapter page ${spreadIndex + 1}`}
                    className="book-page-image absolute inset-0"
                    loading="lazy"
                  />
                </div>
              </div>
            </button>
            <button
              type="button"
              className="book-page book-page-right"
              onClick={goNext}
              style={{ height: "100%" }}
            >
              <div className="book-page-inner">
                <div className="relative w-full flex-1">
                  <motion.img
                    key={activePair.right}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    src={activePair.right}
                    srcSet={`${toMobileImage(activePair.right)} 640w, ${activePair.right} 1280w`}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    alt={`Chapter page ${spreadIndex + 1}`}
                    className="book-page-image absolute inset-0"
                    loading="lazy"
                  />
                </div>
              </div>
            </button>
            {flipDirection && (
              <div className={`book-flip-layer book-flip-${flipDirection}`}>
                <div className="book-flip-face book-flip-front" />
                <div className="book-flip-face book-flip-back" />
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-[11px] uppercase tracking-[0.3em] text-chrome/70">
            <button
              type="button"
              onClick={goPrev}
              className="rounded-full border border-white/10 px-4 py-2 transition-colors duration-300 hover:text-foreground"
            >
              Prev
            </button>
            <span>
              {String(spreadIndex + 1).padStart(2, "0")} /{" "}
              {String(chapterPairs.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={goNext}
              className="rounded-full border border-white/10 px-4 py-2 transition-colors duration-300 hover:text-foreground"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecComparison;
