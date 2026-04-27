import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "framer-motion";
import { trackSafe } from "@/lib/analytics";

type ResearchStudiesProps = {
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "reddit" | "twitter" | "direct";
};

type SlideSource = {
  label: string;
  href: string;
};

type ResearchSlide = {
  id: string;
  tabLabel: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  secondaryTitle?: string;
  secondaryParagraphs?: string[];
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  sources: SlideSource[];
};

const researchSlides: ResearchSlide[] = [
  {
    id: "looks-and-leverage",
    tabLabel: "Looks and Leverage",
    title: "Your Looks Determine More than Half Your Social Value",
    paragraphs: [
      "Appearance has measurable economic value. Attractive people are hired faster, evaluated more favorably, and paid more over time, even when qualifications are identical. First impressions form in milliseconds, so your face affects judgment before your resume has a chance to speak. Better looks do not replace competence, but they improve the starting position.",
      "Social status is not just ego. It changes how you move through the world. Looking better raises your position in the social hierarchy, and that elevation, handled with humility, creates confidence that compounds. Appearance shapes status judgments quickly: attractive faces are assumed more competent, more socially skilled, and more worthy of attention. That response creates a feedback loop: better treatment improves self-perception, which improves presence, which invites more positive responses.",
    ],
    desktopSrc: "/section_wallpaper/research/refined_images/07_desktop.jpg",
    mobileSrc: "/section_wallpaper/research/07.jpg",
    alt: "Looks and leverage infographic showing appearance, status, and hiring effects",
    sources: [
      {
        label:
          "Hamermesh, D. S., & Biddle, J. E. (1994). Beauty and the Labor Market. American Economic Review / NBER Working Paper 4518.",
        href: "https://www.nber.org/papers/w4518",
      },
      {
        label:
          "Mobius, M. M., & Rosenblat, T. S. (2006). Why Beauty Matters. American Economic Review, 96(1), 222-235.",
        href: "https://www.aeaweb.org/articles?id=10.1257/000282806776157515",
      },
      {
        label:
          "Ruffle, B. J., & Shtudiner, Z. (2015). Are Good-Looking People More Employable? Management Science, 61(8), 1760-1776.",
        href: "https://pubsonline.informs.org/doi/10.1287/mnsc.2014.1927",
      },
      {
        label:
          "Judge, T. A., Hurst, C., & Simon, L. S. (2009). Does It Pay to Be Smart, Attractive, or Confident (or All Three)? Journal of Applied Psychology, 94(3), 742-755.",
        href: "https://doi.org/10.1037/a0015497",
      },
      {
        label:
          "Dion, K., Berscheid, E., & Walster, E. (1972). What is beautiful is good. Journal of Personality and Social Psychology.",
        href: "https://psycnet.apa.org/record/1973-05802-001",
      },
    ],
  },
  {
    id: "power-follows-perception",
    tabLabel: "Good Looking Men Get Elected",
    title: "Good Looking Men get Elected",
    subtitle:
      "Power follows perception. Attractive leaders are judged faster, trusted sooner, and chosen more often when everything else reads as equal.",
    paragraphs: [
      "Now consider power. Look at the men who occupy the highest offices. America has never elected an ugly president. Washington, tall and handsome (despite the teeth). Lincoln, widely admired, strikingly tall and genuinely handsome as a young man before war aged him. Truman, sharp-featured. Eisenhower, the face of command. JFK, the literal definition of a hyper-chad. Even today, research shows that facial competence and attractiveness predict election outcomes. Leadership is perceived in a glance.",
      "It's not just politics. In corporate settings, looks play a massive role in who gets promoted to power positions. The \"Chad and Stacy\" effect is real: when two candidates are equally qualified, the better-looking one is disproportionately chosen. If you want career gains, whether climbing the corporate ladder, securing investors, or positioning yourself as an authority, you cannot afford to ignore your face. With looks comes not only modeling income but also access to positions of power. You must look the part and be the part.",
    ],
    desktopSrc: "/section_wallpaper/research/refined_images/08_desktop.jpg",
    mobileSrc: "/section_wallpaper/research/08.jpg",
    alt: "Political leadership and attractiveness infographic",
    sources: [
      {
        label:
          "Todorov, A., et al. (2005). Inferences of Competence from Faces Predict Election Outcomes. Science, 308(5728), 1623-1626.",
        href: "https://www.science.org/doi/10.1126/science.1110589",
      },
      {
        label:
          "Berggren, N., Jordahl, H., & Poutvaara, P. (2010). The looks of a winner: Beauty and electoral success. Journal of Public Economics, 94(1-2), 8-15.",
        href: "https://www.sciencedirect.com/science/article/pii/S0047272709001161",
      },
    ],
  },
  {
    id: "center-of-the-frame",
    tabLabel: "The Center of the Frame",
    title: "The Center of the Frame",
    paragraphs: [
      "Dating should not feel like labor. When your appearance is working for you, pursuit becomes selection. You stop forcing interest and move through dating with more calm, leverage, and less anxiety.",
      "Attraction is not negotiated from scratch. People form impressions from faces quickly, and physical attractiveness strongly shapes romantic interest in early encounters. Judgments of facial attractiveness are influenced by cues like symmetry, averageness, and sexually dimorphic structure, which helps explain why some people generate immediate attention before they have said much at all. In practice, better looks shift the starting position toward more openness, more forgiveness, and less resistance.",
      "But this dynamic is especially acute among women. Female hierarchy, with the exception of seniority-motherhood, grandmother status, formal authority like a boss-is overwhelmingly structured around looks. Women know this implicitly.",
      "Yes, personality matters. Yes, upbringing shapes character. But the face card reveals everything. While society obsesses over weight-and weight does matter-the face remains the final arbiter of who is considered prettiest by the group. A fit body can be built in the gym. A commanding face requires something else.",
      "If you want to advance in your social circle, you need a better face. This is not vanity. It is strategy. And the method I am presenting is the most effective way for a woman to move up among her peers.",
      "But be careful. When your face improves, your social position shifts. You may find that your current friends-comfortable with the old hierarchy-do not know how to handle the new you. You may have to find a new group. You will also begin re-evaluating your relationships, because you can now attract a higher caliber of man. What once felt like settling now feels like compromise. And once you see the difference, you cannot unsee it.",
      "That is the cost of leveling up. Worth it.",
    ],
    desktopSrc: "/section_wallpaper/research/09.jpg",
    mobileSrc: "/section_wallpaper/research/09.jpg",
    alt: "Center of the frame infographic about beauty, status, and visual attention",
    sources: [
      {
        label:
          "Willis, J., & Todorov, A. (2006). First impressions: Making up your mind after a 100-ms exposure to a face. Psychological Science.",
        href: "https://pubmed.ncbi.nlm.nih.gov/16866745/",
      },
      {
        label:
          "Rhodes, G. (2006). The evolutionary psychology of facial beauty. Annual Review of Psychology.",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3130383/",
      },
      {
        label:
          "Hitsch, G. J., Hortaçsu, A., & Ariely, D. (2010). What makes you click? Mate preferences in online dating. Quantitative Marketing and Economics.",
        href: "https://www.nber.org/papers/w13072",
      },
      {
        label:
          "Vaillancourt, T. (2013). Do human females use indirect aggression as an intrasexual competition strategy? Philosophical Transactions of the Royal Society B.",
        href: "https://royalsocietypublishing.org/doi/10.1098/rstb.2013.0078",
      },
      {
        label:
          "Andersson, M. (1994). Sexual Selection. Princeton University Press.",
        href: "https://press.princeton.edu/books/paperback/9780691000572/sexual-selection",
      },
      {
        label:
          "Zahavi, A. (1975). Mate selection-a selection for a handicap. Journal of Theoretical Biology.",
        href: "https://www.sciencedirect.com/science/article/abs/pii/0022519375902113",
      },
    ],
  },
  {
    id: "masculine-aesthetic-advantage",
    tabLabel: "The Masculine Aesthetic Advantage",
    title: "The Man Must be Better Looking or at Par with the Woman for the Relationship to be Happy.",
    paragraphs: [
      "Looksmaxxing is not vanity. Treating your appearance as a project is one of the clearest forms of self-respect. When you stop neglecting how you present yourself, you start holding yourself to a higher standard everywhere else.",
      "Appearance changes expectations, and expectations change behavior. Attractive people are often treated as more capable, more social, and more valuable, which creates a feedback loop: better treatment, better self-perception, better conduct. Over time, presentation stops being cosmetic and becomes behavioral. What begins as appearance can harden into discipline, dignity, and self-respect.",
      "But there is another layer. Across the animal kingdom, males are often the more beautiful sex: the peacock with its iridescent blue-green train and eye-spot feathers, the mandarin duck with its ornate crest, orange sails, and purple breast, the bird of paradise with its elaborate plumes and courtship displays, the dragonfly flashing metallic blues and reds, the lion with his thick mane, the elephant seal with his sheer mass and bulbous nose, the guppy with bright color against drab females, the pheasant with metallic plumage and a long tail, the scarlet macaw with richer saturation, and the mandrill whose red-blue facial coloration and size far outshine the female. Evolution built male beauty to attract mates and to signal dominance that reduces conflict.",
      "When you become the better-looking male, something counterintuitive happens. Other men do not attack you; they give you space. Male-male harassment drops because your face signals high status before confrontation becomes necessary. You spend less time proving yourself, less money on dates that go nowhere. Women, attracted to the signal, begin to approach. The energy you once wasted chasing now flows toward you.",
      "This is not fantasy. It is biology.",
      "If you doubt, look at the species where the male is the ornamented sex. Beauty there serves as both invitation and deterrent. It says: I have resources, I have genetics, I am not worth challenging. The same dynamic plays out in human interaction, quiet but constant.",
      "If a man irritates you, there is a simple test. Ask to take a photo with him. Then, afterward, compliment his looks. Watch him grow uneasy-squeamish, even. His brain will short-circuit. Why is this guy, who is clearly better looking than me, complimenting me?",
      "That is the total proof. You are better looking and nicer than him. There is no angle for him to attack. No insecurity to project. No comeback that doesn't make him look small.",
      "It works the same way size works in a physical confrontation. Men see a bigger guy-broader shoulders, thicker arms, visible mass-and they instinctively recalibrate. They do not want to fight. The risk is too high. The outcome is too certain. They may grumble, posture, or quietly seethe, but they do not engage. The visual signal alone ends the negotiation before it begins.",
      "A better face operates on the same primal circuit. When a man sees someone clearly above him in facial aesthetics-sharper jaw, stronger cheekbones, lifted brow, symmetrical structure-his hindbrain sends the same message: Do not compete. You will lose. Height, for all its cultural weight, does not trigger this same automatic deference. A tall man with a forgettable face still gets challenged. A shorter man with a commanding face rarely does.",
      "Men do not want to compete with a guy who clearly outranks them in the face. They see it. They register it. And once they do, they leave you alone. Not from fear-from recognition. The hierarchy is settled. No words needed.",
      "You won. He knows it. Now move on.",
    ],
    desktopSrc: "/section_wallpaper/research/refined_images/10_desktop.jpg",
    mobileSrc: "/section_wallpaper/research/refined_images/10_mobile.jpg",
    alt: "Masculine aesthetic advantage infographic",
    sources: [
      {
        label:
          "Snyder, M., Tanke, E. D., & Berscheid, E. (1977). Social perception and interpersonal behavior: On the self-fulfilling nature of social stereotypes. Journal of Personality and Social Psychology.",
        href: "https://faculty.washington.edu/jdb/345/345%20Articles/Snyder%20et%20al.%20%281977%29.pdf",
      },
      {
        label:
          "Zebrowitz, L. A. (2008). Social psychological face perception: Why appearance matters. Social and Personality Psychology Compass.",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2811283/",
      },
      {
        label:
          "Griffin, A. M., & Langlois, J. H. (2006). Stereotype directionality and attractiveness stereotyping: Is beauty good or is ugly bad? Social Cognition.",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC1447532/",
      },
      {
        label: "Andersson, M. (1994). Sexual Selection. Princeton University Press.",
        href: "https://press.princeton.edu/books/paperback/9780691000572/sexual-selection",
      },
      {
        label:
          "Zahavi, A. (1975). Mate selection-a selection for a handicap. Journal of Theoretical Biology.",
        href: "https://www.sciencedirect.com/science/article/abs/pii/0022519375902113",
      },
    ],
  },
];

const ResearchStudies = ({ entrySource = "direct" }: ResearchStudiesProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [canPortal, setCanPortal] = useState(false);
  const activeSlide = researchSlides[activeIndex];

  useEffect(() => {
    setCanPortal(true);
  }, []);

  const handleSelect = (index: number) => {
    if (index === activeIndex) {
      return;
    }

    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    trackSafe("research_story_tab_change", {
      tab: researchSlides[index].tabLabel,
      entrySource,
    });
  };

  useEffect(() => {
    if (!isImageOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsImageOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isImageOpen]);

  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 border-t-[3px] border-black bg-[#17181A] px-4 pb-[15vh] pt-[8vh] md:px-6 md:pb-[24vh] md:pt-[14vh]">
      <div className="absolute inset-0 -z-10 bg-[#17181A]" />

      <div className="mx-auto w-full max-w-[118rem]">
        <div className="research-panel-shell rounded-[2rem] bg-[#17181A] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.45)] md:p-8">
          <div className="flex flex-col gap-4 pt-3 md:gap-6 md:pt-0">
            <div className="mt-2 flex flex-nowrap items-center justify-center gap-2 overflow-x-auto pb-1 md:mt-0 md:flex-wrap md:justify-center md:gap-3 md:overflow-visible md:pb-0">
              {researchSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => handleSelect(index)}
                  aria-pressed={index === activeIndex}
                  className={`group relative shrink-0 rounded-[1.15rem] border p-2 text-left transition md:flex md:min-w-[16rem] md:items-center md:gap-3 md:px-4 md:py-3 ${
                    index === activeIndex
                      ? "border-[#f1d27a] bg-[rgba(95,76,24,0.28)] text-white shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
                      : "border-white/10 bg-[rgba(26,26,30,0.7)] text-white/72 opacity-45 saturate-0 hover:border-[#b89648] hover:opacity-70 md:opacity-100 md:saturate-100 md:hover:text-white/92"
                  }`}
                >
                  <span className="block overflow-hidden rounded-[0.8rem] border border-white/10 bg-black/30">
                    <picture>
                      <source media="(max-width: 767px)" srcSet={slide.mobileSrc} />
                      <source srcSet={slide.desktopSrc} />
                      <img
                        src={slide.desktopSrc}
                        alt=""
                        aria-hidden="true"
                        className="h-12 w-12 object-cover md:h-14 md:w-14"
                        loading="lazy"
                      />
                    </picture>
                  </span>
                  <span className="hidden min-w-0 md:block">
                    <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.16em] md:text-[0.76rem]">
                      {slide.tabLabel}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <m.div
                  key={activeSlide.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 40 }}
                  transition={{ duration: 0.38, ease: "easeOut" }}
                  className="grid gap-5 md:grid-cols-[minmax(0,1.4fr)_minmax(22rem,0.9fr)] md:items-start md:gap-8"
                >
                  <m.button
                    type="button"
                    layoutId={`research-image-${activeSlide.id}`}
                    onClick={() => setIsImageOpen(true)}
                    className="block overflow-hidden rounded-[1.6rem] border border-white/10 bg-[rgba(8,8,10,0.88)] text-left shadow-[0_26px_70px_rgba(0,0,0,0.32)] outline-none transition hover:border-[#f1d27a]/55 focus-visible:border-[#f1d27a] md:mx-auto md:w-[94%]"
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    aria-label={`Open ${activeSlide.tabLabel} research image`}
                  >
                    <picture>
                      <source media="(max-width: 767px)" srcSet={activeSlide.mobileSrc} />
                      <source srcSet={activeSlide.desktopSrc} />
                      <img
                        src={activeSlide.desktopSrc}
                        alt={activeSlide.alt}
                        className="block h-auto w-full object-cover"
                      />
                    </picture>
                  </m.button>

                  <div className="research-copy-scroll rounded-[1.6rem] border border-white/10 bg-[#17181A] p-5 text-left text-white/88 shadow-[0_24px_64px_rgba(0,0,0,0.22)] md:max-h-[min(76vh,72rem)] md:overflow-y-auto md:p-7">
                    <h2 className="text-[1.05rem] font-semibold uppercase leading-tight tracking-[0.12em] text-[#f1d27a] md:text-[1.35rem]">
                      {activeSlide.title}
                    </h2>
                    {activeSlide.subtitle ? (
                      <p className="mt-4 text-[1rem] font-medium leading-relaxed text-white md:text-[1.08rem]">
                        {activeSlide.subtitle}
                      </p>
                    ) : null}

                    <div className="mt-5 space-y-4 text-[0.97rem] leading-[1.78] md:mt-6 md:text-[1.02rem]">
                      {activeSlide.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    {activeSlide.secondaryTitle ? (
                      <div className="mt-8 border-t border-white/10 pt-6">
                        <h3 className="text-[0.95rem] font-semibold uppercase leading-tight tracking-[0.12em] text-[#f1d27a] md:text-[1.08rem]">
                          {activeSlide.secondaryTitle}
                        </h3>
                        <div className="mt-5 space-y-4 text-[0.97rem] leading-[1.78] md:text-[1.02rem]">
                          {activeSlide.secondaryParagraphs?.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-8 border-t border-white/10 pt-5">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-white/58">
                        Sources
                      </p>
                      <div className="mt-3 space-y-2.5 text-[0.82rem] leading-relaxed text-white/74">
                        {activeSlide.sources.map((source) => (
                          <p key={source.href}>
                            {source.label}{" "}
                            <a
                              href={source.href}
                              target="_blank"
                              rel="noreferrer"
                              className="text-white underline underline-offset-4 hover:text-white/84"
                            >
                              Link
                            </a>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      {canPortal
        ? createPortal(
            <AnimatePresence>
              {isImageOpen ? (
                <m.div
                  className="fixed inset-0 z-[100] flex h-[100dvh] w-screen items-center justify-center bg-black/82 p-4 backdrop-blur-md md:p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setIsImageOpen(false)}
                >
                  <button
                    type="button"
                    aria-label="Close research image"
                    onClick={() => setIsImageOpen(false)}
                    className="absolute right-4 top-4 z-[102] flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/70 text-2xl leading-none text-white/88 shadow-[0_18px_50px_rgba(0,0,0,0.45)] transition hover:border-[#f1d27a] hover:text-white md:right-8 md:top-8"
                  >
                    ×
                  </button>
                  <m.div
                    layoutId={`research-image-${activeSlide.id}`}
                    className="relative z-[101] flex max-h-[88dvh] max-w-[94vw] items-center justify-center overflow-hidden rounded-[1.2rem] border border-white/16 bg-black shadow-[0_32px_120px_rgba(0,0,0,0.72)]"
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <picture>
                      <source media="(max-width: 767px)" srcSet={activeSlide.mobileSrc} />
                      <source srcSet={activeSlide.desktopSrc} />
                      <img
                        src={activeSlide.desktopSrc}
                        alt={activeSlide.alt}
                        className="block max-h-[88dvh] max-w-[94vw] object-contain"
                      />
                    </picture>
                  </m.div>
                </m.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </section>
  );
};

export default ResearchStudies;
