import { Link } from "react-router-dom";

// Styles for vr-nav-* live in src/pages/radio/radio.css, which every page
// using this nav imports alongside landing.css.
const tabs = [
  { label: "The Method", to: "/" },
  { label: "Radio", to: "/radio" },
  { label: "Polaris", to: "/polaris" },
];

const SiteNav = ({ suffix, active }: { suffix: string; active: string }) => (
  <header className="vr-nav">
    <Link className="vr-nav-mark" to="/">
      VØSTOK <em>{suffix}</em>
    </Link>
    <nav className="vr-nav-tabs">
      {tabs.map((tab) =>
        tab.label === active ? (
          <span key={tab.label} className="vr-nav-tab vr-nav-tab--active">
            {tab.label}
          </span>
        ) : (
          <Link key={tab.label} className="vr-nav-tab" to={tab.to}>
            {tab.label}
          </Link>
        )
      )}
    </nav>
  </header>
);

export default SiteNav;
