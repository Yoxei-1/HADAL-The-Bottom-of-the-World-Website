import { useEffect, useRef, type ReactNode } from "react";
import { useEngine } from "../core/engine";

/** Wraps a control and pulls it gently toward the pointer. Touch-safe. */
export function Magnetic({
  children,
  strength = 0.32,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);
  const { subscribe, fine, reduced } = useEngine();

  useEffect(() => {
    if (!fine || reduced) return;
    return subscribe((dt) => {
      const el = ref.current;
      if (!el) return;
      const k = 1 - Math.exp((-dt / 1000) * 10);
      current.current.x += (target.current.x - current.current.x) * k;
      current.current.y += (target.current.y - current.current.y) * k;
      el.style.transform = `translate3d(${current.current.x.toFixed(2)}px, ${current.current.y.toFixed(2)}px, 0)`;
    });
  }, [subscribe, fine, reduced]);

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(e) => {
        if (!fine || reduced || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        hovering.current = true;
        target.current.x = (e.clientX - (r.left + r.width / 2)) * strength;
        target.current.y = (e.clientY - (r.top + r.height / 2)) * strength;
      }}
      onPointerLeave={() => {
        if (!hovering.current) return;
        hovering.current = false;
        target.current.x = 0;
        target.current.y = 0;
      }}
    >
      {children}
    </div>
  );
}
