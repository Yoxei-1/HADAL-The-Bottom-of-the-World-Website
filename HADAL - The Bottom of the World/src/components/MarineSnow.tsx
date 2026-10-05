import { useEffect, useRef } from "react";
import { useEngine } from "../core/engine";

type Flake = {
  x: number;
  y: number;
  r: number;
  vy: number;
  phase: number;
  freq: number;
  alpha: number;
  cyan: boolean;
};

/** Marine snow — always falling, denser the deeper you go. */
export function MarineSnow() {
  const { depth, subscribe, reduced } = useEngine();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flakes = useRef<Flake[]>([]);
  const size = useRef({ w: 0, h: 0, dpr: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      size.current = { w, h, dpr };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(170, Math.floor((w * h) / 11000));
      flakes.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.5,
        vy: 0.12 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        freq: 0.4 + Math.random() * 0.8,
        alpha: 0.15 + Math.random() * 0.4,
        cyan: Math.random() < 0.18,
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    if (reduced) {
      /* one quiet static frame */
      const { w, h } = size.current;
      ctx.clearRect(0, 0, w, h);
      flakes.current.forEach((f) => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = f.cyan
          ? `rgba(141,234,255,${f.alpha * 0.5})`
          : `rgba(224,238,240,${f.alpha * 0.5})`;
        ctx.fill();
      });
      return;
    }

    return subscribe((dt, t) => {
      const { w, h } = size.current;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);

      const d = depth.current;
      const fullness = 0.12 + Math.min(1, d / 3200) * 1.05;
      const limit = Math.floor(flakes.current.length * Math.min(1, fullness));
      const step = dt / 16.7;

      for (let i = 0; i < limit; i++) {
        const f = flakes.current[i];
        f.y += f.vy * step * (1 + Math.min(1, d / 5000) * 0.6);
        f.x += Math.sin(t * f.freq + f.phase) * 0.28 * step;
        if (f.y > h + 4) {
          f.y = -4;
          f.x = Math.random() * w;
        }
        const twinkle = 0.75 + 0.25 * Math.sin(t * 2 * f.freq + f.phase);
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = f.cyan
          ? `rgba(141,234,255,${(f.alpha * twinkle).toFixed(3)})`
          : `rgba(224,238,240,${(f.alpha * 0.8 * twinkle).toFixed(3)})`;
        ctx.fill();
      }
    });
  }, [subscribe, depth, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[3]"
    />
  );
}
