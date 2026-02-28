const QuoteSection = () => {
  return (
    <section className="relative flex items-end w-screen -translate-x-1/2 left-1/2 right-1/2">
      <span className="block w-full">
        <span className="quote-panel block w-full rounded-none px-6 py-8 text-center md:rounded-2xl md:py-16">
          <p className="font-quote text-[1.35rem] leading-relaxed text-foreground md:text-[2rem] md:leading-relaxed">
            <span className="text-chrome">You weren&apos;t born with your final face.</span>
            <br />
            <span className="text-foreground">You just stopped building it.</span>
          </p>
        </span>
      </span>
    </section>
  );
};

export default QuoteSection;
