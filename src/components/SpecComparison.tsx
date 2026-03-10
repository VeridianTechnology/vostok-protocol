import { m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getImageVariants } from "@/lib/utils";
import LavaLampBlobs from "@/components/LavaLampBlobs";
import { track } from "@vercel/analytics";
import { trackSafe } from "@/lib/analytics";

type EntrySource =
  | "facebook"
  | "4chan"
  | "instagram"
  | "tiktok"
  | "reddit"
  | "twitter"
  | "direct";

type SpecComparisonProps = {
  entrySource?: EntrySource;
};

const SpecComparison = ({ entrySource = "direct" }: SpecComparisonProps) => {
  const isFourChan = entrySource === "4chan";
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);
  const [showFacebookEmbed, setShowFacebookEmbed] = useState(false);
  const [showInstagramEmbed, setShowInstagramEmbed] = useState(false);
  const [facebookLoaded, setFacebookLoaded] = useState(false);
  const [instagramLoaded, setInstagramLoaded] = useState(false);
  const flipTimeout = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
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
  const leftVariants = getImageVariants(activePair.left);
  const rightVariants = getImageVariants(activePair.right);

  const goPrev = () => {
    if (spreadIndex === 0) {
      return;
    }
    trackSafe("book_prev");
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
    const isLast = spreadIndex === chapterPairs.length - 1;
    trackSafe(isLast ? "book_start_over" : "book_next");
    if (flipTimeout.current) {
      window.clearTimeout(flipTimeout.current);
    }
    setFlipDirection("next");
    flipTimeout.current = window.setTimeout(() => {
      setSpreadIndex((current) => (current + 1) % chapterPairs.length);
      setFlipDirection(null);
    }, 450);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRafRef.current) {
        return;
      }
      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = null;
        const offsetY = (window.scrollY % 200) * 0.15;
        setParallaxOffset({ x: 0, y: -offsetY });
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRafRef.current) {
        window.cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateMatch = () => setIsDesktop(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowFacebookEmbed(true), 5000);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowInstagramEmbed(true), 6500);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!showInstagramEmbed) {
      return;
    }
    const readyTimeout = window.setTimeout(() => setInstagramLoaded(true), 1500);
    const existing = document.querySelector<HTMLScriptElement>("script[data-instgrm-embed]");
    const instgrm = (window as typeof window & { instgrm?: { Embeds?: { process: () => void } } })
      .instgrm;
    if (existing) {
      if (instgrm?.Embeds?.process) {
        instgrm.Embeds.process();
      }
      return () => window.clearTimeout(readyTimeout);
    }
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = "https://www.instagram.com/embed.js";
    script.setAttribute("data-instgrm-embed", "true");
    script.onload = () => {
      const loadedInstgrm = (
        window as typeof window & { instgrm?: { Embeds?: { process: () => void } } }
      ).instgrm;
      if (loadedInstgrm?.Embeds?.process) {
        loadedInstgrm.Embeds.process();
      }
    };
    document.body.appendChild(script);
    return () => window.clearTimeout(readyTimeout);
  }, [showInstagramEmbed]);

  const trackNextOnce = () => {
    const key = `next_page_${entrySource}`;
    if (sessionStorage.getItem(key)) {
      return;
    }
    sessionStorage.setItem(key, "1");
    track(key);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    trackNextOnce();
    goNext();
  };

  return (
    <section className="relative bg-white pb-2 px-6 pt-8 md:pb-24 md:pt-20">
      <div className="absolute inset-0 z-0 overflow-hidden bg-white">
        <LavaLampBlobs offsetX={parallaxOffset.x} offsetY={parallaxOffset.y} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-4 md:mb-16"
        >
          <p className="text-black/60 tracking-[0.4em] uppercase text-xs mb-4 font-light">
            {isFourChan ? "Exit the Spiral" : "Vostok Protocol"}
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-black tracking-tight">
            {isFourChan ? (
              <>FUCKING READ - AND UNDERSTAND, SIMP</>
            ) : (
              <>
                Inside the Vostok Protocol
              </>
            )}
          </h2>
          {!isFourChan && (
            <div className="mt-4 space-y-3">
              <p className="text-black/60 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
                The full protocol contains 11 chapters
                <br />
                and over 200 pages of exercises,
                <br />
                diagrams, and structural training methods.
              </p>
            </div>
          )}
        </m.div>
      </div>

      <div className="relative z-10 left-1/2 right-1/2 w-screen -translate-x-1/2">
        <div className="book-shell w-full max-w-none rounded-2xl border border-black/15 bg-white/40 px-1 py-2 md:px-14">
          <div className="book-spread grid">
            <div
              className="book-page book-page-left"
              style={{ height: "100%" }}
              onClick={() => {
                if (isDesktop) {
                  goPrev();
                }
              }}
            >
              <div className="book-page-inner">
                <div className="relative w-full flex-1">
                  {spreadIndex === 0 && (
                    <button
                      type="button"
                      onClick={handleNextButtonClick}
                      className="absolute right-3 top-3 z-20 rounded-full border border-black/20 bg-white/80 px-5 py-2 text-[11px] uppercase tracking-[0.3em] text-black/80 shadow-md md:hidden"
                    >
                      Next
                    </button>
                  )}
                  {spreadIndex > 0 && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        goPrev();
                      }}
                      className="absolute right-3 top-3 z-20 rounded-full border border-black/20 bg-white/80 px-5 py-2 text-[11px] uppercase tracking-[0.3em] text-black/80 shadow-md md:hidden"
                    >
                      Prev
                    </button>
                  )}
                  {leftVariants ? (
                    <picture>
                      <source
                        type="image/avif"
                        srcSet={`${leftVariants.avif.mobile} 640w, ${leftVariants.avif.desktop} 1600w`}
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                      <source
                        type="image/webp"
                        srcSet={`${leftVariants.webp.mobile} 640w, ${leftVariants.webp.desktop} 1600w`}
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                      <m.img
                        key={activePair.left}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        src={leftVariants.desktop}
                        srcSet={`${leftVariants.mobile} 640w, ${leftVariants.desktop} 1600w`}
                        sizes="(max-width: 640px) 100vw, 50vw"
                        alt={`Chapter page ${spreadIndex + 1}`}
                        className="book-page-image absolute inset-0"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  ) : (
                    <m.img
                      key={activePair.left}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.7 }}
                      src={activePair.left}
                      alt={`Chapter page ${spreadIndex + 1}`}
                      className="book-page-image absolute inset-0"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
              </div>
            </div>
            <div
              className="book-page book-page-right"
              style={{ height: "100%" }}
              onClick={() => {
                if (isDesktop) {
                  goNext();
                }
              }}
            >
              <div className="book-page-inner">
                <div className="relative w-full flex-1">
                  <button
                    type="button"
                    onClick={handleNextButtonClick}
                    className="absolute bottom-3 right-3 z-20 rounded-full border border-black/20 bg-white/80 px-5 py-2 text-[11px] uppercase tracking-[0.3em] text-black/80 shadow-md md:hidden"
                  >
                    {spreadIndex === chapterPairs.length - 1 ? "Start Over" : "Next"}
                  </button>
                  {rightVariants ? (
                    <picture>
                      <source
                        type="image/avif"
                        srcSet={`${rightVariants.avif.mobile} 640w, ${rightVariants.avif.desktop} 1600w`}
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                      <source
                        type="image/webp"
                        srcSet={`${rightVariants.webp.mobile} 640w, ${rightVariants.webp.desktop} 1600w`}
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                      <m.img
                        key={activePair.right}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        src={rightVariants.desktop}
                        srcSet={`${rightVariants.mobile} 640w, ${rightVariants.desktop} 1600w`}
                        sizes="(max-width: 640px) 100vw, 50vw"
                        alt={`Chapter page ${spreadIndex + 1}`}
                        className="book-page-image absolute inset-0"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  ) : (
                    <m.img
                      key={activePair.right}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.7 }}
                      src={activePair.right}
                      alt={`Chapter page ${spreadIndex + 1}`}
                      className="book-page-image absolute inset-0"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
              </div>
            </div>
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
      {!isFourChan && (
        <div className="relative z-10 mt-6 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.35em] text-black/50">
            Continue Reading →
          </span>
          <a
            href="https://vostok67.gumroad.com/l/vostokmethod?wanted=true"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-black/90 text-white font-medium tracking-[0.25em] uppercase text-[11px] px-6 py-3 rounded-sm border border-black/20 shadow-luxury hover:bg-black transition-all duration-500"
          >
            Unlock the Complete Protocol
          </a>
          <div className="mt-4 flex w-full max-w-[1120px] flex-col items-center gap-2 md:grid md:grid-cols-2 md:items-start md:gap-6">
            {showFacebookEmbed && (
              <div className="relative w-full max-w-[620px] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-card md:justify-self-center mx-auto">
                {!facebookLoaded && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/80 text-black/60">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black/60" />
                    <span className="text-xs uppercase tracking-[0.35em]">Loading</span>
                  </div>
                )}
                <div className="facebook-embed-crop">
                  <iframe
                    title="Facebook post"
                    src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0G7AD2LE6NP1N8i4hFTSojCbaPbup3zuFJ4pf7JCF3dYAPYwbu9NGyZPCmQtG6RE1l%26id%3D61588217763336&show_text=true&width=500"
                    width="500"
                    height="620"
                    style={{ border: "none", overflow: "hidden" }}
                    scrolling="no"
                    loading="lazy"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    onLoad={() => setFacebookLoaded(true)}
                    className="mx-auto w-full"
                  />
                </div>
              </div>
            )}
            {showInstagramEmbed && (
              <div className="relative w-full max-w-[620px] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-card md:justify-self-center">
                {!instagramLoaded && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/80 text-black/60">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black/60" />
                    <span className="text-xs uppercase tracking-[0.35em]">Loading</span>
                  </div>
                )}
                <div className="instagram-embed-crop">
                  <blockquote
                    className="instagram-media"
                    data-instgrm-captioned
                    data-instgrm-permalink="https://www.instagram.com/reel/DVt9HqrElE1/?utm_source=ig_embed&utm_campaign=loading"
                    data-instgrm-version="14"
                    style={{
                      background: "#FFF",
                      border: 0,
                      borderRadius: 3,
                      boxShadow:
                        "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                      margin: 1,
                      maxWidth: 540,
                      minWidth: 326,
                      padding: 0,
                      width: "calc(100% - 2px)",
                    }}
                  >
                    <div style={{ padding: 16 }}>
                      <a
                        href="https://www.instagram.com/reel/DVt9HqrElE1/?utm_source=ig_embed&utm_campaign=loading"
                        style={{
                          background: "#FFFFFF",
                          lineHeight: 0,
                          padding: 0,
                          textAlign: "center",
                          textDecoration: "none",
                          width: "100%",
                          display: "block",
                        }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                          <div
                            style={{
                              backgroundColor: "#F4F4F4",
                              borderRadius: "50%",
                              flexGrow: 0,
                              height: 40,
                              marginRight: 14,
                              width: 40,
                            }}
                          />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              flexGrow: 1,
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: "#F4F4F4",
                                borderRadius: 4,
                                flexGrow: 0,
                                height: 14,
                                marginBottom: 6,
                                width: 100,
                              }}
                            />
                            <div
                              style={{
                                backgroundColor: "#F4F4F4",
                                borderRadius: 4,
                                flexGrow: 0,
                                height: 14,
                                width: 60,
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ padding: "19% 0" }} />
                        <div style={{ display: "block", height: 50, margin: "0 auto 12px", width: 50 }}>
                          <svg
                            width="50px"
                            height="50px"
                            viewBox="0 0 60 60"
                            version="1.1"
                            xmlns="https://www.w3.org/2000/svg"
                            xmlnsXlink="https://www.w3.org/1999/xlink"
                          >
                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                              <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                                <g>
                                  <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </div>
                        <div style={{ paddingTop: 8 }}>
                          <div
                            style={{
                              color: "#3897f0",
                              fontFamily: "Arial, sans-serif",
                              fontSize: 14,
                              fontStyle: "normal",
                              fontWeight: 550,
                              lineHeight: "18px",
                            }}
                          >
                            View this post on Instagram
                          </div>
                        </div>
                        <div style={{ padding: "12.5% 0" }} />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginBottom: 14,
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                backgroundColor: "#F4F4F4",
                                borderRadius: "50%",
                                height: 12.5,
                                width: 12.5,
                                transform: "translateX(0px) translateY(7px)",
                              }}
                            />
                            <div
                              style={{
                                backgroundColor: "#F4F4F4",
                                height: 12.5,
                                transform: "rotate(-45deg) translateX(3px) translateY(1px)",
                                width: 12.5,
                                flexGrow: 0,
                                marginRight: 14,
                                marginLeft: 2,
                              }}
                            />
                            <div
                              style={{
                                backgroundColor: "#F4F4F4",
                                borderRadius: "50%",
                                height: 12.5,
                                width: 12.5,
                                transform: "translateX(9px) translateY(-18px)",
                              }}
                            />
                          </div>
                          <div style={{ marginLeft: 8 }}>
                            <div
                              style={{
                                backgroundColor: "#F4F4F4",
                                borderRadius: "50%",
                                flexGrow: 0,
                                height: 20,
                                width: 20,
                              }}
                            />
                            <div
                              style={{
                                width: 0,
                                height: 0,
                                borderTop: "2px solid transparent",
                                borderLeft: "6px solid #f4f4f4",
                                borderBottom: "2px solid transparent",
                                transform: "translateX(16px) translateY(-4px) rotate(30deg)",
                              }}
                            />
                          </div>
                          <div style={{ marginLeft: "auto" }}>
                            <div
                              style={{
                                width: 0,
                                borderTop: "8px solid #F4F4F4",
                                borderRight: "8px solid transparent",
                                transform: "translateY(16px)",
                              }}
                            />
                            <div
                              style={{
                                backgroundColor: "#F4F4F4",
                                flexGrow: 0,
                                height: 12,
                                width: 16,
                                transform: "translateY(-4px)",
                              }}
                            />
                            <div
                              style={{
                                width: 0,
                                height: 0,
                                borderTop: "8px solid #F4F4F4",
                                borderLeft: "8px solid transparent",
                                transform: "translateY(-4px) translateX(8px)",
                              }}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: 1,
                            justifyContent: "center",
                            marginBottom: 24,
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: "#F4F4F4",
                              borderRadius: 4,
                              flexGrow: 0,
                              height: 14,
                              marginBottom: 6,
                              width: 224,
                            }}
                          />
                          <div
                            style={{
                              backgroundColor: "#F4F4F4",
                              borderRadius: 4,
                              flexGrow: 0,
                              height: 14,
                              width: 144,
                            }}
                          />
                        </div>
                      </a>
                      <p
                        style={{
                          color: "#c9c8cd",
                          fontFamily: "Arial, sans-serif",
                          fontSize: 14,
                          lineHeight: "17px",
                          marginBottom: 0,
                          marginTop: 8,
                          overflow: "hidden",
                          padding: "8px 0 7px",
                          textAlign: "center",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <a
                          href="https://www.instagram.com/reel/DVt9HqrElE1/?utm_source=ig_embed&utm_campaign=loading"
                          style={{
                            color: "#c9c8cd",
                            fontFamily: "Arial, sans-serif",
                            fontSize: 14,
                            fontStyle: "normal",
                            fontWeight: "normal",
                            lineHeight: "17px",
                            textDecoration: "none",
                          }}
                          target="_blank"
                          rel="noreferrer"
                        >
                          A post shared by nyx (@vostok.method)
                        </a>
                      </p>
                    </div>
                  </blockquote>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default SpecComparison;
