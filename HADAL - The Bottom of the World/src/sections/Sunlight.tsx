import { useEffect, useRef } from "react";
import { Section } from "../components/Section";
import { ZoneTag } from "../components/ZoneTag";
import { Lines, Fade } from "../components/TextStagger";
import { useEngine } from "../core/engine";

const INK: [number, number, number] = [11, 37, 48];
const PALE: [number, number, number] = [233, 241, 238];

/** 200 M — the last chapter written in ink. Text colour dies with the light. */
export function Sunlight() {
  const { subscribe, depth } = useEngine();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = "";
    return subscribe(() => {
      const el = wrapRef.current;
      if (!el) return;
      const t = Math.max(0, Math.min(1, (depth.current - 70) / 115));
      const e = t * t * (3 - 2 * t);
      const r = Math.round(INK[0] + (PALE[0] - INK[0]) * e);
      const g = Math.round(INK[1] + (PALE[1] - INK[1]) * e);
      const b = Math.round(INK[2] + (PALE[2] - INK[2]) * e);
      const v = `rgb(${r},${g},${b})`;
      if (v !== last) {
        last = v;
        el.style.color = v;
      }
    });
  }, [subscribe, depth]);

  return (
    <Section id="sunlight" start={25} end={200} className="min-h-[160svh]">
      <div ref={wrapRef} className="px-5 pt-[14vh] md:px-8" style={{ color: "#0b2530" }}>
        <ZoneTag numeral="I" name="SUNLIGHT" range="0 — 200 M" />

        <p
          aria-hidden
          className="drift-y pointer-events-none absolute right-2 top-[6vh] select-none font-black uppercase leading-none tracking-tight text-outline-faint [writing-mode:vertical-rl] text-[clamp(5rem,14vw,12rem)] md:right-6"
        >
          EPIPELAGIC
        </p>

        <div className="mt-[10vh] grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-7">
            <Lines
              className="display-wide font-black uppercase leading-[0.94] tracking-[-0.02em]"
              lineClass="text-[clamp(2.1rem,6vw,5.2rem)]"
              lines={[
                <>EVERY COLOUR YOU KNOW</>,
                <>
                  <span className="font-serif font-normal normal-case italic tracking-normal">
                    is a surface invention.
                  </span>
                </>,
              ]}
            />
            <Fade delay={350} className="mt-8 max-w-md">
              <p className="text-[13px] leading-relaxed opacity-80 md:text-sm">
                Red dies at five metres. Orange at ten. Yellow gives up around
                forty. By two hundred, even blue has thinned to a rumour. The
                ocean doesn&apos;t get darker down there — colour itself is a
                shallow-water thing, and we are about to leave it behind.
              </p>
            </Fade>
          </div>

          <Fade delay={250} className="md:col-span-4 md:col-start-9 md:mt-[14vh]">
            <figure>
              <div className="mask-fade-b overflow-hidden">
                <img
                  src="/images/caustics.jpg"
                  alt="Sunlight caustics rippling across a shallow seabed"
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 flex justify-between font-mono text-[8px] tracking-[0.28em] opacity-60">
                <span>LIGHT PATTERN NO. 4</span>
                <span className="tnum">12 M</span>
              </figcaption>
            </figure>
          </Fade>
        </div>

        <div className="mt-[12vh] grid grid-cols-1 gap-px md:grid-cols-2">
          {[
            ["LIGHT AT 200 M", "0.6% OF SURFACE"],
            ["COLOURS REMAINING", "ONE — BLUE, BARELY"],
          ].map(([k, v], i) => (
            <Fade key={k} delay={i * 120}>
              <div
                className="flex items-baseline justify-between gap-6 border-t py-4 font-mono text-[9px] tracking-[0.25em]"
                style={{ borderColor: "color-mix(in srgb, currentColor 20%, transparent)" }}
              >
                <span className="opacity-55">{k}</span>
                <span className="tnum">{v}</span>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </Section>
  );
}
