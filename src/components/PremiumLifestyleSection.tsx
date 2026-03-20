import SectionSideTab from "@/components/SectionSideTab";

const PremiumLifestyleSection = () => {
  return (
    <section className="section-surface relative left-1/2 right-1/2 w-screen -translate-x-1/2 px-6 py-14 md:py-20">
      <SectionSideTab label="STAY TUNED" />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="section-surface-fill absolute inset-0" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "repeating-linear-gradient(120deg, rgba(0,0,0,0.28) 0 1px, transparent 1px 160px), repeating-linear-gradient(30deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 200px)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-black/20" />
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-white/35 blur-[90px]" />
        <div className="absolute -right-24 bottom-6 h-80 w-80 rounded-full bg-black/20 blur-[110px]" />
        <div className="absolute inset-0 hud-grid opacity-15 pointer-events-none" />
      </div>
      <div className="mx-auto w-full max-w-6xl">
        <div className="p-6 md:p-10">
          <h2 className="research-impact-title text-center text-[2rem] font-black uppercase leading-[1.02] tracking-[0.08em] text-black md:text-[5.3rem]">
            <>
              Premium lifestyle
              <br />
              <br />
              Are you ready for it
              <br />
              <br />
              VØSTOK
            </>
          </h2>
        </div>
      </div>
    </section>
  );
};

export default PremiumLifestyleSection;
