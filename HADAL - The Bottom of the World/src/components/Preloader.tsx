import { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

const LOG = [
  "PRESSURE HULL — NOMINAL",
  "BALLAST TANKS — BLOWN",
  "BEACON LOCK — 11°22.4′N 142°35.5′E",
  "COMMENCING DESCENT",
];

/** Pre-dive checks. Lifts when the vessel is ready. */
export function Preloader({ onReady }: { onReady: () => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    let raf = 0;
    let fontsDone = false;
    const start = performance.now();
    const MIN = 2300;

    Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) => setTimeout(r, 2600)),
    ]).then(() => {
      fontsDone = true;
    });

    const tick = (now: number) => {
      const timed = Math.min(1, (now - start) / MIN);
      const target = fontsDone ? timed : Math.min(timed, 0.88);
      setProgress((p) => {
        const next = p + (target - p) * 0.12;
        return next > 0.995 && fontsDone ? 1 : next;
      });
      if (timed >= 1 && fontsDone) {
        setProgress(1);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (progress < 1) return;
    const t1 = window.setTimeout(() => {
      setLeaving(true);
      readyRef.current();
    }, 350);
    const t2 = window.setTimeout(() => setGone(true), 1350);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [progress]);

  if (gone) return null;

  const pct = Math.round(progress * 100);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[120] flex flex-col justify-between bg-[#010409] p-5 transition-transform duration-[950ms] ease-[cubic-bezier(0.76,0,0.24,1)] md:p-8",
        leaving && "-translate-y-full"
      )}
      aria-hidden={leaving}
    >
      <div className="flex items-start justify-between font-mono text-[9px] tracking-[0.3em] text-white/50">
        <span className="text-sm font-black tracking-tight text-white" style={{ fontFamily: "var(--font-sans)" }}>
          HADAL
        </span>
        <span>PRE-DIVE CHECK</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {LOG.map((line, i) => {
          const on = progress > 0.18 + i * 0.22;
          return (
            <span
              key={line}
              className={cn(
                "flex items-center gap-3 font-mono text-[9px] tracking-[0.28em] transition-all duration-500",
                on ? "translate-x-0 text-white/85 opacity-100" : "translate-x-3 text-white/85 opacity-0"
              )}
            >
              <span
                className={cn(
                  "h-1 w-1 rounded-full transition-colors duration-300",
                  on ? "bg-[#8deaff]" : "bg-white/20"
                )}
              />
              {line}
            </span>
          );
        })}
      </div>

      <div>
        <div className="flex items-end justify-between">
          <span className="font-mono text-[9px] tracking-[0.3em] text-white/40">
            SURFACE — 0 M
          </span>
          <span className="tnum font-mono text-5xl font-light text-white md:text-7xl">
            {String(pct).padStart(3, "0")}
          </span>
        </div>
        <div className="mt-4 h-px w-full bg-white/15">
          <div
            className="h-px bg-[#8deaff] transition-[width] duration-150 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
