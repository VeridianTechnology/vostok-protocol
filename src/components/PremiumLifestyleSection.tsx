import { useRef, useState } from "react";
import SectionSideTab from "@/components/SectionSideTab";

type InterestSectionProps = {
  tabLabel: string;
  lines: string[];
  desktopBackground: string;
  mobileBackground: string;
  textClassName?: string;
  overlaySrc?: string;
  useTiledBackground?: boolean;
};

const InterestSection = ({
  tabLabel,
  lines,
  desktopBackground,
  mobileBackground,
  textClassName = "text-black",
  overlaySrc,
  useTiledBackground = false,
}: InterestSectionProps) => {
  const rafRef = useRef<number | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  const handleParallaxMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current) {
      return;
    }
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      setParallaxOffset({ x: x * 34, y: y * 18 });
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
      className="section-surface relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-t-[3px] border-black px-6 py-16 md:py-24"
      onPointerMove={handleParallaxMove}
      onPointerLeave={handleParallaxLeave}
    >
      <SectionSideTab label={tabLabel} />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {useTiledBackground ? (
          <>
            <div className="section-surface-fill absolute inset-0" />
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(120deg, rgba(0,0,0,0.28) 0 1px, transparent 1px 160px), repeating-linear-gradient(30deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 200px)",
                transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-black/20" />
            <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-white/35 blur-[90px]" />
            <div className="absolute -right-24 bottom-6 h-80 w-80 rounded-full bg-black/20 blur-[110px]" />
            <div className="absolute inset-0 hud-grid opacity-15 pointer-events-none" />
          </>
        ) : (
          <>
            <div className="absolute inset-[-4%]">
              <img
                src={mobileBackground}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-[1.08] object-cover md:hidden"
                style={{
                  transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0) scale(1.08)`,
                }}
              />
              <img
                src={desktopBackground}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 hidden h-full w-full scale-[1.08] object-cover md:block"
                style={{
                  transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0) scale(1.08)`,
                }}
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.1)_28%,rgba(0,0,0,0.18)_100%)]" />
          </>
        )}
        {overlaySrc ? (
          <img
            src={overlaySrc}
            alt=""
            aria-hidden="true"
            className="absolute right-[2vw] top-0 z-[1] hidden h-full w-auto object-contain opacity-95 md:block"
            style={{
              transform: `translate3d(${parallaxOffset.x * 0.45}px, ${parallaxOffset.y * 0.3}px, 0)`,
            }}
          />
        ) : null}
      </div>
      <div className="mx-auto w-full max-w-6xl">
        <div className="p-6 md:p-10">
          <h2 className={`research-impact-title text-center text-[2rem] font-black uppercase leading-[1.02] tracking-[0.08em] md:text-[5.3rem] ${textClassName}`}>
            {lines.map((line, index) => (
              <span key={`${tabLabel}-${line}`} className={index === 0 ? "block" : "mt-[0.6em] block"}>
                {line}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
};

const PremiumLifestyleSection = () => {
  return (
    <>
      <InterestSection
        tabLabel="STAY TUNED"
        lines={["Premium lifestyle", "Are you ready for it", "VØSTOK"]}
        desktopBackground="/section_wallpaper/interest/refined_images/01_desktop.jpg"
        mobileBackground="/section_wallpaper/interest/refined_images/01_mobile.jpg"
        textClassName="text-white"
        overlaySrc="/section_wallpaper/interest/02.png?v=2"
      />
      <InterestSection
        tabLabel="BECOME YOU"
        lines={["BECOME YOU"]}
        desktopBackground="/section_wallpaper/interest/refined_images/02_desktop.jpg"
        mobileBackground="/section_wallpaper/interest/refined_images/02_mobile.jpg"
        useTiledBackground
      />
    </>
  );
};

export default PremiumLifestyleSection;
