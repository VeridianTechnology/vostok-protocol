type QuoteSectionProps = {
  entrySource?: "facebook" | "4chan" | "instagram" | "tiktok" | "reddit" | "twitter" | "direct";
};

const QuoteSection = ({ entrySource = "direct" }: QuoteSectionProps) => {
  const isFourChan = entrySource === "4chan";
  return (
    <section className="section-surface relative flex items-end w-screen -translate-x-1/2 left-1/2 right-1/2 mt-0 mb-0">
      <span className="block w-full">
        <span className="quote-panel block w-full rounded-none px-6 py-8 text-center md:py-16">
          <p className="font-quote text-[1.35rem] leading-relaxed text-black/80 md:text-[2rem] md:leading-relaxed">
            {isFourChan ? (
              <>
                <span className="text-black/60">
                  You are a piss poor NEET-MAX.
                </span>
                <br />
                <span className="text-black">
                  Get on my level, buy the fucking book and practice it everyday. Thank me in two
                  (more) weeks.
                </span>
                <br />
                <span className="text-black/60">
                  And follow me on facebook, insta, everything and like my shit. Let&apos;s change
                  the narrative, fren.
                </span>
              </>
            ) : (
              <>
                <span className="text-black/60">Your face is the biography of your habits.</span>
              </>
            )}
          </p>
        </span>
      </span>
    </section>
  );
};

export default QuoteSection;
