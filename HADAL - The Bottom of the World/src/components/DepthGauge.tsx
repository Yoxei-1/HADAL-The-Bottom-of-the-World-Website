import { useEffect, useRef } from "react";
import { useEngine } from "../core/engine";
import { ZONES, MAX_DEPTH } from "../data/zones";
import { scrollToSection } from "../lib/scroll";

function zoneName(d: number): string {
  for (const z of ZONES) {
    if (d >= z.start && d < z.end) return z.name;
  }
  return "HADAL";
}

/** The navigation is a depth gauge: your scroll, in metres. */
export function DepthGauge() {
  const { depth, subscribe } = useEngine();
  const markerRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const zoneRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let lastNum = "";
    let lastZone = "";
    return subscribe(() => {
      const d = depth.current;
      if (markerRef.current) {
        const p = Math.sqrt(Math.min(1, Math.max(0, d / MAX_DEPTH)));
        markerRef.current.style.top = `${(p * 100).toFixed(3)}%`;
      }
      const n = Math.round(d).toLocaleString("en-US");
      if (numRef.current && n !== lastNum) {
        lastNum = n;
        numRef.current.textContent = n;
      }
      const z = zoneName(d);
      if (zoneRef.current && z !== lastZone) {
        lastZone = z;
        zoneRef.current.textContent = z;
      }
    });
  }, [subscribe, depth]);

  return (
    <div className="pointer-events-none fixed right-7 top-1/2 z-40 hidden -translate-y-1/2 mix-blend-difference lg:block">
      <div className="pointer-events-auto flex flex-col items-end gap-3 text-white">
        <span
          ref={zoneRef}
          className="font-mono text-[8px] tracking-[0.4em] opacity-60"
        >
          SURFACE
        </span>

        <div className="flex items-center gap-3">
          {/* readout */}
          <div className="flex flex-col items-end leading-none">
            <span
              ref={numRef}
              className="tnum font-mono text-[15px] tracking-[0.08em]"
            >
              0
            </span>
            <span className="mt-1 font-mono text-[7px] tracking-[0.35em] opacity-50">
              METRES
            </span>
          </div>

          {/* track */}
          <div className="relative h-[34vh] w-px bg-white/25">
            <div
              ref={markerRef}
              className="absolute left-0 top-0 will-change-transform"
            >
              <span className="absolute -left-[3px] -top-[3px] h-[7px] w-[7px] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
              <span className="absolute -left-4 top-0 h-px w-3 -translate-y-1/2 bg-white/70" />
            </div>

            {ZONES.map((z) => {
              if (z.tickDepth === 0) return null;
              const p = Math.sqrt(z.tickDepth / MAX_DEPTH) * 100;
              return (
                <button
                  key={z.id}
                  type="button"
                  data-cursor="link"
                  onClick={() => scrollToSection(z.id, 1800)}
                  aria-label={`Dive to ${z.name.toLowerCase()} — ${z.tickDepth.toLocaleString("en-US")} metres`}
                  className="group absolute left-0 -translate-y-1/2"
                  style={{ top: `${p}%` }}
                >
                  <span className="absolute -left-3 -top-2.5 h-5 w-8 bg-transparent" />
                  <span className="block h-px w-2.5 origin-left bg-white/50 transition-all duration-300 group-hover:w-4 group-hover:bg-white" />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[8px] tracking-[0.3em] opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-80">
                    {z.name} {z.tickDepth.toLocaleString("en-US")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
