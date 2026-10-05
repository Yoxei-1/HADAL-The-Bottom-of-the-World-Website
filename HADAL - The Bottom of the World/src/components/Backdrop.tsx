import { useEffect, useRef } from "react";
import { useEngine } from "../core/engine";
import { colorAtDepth } from "../lib/color";
import { MAX_DEPTH } from "../data/zones";

/** The ocean itself: colour, light rays and vignette, all driven by depth. */
export function Backdrop() {
  const { depth, subscribe } = useEngine();
  const colorRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const vigRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribe(() => {
      const d = depth.current;

      const color = colorAtDepth(d);
      if (colorRef.current) colorRef.current.style.background = color;

      if (raysRef.current) {
        const o = Math.max(0, 1 - d / 820);
        raysRef.current.style.opacity = (o * 0.65).toFixed(3);
      }
      if (vigRef.current) {
        vigRef.current.style.opacity = (0.22 + (d / MAX_DEPTH) * 0.5).toFixed(3);
      }
      if (glowRef.current) {
        const g = Math.max(0, Math.min(1, (d - 5600) / 4200));
        glowRef.current.style.opacity = (g * 0.5).toFixed(3);
      }
    });
  }, [subscribe, depth]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {/* the water */}
      <div ref={colorRef} className="absolute inset-0" style={{ background: "#e7eeeb" }} />

      {/* sunlight shafts near the surface */}
      <div ref={raysRef} className="absolute inset-0 overflow-hidden">
        <div
          className="rays-sway absolute -top-[12%] left-1/2 h-[80vh] w-[130vw] -translate-x-1/2"
          style={{
            background:
              "linear-gradient(100deg, transparent 8%, rgba(255,255,255,0.5) 15%, transparent 22%, transparent 34%, rgba(255,255,255,0.38) 41%, transparent 49%, transparent 60%, rgba(255,255,255,0.3) 66%, transparent 74%, transparent 84%, rgba(255,255,255,0.42) 90%, transparent 96%)",
            filter: "blur(6px)",
          }}
        />
      </div>

      {/* hydrothermal glow rising from the trench floor */}
      <div
        ref={glowRef}
        className="absolute inset-x-0 bottom-0 h-[75vh] opacity-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 108%, rgba(74, 208, 235, 0.32) 0%, rgba(20, 90, 110, 0.12) 45%, transparent 72%)",
        }}
      />

      {/* vignette that tightens with depth */}
      <div
        ref={vigRef}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 105% 90% at 50% 45%, transparent 55%, rgba(0, 3, 8, 0.9) 100%)",
        }}
      />
    </div>
  );
}
