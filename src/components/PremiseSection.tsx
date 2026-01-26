const premiseStatement =
  'You already know how important looks are - this guide, is the definitive guide on how to go up three points, a 6 to a 9, a 4 to a 7 and so on.';

const PremiseSection = () => {
  return (
    <section className="py-10 md:py-14 px-4 md:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="divider-neon mb-10" />
        
        <div className="space-y-4 text-center">
          <p className="text-4xl md:text-5xl lg:text-6xl text-vostok-neon font-semibold text-glow leading-tight">
            {premiseStatement}
          </p>
        </div>
        
        <div className="divider-neon mt-10" />
      </div>
    </section>
  );
};

export default PremiseSection;
