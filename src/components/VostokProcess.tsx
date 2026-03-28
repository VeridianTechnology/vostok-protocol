import { m } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { getImageVariants, toDesktopImage, toMobileImage } from "@/lib/utils";
import { track } from "@vercel/analytics";
import SectionSideTab from "@/components/SectionSideTab";

type StageKey = "20" | "70" | "100" | "non_ai";

type VostokProcessProps = {
  onLoaded?: () => void;
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "reddit" | "twitter" | "direct";
};

const getThumbVariants = (src: string) => {
  if (!src.endsWith(".jpg") && !src.endsWith(".jpeg")) {
    return null;
  }
  const match = src.match(/(\.jpe?g)$/i);
  if (!match) {
    return null;
  }
  const ext = match[1];
  const base = src.slice(0, -ext.length);
  return {
    mobile: {
      jpg: `${base}_thumb_mobile${ext}`,
      avif: `${base}_thumb_mobile.avif`,
      webp: `${base}_thumb_mobile.webp`,
    },
    desktop: {
      jpg: `${base}_thumb_desktop${ext}`,
      avif: `${base}_thumb_desktop.avif`,
      webp: `${base}_thumb_desktop.webp`,
    },
  };
};

const VostokProcess = ({ onLoaded, entrySource = "direct" }: VostokProcessProps) => {
  const isFourChan = entrySource === "4chan";
  const isTwitter = entrySource === "twitter";
  const afterVideoSrc = "/Comparison/main1.mp4";
  const stages = useMemo(
    () => [
      {
        key: "20",
        title: "2 MONTHS",
        icons: ["/Comparison/5z.jpg", "/Comparison/6z.jpg"],
        text: (
          <>
            <p>Levator Labii Superioris, Levator Anguli Oris improvement by about 20%.</p>
            <p className="mt-4">Massive frontalis and nasalis improvement, massive.</p>
            <p className="mt-4">Superior and Inferior Oblique improvement.</p>
            <p className="mt-4">
              But a complete lack of Orbicularis Oris and Masseter improvement. Jaw line is
              insufficient.
            </p>
          </>
        ),
      },
      {
        key: "70",
        title: "8 MONTHS",
        icons: ["/Comparison/8z.jpg", "/Comparison/7z.jpg"],
        text: (
          <>
            <p>Zygomatic bone lift, Zygomaticus Minor and Major improvement, by about 40%.</p>
            <p className="mt-4">
              Crazy Orbicularis Oculi and under tissue improvement, like 60% better.
            </p>
            <p className="mt-4">
              Solid Mentalis, Depressor Anguli Oris and Depressor Labii Inferioris improvement.
            </p>
            <p className="mt-4">
              Nose is still crooked, and lazy eye still visible. Medial Rectus musculature
              improvement is needed.
            </p>
          </>
        ),
      },
      {
        key: "100",
        title: "YEAR AND A HALF",
        icons: [
          "/Comparison/1z.jpg",
          "/Comparison/2z.jpg",
        ],
        text: (
          <>
            <p>Massive nose tip and Depressor Septi Nasi improvement.</p>
            <p className="mt-4">
              Temporalis, Auricular Muscles - particularly Superior improvement. Ears look great.
            </p>
            <p className="mt-4">
              Rockstar Buccinator, Risorius, Mentalis and Lateral Pterygoid improvement, 70%
              better.
            </p>
            <p className="mt-4">
              Corrugator Supercilii needs refinement, not musculature, frontalis needs smoothness
              and overt Orbicularis Oculi lacks.
            </p>
          </>
        ),
      },
      {
        key: "non_ai",
        title: "NON-AI PHOTOS",
        icons: [
          "/before/after/before.jpg",
          "/Comparison/1.JPG",
        ],
        text: (
          <>
            <p>
              Flat zygomaticus. Weak orbicularis oculi. Lazy eye visible. Nose crooked. Mentalis
              undeveloped. Depressor anguli oris pulling the corners down. A face that signals
              tired, asymmetrical, unrefined.
            </p>
          </>
        ),
      },
    ],
    []
  );
  const gumroadUrl = "https://vostok67.gumroad.com/l/vostokmethod?wanted=true";
  const [activeStage, setActiveStage] = useState<StageKey>("20");
  const [activeImage, setActiveImage] = useState("/Comparison/5z.jpg");
  const [parallaxShift, setParallaxShift] = useState(0);
  const [gridShift, setGridShift] = useState({ x: 0, y: 0 });
  const [scanKey, setScanKey] = useState(0);
  const [focusPulse, setFocusPulse] = useState(false);
  const [pendingIcon, setPendingIcon] = useState<string | null>(null);
  const [isAfterVideoPaused, setIsAfterVideoPaused] = useState(false);
  const [afterVideoDuration, setAfterVideoDuration] = useState(0);
  const [afterVideoCurrentTime, setAfterVideoCurrentTime] = useState(0);
  const parallaxRef = useRef<number | null>(null);
  const imageFrameRef = useRef<HTMLDivElement | null>(null);
  const afterVideoRef = useRef<HTMLVideoElement | null>(null);
  const currentStage = stages.find((stage) => stage.key === activeStage) ?? stages[0];
  const activeVariants =
    activeStage === "non_ai" ? null : getImageVariants(activeImage);
  const isNonAiAfter = activeStage === "non_ai" && activeImage === "/Comparison/1.JPG";
  const handleGridShift = () => {
    const nextX = Math.round((Math.random() - 0.5) * 120);
    const nextY = Math.round((Math.random() - 0.5) * 120);
    setGridShift({ x: nextX, y: nextY });
  };
  const selectStage = (stageKey: StageKey, image: string) => {
    setPendingIcon(`${stageKey}:${image}`);
    setActiveStage(stageKey);
    setActiveImage(image);
  };

  useEffect(() => {
    setScanKey((current) => current + 1);
    setFocusPulse(true);
    const timeout = window.setTimeout(() => setFocusPulse(false), 900);
    return () => window.clearTimeout(timeout);
  }, [activeStage, activeImage]);

  useEffect(() => {
    if (!isNonAiAfter) {
      setIsAfterVideoPaused(false);
      setAfterVideoCurrentTime(0);
      setAfterVideoDuration(0);
      const video = afterVideoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      return;
    }

    setIsAfterVideoPaused(false);
    setAfterVideoCurrentTime(0);
    const video = afterVideoRef.current;
    if (video) {
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    }
  }, [isNonAiAfter]);

  useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  const toggleAfterVideoPlayback = () => {
    const video = afterVideoRef.current;
    if (!video) {
      return;
    }

    if (video.paused || video.ended) {
      if (video.ended) {
        video.currentTime = 0;
        setAfterVideoCurrentTime(0);
      }
      setIsAfterVideoPaused(false);
      void video.play().catch(() => undefined);
      return;
    }

    video.pause();
    setIsAfterVideoPaused(true);
  };

  const handleAfterVideoSeek = (value: number) => {
    const video = afterVideoRef.current;
    if (!video) {
      return;
    }

    video.currentTime = value;
    setAfterVideoCurrentTime(value);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        return;
      }
      parallaxRef.current = window.requestAnimationFrame(() => {
        parallaxRef.current = null;
        const offset = window.scrollY * 0.08;
        setParallaxShift(Math.min(offset, 40));
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (parallaxRef.current) {
        window.cancelAnimationFrame(parallaxRef.current);
        parallaxRef.current = null;
      }
    };
  }, []);

  const renderStageText = () => (
    <>
      {currentStage.key === "non_ai" ? (
        isNonAiAfter ? (
          <>
            <p>
              Improvement across Mentalis, Orbicularis Oculi, Depressor Anguli Oris and Depressor
              Labii Inferioris.
            </p>
            <p className="mt-4">
              Levator Labii Superioris Alaeque Nasi looks sharp! Levator Anguli Oris as well.
            </p>
            <p className="mt-4">
              Frontalis needs more smoothness and angularity, lips need more plumpness.
            </p>
          </>
        ) : (
          currentStage.text
        )
      ) : isTwitter && currentStage.key === "before" ? (
        <>
          <p>
            I was the guy in the background. Not ugly. Just... forgettable. Women looked through
            me. Men ignored me. Life was flat.
          </p>
        </>
      ) : isTwitter && currentStage.key === "20" ? (
        <>
          <p>
            The first double-take. A stranger holding eye contact too long. The cashier flustered.
            I thought it was coincidence.
          </p>
        </>
      ) : isTwitter && currentStage.key === "45" ? (
        <>
          <p>Here&apos;s what actually changed:</p>
          <p className="mt-4">
            Investment opportunities appeared. People assumed I knew things. Assumed I had money.
            Wanted to be near me, work with me, give me things.
          </p>
          <p className="mt-4">
            My own family started treating me better. My mother, my father, cousins - people
            who&apos;ve known me my whole life - suddenly deferred. Asked my opinion. Introduced me
            like I was someone to be proud of.
          </p>
          <p className="mt-4">
            Friends who used to talk over me started listening. Friends who used to dismiss me
            started asking what I thought.
          </p>
          <p className="mt-4">
            I didn&apos;t get smarter. I didn&apos;t get more experienced. I didn&apos;t get more
            successful.
          </p>
          <p className="mt-4">I just got hotter.</p>
          <p className="mt-4">That&apos;s it. That&apos;s the whole secret.</p>
        </>
      ) : isTwitter && currentStage.key === "70" ? (
        <>
          <p>The tech-bro in you is already running the numbers.</p>
          <p className="mt-4">
            You modify your timeline because information determines your reality. You modify your
            tech because tools determine your capability. You modify your body because hardware
            determines your longevity.
          </p>
          <p className="mt-4">
            Why would the one thing people judge in the first 0.3 seconds of meeting you be the
            one thing you leave to chance?
          </p>
          <p className="mt-4">It doesn&apos;t scale. It doesn&apos;t optimize. It doesn&apos;t ROI.</p>
          <p className="mt-4">
            Unless you treat it like everything else you&apos;ve ever improved.
          </p>
        </>
      ) : isFourChan && currentStage.key === "before" ? (
        <>
          <p>I used to be obsessed with politics.</p>
          <p className="mt-4">
            I consumed it like air. The podcasts, the pundits, the endless Twitter arguments about
            systems and structures and justice. I believed that being right mattered. I believed
            that if I aligned my beliefs correctly, the universe would align itself to me.
          </p>
          <p className="mt-4">It took me years to understand the joke.</p>
          <p className="mt-4">
            Politics is a game for men who cannot get laid. It is a coping mechanism for the
            overlooked, the invisible, the ones who need to believe that their lack of romantic
            success is the fault of "society" rather than the fault of their own reflection.
          </p>
          <p className="mt-4">I say this not as an insult, but as a confession. I was one of them.</p>
          <p className="mt-4">
            Then something shifted. I started putting in the work. The dull, boring, repetitive
            work of reshaping my face. And as the mirror began to return a different image, the
            world began to return a different response.
          </p>
          <p className="mt-4">
            The first hot girl was an accident. The second was a pattern. By the time I reached
            the fifth-the kind of woman who, a year earlier, would not have registered my
            existence-I understood the truth.
          </p>
          <p className="mt-4">Politics is what men discuss. Beauty is what men possess.</p>
          <p className="mt-4">And possession changes everything.</p>
        </>
      ) : isFourChan && currentStage.key === "20" ? (
        <>
          <p>Then I got super egoic.</p>
          <p className="mt-4">
            You would have laughed to see it. The same man who months earlier could not buy
            attention was now turning women down. Not cruelly-at first-but with a quiet, internal
            gatekeeping I had never known. She is a 6. Pass. She is a 7 but the personality is
            off. Pass. She is beautiful but she looked at me wrong. Pass.
          </p>
          <p className="mt-4">I had become the selector. And I loved it.</p>
          <p className="mt-4">But the universe, as it does, had a lesson waiting.</p>
          <p className="mt-4">
            I met her at a cafe. Dark hair. Green eyes. The kind of face that stops conversations
            mid-sentence. A legitimate 9. Out of my league by every metric I had ever known-except
            my metrics had changed. I approached. She responded. We talked for hours.
          </p>
          <p className="mt-4">And I fell.</p>
          <p className="mt-4">
            Not like an adult. Like a teenager. Like a boy who had never been loved before, which,
            in a way, I hadn't. I texted first. I overthought every pause. I bought her things. I
            waited. I hoped. I became exactly what I had despised: a simp for a woman who knew
            exactly what she was worth and exactly how much I was willing to give.
          </p>
          <p className="mt-4">
            She ended it after six weeks. Broke my heart in a way that surprised me with its
            weight. I sat in my apartment afterward, staring at the wall, and I laughed at the
            absurdity of it.
          </p>
          <p className="mt-4">
            I had never had a chance before-and now that I did, I had squandered it on the first
            beautiful face that looked back.
          </p>
          <p className="mt-4">Dramatic, right? Man.</p>
          <p className="mt-4">
            But here is the thing about falling: you either stay down, or you get up and keep
            moving. I got up. I kept progressing. I kept sharpening. Not for her. Not for revenge.
            Just because the work itself had become the only thing that made sense.
          </p>
          <p className="mt-4">And eventually, the hot girls kept coming. But this time, I was ready.</p>
        </>
      ) : isFourChan && currentStage.key === "45" ? (
        <>
          <p>This stage hit hard.</p>
          <p className="mt-4">
            I started walking around like I was the most attractive guy in whatever room I
            entered. And honestly--
          </p>
          <p className="mt-4">I wasn't wrong.</p>
          <p className="mt-4">
            Cashiers acted differently. Girls responded instantly. Even my own mother couldn't
            understand the sudden spike in female attention.
          </p>
          <p className="mt-4">
            It was overwhelming at times, but I felt like I'd unlocked a cheat code.
          </p>
          <p className="mt-4">Then the crypto market fell.</p>
          <p className="mt-4">
            Not that it mattered much--I was broke anyway. The bull had been good while it lasted,
            but when it turned, I had nothing left to lose. No money. No portfolio. No safety net.
            Just a face in the mirror and the creeping suspicion that this--this weird obsession
            with bone and muscle and symmetry--was the only thing I still controlled.
          </p>
          <p className="mt-4">So I kept working.</p>
          <p className="mt-4">Relentlessly.</p>
          <p className="mt-4">
            Every morning, the exercises. Every night, the analysis. I tore through anatomy
            textbooks like they were thrillers. I built custom AI models to track millimeter-level
            changes in my jawline over weeks. I studied the insertion points of the masseter, the
            behavior of the zygomaticus, the way the platysma could be trained to pull the entire
            lower face upward like a suspension bridge.
          </p>
          <p className="mt-4">
            I avoided bonesmashing. Avoided the retarded looksmaxxing experiments that end in
            asymmetry and regret. I kept it professional. Clinical. I treated my face like a
            research project, and I was both the scientist and the specimen.
          </p>
          <p className="mt-4">The results did not come fast. But they came.</p>
          <p className="mt-4">Then came the grocery store.</p>
          <p className="mt-4">
            I was with my mother--helping her shop, as a NEET does when the market crashes and
            time is the only currency left. She pushed the cart. I walked beside her. And
            everywhere we went, the looks followed.
          </p>
          <p className="mt-4">
            The girl in produce. The cashier at register three. The mother with her toddler who
            glanced once, then twice, then again. My mother noticed. Of course she noticed. She is
            a mother. She sees everything.
          </p>
          <p className="mt-4">Halfway through the frozen aisle, she stopped walking.</p>
          <p className="mt-4">"Does this happen everywhere?" she asked.</p>
          <p className="mt-4">I shrugged. Tried to play it cool.</p>
          <p className="mt-4">
            She shook her head, embarrassed, almost flustered. "This is insane. I can't shop with
            you anymore."
          </p>
          <p className="mt-4">
            But here is the thing about NEETs--you know how we are. No job. No money. No
            direction. Living in the basement or the spare bedroom, surviving on ramen and
            whatever our mothers bring home. We are supposed to be invisible. We are supposed to be
            ashamed.
          </p>
          <p className="mt-4">I was neither.</p>
          <p className="mt-4">
            I walked through that grocery store like I owned it. Like every glance was owed to me.
            Like every double-take was confirmation of something I had suspected but never proved.
          </p>
          <p className="mt-4">And I loved every second of it.</p>
        </>
      ) : isFourChan && currentStage.key === "70" ? (
        <>
          <p>By now I thought I was untouchable.</p>
          <p className="mt-4">
            Results were obvious, not subtle. Strangers double-took. Women initiated more.
          </p>
          <p className="mt-4">
            I started questioning everything:
            <br />
            <strong>
              Is this really all looks? Did I just uncover something no one&apos;s been talking
              about?
            </strong>
          </p>
          <p className="mt-4">The answer was becoming clearer: yes.</p>
          <p className="mt-4">I knew I would get a bad bitch. I knew I would have success.</p>
          <p className="mt-4">
            Not in a wishful way-in a factual way. The same way you know the sun will rise. It was
            not confidence anymore. It was certainty. The data was in. The experiment had
            concluded. And the results were undeniable:
          </p>
          <p className="mt-4">People REALLY started treating me different.</p>
          <p className="mt-4">And honestly? It was FUCKING annoying.</p>
          <p className="mt-4">
            You try ordering a coffee and having the cashier forget your order halfway through
            because she cannot stop staring at your face. You try standing in line at the grocery
            store while the woman in front of you turns around three times like she forgot
            something but really just wants another look. You try walking through a mall and
            feeling every pair of eyes track you like you are a fucking exhibit.
          </p>
          <p className="mt-4">YES, I GET IT. YOU&apos;VE NEVER SEEN A 10/10. MOVE ON.</p>
          <p className="mt-4">
            But they don&apos;t move on. They gawk. They fluster. They forget basic human functions
            because their lizard brain short-circuits at the sight of symmetry and proportion. And
            you are left standing there, waiting for your change, wondering if this is what models
            feel like every day and if they are all secretly exhausted by it.
          </p>
          <p className="mt-4">BUT I KEPT WORKING.</p>
          <p className="mt-4">
            Because here is the thing about obsession: it does not stop when you arrive. It only
            deepens.
          </p>
          <p className="mt-4">Then came the strange part.</p>
          <p className="mt-4">
            I am not a big guy. Never was. Shoulders, sure, but height? Average at best. By every
            physical metric, I should be the guy that rude muscular men push around in clubs. The
            one they cut in front of. The one they use as an armrest.
          </p>
          <p className="mt-4">But they didn&apos;t.</p>
          <p className="mt-4">
            They looked at me. They sized me up. And something in their eyes shifted. Not
            fear-recognition. Like I was one of them. Like my face had signaled something so
            primal, so dominant, that their bodies responded before their brains could intervene.
          </p>
          <p className="mt-4">THEY RESPECTED ME.</p>
          <p className="mt-4">
            Not because I was strong. Not because I was loud. Not because I had money or status or
            anything a man is supposed to have.
          </p>
          <p className="mt-4">
            I brought value TO EVERY interaction just by standing around like a dweeb.
          </p>
          <p className="mt-4">
            Just existing. Just breathing. Just occupying space with a face that had been refined
            and sharpened and sculpted into something the human brain cannot ignore.
          </p>
          <p className="mt-4">
            And that, more than the women, more than the attention, more than the grocery store
            gawking--that was when I knew I had won.
          </p>
        </>
      ) : isFourChan && currentStage.key === "100" ? (
        <>
          <p>Then I moved to Thailand and finished the full protocol.</p>
          <p className="mt-4">This is where everything exploded.</p>
          <p className="mt-4">
            While writing this out right now, a woman sat herself at my table-uninvited-and started
            flirting nonstop.
          </p>
          <p className="mt-4">Meanwhile, my girlfriend, a literal model, was asleep back home.</p>
          <p className="mt-4">That's when it hit me:</p>
          <p className="mt-4">
            Tall guys, muscular guys, rich guys-doesn't matter.
            <br />
            <strong>If your face wins the sexual signal game, you win.</strong>
          </p>
          <p className="mt-4">
            Life is cleaner, lighter, easier... and I haven't even maxed out the method yet.
          </p>
          <p className="mt-4">As I write this, I have a 10/10 in my bed right now.</p>
          <p className="mt-4">
            Literal 10/10. Six foot two. Twenty-three, maybe twenty-four, I don't know and I don't
            care. She is a fucking model. She could have anyone on the planet.
          </p>
          <p className="mt-4">I am five foot seven.</p>
          <p className="mt-4">
            I am broke. I am a NEET. I have no career, no savings, no direction. I eat like shit
            and I barely work out anymore. By every conventional metric, I should be invisible to
            her.
          </p>
          <p className="mt-4">
            But she is in my bed. Asleep. Naked. Wrapped around me like I am something precious.
          </p>
          <p className="mt-4">Why?</p>
          <p className="mt-4">
            Not because of my money-I mean, she is obviously with me for money except I don't have
            any, so no. Not because of my height-she towers over me in heels. Not because of my
            personality, because I am literally writing this sales page while she sleeps next to
            me, ignoring her.
          </p>
          <p className="mt-4">She is with me because I MOG her.</p>
          <p className="mt-4">I mog everyone.</p>
          <p className="mt-4">
            I walk into a room and the geometry shifts. Not because I am loud or charismatic or
            successful. Because my face fires neurons in people's brains that they cannot control.
            It is not fair. It is not moral. It is just biology.
          </p>
          <p className="mt-4">And I am obsessed with it.</p>
          <p className="mt-4">Here is what happens when you fix your face:</p>
          <p className="mt-4">
            Investment opportunities appear. Not because you got smarter, but because people take
            you more seriously when you look like you matter. They assume you know things. They
            assume you have money. They want to be near you, work with you, give you things.
          </p>
          <p className="mt-4">
            Your own family starts treating you better. Your mother, your father, your
            cousins-people who have known you your whole life-suddenly defer to you. They ask your
            opinion. They respect your space. They introduce you to their friends like you are
            someone to be proud of.
          </p>
          <p className="mt-4">
            Your friends take you seriously. The ones who used to talk over you now listen. The
            ones who used to dismiss you now ask what you think. You bring value to every
            interaction just by standing there like a dweeb, because your face has already done the
            work for you.
          </p>
          <p className="mt-4">
            I did not get any wiser. I did not get smarter. I did not get more experienced or more
            confident or more successful.
          </p>
          <p className="mt-4">I just got hotter.</p>
          <p className="mt-4">That's it. That's the whole secret.</p>
          <p className="mt-4">
            I am literally not that confident. I am literally not that successful. I am just
            another broke NEET who figured out how to manipulate bone and muscle and symmetry until
            the world had no choice but to treat me differently.
          </p>
          <p className="mt-4">And now I get respect everywhere I go.</p>
          <p className="mt-4">
            I totally get the movies now. The jaded hot guy living alone, staring out the window,
            tired of the attention. I understand him. I am close to becoming him. Maybe that is
            the full cycle: NEET to hot guy back to hot NEET. Isolation with better cheekbones.
          </p>
          <p className="mt-4">So here is my advice to you:</p>
          <p className="mt-4">
            Stop working out. Muscle is cope. Women do not care about your biceps when a
            well-proportioned face walks into the room. Save your tendy money and blow it on
            something real. Blow it on this.
          </p>
          <p className="mt-4">
            THIS and workout hard-for your health, for your frame-but follow every step. Every
            exercise. Every angle. Every millimeter of progress. Be disciplined. Be relentless. Be
            obsessed.
          </p>
          <p className="mt-4">And thank me later.</p>
          <p className="mt-4">You won't believe the results, NEET loser.</p>
          <p className="mt-4">Neither did I.</p>
          <m.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              track("buy_button", { location: "vostok_process" });
              track("buy_button_4chan", { location: "vostok_process" });
              if (entrySource === "twitter") {
                track("buy_button_twitter", { location: "vostok_process" });
              }
              window.open(gumroadUrl, "_blank", "noopener,noreferrer");
            }}
            className="mt-4 inline-flex items-center justify-center rounded-sm border border-white/20 bg-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.3em] text-white transition hover:text-white"
          >
            Buy Now
          </m.button>
        </>
      ) : (
        currentStage.text
      )}
    </>
  );

  return (
    <section
      id="vostok-process"
      className="section-surface relative isolate left-1/2 right-1/2 w-screen -translate-x-1/2 px-6 -mt-8 pt-[7vh] pb-8 md:mt-0 md:py-14 overflow-hidden"
      onClick={handleGridShift}
    >
      <SectionSideTab label="MY PROCESS" />
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="section-surface-fill absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-black/15" />
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-white/35 blur-[90px]" />
        <div className="absolute -right-24 bottom-6 h-80 w-80 rounded-full bg-black/15 blur-[110px]" />
        <m.div
          className="absolute inset-0"
          animate={{ y: -10 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-35 transition-transform duration-700"
            style={{
              transform: `translate3d(calc(-50% + ${gridShift.x + parallaxShift}px), calc(-50% + ${gridShift.y - parallaxShift}px), 0)`,
              backgroundImage:
                "linear-gradient(90deg, rgba(0,0,0,0.22) 1px, transparent 1px), linear-gradient(0deg, rgba(0,0,0,0.22) 1px, transparent 1px)",
              backgroundSize: "40px 40px, 40px 40px",
              backgroundPosition: "0 0, 0 0",
            }}
          />
        </m.div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.15),transparent_60%)]" />
      </div>
      <p className="relative z-10 mb-6 text-center text-2xl font-black uppercase tracking-[0.28em] text-black md:mb-8 md:text-4xl">
        Vostok Facio-Cranial
        <br />
        Muscularization Process
      </p>
      {entrySource === "4chan" && (
        <p className="relative z-10 mx-auto mb-6 max-w-2xl text-center text-sm text-black/70">
          Blackpill doom is a loop. This is the off-ramp: 4s to 7s, 6s to 9s. It stacks the more
          you work it and keeps you out of the incel spiral.
        </p>
      )}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row md:items-stretch md:gap-12">
        <div className="md:w-3/5">
          <div
            ref={imageFrameRef}
            className={`relative z-20 isolate aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/40 bg-black shadow-[0_0_70px_rgba(255,255,255,0.45)] transition-all duration-500 ${
              focusPulse ? "brightness-110 shadow-[0_0_90px_rgba(255,255,255,0.25)]" : ""
            }`}
          >
            <div className="absolute inset-0 z-0 bg-black" />
            <div className="absolute left-4 top-4 z-30 rounded-full border border-white/30 bg-black/70 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-white/80">
              LIVE STRUCTURE VIEW
            </div>
            {activeVariants ? (
              <picture>
                <source
                  type="image/avif"
                  srcSet={`${activeVariants.avif.mobile} 640w, ${activeVariants.avif.desktop} 1600w`}
                  sizes="(max-width: 640px) 100vw, 60vw"
                />
                <source
                  type="image/webp"
                  srcSet={`${activeVariants.webp.mobile} 640w, ${activeVariants.webp.desktop} 1600w`}
                  sizes="(max-width: 640px) 100vw, 60vw"
                />
                <img
                  src={activeVariants.desktop}
                  srcSet={`${activeVariants.mobile} 640w, ${activeVariants.desktop} 1600w`}
                  sizes="(max-width: 640px) 100vw, 60vw"
                  alt={`${currentStage.title} comparison`}
                  className="relative z-10 h-full w-full object-cover"
                  onLoad={() => setPendingIcon(null)}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            ) : (
              <>
                {isNonAiAfter ? (
                  <>
                    <video
                      ref={afterVideoRef}
                      src={afterVideoSrc}
                      autoPlay
                      muted
                      playsInline
                      preload="auto"
                      onPlay={() => {
                        setIsAfterVideoPaused(false);
                      }}
                      onLoadedMetadata={() => {
                        const video = afterVideoRef.current;
                        setAfterVideoDuration(video?.duration || 0);
                        setPendingIcon(null);
                      }}
                      onTimeUpdate={() => {
                        const video = afterVideoRef.current;
                        setAfterVideoCurrentTime(video?.currentTime || 0);
                      }}
                      onPause={() => {
                        if (!afterVideoRef.current?.ended) {
                          setIsAfterVideoPaused(true);
                        }
                      }}
                      onEnded={() => {
                        setIsAfterVideoPaused(true);
                      }}
                      className="relative z-10 h-full w-full object-cover"
                    />
                    {
                      <button
                        type="button"
                        onClick={toggleAfterVideoPlayback}
                        aria-label={isAfterVideoPaused ? "Play video" : "Pause video"}
                        className="absolute inset-0 z-[12]"
                      >
                        {isAfterVideoPaused && (
                          <span className="absolute bottom-10 left-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6"
                            >
                              <path d="M10 9v6" />
                              <path d="M14 9v6" />
                            </svg>
                          </span>
                        )}
                      </button>
                    }
                    {
                      <div className="absolute inset-x-4 bottom-4 z-[13]">
                        <input
                          type="range"
                          min={0}
                          max={afterVideoDuration || 0}
                          step={0.01}
                          value={Math.min(afterVideoCurrentTime, afterVideoDuration || 0)}
                          onChange={(event) => handleAfterVideoSeek(Number(event.target.value))}
                          aria-label="Video timeline"
                          style={{
                            ["--radio-progress" as string]:
                              afterVideoDuration > 0
                                ? `${(afterVideoCurrentTime / afterVideoDuration) * 100}%`
                                : "0%",
                          }}
                          className="radio-player-slider h-2 w-full cursor-pointer appearance-none rounded-full bg-white/30"
                        />
                      </div>
                    }
                  </>
                ) : (
                  <img
                    src={activeStage === "non_ai" ? activeImage : toDesktopImage(activeImage)}
                    srcSet={
                      activeStage === "non_ai"
                        ? `${activeImage} 1600w`
                        : `${toMobileImage(activeImage)} 640w, ${toDesktopImage(activeImage)} 1600w`
                    }
                    sizes="(max-width: 640px) 100vw, 60vw"
                    alt={`${currentStage.title} comparison`}
                    className={`relative z-10 h-full w-full ${
                      activeStage === "non_ai" ? "object-cover object-center" : "object-cover"
                    }`}
                    onLoad={() => setPendingIcon(null)}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 z-[11] bg-black/20" />
              </>
            )}
            <m.div
              key={`scan-${scanKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.35, 0], y: [8, -8, -12] }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-0 z-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(180deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 10px)",
              }}
            />
          </div>
        </div>
        <div className="md:w-2/5">
          <div
            className={`w-full rounded-2xl border border-white/15 bg-black/70 p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.55)] transition-shadow duration-500 md:h-full md:p-6 ${
              focusPulse ? "shadow-[0_0_40px_rgba(255,255,255,0.05)]" : ""
            }`}
          >
            {stages.map((stage) => {
              const isActiveStage = activeStage === stage.key;
              return (
                <div
                  key={stage.key}
                  className={`mt-4 border-t border-white/10 pt-3 first:mt-0 first:border-t-0 first:pt-0 ${
                    isActiveStage ? "shadow-[0_0_40px_rgba(255,255,255,0.05)]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-chrome/80">
                      {stage.title}
                    </p>
                    <div className="grid grid-cols-2 justify-items-center gap-3">
                      {stage.icons.map((icon) => {
                        const iconKey = `${stage.key}:${icon}`;
                        const isPendingIcon = pendingIcon === iconKey;
                        const iconThumb = icon.includes("/before/after/")
                          ? null
                          : getThumbVariants(icon);
                        const iconMobile = toMobileImage(icon);
                        const iconDesktop = toDesktopImage(icon);
                        return (
                          <button
                            key={icon}
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              selectStage(stage.key as StageKey, icon);
                            }}
                            className={`relative z-10 h-[3.75rem] w-[3.75rem] touch-manipulation overflow-hidden rounded border bg-black transition-all md:h-20 md:w-20 ${
                              activeStage === stage.key && activeImage === icon
                                ? "border-chrome/60 opacity-100"
                                : "border-white/10 opacity-50 grayscale hover:border-white/30 hover:opacity-80"
                            } ${isPendingIcon ? "scale-[1.04] border-white/70 opacity-100 ring-2 ring-white/35 grayscale-0" : ""}`}
                          >
                            {iconThumb ? (
                              <picture>
                                <source
                                  type="image/avif"
                                  srcSet={`${iconThumb.mobile.avif} 96w, ${iconThumb.desktop.avif} 128w`}
                                  sizes="40px"
                                />
                                <source
                                  type="image/webp"
                                  srcSet={`${iconThumb.mobile.webp} 96w, ${iconThumb.desktop.webp} 128w`}
                                  sizes="40px"
                                />
                                <img
                                  src={iconThumb.desktop.jpg}
                                  srcSet={`${iconThumb.mobile.jpg} 96w, ${iconThumb.desktop.jpg} 128w`}
                                  sizes="40px"
                                  alt={`${stage.title} option`}
                                  className="h-full w-full object-cover bg-black"
                                  loading="lazy"
                                  decoding="async"
                                />
                              </picture>
                            ) : (
                              <div className="relative h-full w-full">
                                <img
                                  src={icon}
                                  srcSet={`${iconMobile} 96w, ${iconDesktop} 128w, ${icon} 256w`}
                                  sizes="40px"
                                  alt={`${stage.title} option`}
                                  className="h-full w-full object-cover bg-black"
                                  loading="lazy"
                                  decoding="async"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-black/20" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            <m.div
              key={activeStage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="mt-6 rounded-2xl panel-glass p-6 text-sm leading-relaxed text-white/85"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-chrome/80">
                {currentStage.title}
              </p>
              <div className="mt-4">
                {renderStageText()}
              </div>
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VostokProcess;
