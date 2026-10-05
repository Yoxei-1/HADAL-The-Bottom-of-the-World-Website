import type { CSSProperties, ReactNode } from "react";
import { useInView } from "../hooks/useInView";
import { cn } from "../utils/cn";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Lines of copy that rise out of clipped masks. */
export function Lines({
  lines,
  className,
  lineClass,
  base = 0,
  step = 95,
  started = true,
  threshold = 0.35,
}: {
  lines: ReactNode[];
  className?: string;
  lineClass?: string;
  base?: number;
  step?: number;
  started?: boolean;
  threshold?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(threshold);
  const active = inView && started;
  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.09em] -mb-[0.09em]">
          <span
            className={cn("block will-change-transform", lineClass)}
            style={{
              transform: active ? "translateY(0%)" : "translateY(112%)",
              transition: `transform 1150ms ${EASE} ${base + i * step}ms`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </div>
  );
}

/** Word-by-word cascade for the serif manifesto moments. */
export function Words({
  text,
  className,
  base = 0,
  step = 55,
  started = true,
}: {
  text: string;
  className?: string;
  base?: number;
  step?: number;
  started?: boolean;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const active = inView && started;
  const words = text.split(" ");
  return (
    <span ref={ref} className={cn("flex flex-wrap gap-x-[0.26em]", className)}>
      {words.map((w, i) => (
        <span key={i} className="overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <span
            className="inline-block will-change-transform"
            style={{
              transform: active ? "translateY(0%)" : "translateY(110%)",
              transition: `transform 1000ms ${EASE} ${base + i * step}ms`,
            }}
          >
            {w}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Simple soft entrance. */
export function Fade({
  children,
  className,
  delay = 0,
  y = 26,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const style: CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : `translateY(${y}px)`,
    transition: `opacity 1000ms ${EASE} ${delay}ms, transform 1000ms ${EASE} ${delay}ms`,
  };
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
