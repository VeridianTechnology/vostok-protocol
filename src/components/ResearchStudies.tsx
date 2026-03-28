import { useMemo, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackSafe } from "@/lib/analytics";
import SectionSideTab from "@/components/SectionSideTab";

type ResearchStudiesProps = {
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "reddit" | "twitter" | "direct";
};

const ResearchStudies = ({ entrySource = "direct" }: ResearchStudiesProps) => {
  const isFourChan = entrySource === "4chan";
  const makeFourChanValue = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const isNarrativeCallout = (text: string) =>
    text === "Why it matters:" ||
    text === "The logic:" ||
    text === "Studies:" ||
    text === "You see the problem." ||
    text === "This is not fair. This is simply true.";
  const fourChanSections = [
    {
      title: "Beauty Is Not Superficial",
      body: [
        "Beauty is structure.",
        "It is geometry.",
        "It is the silent architecture of human interaction.",
        "Your brain is a pattern-recognition machine that evolved over hundreds of thousands of years.",
        "It scans faces for symmetry, health, and dominance before you even finish blinking.",
        "You don't consciously choose who looks trustworthy.",
        "Your nervous system already decided.",
        "All beauty does is trigger ancient code.",
      ],
    },
    {
      title: "Life On Easy Mode",
      body: [
        "If you have it, the world is different.",
        "Security guards wave you through.",
        "Police let you off with warnings.",
        "Judges give lighter sentences to attractive defendants for the same crimes.",
        "Yes, this is documented.",
        "No, it isn't fair.",
        "It's human nature.",
      ],
    },
    {
      title: "Social Gravity",
      body: [
        "In a room full of people, attention has mass.",
        "And attractive men have gravity.",
        "They don't chase conversations.",
        "Conversations orbit them.",
        "People drift closer.",
        "Questions appear out of nowhere.",
        "The room rearranges itself around presence.",
        "Not manipulation.",
        "Physics.",
      ],
    },
    {
      title: "The Dating Equation",
      body: [
        "Dating for the average man is pursuit.",
        "Dating for the attractive man is selection.",
        "Same room. Same women.",
        "Completely different game.",
        "The difference is bone structure.",
        "A stronger jawline buys patience.",
        "Silence becomes mysterious instead of awkward.",
        "Mistakes get forgiven.",
        "Because the brain already decided he belongs.",
      ],
    },
    {
      title: "The Beauty Premium",
      body: [
        "This extends far beyond dating.",
        "Attractive people get hired faster.",
        "Promoted sooner.",
        "Paid more over a lifetime.",
        "Same resume.",
        "Same qualifications.",
        "Different face.",
        "Your appearance is evaluated before you speak a single word.",
        "Milliseconds.",
        "That's all it takes.",
      ],
    },
    {
      title: "The Feedback Loop",
      body: [
        "Something interesting happens next.",
        "When the world treats you like a high-status person, you start behaving like one.",
        "You dress sharper.",
        "You speak with intention.",
        "You move with certainty.",
        "Expectations become reality.",
        "Beauty compounds.",
        "Like interest in a bank account.",
      ],
    },
    {
      title: "The Hidden Difficulty Setting",
      body: [
        "Now imagine the opposite.",
        "You were born without that advantage.",
        "Doors close before you reach them.",
        "People underestimate you.",
        "Conversations end early.",
        "Respect comes slower.",
        "And nobody explains why.",
        "So you assume the problem is you.",
        "But the problem is the system.",
        "Humans are wired this way.",
      ],
    },
    {
      title: "The Question",
      body: [
        "How many chances disappeared because your face didn't signal strength?",
        "How many conversations ended before they began?",
        "How many times did someone with less intelligence, less discipline, and less ambition walk away with what should have been yours...",
        "simply because their bone structure opened doors?",
      ],
    },
    {
      title: "The Possibility",
      body: [
        "Now imagine something else.",
        "What if the face isn't static?",
        "What if muscle affects bone?",
        "What if tension shapes structure?",
        "What if the face is not fixed...",
        "But Trainable?",
      ],
    },
    {
      title: "The Cost",
      body: [
        "The exercises hurt.",
        "They're repetitive.",
        "They take months.",
        "Most people quit.",
        "But regret also takes months.",
        "Then years.",
        "Then decades.",
        "Choose your difficulty.",
      ],
    },
  ];
  const narrativeTabs = useMemo(
    () => [
      {
        label: "The Financial & Bureaucratic Bypass",
        text: [
          "Why it matters, looking good lowers friction. When your face signals trust and competence immediately, people move faster, hesitate less, and treat you like less of a risk. In a world ruled by first impressions, that difference compounds.",
          "The logic, beauty is not a trivial preference. People make fast, automatic judgments from faces, and attractiveness spills into assumptions about competence, warmth, and value. That bias has measurable economic effects, including a documented beauty premium in work that depends on human interaction.",
        ],
        sources: [
          {
            label: "Willis, J., & Todorov, A. (2006). First impressions: Making up your mind after a 100-ms exposure to a face. Psychological Science.",
            href: "https://pubmed.ncbi.nlm.nih.gov/16866745/",
          },
          {
            label: "Lin, C., Keles, U., & Adolphs, R. (2021). Four dimensions characterize attributions from faces using a representative set of English trait words. Nature Communications.",
            href: "https://www.nature.com/articles/s41467-021-25500-y",
          },
          {
            label: "Ritchie, K. L., Palermo, R., & Rhodes, G. (2017). Forming impressions of facial attractiveness is mandatory. Scientific Reports.",
            href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5428706/",
          },
          {
            label: "Hamermesh, D. S., & Biddle, J. E. (1994). Beauty and the Labor Market. NBER Working Paper 4518.",
            href: "https://www.nber.org/papers/w4518",
          },
          {
            label: "Stinebrickner, R., Stinebrickner, T. R., & Sullivan, P. J. (2019). Beauty, Job Tasks, and Wages. Journal of Labor Economics.",
            href: "https://www.nber.org/papers/w24479",
          },
        ],
      },
      {
        label: "The Dating Market Efficiencies",
        text: [
          "Dating should not feel like labor. When your appearance is working for you, pursuit becomes selection. You stop forcing interest and move through dating with more calm, leverage, and less anxiety.",
          "Attraction is not negotiated from scratch. People form impressions from faces quickly, and physical attractiveness strongly shapes romantic interest in early encounters. Judgments of facial attractiveness are also influenced by cues like symmetry, averageness, and sexually dimorphic structure, which helps explain why some people generate immediate attention before they have said much at all. In practice, better looks can shift the starting position toward more openness, more forgiveness, and less resistance.",
        ],
        sources: [
          {
            label: "Willis, J., & Todorov, A. (2006). First impressions: Making up your mind after a 100-ms exposure to a face. Psychological Science.",
            href: "https://pubmed.ncbi.nlm.nih.gov/16866745/",
          },
          {
            label: "Eastwick, P. W., Finkel, E. J., Mochon, D., & Ariely, D. (2007). Selective versus unselective romantic desire: Not all reciprocity is created equal. Psychological Science.",
            href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5519305/",
          },
          {
            label: "Rhodes, G. (2006). The evolutionary psychology of facial beauty. Annual Review of Psychology.",
            href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3130383/",
          },
          {
            label: "Walter, K. V., Conroy-Beam, D., & Buss, D. M. (2020). Sex differences in mate preferences across 45 countries: A large-scale replication. Psychological Science.",
            href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10684645/",
          },
          {
            label: "Hitsch, G. J., Hortaçsu, A., & Ariely, D. (2010). What makes you click? Mate preferences in online dating. Quantitative Marketing and Economics.",
            href: "https://www.nber.org/papers/w13072",
          },
        ],
      },
      {
        label: "Radical Self-Respect (The Internal Shift)",
        text: [
          "Looksmaxxing is not vanity. Treating your appearance as a project is one of the clearest forms of self-respect. When you stop neglecting how you present yourself, you start holding yourself to a higher standard everywhere else.",
          "Appearance changes expectations, and expectations change behavior. Attractive people are often treated as more capable, more social, and more valuable, which can create a feedback loop: better treatment, better self-perception, better conduct. Over time, presentation stops being cosmetic and becomes behavioral. What begins as appearance can harden into discipline, dignity, and self-respect.",
        ],
        sources: [
          {
            label: "Snyder, M., Tanke, E. D., & Berscheid, E. (1977). Social perception and interpersonal behavior: On the self-fulfilling nature of social stereotypes. Journal of Personality and Social Psychology.",
            href: "https://faculty.washington.edu/jdb/345/345%20Articles/Snyder%20et%20al.%20%281977%29.pdf",
          },
          {
            label: "Zebrowitz, L. A. (2008). Social psychological face perception: Why appearance matters. Social and Personality Psychology Compass.",
            href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2811283/",
          },
          {
            label: "Griffin, A. M., & Langlois, J. H. (2006). Stereotype directionality and attractiveness stereotyping: Is beauty good or is ugly bad? Social Cognition.",
            href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC1447532/",
          },
        ],
      },
      {
        label: "Social Hierarchy & The Confidence Dividend",
        text: [
          "Social status is not just ego. It changes how you move through the world. Looking better can raise your position in the social hierarchy, and that elevation, handled with humility, creates confidence that compounds over time.",
          "Appearance shapes status judgments quickly. Attractive faces are often assumed to be more competent, more socially skilled, and more worthy of attention, which changes how people respond from the start. That response can create a feedback loop: better treatment leads to stronger self-perception, which improves presence, which then improves treatment again. Confidence is not built in isolation. It is built through repeated social reinforcement.",
        ],
        sources: [
          {
            label: "Dion, K., Berscheid, E., & Walster, E. (1972). What is beautiful is good. Journal of Personality and Social Psychology.",
            href: "https://psycnet.apa.org/record/1973-05802-001",
          },
          {
            label: "Judge, T. A., Hurst, C., & Simon, L. S. (2009). Does it pay to be smart, attractive, or confident (or all three)? Relationships among general mental ability, physical attractiveness, core self-evaluations, and income. Journal of Applied Psychology.",
            href: "https://www.apa.org/pubs/journals/releases/apl943742.pdf",
          },
          {
            label: "Wu, R., Yang, M., et al. (2021). How boosting self-perceived attractiveness reduces consumers’ choice uncertainty. Journal of Marketing Research.",
            href: "https://journals.sagepub.com/doi/10.1177/00222437211033179",
          },
          {
            label: "Gulati, A., et al. (2024). What is beautiful is still good: the attractiveness halo effect in the era of beauty filters. Royal Society Open Science.",
            href: "https://royalsocietypublishing.org/doi/10.1098/rsos.240882",
          },
        ],
      },
      {
        label: "Career Optionality & Asset Monetization",
        text: [
          "Even if you never model, having the option to monetize your looks changes your career calculus. It gives you leverage, an exit option, and credibility, especially if you are selling a course built on visible transformation.",
          "Appearance has measurable economic value. Attractive people are often hired faster, evaluated more favorably, and paid more over time, even when qualifications are otherwise similar. First impressions form in milliseconds, so your face affects judgment before your resume has a chance to speak. Better looks do not replace competence, but they can improve the starting position.",
        ],
        sources: [
          {
            label: "Hamermesh, D. S., & Biddle, J. E. (1994). Beauty and the Labor Market. American Economic Review / NBER Working Paper 4518.",
            href: "https://www.nber.org/papers/w4518",
          },
          {
            label: "Mobius, M. M., & Rosenblat, T. S. (2006). Why Beauty Matters. American Economic Review, 96(1), 222–235.",
            href: "https://www.aeaweb.org/articles?id=10.1257%2F000282806776157515&utm_source=chatgpt.com",
          },
          {
            label: "Ruffle, B. J., & Shtudiner, Z. (2015). Are Good-Looking People More Employable? Management Science, 61(8), 1760–1776.",
            href: "https://pubsonline.informs.org/doi/10.1287/mnsc.2014.1927",
          },
          {
            label: "Judge, T. A., Hurst, C., & Simon, L. S. (2009). Does It Pay to Be Smart, Attractive, or Confident (or All Three)? Relationships among General Mental Ability, Physical Attractiveness, Core Self-Evaluations, and Income. Journal of Applied Psychology, 94(3), 742–755.",
            href: "https://doi.org/10.1037/a0015497",
          },
        ],
      },
      {
        label: "The Halo Effect: Family & Authority",
        text: [
          "If the halo effect is real, and the evidence says it is, then looks are not just aesthetic. They are leverage. Appearance changes how institutions read you before you speak, and that can affect outcomes in systems where small biases carry real consequences.",
          "People make fast judgments from faces, and those judgments do not stay confined to first impressions. In legal settings, physical attractiveness has been linked to more lenient judgments and better criminal-justice outcomes, while broader halo-effect research shows attractive faces are often seen as more competent, trustworthy, and socially desirable. In practice, better looks can shift the starting position toward less suspicion, more benefit of the doubt, and softer treatment.",
        ],
        sources: [
          {
            label: "Efran, M. G. (1974). The effect of physical appearance on the judgment of guilt, interpersonal attraction, and severity of recommended punishment in a simulated jury task. Journal of Research in Personality.",
            href: "https://www.sciencedirect.com/science/article/pii/0092656674900440",
          },
          {
            label: "Mazzella, R., & Feingold, A. (1994). The Effects of Physical Attractiveness, Race, Socioeconomic Status, and Gender of Defendants and Victims on Judgments of Mock Jurors: A Meta-Analysis. Journal of Applied Social Psychology.",
            href: "https://onlinelibrary.wiley.com/doi/10.1111/j.1559-1816.1994.tb01552.x",
          },
          {
            label: "Beaver, K. M., Boccio, C. M., Smith, S., & Ferguson, C. J. (2019). Physical attractiveness and criminal justice processing: results from a longitudinal sample of youth and young adults. Psychiatry, Psychology and Law.",
            href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6762156/",
          },
          {
            label: "Gulati, A., et al. (2024). What is beautiful is still good: the attractiveness halo effect in the era of beauty filters. Royal Society Open Science.",
            href: "https://royalsocietypublishing.org/doi/10.1098/rsos.240882",
          },
        ],
      },
    ],
    [],
  );
  const [activeNarrative, setActiveNarrative] = useState(0);
  const [direction, setDirection] = useState(0);
  const currentNarrative = narrativeTabs[activeNarrative];

  const setNarrative = (index: number) => {
    if (index === activeNarrative) {
      return;
    }
    setDirection(index > activeNarrative ? 1 : -1);
    setActiveNarrative(index);
  };

  return (
    <section className="section-surface relative left-1/2 right-1/2 w-screen -translate-x-1/2 border-t-[3px] border-black px-6 pb-[15.5vh] pt-[9vh] md:pb-[30vh] md:pt-[22vh]">
      <SectionSideTab label="RESEARCH" />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/section_wallpaper/research/01.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover md:hidden"
        />
        <img
          src="/section_wallpaper/research/01.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.08)_38%,rgba(0,0,0,0.22)_100%)]" />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        {isFourChan ? (
          <div className="rounded-3xl border border-black/10 bg-white/20 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-10">
            <Tabs
              defaultValue={makeFourChanValue(fourChanSections[0].title)}
              onValueChange={(value) => {
                trackSafe("research_tab_change", { tab: value, variant: "4chan" });
              }}
            >
              <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0 text-chrome/70">
                {fourChanSections.map((section) => (
                  <TabsTrigger
                    key={section.title}
                    value={makeFourChanValue(section.title)}
                    className="rounded-full border border-black/10 bg-white/30 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[#4b4b4b] data-[state=active]:border-black/30 data-[state=active]:bg-black/5 data-[state=active]:text-[#3f3f3f]"
                  >
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {fourChanSections.map((section) => (
                <TabsContent
                  key={section.title}
                  value={makeFourChanValue(section.title)}
                  className="mt-5"
                >
                  <div className="rounded-2xl border border-black/10 bg-white/60 p-5 text-sm text-steel md:text-base">
                    {section.body.map((line) => (
                      <p key={line} className="mt-4 first:mt-0">
                        {line}
                      </p>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-black/10 bg-white/20 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-10">
              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2">
                  {narrativeTabs.map((tab, index) => (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => {
                        setNarrative(index);
                        trackSafe("research_story_tab_change", { tab: tab.label });
                      }}
                      className={`max-w-full rounded-full border px-4 py-2 text-center text-[10px] uppercase leading-[1.35] tracking-[0.3em] whitespace-normal [overflow-wrap:anywhere] [hyphens:auto] transition ${
                        index === activeNarrative
                          ? "border-black/20 bg-white/20 text-[#3f3f3f]"
                          : "border-black/10 bg-white/12 text-[#5a5a5a] hover:text-[#3f3f3f]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="relative mt-5 min-h-[14rem] overflow-hidden">
                  <AnimatePresence mode="wait" custom={direction}>
                    <m.div
                      key={currentNarrative.label}
                      custom={direction}
                      initial={{ opacity: 0, x: direction * 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -direction * 30 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="space-y-4 text-center text-sm text-[#4a4a4a] md:text-base"
                    >
                      {currentNarrative.text.map((paragraph) => (
                        <p
                          key={paragraph}
                          className={
                            isNarrativeCallout(paragraph)
                              ? "my-8 text-[1.14rem] font-bold leading-tight text-[#2f2f2f] md:text-[1.24rem]"
                              : undefined
                          }
                        >
                          {isNarrativeCallout(paragraph) ? (
                            <span className="block">{paragraph}</span>
                          ) : (
                            <span className="block">{paragraph}</span>
                          )}
                        </p>
                      ))}
                      {currentNarrative.sources && currentNarrative.sources.length > 0 && (
                        <div className="pt-3 text-center">
                          <p className="text-[10px] uppercase tracking-[0.35em] text-[#666666]">
                            Sources
                          </p>
                          <div className="mt-3 text-xs leading-relaxed text-steel">
                            <p className="whitespace-normal break-words">
                              {currentNarrative.sources.map((source, index) => (
                                <span key={source.href}>
                                  {index > 0 ? ", " : ""}
                                  {source.label}
                                  {" "}
                                  <a
                                    href={source.href}
                                    className="text-blue-700 underline-offset-4 hover:underline"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Link
                                  </a>
                                </span>
                              ))}
                            </p>
                          </div>
                        </div>
                      )}
                    </m.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

    </div>
  )}
</div>
</section>
  );
};

export default ResearchStudies;
