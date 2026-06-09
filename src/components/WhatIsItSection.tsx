const ARTICLES = [
  {
    src: "/section_wallpaper/articles/1.jpeg",
    alt: "The Perfect Female Face",
    href: "https://nyxvostok.substack.com/p/the-perfect-female-face",
  },
  {
    src: "/section_wallpaper/articles/2.jpeg",
    alt: "Defend Your Money — Spiritually",
    href: "https://open.substack.com/pub/nyxvostok/p/defend-your-money-spiritually?r=3isgrj&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true",
  },
];

const goldLabel = "mb-4 text-[0.7rem] font-black uppercase tracking-[0.28em] text-[#f1d27a] opacity-90";
const goldLabelStyle = { fontFamily: "var(--font-display, 'Tektur', sans-serif)" };

const WhatIsItSection = () => {
  return (
    <section className="section-surface relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-t-[3px] border-black">
      <div className="absolute inset-0 -z-10">
        <img
          src="/section_wallpaper/whatisit/3.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 hidden h-full w-full object-cover brightness-[1.68] md:block"
        />
        <img
          src="/section_wallpaper/whatisit/4.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover brightness-[1.2] md:hidden"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.72)_60%,rgba(0,0,0,0.88)_100%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 py-[8vh] md:px-16 md:py-[10vh]">
        <div className="flex w-full max-w-5xl items-start justify-center gap-8 md:gap-12">

          {/* YouTube Short — centered, large */}
          <div className="flex flex-col items-start w-[300px] shrink-0 md:w-[420px]">
            <p className={goldLabel} style={goldLabelStyle}>NYX's Story</p>
            <iframe
              src="https://www.youtube.com/embed/4XI2GrkWeG8"
              title="NYX's Story"
              className="aspect-[9/16] w-full rounded-xl border-0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Article icons — small, stacked */}
          <div className="flex flex-col items-start shrink-0 pt-1 gap-3">
            <p className={goldLabel} style={goldLabelStyle}>Articles</p>
            {ARTICLES.map((article) => (
              <a
                key={article.href}
                href={article.href}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:scale-[1.04] w-[80px] md:w-[100px]"
                aria-label={article.alt}
              >
                <img
                  src={article.src}
                  alt={article.alt}
                  className="h-auto w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </a>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhatIsItSection;
