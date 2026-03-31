import { useMemo, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackSafe } from "@/lib/analytics";
import SectionSideTab from "@/components/SectionSideTab";

type ResearchStudiesProps = {
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "reddit" | "twitter" | "direct";
};

type NarrativeTab = {
  label: string;
  text: string[];
  splitIntroTextCount?: number;
  topTitle?: string;
  sources?: Array<{
    label: string;
    href: string;
  }>;
  image?: {
    desktopSrc: string;
    mobileSrc: string;
    alt: string;
    frameClassName?: string;
    imageClassName?: string;
  };
  inlineImages?: Array<{
    beforeText: string;
    desktopSrc: string;
    mobileSrc: string;
    alt: string;
    caption?: string;
    splitLayout?: boolean;
    splitLayoutText?: string[];
    frameClassName?: string;
    imageClassName?: string;
  }>;
  postscripts?: Array<{
    afterText: string;
    title?: string;
    paragraphs: string[];
  }>;
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
  const getNarrativeMicroTitle = (text: string) => {
    if (
      text ===
      "Appearance has measurable economic value. Attractive people are hired faster, evaluated more favorably, and paid more over time, even when qualifications are identical. First impressions form in milliseconds, so your face affects judgment before your resume has a chance to speak. Better looks do not replace competence, but they improve the starting position."
    ) {
      return "Your Looks Determine More than Half Your Social Value";
    }
    if (
      text ===
      "Now consider power. Look at the men who occupy the highest offices. America has never elected an ugly president. Washington, tall and handsome (despite the teeth). Lincoln, widely admired, strikingly tall and genuinely handsome as a young man before war aged him. Truman, sharp-featured. Eisenhower, the face of command. JFK, the literal definition of a hyper-chad. Even today, research shows that facial competence and attractiveness predict election outcomes. Leadership is perceived in a glance."
    ) {
      return "Good Looking Men get Elected";
    }
    if (
      text ===
      "Looksmaxxing is not vanity. Treating your appearance as a project is one of the clearest forms of self-respect. When you stop neglecting how you present yourself, you start holding yourself to a higher standard everywhere else."
    ) {
      return null;
    }
    return null;
  };
  const isAnimalBeautyHeading = (text: string) =>
    text === "Ten animal species where the male is the more beautiful gender";
  const isAnimalBeautyItem = (text: string) =>
    [
      "Peacock - iridescent blue-green train with eye-spot feathers",
      "Mandarin duck - ornate crest, orange sails, purple breast",
      "Bird of paradise - elaborate plumes and complex courtship displays",
      "Dragonfly - many species show metallic blues, reds in males",
      "Lion - thick mane signals fitness and deters rivals",
      "Elephant seal - massive size and bulbous nose signal dominance",
      "Guppy - males are brightly colored; females are drab",
      "Pheasant - long tail, metallic plumage",
      "Scarlet macaw - males often have brighter, more saturated feathers",
      "Mandrill - male's red/blue facial coloration and size far outshine females",
    ].includes(text);
  const isBoldNarrativeLine = (text: string) => text === "Vostok is different.";
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
  const narrativeTabs = useMemo<NarrativeTab[]>(
    () => [
      {
        label: "The Face Card Never Lies",
        topTitle: "The Face Card Never Lies",
        text: [
          "Dating should not feel like labor. When your appearance is working for you, pursuit becomes selection. You stop forcing interest and move through dating with more calm, leverage, and less anxiety.",
          "Attraction is not negotiated from scratch. People form impressions from faces quickly, and physical attractiveness strongly shapes romantic interest in early encounters. Judgments of facial attractiveness are influenced by cues like symmetry, averageness, and sexually dimorphic structure, which helps explain why some people generate immediate attention before they have said much at all. In practice, better looks shift the starting position toward more openness, more forgiveness, and less resistance.",
          "But this dynamic is especially acute among women. Female hierarchy, with the exception of seniority-motherhood, grandmother status, formal authority like a boss-is overwhelmingly structured around looks. Women know this implicitly. Look at any group photo of women. The prettiest ones are almost always positioned in the center. It is not coincidence. It is a visual reckoning of status that happens without a word spoken.",
          "Yes, personality matters. Yes, upbringing shapes character. But the face card reveals everything. While society obsesses over weight-and weight does matter-the face remains the final arbiter of who is considered prettiest by the group. A fit body can be built in the gym. A commanding face requires something else.",
          "If you want to advance in your social circle, you need a better face. This is not vanity. It is strategy. And the method I am presenting is the most effective way for a woman to move up among her peers.",
          "But be careful. When your face improves, your social position shifts. You may find that your current friends-comfortable with the old hierarchy-do not know how to handle the new you. You may have to find a new group. You will also begin re-evaluating your relationships, because you can now attract a higher caliber of man. What once felt like settling now feels like compromise. And once you see the difference, you cannot unsee it.",
          "That is the cost of leveling up. Worth it.",
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
          {
            label: "Anderson, C., Hildreth, J. A. D., & Howland, L. (2015). Is the desire for status a fundamental human motive? A review of the empirical literature. Psychological Bulletin.",
            href: "https://pubmed.ncbi.nlm.nih.gov/25774679/",
          },
          {
            label: "Buss, D. M. (1989). Sex differences in human mate preferences: Evolutionary hypotheses tested in 37 cultures. Behavioral and Brain Sciences.",
            href: "https://www.cambridge.org/core/journals/behavioral-and-brain-sciences/article/sex-differences-in-human-mate-preferences-evolutionary-hypotheses-tested-in-37-cultures/DEAD4D5E1FD4FC13CBAF034BA5E8CB5D",
          },
          {
            label: "Vaillancourt, T. (2013). Do human females use indirect aggression as an intrasexual competition strategy? Philosophical Transactions of the Royal Society B.",
            href: "https://royalsocietypublishing.org/doi/10.1098/rstb.2013.0078",
          },
          {
            label: "Puts, D. A. (2016). Human sexual selection. Current Opinion in Psychology.",
            href: "https://www.sciencedirect.com/science/article/abs/pii/S2352250X16300273",
          },
        ],
      },
      {
        label: "The Masculine Aesthetic Advantage",
        topTitle:
          "The Man Must be Better Looking or at Par with the Woman for the Relationship to be Happy.",
        image: {
          desktopSrc: "/section_wallpaper/research/refined_images/05_desktop.jpg",
          mobileSrc: "/section_wallpaper/research/refined_images/05_mobile.jpg",
          alt: "Masculine aesthetic advantage illustration used in the research section",
          frameClassName:
            "mx-auto mb-3 w-full max-w-[28rem] overflow-hidden rounded-[1.4rem] border border-white/12 bg-white/8 shadow-[0_24px_64px_rgba(0,0,0,0.28)] md:mb-4 md:max-w-[58rem]",
          imageClassName: "block h-auto w-full object-cover",
        },
        postscripts: [
          {
            afterText:
              "If you doubt, look at the species where the male is the ornamented sex. Beauty there serves as both invitation and deterrent. It says: I have resources, I have genetics, I am not worth challenging. The same dynamic plays out in human interaction, quiet but constant.",
            paragraphs: [
              "If a man irritates you, there is a simple test. Ask to take a photo with him. Then, afterward, compliment his looks. Watch him grow uneasy-squeamish, even. His brain will short-circuit. Why is this guy, who is clearly better looking than me, complimenting me?",
              "That is the total proof. You are better looking and nicer than him. There is no angle for him to attack. No insecurity to project. No comeback that doesn't make him look small.",
              "It works the same way size works in a physical confrontation. Men see a bigger guy-broader shoulders, thicker arms, visible mass-and they instinctively recalibrate. They do not want to fight. The risk is too high. The outcome is too certain. They may grumble, posture, or quietly seethe, but they do not engage. The visual signal alone ends the negotiation before it begins.",
              "A better face operates on the same primal circuit. When a man sees someone clearly above him in facial aesthetics-sharper jaw, stronger cheekbones, lifted brow, symmetrical structure-his hindbrain sends the same message: Do not compete. You will lose. Height, for all its cultural weight, does not trigger this same automatic deference. A tall man with a forgettable face still gets challenged. A shorter man with a commanding face rarely does.",
              "Men do not want to compete with a guy who clearly outranks them in the face. They see it. They register it. And once they do, they leave you alone. Not from fear-from recognition. The hierarchy is settled. No words needed.",
              "You won. He knows it. Now move on.",
            ],
          },
        ],
        text: [
          "Looksmaxxing is not vanity. Treating your appearance as a project is one of the clearest forms of self-respect. When you stop neglecting how you present yourself, you start holding yourself to a higher standard everywhere else.",
          "Appearance changes expectations, and expectations change behavior. Attractive people are often treated as more capable, more social, and more valuable, which creates a feedback loop: better treatment, better self-perception, better conduct. Over time, presentation stops being cosmetic and becomes behavioral. What begins as appearance can harden into discipline, dignity, and self-respect.",
          "But there is another layer. Across the animal kingdom, males are often the more beautiful sex: the peacock with its iridescent blue-green train and eye-spot feathers, the mandarin duck with its ornate crest, orange sails, and purple breast, the bird of paradise with its elaborate plumes and courtship displays, the dragonfly flashing metallic blues and reds, the lion with his thick mane, the elephant seal with his sheer mass and bulbous nose, the guppy with bright color against drab females, the pheasant with metallic plumage and a long tail, the scarlet macaw with richer saturation, and the mandrill whose red-blue facial coloration and size far outshine the female. Evolution built male beauty to attract mates and to signal dominance that reduces conflict.",
          "When you become the better-looking male, something counterintuitive happens. Other men do not attack you; they give you space. Male-male harassment drops because your face signals high status before confrontation becomes necessary. You spend less time proving yourself, less money on dates that go nowhere. Women, attracted to the signal, begin to approach. The energy you once wasted chasing now flows toward you.",
          "This is not fantasy. It is biology.",
          "If you doubt, look at the species where the male is the ornamented sex. Beauty there serves as both invitation and deterrent. It says: I have resources, I have genetics, I am not worth challenging. The same dynamic plays out in human interaction, quiet but constant.",
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
          {
            label: "Andersson, M. (1994). Sexual Selection. Princeton University Press. (Foundational text on male ornamentation)",
            href: "https://press.princeton.edu/books/paperback/9780691000572/sexual-selection",
          },
          {
            label: "Zahavi, A. (1975). Mate selection-a selection for a handicap. Journal of Theoretical Biology. (Handicap principle: male beauty signals fitness despite cost)",
            href: "https://www.sciencedirect.com/science/article/abs/pii/0022519375902113",
          },
        ],
      },
      {
        label: "Looks and Leverage",
        splitIntroTextCount: 2,
        postscripts: [
          {
            afterText:
              "It's not just politics. In corporate settings, looks play a massive role in who gets promoted to power positions. The \"Chad and Stacy\" effect is real: when two candidates are equally qualified, the better-looking one is disproportionately chosen. If you want career gains, whether climbing the corporate ladder, securing investors, or positioning yourself as an authority, you cannot afford to ignore your face. With looks comes not only modeling income but also access to positions of power. You must look the part and be the part.",
            title: "The Conclusion",
            paragraphs: [
              "The evidence is clear. Your face affects your income, your status, and your trajectory. It shapes how quickly you're hired, how far you rise, and how seriously you're taken before you say a single word. From the boardroom to the ballot box, the pattern holds: the better-looking candidate wins disproportionately.",
              "So what do you do about it?",
              "Botox freezes. Fillers inflate. Bonesmashing risks permanent damage. Surgery carves bone but leaves scars-literal and financial. These are shortcuts with trade-offs.",
              "Vostok is different.",
              "It works with your biology, not against it. Every technique is natural, targeting the muscles that shape your face from within. You build the structure, refine the angles, lift the features-without needles, without knives, without risking your face for results that often look artificial.",
              "This is the fountain of youth, miniaturized. Stronger orbicularis oculi lifts the eyes, erasing tiredness. Developed zygomaticus pulls the cheeks up and out, restoring the architecture of youth. A trained platysma tightens the jawline, reversing what you thought was aging but was actually underdevelopment. You don't just look younger. You look like the best version of yourself-the one that was always waiting beneath the surface.",
              "And it's simple. Pick a chapter. Work the muscle. See the change.",
              "Vostok is not the hardest path. It's the most direct. Two years of development, one protocol, thousands of hours refining what actually works. No filler. No cope. Just facial engineering that delivers.",
              "If you want the promotion, the presence, the power-you cannot afford to ignore your face.",
              "If you want the face that commands the room-Vostok is the way.",
            ],
          },
        ],
        image: {
          desktopSrc: "/section_wallpaper/research/refined_images/02_desktop.jpg",
          mobileSrc: "/section_wallpaper/research/refined_images/02_mobile.jpg",
          alt: "Portrait study used in the looks and leverage research section",
        },
        inlineImages: [
          {
            beforeText:
              "Now consider power. Look at the men who occupy the highest offices. America has never elected an ugly president. Washington, tall and handsome (despite the teeth). Lincoln, widely admired, strikingly tall and genuinely handsome as a young man before war aged him. Truman, sharp-featured. Eisenhower, the face of command. JFK, the literal definition of a hyper-chad. Even today, research shows that facial competence and attractiveness predict election outcomes. Leadership is perceived in a glance.",
            desktopSrc: "/section_wallpaper/research/refined_images/03_desktop.jpg",
            mobileSrc: "/section_wallpaper/research/refined_images/03_mobile.jpg",
            alt: "Historical leadership collage used in the power and appearance argument",
            caption:
              "You think if these men had been ugly, they would have been elected or would have had people follow them? Of course not. They were the uber chads of their day.",
            splitLayout: true,
            splitLayoutText: [
              "Now consider power. Look at the men who occupy the highest offices. America has never elected an ugly president. Washington, tall and handsome (despite the teeth). Lincoln, widely admired, strikingly tall and genuinely handsome as a young man before war aged him. Truman, sharp-featured. Eisenhower, the face of command. JFK, the literal definition of a hyper-chad. Even today, research shows that facial competence and attractiveness predict election outcomes. Leadership is perceived in a glance.",
              "It's not just politics. In corporate settings, looks play a massive role in who gets promoted to power positions. The \"Chad and Stacy\" effect is real: when two candidates are equally qualified, the better-looking one is disproportionately chosen. If you want career gains, whether climbing the corporate ladder, securing investors, or positioning yourself as an authority, you cannot afford to ignore your face. With looks comes not only modeling income but also access to positions of power. You must look the part and be the part.",
            ],
            frameClassName:
              "w-full max-w-[24rem] overflow-hidden rounded-[1.35rem] border border-white/12 bg-white/8 shadow-[0_24px_64px_rgba(0,0,0,0.28)] md:max-w-[38rem]",
            imageClassName: "block h-auto w-full object-cover",
          },
        ],
        text: [
          "Appearance has measurable economic value. Attractive people are hired faster, evaluated more favorably, and paid more over time, even when qualifications are identical. First impressions form in milliseconds, so your face affects judgment before your resume has a chance to speak. Better looks do not replace competence, but they improve the starting position.",
          "Social status is not just ego. It changes how you move through the world. Looking better raises your position in the social hierarchy, and that elevation, handled with humility, creates confidence that compounds. Appearance shapes status judgments quickly: attractive faces are assumed more competent, more socially skilled, and more worthy of attention. That response creates a feedback loop: better treatment improves self-perception, which improves presence, which invites more positive responses.",
          "Now consider power. Look at the men who occupy the highest offices. America has never elected an ugly president. Washington, tall and handsome (despite the teeth). Lincoln, widely admired, strikingly tall and genuinely handsome as a young man before war aged him. Truman, sharp-featured. Eisenhower, the face of command. JFK, the literal definition of a hyper-chad. Even today, research shows that facial competence and attractiveness predict election outcomes. Leadership is perceived in a glance.",
          "It's not just politics. In corporate settings, looks play a massive role in who gets promoted to power positions. The \"Chad and Stacy\" effect is real: when two candidates are equally qualified, the better-looking one is disproportionately chosen. If you want career gains, whether climbing the corporate ladder, securing investors, or positioning yourself as an authority, you cannot afford to ignore your face. With looks comes not only modeling income but also access to positions of power. You must look the part and be the part.",
        ],
        sources: [
          {
            label: "Hamermesh, D. S., & Biddle, J. E. (1994). Beauty and the Labor Market. American Economic Review / NBER Working Paper 4518.",
            href: "https://www.nber.org/papers/w4518",
          },
          {
            label: "Mobius, M. M., & Rosenblat, T. S. (2006). Why Beauty Matters. American Economic Review, 96(1), 222–235.",
            href: "https://www.aeaweb.org/articles?id=10.1257/000282806776157515",
          },
          {
            label: "Ruffle, B. J., & Shtudiner, Z. (2015). Are Good-Looking People More Employable? Management Science, 61(8), 1760–1776.",
            href: "https://pubsonline.informs.org/doi/10.1287/mnsc.2014.1927",
          },
          {
            label: "Judge, T. A., Hurst, C., & Simon, L. S. (2009). Does It Pay to Be Smart, Attractive, or Confident (or All Three)? Journal of Applied Psychology, 94(3), 742–755.",
            href: "https://doi.org/10.1037/a0015497",
          },
          {
            label: "Dion, K., Berscheid, E., & Walster, E. (1972). What is beautiful is good. Journal of Personality and Social Psychology.",
            href: "https://psycnet.apa.org/record/1973-05802-001",
          },
          {
            label: "Todorov, A., et al. (2005). Inferences of Competence from Faces Predict Election Outcomes. Science, 308(5728), 1623–1626.",
            href: "https://www.science.org/doi/10.1126/science.1110589",
          },
          {
            label: "Berggren, N., Jordahl, H., & Poutvaara, P. (2010). The looks of a winner: Beauty and electoral success. Journal of Public Economics, 94(1–2), 8–15.",
            href: "https://www.sciencedirect.com/science/article/pii/S0047272709001161",
          },
        ],
      },
    ],
    [],
  );
  const [activeNarrative, setActiveNarrative] = useState(0);
  const [direction, setDirection] = useState(0);
  const currentNarrative = narrativeTabs[activeNarrative];
  const introTextCount = currentNarrative.splitIntroTextCount ?? 0;
  const introParagraphs = currentNarrative.text.slice(0, introTextCount);
  const remainingParagraphs = currentNarrative.text.slice(introTextCount);

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
          <div className="rounded-3xl border border-white/10 bg-[rgba(42,42,46,0.72)] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-10">
            <Tabs
              defaultValue={makeFourChanValue(fourChanSections[0].title)}
              onValueChange={(value) => {
                trackSafe("research_tab_change", { tab: value, variant: "4chan" });
              }}
            >
              <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0 text-white/70 md:justify-center">
                {fourChanSections.map((section) => (
                  <TabsTrigger
                    key={section.title}
                    value={makeFourChanValue(section.title)}
                    className="rounded-none border-2 border-[#b89648] bg-[rgba(32,32,36,0.82)] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-white/76 shadow-[0_10px_24px_rgba(0,0,0,0.22)] data-[state=active]:border-[#f1d27a] data-[state=active]:bg-[rgba(95,76,24,0.28)] data-[state=active]:text-white md:px-6 md:py-3.5 md:text-[13px]"
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
                  <div className="rounded-2xl border border-white/10 bg-[rgba(28,28,32,0.72)] p-5 text-sm text-white/88 md:text-base">
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
            <div className="rounded-3xl border border-white/10 bg-[rgba(42,42,46,0.72)] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-10">
              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2 md:justify-center">
                  {narrativeTabs.map((tab, index) => (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => {
                        setNarrative(index);
                        trackSafe("research_story_tab_change", { tab: tab.label });
                      }}
                      className={`max-w-full rounded-none border-2 px-5 py-3 text-center text-[12px] font-semibold uppercase leading-[1.35] tracking-[0.22em] whitespace-normal [overflow-wrap:anywhere] [hyphens:auto] shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition md:px-6 md:py-3.5 md:text-[13px] ${
                        index === activeNarrative
                          ? "border-[#f1d27a] bg-[rgba(95,76,24,0.28)] text-white"
                          : "border-[#b89648] bg-[rgba(32,32,36,0.82)] text-white/72 hover:border-[#d6b865] hover:text-white/92"
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
                      className="space-y-4 text-center text-sm text-white/88 md:text-base"
                    >
                      {currentNarrative.topTitle ? (
                        <div className="mb-4 flex w-full justify-center md:mb-5">
                          <p className="max-w-[58rem] text-center text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-[#f1d27a] md:text-[0.86rem]">
                            {currentNarrative.topTitle}
                          </p>
                        </div>
                      ) : null}
                      {currentNarrative.image ? (
                        <div className="mb-6 md:mb-8">
                          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
                            <div
                              className={
                                currentNarrative.image.frameClassName ??
                                "w-full max-w-[14rem] flex-none overflow-hidden rounded-[1.4rem] border border-white/12 bg-white/8 shadow-[0_24px_64px_rgba(0,0,0,0.28)] md:max-w-[18rem]"
                              }
                            >
                              <picture>
                                <source
                                  media="(max-width: 767px)"
                                  srcSet={currentNarrative.image.mobileSrc}
                                />
                                <source srcSet={currentNarrative.image.desktopSrc} />
                                <img
                                  src={currentNarrative.image.desktopSrc}
                                  alt={currentNarrative.image.alt}
                                  className={
                                    currentNarrative.image.imageClassName ??
                                    "block h-auto max-h-[18rem] w-full object-cover md:max-h-[24rem]"
                                  }
                                  loading="lazy"
                                />
                              </picture>
                            </div>
                            {introParagraphs.length > 0 ? (
                              <div className="flex-1 space-y-4 text-left">
                                {introParagraphs.map((paragraph) => (
                                  <div key={paragraph}>
                                    {getNarrativeMicroTitle(paragraph) ? (
                                      <div className="mb-3 flex w-full justify-center">
                                        <p className="block text-center text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-[#f1d27a] md:text-[0.86rem]">
                                          {getNarrativeMicroTitle(paragraph)}
                                        </p>
                                      </div>
                                    ) : null}
                                    <p>
                                      <span className="block">{paragraph}</span>
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                      {(currentNarrative.image ? remainingParagraphs : currentNarrative.text).map((paragraph) => (
                        <div key={paragraph}>
                          {getNarrativeMicroTitle(paragraph) &&
                          !currentNarrative.inlineImages?.some(
                            (image) =>
                              image.splitLayout &&
                              (image.beforeText === paragraph ||
                                image.splitLayoutText?.includes(paragraph)),
                          ) ? (
                            <p className="mb-3 mt-6 text-left text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-[#f1d27a] md:mt-7 md:text-[0.86rem]">
                              {getNarrativeMicroTitle(paragraph)}
                            </p>
                          ) : null}
                          {currentNarrative.inlineImages
                            ?.filter((image) => image.beforeText === paragraph)
                            .map((image) => (
                              image.splitLayout ? (
                                <div
                                  key={`${image.desktopSrc}-${paragraph}`}
                                  className="my-6 flex flex-col items-center gap-6 md:my-8 md:flex-row md:items-start md:gap-8"
                                >
                                  <div
                                    className={
                                      image.frameClassName ??
                                      "w-full max-w-[20rem] overflow-hidden rounded-[1.35rem] border border-white/12 bg-white/8 shadow-[0_24px_64px_rgba(0,0,0,0.28)] md:max-w-[31rem]"
                                    }
                                  >
                                    <picture>
                                      <source media="(max-width: 767px)" srcSet={image.mobileSrc} />
                                      <source srcSet={image.desktopSrc} />
                                      <img
                                        src={image.desktopSrc}
                                        alt={image.alt}
                                        className={image.imageClassName ?? "block h-auto w-full object-cover"}
                                        loading="lazy"
                                      />
                                    </picture>
                                    {image.caption ? (
                                      <p className="px-4 pb-4 pt-3 text-center text-[0.83rem] font-medium leading-relaxed text-white/82 md:px-6 md:pb-5 md:text-[0.95rem]">
                                        {image.caption}
                                      </p>
                                    ) : null}
                                  </div>
                                  <div className="flex-1 text-left">
                                    <div className="space-y-4">
                                      {(image.splitLayoutText ?? [paragraph]).map((text) => (
                                        <div key={text}>
                                          {getNarrativeMicroTitle(text) ? (
                                            <p className="mb-3 text-left text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-[#f1d27a] md:text-[0.86rem]">
                                              {getNarrativeMicroTitle(text)}
                                            </p>
                                          ) : null}
                                          <p>
                                            <span className="block">{text}</span>
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  key={`${image.desktopSrc}-${paragraph}`}
                                  className={
                                    image.frameClassName ??
                                    "mx-auto my-6 w-full max-w-[20rem] overflow-hidden rounded-[1.35rem] border border-white/12 bg-white/8 shadow-[0_24px_64px_rgba(0,0,0,0.28)] md:my-8 md:max-w-[31rem]"
                                  }
                                >
                                  <picture>
                                    <source media="(max-width: 767px)" srcSet={image.mobileSrc} />
                                    <source srcSet={image.desktopSrc} />
                                    <img
                                      src={image.desktopSrc}
                                      alt={image.alt}
                                      className={image.imageClassName ?? "block h-auto w-full object-cover"}
                                      loading="lazy"
                                    />
                                  </picture>
                                  {image.caption ? (
                                    <p className="px-4 pb-4 pt-3 text-center text-[0.83rem] font-medium leading-relaxed text-white/82 md:px-6 md:pb-5 md:text-[0.95rem]">
                                      {image.caption}
                                    </p>
                                  ) : null}
                                </div>
                              )
                            ))}
                          {currentNarrative.inlineImages?.some(
                            (image) =>
                              image.splitLayout &&
                              (image.beforeText === paragraph ||
                                image.splitLayoutText?.includes(paragraph)),
                          ) ? null : (
                          <p
                            className={
                              isNarrativeCallout(paragraph)
                                ? "my-8 text-[1.14rem] font-bold leading-tight text-white md:text-[1.24rem]"
                                : isAnimalBeautyHeading(paragraph)
                                  ? "mt-6 text-left text-[1rem] font-semibold leading-snug text-white md:mt-7 md:text-[1.05rem]"
                                  : isAnimalBeautyItem(paragraph)
                                    ? "mt-1 text-left leading-snug text-white/88"
                                    : undefined
                            }
                          >
                            {isNarrativeCallout(paragraph) ? (
                              <span className="block">{paragraph}</span>
                            ) : (
                              <span className="block">{paragraph}</span>
                            )}
                          </p>
                          )}
                          {currentNarrative.postscripts
                            ?.filter((postscript) => postscript.afterText === paragraph)
                            .map((postscript) => (
                              <div key={postscript.afterText} className="mt-7">
                                <div className="mx-auto h-px w-full max-w-[42rem] bg-[linear-gradient(90deg,rgba(241,210,122,0)_0%,rgba(241,210,122,0.95)_18%,rgba(241,210,122,0.95)_82%,rgba(241,210,122,0)_100%)]" />
                                <div className="mt-4 space-y-2.5 md:space-y-3">
                                  {postscript.title ? (
                                    <p className="mb-1 text-center text-[0.84rem] font-semibold uppercase tracking-[0.18em] text-[#f1d27a] md:text-[0.92rem]">
                                      {postscript.title}
                                    </p>
                                  ) : null}
                                  {postscript.paragraphs.map((postscriptParagraph) => (
                                    <p
                                      key={postscriptParagraph}
                                      className={
                                        isBoldNarrativeLine(postscriptParagraph)
                                          ? "text-[1rem] font-bold leading-tight text-white md:text-[1.08rem]"
                                          : undefined
                                      }
                                    >
                                      <span className="block">{postscriptParagraph}</span>
                                    </p>
                                  ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                      {currentNarrative.sources && currentNarrative.sources.length > 0 && (
                        <div className="pt-3 text-center">
                          <p className="text-[10px] uppercase tracking-[0.35em] text-white/60">
                            Sources
                          </p>
                          <div className="mt-3 text-xs leading-relaxed text-white/78">
                            <p className="whitespace-normal break-words">
                              {currentNarrative.sources.map((source, index) => (
                                <span key={source.href}>
                                  {index > 0 ? ", " : ""}
                                  {source.label}
                                  {" "}
                                  <a
                                    href={source.href}
                                    className="text-white underline underline-offset-4 hover:text-white/85"
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
