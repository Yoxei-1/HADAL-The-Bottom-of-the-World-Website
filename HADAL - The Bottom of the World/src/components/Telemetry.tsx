import { useEffect, useRef } from "react";
import { useEngine } from "../core/engine";
import { scalarAtDepth } from "../lib/color";

const TEMP_STOPS: [number, number][] = [
  [0, 21.2],
  [200, 13.6],
  [1000, 4.2],
  [4000, 2.3],
  [10911, 2.1],
];

/** Live instrument readout: depth, pressure, temperature, sunlight. */
export function Telemetry() {
  const { depth, subscribe } = useEngine();
  const refs = {
    dep: useRef<HTMLSpanElement>(null),
    prs: useRef<HTMLSpanElement>(null),
    tmp: useRef<HTMLSpanElement>(null),
    lgt: useRef<HTMLSpanElement>(null),
  };

  useEffect(() => {
    const last = { dep: "", prs: "", tmp: "", lgt: "" };
    const set = (key: keyof typeof last, v: string) => {
      const el = refs[key].current;
      if (el && last[key] !== v) {
        last[key] = v;
        el.textContent = v;
      }
    };
    return subscribe(() => {
      const d = depth.current;
      set("dep", `${Math.round(d).toLocaleString("en-US")} M`);
      set("prs", `${Math.round(1 + d / 10).toLocaleString("en-US")} BAR`);
      set("tmp", `${scalarAtDepth(TEMP_STOPS, d).toFixed(1)}°C`);
      if (d >= 1000) set("lgt", "ABSENT");
      else set("lgt", `${(100 * Math.pow(10, -d / 90)).toFixed(2)}%`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe, depth]);

  return (
    <div className="pointer-events-none fixed bottom-6 left-7 z-40 hidden mix-blend-difference lg:block">
      <div className="flex flex-col gap-1.5 font-mono text-[9px] tracking-[0.22em] text-white">
        {(
          [
            ["DEPTH", refs.dep],
            ["PRESSURE", refs.prs],
            ["TEMP", refs.tmp],
            ["SUNLIGHT", refs.lgt],
          ] as const
        ).map(([label, ref]) => (
          <div key={label} className="flex gap-5">
            <span className="w-20 opacity-45">{label}</span>
            <span ref={ref} className="tnum w-32 opacity-90">
              —
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
