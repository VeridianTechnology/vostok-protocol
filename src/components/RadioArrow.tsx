import { useEffect, useRef, useState } from "react";

const RadioArrow = () => {
  const [opacity, setOpacity] = useState(1);
  const [gone, setGone] = useState(false);
  const fadeTriggeredRef = useRef(false);
  const showTimerRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const fadeoutTimerRef = useRef<number | null>(null);

  const triggerFade = () => {
    if (fadeTriggeredRef.current) return;
    fadeTriggeredRef.current = true;
    setOpacity(0);
    fadeoutTimerRef.current = window.setTimeout(() => setGone(true), 1000);
  };

  useEffect(() => {
    showTimerRef.current = window.setTimeout(triggerFade, 20000);

    const handleScroll = () => {
      if (fadeTriggeredRef.current) return;
      if (!scrollTimerRef.current) {
        scrollTimerRef.current = window.setTimeout(triggerFade, 5000);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("radio:play", triggerFade);

    return () => {
      if (showTimerRef.current) window.clearTimeout(showTimerRef.current);
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
      if (fadeoutTimerRef.current) window.clearTimeout(fadeoutTimerRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("radio:play", triggerFade);
    };
  }, []);

  if (gone) return null;

  return (
    <>
      {/* Mobile: tip at 40%×130=52px from left, 14.4%×269=39px from image bottom.
           Button center: pl-3(12px)+33vw/2≈74px from left, 11px from vp bottom (bottom-0 state).
           left = 74-52 = 22px, bottom = 11-39 = -28px */}
      <img
        src="/arrow.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed z-[58] w-[130px] md:hidden"
        style={{
          opacity,
          transition: "opacity 1s ease",
          bottom: "calc(-28px + 3.1vh)",
          left: "calc(22px + 1.95vw)",
        }}
      />
      {/* Desktop: tip 57px from image bottom, button center 9px from vp bottom (bottom-0 state).
           bottom = 9-57 = -48px */}
      <img
        src="/arrow.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed z-[58] hidden w-[190px] md:block"
        style={{
          opacity,
          transition: "opacity 1s ease",
          bottom: "calc(-48px + 2.5vh)",
          right: "calc(8vw - 46px + 2vw + 3.5vw)",
        }}
      />
    </>
  );
};

export default RadioArrow;
