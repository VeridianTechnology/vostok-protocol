const Footer = () => {
  return (
    <footer className="py-6 md:py-8 px-0 border-t border-vostok-neon/20">
      <div className="w-full pl-3">
        <div className="flex flex-col items-start justify-start gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/float/float3.jpg"
              alt="Vostok Method logo"
              className="h-40 w-40 rounded-md"
            />
            <div>
              <div className="text-3xl md:text-4xl font-semibold text-vostok-text text-glow text-glow-white">
                Vostok
              </div>
              <div className="text-sm md:text-base italic text-vostok-text text-glow text-glow-white">
                Get Hot
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
