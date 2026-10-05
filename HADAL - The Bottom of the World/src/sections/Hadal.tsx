import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { Section } from "../components/Section";
import { ZoneTag } from "../components/ZoneTag";
import { Lines, Fade, Words } from "../components/TextStagger";
import { Magnetic } from "../components/Magnetic";
import { useEngine } from "../core/engine";
import { SPECS } from "../data/zones";

/** V — HADAL. The vessel, six hundred atmospheres down. */
export function Hadal() {
  const { subscribe } = useEngine();
  const wrapRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribe(() => {
      const wrap = wrapRef.current;
      const fig = figRef.current;
      if (!wrap || !fig) return;
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -120 || r.top > vh + 120) return;
      const t = Math.max(0, Math.min(1, (vh - r.top) / (r.height + vh)));
      const y = (t - 0.5) * -70;
      const s = 1.07 - t * 0.07;
      fig.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
    });
  }, [subscribe]);

  return (
    <Section id="hadal" start={6400} end={10300} className="text-[#e9f1ee]">
      <div ref={wrapRef} className="relative min-h-[200svh] px-5 pb-[10vh] pt-[16vh] md:px-8">
        {/* hydrothermal vent, far below */}
        <img
          src="/images/vent.jpg"
          alt=""
          aria-hidden
          loading="lazy"
          className="mask-soft pointer-events-none absolute bottom-0 right-0 w-[min(60vw,560px)] opacity-30 mix-blend-screen"
        />

        <div className="relative">
          <ZoneTag numeral="V" name="HADAL" range="6,000 — 10,911 M" />

          <Fade delay={150} className="mt-6">
            <p className="font-serif text-lg italic text-white/60 md:text-xl">
              <Words text="Named for Hades. Six hundred atmospheres of patience." />
            </p>
          </Fade>

          {/* vessel figure */}
          <div className="mt-[8vh]">
            <div ref={figRef} className="will-change-transform">
              <div className="mask-fade-b overflow-hidden">
                <img
                  src="/images/submersible.jpg"
                  alt="The Hadal One submersible hovering above the abyssal plain, headlights cutting through black water"
                  className="aspect-[16/10] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between font-mono text-[8px] tracking-[0.28em] text-white/40">
              <span>FIG. 01 — HADAL ONE, TRIALS AT 8,020 M</span>
              <span className="tnum hidden md:inline">EXPOSURE 1/15</span>
            </div>
          </div>

          {/* name + mission */}
          <div className="mt-[10vh] grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-7">
              <Lines
                className="display-wide font-black uppercase leading-[0.88] tracking-[-0.03em]"
                lineClass="text-[clamp(3rem,9vw,7.5rem)]"
                lines={[<>HADAL ONE</>]}
              />
              <Fade delay={200} className="mt-6 max-w-md">
                <p className="text-[13px] leading-relaxed text-white/70 md:text-sm">
                  A three-person titanium sphere with engines attached. Rated
                  past the floor of every trench on Earth — because
                  &ldquo;probably&rdquo; is not an engineering value. She has
                  made eleven descents. The twelfth is crewed, and there is one
                  seat assigned to someone who has never been down.
                </p>
              </Fade>
            </div>

            <div className="md:col-span-5">
              <div className="flex flex-col">
                {SPECS.map(([k, v], i) => (
                  <Fade key={k} delay={i * 70} y={14}>
                    <div className="flex items-baseline justify-between gap-8 border-t border-white/12 py-3 last:border-b">
                      <span className="w-28 shrink-0 font-mono text-[8px] tracking-[0.25em] text-white/40">
                        {k}
                      </span>
                      <span className="text-right font-mono text-[9px] tracking-[0.1em] text-white/85">
                        {v}
                      </span>
                    </div>
                  </Fade>
                ))}
              </div>
            </div>
          </div>

          {/* cta */}
          <Fade delay={150} className="mt-[10vh] flex flex-col items-start gap-5 md:flex-row md:items-center">
            <Magnetic strength={0.3}>
              <a
                href="mailto:expeditions@hadal-deep.earth?subject=Descent%20XII%20—%20the%20open%20seat"
                data-cursor="link"
                className="group inline-flex items-center gap-4 rounded-full border border-white/25 px-8 py-4 font-mono text-[10px] tracking-[0.3em] text-white transition-colors duration-500 hover:border-[#e9f1ee] hover:bg-[#e9f1ee] hover:text-[#010409]"
              >
                REQUEST A SEAT — DESCENT XII
                <ArrowDown size={13} className="transition-transform duration-500 group-hover:translate-y-0.5 group-hover:rotate-180" aria-hidden />
              </a>
            </Magnetic>
            <p className="max-w-[15rem] font-mono text-[8px] leading-relaxed tracking-[0.25em] text-white/35">
              NO EXPERIENCE REQUIRED. CLAUSTROPHOBICS GENTLY DISCOURAGED.
            </p>
          </Fade>
        </div>
      </div>
    </Section>
  );
}
