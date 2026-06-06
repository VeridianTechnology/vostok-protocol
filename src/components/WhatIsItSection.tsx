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
        <p
          className="mb-6 text-[0.7rem] font-black uppercase tracking-[0.28em] text-[#f1d27a] opacity-90"
          style={{ fontFamily: "var(--font-display, 'Tektur', sans-serif)" }}
        >
          NYX's Story
        </p>
        <div className="w-[300px] md:w-[440px]">
          <iframe
            src="https://www.youtube.com/embed/4XI2GrkWeG8"
            title="NYX's Story"
            className="aspect-[9/16] w-full rounded-xl border-0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
};

export default WhatIsItSection;
