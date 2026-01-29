import { useEffect, useState } from "react";
import { Download } from "lucide-react";

const slides = [
  {
    image: "/before.jpg",
    alt: "Before the Vostok Method",
    overlay:
      "Five years ago. Age 28. Low confidence, little romantic success. Then I rebuilt my face — and my entire life shifted.",
  },
  {
    image: "/me.JPG",
    alt: "My face today",
    overlay:
      "No makeup. No filters. No tricks. Just disciplined facial work — about 100 hours — and the difference is undeniable. I’m not special. I trained my face. You can too.",
  },
  {
    image: "/lastnight.jpg",
    alt: "Last night",
    overlay:
      "When your face changes, your life follows. My girlfriend took this quick, blurry photo on 1/29/26, but it captures how different I feel now. Not bragging — just proof that confidence is earned, and you can earn it too.",
  },
];

const SeeMyFace = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoEnabled, setAutoEnabled] = useState(true);

  useEffect(() => {
    if (!autoEnabled) {
      return undefined;
    }
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 20000);

    return () => window.clearInterval(id);
  }, [autoEnabled]);

  const activeSlide = slides[activeIndex];

  return (
    <main className="min-h-screen bg-[#0b120b] px-4 pt-8 pb-10 md:pt-10 md:pb-16">
      <div className="container mx-auto flex max-w-5xl flex-col items-center gap-4 md:gap-8">
        <div className="-mb-[15px] text-center">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Vostok Method Author
          </h1>
        </div>
        <div className="h-px w-32 bg-vostok-neon/70 md:w-48" />
        <div className="relative flex w-full items-center justify-center">
          {activeIndex > 0 && (
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => {
                setAutoEnabled(false);
                setActiveIndex((prev) => Math.max(0, prev - 1));
              }}
              className="absolute left-0 z-10 -translate-x-1/2 rounded-full border border-vostok-neon/60 bg-black/60 p-1.5 text-vostok-neon"
            >
              <span className="block text-base leading-none">←</span>
            </button>
          )}
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-vostok-neon/30 bg-black/60 shadow-[0_0_60px_rgba(100,255,70,0.18)]">
            <img
              src={activeSlide.image}
              alt={activeSlide.alt}
              className={`h-full w-full object-cover ${activeIndex === 1 ? "scale-[1.3]" : ""}`}
            />
            <div className="absolute inset-x-0 bottom-0 h-[20.32%] bg-black/75 md:hidden" />
            <div className="absolute inset-x-0 bottom-0 flex h-[20.32%] items-start px-4 pt-2 text-center md:hidden">
              <p className="mx-auto text-[8px] leading-relaxed text-vostok-neon">
                {activeSlide.overlay}
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 hidden h-[10.88%] bg-black/75 md:block" />
            <div className="absolute inset-x-0 bottom-0 hidden h-[23%] items-end px-6 pb-4 text-center md:flex md:px-10 md:pb-6">
              <p
                className={`mx-auto text-sm leading-relaxed text-vostok-neon md:text-base ${
                  activeIndex === 1 ? "pb-3" : ""
                }`}
              >
                {activeSlide.overlay}
              </p>
            </div>
          </div>
          {activeIndex < slides.length - 1 && (
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => {
                setAutoEnabled(false);
                setActiveIndex((prev) => Math.min(slides.length - 1, prev + 1));
              }}
              className="absolute right-0 z-10 translate-x-1/2 rounded-full border border-vostok-neon/60 bg-black/60 p-1.5 text-vostok-neon"
            >
              <span className="block text-base leading-none">→</span>
            </button>
          )}
        </div>
        <div className="h-px w-32 bg-vostok-neon/70 md:w-48" />
        <div className="mt-2 flex justify-center pb-2 md:mt-8 md:pb-0">
          <a
            href="https://amoxcenturion.gumroad.com/l/vostokmethod"
            className="btn-neon text-center inline-flex items-center justify-center gap-2"
          >
            Get The Method
            <Download className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </main>
  );
};

export default SeeMyFace;
