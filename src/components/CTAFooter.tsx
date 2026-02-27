import { motion } from "framer-motion";

const CTAFooter = () => {
  return (
    <section className="py-10 px-6 relative md:py-32">
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-background to-background" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-chrome tracking-[0.4em] uppercase text-xs mb-3 md:mb-6 font-light">
            Begin Your Transformation
          </p>

          <h2 className="text-4xl md:text-5xl font-light text-foreground tracking-tight mb-3 md:mb-4">
            The <span className="font-semibold">Timeless Face</span>
          </h2>

          <p className="text-steel text-sm md:text-base font-light mb-3 max-w-md mx-auto leading-relaxed">
            An Engineering Approach to Aesthetics
          </p>

          <div className="divider-line max-w-xs mx-auto mb-6 md:mb-8" />

          <p className="text-chrome text-xs tracking-wider mb-7 md:mb-10">
            Instant digital delivery · 290 pages · Lifetime access
          </p>

          {/* Price */}
          <div className="mb-6 md:mb-8 flex flex-col items-center gap-2">
            <span className="text-steel text-sm line-through">$49.99</span>
            <span className="text-4xl font-light text-foreground">$29.99</span>
          </div>

          {/* CTA Button */}
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://vostok67.gumroad.com/l/vostokmethod?wanted=true"
            target="_blank"
            rel="noreferrer"
            className="inline-block gradient-glossy text-foreground font-medium tracking-[0.2em] uppercase text-sm px-16 py-5 rounded-sm border border-chrome/20 shadow-luxury hover:shadow-glow transition-all duration-500 cursor-pointer"
          >
            Buy Now
          </motion.a>

          <p className="text-steel/50 text-[10px] tracking-wider mt-4 md:mt-6 uppercase">
            30-day precision guarantee
          </p>
        </motion.div>
      </div>

      {/* Footer bar */}
      <div className="relative z-10 mt-12 pt-6 md:mt-24 md:pt-8">
        <div className="divider-line mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto text-[10px] tracking-wider text-steel/40 uppercase">
          <span>© 2026 The Timeless Face</span>
          <span>Engineered for Excellence</span>
        </div>
      </div>
    </section>
  );
};

export default CTAFooter;
