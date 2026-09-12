import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  RotateCcw,
  ScanFace,
  Sparkles,
} from "lucide-react";
import { usePageMetadata } from "@/lib/pageMetadata";
import { features, type FeatureId } from "@/components/face-study/features";
import FeatureIcon from "@/components/face-study/FeatureIcon";
import MiniRadio from "@/components/face-study/MiniRadio";
import {
  STUDY_TRANSITION_MS,
  studyEase,
} from "@/components/face-study/animation";
import "./face-study.css";

const FaceSculpture = lazy(
  () => import("@/components/face-study/FaceSculpture"),
);

export default function FaceStudy() {
  usePageMetadata({
    title: "How the Vostok Method Improves Me — VØSTOK",
    description:
      "An interactive study in facial form. Rotate the marble sculpture, explore nine areas, and compare the illustrated before and after. Free to explore.",
    path: "/",
  });
  const [feature, setFeature] = useState<FeatureId>("overall");
  const [amount, setAmount] = useState(1);
  const [highlights, setHighlights] = useState(false);
  const [view, setView] = useState(0);
  const [reset, setReset] = useState(0);
  const [ready, setReady] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout>>();
  const animationFrame = useRef(0);
  const amountRef = useRef(1);
  const selected = features.find((item) => item.id === feature)!;
  const improved = amount >= 0.99;

  useEffect(
    () => () => {
      clearTimeout(transitionTimer.current);
      cancelAnimationFrame(animationFrame.current);
    },
    [],
  );

  const changeAmount = (value: number) => {
    clearTimeout(transitionTimer.current);
    cancelAnimationFrame(animationFrame.current);
    amountRef.current = value;
    setAmount(value);
  };
  const animateAmount = (value: number) => {
    clearTimeout(transitionTimer.current);
    cancelAnimationFrame(animationFrame.current);
    const from = amountRef.current;
    if (
      from === value ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      changeAmount(value);
      return;
    }
    const start = performance.now();
    const step = (time: number) => {
      const next = from + (value - from) * studyEase(time - start);
      amountRef.current = next;
      setAmount(next);
      if (time - start < STUDY_TRANSITION_MS)
        animationFrame.current = requestAnimationFrame(step);
    };
    animationFrame.current = requestAnimationFrame(step);
  };
  const selectFeature = (id: FeatureId) => {
    changeAmount(0);
    setFeature(id);
    if (id === "overall") setHighlights(false);
    setView(0);
    setReset((value) => value + 1);
    transitionTimer.current = setTimeout(
      () => animateAmount(1),
      STUDY_TRANSITION_MS + 100,
    );
  };

  return (
    <div className="vostok-study">
      <a className="study-skip" href="#experience">
        Skip to the face study
      </a>
      <div className="study-background" aria-hidden="true" />
      <header className="study-header">
        <a className="study-wordmark" href="#top" aria-label="Vostok home">
          VØSTOK<span>THE ART OF BECOMING</span>
        </a>
        <div className="header-edition">
          <span /> A STUDY IN FACIAL FORM{" "}
          <span className="edition-year">VOLUME I</span>
        </div>
        <nav aria-label="Main navigation">
          <a className="header-method" href="#experience">
            THE METHOD
          </a>
          <a href="#philosophy">
            PHILOSOPHY <ArrowUpRight size={12} />
          </a>
          <a className="header-free" href="#experience">
            FREE <ArrowDown size={13} />
          </a>
        </nav>
      </header>
      <main id="top">
        <section
          className="study-experience"
          id="experience"
          aria-labelledby="study-title"
        >
          <div className="sculpture-column">
            <div className="sculpture-overline">
              <span className="tiny-cross">+</span> THE LIVING SCULPTURE{" "}
              <span>VOL. 01</span>
            </div>
            <div
              className="sculpture-stage"
              data-feature={feature}
              data-transformation={amount}
            >
              <div className="sculpture-aura" aria-hidden="true" />
              <div className="sculpture-orbit orbit-one" aria-hidden="true" />
              <div className="sculpture-orbit orbit-two" aria-hidden="true" />
              <span
                className="stage-coordinate coordinate-left"
                aria-hidden="true"
              >
                FORM / {selected.number}
              </span>
              <span
                className="stage-coordinate coordinate-right"
                aria-hidden="true"
              >
                360°
              </span>
              <Suspense
                fallback={
                  <div className="sculpture-loading">
                    Preparing the sculpture
                    <span />
                  </div>
                }
              >
                <FaceSculpture
                  feature={feature}
                  amount={amount}
                  highlights={highlights}
                  view={view}
                  reset={reset}
                  onReady={setReady}
                />
              </Suspense>
              <div
                className={`sculpture-state ${improved ? "is-improved" : ""}`}
                aria-live="polite"
                key={`${feature}-${improved}`}
              >
                <span className="state-dot" />{" "}
                {improved
                  ? "IMPROVED"
                  : amount === 0
                    ? "BEFORE"
                    : "TRANSFORMING"}
              </div>
              <div className="sculpture-label">
                <span>FIG. {selected.number}</span>
                <span>{selected.label}</span>
                <i>{improved ? "The refined form" : "The starting form"}</i>
              </div>
              <div className="sculpture-tools">
                <button
                  onClick={() => setView((value) => value - 1)}
                  aria-label="Rotate face left"
                  title="Rotate left"
                >
                  <ChevronLeft size={17} />
                </button>
                <span>
                  <MoveHorizontal size={15} /> DRAG TO ROTATE
                </span>
                <button
                  onClick={() => setView((value) => value + 1)}
                  aria-label="Rotate face right"
                  title="Rotate right"
                >
                  <ChevronRight size={17} />
                </button>
                <button
                  className="reset-view"
                  onClick={() => {
                    setView(0);
                    setReset((value) => value + 1);
                  }}
                  aria-label="Reset camera view"
                  title="Reset view"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
            <div className="sculpture-footnote">
              <span>
                <span className="small-dot" /> INTERACTIVE 3D STUDY
              </span>
              <span>Marble, movement & possibility.</span>
            </div>
          </div>
          <div className="study-panel">
            <div className="study-eyebrow">
              <span>THE VØSTOK METHOD</span>
              <span>01 — 10</span>
            </div>
            <h1 id="study-title">
              How the Vostok
              <br /> Method <em>Improves Me.</em>
            </h1>
            <p className="study-intro">
              The face is a living sculpture.
              <br />
              Explore the details. Discover the difference.
            </p>
            <div className="feature-heading">
              <span>CHOOSE AN AREA TO EXPLORE</span>
              <span>↓</span>
            </div>
            <div
              className="feature-grid"
              role="group"
              aria-label="Facial features"
            >
              {features.map((item) => (
                <button
                  key={item.id}
                  className={`feature-button ${feature === item.id ? "is-selected" : ""}`}
                  aria-pressed={feature === item.id}
                  onClick={() => selectFeature(item.id)}
                >
                  <FeatureIcon feature={item.id} />
                  <span>{item.label}</span>
                  <span className="feature-dot" />
                </button>
              ))}
            </div>
            <div className="feature-detail" key={feature}>
              <div className="detail-heading">
                <span className="detail-index">{selected.number}</span>
                <h2>{selected.heading}</h2>
                <ScanFace size={19} />
              </div>
              <p>{selected.description}</p>
              <div className="feature-tags">
                {selected.tags.map((tag) => (
                  <span key={tag}>
                    <Check size={10} /> {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="transformation-control">
              <div className="transformation-heading">
                <span>THE TRANSFORMATION</span>
                <span>
                  {Math.round(amount * 100)}
                  <small>%</small>
                </span>
              </div>
              <div
                className="compare-buttons"
                role="group"
                aria-label="Before and after"
              >
                <button
                  className={amount === 0 ? "active" : ""}
                  aria-pressed={amount === 0}
                  onClick={() => animateAmount(0)}
                >
                  Before
                </button>
                <button
                  className={improved ? "active" : ""}
                  aria-pressed={improved}
                  onClick={() => animateAmount(1)}
                >
                  <Sparkles size={13} /> After
                </button>
              </div>
              <input
                className="transformation-slider"
                type="range"
                aria-label="Face transformation"
                min="0"
                max="100"
                value={Math.round(amount * 100)}
                onChange={(event) =>
                  changeAmount(Number(event.target.value) / 100)
                }
                style={
                  { "--range-value": `${amount * 100}%` } as React.CSSProperties
                }
              />
              <div className="slider-labels">
                <span>ORIGINAL FORM</span>
                <span>REFINED FORM</span>
              </div>
              <button
                className="highlight-toggle"
                role="switch"
                aria-checked={highlights}
                onClick={() => setHighlights((value) => !value)}
              >
                <span className={`toggle-track ${highlights ? "enabled" : ""}`}>
                  <span />
                </span>
                <span>
                  Highlight{" "}
                  {feature === "overall"
                    ? "all improved areas"
                    : selected.label.toLowerCase()}
                </span>
                <span className="highlight-key" />
              </button>
            </div>
            <p className="study-note">
              An artistic visualization of my personal observations.
              <br />
              Illustrated changes, not a prediction of individual results.
            </p>
          </div>
        </section>
        <div className="study-interlude">
          <span className="interlude-rule" />
          <p>Not set in stone.</p>
          <a href="#philosophy" aria-label="Explore the Vostok philosophy">
            <ArrowDown size={18} />
          </a>
          <span className="interlude-rule" />
        </div>
      </main>
      <footer className="study-footer" id="philosophy">
        <div className="footer-intro">
          <div className="study-eyebrow">BEYOND THE SCULPTURE</div>
          <h2>
            The VØSTOK <br />
            <em>Philosophy.</em>
          </h2>
          <p>
            A few thoughts on becoming.
            <br />
            Inside, and out.
          </p>
        </div>
        <a
          className="article-link"
          href="https://nyxvostok.substack.com/p/youre-not-ugly-your-face-is-just"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/articles/01.jpeg"
            alt="Your face is droopy — Chapter 1, The Vostok Method by Nyx"
            loading="lazy"
          />
          <div className="article-copy">
            <span>CHAPTER I · THE VOSTOK METHOD</span>
            <h3>
              The Fountain
              <br />
              of Youth
            </h3>
            <span className="article-read">
              READ THE ESSAY <ArrowUpRight size={15} />
            </span>
          </div>
        </a>
        <a
          className="article-link"
          href="https://nyxvostok.substack.com/p/demand-side-economics-is-how-the"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/articles/02.jpeg"
            alt="Consumer Awareness — How to fix the world, by Nyx"
            loading="lazy"
          />
          <div className="article-copy">
            <span>CHAPTER II · A WIDER PERSPECTIVE</span>
            <h3>
              How to Make the
              <br />
              World Beautiful
            </h3>
            <span className="article-read">
              READ THE ESSAY <ArrowUpRight size={15} />
            </span>
          </div>
        </a>
        <div className="footer-bottom">
          <a href="#top">VØSTOK</a>
          <span>THE ART OF BECOMING · © {new Date().getFullYear()}</span>
          <a
            href="/models/credits.txt"
            target="_blank"
            rel="noopener noreferrer"
          >
            SCULPTURE CREDITS <ArrowUpRight size={11} />
          </a>
          <a href="#experience">
            BACK TO THE STUDY <ArrowRight size={12} />
          </a>
        </div>
      </footer>
      <MiniRadio />
      <span className="sr-only" role="status">
        {ready ? "3D face model ready" : "Loading 3D face model"}
      </span>
    </div>
  );
}
