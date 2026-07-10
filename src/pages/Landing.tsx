import { useCallback, useEffect, useRef, useState } from "react";
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
import "./landing.css";

const BUY_URL = "https://nyxvostok.gumroad.com/l/vostokmethod?wanted=true";
const SUBSTACK_URL = "https://nyxvostok.substack.com";

const slides = [
  "/landing/slideshow/01.jpg",
  "/landing/slideshow/02.jpg",
  "/landing/slideshow/03.jpg",
  "/landing/slideshow/04.jpg",
  "/landing/slideshow/05.jpg",
  "/landing/slideshow/06.jpg",
  "/landing/slideshow/07.jpg",
  "/landing/slideshow/08.jpg",
  "/landing/slideshow/09.jpg",
];

const page = (n: number) => `/landing/pages/page-${String(n).padStart(2, "0")}.jpg`;

// Each chapter maps to real pages/renders from the book. Tags without
// material were removed rather than left as dead buttons.
const chapterFilters: { name: string; items: string[] }[] = [
  { name: "All", items: [22, 20, 1, 3, 8, 12, 15, 13, 21, 24].map(page) },
  { name: "Jawline", items: [22, 21, 13, 15].map(page) },
  { name: "Chin", items: [page(20), page(19)] },
  { name: "Lips", items: [page(18), page(19)] },
  { name: "Eyes", items: [1, 2, 3].map(page) },
  { name: "Cheeks", items: [page(4), page(17)] },
  { name: "Brow", items: [page(5), page(7)] },
  { name: "Scalp & Hair", items: [page(6), "/landing/technique/scalp-lift.jpg"] },
  { name: "Nose", items: [page(8), page(9)] },
  { name: "Tongue", items: [10, 11, 12].map(page) },
  { name: "Ears", items: [page(14), "/landing/technique/ear-pull.jpg"] },
  { name: "Neck", items: [page(23), page(24), "/landing/technique/neck-rotation.jpg"] },
  {
    name: "Gua Sha",
    items: [page(15), "/landing/technique/jaw-guasha.jpg", "/landing/technique/guasha-forehead.jpg"],
  },
  { name: "Supplements", items: [page(16)] },
  { name: "Lifestyle", items: [page(13)] },
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
    text: "Genetics are a starting point, not a final verdict.",
  },
  {
    title: "Structure follows tension",
    text: "Muscles pull bone; consistent tension remodels the structure beneath.",
  },
  {
    title: "The back anchors the front",
    text: "The neck and occiput control the jaw, the cheeks, the eyes.",
  },
  {
    title: "Refinement is a system",
    text: "Levels, hours, and measurable results — not habits and hope.",
  },
];

const results = [
  {
    title: "Sharpened jawline",
    text: "Forward projection and a defined mandible.",
    img: "/landing/technique/jaw-guasha.jpg",
  },
  {
    title: "Hoisted cheeks",
    text: "Lifted, fuller, more youthful midface.",
    img: "/landing/technique/cheek-lift.jpg",
  },
  {
    title: "Tightened skin",
    text: "Pulled back from the scalp, lifting the eyes and brow.",
    img: "/landing/technique/scalp-lift.jpg",
  },
  {
    title: "Corrected posture",
    text: "Neck realignment and an improved silhouette.",
    img: "/landing/technique/neck-rotation.jpg",
  },
  {
    title: "Reduced asymmetry",
    text: "Ninety percent of the battle. The mirror lies — the camera doesn't.",
    img: "/landing/technique/before-after.jpg",
  },
  {
    title: "Permanent, natural results",
    text: "No surgery, no filler, no risk. Built from the bone up.",
    img: "/landing/anatomy/skull-pair.jpg",
  },
];

// The reading list beside the results grid — external evidence that the
// premise (attractiveness matters, faces respond to training) holds up.
const evidenceArticles = [
  {
    title: "Do facial exercises actually work?",
    source: "Quora",
    note: "The eternal thread — skeptics and the converted, arguing it out.",
    href: "https://www.quora.com/search?q=do%20facial%20exercises%20actually%20work",
  },
  {
    title: "Why are some faces more symmetrical?",
    source: "Quora",
    note: "Genetics deals the hand; the answers argue how it's played.",
    href: "https://www.quora.com/search?q=why%20are%20some%20faces%20more%20symmetrical",
  },
  {
    title: "Koinophilia",
    source: "Wikipedia",
    note: "Why average faces read as beautiful — the mechanism.",
    href: "https://en.wikipedia.org/wiki/Koinophilia",
  },
  {
    title: "Neoteny",
    source: "Wikipedia",
    note: "Youthful features, and why keeping them wins.",
    href: "https://en.wikipedia.org/wiki/Neoteny",
  },
  {
    title: "Facial symmetry",
    source: "Wikipedia",
    note: "Symmetry as an honest signal of health and fitness.",
    href: "https://en.wikipedia.org/wiki/Facial_symmetry",
  },
  {
    title: "Halo effect",
    source: "Wikipedia",
    note: "Attractive is assumed good, smart, and trustworthy.",
    href: "https://en.wikipedia.org/wiki/Halo_effect",
  },
  {
    title: "Physical attractiveness stereotype",
    source: "Wikipedia",
    note: "What beauty is worth socially — measured, repeatedly.",
    href: "https://en.wikipedia.org/wiki/Physical_attractiveness_stereotype",
  },
];

const bookQuotes = [
  {
    quote: "The Butt-Jaw Connection: the chain that runs from your hamstrings to your jawline.",
    source: "Chapter 2.5",
  },
  {
    quote: "The mirror lies. Take an unflattering straight-on selfie — that's where the truth shows.",
    source: "On asymmetry",
  },
  {
    quote: "The five historical nose types — Greek, Roman, Nubian, Snub, Hawk — and how to work each one.",
    source: "Chapter 7.2",
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

type JourneyImage = string | { mobile: string; desktop: string };

const journeyStages: {
  title: string;
  hours: string;
  color?: string;
  img: JourneyImage;
  focus: string;
  zoom: string;
}[] = [
  {
    title: "Before",
    hours: "Hour zero",
    img: { mobile: "/landing/journey/before-mobile.webp", desktop: "/landing/journey/before-desktop.webp" },
    focus: "The starting point — untrained, unsculpted.",
    zoom:
      "Hour zero. Untrained muscles, a forward neck, asymmetry left to run for years. This is the raw material every face in the program starts from.",
  },
  {
    title: "Yellow",
    hours: "20 hours",
    color: "#d4b04a",
    img: "/landing/journey/belt-yellow.jpg",
    focus: "Build the muscles. 90% exercises, 10% massage.",
    zoom:
      "Yellow belt — the first twenty hours. Pure construction: 90% exercises, 10% massage. The muscles of the face wake up and begin pulling the structure taut.",
  },
  {
    title: "Blue",
    hours: "40 hours",
    color: "#3d5a99",
    img: "/landing/journey/belt-blue.jpg",
    focus: "Refine. 65% exercises, 30% massage, 5% refinement.",
    zoom:
      "Blue belt — forty hours in, roughly one full point gained on the scale. Exercises still lead, massage grows to 30%, and the first refinement work begins.",
  },
  {
    title: "Green",
    hours: "70 hours",
    color: "#4a7a5a",
    img: "/landing/journey/belt-green.jpg",
    focus: "Precision. 50% exercises, 40% massage, 10% refinement.",
    zoom:
      "Green belt — seventy hours. Precision work: the split moves to 50/40/10 as massage and targeted refinement take over from raw building.",
  },
  {
    title: "Black",
    hours: "100+ hours",
    color: "#1b1b1f",
    img: "/landing/journey/belt-black.jpg",
    focus: "Mastery. 20% exercises, 40% massage, 40% refinement.",
    zoom:
      "Black belt — one hundred hours and beyond. Mastery: 20% exercises, 40% massage, 40% refinement. The structure now holds itself.",
  },
  {
    title: "After",
    hours: "The other side",
    img: { mobile: "/landing/journey/after-mobile.webp", desktop: "/landing/journey/after-desktop.webp" },
    focus: "Trained, symmetrical, restructured.",
    zoom:
      "The other side of one hundred hours. Trained, symmetrical, restructured — and permanent. This is what the protocol builds.",
  },
];

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

const fatSlides = [
  { src: "/landing/anatomy/fat-map.jpg", alt: "Map of facial fat distribution, front view" },
  { src: "/landing/anatomy/fat-map-side.jpg", alt: "Map of facial fat distribution, three-quarter view" },
  { src: "/landing/anatomy/fat-map-etch.jpg", alt: "Engraved anatomical profile of the head" },
];

const articles = [
  {
    src: "/section_wallpaper/articles/1.jpeg",
    title: "The Perfect Female Face",
    text: "Rating, critiquing, and explaining the prettiest face alive.",
    href: "https://nyxvostok.substack.com/p/the-perfect-female-face",
  },
  {
    src: "/section_wallpaper/articles/2.jpeg",
    title: "Looksmaxxing Will Usher In the End Times",
    text: "On beauty, timelines, and where this is all heading.",
    href: "https://nyxvostok.substack.com/p/looksmaxxing-will-usher-in-the-end",
  },
];

const Landing = () => {
  const [entrySource, setEntrySource] = useState("direct");
  const [slideIndex, setSlideIndex] = useState(0);
  const [fatIndex, setFatIndex] = useState(0);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [bandIndex, setBandIndex] = useState(0);
  // default to "After" — lead with the destination
  const [journeyIndex, setJourneyIndex] = useState(journeyStages.length - 1);
  const [explainMuted, setExplainMuted] = useState(true);
  const explainRef = useRef<HTMLVideoElement | null>(null);
  const [videoZoom, setVideoZoom] = useState<string | null>(null);
  const [infoZoom, setInfoZoom] = useState<{ src: string; title: string; text: string } | null>(null);
  const pagesStripRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [barShown, setBarShown] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

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

  // Slideshow autoplay
  useEffect(() => {
    if (lightboxSrc || paused) return undefined;
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, [lightboxSrc, paused]);

  // Keep the active thumbnail in view — scroll ONLY the strip itself,
  // never the page (scrollIntoView can hijack the page's vertical scroll)
  useEffect(() => {
    const strip = thumbsRef.current;
    const active = strip?.children[slideIndex] as HTMLElement | undefined;
    if (!strip || !active) return;
    const left = active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2;
    strip.scrollTo({ left, behavior: "smooth" });
  }, [slideIndex]);

  // Fat-map figure slideshow
  useEffect(() => {
    const id = setInterval(() => {
      setFatIndex((i) => (i + 1) % fatSlides.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);

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
    if (!lightboxSrc && !videoZoom && !infoZoom) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxSrc(null);
        setVideoZoom(null);
        setInfoZoom(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxSrc, videoZoom, infoZoom]);

  // When the explanation video appears, try to play it with sound. Browsers
  // only allow this after a user gesture (e.g. the band arrow); if blocked,
  // fall back to muted playback and let the big audio button unmute it.
  useEffect(() => {
    if (bandIndex !== 1) {
      setExplainMuted(true);
      return;
    }
    const video = explainRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    video
      .play()
      .then(() => setExplainMuted(false))
      .catch(() => {
        video.muted = true;
        setExplainMuted(true);
        video.play().catch(() => {});
      });
  }, [bandIndex]);

  const toggleExplainAudio = () => {
    const video = explainRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    if (!nextMuted) {
      video.volume = 1;
      if (video.paused) video.play().catch(() => {});
    }
    setExplainMuted(nextMuted);
  };

  const selectChapter = (index: number) => {
    setChapterIndex(index);
    pagesStripRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  const goToSlide = useCallback((index: number) => {
    setSlideIndex(((index % slides.length) + slides.length) % slides.length);
    setPaused(true);
  }, []);

  const fireBuyTracking = (location: string) => {
    markBuyClicked();
    try {
      const ttq = (window as unknown as Record<string, unknown>).ttq as
        | { track?: (event: string, props: unknown) => void }
        | undefined;
      ttq?.track?.("InitiateCheckout", {
        contents: [{ content_id: "vostokmethod", content_type: "product", content_name: "Vostok Method" }],
        value: 30,
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

  const scrollToMethod = () => {
    document.getElementById("method")?.scrollIntoView({ behavior: "smooth" });
  };

  const journeyThumb = (i: number) => {
    const stage = journeyStages[i];
    return (
      <button
        key={stage.title}
        className={`vl-journey-thumb${i === journeyIndex ? " vl-journey-thumb--active" : ""}`}
        onClick={() => setJourneyIndex(i)}
        aria-label={`${stage.title} — ${stage.hours}`}
      >
        <span className="vl-journey-thumb-img">{journeyImg(stage.img, `${stage.title} — ${stage.hours}`)}</span>
        <span className="vl-journey-thumb-label">
          {stage.color && <span className="vl-belt-dot" style={{ background: stage.color }} />}
          {stage.title}
        </span>
      </button>
    );
  };

  return (
    <div className="vl">
      {/* Sticky buy bar */}
      <div className={`vl-bar${barShown ? " vl-bar--shown" : ""}`}>
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
          <Link className="vl-bar-link" to="/agora">
            Agora
          </Link>
          <a
            className="vl-bar-buy"
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => fireBuyTracking("sticky_bar")}
          >
            Get the Method — $30
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
          <Link className="vl-topnav-tab" to="/agora">
            Agora
          </Link>
        </nav>
        <h1 className="vl-hero-title">
          VØSTOK
          <div className="vl-hero-subtitle">The Facial Restructuring Protocol</div>
        </h1>

        <div className="vl-hero-stack">
          <p className="vl-hero-eyebrow">Documented Transformations</p>
          <div
            className="vl-carousel"
            onClick={() => setLightboxSrc(slides[slideIndex])}
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              if (touchStartX.current === null) return;
              const delta = event.changedTouches[0].clientX - touchStartX.current;
              touchStartX.current = null;
              if (Math.abs(delta) > 45) goToSlide(slideIndex + (delta < 0 ? 1 : -1));
            }}
          >
            <div className="vl-carousel-track" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
              {slides.map((slide) => (
                <div key={slide} className="vl-carousel-slide" style={{ backgroundImage: `url(${slide})` }} />
              ))}
            </div>
            <div className="vl-carousel-caption">
              <span>Before · After</span>
              <span>
                {slideIndex + 1} / {slides.length}
              </span>
            </div>
            <button
              className="vl-carousel-nav vl-carousel-nav--prev"
              aria-label="Previous transformation"
              onClick={(event) => {
                event.stopPropagation();
                goToSlide(slideIndex - 1);
              }}
            >
              ‹
            </button>
            <button
              className="vl-carousel-nav vl-carousel-nav--next"
              aria-label="Next transformation"
              onClick={(event) => {
                event.stopPropagation();
                goToSlide(slideIndex + 1);
              }}
            >
              ›
            </button>
          </div>

          <div className="vl-thumbs" ref={thumbsRef}>
            {slides.map((slide, i) => (
              <button
                key={slide}
                className={`vl-thumb${i === slideIndex ? " vl-thumb--active" : ""}`}
                style={{ backgroundImage: `url(${slide})` }}
                onClick={() => goToSlide(i)}
                aria-label={`Show transformation ${i + 1}`}
              />
            ))}
          </div>

          <div className="vl-button-row">
            <a
              className="vl-buy"
              href={BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => fireBuyTracking("hero")}
            >
              Buy Now — $30
            </a>
            <button className="vl-ghost" onClick={scrollToMethod}>
              What is the Vostok Method
            </button>
          </div>
        </div>
      </section>

      {/* Dark interlude — the origin myth */}
      <section className="vl-dark" id="origin">
        <div className="vl-dark-bg" style={{ backgroundImage: "url(/landing/art/temple.jpg)" }} aria-hidden="true" />
        <div className="vl-dark-inner">
          <p className="vl-kicker vl-reveal">The Origin</p>
          <h2 className="vl-dark-quote vl-reveal">
            We are the angels <em>mixed with apes.</em>
          </h2>
          <p className="vl-dark-text vl-reveal">
            There are many stories of men mixing with angels. The truth is — we are the angels. They gave
            us strength; we gave them beauty and intelligence. Before language could promise trust, the
            face already did. The ancient face led tribes, brokered peace, and chose kings. It was built
            by a life we no longer live.
          </p>
        </div>
      </section>

      {/* The Diagnosis */}
      <section className="vl-section" id="diagnosis">
        {/* no vl-reveal here: this element's className changes with bandIndex and a
            React re-render would wipe the observer-added vl-visible class */}
        <div className={`vl-video-band${bandIndex === 1 ? " vl-video-band--plain" : ""}`}>
          {bandIndex === 0 ? (
            <video
              key="city"
              src="/landing/video/city.mp4"
              poster="/landing/video/city-poster.jpg"
              autoPlay
              muted
              playsInline
              onEnded={() => setBandIndex(1)}
              aria-hidden="true"
            />
          ) : (
            <video
              key="explain"
              ref={explainRef}
              src={
                typeof window !== "undefined" && window.innerWidth >= 900
                  ? "/website_video_compress.mp4"
                  : "/website_video_compress_mobile.mp4"
              }
              autoPlay
              muted
              controls
              playsInline
              onEnded={() => setBandIndex(0)}
            />
          )}
          {bandIndex === 1 && (
            <button
              className={`vl-band-audio${explainMuted ? " vl-band-audio--muted" : ""}`}
              aria-label={explainMuted ? "Unmute video" : "Mute video"}
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
          )}
          {bandIndex === 0 ? (
            <p>
              The ancient caveman was a supermodel — by lifestyle and force of movement alone. So why
              can't we recreate it? <em>The answer: we can.</em>
            </p>
          ) : (
            <span className="vl-band-label">Why use the Vostok Method</span>
          )}
          {bandIndex === 0 ? (
            <button
              className="vl-band-nav vl-band-nav--next"
              aria-label="Play: Why use the Vostok Method"
              onClick={() => setBandIndex(1)}
            >
              ›
            </button>
          ) : (
            <button
              className="vl-band-nav vl-band-nav--prev"
              aria-label="Back to the first video"
              onClick={() => setBandIndex(0)}
            >
              ‹
            </button>
          )}
        </div>
        <div className="vl-reveal">
          <p className="vl-kicker">The Diagnosis</p>
          <h2 className="vl-h2">
            The modern world <em>un-sculpted</em> you.
          </h2>
        </div>
        <div className="vl-diagnosis-grid">
          <div className="vl-decay-grid">
            {decay.map((item) => (
              <div key={item.title} className="vl-decay vl-reveal">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
          <figure className="vl-fat-figure vl-reveal">
            <div className="vl-fat-slides" onClick={() => setFatIndex((i) => (i + 1) % fatSlides.length)}>
              {fatSlides.map((slide, i) => (
                <img
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  loading="lazy"
                  className={i === fatIndex ? "vl-fat-slide--active" : ""}
                />
              ))}
            </div>
            <div className="vl-fat-dots">
              {fatSlides.map((slide, i) => (
                <button
                  key={slide.src}
                  className={i === fatIndex ? "vl-fat-dot--active" : ""}
                  onClick={() => setFatIndex(i)}
                  aria-label={`Show anatomy image ${i + 1}`}
                />
              ))}
            </div>
            <figcaption>Where facial fat sits — the map Vostok resculpts.</figcaption>
          </figure>
        </div>
      </section>

      {/* The Method */}
      <section className="vl-section" id="method">
        <div className="vl-reveal">
          <p className="vl-kicker">The Method</p>
          <h2 className="vl-h2">
            Your face is <em>not</em> fate.
          </h2>
        </div>
        <div className="vl-method-grid">
          <div className="vl-reveal">
            <p className="vl-lead">
              The Vostok Method is a structured system of facial muscle training and massage designed to
              maximize your natural appearance. The face is treated as a trainable system: natural
              exercises, targeted massage, and postural correction lift, define, and refine facial
              architecture — permanently.
            </p>
            <p className="vl-not-line">
              Not skincare · Not surgery · Not bro&#8209;science — <strong>structural engineering</strong>
            </p>
          </div>
          <figure className="vl-method-figure vl-reveal">
            <img
              src="/landing/anatomy/muscle-plate.jpg"
              alt="Anatomical plate of the facial and neck muscles"
              loading="lazy"
            />
            <figcaption>The trainable system — every muscle in the book.</figcaption>
          </figure>
          <div className="vl-beliefs vl-reveal">
            {beliefs.map((belief) => (
              <div key={belief.title} className="vl-belief">
                <h3>{belief.title}</h3>
                <p>{belief.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="vl-section" id="results">
        <div className="vl-reveal">
          <p className="vl-kicker">What It Gives You</p>
          <h2 className="vl-h2">
            Trained, not <em>inherited.</em>
          </h2>
        </div>
        <div className="vl-results-layout">
          <div className="vl-results-grid">
            {results.map((result, i) => (
              <div key={result.title} className="vl-result vl-reveal">
                <div className="vl-result-img">
                  <img src={result.img} alt={result.title} loading="lazy" />
                </div>
                <span className="vl-result-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{result.title}</h3>
                <p>{result.text}</p>
              </div>
            ))}
          </div>
          <aside className="vl-evidence vl-reveal">
            <p className="vl-evidence-kicker">The Evidence</p>
            <h3>Articles that prove attractiveness matters.</h3>
            <p className="vl-evidence-sub">
              Don't take our word for it — the literature has been saying this for decades.
            </p>
            <ul>
              {evidenceArticles.map((article) => (
                <li key={article.title}>
                  <a href={article.href} target="_blank" rel="noopener noreferrer">
                    <span className="vl-evidence-source">{article.source}</span>
                    <span className="vl-evidence-title">{article.title}</span>
                    <span className="vl-evidence-note">{article.note}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* Signal Coherence — the concept behind the results */}
        <div className="vl-signal vl-reveal">
          <div className="vl-signal-lead">
            <p className="vl-kicker">Signal Coherence</p>
            <h3>
              A face is not a collection of features. It's a <em>transmission.</em>
            </h3>
          </div>
          <div className="vl-signal-body">
            <p>
              Facial aesthetics research has a name for a quiet phenomenon — <strong>structural
              legibility</strong>: a face becomes easier to read, easier to trust, easier to find
              attractive not because any single feature improved dramatically, but because the whole
              system starts broadcasting one coherent signal. Your face before wasn't a bad face. It
              was a good face not fully online. Training brings the hardware into alignment with the
              signal it was always supposed to send.
            </p>
            <p>
              Vostok's name for that moment is <strong>Signal Coherence</strong> — when a face stops
              being a collection of features and becomes a transmission. It's why people respond
              differently to you in person before they can explain why. It's why photos never fully
              capture it. It's why it feels like magic: the change isn't in any one measurable place,
              it's in the relationship between all the parts. The jaw, the neck, the eyes, the resting
              expression — trained and coordinated, the face broadcasts presence instead of just
              existing in the frame.
            </p>
            <p>
              Which is also why it's nearly impossible to fake in a photo, and nearly impossible to
              deny in person. Signal Coherence isn't a feature you can point at. It's the output of
              the whole system — and it's what the hundred hours are for.
            </p>
          </div>
        </div>
      </section>

      {/* Inside the book */}
      <section className="vl-section" id="book">
        <div className="vl-reveal">
          <p className="vl-kicker">Inside the Book</p>
          <h2 className="vl-h2">
            Open the <em>manual.</em>
          </h2>
          <p className="vl-pages-hint">Real pages from The Vostok Method — pick a chapter, tap any page to enlarge</p>
        </div>
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
                src={item}
                alt={`From The Vostok Method — ${chapterFilters[chapterIndex].name}`}
                loading="lazy"
              />
            </button>
          ))}
        </div>
        <div className="vl-book-quotes">
          {bookQuotes.map((q) => (
            <div key={q.source} className="vl-book-quote vl-reveal">
              <p>“{q.quote}”</p>
              <span>{q.source}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Dark interlude — Nyx's challenge */}
      <section className="vl-dark" id="nyx">
        <div className="vl-dark-bg" style={{ backgroundImage: "url(/landing/art/dawn.jpg)" }} aria-hidden="true" />
        <div className="vl-dark-inner vl-nyx-grid">
          <div>
            <p className="vl-kicker vl-reveal">A Challenge from Nyx</p>
            <h2 className="vl-dark-quote vl-reveal">
              Give me the first <em>twenty hours.</em>
            </h2>
            <p className="vl-dark-text vl-reveal">
              Take before-and-after photos. You're ugly. It's society's fault. But my job is to fix it —
              and fix it, I will.
            </p>
            <p className="vl-dark-sig vl-reveal">— Nyx, author of the Vostok Method</p>
            <div className="vl-button-row vl-reveal">
              <a
                className="vl-buy vl-buy--light"
                href={BUY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => fireBuyTracking("nyx")}
              >
                Accept the Challenge — $30
              </a>
            </div>
          </div>
          <figure className="vl-nyx-video vl-reveal">
            <video
              src="/landing/video/nyx-profile.mp4"
              autoPlay
              muted
              loop
              playsInline
              onClick={() => setVideoZoom("/landing/video/nyx-profile.mp4")}
            />
            <figcaption>Nyx — side profile, unedited.</figcaption>
          </figure>
        </div>
      </section>

      {/* The Journey */}
      <section className="vl-section" id="journey">
        <div className="vl-reveal">
          <p className="vl-kicker">The Journey</p>
          <h2 className="vl-h2">
            One hundred hours. <em>Measured</em> progress.
          </h2>
          <p className="vl-lead">
            Vostok counts in hours, not luck. Twenty hours in, the face wakes up; a hundred hours in,
            it's rebuilt. The belts are just mile markers along the way.
          </p>
        </div>
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
            <p>{journeyStages[journeyIndex].focus}</p>
          </div>
          <div className="vl-journey-strip">
            <button
              className="vl-journey-arrow"
              aria-label="Previous stage"
              onClick={() => setJourneyIndex((journeyIndex + journeyStages.length - 1) % journeyStages.length)}
            >
              ‹
            </button>
            <div className="vl-journey-thumbs">
              {[0, null, 5].map((slot) =>
                slot === null ? (
                  <div key="belts" className="vl-journey-belt-group">
                    {[1, 2, 3, 4].map((i) => journeyThumb(i))}
                  </div>
                ) : (
                  journeyThumb(slot)
                )
              )}
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
        <div className="vl-journey-facts">
          <div className="vl-journey-fact vl-reveal">
            <strong>40 hours ≈ one full point</strong>
            <p>Consistent work moves a 6/10 toward a 7/10. The world responds — subtly at first, then unmistakably.</p>
          </div>
          <div className="vl-journey-fact vl-reveal">
            <strong>1–2 hours a week</strong>
            <p>That's the baseline. Precision matters more than intensity — this is a long game.</p>
          </div>
          <div className="vl-journey-fact vl-reveal">
            <strong>Twice a week, one year</strong>
            <p>Then you're done — and never have to do it again.</p>
          </div>
        </div>
      </section>

      {/* Dispatches / articles */}
      <section className="vl-section" id="dispatches">
        <div className="vl-reveal">
          <p className="vl-kicker">Dispatches</p>
          <h2 className="vl-h2">
            From the <em>Vostok</em> Substack.
          </h2>
        </div>
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
      </section>

      {/* FAQ */}
      <section className="vl-section" id="faq">
        <div className="vl-faq-layout">
          <div className="vl-faq-intro vl-reveal">
            <p className="vl-kicker">The FAQ</p>
            <h2 className="vl-h2">
              Asked, <em>answered.</em>
            </h2>
            <p className="vl-lead">Thirty questions, zero diplomacy. Nyx answers everything.</p>
            <figure className="vl-faq-portrait">
              <img src="/NYX/01.jpg" alt="Nyx — author of the Vostok Method" loading="lazy" />
              <figcaption>Nyx — the one answering. Unedited.</figcaption>
            </figure>
          </div>
          <div className="vl-faq vl-reveal">
          {faqs.map((faq, i) => (
            <details key={faq.q} className="vl-faq-item">
              <summary>
                <span className="vl-faq-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="vl-faq-q">
                  {faq.q}
                  {faq.sub && <em> {faq.sub}</em>}
                </span>
                <span className="vl-faq-mark" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{faq.a}</p>
            </details>
          ))}
          </div>
        </div>
      </section>

      {/* Final CTA — dark */}
      <section className="vl-dark vl-dark--center" id="purchase">
        <div className="vl-dark-bg" style={{ backgroundImage: "url(/landing/art/angel.jpg)" }} aria-hidden="true" />
        <div className="vl-dark-inner">
          <p className="vl-kicker vl-reveal">The Vostok Method</p>
          <h2 className="vl-dark-quote vl-reveal">
            Begin your <em>restructuring.</em>
          </h2>
          <p className="vl-dark-text vl-reveal">One book. The complete protocol, from Yellow to Black.</p>
          <div className="vl-button-row vl-reveal">
            <a
              className="vl-buy vl-buy--light"
              href={BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => fireBuyTracking("footer")}
            >
              Buy Now — $30
            </a>
          </div>
          <p className="vl-price-note vl-reveal">Instant digital access</p>
        </div>
      </section>

      <footer className="vl-footer">
        <div className="vl-socials">
          <a
            href="https://www.facebook.com/nyx.vostok/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vøstok Facebook"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/vostok.guide/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vøstok Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a href="https://x.com/Nyxvostok" target="_blank" rel="noopener noreferrer" aria-label="Vøstok Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </a>
          <a href="https://discord.gg/JbPTFwJB" target="_blank" rel="noopener noreferrer" aria-label="Vøstok Discord">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.01.04.027.078.056.1a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>
          <a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer" aria-label="Vøstok Substack">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
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
          <button className="vl-lightbox-close" onClick={() => setVideoZoom(null)} aria-label="Close">
            ×
          </button>
          <video src={videoZoom} controls autoPlay playsInline onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default Landing;
