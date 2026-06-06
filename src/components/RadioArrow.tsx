import { useCallback, useEffect, useRef, useState } from "react";

// Position of arrow tip within the arrow image (fraction from top-left corner)
const TIP_X_PCT = 0.42;
const TIP_Y_PCT = 0.955;

const RadioArrow = () => {
  const [opacity, setOpacity] = useState(1);
  const [gone, setGone] = useState(false);
  const [pos, setPos] = useState<{ left: number; bottom: number } | null>(null);
  const mobileImgRef = useRef<HTMLImageElement>(null);
  const desktopImgRef = useRef<HTMLImageElement>(null);
  const fadeTriggeredRef = useRef(false);
  const showTimerRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const fadeoutTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const triggerFade = useCallback(() => {
    if (fadeTriggeredRef.current) return;
    fadeTriggeredRef.current = true;
    setOpacity(0);
    fadeoutTimerRef.current = window.setTimeout(() => setGone(true), 1000);
  }, []);

  const updatePos = useCallback(() => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      const btn = document.getElementById("radio-pod-toggle-btn");
      if (!btn) return;

      const isMobileVp = window.innerWidth < 768;
      const imgEl = isMobileVp ? mobileImgRef.current : desktopImgRef.current;
      if (!imgEl || !imgEl.offsetHeight) return;

      const btnRect = btn.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const imgW = imgEl.offsetWidth;
      const imgH = imgEl.offsetHeight;

      const arrowLeft = btnCenterX - TIP_X_PCT * imgW;
      const arrowBottom = window.innerHeight - btnCenterY - (1 - TIP_Y_PCT) * imgH;

      setPos({ left: arrowLeft, bottom: arrowBottom });
    });
  }, []);

  useEffect(() => {
    showTimerRef.current = window.setTimeout(triggerFade, 20000);

    const handleScroll = () => {
      if (fadeTriggeredRef.current) return;
      updatePos();
      if (!scrollTimerRef.current) {
        scrollTimerRef.current = window.setTimeout(triggerFade, 5000);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("radio:play", triggerFade);
    window.addEventListener("resize", updatePos);

    const initTimer = window.setTimeout(updatePos, 300);

    return () => {
      if (showTimerRef.current) window.clearTimeout(showTimerRef.current);
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
      if (fadeoutTimerRef.current) window.clearTimeout(fadeoutTimerRef.current);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      window.clearTimeout(initTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("radio:play", triggerFade);
      window.removeEventListener("resize", updatePos);
    };
  }, [triggerFade, updatePos]);

  if (gone) return null;

  const dynamicStyle = pos
    ? { left: `${pos.left}px`, bottom: `${pos.bottom}px` }
    : {};

  return (
    <>
      <img
        ref={mobileImgRef}
        src="/arrow.webp"
        alt=""
        aria-hidden="true"
        onLoad={updatePos}
        className="pointer-events-none fixed z-[58] w-[130px] md:hidden"
        style={{
          opacity,
          transition: "opacity 1s ease",
          ...(pos ? dynamicStyle : {
            bottom: "calc(-28px + 3.1vh)",
            left: "calc(22px + 1.95vw)",
          }),
        }}
      />
      <img
        ref={desktopImgRef}
        src="/arrow.webp"
        alt=""
        aria-hidden="true"
        onLoad={updatePos}
        className="pointer-events-none fixed z-[58] hidden w-[190px] md:block"
        style={{
          opacity,
          transition: "opacity 1s ease",
          ...(pos ? dynamicStyle : {
            bottom: "calc(-48px + 2.5vh)",
            right: "calc(8vw - 46px + 2vw + 3.5vw)",
          }),
        }}
      />
    </>
  );
};

export default RadioArrow;
