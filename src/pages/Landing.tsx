import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  trackSafe,
  trackBeacon,
  checkAndSetOwnerParam,
  isOwner,
  markBuyClicked,
  hasBuyClicked,
  CAT_KEY,
  BOUGHT_KEY,
} from "@/lib/analytics";
import { usePageMetadata } from "@/lib/pageMetadata";
import "./landing.css";

const BUY_URL = "https://nyxvostok.gumroad.com/l/vostokmethod?wanted=true";
const SUBSTACK_URL = "https://nyxvostok.substack.com";

const heroStatements = [
  "What is Vostok?",
  "It's an esoteric company",
  "Bed Bath & Beyond + Apple",
  "Our first product is a guide",
  "And a series of tips on how to improve your looks.",
  "And I mean, radically... improve your looks.",
  "We can only have so many people.",
  "Elite people.",
  "One million exactly.",
  "I want you to help you, ascend.",
  "And with a lot of work - you will.",
  "You can become an entertainer, a leader, a companion.",
  "Anything you want.",
  "Can be made and done.",
  "Because you look better than everyone.",
  "Let me give you the gift.",
  "The gift of Vostok.",
  "Ascend.",
  "With Me.",
  "NYX.",
];

type HeroStatementPhase = "enter" | "hold" | "exit" | "fade";

const HERO_STATEMENT_DURATION = 3000;
const MOBILE_BAR_INACTIVITY_DELAY = 5000;
const COMPANY_CARD_DURATION = 20000;

const page = (n: number) => `/landing/pages/page-${String(n).padStart(2, "0")}.jpg`;

const bookThumbnail = (src: string) =>
  src
    .replace("/landing/pages/", "/landing/pages/thumbs/")
    .replace("/landing/technique/", "/landing/technique/thumbs/")
    .replace(/\.jpg$/, ".webp");

// Each chapter maps to real pages/renders from the book. Tags without
// material were removed rather than left as dead buttons.
const chapterFilters: { name: string; items: string[] }[] = [
  { name: "All", items: [22, 20, 1, 3, 8, 12, 15, 13, 21, 24].map(page) },
  { name: "Jawline", items: [22, 21, 13, 15].map(page) },
  { name: "Chin", items: [page(20), page(19)] },
  { name: "Eyes", items: [1, 2, 3].map(page) },
  { name: "Scalp & Hair", items: [page(6), "/landing/technique/scalp-lift.jpg"] },
  { name: "Nose", items: [page(8), page(9)] },
  { name: "Tongue", items: [10, 11, 12].map(page) },
  { name: "Ears", items: [page(14), "/landing/technique/ear-pull.jpg"] },
  { name: "Neck", items: [page(23), page(24), "/landing/technique/neck-rotation.jpg"] },
];

const decay = [
  {
    title: "Soft food",
    text: "Our ancestors tore through bone, sinew, and roots. We chew almost nothing — the jaw and palate shrink.",
  },
  {
    title: "Screens",
    text: "Eyes bulge toward a small bright rectangle. The neck sinks forward with every glance down.",
  },
  {
    title: "No sun, no wind",
    text: "We once squinted against the sun all day — razor-sharp, deep-set eyes. Weather sculpted the face daily.",
  },
  {
    title: "Pollution & plastics",
    text: "Sunken cheeks, retained juvenile features, receding hairlines — the chemical tax on your structure.",
  },
  {
    title: "Silence",
    text: "We no longer socialize all day. Without the constant workout of expression, the face atrophies like any unused muscle.",
  },
  {
    title: "Gravity, unopposed",
    text: "Noses droop and cheeks sag because nothing pushes back anymore. Vostok pushes back.",
  },
];

const beliefs = [
  {
    title: "Your face is not fate",
    summary: "Facial muscles respond to deliberate, consistent training.",
    figure: {
      src: "/landing/proof/face-not-fate-800.webp",
      srcSet:
        "/landing/proof/face-not-fate-800.webp 800w, /landing/proof/face-not-fate-1600.webp 1600w",
      alt: "Side-by-side views showing visible facial change",
    },
    body: [
      "Genetics are a starting point, not a final verdict. Like the rest of the body, the face contains muscles that respond to consistent use. Targeted facial exercises, massage, and better resting patterns can build tone, balance movement, and change how the face is held over time.",
    ],
    tagline: "Create an Elite Face",
  },
  {
    title: "Structure follows tension",
    summary: "Balanced work helps uneven muscular patterns return to harmony.",
    figure: {
      src: "/landing/proof/structure-follows-tension-800.webp",
      srcSet:
        "/landing/proof/structure-follows-tension-800.webp 800w, /landing/proof/structure-follows-tension-1350.webp 1350w",
      alt: "Side-by-side portraits showing changes in facial structure and tension",
    },
    body: [
      "The face is a connected system of muscles, and those muscles do not always pull evenly. Habit, posture, expression, and favoring one side can create competing lines of tension that make the face rest out of alignment and appear less harmonious.",
      "Training both sides deliberately helps rebalance those patterns. As the muscles learn to work together, the face can settle into a cleaner, more symmetrical expression of its natural structure.",
    ],
    tagline: "Asymmetry is the enemy",
  },
  {
    title: "Signal Coherence",
    summary: "When expression aligns, the face broadcasts presence—and people respond.",
    figure: {
      src: "/landing/proof/signal-coherence-800.webp",
      srcSet:
        "/landing/proof/signal-coherence-800.webp 800w, /landing/proof/signal-coherence-1350.webp 1350w",
      alt: "Side-by-side portraits showing a more coherent facial expression",
    },
    body: [
      "Signal Coherence is compliance—the ability to gain compliance from people. What is the difference between someone making a fool of themselves and impressing an entire room? It is how they look.",
      "By helping more people rise in society through their looks, we can improve society itself—but that is a story for another time. The point of Vostok is to ascend the spirit. Everyone else will call it crazy, and that is fine. Leave them behind. We are here to ascend spiritually.",
    ],
    tagline: "Look aligned",
  },
  {
    title: "Refinement is a system",
    summary: "The right routine turns small changes into visible progress.",
    figure: {
      src: "/landing/proof/refinement-system-800.webp",
      srcSet:
        "/landing/proof/refinement-system-800.webp 800w, /landing/proof/refinement-system-1350.webp 1350w",
      alt: "Side-by-side portraits showing progressive facial refinement",
    },
    body: [
      "The beautiful thing about this workout routine is that you can simply trust the process. The face is a connected system of bone, cartilage, fat, nerves, fascia, skin, and small muscles.",
      "What we offer here is the full service: building the muscles, balancing patterns of tension, and refining how the face rests and moves over time.",
    ],
    tagline: "Routine creates refinement",
  },
];

// FAQ — Nyx answers in her own voice; lightly edited, never sanitized.
const faqs: { q: string; sub?: string; a: string }[] = [
  {
    q: "What even is this?",
    sub: "Is this a fitness guide or a face hack?",
    a: "Both. It's the most definitive looksmaxxing guide on the internet to date — packed with exercises and special routines, tested across races, ages, young and old, with definitive results on what works and what doesn't. Pieced together from countless Instagram shorts, reels, and research done with AI. It took a long time, and it works — it took my face from a 6.5 to a 9.5.",
  },
  {
    q: "Does this stuff actually work, bro?",
    sub: "Or is this just more TikTok cope?",
    a: "I love doubtful questions like this. It 100% works. Sometimes it'll just make your face a little puffier because the muscles are sore — but do two hours a day and you'll wake up the next morning to definitive changes. I love watching my face get better and better every day. And everyone treats me better, every single day.",
  },
  {
    q: "Fr tho, how long until I see results?",
    sub: "A week? A month? Be honest.",
    a: "It's based on the hours you put in. At four to five hours a week max, after about 80 hours I personally found my phone no longer recognized my face. It's taken me a year and a half (plus the research) to pass 100 hours, but the results have been massive — in my dating life, my success, and how I'm perceived. Try every chapter for one hour each. If you don't see improvement after that — a ten-hour commitment — then this book is not for you.",
  },
  {
    q: "What if I just don't like it?",
    sub: "Can I get my bread back?",
    a: "Nope. No refunds. My goal is to drop the hardest guide of all time, make my bread, and continue on to other work. Don't want to change your life? Don't want to take the number one asset you own — not your car, not your 401k, not your watch, but your face — and improve it? Then this is not for you.",
  },
  {
    q: "How does this voodoo even work?",
    sub: "Explain it to me like I'm 5.",
    a: "Face like body. Body build muscle. Face build muscle. Face sit correctly, face look good. Very, very good.",
  },
  {
    q: "Is this for dudes only, or can girls do it too?",
    a: "It honestly works a little better for women of age — but really, it works for anyone.",
  },
  {
    q: "Do I need to buy a bunch of weird gadgets?",
    sub: "Or can I just start?",
    a: "A face roller and a gua sha if you want, but those only appear in the ninth chapter. Just get a little face oil — coconut, almond, or grapeseed — clean your hands, grab a mirror and a timer, and you're good to go.",
  },
  {
    q: "Is this, like, medical advice?",
    sub: "Are you a doctor?",
    a: "I am NOT a doctor and this is not medical advice. If you have a condition, please go get it checked out. If you have braces or skin issues — particularly on the face — definitely consult a dermatologist or dentist before doing some of these exercises.",
  },
  {
    q: "Will this make me look weird or overdone?",
    sub: "I don't wanna look like a PS2 character.",
    a: "Not even close. It makes the face look more natural and more attractive — something surgeons can't do. Surgery can definitely improve a face, but I recommend doing this for months before any procedure, to help the face sit first.",
  },
  {
    q: "How much time do I need to commit per day?",
    sub: "I'm not trying to make this my personality.",
    a: "An hour or two a week will bring positive results.",
  },
  {
    q: "What if I skip a day?",
    sub: "Is all my progress cooked?",
    a: "I did no face routines for six months and the progress stayed with me. Hard to say definitively, but for the most part it's lifelong — just like any other muscle.",
  },
  {
    q: "Can I just do the exercises I like and skip the rest?",
    a: "Do whatever you want — it's a complete guide.",
  },
  {
    q: "My face hurts after one exercise. Did I break it?",
    a: "Of course not. Take a breather and relax. Take some rest days.",
  },
  {
    q: "What's the most important exercise I shouldn't skip?",
    a: "People's cheeks and side-jaw muscles seem to be pretty weak nowadays.",
  },
  {
    q: "Do I need to be in a gym, or can I do this in my room?",
    a: "You won't want to do this routine in public, lol — it can look quite silly.",
  },
  {
    q: "Is there a best time of day to do this?",
    sub: "Morning vs. night?",
    a: "No difference.",
  },
  {
    q: "Do I need to take “before” pics?",
    sub: "Lowkey don't wanna.",
    a: "I didn't, and I regret it — if only to show my progress. Take them.",
  },
  {
    q: "Do I need to change my diet for this to work?",
    a: "This is not a guide on diet.",
  },
  {
    q: "Can I still get cosmetic surgery after doing this?",
    a: "Always consult with your surgeon, but generally yes.",
  },
  {
    q: "What's your source for all this?",
    sub: "Did you just make it up?",
    a: "Trial and error.",
  },
  {
    q: "Why should I listen to you?",
    sub: "What's your background?",
    a: "I'm one of the most competent looksmaxxers out there — sophisticated AI models, personal experience, and the results of others, distilled into the correct methods.",
  },
  {
    q: "Is there a secret or a hack to make it work faster?",
    a: "Eat less sugar, don't drink alcohol or smoke cigarettes, brush and floss your teeth. Basically: take care of yourself. But no — there are no hacks here.",
  },
  {
    q: "What's the biggest mistake people make?",
    a: "Thinking the face doesn't change. It changes rapidly when worked.",
  },
  {
    q: "My jaw clicks when I do this. Is that a W or an L?",
    a: "Big L. Never let the jaw click. Relax it and don't overdo it — I had it happen a few times early on as well.",
  },
  {
    q: "What if I'm already decent-looking?",
    sub: "Will this still do anything?",
    a: "Absolutely. It takes your look to the next level — that's what this guide is about.",
  },
  {
    q: "Can I listen to music or watch a show while I do this?",
    a: "I do all the time. I sort of get into a trance.",
  },
  {
    q: "What's the most slept-on exercise in the whole guide?",
    a: "Anything forehead-related. A lot of women think it'll make their forehead bigger, when the opposite happens with the fat.",
  },
  {
    q: "Is this just for your face, or does it help your body too?",
    a: "This is purely a guide for the face.",
  },
  {
    q: "Will my face snap back to normal if I stop?",
    a: "The improvements will linger. If a certain part of your face ever feels overdone, just stop working that area.",
  },
  {
    q: "Okay, but is this all just massive cope?",
    sub: "Give it to me straight.",
    a: "This has been the biggest life-changing thing I've done. It's gotten me hotter women — women who were previously wayyyy out of my league. It's made me more popular and given me a social confidence that's hard to describe. Wherever I go, I'm generally the best-looking guy in the room — at least in the face — thanks to this guide alone. I can't guarantee the same results for everyone; if you're chopped, you're chopped. But this is the only thing that will help.",
  },
];

const nyxVideoRows = [
  [
    {
      src: "/videos/timelapse-web.mp4",
      caption: "Timelapse",
      thumbnail: "/videos/timelapse-poster.jpg",
    },
  ],
  [
    {
      src: "/videos/side_profile_2.mp4",
      caption: "Side Profile — 140 Hours #1",
      thumbnail: "/videos/side-profile-140-poster.jpg",
    },
    {
      src: "/videos/side_profile_1.mp4",
      caption: "Side Profile — 130 Hours #2",
      thumbnail: "/videos/side-profile-130-poster.jpg",
    },
  ],
  [
    {
      src: "/videos/le_mogge.mp4",
      caption: "Side Profile — 120 Hours #3",
      thumbnail: "/videos/03.jpg",
    },
    {
      src: "/videos/nyx-profile.mp4",
      caption: "Side Profile — 100 Hours #4",
      thumbnail: "/videos/nyx-profile.jpg",
    },
  ],
];

type JourneyImage = string | { mobile: string; desktop: string };

const journeyStages: {
  title: string;
  hours: string;
  color?: string;
  img: JourneyImage;
  zoom: string;
}[] = [
  {
    title: "Before",
    hours: "Hour zero",
    img: { mobile: "/landing/journey/before-mobile.webp", desktop: "/landing/journey/before-desktop.webp" },
    zoom:
      "Hour zero. Untrained muscles, a forward neck, asymmetry left to run for years. This is the raw material every face in the program starts from.",
  },
  {
    title: "Yellow",
    hours: "20 hours",
    color: "#d4b04a",
    img: "/landing/journey/belt-yellow.jpg",
    zoom:
      "Yellow belt — the first twenty hours. Pure construction: 90% exercises, 10% massage. The muscles of the face wake up and begin pulling the structure taut.",
  },
  {
    title: "Blue",
    hours: "40 hours",
    color: "#3d5a99",
    img: "/landing/journey/belt-blue.jpg",
    zoom:
      "Blue belt — forty hours in, roughly one full point gained on the scale. Exercises still lead, massage grows to 30%, and the first refinement work begins.",
  },
  {
    title: "Green",
    hours: "70 hours",
    color: "#4a7a5a",
    img: "/landing/journey/belt-green.jpg",
    zoom:
      "Green belt — seventy hours. Precision work: the split moves to 50/40/10 as massage and targeted refinement take over from raw building.",
  },
  {
    title: "Black",
    hours: "100+ hours",
    color: "#1b1b1f",
    img: "/landing/journey/belt-black.jpg",
    zoom:
      "Black belt — one hundred hours and beyond. Mastery: 20% exercises, 40% massage, 40% refinement. The structure now holds itself.",
  },
  {
    title: "After",
    hours: "The other side",
    img: { mobile: "/landing/journey/after-mobile.webp", desktop: "/landing/journey/after-desktop.webp" },
    zoom:
      "The other side of one hundred hours. Trained, symmetrical, restructured — and permanent. This is what the protocol builds.",
  },
  {
    title: "2 Months After",
    hours: "The result holds",
    img: "/landing/journey/two-months-after.jpg",
    zoom:
      "Two months after the final milestone. The progress remains visible and the result continues to hold.",
  },
  {
    title: "2 Months After",
    hours: "The result holds",
    img: "/landing/journey/two-months-after-02.jpg",
    zoom:
      "Two months after the final milestone. The progress remains visible and the result continues to hold.",
  },
  {
    title: "2 Months After",
    hours: "The result holds",
    img: "/landing/journey/two-months-after-03.jpg",
    zoom:
      "Two months after the final milestone. The progress remains visible and the result continues to hold.",
  },
];

const JOURNEY_AFTER_INDEX = journeyStages.findIndex((stage) => stage.title === "After");

const journeyZoomSrc = (img: JourneyImage) => (typeof img === "string" ? img : img.desktop);

const journeyImg = (img: JourneyImage, alt: string) =>
  typeof img === "string" ? (
    <img src={img} alt={alt} loading="lazy" />
  ) : (
    <picture>
      <source media="(min-width: 768px)" srcSet={img.desktop} />
      <img src={img.mobile} alt={alt} loading="lazy" />
    </picture>
  );

const articles = [
  {
    src: "/articles/youre-not-ugly-your-face-is-just-untrained.webp",
    title: "You’re Not Ugly, Your Face Is Just Untrained",
    text: "Chapter 1 — The Vostok Method",
    href: "https://nyxvostok.substack.com/p/youre-not-ugly-your-face-is-just",
  },
];

// Begin fetching heavier section media shortly before it can enter view. The
// generous margin keeps fast scrolling seamless without paying for the entire
// page on the initial connection.
const useNearViewport = <T extends Element,>(rootMargin = "1400px 0px") => {
  const ref = useRef<T | null>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || nearViewport) return undefined;
    if (!("IntersectionObserver" in window)) {
      setNearViewport(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [nearViewport, rootMargin]);

  return [ref, nearViewport] as const;
};

const Landing = () => {
  usePageMetadata({
    title: "Vostok Method — Facial Exercise & Massage Guide",
    description:
      "The Vostok Method is a structured guide to facial exercise, massage, posture, and better resting patterns. Get 11 illustrated chapters for a one-time $4.99.",
    path: "/",
  });
  const [entrySource, setEntrySource] = useState("direct");
  const [heroStatementIndex, setHeroStatementIndex] = useState(0);
  const [heroStatementPhase, setHeroStatementPhase] = useState<HeroStatementPhase>("enter");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [beliefIndex, setBeliefIndex] = useState(0);
  // Lead with "After"; later updates sit just beyond the visible thumbnail strip.
  const [journeyIndex, setJourneyIndex] = useState(JOURNEY_AFTER_INDEX);
  // FAQ: one open question at a time. The selected row exits to the right
  // before its larger answer panel is revealed, then remains consumed.
  const [faqIndex, setFaqIndex] = useState<number | null>(null);
  const [faqExitingIndex, setFaqExitingIndex] = useState<number | null>(null);
  const [consumedFaqs, setConsumedFaqs] = useState<Set<number>>(() => new Set());
  const [faqIntroDismissed, setFaqIntroDismissed] = useState(false);
  const faqTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (faqTimer.current) window.clearTimeout(faqTimer.current);
    };
  }, []);

  const selectFaq = (index: number) => {
    if (index === faqIndex) {
      setFaqIndex(null);
      return;
    }

    if (faqTimer.current) window.clearTimeout(faqTimer.current);
    setFaqExitingIndex(index);
    faqTimer.current = window.setTimeout(() => {
      setFaqIntroDismissed(true);
      setConsumedFaqs((previous) => {
        const next = new Set(previous);
        next.add(index);
        return next;
      });
      setFaqIndex(index);
      setFaqExitingIndex(null);
    }, 360);
  };
  // These denser sections start folded and open when the reader requests them.
  const [closedSections, setClosedSections] = useState<Record<string, boolean>>({
    diagnosis: true,
    method: true,
    book: true,
    journey: true,
    dispatches: true,
    faq: true,
  });
  const toggleSection = (id: string) =>
    setClosedSections((prev) => ({ ...prev, [id]: !prev[id] }));

  // Collapsed content is hidden with CSS, never unmounted: the scroll-reveal
  // observer runs once on mount, so re-mounted nodes would stay invisible.
  const collapseClass = (id: string) =>
    `vl-collapse${closedSections[id] ? " vl-collapse--closed" : ""}`;

  // Once the proof is opened, warm the responsive variants so switching
  // principles never leaves an empty frame while the next image downloads.
  useEffect(() => {
    if (closedSections.method) return;

    beliefs.forEach((belief) => {
      const image = new Image();
      image.sizes = "(max-width: 900px) calc(100vw - 48px), 700px";
      image.srcset = belief.figure.srcSet;
      image.src = belief.figure.src;
    });
  }, [closedSections.method]);

  // The arrow carries the a11y state; clicks bubble to the heading row, which
  // owns the single onClick, so the button itself doesn't toggle twice.
  const sectionArrow = (id: string) => (
    <button
      type="button"
      className={`vl-sec-toggle${closedSections[id] ? " vl-sec-toggle--closed" : ""}`}
      aria-expanded={!closedSections[id]}
      aria-label={closedSections[id] ? "Expand section" : "Collapse section"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M5 9l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  const [explainMuted, setExplainMuted] = useState(true);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const explainRef = useRef<HTMLVideoElement | null>(null);
  const [videoZoom, setVideoZoom] = useState<string | null>(null);
  const [infoZoom, setInfoZoom] = useState<{ src: string; title: string; text: string } | null>(null);
  const pagesStripRef = useRef<HTMLDivElement | null>(null);
  const journeyThumbsRef = useRef<HTMLDivElement | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [barShown, setBarShown] = useState(false);
  const [barDismissed, setBarDismissed] = useState(false);
  const [companyCard, setCompanyCard] = useState<"manifesto" | "method">("method");
  const heroRef = useRef<HTMLElement | null>(null);
  const companyCardRef = useRef<HTMLDivElement | null>(null);
  const [methodMediaRef, methodMediaNear] = useNearViewport<HTMLElement>();
  const [originMediaRef, originMediaNear] = useNearViewport<HTMLElement>();
  const [nyxMediaRef, nyxMediaNear] = useNearViewport<HTMLElement>();
  const [obeliskMediaRef, obeliskMediaNear] = useNearViewport<HTMLDivElement>();
  const [purchaseMediaRef, purchaseMediaNear] = useNearViewport<HTMLElement>();

  useEffect(() => {
    checkAndSetOwnerParam();
    const source = new URLSearchParams(window.location.search).get("utm_source")?.toLowerCase();
    const known = ["facebook", "4chan", "instagram", "tiktok", "reddit", "twitter"];
    if (source && known.includes(source)) setEntrySource(source);
  }, []);

  // Visitor category system — fires exactly one beacon per visitor (localStorage) on exit:
  // "canceled" | "bot_activity" | "did_check" | "checked_it_well" | "buy_button_check"
  useEffect(() => {
    if (isOwner()) return;
    if (localStorage.getItem(CAT_KEY)) return;

    const arrivalTime = Date.now();
    let hasScrolled = false;
    let pageFullyLoaded = document.readyState === "complete";

    const onPageLoad = () => {
      pageFullyLoaded = true;
    };
    if (!pageFullyLoaded) {
      window.addEventListener("load", onPageLoad);
    }

    const onScroll = () => {
      hasScrolled = true;
    };

    const fireCategory = () => {
      if (localStorage.getItem(CAT_KEY)) return;
      const elapsed = Date.now() - arrivalTime;
      let cat: string;

      if (!pageFullyLoaded) {
        cat = "canceled";
      } else if (hasBuyClicked() || sessionStorage.getItem(BOUGHT_KEY)) {
        cat = "buy_button_check";
      } else if (hasScrolled && elapsed >= 30000) {
        cat = "checked_it_well";
      } else if (hasScrolled) {
        cat = "did_check";
      } else {
        cat = "bot_activity";
      }

      localStorage.setItem(CAT_KEY, cat);
      trackBeacon(cat);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") fireCategory();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", fireCategory);
    window.addEventListener("beforeunload", fireCategory);

    return () => {
      window.removeEventListener("load", onPageLoad);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", fireCategory);
      window.removeEventListener("beforeunload", fireCategory);
    };
  }, []);

  // The hero manifesto enters from the right, holds for a reading-length
  // interval, and exits left. The final line fades before the loop restarts.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHeroStatementPhase("hold");
      return undefined;
    }

    const isLast = heroStatementIndex === heroStatements.length - 1;
    const enterDuration = 650;
    const exitDuration = isLast ? 900 : 650;
    let secondFrame = 0;

    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setHeroStatementPhase("hold"));
    });
    const exitTimer = window.setTimeout(
      () => setHeroStatementPhase(isLast ? "fade" : "exit"),
      enterDuration + HERO_STATEMENT_DURATION
    );
    const advanceTimer = window.setTimeout(() => {
      setHeroStatementPhase("enter");
      setHeroStatementIndex((index) => (index + 1) % heroStatements.length);
    }, enterDuration + HERO_STATEMENT_DURATION + exitDuration);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(exitTimer);
      window.clearTimeout(advanceTimer);
    };
  }, [heroStatementIndex]);

  // Sticky buy bar appears once the hero is mostly gone
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setBarShown(entry.intersectionRatio < 0.25),
      { threshold: [0, 0.25, 0.5] }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Give the visitor the full opening card, then advance once after the card
  // has remained in view for twenty seconds.
  useEffect(() => {
    const card = companyCardRef.current;
    if (!card) return undefined;

    let cardTimer = 0;
    let observer: IntersectionObserver | undefined;
    const startCardTimer = () => {
      if (cardTimer) return;
      cardTimer = window.setTimeout(() => setCompanyCard("method"), COMPANY_CARD_DURATION);
      observer?.disconnect();
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) startCardTimer();
        },
        { threshold: 0.25 }
      );
      observer.observe(card);
    } else {
      startCardTimer();
    }

    return () => {
      observer?.disconnect();
      window.clearTimeout(cardTimer);
    };
  }, []);

  // On mobile the purchase bar gets out of the reader's way after five
  // inactive seconds. Once dismissed, it stays dismissed for this page view.
  useEffect(() => {
    if (!barShown || barDismissed || !window.matchMedia("(max-width: 768px)").matches) {
      return undefined;
    }

    let inactivityTimer = 0;
    const dismissBar = () => {
      setBarDismissed(true);
      setBarShown(false);
    };
    const restartInactivityTimer = () => {
      window.clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(dismissBar, MOBILE_BAR_INACTIVITY_DELAY);
    };

    restartInactivityTimer();
    window.addEventListener("scroll", restartInactivityTimer, { passive: true });
    window.addEventListener("touchstart", restartInactivityTimer, { passive: true });
    window.addEventListener("pointerdown", restartInactivityTimer, { passive: true });
    window.addEventListener("keydown", restartInactivityTimer);

    return () => {
      window.clearTimeout(inactivityTimer);
      window.removeEventListener("scroll", restartInactivityTimer);
      window.removeEventListener("touchstart", restartInactivityTimer);
      window.removeEventListener("pointerdown", restartInactivityTimer);
      window.removeEventListener("keydown", restartInactivityTimer);
    };
  }, [barDismissed, barShown]);

  // Scroll-reveal for sections
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const nodes = document.querySelectorAll(".vl-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vl-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // Escape closes the lightboxes
  useEffect(() => {
    if (!lightboxSrc && !videoZoom && !infoZoom && !explanationOpen) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxSrc(null);
        setVideoZoom(null);
        setInfoZoom(null);
        setExplanationOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [explanationOpen, lightboxSrc, videoZoom, infoZoom]);

  // The explanation video always starts muted — the big audio button (or the
  // native controls) unmutes it on demand.
  useEffect(() => {
    const video = explainRef.current;
    if (!video || !explanationOpen) return;
    setExplainMuted(true);
    video.muted = true;
    video.play().catch(() => {});
  }, [explanationOpen]);

  const toggleExplainAudio = () => {
    const video = explainRef.current;
    if (!video) return;
    const nextMuted = !(video.muted || video.volume === 0);
    video.muted = nextMuted;
    if (!nextMuted) {
      if (video.volume === 0) video.volume = 1;
      if (video.paused) video.play().catch(() => {});
    }
    setExplainMuted(video.muted || video.volume === 0);
  };

  const selectChapter = (index: number) => {
    setChapterIndex(index);
    pagesStripRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const strip = journeyThumbsRef.current;
    if (!strip) return;

    if (journeyIndex <= JOURNEY_AFTER_INDEX) {
      strip.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    const activeThumb = strip.querySelector<HTMLElement>(`[data-journey-index="${journeyIndex}"]`);
    if (!activeThumb) return;

    const stripRect = strip.getBoundingClientRect();
    const thumbRect = activeThumb.getBoundingClientRect();
    let nextLeft = strip.scrollLeft;

    if (thumbRect.right > stripRect.right) {
      nextLeft += thumbRect.right - stripRect.right;
    } else if (thumbRect.left < stripRect.left) {
      nextLeft -= stripRect.left - thumbRect.left;
    }

    strip.scrollTo({
      left: nextLeft,
      behavior: "smooth",
    });
  }, [journeyIndex]);

  const fireBuyTracking = (location: string) => {
    markBuyClicked();
    try {
      const ttq = (window as unknown as Record<string, unknown>).ttq as
        | { track?: (event: string, props: unknown) => void }
        | undefined;
      ttq?.track?.("InitiateCheckout", {
        contents: [{ content_id: "vostokmethod", content_type: "product", content_name: "Vostok Method" }],
        value: 4.99,
        currency: "USD",
      });
    } catch {
      // ignore
    }
    try {
      fetch("/api/tiktok-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAgent: navigator.userAgent, url: window.location.href }),
      }).catch(() => {});
    } catch {
      // ignore
    }
    trackSafe("buy_click", { location, source: entrySource });
    trackSafe(`buy_click_${entrySource}`, { location });
  };

  const journeyThumb = (i: number, showLabel = true) => {
    const stage = journeyStages[i];
    return (
      <button
        key={`${stage.title}-${i}`}
        className={`vl-journey-thumb${i === journeyIndex ? " vl-journey-thumb--active" : ""}`}
        data-journey-index={i}
        onClick={() => setJourneyIndex(i)}
        aria-label={`${stage.title} — ${stage.hours}`}
      >
        <span className="vl-journey-thumb-img">{journeyImg(stage.img, `${stage.title} — ${stage.hours}`)}</span>
        {showLabel && (
          <span className="vl-journey-thumb-label">
            {stage.color && <span className="vl-belt-dot" style={{ background: stage.color }} />}
            {stage.title}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="vl">
      {/* Sticky buy bar */}
      <div className={`vl-bar${barShown && !barDismissed ? " vl-bar--shown" : ""}`}>
        <a
          className="vl-bar-mark"
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          VØSTOK
        </a>
        <div className="vl-bar-right">
          <Link className="vl-bar-link" to="/radio">
            Radio
          </Link>
          <span className="vl-bar-link vl-nav-locked" aria-disabled="true">
            Agora
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5.5" y="10.5" width="13" height="10" rx="2" />
              <path d="M8.5 10.5V7.8a3.5 3.5 0 017 0v2.7" />
            </svg>
          </span>
          <a
            className="vl-bar-buy"
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => fireBuyTracking("sticky_bar")}
          >
            Vostok Method - $4.99
          </a>
        </div>
      </div>

      {/* Hero: title + slideshow centerpiece */}
      <section className="vl-hero" id="top" ref={heroRef}>
        <div className="vl-hero-bg" aria-hidden="true" />
        <nav className="vl-topnav">
          <span className="vl-topnav-tab vl-topnav-tab--active">The Method</span>
          <Link className="vl-topnav-tab" to="/radio">
            Radio
          </Link>
          <span className="vl-topnav-tab vl-nav-locked" aria-disabled="true">
            Agora
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5.5" y="10.5" width="13" height="10" rx="2" />
              <path d="M8.5 10.5V7.8a3.5 3.5 0 017 0v2.7" />
            </svg>
          </span>
        </nav>
        <h1 className="vl-hero-title">
          <img
            className="vl-hero-logo"
            src="/logo/logo-runner.webp"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
          />
          <span className="vl-hero-wordmark">VØSTOK</span>
          <span className="vl-hero-subtitle">Raise the Spirit of Man</span>
        </h1>

        <div className="vl-hero-stack">
          <div className="vl-hero-manifesto">
            <p
              className={`vl-hero-message vl-hero-message--${heroStatementPhase}`}
              aria-hidden="true"
            >
              {heroStatements[heroStatementIndex]}
            </p>
            <p className="vl-sr-only">{heroStatements.join(" ")}</p>
          </div>
        </div>
      </section>

      {/* The Method */}
      <section className="vl-section" id="method" ref={methodMediaRef}>
        <div className="vl-reveal">
          <p className="vl-kicker">THE PROOF</p>
          <div className="vl-h2-row" onClick={() => toggleSection("method")}>
            <h2 className="vl-h2">
              You Can Change the <em>Face</em>
            </h2>
            {sectionArrow("method")}
          </div>
        </div>
        <div className={collapseClass("method")}>
        <div className="vl-method-grid">
          <div className="vl-method-copy vl-reveal" aria-live="polite">
            <div className="vl-method-copy-inner" key={beliefs[beliefIndex].title}>
              <p className="vl-method-copy-kicker">
                Principle {String(beliefIndex + 1).padStart(2, "0")}
              </p>
              <h3>{beliefs[beliefIndex].title}</h3>
              {beliefs[beliefIndex].body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="vl-method-tagline">{beliefs[beliefIndex].tagline}</p>
            </div>
          </div>
          <figure className="vl-method-figure vl-reveal">
            <img
              key={beliefIndex}
              src={methodMediaNear ? beliefs[beliefIndex].figure.src : undefined}
              srcSet={methodMediaNear ? beliefs[beliefIndex].figure.srcSet : undefined}
              sizes="(max-width: 900px) calc(100vw - 48px), 700px"
              alt={beliefs[beliefIndex].figure.alt}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div className="vl-beliefs vl-reveal">
            {beliefs.map((belief, index) => (
              <button
                type="button"
                key={belief.title}
                className={`vl-belief${index === beliefIndex ? " vl-belief--active" : ""}`}
                onClick={() => setBeliefIndex(index)}
                aria-pressed={index === beliefIndex}
              >
                <span className="vl-belief-title">{belief.title}</span>
                <span className="vl-belief-summary">{belief.summary}</span>
                <span
                  className={`vl-belief-cue${index === beliefIndex ? " vl-belief-cue--active" : ""}`}
                  aria-hidden="true"
                >
                  {index === beliefIndex ? "" : "Read"}
                </span>
              </button>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* The Diagnosis */}
      <section className="vl-section" id="diagnosis">
        <div className="vl-reveal">
          <p className="vl-kicker">The Diagnosis</p>
          <div className="vl-h2-row" onClick={() => toggleSection("diagnosis")}>
            <h2 className="vl-h2">
              Society Keeps You <em>Ugly.</em>
            </h2>
            {sectionArrow("diagnosis")}
          </div>
          {!closedSections.diagnosis && (
            <figure className="vl-explain-launcher">
              <button
                type="button"
                className="vl-explain-open"
                aria-label="Play: Why use the Vostok Method"
                onClick={() => setExplanationOpen(true)}
              >
                <img src="/screen.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                <span className="vl-explain-play" aria-hidden="true">
                  <svg viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="29" />
                    <path d="M26 20l20 12-20 12z" />
                  </svg>
                </span>
              </button>
              <figcaption>Why use the Vostok Method</figcaption>
            </figure>
          )}
        </div>
        <div className={collapseClass("diagnosis")}>
          <div className="vl-decay-grid">
            {decay.map((item) => (
              <div key={item.title} className="vl-decay vl-reveal">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Method card */}
      <section className="vl-section vl-company-section" id="company">
        <div className="vl-signal vl-signal--standalone vl-company-card vl-reveal" ref={companyCardRef}>
          <button
            type="button"
            className="vl-company-arrow vl-company-arrow--left"
            aria-label="Show previous company card"
            onClick={() => setCompanyCard((current) => current === "manifesto" ? "method" : "manifesto")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <div className="vl-signal-body" key={companyCard} aria-live="polite">
            {companyCard === "manifesto" ? (
              <>
                <p><strong>There is indeed a science to getting hot.</strong></p>
                <p><em>And I have figured it out.</em></p>
                <p>
                  Every workout feels like a mini surgery, quickly correcting imbalances and adjusting
                  the face.
                </p>
                <p>
                  <strong>Bryan Johnson&apos;s methods</strong> require enormous amounts of money and can
                  make you look like a masculine lesbian—but they do work. They are simply inefficient
                  for the average person.
                </p>
                <p>
                  <strong>Clavicular&apos;s course</strong> is all about surgery, which can leave you worse
                  off and keep you looking worse in your later years—essentially sacrificing those years
                  for trivial looksmaxxing that may make you look somewhat like a monkey and still leave
                  you getting mogged by others.
                </p>
                <p>
                  There are other, somewhat similar programs, but none actually targets the face,
                  explains how to focus on it, or is led by an experienced practitioner. <em>I practice
                  everything I preach: I test and perform the exercises myself and train each area of my
                  face individually.</em> I have been doing this for years and can speak from experience
                  about what works and what does not.
                </p>
              </>
            ) : (
              <>
                <h3>The Method</h3>
                <p>Vostok is not a collection of tips. It is a structured approach to facial optimization.</p>
                <p>It focuses on three things:</p>
                <ul>
                  <li>
                    <strong>Structure:</strong> The underlying form of the face—jaw, cheekbones,
                    alignment, and posture.
                  </li>
                  <li>
                    <strong>Function:</strong> The habits that shape that structure over time—tongue
                    position, breathing, chewing, and muscular engagement.
                  </li>
                  <li>
                    <strong>Signal:</strong> How that structure is interpreted—symmetry, tension,
                    clarity, and presence.
                  </li>
                </ul>
                <p>
                  The goal is not artificial change. <em>The goal is precision.</em>
                </p>
              </>
            )}
          </div>
          <button
            type="button"
            className="vl-company-arrow vl-company-arrow--right"
            aria-label="Show next company card"
            onClick={() => setCompanyCard((current) => current === "manifesto" ? "method" : "manifesto")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Inside the book */}
      <section className="vl-section" id="book">
        <div className="vl-reveal">
          <p className="vl-kicker">Inside the Book</p>
          <div className="vl-h2-row" onClick={() => toggleSection("book")}>
            <h2 className="vl-h2">
              Take a Free Sneak <em>Peek</em>
            </h2>
            {sectionArrow("book")}
          </div>
        </div>
        <div className={collapseClass("book")}>
        <p className="vl-pages-hint">Real pages from The Vostok Method — pick a chapter, tap any page to enlarge</p>
        <div className="vl-chapters vl-reveal">
          {chapterFilters.map((chapter, i) => (
            <button
              key={chapter.name}
              className={`vl-chapter${i === chapterIndex ? " vl-chapter--active" : ""}`}
              onClick={() => selectChapter(i)}
            >
              {chapter.name}
            </button>
          ))}
        </div>
        <div className="vl-pages-strip vl-reveal" ref={pagesStripRef}>
          {chapterFilters[chapterIndex].items.map((item, i) => (
            <button key={item} className="vl-page-card" onClick={() => setLightboxSrc(item)} aria-label={`Book page ${i + 1}`}>
              <img
                src={bookThumbnail(item)}
                alt={`From The Vostok Method — ${chapterFilters[chapterIndex].name}`}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
        </div>
      </section>

      {/* Dark interlude — the origin myth */}
      <section className="vl-dark" id="origin" ref={originMediaRef}>
        <div
          className="vl-dark-bg"
          style={{ backgroundImage: originMediaNear ? "url(/obsidian/origin-stairway.webp)" : "none" }}
          aria-hidden="true"
        />
        <div className="vl-dark-inner">
          <h2 className="vl-dark-quote vl-reveal">
            Vostok <em>Method</em>
          </h2>
          <p className="vl-dark-text vl-reveal">
            Vostok is a facial training system designed to improve the musculature of your face. It is
            about strengthening the face as we would strengthen the body at the gym, using varied
            exercises to rebuild it toward supermodel proportions.
          </p>
          <p className="vl-dark-text vl-dark-text--continued vl-reveal">
            We believe beauty should be democratized—it should be free, not reserved for an elite class
            of models.
          </p>
        </div>
      </section>

      {/* Dark interlude — Nyx's challenge */}
      <section className="vl-dark" id="nyx" ref={nyxMediaRef}>
        <div
          className="vl-dark-bg"
          style={{ backgroundImage: nyxMediaNear ? "url(/obsidian/nyx-challenge.webp)" : "none" }}
          aria-hidden="true"
        />
        <div className="vl-dark-inner vl-nyx-grid">
          <div className="vl-nyx-intro">
            <h2 className="vl-dark-quote vl-reveal">The Best Decision You&apos;ll Ever Make</h2>
            <img
              className="vl-nyx-statue vl-reveal"
              src="/statue/vostok-warrior.webp"
              alt="Black marble Vostok warrior bust illuminated with blue seams"
              loading="lazy"
            />
          </div>
          <div className="vl-nyx-video-launchers vl-reveal">
            {nyxVideoRows.map((row, rowIndex) => (
              <div className="vl-nyx-video-row" key={rowIndex}>
                {row.map((video) => (
                  <figure className="vl-nyx-video-launcher" key={video.src}>
                    <button
                      type="button"
                      className="vl-nyx-play vl-nyx-play--thumb"
                      aria-label={`Play ${video.caption}`}
                      onClick={() => setVideoZoom(video.src)}
                    >
                      <img src={video.thumbnail} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                      <svg viewBox="0 0 64 64" aria-hidden="true">
                        <circle cx="32" cy="32" r="29" />
                        <path d="M26 20l20 12-20 12z" />
                      </svg>
                    </button>
                    <figcaption>{video.caption}</figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="vl-obelisk-sections" ref={obeliskMediaRef}>
      <img
        className="vl-obelisk-art"
        src={obeliskMediaNear ? "/obsidian/obelisk-cutout-lossless.webp" : undefined}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      {/* The Journey */}
      <section className="vl-section" id="journey">
        <div className="vl-reveal">
          <p className="vl-kicker">100 HOURS+</p>
          <div className="vl-h2-row" onClick={() => toggleSection("journey")}>
            <h2 className="vl-h2">
              Watch the Change
            </h2>
            {sectionArrow("journey")}
          </div>
        </div>
        <div className={collapseClass("journey")}>
        <div className="vl-journey-slide vl-reveal">
          <button
            className="vl-journey-main"
            onClick={() =>
              setInfoZoom({
                src: journeyZoomSrc(journeyStages[journeyIndex].img),
                title: `${journeyStages[journeyIndex].title} — ${journeyStages[journeyIndex].hours}`,
                text: journeyStages[journeyIndex].zoom,
              })
            }
            aria-label={`Enlarge: ${journeyStages[journeyIndex].title}, ${journeyStages[journeyIndex].hours}`}
          >
            {journeyImg(
              journeyStages[journeyIndex].img,
              `${journeyStages[journeyIndex].title} — ${journeyStages[journeyIndex].hours}`
            )}
          </button>
          <div className="vl-journey-caption">
            <h3>
              {journeyStages[journeyIndex].color && (
                <span className="vl-belt-dot" style={{ background: journeyStages[journeyIndex].color }} />
              )}
              {journeyStages[journeyIndex].title}
            </h3>
            <span className="vl-belt-hours">{journeyStages[journeyIndex].hours}</span>
          </div>
          <div className="vl-journey-strip">
            <button
              className="vl-journey-arrow"
              aria-label="Previous stage"
              onClick={() => setJourneyIndex((journeyIndex + journeyStages.length - 1) % journeyStages.length)}
            >
              ‹
            </button>
            <div className="vl-journey-thumbs" ref={journeyThumbsRef}>
              <div className="vl-journey-thumb-track">
                <div className="vl-journey-primary">
                  {[0, null, JOURNEY_AFTER_INDEX].map((slot) =>
                    slot === null ? (
                      <div key="belts" className="vl-journey-belt-group">
                        {[1, 2, 3, 4].map((i) => journeyThumb(i))}
                      </div>
                    ) : (
                      journeyThumb(slot)
                    )
                  )}
                </div>
                <div className="vl-journey-continuation-group">
                  <div className="vl-journey-continuation">
                    {journeyStages
                      .slice(JOURNEY_AFTER_INDEX + 1)
                      .map((_, index) => journeyThumb(JOURNEY_AFTER_INDEX + 1 + index, false))}
                  </div>
                  <span className="vl-journey-group-label">2 Months After</span>
                </div>
              </div>
            </div>
            <button
              className="vl-journey-arrow"
              aria-label="Next stage"
              onClick={() => setJourneyIndex((journeyIndex + 1) % journeyStages.length)}
            >
              ›
            </button>
          </div>
        </div>
        </div>
      </section>

      {/* Dispatches / articles */}
      <section className="vl-section" id="dispatches">
        <div className="vl-reveal">
          <p className="vl-kicker">SUBSTACK</p>
          <div className="vl-h2-row" onClick={() => toggleSection("dispatches")}>
            <h2 className="vl-h2">
              Vostok <em>Consciousness</em>
            </h2>
            {sectionArrow("dispatches")}
          </div>
        </div>
        <div className={collapseClass("dispatches")}>
        <div className="vl-articles-grid">
          {articles.map((article) => (
            <a
              key={article.href}
              className="vl-article vl-reveal"
              href={article.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="vl-article-thumb">
                <img src={article.src} alt={article.title} loading="lazy" />
              </div>
              <div className="vl-article-body">
                <h3>{article.title}</h3>
                <p>{article.text}</p>
                <span>Read on Substack →</span>
              </div>
            </a>
          ))}
        </div>
        <div className="vl-reveal">
          <a className="vl-substack-link" href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer">
            Read the Substack
          </a>
        </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="vl-section" id="faq">
        <div className="vl-reveal">
          <p className="vl-kicker">The FAQ</p>
          <div className="vl-h2-row" onClick={() => toggleSection("faq")}>
            <h2 className="vl-h2">
              Q&amp;A
            </h2>
            {sectionArrow("faq")}
          </div>
        </div>
        <div className={collapseClass("faq")}>
        <div className="vl-faq-layout">
          {faqIndex === null && !faqIntroDismissed && (
            <div
              className={`vl-faq-intro vl-reveal${
                faqExitingIndex !== null ? " vl-faq-intro--exiting" : ""
              }`}
            >
              <p className="vl-lead">Thirty questions, zero diplomacy. Nyx answers everything.</p>
              <div className="vl-faq-frame">
                <figure className="vl-faq-portrait">
                  <img
                    src="/landing/qa/nyx-800.webp"
                    srcSet="/landing/qa/nyx-800.webp 800w, /landing/qa/nyx-1600.webp 1600w"
                    sizes="(max-width: 900px) calc(100vw - 48px), 620px"
                    alt="Nyx — author of the Vostok Method"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>Nyx — the one answering. Unedited.</figcaption>
                </figure>
              </div>
            </div>
          )}
          {faqIndex !== null && (
            <article className="vl-faq-answer" aria-live="polite">
              <button
                type="button"
                className="vl-faq-answer-close"
                aria-label="Close answer"
                onClick={() => setFaqIndex(null)}
              >
                ×
              </button>
              <p className="vl-faq-answer-kicker">
                № {String(faqIndex + 1).padStart(2, "0")} · Nyx answers
              </p>
              <h3 className="vl-faq-answer-question">
                {faqs[faqIndex].q}
                {faqs[faqIndex].sub && <em> {faqs[faqIndex].sub}</em>}
              </h3>
              <p className="vl-faq-answer-text">{faqs[faqIndex].a}</p>
            </article>
          )}
          <div className="vl-faq vl-reveal">
            {faqs.map((faq, i) =>
              consumedFaqs.has(i) ? null : (
                <button
                  key={faq.q}
                  className={`vl-faq-item${i === faqExitingIndex ? " vl-faq-item--exiting" : ""}`}
                  onClick={() => selectFaq(i)}
                  disabled={faqExitingIndex !== null}
                >
                  <span className="vl-faq-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="vl-faq-q">
                    {faq.q}
                    {faq.sub && <em> {faq.sub}</em>}
                  </span>
                  <span className="vl-faq-mark" aria-hidden="true">+</span>
                </button>
              )
            )}
          </div>
        </div>
        </div>
      </section>

      </div>

      {/* The Offer — what $4.99 actually buys */}
      <section className="vl-section vl-offer" id="offer">
        <div className="vl-reveal">
          <p className="vl-kicker">THE WAY TO CHANGE YOUR LIFE</p>
          <div className="vl-h2-row" onClick={() => toggleSection("offer")}>
            <h2 className="vl-h2">
              The Vostok <em>Method</em>
            </h2>
            {sectionArrow("offer")}
          </div>
        </div>
        <div className={collapseClass("offer")}>
        <div className="vl-offer-card vl-reveal">
          <div className="vl-offer-list">
            <h3>The Vostok Method — complete</h3>
            <ul>
              <li>
                <strong>11 illustrated chapters covering the full face.</strong> Jaw, chin, lips,
                eyes, cheeks, nose, tongue, ears, scalp, the back of the head, and neck.
              </li>
              <li>
                <strong>A structured progression.</strong> Follow the method area by area instead of
                piecing together disconnected tips.
              </li>
              <li>
                <strong>Exercises, massage, posture, and resting patterns.</strong> The core practices
                are organized into one system you can return to.
              </li>
              <li>
                <strong>Detailed visual instruction.</strong> Book pages and illustrations show what
                to work, where to place your hands, and how each technique is performed.
              </li>
              <li>
                <strong>One-time $4.99 digital access.</strong> No subscription—get the complete guide
                immediately and keep it.
              </li>
            </ul>
          </div>
          <aside className="vl-offer-buy">
            <span className="vl-offer-price">$4.99</span>
            <span className="vl-offer-price-note">One-time. No subscription. Instant digital access.</span>
            <a
              className="vl-buy"
              href={BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => fireBuyTracking("offer")}
            >
              Get the Method
            </a>
          </aside>
        </div>
        </div>
      </section>

      {/* Closing statement — dark */}
      <section className="vl-dark vl-dark--center" id="purchase" ref={purchaseMediaRef}>
        <div className="vl-dark-bg vl-dark-bg--video" aria-hidden="true">
          {purchaseMediaNear && (
            <video
              src="/landing/video/evolution-portal-loop.mp4"
              poster="/obsidian/evolution-portal.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          )}
        </div>
        <div className="vl-dark-inner">
          <p className="vl-kicker vl-purchase-kicker vl-reveal">The Vostok Method</p>
          <h2 className="vl-dark-quote vl-reveal">
            The Evolution of the <em>Human Spirit</em>
          </h2>
        </div>
      </section>

      <footer className="vl-footer">
        <div className="vl-socials">
          <a href="https://x.com/Nyxvostok" target="_blank" rel="noopener noreferrer" aria-label="Vøstok Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </a>
        </div>
        <p className="vl-fineprint">The Vostok Method</p>
      </footer>

      {/* Lightbox */}
      {lightboxSrc && (
        <div className="vl-lightbox" onClick={() => setLightboxSrc(null)}>
          <button className="vl-lightbox-close" onClick={() => setLightboxSrc(null)} aria-label="Close">
            ×
          </button>
          <img src={lightboxSrc} alt="Enlarged view" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Journey stage lightbox: photo + title + explanation */}
      {infoZoom && (
        <div className="vl-lightbox" onClick={() => setInfoZoom(null)}>
          <button className="vl-lightbox-close" onClick={() => setInfoZoom(null)} aria-label="Close">
            ×
          </button>
          <div className="vl-info-card" onClick={(e) => e.stopPropagation()}>
            <img src={infoZoom.src} alt={infoZoom.title} />
            <div>
              <h3>{infoZoom.title}</h3>
              <p>{infoZoom.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Video zoom lightbox */}
      {videoZoom && (
        <div className="vl-lightbox" onClick={() => setVideoZoom(null)}>
          <div className="vl-video-frame" onClick={(event) => event.stopPropagation()}>
            <button className="vl-lightbox-close" onClick={() => setVideoZoom(null)} aria-label="Close">
              ×
            </button>
            <video src={videoZoom} controls autoPlay playsInline />
          </div>
        </div>
      )}

      {/* Explanation video lightbox */}
      {explanationOpen && (
        <div
          className="vl-lightbox vl-explain-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Why use the Vostok Method"
          onClick={() => setExplanationOpen(false)}
        >
          <div className="vl-explain-modal vl-video-frame" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="vl-lightbox-close"
              onClick={() => setExplanationOpen(false)}
              aria-label="Close video"
            >
              ×
            </button>
            <video
              ref={explainRef}
              controls
              autoPlay
              muted={explainMuted}
              playsInline
              preload="metadata"
              onVolumeChange={(event) =>
                setExplainMuted(event.currentTarget.muted || event.currentTarget.volume === 0)
              }
            >
              <source media="(max-width: 899px)" src="/website_video_compress_mobile.mp4" type="video/mp4" />
              <source src="/website_video_compress.mp4" type="video/mp4" />
            </video>
            <button
              type="button"
              className={`vl-explain-audio${explainMuted ? " vl-explain-audio--muted" : ""}`}
              aria-label={explainMuted ? "Turn video sound on" : "Mute video"}
              title={explainMuted ? "Audio off — turn sound on" : "Audio on — mute sound"}
              aria-pressed={!explainMuted}
              onClick={toggleExplainAudio}
            >
              {explainMuted ? (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 9v6h4l5 5V4L7 9H3z" />
                  <path d="M16.6 8.2l-1.4 1.4 2.4 2.4-2.4 2.4 1.4 1.4 2.4-2.4 2.4 2.4 1.4-1.4-2.4-2.4 2.4-2.4-1.4-1.4-2.4 2.4-2.4-2.4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 9v6h4l5 5V4L7 9H3z" />
                  <path d="M16.5 12a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12z" />
                  <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
