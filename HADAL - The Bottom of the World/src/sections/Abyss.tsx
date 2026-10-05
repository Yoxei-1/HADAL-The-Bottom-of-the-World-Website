import { Section } from "../components/Section";
import { ZoneTag } from "../components/ZoneTag";
import { Lines, Fade } from "../components/TextStagger";
import { DIVE_LOG } from "../data/zones";

/** IV — ABYSS. The unmapped continent, and the reason the vessel exists. */
export function Abyss() {
  return (
    <Section id="abyss" start={4000} end={6400} className="min-h-[150svh] text-[#e9f1ee]">
      <div className="px-5 pt-[16vh] md:px-8">
        <ZoneTag numeral="IV" name="ABYSS" range="4,000 — 6,000 M" />

        <p
          aria-hidden
          className="drift-y pointer-events-none absolute right-2 top-[30vh] select-none font-black uppercase leading-none tracking-tight text-outline-faint [writing-mode:vertical-rl] text-[clamp(5rem,14vw,12rem)] md:right-6"
        >
          ABYSSAL
        </p>

        <div className="mt-[12vh] grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <Lines
              className="display-wide font-black uppercase leading-[0.94] tracking-[-0.02em]"
              lineClass="text-[clamp(2.2rem,6.6vw,5.6rem)]"
              lines={[
                <>WE HAVE BETTER</>,
                <>
                  <span className="font-serif font-normal normal-case italic tracking-normal">
                    maps of Mars.
                  </span>
                </>,
              ]}
            />
            <Fade delay={350} className="mt-8 max-w-md">
              <p className="text-[13px] leading-relaxed text-white/70 md:text-sm">
                More than eighty percent of the seafloor has never been mapped
                at useful resolution. The abyssal plain alone covers more area
                than every continent combined — and the total of human time
                spent on its floor would fit inside one long weekend. What
                follows is the machine we built for the remaining hours.
              </p>
            </Fade>

            <div className="mt-[9vh] flex flex-col">
              {[
                ["OCEAN FLOOR UNMAPPED", "> 80%"],
                ["PRESSURE AT 5,000 M", "501 BAR"],
                ["TEMPERATURE", "2.3°C"],
              ].map(([k, v], i) => (
                <Fade key={k} delay={i * 120}>
                  <div className="flex items-baseline justify-between gap-6 border-t border-white/15 py-4 font-mono text-[9px] tracking-[0.25em]">
                    <span className="text-white/45">{k}</span>
                    <span className="tnum text-white/90">{v}</span>
                  </div>
                </Fade>
              ))}
            </div>
          </div>

          {/* dive log */}
          <Fade delay={200} className="md:col-span-4 md:col-start-9 md:mt-[10vh]">
            <div className="border border-white/12">
              <div className="flex items-center justify-between border-b border-white/12 px-4 py-3">
                <span className="font-mono text-[9px] tracking-[0.28em] text-white/70">
                  DIVE LOG 07 — EXCERPT
                </span>
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute h-full w-full animate-ping rounded-full bg-[#8deaff] opacity-60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8deaff]" />
                </span>
              </div>
              <div className="flex flex-col">
                {DIVE_LOG.map(([time, entry], i) => (
                  <Fade key={time} delay={300 + i * 140} y={12}>
                    <div className="flex gap-4 border-b border-white/8 px-4 py-3.5 last:border-b-0">
                      <span className="tnum font-mono text-[9px] tracking-[0.15em] text-[#8deaff]/80">
                        {time}
                      </span>
                      <span className="font-mono text-[9px] leading-relaxed tracking-[0.12em] text-white/55">
                        {entry}
                      </span>
                    </div>
                  </Fade>
                ))}
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </Section>
  );
}
