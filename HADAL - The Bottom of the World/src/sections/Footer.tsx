import { ArrowUp } from "lucide-react";
import { Section } from "../components/Section";
import { Magnetic } from "../components/Magnetic";
import { Fade } from "../components/TextStagger";
import { scrollToY, scrollToSection } from "../lib/scroll";
import { NAV_ITEMS, COORDS } from "../data/zones";

/** The way back. Resurface. */
export function Footer() {
  return (
    <Section id="footer" start={10911} end={10911} className="text-[#e9f1ee]">
      <div className="flex min-h-[92svh] flex-col justify-between border-t border-white/10 px-5 pb-6 pt-[10vh] md:px-8">
        {/* resurface */}
        <Fade className="flex flex-col items-center gap-6 text-center">
          <span className="tnum font-mono text-[9px] tracking-[0.35em] text-white/40">
            DIVE COMPLETE — 10,911 M
          </span>
          <Magnetic strength={0.35}>
            <button
              type="button"
              data-cursor="link"
              onClick={() => scrollToY(0, 2600)}
              aria-label="Resurface — return to the top"
              className="group flex h-36 w-36 flex-col items-center justify-center gap-2.5 rounded-full border border-white/25 transition-colors duration-500 hover:border-[#e9f1ee] hover:bg-[#e9f1ee] hover:text-[#010409] md:h-44 md:w-44"
            >
              <ArrowUp
                size={17}
                className="transition-transform duration-500 group-hover:-translate-y-1"
                aria-hidden
              />
              <span className="font-mono text-[9px] tracking-[0.35em]">RESURFACE</span>
            </button>
          </Magnetic>
          <span className="max-w-[17rem] font-mono text-[8px] leading-relaxed tracking-[0.28em] text-white/35">
            ASCENT IS SLOWER THAN THE FALL. DECOMPRESSION IS NOT OPTIONAL.
          </span>
        </Fade>

        {/* index */}
        <div className="mt-[10vh] grid grid-cols-1 gap-10 md:grid-cols-12">
          <Fade className="md:col-span-5">
            <p className="font-mono text-[9px] leading-loose tracking-[0.22em] text-white/50">
              HADAL IS A FICTIONAL EXPEDITION.
              <br />
              THE DEPTHS, PRESSURES, TEMPERATURES
              <br />
              AND CREATURES ARE REAL.
            </p>
          </Fade>

          <Fade delay={120} className="md:col-span-4">
            <nav aria-label="Footer" className="flex flex-col gap-2.5">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-cursor="link"
                  onClick={() => scrollToSection(item.id, 1800)}
                  className="group flex w-max items-baseline gap-3 text-left font-mono text-[9px] tracking-[0.28em] text-white/55 transition-colors hover:text-[#8deaff]"
                >
                  <span className="text-white/25">{item.numeral}</span>
                  <span>{item.label}</span>
                  <span className="tnum text-white/25 group-hover:text-[#8deaff]/50">
                    {item.depth}
                  </span>
                </button>
              ))}
            </nav>
          </Fade>

          <Fade delay={220} className="md:col-span-3">
            <p className="font-mono text-[9px] leading-loose tracking-[0.22em] text-white/50 md:text-right">
              {COORDS}
              <br />
              VESSEL — HADAL ONE
              <br />
              STATUS — ON THE FLOOR
            </p>
          </Fade>
        </div>

        {/* ghost + legal */}
        <div className="mt-[8vh]">
          <p
            aria-hidden
            className="display-wide select-none text-center font-black uppercase leading-[0.78] tracking-[-0.02em] text-outline-faint text-[clamp(4rem,19vw,17rem)]"
          >
            HADAL
          </p>
          <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-5 font-mono text-[8px] tracking-[0.28em] text-white/30 md:flex-row">
            <span>© 2026 HADAL PROGRAM — A CONCEPT STUDY</span>
            <span>DESIGNED FOR DESCENT // BUILT FOR THE CURIOUS</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
