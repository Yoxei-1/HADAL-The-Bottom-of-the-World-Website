import { useEffect, useRef, useState } from "react";
import { useEngine } from "../core/engine";
import { cn } from "../utils/cn";

type Variant = "default" | "link" | "sonar";

/** Precision-pointer cursor: a dot, a trailing ring, sonar ticks in the dark. */
export function Cursor() {
  const { pointer, subscribe, fine } = useEngine();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringPos = useRef({ x: 0, y: 0 });
  const [variant, setVariant] = useState<Variant>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine) return;
    const over = (e: MouseEvent) => {
      const t = e.target as Element | null;
      const hit = t?.closest?.("[data-cursor]");
      setVariant((hit?.getAttribute("data-cursor") as Variant) || "default");
    };
    window.addEventListener("mouseover", over, { passive: true });
    return () => window.removeEventListener("mouseover", over);
  }, [fine]);

  useEffect(() => {
    if (!fine) return;
    return subscribe((dt) => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) return;
      if (!visible && pointer.active.current) setVisible(true);

      dot.style.transform = `translate3d(${pointer.xs.current}px, ${pointer.ys.current}px, 0) translate(-50%, -50%)`;

      const k = 1 - Math.exp((-dt / 1000) * 12);
      ringPos.current.x += (pointer.x.current - ringPos.current.x) * k;
      ringPos.current.y += (pointer.y.current - ringPos.current.y) * k;
      ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
    });
  }, [fine, subscribe, pointer, visible]);

  if (!fine) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[110] mix-blend-difference transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* dot */}
      <div
        ref={dotRef}
        className={cn(
          "absolute h-[5px] w-[5px] rounded-full bg-white transition-opacity duration-300",
          variant === "sonar" && "opacity-70"
        )}
      />
      {/* ring */}
      <div
        ref={ringRef}
        className={cn(
          "absolute rounded-full border border-white/70 transition-[width,height,opacity] duration-300 ease-out",
          variant === "link" && "h-14 w-14",
          variant === "default" && "h-9 w-9",
          variant === "sonar" && "h-16 w-16 border-white/50"
        )}
      >
        {/* sonar ticks */}
        {(["0deg", "90deg", "180deg", "270deg"] as const).map((deg) => (
          <span
            key={deg}
            className={cn(
              "absolute left-1/2 top-1/2 h-[7px] w-px bg-white/80 transition-opacity duration-300",
              variant === "sonar" ? "opacity-100" : "opacity-0"
            )}
            style={{
              transform: `translate(-50%, -50%) rotate(${deg}) translateY(-14px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
