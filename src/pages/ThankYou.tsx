import { useEffect } from "react";
import { trackTiktokEventOnce } from "@/utils/tiktokTracking";

const ThankYou = () => {
  useEffect(() => {
    trackTiktokEventOnce("CompletePayment", "tiktok_complete_payment");
  }, []);

  return (
    <main className="min-h-screen bg-vostok-bg text-vostok-text px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-vostok-muted">Vostok Method</p>
        <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight">
          You’re in. Welcome to the Method.
        </h1>
        <p className="mt-4 text-base md:text-lg text-vostok-muted">
          Your order is complete. Check your email for the download and next steps.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="/"
            className="btn-green inline-flex items-center justify-center px-6 py-3 text-base"
          >
            Back to the site
          </a>
          <a
            href="https://amoxcenturion.gumroad.com/library"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 text-base text-vostok-text/90 border border-white/20 rounded-full hover:border-white/40 transition"
          >
            Open Gumroad library
          </a>
        </div>
      </div>
    </main>
  );
};

export default ThankYou;
