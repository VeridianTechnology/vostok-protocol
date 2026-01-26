const Footer = () => {
  return (
    <footer className="py-10 md:py-14 px-4 md:px-8 border-t border-vostok-neon/20">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-4xl md:text-5xl font-bold text-vostok-neon text-glow">
              The Vostok Method
            </h3>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-sm text-vostok-muted">
              © {new Date().getFullYear()} The Vostok Method. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
