const Lite = () => {
  return (
    <main className="min-h-screen bg-vostok-bg text-vostok-text px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        <div className="space-y-3">
          <p className="font-mono text-xs tracking-[0.3em] text-vostok-neon/70">
            THE VOSTOK METHOD
          </p>
          <h1 className="text-4xl font-bold md:text-5xl">
            The Most Direct Path to a Better Face
          </h1>
          <p className="text-base text-vostok-muted md:text-lg">
            Zero fluff. One system. Designed to move your face several points up.
          </p>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-vostok-neon/20 bg-black/40">
          <img
            src="/main_simple.jpg"
            alt="The Vostok Method"
            className="h-auto w-full object-cover"
            loading="eager"
            width={770}
            height={1100}
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm text-vostok-muted">
            Instant download. Lifetime access.
          </p>
          <a
            href="https://vostokmethod.gumroad.com/l/vostokmethod"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-vostok-neon px-6 py-3 text-base font-semibold text-vostok-bg"
          >
            Get Instant Access
          </a>
        </div>
      </div>
    </main>
  );
};

export default Lite;
