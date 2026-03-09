import { useMemo, useRef, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackSafe } from "@/lib/analytics";

type ResearchStudiesProps = {
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "reddit" | "twitter" | "direct";
};

const ResearchStudies = ({ entrySource = "direct" }: ResearchStudiesProps) => {
  const isFourChan = entrySource === "4chan";
  const makeFourChanValue = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
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
        label: "Foundation",
        text: [
          "Facial structure is not superficial.",
          "Human perception is highly sensitive to symmetry, bone structure, and facial balance.",
          "Research consistently shows that facial structure influences trust, attraction, leadership perception, and social outcomes.",
          "Beauty is not random.",
          "It is structural.",
        ],
        sources: [
          {
            label: "Maxims or Myths of Beauty? (meta-analysis, 2000)",
            href: "https://pubmed.ncbi.nlm.nih.gov/10825783/?utm_source=chatgpt.com",
          },
          {
            label: "What is Beautiful is Good (classic halo-effect study)",
            href: "https://www4.uwsp.edu/psych/s/389/dion72.pdf?utm_source=chatgpt.com",
          },
        ],
      },
      {
        label: "Doors",
        text: [
          "Doors open. Literally and figuratively. The attractive man is waved through security checkpoints while the other is searched. He is pulled over and released with a warning; the other receives a ticket. Studies in jurisprudence have shown that physically appealing defendants receive lighter sentences for the same crimes. The law, supposedly blind, is not blind at all—it is human, and humans are weak to a well-proportioned face.",
          "This is not fair. This is simply true.",
        ],
        sources: [
          {
            label: "Efran (1974) physical appearance and judgments of guilt",
            href: "https://www.sciencedirect.com/science/article/abs/pii/0092656674900440?utm_source=chatgpt.com",
          },
          {
            label: "Mazzella & Feingold (1994) meta-analysis",
            href: "https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1559-1816.1994.tb01552.x?utm_source=chatgpt.com",
          },
          {
            label: "Beaver et al. (2019) attractiveness bias review",
            href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6762156/?utm_source=chatgpt.com",
          },
        ],
      },
      {
        label: "Gravity",
        text: [
          "In social spaces, the dynamic is even more pronounced. The attractive man does not approach; he is approached. Women manufacture reasons to stand near him, to brush against him, to ask him questions to which they already know the answers. It is not manipulation; it is magnetism. His presence alters the geometry of a room. People orient toward him like flowers to a sun they do not consciously see.",
          "Dating, for him, is not a hunt. It is a selection process. His options are not limited by his job, his car, or his wit—though those help—but by the simple, brutal arithmetic of his jawline and cheekbones. His potential partners forgive awkwardness. They forgive silence. They forgive mistakes they would hold against another man for years.",
        ],
        sources: [
          {
            label: "Duchenne smile research",
            href: "https://akjournals.com/downloadpdf/journals/1126/5/1/article-p183.pdf?utm_source=chatgpt.com",
          },
          {
            label: "EMG studies on attractiveness",
            href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3269167/?utm_source=chatgpt.com",
          },
          {
            label: "Good-looking people are not what we think (Feingold, 1992)",
            href: "https://www.semanticscholar.org/paper/Good-looking-people-are-not-what-we-think.-Feingold/7a30a68c4d9534e12231a7ac95fe86c867c77566?utm_source=chatgpt.com",
          },
        ],
      },
      {
        label: "Career",
        text: [
          "But it does not stop at romance.",
          "Careers are built on this currency. The attractive man is hired faster, promoted sooner, and paid more over his lifetime. This is not opinion; this is longitudinal data. He is perceived as more competent, more intelligent, more capable—even when his resume is identical to the man sitting across from him. His face is a resume of its own, scanned and judged in milliseconds before a single word is spoken.",
          "He receives better service. Waiters remember his name. Bartenders pour heavier. Strangers smile. The world, for him, is slightly warmer, slightly softer, slightly more forgiving.",
        ],
        sources: [
          {
            label: "Beauty and the Labor Market (Hamermesh & Biddle, 1994)",
            href: "https://www.nber.org/papers/w4518?utm_source=chatgpt.com",
          },
          {
            label: "Why Beauty Matters (Mobius & Rosenblat, 2006)",
            href: "https://www.aeaweb.org/articles?id=10.1257%2F000282806776157515&utm_source=chatgpt.com",
          },
          {
            label: "Ruffle & Shtudiner (2015) callbacks",
            href: "https://pubsonline.informs.org/doi/10.1287/mnsc.2014.1927?utm_source=chatgpt.com",
          },
          {
            label: "Judge, Hurst & Simon (2009) lifetime earnings",
            href: "https://www.apa.org/pubs/journals/releases/apl943742.pdf?utm_source=chatgpt.com",
          },
          {
            label: "Observers’ facial EMG responses and service warmth",
            href: "https://www.sciencedirect.com/science/article/pii/S1090513899000367?utm_source=chatgpt.com",
          },
        ],
      },
      {
        label: "Return",
        text: [
          "And then something strange happens.",
          "Because the world expects more from him, he begins to expect more from himself. He dresses better. He speaks more carefully. He holds doors. He becomes the man everyone assumed he was. The expectation becomes the reality. Beauty, in this way, is not just a gift given at birth—it is a loan that accrues interest, compounding into character over time.",
        ],
      },
      {
        label: "Problem",
        text: [
          "You see the problem.",
          "If you were born without it, you have been navigating the world on hard mode without ever being told. You have been invisible when you should have been seen. You have been passed over when you should have been chosen. You have been spoken down to when you should have been respected. And you have internalized all of it as something wrong with you, rather than something wrong with the wiring of the species.",
        ],
      },
      {
        label: "Question",
        text: [
          "So let me ask you:",
          "How many opportunities have slipped through your hands because of the way light falls across your face?",
          "How many conversations have ended before they began because your bone structure did not signal safety, strength, or symmetry?",
          "How many times have you watched a man with less to offer walk away with what should have been yours, simply because his face opened doors that yours kept closed?",
        ],
      },
      {
        label: "Choice",
        text: [
          "And if the research is correct—if muscle can influence bone, if tension can reshape structure, if the face is not fixed but fluid—then what are you willing to endure to change it?",
          "Because the exercises hurt. They are boring. They take months.",
          "But so does regret.",
        ],
        sources: [
          {
            label: "Facial exercise study (JAMA Dermatology, 2018)",
            href: "https://jamanetwork.com/journals/jamadermatology/fullarticle/2666801?utm_source=chatgpt.com",
          },
          {
            label: "Masticatory muscle studies (Kiliaridis, 1986; 1995)",
            href: "https://pubmed.ncbi.nlm.nih.gov/3465055/?utm_source=chatgpt.com",
          },
          {
            label: "Kiliaridis (1995) jaw adaptation",
            href: "https://actaorthop.org/actaodontologica/article/download/39557/44744?utm_source=chatgpt.com",
          },
          {
            label: "Soft-diet model (Kono et al., 2017)",
            href: "https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2017.00567/full?utm_source=chatgpt.com",
          },
        ],
      },
    ],
    [],
  );
  const [activeNarrative, setActiveNarrative] = useState(0);
  const [direction, setDirection] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const currentNarrative = narrativeTabs[activeNarrative];

  const setNarrative = (index: number) => {
    if (index === activeNarrative) {
      return;
    }
    setDirection(index > activeNarrative ? 1 : -1);
    setActiveNarrative(index);
  };

  const handleParallaxMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (rafRef.current) {
      return;
    }
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      setParallaxOffset({ x: x * 48, y: y * 32 });
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
      className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 px-6 py-12 md:py-20"
      onPointerMove={handleParallaxMove}
      onPointerLeave={handleParallaxLeave}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#b9b9b9]" />
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
                    className="rounded-full border border-black/10 bg-white/30 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black/60 data-[state=active]:border-black/40 data-[state=active]:bg-black/10 data-[state=active]:text-black"
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
              <p className="text-[10px] uppercase tracking-[0.35em] text-chrome/70 md:text-xs">
                Research snapshot
              </p>
              <h2 className="mt-3 text-2xl font-light tracking-tight text-black md:text-4xl">
                Why Facial Structure Matters
              </h2>
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
                      className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.3em] transition ${
                        index === activeNarrative
                          ? "border-black/40 bg-black/10 text-black"
                          : "border-black/10 bg-white/30 text-black/60 hover:text-black"
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
                      className="space-y-4 text-sm text-steel md:text-base"
                    >
                      {currentNarrative.text.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {currentNarrative.sources && currentNarrative.sources.length > 0 && (
                        <div className="pt-3">
                          <p className="text-[10px] uppercase tracking-[0.35em] text-chrome/80">
                            Sources
                          </p>
                          <ul className="mt-3 space-y-2 text-xs text-steel">
                            {currentNarrative.sources.map((source) => (
                              <li key={source.href}>
                                {source.label}
                                {" "}
                                <a
                                  href={source.href}
                                  className="text-ice underline-offset-4 hover:underline"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Link
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </m.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white/16 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl md:p-8">
              <Tabs
                defaultValue="awareness"
                onValueChange={(value) => {
                  trackSafe("research_tab_change", { tab: value, variant: "studies" });
                }}
              >
                <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0 text-chrome/70">
                  <TabsTrigger
                    value="awareness"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-steel data-[state=active]:border-white/30 data-[state=active]:bg-white/15 data-[state=active]:text-foreground"
                  >
                    Awareness
                  </TabsTrigger>
                  <TabsTrigger
                    value="authority"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-steel data-[state=active]:border-white/30 data-[state=active]:bg-white/15 data-[state=active]:text-foreground"
                  >
                    Authority
                  </TabsTrigger>
                  <TabsTrigger
                    value="social"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-steel data-[state=active]:border-white/30 data-[state=active]:bg-white/15 data-[state=active]:text-foreground"
                  >
                    Social
                  </TabsTrigger>
                  <TabsTrigger
                    value="dating"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-steel data-[state=active]:border-white/30 data-[state=active]:bg-white/15 data-[state=active]:text-foreground"
                  >
                    Dating
                  </TabsTrigger>
                  <TabsTrigger
                    value="income"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-steel data-[state=active]:border-white/30 data-[state=active]:bg-white/15 data-[state=active]:text-foreground"
                  >
                    Income
                  </TabsTrigger>
                  <TabsTrigger
                    value="service"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-steel data-[state=active]:border-white/30 data-[state=active]:bg-white/15 data-[state=active]:text-foreground"
                  >
                    Service
                  </TabsTrigger>
                  <TabsTrigger
                    value="physiology"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-steel data-[state=active]:border-white/30 data-[state=active]:bg-white/15 data-[state=active]:text-foreground"
                  >
                    Physiology
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="awareness" className="mt-6">
                  <h3 className="text-xs uppercase tracking-[0.35em] text-chrome/80">
                    Beauty operates below conscious awareness
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-steel">
                    <li>
                      Maxims or Myths of Beauty? (meta-analysis, 2000)
                      {" "}
                      <a
                        href="https://pubmed.ncbi.nlm.nih.gov/10825783/?utm_source=chatgpt.com"
                        className="text-ice underline-offset-4 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        PubMed
                      </a>
                    </li>
                    <li>
                      What is Beautiful is Good (classic halo-effect study)
                      {" "}
                      <a
                        href="https://www4.uwsp.edu/psych/s/389/dion72.pdf?utm_source=chatgpt.com"
                        className="text-ice underline-offset-4 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        PDF
                      </a>
                    </li>
                  </ul>
                </TabsContent>

          <TabsContent value="authority" className="mt-6">
            <h3 className="text-xs uppercase tracking-[0.35em] text-chrome/80">
              Attractive people are treated better by authorities
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-steel">
              <li>
                Efran (1974) physical appearance reduces judgment of guilt
                {" "}
                <a
                  href="https://www.sciencedirect.com/science/article/abs/pii/0092656674900440?utm_source=chatgpt.com"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  ScienceDirect
                </a>
              </li>
              <li>
                Mazzella &amp; Feingold (1994 meta-analysis)
                {" "}
                <a
                  href="https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1559-1816.1994.tb01552.x?utm_source=chatgpt.com"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Wiley
                </a>
              </li>
              <li>
                Beaver et al. (2019 review) on legal perception bias
                {" "}
                <a
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6762156/?utm_source=chatgpt.com"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  PMC
                </a>
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <h3 className="text-xs uppercase tracking-[0.35em] text-chrome/80">
              Social attention and approach behavior
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-steel">
              <li>
                Duchenne smile research
                {" "}
                <a
                  href="https://akjournals.com/downloadpdf/journals/1126/5/1/article-p183.pdf?utm_source=chatgpt.com"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  PDF
                </a>
              </li>
              <li>
                EMG studies on attractiveness
                {" "}
                <a
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3269167/?utm_source=chatgpt.com"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  PMC
                </a>
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="dating" className="mt-6">
            <h3 className="text-xs uppercase tracking-[0.35em] text-chrome/80">
              Dating opportunities and social leniency
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-steel">
              <li>
                Good-looking people are not what we think (Feingold, 1992)
                {" "}
                <a
                  href="https://www.semanticscholar.org/paper/Good-looking-people-are-not-what-we-think.-Feingold/7a30a68c4d9534e12231a7ac95fe86c867c77566?utm_source=chatgpt.com"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Semantic Scholar
                </a>
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="income" className="mt-6">
            <h3 className="text-xs uppercase tracking-[0.35em] text-chrome/80">
              Hiring, income, and promotion ("beauty premium")
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-steel">
              <li>
                Beauty and the Labor Market (Hamermesh &amp; Biddle, 1994)
                {" "}
                <a
                  href="https://www.nber.org/papers/w4518?utm_source=chatgpt.com"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  NBER
                </a>
              </li>
              <li>
                Why Beauty Matters (Mobius &amp; Rosenblat, 2006)
                {" "}
                <a
                  href="https://www.aeaweb.org/articles?id=10.1257%2F000282806776157515&utm_source=chatgpt.com"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  AEA
                </a>
              </li>
              <li>
                Ruffle &amp; Shtudiner (2015) callbacks
                {" "}
                <a
                  href="https://pubsonline.informs.org/doi/10.1287/mnsc.2014.1927?utm_source=chatgpt.com"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Management Science
                </a>
              </li>
              <li>
                Judge, Hurst &amp; Simon (2009) lifetime earnings
                {" "}
                <a
                  href="https://www.apa.org/pubs/journals/releases/apl943742.pdf?utm_source=chatgpt.com"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  PDF
                </a>
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="service" className="mt-6">
            <h3 className="text-xs uppercase tracking-[0.35em] text-chrome/80">
              Attractive people elicit more positive service
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-steel">
              <li>
                Observers’ facial EMG responses show reduced negative emotion activity
                {" "}
                <a
                  href="https://www.sciencedirect.com/science/article/pii/S1090513899000367?utm_source=chatgpt.com"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  ScienceDirect
                </a>
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="physiology" className="mt-6">
            <h3 className="text-xs uppercase tracking-[0.35em] text-chrome/80">
              Facial structure can change
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-steel">
              <li>
                Facial exercise study (JAMA Dermatology, 2018)
                {" "}
                <a
                  href="https://jamanetwork.com/journals/jamadermatology/fullarticle/2666801?utm_source=chatgpt.com"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  JAMA
                </a>
              </li>
              <li>
                Masticatory muscle studies (Kiliaridis, 1986; 1995)
                {" "}
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/3465055/?utm_source=chatgpt.com"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  PubMed
                </a>
              </li>
              <li>
                Kiliaridis (1995) jaw adaptation
                {" "}
                <a
                  href="https://actaorthop.org/actaodontologica/article/download/39557/44744?utm_source=chatgpt.com"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Acta
                </a>
              </li>
              <li>
                Soft-diet model (Kono et al., 2017)
                {" "}
                <a
                  href="https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2017.00567/full?utm_source=chatgpt.com"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Frontiers
                </a>
              </li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )}
</div>
</section>
  );
};

export default ResearchStudies;
