import { Section } from "../components/Section";
import { ZoneTag } from "../components/ZoneTag";
import { Lines, Fade } from "../components/TextStagger";

/** 1,000 M — marine snow. The deep runs on leftovers. */
export function Twilight() {
  return (
    <Section id="twilight" start={200} end={1000} className="min-h-[150svh] text-[#e9f1ee]">
      <div className="px-5 pt-[14vh] md:px-8">
        <ZoneTag numeral="II" name="TWILIGHT" range="200 — 1,000 M" />

        <p
          aria-hidden
          className="drift-y pointer-events-none absolute left-2 top-[20vh] select-none font-black uppercase leading-none tracking-tight text-outline-faint [writing-mode:vertical-rl] text-[clamp(5rem,14vw,12rem)] md:left-6"
        >
          MESOPELAGIC
        </p>

        <div className="ml-auto mt-[12vh] grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-8 md:col-start-5">
            <Lines
              className="display-wide font-black uppercase leading-[0.94] tracking-[-0.02em]"
              lineClass="text-[clamp(2.1rem,6.4vw,5.4rem)]"
              lines={[
                <>IT SNOWS HERE.</>,
                <>
                  <span className="font-serif font-normal normal-case italic tracking-normal">
                    Not water — memory.
                  </span>
                </>,
              ]}
            />
            <Fade delay={350} className="mt-8 max-w-md">
              <p className="text-[13px] leading-relaxed text-white/70 md:text-sm">
                Everything the sunlit ocean has ever eaten, shed or finished
                slowly drifts downward — a patient blizzard of the dead and the
                discarded. A single flake can take weeks to fall a kilometre.
                It feeds almost everything below this line. The deep runs on
                leftovers.
              </p>
            </Fade>

            <div className="mt-[9vh] flex flex-col">
              {[
                ["MARINE SNOW — FALL RATE", "± 30 M / DAY"],
                ["EST. TWILIGHT BIOMASS", "10 BILLION TONNES"],
                ["WHAT IT FEEDS", "EVERYTHING BELOW"],
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
        </div>

        <Fade className="mt-[14vh] pb-[8vh]">
          <p className="max-w-[16rem] font-mono text-[8px] leading-relaxed tracking-[0.3em] text-white/35">
            WATCH THE SNOW THICKEN AS YOU FALL — IT NEVER STOPS, IT ONLY
            CHANGES HANDS
          </p>
        </Fade>
      </div>
    </Section>
  );
}
