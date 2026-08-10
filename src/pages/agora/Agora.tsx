import { useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import { usePageMetadata } from "@/lib/pageMetadata";
import { agoraCategories } from "./links";
import "../landing.css";
import "../radio/radio.css";
import "./agora.css";

const Agora = () => {
  usePageMetadata({
    title: "Vostok Agora — The Digital Meeting Place",
    description: "A living collection of accounts, articles, answers, and faces gathered by Nyx.",
    path: "/agora",
  });
  const [categoryIndex, setCategoryIndex] = useState(0);
  const category = agoraCategories[categoryIndex];

  return (
    <div className="vl va">
      <SiteNav suffix="AGORA" active="Agora" />

      <section className="vl-section va-head">
        <p className="vl-kicker vr-kicker">
          Agora
          <img className="vr-kicker-logo" src="/logo/logo-agora-160.webp" alt="" aria-hidden="true" />
        </p>
        <h1 className="vl-h2">
          The digital <em>meeting place.</em>
        </h1>
        <p className="vl-lead">
          A living collection of the good corners of the internet — accounts, articles, answers,
          faces — gathered by Nyx as she finds them. Free to use. It always will be.
        </p>
      </section>

      <section className="vl-section va-main">
        <div className="va-chips">
          {agoraCategories.map((cat, i) => (
            <button
              key={cat.name}
              className={`va-chip${i === categoryIndex ? " va-chip--active" : ""}`}
              onClick={() => setCategoryIndex(i)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <p className="va-tagline">{category.tagline}</p>

        <div className="va-grid">
          {category.items.map((item) =>
            item.href ? (
              <a
                key={item.title}
                className="va-card"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3>
                  {item.title}
                  {item.handle && <span className="va-card-handle">{item.handle}</span>}
                </h3>
                <p>{item.blurb}</p>
                <span className="va-card-open">Open →</span>
              </a>
            ) : (
              <div key={item.title} className="va-card va-card--reserved">
                <h3>{item.title}</h3>
                <p>{item.blurb}</p>
                <span className="va-card-open">Coming soon</span>
              </div>
            )
          )}
        </div>
      </section>

      <section className="vl-dark vl-dark--center va-creed">
        <div className="vl-dark-bg" style={{ backgroundImage: "url(/obsidian/path.webp)" }} aria-hidden="true" />
        <div className="vl-dark-inner">
          <p className="vl-kicker">The Square, Not the Market</p>
          <h2 className="vl-dark-quote">
            Free. <em>Forever.</em>
          </h2>
          <p className="vl-dark-text">
            The ancient agora was where a city met — to argue, to trade ideas, to look each other in
            the face. This one is no different, and it will never cost a thing. Nyx keeps the
            collection; you bring the attention. New finds are added as they're found.
          </p>
        </div>
      </section>

      <footer className="vl-footer vr-footer">
        <Link to="/" className="vr-footer-link">
          ← Back to the Method
        </Link>
        <p className="vl-fineprint">Agora — by Vostok</p>
      </footer>
    </div>
  );
};

export default Agora;
