import { m, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SectionSideTab from "@/components/SectionSideTab";

type VostokProcessProps = {
  onLoaded?: () => void;
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "reddit" | "twitter" | "direct";
};

type GlitchTear = { y: number; h: number; x: number };

const SLIDES = [
  { main: "/Differences2/03.png", companion: "/Differences2/01.webp" },
  { main: "/Differences2/04.png", companion: "/Differences2/02.webp" },
] as const;

const VostokProcess = ({ onLoaded }: VostokProcessProps) => {
  const [parallaxShift, setParallaxShift] = useState(0);
  const [gridShift, setGridShift] = useState({ x: 0, y: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mainZoom, setMainZoom] = useState(false);
  const [iconZoom, setIconZoom] = useState(false);
  const parallaxRef = useRef<number | null>(null);
  const noiseCanvasRef = useRef<HTMLCanvasElement>(null);
  const [glitchTears, setGlitchTears] = useState<GlitchTear[]>([]);
  const [contentShift, setContentShift] = useState(0);

  const handleGridShift = () => {
    const nextX = Math.round((Math.random() - 0.5) * 120);
    const nextY = Math.round((Math.random() - 0.5) * 120);
    setGridShift({ x: nextX, y: nextY });
  };

  useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  useEffect(() => {
    const canvas = noiseCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 320;
    canvas.height = 180;
    let animId: number;
    let frame = 0;
    const draw = () => {
      animId = requestAnimationFrame(draw);
      if (++frame % 4 !== 0) return;
      const img = ctx.createImageData(320, 180);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        if (Math.random() < 0.07) {
          const v = Math.floor(Math.random() * 255);
          d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 48;
        }
      }
      ctx.putImageData(img, 0, 0);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    let outer: number;
    let inner: number;
    const schedule = () => {
      outer = window.setTimeout(() => {
        const count = 1 + Math.floor(Math.random() * 2);
        setGlitchTears(
          Array.from({ length: count }, () => ({
            y: 10 + Math.random() * 80,
            h: 2 + Math.random() * 14,
            x: (Math.random() - 0.5) * 30,
          }))
        );
        setContentShift((Math.random() - 0.5) * 6);
        inner = window.setTimeout(() => {
          setGlitchTears([]);
          setContentShift(0);
          schedule();
        }, 60 + Math.random() * 280);
      }, 2500 + Math.random() * 7000);
    };
    schedule();
    return () => { clearTimeout(outer); clearTimeout(inner); };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) return;
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

  const slide = SLIDES[currentSlide];

  return (
    <section
      id="vostok-process"
      className="relative isolate left-1/2 right-1/2 w-screen -translate-x-1/2 px-6 -mt-8 pt-[3vh] pb-8 md:mt-0 md:py-14 overflow-hidden bg-[#0b0c0e]"
      onClick={handleGridShift}
    >
      <SectionSideTab label="MY PROCESS" />
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#0b0c0e]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-[#f1d27a]/4 blur-[110px]" />
        <div className="absolute -right-24 bottom-6 h-80 w-80 rounded-full bg-white/3 blur-[130px]" />
        <m.div
          className="absolute inset-0"
          animate={{ y: -10 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-[0.06] transition-transform duration-700"
            style={{
              transform: `translate3d(calc(-50% + ${gridShift.x + parallaxShift}px), calc(-50% + ${gridShift.y - parallaxShift}px), 0)`,
              backgroundImage:
                "linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "40px 40px, 40px 40px",
              backgroundPosition: "0 0, 0 0",
            }}
          />
        </m.div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(241,210,122,0.03),transparent_60%)]" />
      </div>

      {/* Noise / glitch overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <canvas
          ref={noiseCanvasRef}
          className="absolute inset-0"
          style={{ width: "100%", height: "100%", imageRendering: "pixelated", opacity: 0.11, mixBlendMode: "overlay" }}
        />
        <m.div
          className="absolute left-0 right-0 h-[2px] bg-white/40"
          animate={{ top: ["0%", "102%"], opacity: [0, 0.7, 0.7, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
          style={{ top: 0 }}
        />
        {glitchTears.map((tear, i) => (
          <div
            key={i}
            className="absolute left-0 right-0"
            style={{
              top: `${tear.y}%`,
              height: `${tear.h}px`,
              transform: `translateX(${tear.x}px)`,
              background: "rgba(255,255,255,0.22)",
              mixBlendMode: "overlay",
            }}
          />
        ))}
      </div>

      {/* Content wrapper — shifts + chroma-aberrates during glitch bursts */}
      <div
        style={{
          transform: `translateX(${contentShift}px)`,
          filter: contentShift !== 0
            ? `drop-shadow(${Math.round(contentShift * 2)}px 0 1px rgba(255,20,80,0.65)) drop-shadow(${Math.round(-contentShift * 1.5)}px 0 1px rgba(0,180,255,0.65))`
            : undefined,
        }}
      >

      <p
        className="relative z-10 mb-8 text-center text-[0.7rem] font-black uppercase tracking-[0.32em] text-[#f1d27a] md:text-[0.82rem]"
        style={{ fontFamily: "var(--font-display, 'Tektur', sans-serif)" }}
      >
        NYX's Process
      </p>

      {/* Slideshow */}
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        {/* Image frame */}
        <div className="relative overflow-hidden rounded-2xl border border-[#f1d27a]/20 bg-black shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          <AnimatePresence mode="wait">
            <m.img
              key={slide.main}
              src={slide.main}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full cursor-zoom-in object-cover"
              style={{ maxHeight: "85vh" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => { e.stopPropagation(); setMainZoom(true); }}
            />
          </AnimatePresence>

          {/* Subtle scan lines */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 10px)",
            }}
          />

          {/* Left arrow */}
          <button
            type="button"
            className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/55 text-2xl leading-none text-white shadow-lg transition hover:bg-black/85"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide((c) => (c + SLIDES.length - 1) % SLIDES.length);
            }}
            aria-label="Previous slide"
          >
            ‹
          </button>

          {/* Right arrow */}
          <button
            type="button"
            className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/55 text-2xl leading-none text-white shadow-lg transition hover:bg-black/85"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide((c) => (c + 1) % SLIDES.length);
            }}
            aria-label="Next slide"
          >
            ›
          </button>

          {/* Companion icon — bottom-right corner */}
          <button
            type="button"
            className="absolute bottom-4 right-4 z-20 h-16 w-16 overflow-hidden rounded-xl border-2 border-white/60 shadow-[0_2px_18px_rgba(0,0,0,0.75)] transition-transform duration-200 hover:scale-110 hover:border-white"
            onClick={(e) => { e.stopPropagation(); setIconZoom(true); }}
            aria-label="View non-AI comparison"
          >
            <img
              src={slide.companion}
              alt="Comparison thumbnail"
              className="h-full w-full object-cover object-top"
            />
          </button>
        </div>

        {/* Slide dots */}
        <div className="mt-5 flex justify-center gap-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.stopPropagation(); setCurrentSlide(i); }}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                i === currentSlide ? "w-6 bg-[#f1d27a]/70" : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      </div>{/* end content shift wrapper */}

      {/* Main image zoom overlay */}
      <AnimatePresence>
        {mainZoom && (
          <m.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setMainZoom(false)}
          >
            <button
              type="button"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg text-white transition hover:bg-white/25"
              onClick={() => setMainZoom(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <m.img
              src={slide.main}
              alt="Zoomed"
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            />
          </m.div>
        )}
      </AnimatePresence>

      {/* Companion icon zoom overlay — zooms from bottom-right corner */}
      <AnimatePresence>
        {iconZoom && (
          <m.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setIconZoom(false)}
          >
            <button
              type="button"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg text-white transition hover:bg-white/25"
              onClick={() => setIconZoom(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <m.img
              src={slide.companion}
              alt="Non-AI comparison"
              className="max-h-[97vh] max-w-[97vw] rounded-xl object-contain shadow-2xl"
              initial={{ scale: 0.06, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.06, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ transformOrigin: "bottom right" }}
              onClick={(e) => e.stopPropagation()}
            />
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VostokProcess;
