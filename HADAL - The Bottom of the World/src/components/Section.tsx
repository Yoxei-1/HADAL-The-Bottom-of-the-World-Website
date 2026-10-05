import { useEffect, useRef, type ReactNode } from "react";
import { useEngine } from "../core/engine";
import { cn } from "../utils/cn";

/** A chapter of the descent. Registers its depth range with the engine. */
export function Section({
  id,
  start,
  end,
  className,
  children,
}: {
  id: string;
  start: number;
  end: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { register } = useEngine();

  useEffect(() => {
    if (!ref.current) return;
    return register(ref.current, start, end);
  }, [register, start, end]);

  return (
    <section ref={ref} data-section={id} className={cn("relative", className)}>
      {children}
    </section>
  );
}
