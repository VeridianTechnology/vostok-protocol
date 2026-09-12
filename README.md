# Vostok — The Living Sculpture

An interactive marble face study with ten feature views, continuous before/after
morphing, regional highlights, and the existing Radio Vostok library. Each feature
changes only its own region; Overall Face combines all nine. The original
hero background and two Substack essays are retained; `/radio` redirects home.

Local development:

```bash
npm install
npm run dev
```

Open http://localhost:8080. Drag the face to rotate, choose a feature to focus it,
or use the Before/After buttons and transformation slider. The focused canvas
also supports arrow keys, `+` / `-` to zoom, and `Home` to reset. On mobile the
sculpture stays visible while the controls scroll.

Before/After transitions and camera moves take two seconds, with reduced-motion
support. Overall highlights are off by default and can be enabled explicitly.

Radio starts paused at 30% volume and plays only after the Play button is pressed.
A manual pause is preserved. Failed tracks are skipped up to three times before
playback stops.

Build and browser checks:

```bash
npm run build
npx vitest run src/components/face-study/sculptureGeometry.test.ts
node scripts/qa-face-study.mjs
```

The browser check uses the local development server and installed Google Chrome.
Override `QA_SITE_URL` or `CHROME_PATH` as needed. It checks the feature views,
visible morphs, rotation, radio controls, responsive layouts, and reduced motion,
and prints the temporary directory containing its screenshots.

The geometry tests verify that individual feature morphs leave other regions
untouched, including the jaw. The sculpted open-eye surface is baked into the
small GLB to avoid remeshing in the browser. To rebuild it from the preserved
source assets:

```bash
node scripts/build-eye-relief.mjs
npx tsx scripts/build-sculpture.ts
```

The sculpture is an artistic interpretation, not a reconstruction of the reference
photographs or a medical simulation. Base scan attribution and modification notes
are in `public/models/credits.txt`. Older page components remain in source but are
not mounted by the current app.
