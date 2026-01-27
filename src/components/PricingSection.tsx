const PricingSection = () => {
  return (
    <section id="pricing" className="py-10 md:py-14 px-4 md:px-8">
      <div className="container mx-auto max-w-2xl">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="space-y-2">
              <p className="hidden text-vostok-muted" aria-hidden="true">
                Complete 276-page PDF Protocol
              </p>
            </div>

            <a
              href="https://amoxcenturion.gumroad.com/l/vostokmethod"
              className="btn-green w-full text-center text-xl py-5 mt-12 sm:mt-10 md:mt-6"
            >
              Buy
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
