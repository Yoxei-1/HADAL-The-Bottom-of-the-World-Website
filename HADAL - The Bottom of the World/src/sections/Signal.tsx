import { Section } from "../components/Section";
import { Words } from "../components/TextStagger";

/** 10,911 M — the floor. The revelation, told quietly. */
export function Signal() {
  return (
    <Section id="signal" start={10300} end={10911} className="text-[#e9f1ee]">
      <div className="relative grid min-h-[110svh] place-items-center overflow-hidden px-5">
        {/* the pulse that found us */}
        <div aria-hidden className="absolute left-1/2 top-1/2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="signal-ring absolute left-1/2 top-1/2 h-[85vmin] w-[85vmin] rounded-full border border-[#8deaff]/15"
              style={{ animationDelay: `${i * 1.7}s` }}
            />
          ))}
        </div>

        <div className="relative flex max-w-4xl flex-col items-center gap-8 text-center">
          <span className="tnum font-mono text-[9px] tracking-[0.4em] text-[#8deaff]/70">
            LAST SIGNAL RECEIVED — 10,911 M
          </span>

          <h2 className="font-serif text-[clamp(1.8rem,5.4vw,4.3rem)] italic leading-[1.15] text-white/90">
            <Words text="We went looking for the bottom of the world." />
          </h2>
          <h2 className="font-serif text-[clamp(1.8rem,5.4vw,4.3rem)] italic leading-[1.15] text-[#8deaff]">
            <Words text="We found the top of something else." base={400} />
          </h2>

          <span className="mt-4 flex items-center gap-3 font-mono text-[8px] tracking-[0.35em] text-white/40">
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute h-full w-full animate-ping rounded-full bg-[#8deaff] opacity-70" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#8deaff]" />
            </span>
            ALL SYSTEMS NOMINAL — CREW AT REST
          </span>
        </div>
      </div>
    </Section>
  );
}
