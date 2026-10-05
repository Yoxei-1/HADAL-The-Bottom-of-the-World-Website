# HADAL — The Bottom of the World

A single-page interactive descent to the deepest point of the ocean, built as a
design/development concept study. Scrolling *is* diving: you start on a sunlit
surface and fall 10,911 metres to the floor of the Mariana Trench.

HADAL is a **fictional expedition**. The depths, pressures, temperatures and
creatures referenced are real.

## The experience

- **A pre-dive checklist** loading sequence.
- **Depth is the navigation** — a live gauge on the right edge tracks your
  scroll in metres; ticks jump between ocean zones.
- **Live telemetry** — depth, pressure, temperature and remaining sunlight are
  computed continuously as you scroll.
- **A pinned midnight-zone sonar stage** — your cursor is a light source and
  clicks/taps fire sonar pings that reveal bioluminescent life hidden in the
  dark (with optional synthesised audio).
- **A continuous environment** — background colour, light rays, marine-snow
  density, vignette and hydrothermal glow all interpolate with real depth.
- **The vessel** — HADAL ONE, revealed at the bottom of the world.
- **Resurface** — a final ascent back to daylight.

## Tech

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- One shared rAF "depth engine" (context + frame subscribers) — no animation
  library; all motion is hand-rolled interpolation, CSS transitions and canvas
- WebAudio-generated ambience and sonar pings (opt-in, no audio assets)
- Lucide icons
- Typography: Archivo (variable grotesk), Instrument Serif (italic accents),
  JetBrains Mono (instrument data)

## Run it

```bash
npm install
npm run dev
```

## Build / deploy

```bash
npm run build     # outputs dist/
```

The build is a fully static site. Easiest deploys:

- **Netlify / Vercel** — drop the `dist/` folder or connect the repo (build
  command `npm run build`, output `dist`). No extra config needed.
- **GitHub Pages** — works too, but because Pages serves from a subpath
  (`/repo-name/`), set `base: '/repo-name/'` in `vite.config.ts` before
  building so asset URLs resolve.

## Structure

```
src/
  core/engine.tsx      # scroll→depth engine, pointer, single rAF loop
  audio/engine.ts      # generative hum + sonar ping (opt-in)
  data/zones.ts        # zones, creatures, specs, dive log
  components/          # chrome: gauge, telemetry, cursor, menu, preloader…
  sections/            # the chapters of the descent (surface → floor)
public/images/         # art-directed expedition imagery
```

## Notes

All imagery in `public/images/` was AI-generated for this concept, and AI
tooling assisted during development. Sound is off by default and can be
toggled in the header. The site respects `prefers-reduced-motion` for its
ambient systems.
