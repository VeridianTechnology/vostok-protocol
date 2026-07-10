// Agora — Nyx's living collection of good links. Entries here are generic
// starters; Nyx swaps them for the real finds as the collection grows.
// Items without an href render as reserved slots.

export type AgoraItem = {
  title: string;
  handle?: string;
  blurb: string;
  href?: string;
};

export type AgoraCategory = {
  name: string;
  tagline: string;
  items: AgoraItem[];
};

export const agoraCategories: AgoraCategory[] = [
  {
    name: "Cool Instagrams to Follow",
    tagline: "Feeds that raise the average of everything you scroll past.",
    items: [
      {
        title: "NASA",
        handle: "@nasa",
        blurb: "The original feed of the sublime — Earth from above, nebulae from closer.",
        href: "https://www.instagram.com/nasa/",
      },
      {
        title: "National Geographic",
        handle: "@natgeo",
        blurb: "A century of looking closely at the planet, one frame at a time.",
        href: "https://www.instagram.com/natgeo/",
      },
      {
        title: "Humans of New York",
        handle: "@humansofny",
        blurb: "Faces, and the lives that carved them. Field notes for the protocol.",
        href: "https://www.instagram.com/humansofny/",
      },
      {
        title: "Architectural Digest",
        handle: "@archdigest",
        blurb: "Rooms to build a life toward. Structure, again — just at another scale.",
        href: "https://www.instagram.com/archdigest/",
      },
    ],
  },
  {
    name: "Baddies",
    tagline: "The gallery. Nyx is vetting the first class — no seat is given lightly.",
    items: [
      { title: "Seat 01", blurb: "Reserved. The first name drops with the first Agora dispatch." },
      { title: "Seat 02", blurb: "Reserved. Nominations are open in the Discord." },
      { title: "Seat 03", blurb: "Reserved. Symmetry will be verified." },
      { title: "Seat 04", blurb: "Reserved. The camera doesn't lie, so neither will this list." },
    ],
  },
  {
    name: "Twitters to Follow",
    tagline: "Accounts that think in public and are worth thinking along with.",
    items: [
      {
        title: "Naval",
        handle: "@naval",
        blurb: "Aphorisms on leverage, judgment, and wanting the right things.",
        href: "https://x.com/naval",
      },
      {
        title: "Paul Graham",
        handle: "@paulg",
        blurb: "Essays and asides on doing great work slowly and stubbornly.",
        href: "https://x.com/paulg",
      },
      {
        title: "Tim Urban",
        handle: "@waitbutwhy",
        blurb: "Very long explanations of very big things, with stick figures.",
        href: "https://x.com/waitbutwhy",
      },
      {
        title: "Lex Fridman",
        handle: "@lexfridman",
        blurb: "Long conversations held at low speed and high sincerity.",
        href: "https://x.com/lexfridman",
      },
    ],
  },
  {
    name: "Interesting Wikipedias",
    tagline: "Rabbit holes with structural integrity. Enter freely.",
    items: [
      {
        title: "Koinophilia",
        blurb: "Why average faces read as beautiful — the science under the whole protocol.",
        href: "https://en.wikipedia.org/wiki/Koinophilia",
      },
      {
        title: "Neoteny",
        blurb: "The retention of youthful features — and why humans are built from it.",
        href: "https://en.wikipedia.org/wiki/Neoteny",
      },
      {
        title: "Halo effect",
        blurb: "Beautiful is assumed good, smart, and trustworthy. Use responsibly.",
        href: "https://en.wikipedia.org/wiki/Halo_effect",
      },
      {
        title: "Physical attractiveness",
        blurb: "The whole battlefield, surveyed in one long, heavily-cited article.",
        href: "https://en.wikipedia.org/wiki/Physical_attractiveness",
      },
      {
        title: "Antikythera mechanism",
        blurb: "A two-thousand-year-old computer pulled from the sea. We forgot how to make it.",
        href: "https://en.wikipedia.org/wiki/Antikythera_mechanism",
      },
      {
        title: "Voynich manuscript",
        blurb: "A book no living person can read. Someone wrote it anyway.",
        href: "https://en.wikipedia.org/wiki/Voynich_manuscript",
      },
    ],
  },
  {
    name: "Quora Answers",
    tagline: "The crowd argues; some of it is gold. Threads worth the scroll.",
    items: [
      {
        title: "Do facial exercises actually work?",
        blurb: "The eternal thread. Watch the skeptics and the converted circle each other.",
        href: "https://www.quora.com/search?q=do%20facial%20exercises%20actually%20work",
      },
      {
        title: "What does meditation do to the brain?",
        blurb: "Neuroscientists, monks, and people who tried it for a week walk into a thread.",
        href: "https://www.quora.com/search?q=what%20does%20meditation%20do%20to%20the%20brain",
      },
      {
        title: "How much does posture change a face?",
        blurb: "The neck controls more than anyone wants to admit.",
        href: "https://www.quora.com/search?q=does%20posture%20change%20your%20face",
      },
      {
        title: "Why are some faces more symmetrical?",
        blurb: "Genetics deals the hand; the answers argue about how it's played.",
        href: "https://www.quora.com/search?q=why%20are%20some%20faces%20more%20symmetrical",
      },
    ],
  },
];
