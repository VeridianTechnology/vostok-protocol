const Footer = () => {
  return (
    <footer className="py-16 px-4 md:px-8 border-t border-vostok-neon/20">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-vostok-text">
              The Vostok Method
            </h3>
            <p className="font-mono text-sm text-vostok-muted mt-1">
              Protocol for presence.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-sm text-vostok-muted">
              © {new Date().getFullYear()} The Vostok Method. All rights reserved.
            </p>
            <p className="font-mono text-xs text-vostok-muted/70">
              Educational content only. Not medical advice.
            </p>
          </div>
        </div>
        
        <div className="divider-neon mt-8" />
        
        <div className="mt-8 flex justify-center gap-8">
          <a href="#" className="text-sm text-vostok-muted hover:text-vostok-neon transition-colors">
            Privacy
          </a>
          <a href="#" className="text-sm text-vostok-muted hover:text-vostok-neon transition-colors">
            Terms
          </a>
          <a href="#" className="text-sm text-vostok-muted hover:text-vostok-neon transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
