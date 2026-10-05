import { useEffect, useRef } from "react";
import { Section } from "../components/Section";
import { Lines, Fade } from "../components/TextStagger";
import { useEngine } from "../core/engine";

const META: [string, string][] = [
  ["VESSEL", "HADAL ONE"],
  ["CREW", "THREE"],
  ["DIVE TIME", "14 HOURS"],
  ["MAX DEPTH", "10,911 M"],
];

/** 0 M — the world LEAVES the light here. */
export function Surface({ started }: { started: boolean }) {
  const { subscribe } = useEngine();
  const imgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribe(() => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (y > vh * 1.4) return;
      if (imgRef.current)
        imgRef.current.style.transform = `translateY(${(y * 0.14).toFixed(1)}px)`;
      if (titleRef.current) {
        titleRef.current.style.transform = `translateY(${(y * 0.22).toFixed(1)}px)`;
        titleRef.current.style.opacity = String(Math.max(0, 1 - y / (vh * 0.85)));
      }
    });
  }, [subscribe]);

  return (
    <Section id="surface" start={0} end={25} className="min-h-[100svh] text-[#0b2530]">
      {/* the ceiling of the ocean */}
      <div ref={imgRef} className="pointer-events-none absolute inset-x-0 top-0 will-change-transform">
        <div className="mask-surface relative h-[64vh] overflow-hidden">
          <img
            src="/images/surface.jpg"
            alt="Sunlight breaking through the ocean surface, seen from below"
            className="h-full w-full scale-105 object-cover"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 42% at 50% 0%, rgba(255,255,255,0.55) 0%, transparent 60%)",
            }}
          />
        </div>
      </div>

      <div className="relative flex min-h-[100svh] flex-col justify-between px-5 pb-7 pt-[19vh] md:px-8 md:pt-[21vh]">
        {/* headline */}
        <div ref={titleRef} className="will-change-transform">
          <Fade delay={250}>
            <p className="mb-5 font-mono text-[9px] tracking-[0.32em] opacity-70 md:mb-7 md:text-[10px]">
              A CREWED DESCENT PROGRAM — MARIANA TRENCH
            </p>
          </Fade>
          <Lines
            started={started}
            base={150}
            threshold={0.1}
            className="display-wide select-none font-black uppercase leading-[0.88] tracking-[-0.03em]"
            lineClass="text-[clamp(3.4rem,13vw,11.5rem)]"
            lines={[
              <>THE OCEAN</>,
              <>
                HAS A{" "}
                <span className="font-serif font-normal lowercase italic tracking-normal">
                  basement.
                </span>
              </>,
            ]}
          />
          <Fade delay={800} className="mt-6 max-w-xs md:ml-auto md:text-right">
            <p className="text-[13px] leading-relaxed opacity-75 md:text-sm">
              Eleven kilometres below the last reach of sunlight lies the
              largest landscape on Earth — and the least seen. We built a
              vessel to visit it. This is the dive plan, in real depth.
            </p>
          </Fade>
        </div>

        {/* meta + cue */}
        <div className="flex items-end justify-between gap-6">
          <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 md:max-w-3xl md:grid-cols-4">
            {META.map(([k, v], i) => (
              <Fade key={k} delay={950 + i * 90}>
                <div className="border-t border-[#0b2530]/25 pt-2.5">
                  <p className="font-mono text-[8px] tracking-[0.3em] opacity-55">{k}</p>
                  <p className="tnum mt-1 font-mono text-[11px] tracking-[0.12em]">{v}</p>
                </div>
              </Fade>
            ))}
          </div>
          <Fade delay={1200} className="hidden md:block">
            <div className="flex flex-col items-center gap-3" aria-hidden>
              <span className="font-mono text-[8px] tracking-[0.4em] [writing-mode:vertical-rl]">
                SCROLL TO DESCEND
              </span>
              <span className="relative h-16 w-px overflow-hidden bg-[#0b2530]/15">
                <span className="cue-line absolute inset-0 bg-[#0b2530]/80" />
              </span>
            </div>
          </Fade>
        </div>
      </div>
    </Section>
  );
}
